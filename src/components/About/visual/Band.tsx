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
import { useCardBackTexture } from "./useCardBackTexture";
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

// Register MeshLine for R3F
extend({ MeshLineGeometry, MeshLineMaterial });

// Segment physics properties. Light damping (2) gives a smooth, fluid drag and release
// without the rigid sluggishness, while preventing chaotic jittering.
const segmentProps = {
  type: "dynamic" as const,
  canSleep: false,
  angularDamping: 2,
  linearDamping: 2,
};

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

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const j1Lerped = useRef(new THREE.Vector3());
  const j2Lerped = useRef(new THREE.Vector3());

  // Centripetal Catmull-Rom prevents looping overshoots.
  // Initializing with explicitly spaced points completely eliminates WebGL division-by-zero crashes.
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 2, 0),
        new THREE.Vector3(0, 3, 0),
      ],
      false,
      "centripetal",
      0.5
    );
  }, []);

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  const { width, height } = useThree((state) => state.size);
  const cardTexture = useCardTexture();
  const cardBackTexture = useCardBackTexture();
  const lanyardTexture = useLanyardTexture();

  // 3-segment physics rope
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_JOINT_DROP, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useEffect(() => {
    if (j1.current && j2.current) {
      j1Lerped.current.copy(j1.current.translation());
      j2Lerped.current.copy(j2.current.translation());
    }
  }, []);

  useFrame((state, delta) => {
    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current ||
      !band.current?.geometry
    ) {
      return;
    }

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

    // Distance-adaptive lerp for a taut fabric look
    const j1Distance = j1Lerped.current.distanceTo(j1.current.translation());
    const j2Distance = j2Lerped.current.distanceTo(j2.current.translation());
    
    j1Lerped.current.lerp(
      j1.current.translation(),
      delta * (ROPE_LERP_MIN_SPEED + clamp(j1Distance, 0, 1) * (ROPE_LERP_MAX_SPEED - ROPE_LERP_MIN_SPEED))
    );
    j2Lerped.current.lerp(
      j2.current.translation(),
      delta * (ROPE_LERP_MIN_SPEED + clamp(j2Distance, 0, 1) * (ROPE_LERP_MAX_SPEED - ROPE_LERP_MIN_SPEED))
    );

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2Lerped.current);
    curve.points[2].copy(j1Lerped.current);
    curve.points[3].copy(fixed.current.translation());
    
    const bandPoints = curve.getPoints(32);
    
    // Extends the line upwards into the sky so the band never appears detached on mobile screens
    const skyExtension = new THREE.Vector3().copy(fixed.current.translation()).add(new THREE.Vector3(0, 20, 0));
    bandPoints.push(skyExtension);

    band.current.geometry.setPoints(bandPoints);

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
          angularDamping={2}
          linearDamping={2}
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
            <mesh castShadow receiveShadow>
              <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_THICKNESS * 2]} />
              <meshStandardMaterial attach="material-0" color={CARD_COLORS.cardBorder} roughness={0.6} />
              <meshStandardMaterial attach="material-1" color={CARD_COLORS.cardBorder} roughness={0.6} />
              <meshStandardMaterial attach="material-2" color={CARD_COLORS.cardBorder} roughness={0.6} />
              <meshStandardMaterial attach="material-3" color={CARD_COLORS.cardBorder} roughness={0.6} />
              <meshStandardMaterial attach="material-4" map={cardTexture} roughness={0.5} metalness={0.1} />
              <meshStandardMaterial attach="material-5" map={cardBackTexture} roughness={0.5} metalness={0.1} />
            </mesh>

            <group position={[0, CARD_HEIGHT / 2 + 0.05, 0]} renderOrder={1}>
              <mesh position={[0, 0.08, 0]} scale={[2, 0.6, 1]} castShadow>
                <torusGeometry args={[0.035, 0.01, 12, 24]} />
                <meshStandardMaterial color="#C7CCD6" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.045, 0]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.04, 16]} />
                <meshStandardMaterial color="#C7CCD6" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.025, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.015, 0.005, 12, 24]} />
                <meshStandardMaterial color="#C7CCD6" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, -0.03, 0]} rotation={[0, 0, -Math.PI / 2.5]} scale={[1, 1.5, 1]} castShadow>
                <torusGeometry args={[0.04, 0.01, 12, 24, Math.PI * 1.55]} />
                <meshStandardMaterial color="#C7CCD6" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0.035, 0.0, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
                <cylinderGeometry args={[0.005, 0.005, 0.035, 8]} />
                <meshStandardMaterial color="#C7CCD6" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          key={`${width}x${height}`}
          args={[{ resolution: new THREE.Vector2(width, height) }]}
          map={lanyardTexture}
          useMap={1}
          repeat={[LANYARD_REPEAT_TILES, 1]}
          color="#FFFFFF"
          depthTest={true}
          depthWrite={false}
          lineWidth={0.4}
          transparent
          opacity={1}
        />
      </mesh>
    </>
  );
};

export default Band;
