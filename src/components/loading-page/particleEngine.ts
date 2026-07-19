/**
 * particleEngine.ts
 * =====================================================================
 * Per-frame particle simulation for the loading screen.
 *
 *  - Idle: particles hold their "home" position (the assembled logo +
 *    welcome-text shape) with a snappy spring, and drift away from the
 *    pointer quickly when it passes nearby (fast hover repulsion).
 *  - Hold-and-drag: the instant the pointer is pressed, EVERY particle is
 *    respawned at a random point across the whole screen. From then on,
 *    for as long as the pointer stays down, each particle independently
 *    runs its own short life cycle: it fades in at a random spot on the
 *    screen, gets pulled toward the pointer (pull growing stronger the
 *    farther away it is), fades back out again, and is instantly
 *    respawned at a new random spot to start another cycle — all on a
 *    staggered, randomized timer per particle. The net effect is a
 *    continuous stream of thousands of particles constantly appearing
 *    somewhere on screen, getting drawn in toward the cursor, and
 *    vanishing again, rather than the shape sliding around as one rigid
 *    block. Releasing the hold stops the spawn cycle and lets the home
 *    spring reassemble the original shape.
 *  - Dissolve: once triggered, particles accelerate outward from the
 *    origin and fade away; isDissolved() flips true once the effect
 *    has had time to fully play out.
 *
 * No allocations happen inside update() — every scratch value is a
 * primitive local, and the only arrays touched are the ones already
 * owned by the layout / geometry.
 * =====================================================================
 */

import * as THREE from "three";

import type { ParticleLayout } from "./ParticleUtils";
import type { InteractionController } from "./interaction";

export interface ParticleEngineOptions {
  layout: ParticleLayout;
  geometry: THREE.BufferGeometry;
  interaction: InteractionController;
}

/** Radius (world units) within which the pointer pushes particles away. */
const REPULSION_RADIUS = 1.4;

/** Peak strength of the pointer repulsion at zero distance. Raised so the
 *  hover reaction feels immediate instead of sluggish. */
const REPULSION_STRENGTH = 8.0;

/** How long (seconds) a single spawn-to-despawn life cycle lasts while
 *  held, picked randomly per spawn between these two bounds so particles
 *  don't all pop in/out in sync. */
const STREAM_LIFE_MIN = 0.55;
const STREAM_LIFE_MAX = 1.5;

/** Fraction of a particle's life spent fading in at the start / fading
 *  out at the end. The middle portion stays fully opaque. */
const STREAM_FADE_IN_FRACTION = 0.12;
const STREAM_FADE_OUT_FRACTION = 0.35;

/** Small outward kick a particle gets the moment it spawns, so it doesn't
 *  sit perfectly still before the attraction pull takes over. */
const SPAWN_KICK_STRENGTH = 1.6;

/** Base strength pulling a particle toward the pointer while held. */
const ATTRACTION_STRENGTH = 4.0;

/** Extra pull per world-unit of distance from the pointer while held — the
 *  farther a particle has spawned from the cursor, the harder it gets
 *  pulled in, producing a magnet-like attraction effect that reaches
 *  across the whole screen rather than the shape moving as one block. */
const ATTRACTION_DISTANCE_GAIN = 2.4;

/** Speed (per second) at which a particle's opacity eases back to fully
 *  visible once the pointer is released, so the reassembled shape doesn't
 *  stay partially faded from mid-cycle. */
const ALPHA_RESTORE_SPEED = 8.0;

/** Spring strength pulling idle particles back toward their home position.
 *  Raised alongside DAMPING so release/re-assembly snaps back quickly. */
const RETURN_SPRING = 8.0;

/** Per-second velocity damping, applied every frame. Raised so motion
 *  settles fast instead of feeling floaty/slow. */
const DAMPING = 6.0;

/** Outward acceleration applied to particles once dissolving. */
const DISSOLVE_ACCEL = 5.5;

