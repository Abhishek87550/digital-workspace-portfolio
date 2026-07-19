/**
 * interaction.ts
 * =====================================================================
 * Tracks pointer position for the particle canvas.
 *
 *  - Listens for pointermove / pointerleave on the given DOM element.
 *  - update() projects the current NDC mouse position onto the z=0
 *    world plane (via raycasting) so the particle engine can react to
 *    the pointer in world space.
 *  - getMouseNDC() exposes the raw normalized (-1..1) coordinates for
 *    anything that only needs screen-space info (e.g. shader uMouse).
 *  - isPointerDown() exposes whether the pointer is currently held,
 *    so the engine can switch from local hover-repulsion to a global
 *    hold-and-drag attraction toward the pointer.
 * =====================================================================
 */

import * as THREE from "three";

export class InteractionController {
  private domElement: HTMLElement;
  private camera: THREE.Camera;

  private readonly ndc = new THREE.Vector2(0, 0);
  private readonly worldPoint = new THREE.Vector3(0, 0, 0);
  private readonly raycaster = new THREE.Raycaster();
  private readonly plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  private isDown = false;

  private readonly handlePointerMove = (event: PointerEvent) => {
    const rect = this.domElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    this.ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  private readonly handlePointerLeave = () => {
    // Park the virtual pointer well off-canvas so repulsion effects stop.
    this.ndc.set(10, 10);
  };

  private readonly handlePointerDown = (event: PointerEvent) => {
    this.handlePointerMove(event);
    this.isDown = true;
  };

  // Bound to window (not just the canvas) so a drag that ends up
  // outside the canvas bounds still releases the hold correctly.
  private readonly handlePointerUp = () => {
    this.isDown = false;
  };

  constructor(domElement: HTMLElement, camera: THREE.Camera) {
    this.domElement = domElement;
    this.camera = camera;

    this.domElement.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    this.domElement.addEventListener("pointerleave", this.handlePointerLeave, { passive: true });
    this.domElement.addEventListener("pointerdown", this.handlePointerDown, { passive: true });
    window.addEventListener("pointerup", this.handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", this.handlePointerUp, { passive: true });
  }

  /** Keep the raycast camera in sync if R3F ever swaps the active camera. */
  public setCamera(camera: THREE.Camera): void {
    this.camera = camera;
  }

  /** Call once per frame to refresh the projected world-space pointer position. */
  public update(): void {
    this.raycaster.setFromCamera(this.ndc, this.camera);
    this.raycaster.ray.intersectPlane(this.plane, this.worldPoint);
  }

  /** Normalized device coordinates of the pointer, each in [-1, 1]. */
  public getMouseNDC(): { x: number; y: number } {
    return { x: this.ndc.x, y: this.ndc.y };
  }

  /** Pointer position projected onto the z=0 world plane. */
  public getWorldPosition(): THREE.Vector3 {
    return this.worldPoint;
  }

  /** Whether the pointer is currently held down (click-hold-drag). */
  public isPointerDown(): boolean {
    return this.isDown;
  }

  public dispose(): void {
    this.domElement.removeEventListener("pointermove", this.handlePointerMove);
    this.domElement.removeEventListener("pointerleave", this.handlePointerLeave);
    this.domElement.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointercancel", this.handlePointerUp);
  }
}

