/**
 * ParticleCanvas.tsx
 * =====================================================================
 * Bridge between React and the particle engine.
 *
 * This component owns NO business logic. It is responsible only for:
 *   - Mounting the Three.js / R3F <Canvas>
 *   - Creating the BufferGeometry (once) from ParticleLayout
 *   - Creating the ShaderMaterial (once) from vertex.glsl / fragment.glsl
 *   - Constructing ParticleEngine + InteractionController (once)
 *   - Driving the per-frame update loop
 *   - Handling resize
 *   - Handling the "isLeaving" dissolve transition
 *   - Disposing every GPU resource and listener on unmount
 *
 * All physics / simulation logic lives in particleEngine.ts.
 * All layout generation lives in particleUtils.ts.
 * All pointer/touch handling lives in interaction.ts.
 *
 * ---------------------------------------------------------------------
 * ASSUMED EXTERNAL CONTRACTS
 * ---------------------------------------------------------------------
 * The four collaborator files were not provided alongside this request,
 * so this component is written against the following inferred public
 * APIs. If your actual implementations differ, adjust the call sites
 * marked with "// CONTRACT:" comments below — the rest of the file
 * (Canvas setup, memoization, cleanup, resize, dissolve) is independent
 * of these exact signatures.
 *
 * particleUtils.ts
 *   export interface ParticleLayout {
 *     count: number;
 *     positions: Float32Array; // length = count * 3
 *     sizes: Float32Array;     // length = count
 *     colors: Float32Array;    // length = count * 3
 *   }
 *   export function generateParticleLayout(count: number): ParticleLayout;
 *
 * interaction.ts
 *   export class InteractionController {
 *     constructor(domElement: HTMLElement, camera: THREE.Camera);
 *     update(): void;
 *     getMouseNDC(): { x: number; y: number };
 *     setCamera(camera: THREE.Camera): void;
 *     dispose(): void;
 *   }
 *
 * particleEngine.ts
 *   export interface ParticleEngineOptions {
 *     layout: ParticleLayout;
 *     geometry: THREE.BufferGeometry;
 *     interaction: InteractionController;
 *   }
 *   export class ParticleEngine {
 *     constructor(options: ParticleEngineOptions);
 *     update(delta: number): void;
 *     triggerDissolve(): void;
 *     isDissolved(): boolean;
 *     dispose(): void;
 *   }
 * =====================================================================
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { generateParticleLayout, type ParticleLayout } from './ParticleUtils';
import { ParticleEngine } from './particleEngine';
import { InteractionController } from './interaction';
import { sampleLogoWithTextShape, type SampledShape } from './Shapesampler';

// Vite raw-string shader imports.
// eslint-disable-next-line import/no-unresolved
import vertexShader from './shaders/vertex.glsl?raw';
// eslint-disable-next-line import/no-unresolved
import fragmentShader from './shaders/fragment.glsl?raw';

// Vite asset import — resolves to a served/bundled URL for the logo SVG.
// eslint-disable-next-line import/no-unresolved
import logoUrl from '../../assets/images/logo.svg';

// -----------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------

/** Default particle count. Bumped up so the shape reads as a dense field of
 *  thousands of individual particles (especially once they scatter across
 *  the screen on hold) while still staying smooth on modern devices. */
const PARTICLE_COUNT = 10000;

/** Base point size (world units) before per-particle aSize / dpr / depth
 *  scaling is applied — matches the `uSize` uniform declared in vertex.glsl. */
const BASE_POINT_SIZE = 46;

/** Seconds for the intro reveal (uProgress: 0 -> 1). */
const REVEAL_DURATION = 1.4;

/** Seconds for the outro dissolve fade (uOpacity: 1 -> 0). */
const DISSOLVE_FADE_DURATION = 1.1;

// -----------------------------------------------------------------------
// Assembled shape: the idle particle cloud starts as a loose scatter
// (the initial ParticleLayout) and, once the logo SVG has been sampled,
// morphs once into the logo + welcome-text shape via the existing
// return-spring (see ParticleEngine.morphTo()). It stays assembled from
// then on — hover repulsion and hold-and-drag both act relative to it.
// -----------------------------------------------------------------------

/** World-space width/height the assembled logo + text shape is fit into
 *  on desktop / wide viewports. Narrower viewports scale this down (see
 *  getResponsiveContentWorldSize) so the shape never overflows the
 *  visible screen — this value is left untouched as the desktop cap. */
const CONTENT_WORLD_SIZE = 4.2;

/** Point-size multiplier for each part of the assembled shape. The logo
 *  trace is deliberately tiny and dense so it reads as a fine outline
 *  rather than blobby dots; the text stays large enough to read. */
