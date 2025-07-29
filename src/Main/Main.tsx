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
  // Fonction pour convertir les textes rating en étoiles (même logique que SpotInfo)
  const convertRatingToStars = (value: string): string => {
    // Si c'est déjà au format "rating-main-score rating r3", extraire le nombre
    if (value.includes("rating r")) {
      const match = value.match(/r(\d+)/);
      if (match) {
        const numStars = parseInt(match[1]);
        return "★".repeat(Math.min(Math.max(numStars, 0), 5));
      }
    }

    // Si c'est un format comme "8.5/10", convertir
    if (value.includes("/10")) {
      const numValue = parseFloat(value.replace("/10", ""));
      const stars = Math.round(numValue / 2); // Convertir sur 5 étoiles
      return "★".repeat(Math.min(Math.max(stars, 0), 5));
    }

    // Si c'est un nombre simple, le traiter directement
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const stars = Math.round(numValue / 2);
      return "★".repeat(Math.min(Math.max(stars, 0), 5));
    }

    // Si ce n'est pas un rating, retourner tel quel
    return value;
  };

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
              salary: convertRatingToStars(job.salary),
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
