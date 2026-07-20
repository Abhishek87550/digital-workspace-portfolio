/**
 * IDCardCanvas.tsx
 * =====================================================================
 * The single export mounted inside `AboutVisual.tsx`. Wires up:
 * - the R3F <Canvas> (transparent, capped DPR for performance)
 * - <Physics> (Rapier world — gravity + fixed timestep for stability)
 * - procedural studio lighting via drei's <Environment>/<Lightformer>
 *   (generated in-browser, no HDR file to fetch — keeps this
 *   dependency-free and avoids a network request)
 * - a soft <ContactShadows> plane under the card
 * - <ResponsiveCamera> for aspect-aware framing
 * - <Band>, the interactive rig itself
 *
 * Kept intentionally thin — all interaction logic lives in Band.tsx,
 * all card artwork in useCardTexture.ts. This file is just scene
 * assembly.
 * =====================================================================
 */

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Band from "./Band";
import ResponsiveCamera from "./ResponsiveCamera";
import { CAMERA_FOV, CAMERA_POSITION } from "./constants";

const IDCardCanvas = () => {
  return (
    <Canvas
      className="touch-none"
      dpr={[1, 2]}
      shadows
      camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
      gl={{ alpha: true, antialias: true }}
    >
      <ResponsiveCamera />

      <ambientLight intensity={0.42} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />

      <Suspense fallback={null}>
        <Physics gravity={[0, -32, 0]} timeStep={1 / 60} interpolate>
          <Band />
        </Physics>

        {/* Procedural environment for soft reflections on the card's
            clearcoat — generated at runtime, no external asset. */}
        <Environment resolution={256}>
          <Lightformer
            intensity={2}
            color="#F0A583"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[10, 0.1, 1]}
          />
          <Lightformer
            intensity={1.5}
            color="#7DC9F0"
            position={[-2, 1, 2]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[10, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="#FFFFFF"
            position={[2, 2, 2]}
            rotation={[0, Math.PI / 4, 0]}
            scale={[6, 4, 1]}
          />
        </Environment>

        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.45}
          scale={8}
          blur={2.4}
          far={2.5}
          resolution={256}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
};

export default IDCardCanvas;
