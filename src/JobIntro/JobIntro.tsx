import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  StaticFile,
  OffthreadVideo,
  AbsoluteFill,
  Img,
  staticFile,
  Sequence,
} from "remotion";
import { z } from "zod";
import type { CSSProperties } from "react";
import { Info } from "../components/Info";
import { Today } from "../components/Date";

// Schema pour un job simplifié (titre + salaire)
export const jobIntroSchema = z.object({
  title: z.string(),
  salary: z.string(),
});

type JobIntroData = z.infer<typeof jobIntroSchema>;

const fontStyle: CSSProperties = {
  textShadow:
    "0px 10px 20px rgb(0 0 0 / 0.1), 0px 30px 20px rgb(0 0 0 / 0.1), 0px 40px 80px rgb(0 0 0 / 0.1), 0px 80px 160px rgb(0 0 0 / 0.1)",
  willChange: "opacity",
};

export const JobIntro = ({
  videoBg,
  jobs,
}: {
  videoBg: StaticFile;
  jobs: JobIntroData[];
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🚀 ANIMATION: Slide-in du sticker depuis le haut
  const stickerSlideSpring = spring({
    fps,
    frame: frame,
    config: {
      // 🚀 SMOOTH ANIMATIONS: Config spring plus smooth sans bounce
      damping: 15, // Augmenté pour réduire le bounce
      mass: 1, // Valeur équilibrée pour un mouvement fluide
      stiffness: 80, // Réduit pour une animation plus douce
    },
  });

  // Slide depuis le haut (Y négatif vers 0)
  const stickerSlideY = -200 + 200 * stickerSlideSpring;
  const stickerTransform = `translate3d(0, ${stickerSlideY}px, 0)`;

  // 🚀 TIMING: Délais pour les éléments
  const dateDelay = 20; // Date apparaît après le sticker
  const infoBaseDelay = 35; // Premier Info après la date
  const infoDelayStep = 8; // Délai entre chaque Info

  // 🚀 OPTIMISATION: Précalculer les springs pour les Info
  const infoSpringValues = jobs.flatMap((_, jobIdx) => [
    // Spring pour le titre du job
    spring({
      fps,
      frame: Math.max(0, frame - (infoBaseDelay + jobIdx * 2 * infoDelayStep)),
      config: {
        // 🚀 SMOOTH ANIMATIONS: Config spring plus smooth sans bounce
        damping: 15, // Augmenté pour réduire le bounce
        mass: 1, // Valeur équilibrée pour un mouvement fluide
        stiffness: 80, // Réduit pour une animation plus douce
      },
    }),
    // Spring pour le salaire du job
    spring({
      fps,
      frame: Math.max(
        0,
        frame - (infoBaseDelay + (jobIdx * 2 + 1) * infoDelayStep)
      ),
      config: {
        // 🚀 SMOOTH ANIMATIONS: Config spring plus smooth sans bounce
        damping: 15, // Augmenté pour réduire le bounce
        mass: 1, // Valeur équilibrée pour un mouvement fluide
        stiffness: 80, // Réduit pour une animation plus douce
      },
    }),
  ]);

  // 🚀 OPTIMISATION: Précalculer les transforms pour les Info
  const infoSlideTransforms = infoSpringValues.map((springVal) => {
    const slideX = -100 + 100 * springVal;
    return `translate3d(${slideX}%, 0, 0)`;
  });

  return (
    <>
      {/* Vidéo de fond */}
      <AbsoluteFill>
        <OffthreadVideo src={videoBg.src} />
      </AbsoluteFill>

      {/* Contenu principal - dans AbsoluteFill pour remplir toute la composition */}
      <AbsoluteFill>
        <div
          className="flex flex-col items-center p-5 gap-8 text-white font-bold"
          style={{
            ...fontStyle,
            paddingTop: "2rem",
          }}
        >
          {/* Sticker titre avec slide-in du haut */}
          <div
            style={{
              transform: stickerTransform,
              willChange: "transform",
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            }}
          >
            <Img
              src={staticFile("raw-removebg-preview.png")}
              style={{
                width: "600px", // x2 plus grand (300px → 600px)
                height: "auto",
                filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))",
              }}
            />
          </div>

          {/* Date avec délai */}
          <Sequence from={dateDelay} name="Date">
            <Today />
          </Sequence>

          {/* Container pour les Info jobs */}
          <div className="flex flex-col gap-6 w-full max-w-4xl">
            {jobs.map((job, jobIdx) => {
              const titleDelay = infoBaseDelay + jobIdx * 2 * infoDelayStep;
              const salaryDelay =
                infoBaseDelay + (jobIdx * 2 + 1) * infoDelayStep;

              const titleTransform = infoSlideTransforms[jobIdx * 2];
              const salaryTransform = infoSlideTransforms[jobIdx * 2 + 1];

              // 🚀 ALTERNANCE: Calculer l'index global pour une vraie alternance
              const titleGlobalIndex = jobIdx * 2;
              const salaryGlobalIndex = jobIdx * 2 + 1;

              return (
                <div key={jobIdx} className="flex flex-col gap-4">
                  {/* Titre du job */}
                  {frame >= titleDelay && (
                    <Sequence
                      from={titleDelay}
                      name={`Job-${jobIdx + 1}-Title`}
                      style={{
                        position: "relative",
                        transform: titleTransform,
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                        contain: "layout style paint",
                        isolation: "isolate",
                      }}
                    >
                      <Info
                        value={job.title}
                        isAlternate={titleGlobalIndex % 2 === 1}
                      />
                    </Sequence>
                  )}

                  {/* Salaire du job */}
                  {frame >= salaryDelay && (
                    <Sequence
                      from={salaryDelay}
                      name={`Job-${jobIdx + 1}-Salary`}
                      style={{
                        position: "relative",
                        transform: salaryTransform,
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                        contain: "layout style paint",
                        isolation: "isolate",
                      }}
                    >
                      <Info
                        value={job.salary}
                        isAlternate={salaryGlobalIndex % 2 === 1}
                        isSalary={true}
                      />
                    </Sequence>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};
