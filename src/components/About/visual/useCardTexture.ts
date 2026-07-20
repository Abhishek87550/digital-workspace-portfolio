/**
 * useCardTexture.ts
 * =====================================================================
 * Builds the card's front-face artwork procedurally on an off-screen
 * 2D canvas — status pill, avatar photo, name/role/handle, barcode +
 * ID number — and hands it back as a `THREE.CanvasTexture`.
 *
 * The avatar is the real photo at `src/assets/about/profile-photo.png`
 * (swap that file to change it — same filename, no code changes
 * needed). It loads asynchronously; the card renders immediately with
 * a placeholder avatar and redraws in place the moment the photo is
 * ready, flagging the texture for a GPU re-upload.
 *
 * Logic is fully separated from rendering: this hook owns canvas
 * drawing + texture lifecycle; `Band.tsx` just consumes the result.
 * =====================================================================
 */

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import profilePhoto from "@/assets/about/profile-photo.jpg";
import {
  CARD_COLORS,
  CARD_DATA,
  CARD_TEXTURE_HEIGHT,
  CARD_TEXTURE_WIDTH,
} from "./constants";

/** Draws a rounded-rect path. */
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

/** Deterministic pseudo-random barcode — visually plausible, not a real scannable code. */
function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  let seed = 8755;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  ctx.fillStyle = CARD_COLORS.barcodeInk;
  let cursor = x;
  while (cursor < x + width) {
    const barWidth = width * (0.006 + pseudoRandom() * 0.014);
    if (pseudoRandom() > 0.42) {
      ctx.fillRect(cursor, y, barWidth, height);
    }
    cursor += barWidth + width * 0.004;
  }
  ctx.restore();
}