const LOGO_PARTICLE_SIZE = 0.16;
const TEXT_PARTICLE_SIZE = 0.46;

/** Fraction of the visible horizontal space the assembled shape is
 *  allowed to fill, leaving breathing room on narrow (phone/tablet)
 *  viewports so nothing touches the screen edges. */
const CONTENT_FIT_MARGIN = 0.86;

/** Never shrink particle point sizes below this fraction of their
 *  desktop value, even if the shape itself scales down a lot — keeps
 *  the logo trace and text legible on very small screens. */
const MIN_PARTICLE_SIZE_SCALE = 0.6;

const WELCOME_TEXT = 'WELCOME TO MY PORTFOLIO';

/**
 * Computes the world-space size the assembled logo + text shape should
 * be sampled at for the current viewport. The camera's fov/z are fixed,
 * so the visible *height* in world units is constant, but the visible
 * *width* shrinks on narrow/portrait viewports. The shape is square, so
 * it's the width that clips first on phones — this scales it down to
 * fit, and simply caps at CONTENT_WORLD_SIZE on wide/desktop viewports
 * (where it already fits comfortably), leaving desktop unchanged.
 */
function getResponsiveContentWorldSize(
  camera: THREE.Camera,
  size: { width: number; height: number },
): number {
  if (!(camera instanceof THREE.PerspectiveCamera)) return CONTENT_WORLD_SIZE;

  const aspect = size.width / Math.max(size.height, 1);
  const distance = camera.position.z;
  const halfHeight = distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  const visibleWidth = halfHeight * aspect * 2;

  return Math.min(CONTENT_WORLD_SIZE, visibleWidth * CONTENT_FIT_MARGIN);
}

// -----------------------------------------------------------------------
// Public props
// -----------------------------------------------------------------------

export interface ParticleCanvasProps {
  isLeaving: boolean;
}

// -----------------------------------------------------------------------
// Uniform bag — a single mutable object so we never allocate a new
// object inside useFrame. Values are written in place every tick.
// -----------------------------------------------------------------------

interface ParticleUniforms {
  [uniform: string]: THREE.IUniform;
  uTime: { value: number };
  uPixelRatio: { value: number };
  uSize: { value: number };
  uOpacity: { value: number };
  uProgress: { value: number };
  uMouse: { value: THREE.Vector2 };
}