/** Seconds after triggerDissolve() before isDissolved() reports true. */
const DISSOLVE_DURATION = 1.3;

export class ParticleEngine {
  private readonly layout: ParticleLayout;
  private readonly geometry: THREE.BufferGeometry;
  private readonly interaction: InteractionController;

  private homePositions: Float32Array;
  private readonly positions: Float32Array;
  private readonly velocities: Float32Array;
  private readonly alphas: Float32Array;
  private readonly alphaAttr: THREE.BufferAttribute;

  /** Fixed, per-particle unit direction (mostly in the screen plane) used
   *  for the small kick a particle gets the moment it spawns. Precomputed
   *  once so update() never allocates. */
  private readonly spawnDirections: Float32Array;

  /** Seconds remaining / total seconds in the current particle's spawn ->
   *  despawn life cycle while held (see STREAM_LIFE_MIN/MAX). */
  private readonly lifeRemaining: Float32Array;
  private readonly lifeDuration: Float32Array;

  /** Half-extent (world units) of the visible screen at the z=0 plane,
   *  used so spawned particles land anywhere on screen. Kept up to date
   *  via setSpawnBounds() as the viewport / camera changes. */
  private spawnHalfWidth = 4;
  private spawnHalfHeight = 3;

  /** Pointer hover-repulsion radius (world units), scaled to match the
   *  current responsive content size — see setRepulsionScale(). Starts
   *  at the desktop-tuned REPULSION_RADIUS. */
  private repulsionRadius = REPULSION_RADIUS;

  /** Tracks the previous frame's held state so "respawn everything" fires
   *  exactly once, on the false -> true edge, instead of every frame. */
  private wasHeld = false;

  private dissolving = false;
  private dissolved = false;
  private dissolveElapsed = 0;

  constructor({ layout, geometry, interaction }: ParticleEngineOptions) {
    this.layout = layout;
    this.geometry = geometry;
    this.interaction = interaction;

    this.homePositions = layout.positions;
    this.positions = (geometry.getAttribute("position") as THREE.BufferAttribute)
      .array as Float32Array;
    this.velocities = new Float32Array(layout.count * 3);

    this.alphaAttr = geometry.getAttribute("aAlpha") as THREE.BufferAttribute;
    this.alphas = this.alphaAttr.array as Float32Array;
    this.alphas.fill(1);

    this.lifeRemaining = new Float32Array(layout.count);
    this.lifeDuration = new Float32Array(layout.count);

    this.spawnDirections = new Float32Array(layout.count * 3);
    for (let i = 0; i < layout.count; i++) {
      const i3 = i * 3;
      // Random direction around a full circle in the screen (x/y) plane,
      // with a little z jitter — keeps the spawn kick spreading across
      // the visible screen rather than mostly toward/away from the camera.
      const angle = Math.random() * Math.PI * 2;
      this.spawnDirections[i3] = Math.cos(angle);
      this.spawnDirections[i3 + 1] = Math.sin(angle);
      this.spawnDirections[i3 + 2] = (Math.random() - 0.5) * 0.3;

      // Stagger initial life so, the moment holding starts, particles
      // don't all respawn/fade in perfect unison on later cycles.
      this.lifeDuration[i] = STREAM_LIFE_MIN + Math.random() * (STREAM_LIFE_MAX - STREAM_LIFE_MIN);
      this.lifeRemaining[i] = Math.random() * this.lifeDuration[i];
    }
  }

  /**
   * Updates the world-space half-width/half-height of the visible screen
   * at the z=0 plane, so particles spawned during hold-and-drag can be
   * placed anywhere across the current viewport. Call on mount and again
   * whenever the canvas resizes.
   */
  public setSpawnBounds(halfWidth: number, halfHeight: number): void {
    this.spawnHalfWidth = halfWidth;
    this.spawnHalfHeight = halfHeight;
  }

