/**
 * Band.tsx
 * =====================================================================
 * The interaction itself — a lanyard-and-card rig built the same way
 * as the Vercel Ship '24 badge: a fixed anchor, a 3-segment rope-joint
 * chain (`useRopeJoint`), and the card hanging off the last segment on
 * a `useSphericalJoint` (so it can swing and spin freely).
 *
 * Interaction summary:
 * - Idle: the anchor sways gently on a sine wave (kinematic, not a
 *   fake CSS animation) so the whole chain floats naturally — real
 *   physics propagates the motion down through the rope to the card.
 * - Drag: pointer-down switches the card to a kinematic body and pins
 *   it to the unprojected pointer position every frame; the rope
 *   joints resist that pull, which is what produces the rubber-band
 *   feel. Pointer-up hands the card back to the dynamic simulation,
 *   so it swings back to center under its own physics (inertia +
 *   damping do the "return to center" for free — no separate spring
 *   animation needed).
 * - The two middle rope joints are additionally smoothed with a
 *   distance-adaptive lerp before feeding the visual curve, which is
 *   what keeps the strap looking like taut fabric instead of a jittery
 *   physics chain during a fast drag.
 * - Every frame, a small angular-velocity correction spins the card
 *   back to face the camera rather than tumbling to show its back.
 * =====================================================================
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { extend, useFrame, useThree } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useCardTexture } from "./useCardTexture";
import { useLanyardTexture } from "./useLanyardTexture";
import {
  CARD_COLORS,
  CARD_HEIGHT,
  CARD_JOINT_DROP,
  CARD_THICKNESS,
  CARD_WIDTH,
  FIXED_ANCHOR_POSITION,
  IDLE_FLOAT_AMPLITUDE,
  IDLE_FLOAT_SPEED,
  LANYARD_REPEAT_TILES,
  ROPE_BALL_RADIUS,
  ROPE_LERP_MAX_SPEED,
  ROPE_LERP_MIN_SPEED,
  ROPE_SEGMENT_LENGTH,
  TILT_BACK_STRENGTH,
} from "./constants";

// Registers <meshLineGeometry> / <meshLineMaterial> as JSX-usable R3F
// elements (see ./meshline.d.ts for the matching type augmentation).
extend({ MeshLineGeometry, MeshLineMaterial });

const segmentProps = {
  type: "dynamic" as const,
  canSleep: false,
  angularDamping: 4,
  linearDamping: 3,
};

/** Clamps a value between min and max. */
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const Band = () => {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  // Scratch vectors reused every frame instead of allocating new ones —
  // keeps this GC-free at 60fps.
  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  // Smoothed (lerped) copies of the two middle joints, used only for
  // the visual curve — the physics bodies themselves stay unsmoothed.
  const j1Lerped = useRef(new THREE.Vector3());
  const j2Lerped = useRef(new THREE.Vector3());

  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  }, []);

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  const { width, height } = useThree((state) => state.size);
  const cardTexture = useCardTexture();
  const lanyardTexture = useLanyardTexture();

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_JOINT_DROP, 0],
  ]);

  // Grab/grabbing cursor feedback, mirroring native drag affordances.
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  // Seed the lerp targets once the bodies exist, so the first frame
  // doesn't lerp from the origin.
  useEffect(() => {
    if (j1.current && j2.current) {
      j1Lerped.current.copy(j1.current.translation());
      j2Lerped.current.copy(j2.current.translation());
    }
  }, []);

  useFrame((state, delta) => {
    // Guard against transient null refs — e.g. the brief window during
    // React StrictMode's mount→unmount→remount cycle in development,
    // or the very first frame before every RigidBody has committed.
    // Dereferencing any of these while null previously threw mid-frame
    // and could take the whole rope render down with it.
    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current ||
      !band.current
    ) {
      return;
    }

    // --- Idle float: sway the anchor itself so real physics carries
    // the motion down the chain — not a faked position offset.
    if (!dragged) {
      const t = state.clock.elapsedTime * IDLE_FLOAT_SPEED;
      fixed.current.setNextKinematicTranslation({
        x: FIXED_ANCHOR_POSITION[0] + Math.sin(t) * IDLE_FLOAT_AMPLITUDE,
        y:
          FIXED_ANCHOR_POSITION[1] +
          Math.sin(t * 1.3) * IDLE_FLOAT_AMPLITUDE * 0.6,
        z: FIXED_ANCHOR_POSITION[2],
      });
    }

    // --- Drag: pin the card to the unprojected pointer position.
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    // --- Lanyard curve: smooth the two middle joints with a
    // distance-adaptive lerp (faster catch-up the further behind they
    // are), then feed all four points into the Catmull-Rom curve that
    // drives the MeshLine geometry.
    const j1Distance = j1Lerped.current.distanceTo(j1.current.translation());
    const j2Distance = j2Lerped.current.distanceTo(j2.current.translation());
    j1Lerped.current.lerp(
      j1.current.translation(),
      delta *
        (ROPE_LERP_MIN_SPEED +
          clamp(j1Distance, 0, 1) * (ROPE_LERP_MAX_SPEED - ROPE_LERP_MIN_SPEED)),
    );
    j2Lerped.current.lerp(
      j2.current.translation(),
      delta *
        (ROPE_LERP_MIN_SPEED +
          clamp(j2Distance, 0, 1) * (ROPE_LERP_MAX_SPEED - ROPE_LERP_MIN_SPEED)),
    );

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2Lerped.current);
    curve.points[2].copy(j1Lerped.current);
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(32));

    // --- Tilt-back: not physically accurate, but keeps the card facing
    // the viewer as it swings instead of flipping to show its back.
    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel(
      { x: ang.x, y: ang.y - rot.y * TILT_BACK_STRENGTH, z: ang.z },
      true,
    );
  });

  const halfWidth = CARD_WIDTH / 2;
  const halfHeight = CARD_HEIGHT / 2;

  return (
    <>
      <group position={FIXED_ANCHOR_POSITION}>
        <RigidBody ref={fixed} type="kinematicPosition" canSleep={false} />
        <RigidBody position={[0, -ROPE_SEGMENT_LENGTH, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[ROPE_BALL_RADIUS]} />
        </RigidBody>
        <RigidBody position={[0, -ROPE_SEGMENT_LENGTH * 2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[ROPE_BALL_RADIUS]} />
        </RigidBody>
        <RigidBody position={[0, -ROPE_SEGMENT_LENGTH * 3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[ROPE_BALL_RADIUS]} />
        </RigidBody>
        <RigidBody
          position={[0, -ROPE_SEGMENT_LENGTH * 3 - CARD_JOINT_DROP, 0]}
          ref={card}
          type={dragged ? "kinematicPosition" : "dynamic"}
          canSleep={false}
          angularDamping={3.2}
          linearDamping={2.2}
        >
          <CuboidCollider args={[halfWidth, halfHeight, CARD_THICKNESS]} />
          <group
            onPointerOver={(e) => {
              e.stopPropagation();
              hover(true);
            }}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              const target = e.target as Element;
              target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              const target = e.target as Element;
              target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation())),
              );
            }}
          >
            {/* Card body — a slim box so it catches light like real card stock. */}
            <mesh castShadow receiveShadow>
              <boxGeometry
                args={[CARD_WIDTH, CARD_HEIGHT, CARD_THICKNESS * 2]}
              />
              {/* +x, -x, +y, -y side faces */}
              <meshStandardMaterial
                attach="material-0"
                color={CARD_COLORS.cardBorder}
                roughness={0.6}
              />
              <meshStandardMaterial
                attach="material-1"
                color={CARD_COLORS.cardBorder}
                roughness={0.6}
              />
              <meshStandardMaterial
                attach="material-2"
                color={CARD_COLORS.cardBorder}
                roughness={0.6}
              />
              <meshStandardMaterial
                attach="material-3"
                color={CARD_COLORS.cardBorder}
                roughness={0.6}
              />
              {/* Front face — the drawn card texture, with a laminate clearcoat.
                  Lower roughness/clearcoatRoughness and metalness keep the
                  surface crisp and glass-like instead of hazy. */}
              <meshPhysicalMaterial
                attach="material-4"
                map={cardTexture}
                roughness={0.12}
                metalness={0.04}
                clearcoat={1}
                clearcoatRoughness={0.04}
                envMapIntensity={1.1}
              />
              {/* Back face */}
              <meshStandardMaterial
                attach="material-5"
                color={CARD_COLORS.background}
                roughness={0.7}
              />
            </mesh>

            {/* Lanyard hook — a single elongated metal loop bridging the
                strap (above) to the card (below). Left at the torus's
                default orientation (hole through Z) so it faces the
                camera directly and always reads clearly as an open
                loop/hook, rather than relying on two separate pieces
                lining up edge-on. Stretched vertically via scale to
                look like a real lanyard clip rather than a plain ring. */}
            <mesh
              position={[0, CARD_JOINT_DROP, 0.015]}
              scale={[0.75, 1.35, 0.75]}
              castShadow
              renderOrder={1}
            >
              <torusGeometry args={[0.09, 0.02, 12, 24]} />
              <meshStandardMaterial
                color="#C7CCD6"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new THREE.Vector2(width, height) }]}
          map={lanyardTexture}
          useMap={1}
          repeat={[LANYARD_REPEAT_TILES, 1]}
          color="#FFFFFF"
          depthTest={true}
          depthWrite={false}
          resolution={[width, height]}
          lineWidth={1}
          transparent
          opacity={1}
        />
      </mesh>
    </>
  );
};

export default Band;
