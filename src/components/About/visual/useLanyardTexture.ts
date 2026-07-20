/**
 * useLanyardTexture.ts
 * =====================================================================
 * Draws the lanyard strap's fabric — black background, the institute
 * name repeated in white — onto a wide, short canvas, then returns it
 * as a `THREE.CanvasTexture` with repeat-wrapping enabled so meshline
 * can tile it along the strap's length via its `repeat` uniform.
 *
 * Same reasoning as `useCardTexture.ts`: canvas text needs no font
 * files to preload and is a single cheap texture, not a per-frame cost.
 * =====================================================================
 */

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  CARD_COLORS,
  LANYARD_TEXT,
  LANYARD_TEXTURE_HEIGHT,
  LANYARD_TEXTURE_REPEATS,
  LANYARD_TEXTURE_WIDTH,
} from "./constants";

function drawLanyard(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Black strap base.
  ctx.fillStyle = CARD_COLORS.lanyard;
  ctx.fillRect(0, 0, w, h);

  // Subtle woven-fabric highlight so it doesn't read as flat/pure black.
  const sheen = ctx.createLinearGradient(0, 0, 0, h);
  sheen.addColorStop(0, "rgba(255,255,255,0.05)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(255,255,255,0.05)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // Repeated institute text, each copy separated by a small diamond.
  ctx.fillStyle = CARD_COLORS.lanyardText;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(h * 0.34)}px "Segoe UI", system-ui, sans-serif`;

  const slotWidth = w / LANYARD_TEXTURE_REPEATS;
  for (let i = 0; i < LANYARD_TEXTURE_REPEATS; i++) {
    const cx = slotWidth * i + slotWidth / 2;
    ctx.fillText(LANYARD_TEXT, cx, h / 2, slotWidth * 0.92);

    // Small diamond separator at the boundary between repeats.
    const sepX = slotWidth * (i + 1);
    const s = h * 0.09;
    ctx.save();
    ctx.translate(sepX, h / 2);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.restore();
  }
}

/** Returns a ready-to-tile CanvasTexture for the lanyard strap. */
export function useLanyardTexture(): THREE.CanvasTexture {
  const canvas = useMemo(() => {
    const el = document.createElement("canvas");
    el.width = LANYARD_TEXTURE_WIDTH;
    el.height = LANYARD_TEXTURE_HEIGHT;
    drawLanyard(el);
    return el;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [canvas]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}
