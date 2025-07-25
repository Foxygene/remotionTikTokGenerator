import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type JobTitleProps = {
  titleText: string;
};

export const JobTitle = ({ titleText }: JobTitleProps) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();

  const words = titleText.split(" ");

  return (
    <h1 className="text-8xl">
      {words.map((t, i) => {
        const delay = i * 5;
        const scale = spring({
          fps: videoConfig.fps,
          frame: frame - delay,
          config: {
            damping: 200,
          },
        });

        return (
          <span
            key={t}
            className="inline-block mx-2.5"
            style={{ transform: `scale(${scale})` }}
          >
            {t}
          </span>
        );
      })}
    </h1>
  );
};
