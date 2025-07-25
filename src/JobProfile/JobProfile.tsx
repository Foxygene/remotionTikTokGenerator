import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
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

export const JobProfile: React.FC<z.infer<typeof jobSchema>> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Animate from 0 to 1 after 25 frames
  // const logoTranslationProgress = spring({
  //   frame: frame - 25,
  //   fps,
  //   config: {
  //     damping: 100,
  //   },
  // });

  // Move the logo up by 150 pixels once the transition starts
  // const logoTranslation = interpolate(
  //   logoTranslationProgress,
  //   [0, 1],
  //   [0, -150],
  // );

  // Fade out the animation at the end
  const opacity = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames - 15],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // A <AbsoluteFill> is just a absolutely positioned <div>!
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        fontWeight: "bold",
        color: "white",
        textShadow:
          "0px 10px 20px rgb(0 0 0 / 0.1), 0px 30px 20px rgb(0 0 0 / 0.1), 0px 40px 80px rgb(0 0 0 / 0.1), 0px 80px 160px rgb(0 0 0 / 0.1)",
      }}
    >
      {/* <AbsoluteFill style={{ opacity, backgroundColor: "red" }}> */}
      <AbsoluteFill style={{ flex: 1, opacity }}>
        <Sequence from={0}>
          <JobTitle titleText={props.Title} titleColor="#a29bfe" />
        </Sequence>
        <Sequence
          from={5}
          style={{ position: "absolute", bottom: 160, width: "100%" }}
        >
          <Info label="Salary" value={props.salary} />
        </Sequence>
        <Sequence
          from={10}
          style={{ position: "absolute", bottom: 80, width: "100%" }}
        >
          <Info label="Location" value={props.location} />
        </Sequence>
        <Sequence
          from={15}
          style={{ position: "absolute", bottom: 0, width: "100%" }}
        >
          <Info label="Job Type" value={props.jobType} />
        </Sequence>
        <Sequence from={20}>
          <Info label="Job Description" value={props.jobDescription} />
        </Sequence>
        <Sequence from={25}>
          <Info label="Job Description" value={props.jobDescription} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
