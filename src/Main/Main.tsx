import { Series, StaticFile } from "remotion";
import { JobIntro } from "../JobIntro/JobIntro";
import { JobProfile, jobSchema } from "../JobProfile/JobProfile";
import { JobOutro } from "../JobOutro/JobOutro";
import { RandomBackgroundMusic } from "../components/BackgroundMusic";
import { z } from "zod";

// 🚀 NOUVEAU: Props pour 3 jobs et 3 vidéos
export const Main = (props: {
  randomVideos: StaticFile[];
  jobs: z.infer<typeof jobSchema>[];
}) => {
  return (
    <>
      {/* 🎵 MUSIQUE DE FOND: Joue pendant toute la durée de la vidéo */}
      <RandomBackgroundMusic />

      <Series>
        {/* JobIntro en premier */}
        <Series.Sequence durationInFrames={150}>
          <JobIntro
            videoBg={props.randomVideos[0]}
            jobs={props.jobs.slice(0, 3).map((job) => ({
              title: job.Title,
              salary: job.salary,
            }))}
          />
        </Series.Sequence>

        {/* 🚀 NOUVEAU: 3 JobProfile séquences avec jobs et vidéos uniques */}
        {props.jobs.map((job, index) => (
          <Series.Sequence key={job.Id || index} durationInFrames={450}>
            <div>
              <JobProfile
                videoBg={props.randomVideos[index] || props.randomVideos[0]}
                job={job}
              />
            </div>
          </Series.Sequence>
        ))}

        {/* JobOutro en final */}
        <Series.Sequence durationInFrames={450}>
          <JobOutro
            videoBg={
              props.randomVideos[props.randomVideos.length - 1] ||
              props.randomVideos[0]
            }
          />
        </Series.Sequence>
      </Series>
    </>
  );
};
