/**
 * constants.ts
 * =====================================================================
 * Central place for everything the ID card / lanyard needs that isn't
 * interaction logic: placeholder copy, the card's own color tokens
 * (pulled from the same palette already used in `AboutContent.tsx`),
 * and the physics/camera numbers that tune how the badge falls, swings
 * and drags. Keeping these here means the look or feel can be retuned
 * without touching `Band.tsx`'s logic.
 * =====================================================================
 */

/** Placeholder card content — swap these once real details are ready. */
export const CARD_DATA = {
  name: "Abhishek Sharma",
  role: "Software Developer",
  handle: "@abhishek87550",
  tag: "DEVELOPER",
  idNumber: "8755",
  status: "ALIVE",
} as const;

/** Text repeated along the lanyard ribbon. */
export const LANYARD_TEXT = "INDIAN INSTITUTE OF TECHNOLOGY JODHPUR";

/** Palette reused from the About section so the card matches the rest of the page. */
export const CARD_COLORS = {
  background: "#0B0D12",
  backgroundEnd: "#12161F",
  cardBorder: "#2A2F3B",
  cream: "#F4F1DE",
  creamMuted: "rgba(244, 241, 222, 0.55)",
  peach: "#F0A583",
  burntOrange: "#D9694F",
  sky: "#7DC9F0",
  lanyard: "#0A0A0A",
  lanyardText: "#F4F1DE",
  statusGreen: "#4ADE80",
  tagBg: "rgba(244, 241, 222, 0.12)",
  tagBorder: "rgba(244, 241, 222, 0.22)",
  barcodeInk: "#F4F1DE",
} as const;

/** Physical dimensions of the card, in Three.js world units (portrait ID-card ratio). */
export const CARD_WIDTH = 1.7;
export const CARD_HEIGHT = 2.6;
export const CARD_THICKNESS = 0.02;

/** Texture resolution for the canvas-drawn card face — sharp on retina, cheap to generate. */
export const CARD_TEXTURE_WIDTH = 900;
export const CARD_TEXTURE_HEIGHT = Math.round(
  (CARD_TEXTURE_WIDTH / CARD_WIDTH) * CARD_HEIGHT,
);

/** Lanyard ribbon texture — wide and short, tiled along the strap. */
export const LANYARD_TEXTURE_WIDTH = 1024;
export const LANYARD_TEXTURE_HEIGHT = 160;
export const LANYARD_TEXTURE_REPEATS = 3; // copies of the text drawn per tile, before meshline re-tiles it further

/**
 * Rope/joint tuning. `CARD_JOINT_DROP` is the vertical distance (in the
 * card's own local space) from its rigid-body origin (its geometric
 * center) up to where the lanyard's spherical joint anchors — it must
 * land right at the card's top edge (half the card height) plus a
 * small clip allowance, or the rope visually stops short of the card
 * with a floating gap between them.
 */
export const ROPE_SEGMENT_LENGTH = 0.5;
export const ROPE_BALL_RADIUS = 0.06;
export const CARD_JOINT_DROP = CARD_HEIGHT / 2 + 0.15;
export const FIXED_ANCHOR_POSITION: [number, number, number] = [0, 4.25, 0];

/** How many times the lanyard texture tiles along the strap (GPU-side, via meshline's `repeat`). */
export const LANYARD_REPEAT_TILES = 4;

/** Smooths jitter in the upper rope segments when the card is pulled hard while dragging. */
export const ROPE_LERP_MIN_SPEED = 10;
export const ROPE_LERP_MAX_SPEED = 50;

/** How strongly the card gets spun back to face the camera while swinging. */
export const TILT_BACK_STRENGTH = 0.28;

/** Idle float (applied only while the card isn't being dragged). */
export const IDLE_FLOAT_AMPLITUDE = 0.045;
export const IDLE_FLOAT_SPEED = 0.6;

/** Camera framing, tuned so the card fills ~75% of the visible frame height. */
export const CAMERA_POSITION: [number, number, number] = [0, 0, 8.2];
export const CAMERA_FOV = 25;
