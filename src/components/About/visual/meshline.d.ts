/**
 * meshline.d.ts
 * =====================================================================
 * `meshline` ships plain Three.js classes (not R3F JSX types), so we
 * extend React Three Fiber's element catalog with `<meshLineGeometry>`
 * and `<meshLineMaterial>` — the two tags `extend()` registers at
 * runtime in `IDCardCanvas.tsx`. Types only, no runtime effect.
 * =====================================================================
 */

import type { ThreeElement } from "@react-three/fiber";
import type { MeshLineGeometry, MeshLineMaterial } from "meshline";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}
