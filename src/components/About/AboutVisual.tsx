/**
 * AboutVisual.tsx
 * =====================================================================
 * Right column of the About section — reserved for a future React
 * Three Fiber canvas (3D ID card, per the design brief).
 *
 * Layout only: this renders an empty, fixed-aspect-ratio frame that
 * fills its column and stays centered at every breakpoint. A future
 * <Canvas> (or any other visual) can be mounted directly inside
 * `[data-about-visual-frame]` at w-full/h-full with no layout changes
 * here — sizing and centering are already handled by this wrapper.
 * =====================================================================
 */

const AboutVisual = () => {
  return (
    <div className="flex w-full items-center justify-center md:h-full">
      {/*
        Fixed-aspect placeholder frame. aria-hidden because it currently
        renders no content — remove it once a real, meaningful visual
        (e.g. the 3D canvas) is mounted inside.
      */}
      <div
        data-about-visual-frame
        aria-hidden="true"
        className="aspect-4/5 w-full max-w-360px sm:max-w-420px md:h-70% md:w-auto md:max-w-none lg:h-[75%]"
      />
    </div>
  );
};

export default AboutVisual;
