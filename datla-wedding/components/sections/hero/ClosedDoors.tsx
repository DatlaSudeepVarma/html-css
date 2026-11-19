const FACE =
  "absolute inset-0 overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_0_40px_rgba(36,21,11,0.45)]";

export function DoorArt({ side }: { side: "left" | "right" }) {
  const suffix = side === "right" ? "-r" : "";
  return (
    <div className={FACE}>
      <picture>
        <source media="(max-aspect-ratio: 11/10)" srcSet={`/art/door-tall${suffix}.webp`} type="image/webp" />
        <img
          src={`/art/door-wide${suffix}.webp`}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-fill"
        />
      </picture>
    </div>
  );
}

/** Static first-paint doors. Not a client component, so they aren't in the hydration tree. */
export function ClosedDoors() {
  return (
    <div className="ssr-doors pointer-events-none absolute inset-0 z-10" aria-hidden>
      <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
        <DoorArt side="left" />
      </div>
      <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
        <DoorArt side="right" />
      </div>
    </div>
  );
}