function createUniforms(pixelRatio: number): ParticleUniforms {
  return {
    uTime: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uSize: { value: BASE_POINT_SIZE },
    uOpacity: { value: 1 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  };
}

// =========================================================================
// ParticleScene — the actual R3F-context component. It is rendered as a
// child of <Canvas>, so useThree()/useFrame() have a valid context.
// =========================================================================

interface ParticleSceneProps {
  isLeaving: boolean;
  layout: ParticleLayout;
}

const ParticleScene: FC<ParticleSceneProps> = ({ isLeaving, layout }) => {
  const { gl, camera, size } = useThree();

  // -----------------------------------------------------------------
  // Geometry — built exactly once from the layout. Attributes are
  // attached directly to typed arrays already owned by the layout, so
  // no extra copy/allocation happens here.
  // -----------------------------------------------------------------
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(layout.positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(layout.sizes, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(layout.colors, 3));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(layout.count).fill(1), 1));
    geo.computeBoundingSphere();
    return geo;
    // layout is generated once by the parent and never changes identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  // -----------------------------------------------------------------
  // Uniforms — a stable ref-like object, created once.
  // -----------------------------------------------------------------
  const uniformsRef = useRef<ParticleUniforms>(createUniforms(gl.getPixelRatio()));

  // -----------------------------------------------------------------
  // Material — built once from the shader sources + uniform bag.
  // -----------------------------------------------------------------
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      // eslint-disable-next-line react-hooks/refs
      uniforms: uniformsRef.current,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------
  // InteractionController — created on mount, destroyed on unmount.
  // Stored in a ref so useFrame can read it without triggering renders.
  // -----------------------------------------------------------------
  const interactionRef = useRef<InteractionController | null>(null);

  useEffect(() => {
    const controller = new InteractionController(gl.domElement, camera);
    interactionRef.current = controller;

    return () => {
      controller.dispose();
      interactionRef.current = null;
    };
    // gl.domElement is stable for the lifetime of the canvas; camera
    // identity changes are pushed via the effect below instead of a
    // full teardown/recreate, to avoid re-binding DOM listeners.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl.domElement]);

  // Keep the interaction controller's camera reference current if R3F
  // ever swaps the active camera (e.g. via <PerspectiveCamera makeDefault>).
  useEffect(() => {
    interactionRef.current?.setCamera(camera);
  }, [camera]);

  // -----------------------------------------------------------------
  // ParticleEngine — created once geometry/interaction exist. Stored
  // in a ref; disposed on unmount.
  // -----------------------------------------------------------------
  const engineRef = useRef<ParticleEngine | null>(null);

  /** World-space half-width/half-height of the visible screen at the z=0
   *  plane — kept current by the resize effect below, and read here so a
   *  freshly-created engine starts with correct hold-and-drag spawn bounds
   *  even before the next resize event fires. */
  const spawnBoundsRef = useRef({ halfWidth: 4, halfHeight: 3 });

  useEffect(() => {
    const interaction = interactionRef.current;
    if (!interaction) return;

    const engine = new ParticleEngine({
      layout,
      geometry,
      interaction,
    });
    engine.setSpawnBounds(spawnBoundsRef.current.halfWidth, spawnBoundsRef.current.halfHeight);
    engine.setRepulsionScale(getResponsiveContentWorldSize(camera, size) / CONTENT_WORLD_SIZE);
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, layout]);

  // -----------------------------------------------------------------
  // Assemble on load — samples the logo + welcome-text shape (same
  // particle count as the initial scatter, so morphTo() can swap it in
  // directly) and, the moment it's ready, retargets the engine's home
  // position so the cloud eases into place. Checked once per frame
  // instead of via a timer, so it fires the instant both the async
  // shape and the engine exist — no race, no delay.
  //
  // Re-runs whenever the *measured* viewport size actually changes
  // (orientation change, devtools responsive resize, or the canvas's
  // first real measurement landing after an initial 0×0 tick) so the
  // shape is always fit to the real viewport rather than whatever size
  // happened to be current the instant this component first mounted.
  // assembledRef is reset on each new shape so the frame loop below
  // re-triggers morphTo() and eases smoothly into the new layout.
  //
  // The re-sample is debounced: a resize handle being *dragged* (e.g.
  // devtools responsive mode) fires many resize events per second, and
  // re-morphing on every single one keeps yanking each particle's target
  // mid-flight, so it never finishes converging — producing a smeared,
  // half-assembled shape frozen wherever the drag happened to stop. This
  // waits for the size to settle before sampling/morphing, so on a real
  // device (one resize/rotation event) it's effectively instant, and
  // during interactive resizing it only resolves once you let go.
  // -----------------------------------------------------------------
  const assembledShapeRef = useRef<SampledShape | null>(null);
  const assembledRef = useRef(false);

  useEffect(() => {
    // Ignore transient 0×0 measurements before the canvas has laid out —
    // sampling at zero size would produce a degenerate, invisible shape.
    if (size.width < 2 || size.height < 2) return;

    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      // Fit the shape to the current viewport (capped at the desktop
      // size), and keep particle sizes from shrinking into illegibility
      // along with it.
      const responsiveWorldSize = getResponsiveContentWorldSize(camera, size);
      const sizeScale = Math.max(responsiveWorldSize / CONTENT_WORLD_SIZE, MIN_PARTICLE_SIZE_SCALE);

      sampleLogoWithTextShape(
        logoUrl,
        WELCOME_TEXT,
        layout.count,
        responsiveWorldSize,
        LOGO_PARTICLE_SIZE * sizeScale,
        TEXT_PARTICLE_SIZE * sizeScale,
      )
        .then((shape) => {
          if (cancelled) return;
          assembledShapeRef.current = shape;
          // Let the frame loop below morph to this (possibly updated)
          // shape again, even if an earlier shape was already assembled.
          assembledRef.current = false;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('[ParticleCanvas] Failed to assemble logo + text shape:', error);
        });
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
    // layout never changes identity; camera is stable for the canvas's
    // lifetime. size.width/size.height intentionally drive re-sampling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, size.width, size.height]);

  // -----------------------------------------------------------------
  // Dissolve trigger — fires exactly once, on the false -> true edge
  // of isLeaving. wasLeavingRef avoids re-firing on subsequent renders
  // while isLeaving stays true.
  // -----------------------------------------------------------------
  const wasLeavingRef = useRef(false);
  const dissolveFadeStartedRef = useRef(false);
  const dissolveFadeElapsedRef = useRef(0);

  useEffect(() => {
    if (isLeaving && !wasLeavingRef.current) {
      engineRef.current?.triggerDissolve();
    }
    wasLeavingRef.current = isLeaving;
  }, [isLeaving]);

  // -----------------------------------------------------------------
  // Reveal (intro) progress bookkeeping — plain mutable counters, no
  // React state, so nothing here causes re-renders.
  // -----------------------------------------------------------------
  const revealElapsedRef = useRef(0);

  // -----------------------------------------------------------------
  // Resize handling — R3F already resizes the renderer/camera for us
  // via <Canvas>, but the shader needs to know the current pixel ratio
  // explicitly, and we keep the aspect-driven camera projection fresh.
  // Geometry is never touched here.
  //
  // We also recompute the world-space half-width/half-height of the
  // visible screen at the z=0 plane and push it into the engine, so
  // hold-and-drag spawns particles across the *actual* current viewport
  // instead of a stale/default box.
  // -----------------------------------------------------------------
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/immutability
    uniformsRef.current.uPixelRatio.value = gl.getPixelRatio();

    if (camera instanceof THREE.PerspectiveCamera) {
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/immutability
      camera.aspect = size.width / Math.max(size.height, 1);
      camera.updateProjectionMatrix();

      const distance = camera.position.z; // z=0 plane, camera looks down -z
      const halfHeight = distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const halfWidth = halfHeight * camera.aspect;
      spawnBoundsRef.current = { halfWidth, halfHeight };
      engineRef.current?.setSpawnBounds(halfWidth, halfHeight);
    }

    // Keep the idle hover-repulsion radius proportional to the current
    // responsive shape size (see ParticleEngine.setRepulsionScale) — on
    // a narrow/shrunk shape, the pointer's screen-center default position
    // would otherwise permanently bow it out of shape (fixed-radius
    // repulsion covering most of a much smaller shape).
    engineRef.current?.setRepulsionScale(getResponsiveContentWorldSize(camera, size) / CONTENT_WORLD_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, gl]);

  // -----------------------------------------------------------------
  // Per-frame update loop. No allocations, no object creation.
  // -----------------------------------------------------------------
  useFrame((_, delta) => {
    const uniforms = uniformsRef.current;
    const interaction = interactionRef.current;
    const engine = engineRef.current;

    // Advance shader clock.
    uniforms.uTime.value += delta;

    // Drive pointer / touch tracking.
    interaction?.update();

    // Advance particle simulation.
    engine?.update(delta);

    // The moment the logo + text shape has been sampled (and the
    // engine exists), retarget its home position so the scattered
    // cloud eases into the assembled shape. Fires once.
    if (engine && !assembledRef.current && assembledShapeRef.current) {
      const shape = assembledShapeRef.current;
      engine.morphTo(shape.positions, shape.sizes, shape.colors);
      assembledRef.current = true;
    }

    // Mirror interaction pointer position into the shader uniform
    // without allocating a new Vector2 each frame.
    if (interaction) {
      const mouse = interaction.getMouseNDC();
      uniforms.uMouse.value.set(mouse.x, mouse.y);
    }

    // Intro reveal: ease uProgress from 0 -> 1 over REVEAL_DURATION,
    // then leave it pinned at 1.
    if (revealElapsedRef.current < REVEAL_DURATION) {
      revealElapsedRef.current += delta;
      const t = Math.min(revealElapsedRef.current / REVEAL_DURATION, 1);
      uniforms.uProgress.value = t * t * (3 - 2 * t); // smoothstep
    }

    // Outro dissolve: once the engine reports the particles have fully
    // dissolved, fade uOpacity from 1 -> 0 over DISSOLVE_FADE_DURATION.
    if (engine?.isDissolved()) {
      if (!dissolveFadeStartedRef.current) {
        dissolveFadeStartedRef.current = true;
        dissolveFadeElapsedRef.current = 0;
      }
      dissolveFadeElapsedRef.current += delta;
      const t = Math.min(dissolveFadeElapsedRef.current / DISSOLVE_FADE_DURATION, 1);
      uniforms.uOpacity.value = 1 - t;
    }
  });

  // -----------------------------------------------------------------
  // Full cleanup of GPU resources owned directly by this component.
  // Engine / interaction cleanup is handled by their own effects above.
  // -----------------------------------------------------------------
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points geometry={geometry} material={material} frustumCulled={false} />;
};

// =========================================================================
// ParticleCanvas — public component. Owns layout generation (once) and
// the <Canvas> host. Renders nothing if layout generation fails.
// =========================================================================

const ParticleCanvas: FC<ParticleCanvasProps> = ({ isLeaving }) => {
  // Layout is generated exactly once for the lifetime of this component
  // instance. Failure is caught and surfaced as `null`, in which case
  // we render nothing instead of crashing the tree.
  const [layout] = useState<ParticleLayout | null>(() => {
    try {
      return generateParticleLayout(PARTICLE_COUNT);
    } catch (error) {
      // Intentionally swallow: per spec, a failed layout must not crash
      // the app. Logged so it is still discoverable in dev tools.
      // eslint-disable-next-line no-console
      console.error('[ParticleCanvas] Failed to generate particle layout:', error);
      return null;
    }
  });

  if (!layout) {
    return null;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <ParticleScene isLeaving={isLeaving} layout={layout} />
    </Canvas>
  );
};

export default ParticleCanvas;