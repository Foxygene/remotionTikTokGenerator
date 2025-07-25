import {
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  StaticFile,
  OffthreadVideo,
  AbsoluteFill,
} from "remotion";
import { z } from "zod";
import type { CSSProperties } from "react";
import { JobTitle } from "../components/JobTitle";
import { Info } from "../components/Info";

export const jobSchema = z.object({
  Id: z.number(),
  Title: z.string(),
  company: z.string(),
  category: z.string(),
  salary: z.string(),
  location: z.string(),
  datePosted: z.string(),
  jobUrl: z.string(),
  jobDescription: z.string(),
  jobType: z.string(),
});

const fontStyle: CSSProperties = {
  textShadow:
    "0px 10px 20px rgb(0 0 0 / 0.1), 0px 30px 20px rgb(0 0 0 / 0.1), 0px 40px 80px rgb(0 0 0 / 0.1), 0px 80px 160px rgb(0 0 0 / 0.1)",
};

export const JobProfile = ({
  videoBg,
  job,
}: {
  videoBg: StaticFile;
  job: z.infer<typeof jobSchema>;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const fadeInStyle = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames - 15],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const infoItems = [
    { label: "Salary", value: job.salary },
    { label: "Job Type", value: job.jobType },
    { label: "Date Posted", value: job.datePosted },
    { label: "Job Description", value: job.jobDescription },
  ];

  const baseDelay = 10;
  const delayStep = 10;

  // Precompute all spring values for infoItems
  const springVals = infoItems.map((_, idx) => {
    const delay = baseDelay + idx * delayStep;
    return spring({
      fps,
      frame: Math.max(0, frame - delay),
      config: {
        damping: 12,
        mass: 0.8,
        stiffness: 120,
      },
    });
  });

  return (
    <>
      <AbsoluteFill>
        <OffthreadVideo src={videoBg.src} />
      </AbsoluteFill>
      <div
        className="flex flex-col p-5 gap-10 text-white font-bold pt-64"
        style={fontStyle}
      >
        <Sequence
          name="JobTitle"
          from={0}
          style={{ position: "relative" }}
          className="py-10 justify-center text-white font-bold rounded-2xl bg-opacity-20 backdrop-blur-3xl shadow-2xl"
        >
          <div style={{ opacity: fadeInStyle }}>
            <JobTitle titleText={job.Title} />
          </div>
        </Sequence>
        {/* ---------------------------------------------- */}
        {infoItems.map((item, idx) => {
          const delay = baseDelay + idx * delayStep;
          const springVal = springVals[idx];
          const slideIn = -100 + 100 * springVal;

          return (
            <Sequence
              key={item.label + item.value}
              name={item.label}
              from={delay}
              style={{
                position: "relative",
                opacity: fadeInStyle,
                transform: `translateX(${slideIn}%)`,
                willChange: "transform, opacity",
              }}
            >
              <Info value={item.value} />
            </Sequence>
          );
        })}
      </div>
    </>
  );
};
