import { interpolate, useCurrentFrame } from "remotion";

export const Info = ({ label, value }: { label?: string; value: string }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  return (
    <div className="text-6xl flex flex-col gap-5" style={{ opacity }}>
      {label && (
        <div className="w-full bg-sky-300 rounded-2xl p-6 text-center">
          {label}
        </div>
      )}
      <div className="w-full bg-pink-300 rounded-2xl p-6 text-center">
        {value}
      </div>
    </div>
  );
};