  /**
   * Scales the idle hover-repulsion radius relative to its desktop-tuned
   * value. REPULSION_RADIUS is an absolute world-unit distance, tuned
   * against the desktop assembled-shape size — on a narrower viewport the
   * assembled shape itself is scaled down (see ParticleCanvas), but this
   * radius doesn't shrink automatically with it. Without this, the same
   * fixed radius covers a much larger fraction of a small mobile shape,
   * and since the pointer defaults to screen-center (world origin) until
   * the person actually touches/moves it, that default hover point sits
   * permanently inside the shape and visibly bows it out of place. Call
   * with the same ratio the shape's world size was scaled by so the
   * repulsion "bubble" stays proportional to the shape at any size.
   */
  public setRepulsionScale(scale: number): void {
    this.repulsionRadius = REPULSION_RADIUS * scale;
  }

  public update(deltaTime: number): void {
    // Guard against huge delta spikes (tab switch, debugger pause).
    const dt = Math.min(deltaTime, 1 / 30);

    const count = this.layout.count;
    const positions = this.positions;
    const velocities = this.velocities;
    const home = this.homePositions;
    const repulsionRadius = this.repulsionRadius;

    this.interaction.update();
    const pointer = this.interaction.getWorldPosition();
    const px = pointer.x;
    const py = pointer.y;
    const pz = pointer.z;
    const held = this.interaction.isPointerDown();
    // True only on the exact frame the pointer transitions from up -> down,
    // so every particle respawns at a fresh random screen position right
    // as the hold begins, then each runs its own independent cycle after.
    const justPressed = held && !this.wasHeld;

    const damp = Math.max(0, 1 - DAMPING * dt);
    const spawnDirections = this.spawnDirections;
    const alphas = this.alphas;
    const lifeRemaining = this.lifeRemaining;
    const lifeDuration = this.lifeDuration;
    const spawnHalfWidth = this.spawnHalfWidth;
    const spawnHalfHeight = this.spawnHalfHeight;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      let x = positions[i3];
      let y = positions[i3 + 1];
      let z = positions[i3 + 2];

      let vx = velocities[i3];
      let vy = velocities[i3 + 1];
      let vz = velocities[i3 + 2];

      if (this.dissolving) {
        const dist = Math.sqrt(x * x + y * y + z * z) || 0.0001;
        vx += (x / dist) * DISSOLVE_ACCEL * dt;
        vy += (y / dist) * DISSOLVE_ACCEL * dt;
        vz += (z / dist) * DISSOLVE_ACCEL * dt;
      } else if (held) {
        lifeRemaining[i] -= dt;

        // On the very first held frame, force every particle to respawn
        // immediately (regardless of its staggered timer) so the screen
        // fills with scattered particles right away. After that, each
        // particle respawns independently whenever its own timer runs out
        // — a continuous stream of particles appearing, getting pulled
        // toward the pointer, and disappearing again.
        if (justPressed || lifeRemaining[i] <= 0) {
          x = (Math.random() * 2 - 1) * spawnHalfWidth;
          y = (Math.random() * 2 - 1) * spawnHalfHeight;
          z = (Math.random() - 0.5) * 0.6;

          const duration = STREAM_LIFE_MIN + Math.random() * (STREAM_LIFE_MAX - STREAM_LIFE_MIN);
          lifeDuration[i] = duration;
          lifeRemaining[i] = duration;

          vx = spawnDirections[i3] * SPAWN_KICK_STRENGTH;
          vy = spawnDirections[i3 + 1] * SPAWN_KICK_STRENGTH;
          vz = spawnDirections[i3 + 2] * SPAWN_KICK_STRENGTH;
        }

        // Fade in at the start of the cycle, stay opaque through the
        // middle, fade out again right before despawn/respawn.
        const lifeT = 1 - lifeRemaining[i] / lifeDuration[i]; // 0 at spawn -> 1 at despawn
        let alpha = 1;
        if (lifeT < STREAM_FADE_IN_FRACTION) {
          alpha = lifeT / STREAM_FADE_IN_FRACTION;
        } else if (lifeT > 1 - STREAM_FADE_OUT_FRACTION) {
          alpha = (1 - lifeT) / STREAM_FADE_OUT_FRACTION;
        }
        alphas[i] = Math.min(1, Math.max(0, alpha));

        // Every frame while held: pull each particle toward the pointer
        // with a pull that grows with distance, so particles spawned far
        // from the cursor get reeled back in fastest — a magnet-like
        // attraction sweeping in from all over the screen.
        const dx = px - x;
        const dy = py - y;
        const dz = pz - z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
        const pull = ATTRACTION_STRENGTH + dist * ATTRACTION_DISTANCE_GAIN;

        vx += (dx / dist) * pull * dt;
        vy += (dy / dist) * pull * dt;
        vz += (dz / dist) * pull * dt;
      } else {
        // Released: ease opacity back to fully visible so the
        // reassembled shape doesn't stay stuck mid-fade.
        alphas[i] += (1 - alphas[i]) * Math.min(1, ALPHA_RESTORE_SPEED * dt);

        // Spring back toward home.
        vx += (home[i3] - x) * RETURN_SPRING * dt;
        vy += (home[i3 + 1] - y) * RETURN_SPRING * dt;
        vz += (home[i3 + 2] - z) * RETURN_SPRING * dt;

        // Hover: pointer repulsion when nearby (not held).
        const dx = x - px;
        const dy = y - py;
        const dz = z - pz;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < repulsionRadius * repulsionRadius) {
          const dist = Math.sqrt(distSq) || 0.0001;
          const force = (1 - dist / repulsionRadius) * REPULSION_STRENGTH;
          vx += (dx / dist) * force * dt;
          vy += (dy / dist) * force * dt;
          vz += (dz / dist) * force * dt;
        }
      }

