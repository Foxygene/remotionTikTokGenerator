import { interpolate, useCurrentFrame } from "remotion";

export const Today = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  const today = new Date();
  return (
    <div className="text-6xl flex flex-col gap-5" style={{ opacity }}>
      <div className="bg-sky-300 rounded-2xl p-6 text-center">
        {today.toLocaleDateString("fr-FR")}
      </div>
    </div>
  );
};
