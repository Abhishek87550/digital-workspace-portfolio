/**
 * particleUtils.ts
 * =====================================================================
 * Generates the particle "home" layout used by the loading screen.
 *
 * Particles are distributed evenly over a sphere shell (using a
 * fibonacci-sphere distribution, which avoids the pole-clustering you
 * get from naive random spherical coordinates) and tinted with a soft
 * gradient between the two loading-screen accent colors.
 * =====================================================================
 */

import * as THREE from "three";

export interface ParticleLayout {
  /** Number of particles in the layout. */
  count: number;
  /** Flattened [x0, y0, z0, x1, y1, z1, ...] — length = count * 3. */
  positions: Float32Array;
  /** Per-particle point size multiplier — length = count. */
  sizes: Float32Array;
  /** Flattened [r0, g0, b0, r1, g1, b1, ...] (0..1) — length = count * 3. */
  colors: Float32Array;
}

/** Golden angle, used to spread points evenly around the sphere. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Base radius of the particle sphere, in world units. */
const SPHERE_RADIUS = 2.2;

/** Accent colors sampled from Loading.css (.enter-button). */
const COLOR_A = "#F4F1DE";
const COLOR_B = "#D97B66";

export function generateParticleLayout(count: number): ParticleLayout {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const colorA = new THREE.Color(COLOR_A);
  const colorB = new THREE.Color(COLOR_B);
  const mixed = new THREE.Color();

  const denom = Math.max(count - 1, 1);

  for (let i = 0; i < count; i++) {
    // Fibonacci sphere: evenly-spaced points on a unit sphere.
    const y = 1 - (i / denom) * 2; // 1 .. -1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    // Slight jitter so the cloud reads as a soft nebula, not a hard shell.
    const jitter = SPHERE_RADIUS * (0.82 + Math.random() * 0.36);

    const i3 = i * 3;
    positions[i3] = x * jitter;
    positions[i3 + 1] = y * jitter;
    positions[i3 + 2] = z * jitter;

    sizes[i] = 0.6 + Math.random() * 1.0;

    mixed.copy(colorA).lerp(colorB, Math.random());
    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  return { count, positions, sizes, colors };
}