      vx *= damp;
      vy *= damp;
      vz *= damp;

      x += vx * dt;
      y += vy * dt;
      z += vz * dt;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      velocities[i3] = vx;
      velocities[i3 + 1] = vy;
      velocities[i3 + 2] = vz;
    }

    (this.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    this.alphaAttr.needsUpdate = true;

    this.wasHeld = held;

    if (this.dissolving && !this.dissolved) {
      this.dissolveElapsed += dt;
      if (this.dissolveElapsed >= DISSOLVE_DURATION) {
        this.dissolved = true;
      }
    }
  }

  /**
   * Retargets the "home" position every particle springs toward, and
   * optionally rewrites its size / color in place. Positions ease into
   * the new shape via the existing RETURN_SPRING — no snapping, no new
   * simulation path. Used once, right after load, to swap the initial
   * scatter for the assembled logo + welcome-text shape.
   *
   * `newHome` must be the same length as the current home array (i.e.
   * layout.count must match); mismatched shapes are ignored rather than
   * risking an out-of-bounds read in update().
   */
  public morphTo(
    newHome: Float32Array,
    newSizes?: Float32Array,
    newColors?: Float32Array,
  ): void {
    if (newHome.length !== this.homePositions.length) return;
    this.homePositions = newHome;

    if (newSizes) {
      const sizeAttr = this.geometry.getAttribute("aSize") as THREE.BufferAttribute;
      (sizeAttr.array as Float32Array).set(newSizes);
      sizeAttr.needsUpdate = true;
    }

    if (newColors) {
      const colorAttr = this.geometry.getAttribute("aColor") as THREE.BufferAttribute;
      (colorAttr.array as Float32Array).set(newColors);
      colorAttr.needsUpdate = true;
    }
  }

  public triggerDissolve(): void {
    this.dissolving = true;
    this.alphas.fill(1);
    this.alphaAttr.needsUpdate = true;
  }

  public isDissolved(): boolean {
    return this.dissolved;
  }

  public dispose(): void {
    // Geometry, material, and the interaction controller are all owned
    // (and disposed) elsewhere; the engine holds no resources of its own.
  }
}

export default ParticleEngine;