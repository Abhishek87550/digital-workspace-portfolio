/**
 * AboutVisual.tsx
 * =====================================================================
 * Right column of the About section — an interactive 3D ID card on a
 * lanyard (React Three Fiber + Rapier physics), per the design brief.
 *
 * The frame now fills the *entire* right column (desktop: 55% width x
 * 100vh, from About.tsx's `md:grid-cols-[45%_55%] md:h-screen`) instead
 * of a small fixed-aspect box — the canvas and card should occupy the
 * full right half of the screen, with the card/lanyard framed inside
 * it by the camera logic in `visual/`, not by a boxed-in container.
 * On mobile, where the column collapses to auto-height single-column
 * stacking, a viewport-relative height keeps the card generously
 * sized without ever overflowing.
 * =====================================================================
 */

import IDCardCanvas from "./visual/IDCardCanvas";

const AboutVisual = () => {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center sm:h-[75vh] md:h-full">
      <div data-about-visual-frame className="h-full w-full">
        <IDCardCanvas />
      </div>
    </div>
  );
};

export default AboutVisual;