/** Placeholder avatar (gradient + simple person glyph) shown until the real photo loads. */
function drawAvatarPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  radius: number,
) {
  ctx.save();
  roundedRectPath(ctx, x, y, size, size, radius);
  ctx.clip();

  const bg = ctx.createLinearGradient(x, y, x + size, y + size);
  bg.addColorStop(0, CARD_COLORS.peach);
  bg.addColorStop(1, CARD_COLORS.burntOrange);
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = "rgba(10, 14, 23, 0.55)";
  const cx = x + size / 2;
  const cy = y + size / 2;
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.12, size * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, cy + size * 0.38, size * 0.36, size * 0.26, 0, Math.PI, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

/** Draws the loaded photo into the avatar frame, cropped ("object-fit: cover") to fill it. */
function drawAvatarPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  radius: number,
) {
  ctx.save();
  roundedRectPath(ctx, x, y, size, size, radius);
  ctx.clip();

  const scale = Math.max(size / img.width, size / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const drawX = x + (size - drawW) / 2;
  const drawY = y + (size - drawH) / 2;
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
}

function drawCard(
  canvas: HTMLCanvasElement,
  avatarImage: HTMLImageElement | null,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // --- Base panel -------------------------------------------------
  roundedRectPath(ctx, 0, 0, w, h, w * 0.055);
  const bg = ctx.createLinearGradient(0, 0, w * 0.3, h);
  bg.addColorStop(0, "#161B26");
  bg.addColorStop(0.55, CARD_COLORS.background);
  bg.addColorStop(1, CARD_COLORS.backgroundEnd);
  ctx.fillStyle = bg;
  ctx.fill();

  // Diagonal accent streak, echoing the holographic-badge reference.
  ctx.save();
  roundedRectPath(ctx, 0, 0, w, h, w * 0.055);
  ctx.clip();
  const streak = ctx.createLinearGradient(w * 0.1, 0, w * 0.55, h);
  streak.addColorStop(0, "rgba(125, 201, 240, 0)");
  streak.addColorStop(0.45, "rgba(125, 201, 240, 0.16)");
  streak.addColorStop(0.55, "rgba(217, 105, 79, 0.14)");
  streak.addColorStop(1, "rgba(217, 105, 79, 0)");
  ctx.fillStyle = streak;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Thin inner border for a manufactured, "card stock" edge.
  roundedRectPath(ctx, w * 0.015, h * 0.015, w * 0.97, h * 0.97, w * 0.048);
  ctx.strokeStyle = CARD_COLORS.cardBorder;
  ctx.lineWidth = w * 0.005;
  ctx.stroke();

  // --- Top-left "DEVELOPER" pill ------------------------------------
  const pillPadX = w * 0.028;
  ctx.font = `700 ${Math.round(w * 0.036)}px "Segoe UI", system-ui, sans-serif`;
  const tagMetrics = ctx.measureText(CARD_DATA.tag);
  const pillWidth = tagMetrics.width + pillPadX * 2;
  const pillHeight = h * 0.05;
  const pillX = w * 0.065;
  const pillY = h * 0.055;
  roundedRectPath(ctx, pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
  ctx.fillStyle = CARD_COLORS.tagBg;
  ctx.fill();
  ctx.strokeStyle = CARD_COLORS.tagBorder;
  ctx.lineWidth = w * 0.003;
  ctx.stroke();
  ctx.fillStyle = CARD_COLORS.cream;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(CARD_DATA.tag, pillX + pillPadX, pillY + pillHeight / 2 + h * 0.002);

  // --- Top-right status dot + "ALIVE" -------------------------------
  ctx.textAlign = "right";
  ctx.font = `600 ${Math.round(w * 0.032)}px "Segoe UI", system-ui, sans-serif`;
  const statusRightX = w * 0.935;
  const statusY = pillY + pillHeight / 2;
  ctx.fillStyle = CARD_COLORS.creamMuted;
  ctx.fillText(CARD_DATA.status, statusRightX, statusY + h * 0.002);
  const statusTextWidth = ctx.measureText(CARD_DATA.status).width;
  const dotR = w * 0.011;
  const dotX = statusRightX - statusTextWidth - w * 0.022;
  ctx.beginPath();
  ctx.arc(dotX, statusY, dotR, 0, Math.PI * 2);
  ctx.fillStyle = CARD_COLORS.statusGreen;
  ctx.shadowColor = CARD_COLORS.statusGreen;
  ctx.shadowBlur = w * 0.02;
  ctx.fill();
  ctx.shadowBlur = 0;

  // --- Avatar (rounded-square photo frame) --------------------------
  const avatarSize = w * 0.42;
  const avatarX = (w - avatarSize) / 2;
  const avatarY = h * 0.16;
  const avatarRadius = w * 0.06;

  if (avatarImage) {
    drawAvatarPhoto(ctx, avatarImage, avatarX, avatarY, avatarSize, avatarRadius);
  } else {
    drawAvatarPlaceholder(ctx, avatarX, avatarY, avatarSize, avatarRadius);
  }
  roundedRectPath(ctx, avatarX, avatarY, avatarSize, avatarSize, avatarRadius);
  ctx.strokeStyle = "rgba(244, 241, 222, 0.25)";
  ctx.lineWidth = w * 0.005;
  ctx.stroke();

  // --- Name / role / handle ----------------------------------------
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = CARD_COLORS.cream;
  ctx.font = `800 ${Math.round(w * 0.068)}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText(CARD_DATA.name, w / 2, h * 0.635);

  ctx.fillStyle = CARD_COLORS.peach;
  ctx.font = `600 ${Math.round(w * 0.04)}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText(CARD_DATA.role, w / 2, h * 0.68);

  ctx.fillStyle = CARD_COLORS.creamMuted;
  ctx.font = `500 ${Math.round(w * 0.033)}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText(CARD_DATA.handle, w / 2, h * 0.715);

  // --- Barcode + ID number -------------------------------------------
  const barcodeY = h * 0.85;
  const barcodeHeight = h * 0.075;
  const barcodeWidth = w * 0.58;
  const barcodeX = w * 0.065;
  drawBarcode(ctx, barcodeX, barcodeY, barcodeWidth, barcodeHeight);

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = CARD_COLORS.creamMuted;
  ctx.font = `600 ${Math.round(w * 0.03)}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText(`ID·${CARD_DATA.idNumber}`, w * 0.935, barcodeY + barcodeHeight / 2);

  // --- Footer punch-hole (nods at a physical lanyard card) --------
  ctx.fillStyle = CARD_COLORS.background;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.032, w * 0.024, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = CARD_COLORS.cardBorder;
  ctx.lineWidth = w * 0.004;
  ctx.stroke();
}

/**
 * Returns a ready-to-use CanvasTexture for the card face. Draws
 * immediately with a placeholder avatar, then redraws in place (and
 * flags the texture for re-upload) once the real photo has loaded.
 */
export function useCardTexture(): THREE.CanvasTexture {
  const canvas = useMemo(() => {
    const el = document.createElement("canvas");
    el.width = CARD_TEXTURE_WIDTH;
    el.height = CARD_TEXTURE_HEIGHT;
    drawCard(el, null);
    return el;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [canvas]);

  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    imageRef.current = img;
    img.onload = () => {
      drawCard(canvas, img);
      texture.needsUpdate = true;
    };
    img.src = profilePhoto;

    return () => {
      img.onload = null;
    };
  }, [canvas, texture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}
