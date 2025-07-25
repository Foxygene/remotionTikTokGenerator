import { Series, StaticFile } from "remotion";
import { JobIntro } from "../JobIntro/JobIntro";
import { JobProfile, jobSchema } from "../JobProfile/JobProfile";
import { z } from "zod";

export const Main = (props: {
  randomVideo: StaticFile;
  job: z.infer<typeof jobSchema>;
}) => {
  return (
    <Series>
      <Series.Sequence durationInFrames={120}>
        <JobIntro />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <div>
          <JobProfile videoBg={props.randomVideo} job={props.job} />
        </div>
      </Series.Sequence>
    </Series>
  );
};
