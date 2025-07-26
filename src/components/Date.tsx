import { interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";

export const Today = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  const today = new Date();

  // 🚀 OPTIMISATIONS: Style simple pour la date
  const dateStyle: CSSProperties = {
    opacity,
    // Optimisations GPU
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "opacity, transform",
  };

  return (
    <div className="text-6xl flex flex-col gap-5">
      <div className="bg-sky-300 rounded-2xl p-6 text-center" style={dateStyle}>
        {today.toLocaleDateString("fr-FR")}
      </div>
    </div>
  );
};
