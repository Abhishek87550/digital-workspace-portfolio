/**
 * useCardBackTexture.ts
 * =====================================================================
 * Generates the back-face artwork of the ID card showing technology skills.
 * =====================================================================
 */

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  CARD_COLORS,
  CARD_TEXTURE_HEIGHT,
  CARD_TEXTURE_WIDTH,
} from "./constants";

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawCardBack(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // --- Base panel -------------------------------------------------
  roundedRectPath(ctx, 0, 0, w, h, w * 0.055);
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#161B26");
  bg.addColorStop(0.55, CARD_COLORS.background);
  bg.addColorStop(1, CARD_COLORS.backgroundEnd);
  ctx.fillStyle = bg;
  ctx.fill();

  // Thin inner border
  roundedRectPath(ctx, w * 0.015, h * 0.015, w * 0.97, h * 0.97, w * 0.048);
  ctx.strokeStyle = CARD_COLORS.cardBorder;
  ctx.lineWidth = w * 0.005;
  ctx.stroke();

  // --- Header ------------------------------------------------------
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = CARD_COLORS.peach;
  ctx.font = `700 ${Math.round(w * 0.055)}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText("TECH STACK", w / 2, h * 0.15);

  ctx.fillStyle = CARD_COLORS.creamMuted;
  ctx.font = `500 ${Math.round(w * 0.035)}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText("AUTHORIZED SYSTEMS", w / 2, h * 0.22);

  // --- Tech List ---------------------------------------------------
  const techs = [
    "JavaScript / TypeScript",
    "React / Next.js",
    "Three.js / WebGL",
    "Node.js / Express",
    "Tailwind CSS / GSAP",
    "Git / CI/CD"
  ];

  ctx.textAlign = "left";
  ctx.fillStyle = CARD_COLORS.cream;
  ctx.font = `600 ${Math.round(w * 0.04)}px "Segoe UI", system-ui, sans-serif`;
  
  const startY = h * 0.35;
  const gap = h * 0.06;
  
  techs.forEach((tech, i) => {
    const itemY = startY + (i * gap);
    
    // Draw dot
    ctx.beginPath();
    ctx.arc(w * 0.15, itemY, w * 0.012, 0, Math.PI * 2);
    ctx.fillStyle = CARD_COLORS.statusGreen;
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = CARD_COLORS.cream;
    ctx.fillText(tech, w * 0.22, itemY);
  });

  // --- Barcode / Security strip at bottom ---------------------------
  ctx.fillStyle = CARD_COLORS.lanyard;
  ctx.fillRect(0, h * 0.8, w, h * 0.1);

  ctx.textAlign = "center";
  ctx.fillStyle = CARD_COLORS.creamMuted;
  ctx.font = `600 ${Math.round(w * 0.025)}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText("PROPERTY OF A. SHARMA", w / 2, h * 0.94);

  // --- Footer punch-hole (nods at a physical lanyard card) --------
  ctx.fillStyle = CARD_COLORS.background;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.032, w * 0.024, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = CARD_COLORS.cardBorder;
  ctx.lineWidth = w * 0.004;
  ctx.stroke();
}

/** Returns a ready-to-use CanvasTexture for the back of the card. */
export function useCardBackTexture(): THREE.CanvasTexture {
  const canvas = useMemo(() => {
    const el = document.createElement("canvas");
    el.width = CARD_TEXTURE_WIDTH;
    el.height = CARD_TEXTURE_HEIGHT;
    drawCardBack(el);
    return el;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [canvas]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}
