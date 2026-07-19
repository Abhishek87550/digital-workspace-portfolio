/**
 * shapeSampler.ts
 * =====================================================================
 * Builds the "assembled" shape the loading-screen particle cloud forms
 * on load: the logo SVG traced in small, dense particles, with the
 * welcome text in slightly larger particles underneath it.
 *
 * Rather than parsing SVG path data or loading a Three.js font (fragile,
 * and font-JSON-dependent), both the logo and the text are drawn onto
 * one offscreen 2D canvas — logo in the upper band, text in the lower
 * band — and every opaque pixel is sampled into a particle point. This
 * works for any SVG and any system font with zero extra dependencies,
 * and naturally keeps the text positioned below the logo.
 *
 * The returned arrays are always exactly `count` particles long, so
 * ParticleEngine.morphTo() can swap them in as the cloud's new home
 * position the moment the shape is ready.
 * =====================================================================
 */

import * as THREE from "three";

export interface SampledShape {
  /** Flattened [x0, y0, z0, x1, y1, z1, ...] — length = count * 3. */
  positions: Float32Array;
  /** Per-particle point size multiplier — length = count. */
  sizes: Float32Array;
  /** Flattened [r0, g0, b0, r1, g1, b1, ...] (0..1) — length = count * 3. */
  colors: Float32Array;
}

/** Resolution of the offscreen sampling canvas (square). Higher = finer detail. */
const CANVAS_SIZE = 768;

/** Alpha threshold (0-255) above which a pixel counts as "part of the shape". */
const ALPHA_THRESHOLD = 64;

/** Accent colors used for the text particles (matches Loading.css). */
const ACCENT_A = "#F4F1DE";
const ACCENT_B = "#D97B66";

type Region = "logo" | "text";

function createSamplingCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("[shapeSampler] 2D canvas context unavailable");
  return { canvas, ctx };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`[shapeSampler] failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Loads the logo SVG, rasterizes it in the upper band of the canvas and
 * the welcome text in the lower band, then samples `count` particles
 * from the combined opaque pixels — logo particles keep the SVG's own
 * sampled color and a small size, text particles use the loading
 * screen's accent gradient and a larger, more readable size.
 */
export async function sampleLogoWithTextShape(
  svgUrl: string,
  text: string,
  count: number,
  worldSize: number,
  logoParticleSize: number,
  textParticleSize: number,
): Promise<SampledShape> {
  const { ctx } = createSamplingCanvas();
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // --- Logo: square box in the upper ~58% of the canvas. -----------------
  const image = await loadImage(svgUrl);

  const logoBoxSize = CANVAS_SIZE * 0.48;
  const logoTop = CANVAS_SIZE * 0.06;
  const logoLeft = (CANVAS_SIZE - logoBoxSize) / 2;
  ctx.drawImage(image, logoLeft, logoTop, logoBoxSize, logoBoxSize);

  // Everything below the logo (plus a gap) is tagged as the "text" region.
  const regionSplitY = Math.round(logoTop + logoBoxSize + CANVAS_SIZE * 0.06);

  // --- Text: centered in the band below the logo. -------------------------
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxWidth = CANVAS_SIZE * 0.86;
  let fontSize = 42;
  ctx.font = `700 ${fontSize}px Inter, Poppins, sans-serif`;
  while (ctx.measureText(text).width > maxWidth && fontSize > 8) {
    fontSize -= 1;
    ctx.font = `700 ${fontSize}px Inter, Poppins, sans-serif`;
  }

  const textCenterY = regionSplitY + (CANVAS_SIZE - regionSplitY) * 0.42;
  ctx.fillText(text, CANVAS_SIZE / 2, textCenterY);

  // --- Sample every opaque pixel, tagged by which region it fell in. ------
  const { data } = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const pixelIndices: number[] = [];
  const pixelRegions: Region[] = [];

  let textMinX = Infinity;
  let textMaxX = -Infinity;

  for (let i = 0; i < CANVAS_SIZE * CANVAS_SIZE; i++) {
    if (data[i * 4 + 3] > ALPHA_THRESHOLD) {
      pixelIndices.push(i);
      const isText = Math.floor(i / CANVAS_SIZE) >= regionSplitY;
      pixelRegions.push(isText ? "text" : "logo");

      if (isText) {
        const px = i % CANVAS_SIZE;
        if (px < textMinX) textMinX = px;
        if (px > textMaxX) textMaxX = px;
      }
    }
  }

  const textSpan = Math.max(textMaxX - textMinX, 1);

  if (pixelIndices.length === 0) {
    throw new Error("[shapeSampler] logo + text produced no opaque pixels to sample");
  }

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const colorA = new THREE.Color(ACCENT_A);
  const colorB = new THREE.Color(ACCENT_B);
  const mixed = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * pixelIndices.length);
    const pixelIndex = pixelIndices[pick];
    const region = pixelRegions[pick];

    const px = pixelIndex % CANVAS_SIZE;
    const py = Math.floor(pixelIndex / CANVAS_SIZE);

    const i3 = i * 3;

    // Canvas space (0..CANVAS_SIZE) -> centered world space, Y flipped
    // (canvas Y grows downward, world Y grows upward).
    positions[i3] = (px / CANVAS_SIZE - 0.5) * worldSize;
    positions[i3 + 1] = -(py / CANVAS_SIZE - 0.5) * worldSize;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.04;

    if (region === "logo") {
      sizes[i] = logoParticleSize * (0.7 + Math.random() * 0.6);

      const di = pixelIndex * 4;
      colors[i3] = data[di] / 255;
      colors[i3 + 1] = data[di + 1] / 255;
      colors[i3 + 2] = data[di + 2] / 255;
    } else {
      sizes[i] = textParticleSize * (0.7 + Math.random() * 0.6);

      // Smooth left-to-right gradient across the text's own bounding box
      // (not the whole canvas), with a small amount of jitter so it still
      // reads as painterly rather than a flat printed gradient — instead
      // of the old fully-random per-pixel mix, which looked like static.
      const gradientT = (px - textMinX) / textSpan;
      const jitteredT = Math.min(1, Math.max(0, gradientT + (Math.random() - 0.5) * 0.12));

      mixed.copy(colorA).lerp(colorB, jitteredT);
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }
  }

  return { positions, sizes, colors };
}
