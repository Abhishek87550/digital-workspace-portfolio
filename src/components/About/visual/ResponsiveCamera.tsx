/**
 * ResponsiveCamera.tsx
 * =====================================================================
 * Vertical framing is already free with a fixed-FOV perspective camera:
 * vertical FOV doesn't change with container size, so the card's
 * height stays a consistent proportion of the frame at any breakpoint.
 *
 * Horizontal framing isn't free — a narrow (mobile) container has a
 * narrower horizontal FOV at the same distance, and the lanyard swings
 * / drags horizontally. Rather than scaling the physics rig itself
 * (risky: Rapier colliders don't scale predictably with a Three.js
 * group scale), this component dollies the camera back slightly on
 * narrow aspects, which shrinks the *apparent* size of everything
 * uniformly without touching a single physics body.
 *
 * Renders nothing — it just steers the default camera every frame,
 * damped with a lerp so browser resizes never look like a snap-zoom.
 * =====================================================================
 */

import { useFrame } from "@react-three/fiber";
import { CAMERA_POSITION } from "./constants";

const REFERENCE_ASPECT = 0.82; // roughly the desktop frame's proportions
const MAX_DOLLY_BACK = 2.2; // increased to decrease ID card size significantly on mobile
const DAMPING = 4; // higher = snappier response to resize

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const ResponsiveCamera = () => {
  useFrame((state, delta) => {
    const aspect = state.size.width / state.size.height;
    const narrowness = clamp(REFERENCE_ASPECT / aspect, 1, MAX_DOLLY_BACK);
    const targetZ = CAMERA_POSITION[2] * narrowness;

    state.camera.position.z +=
      (targetZ - state.camera.position.z) * Math.min(1, delta * DAMPING);
  });

  return null;
};

export default ResponsiveCamera;
