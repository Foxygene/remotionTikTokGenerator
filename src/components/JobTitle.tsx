import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  StaticFile,
  OffthreadVideo,
  AbsoluteFill,
  Sequence,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import type { CSSProperties } from "react";
import { Info } from "./Info";
import { Today } from "./Date";

type JobTitleProps = {
  videoBg: StaticFile;
  jobs: Array<{
    title: string;
    salary: string;
  }>;
};

export const JobTitle = ({ videoBg, jobs }: JobTitleProps) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();

  // 🚀 ANIMATION STICKER: Slide-in depuis le haut
  const stickerSpring = spring({
    fps: videoConfig.fps,
    frame: frame,
    config: {
      damping: 8,
      mass: 1,
      stiffness: 100,
    },
  });

  // Transform pour slide-in du haut
  const stickerY = -200 + 200 * stickerSpring;
  const stickerTransform = `translate3d(0, ${stickerY}px, 0)`;

  // 🚀 ANIMATION DATE: Apparition après le sticker
  const dateOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 🚀 ANIMATION INFO: 6 composants avec délais échelonnés
  const baseDelay = 60; // Commencer après sticker + date
  const delayStep = 15; // Délai entre chaque Info

  // Style de base avec ombre de texte
  const fontStyle: CSSProperties = {
    textShadow:
      "0px 10px 20px rgb(0 0 0 / 0.1), 0px 30px 20px rgb(0 0 0 / 0.1), 0px 40px 80px rgb(0 0 0 / 0.1), 0px 80px 160px rgb(0 0 0 / 0.1)",
    willChange: "opacity",
  };

  // Précalculer les springs pour les 6 Info
  const infoSprings = Array.from({ length: 6 }, (_, idx) => {
    const delay = baseDelay + idx * delayStep;
    return spring({
      fps: videoConfig.fps,
      frame: Math.max(0, frame - delay),
      config: {
        damping: 6,
        mass: 0.8,
        stiffness: 120,
      },
    });
  });

  // Précalculer les transformations slide-in pour les Info
  const infoTransforms = infoSprings.map((springVal) => {
    const slideX = -100 + 100 * springVal;
    return `translate3d(${slideX}%, 0, 0)`;
  });

  return (
    <>
      {/* 🚀 BACKGROUND VIDEO */}
      <AbsoluteFill>
        <OffthreadVideo src={videoBg.src} />
      </AbsoluteFill>

      {/* 🚀 CONTENU PRINCIPAL */}
      <div
        className="relative w-full h-screen text-white font-bold"
        style={fontStyle}
      >
        {/* 🚀 STICKER - Animation slide-in du haut - Position absolue en haut centre */}
        <div
          className="absolute top-16 left-1/2"
          style={{
            transform: `translate(-50%, 0) ${stickerTransform}`,
            willChange: "transform",
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
        >
          <Img
            src={staticFile("raw-removebg-preview.png")}
            className="w-48 h-48 object-contain"
            style={{
              filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))",
            }}
          />
        </div>

        {/* 🚀 DATE - Position absolue sous le sticker */}
        <div
          className="absolute top-80 left-1/2"
          style={{
            transform: "translate(-50%, 0)",
            opacity: dateOpacity,
            willChange: "opacity",
          }}
        >
          <Today />
        </div>

        {/* 🚀 INFO COMPONENTS - Positionnement absolu dans une grille */}
        <div
          className="absolute top-96 left-1/2 w-full max-w-5xl px-8"
          style={{
            transform: "translate(-50%, 0)",
            height: "400px", // Hauteur fixe pour contenir tous les Info
          }}
        >
          {jobs.slice(0, 3).map((job, jobIdx) => {
            // Pour chaque job, on crée 2 Info : titre et salaire
            const titleIdx = jobIdx * 2;
            const salaryIdx = jobIdx * 2 + 1;
            const titleDelay = baseDelay + titleIdx * delayStep;
            const salaryDelay = baseDelay + salaryIdx * delayStep;

            // 🚀 POSITIONS ABSOLUES: Définir des positions fixes pour chaque Info
            // Organiser en 2 colonnes : gauche pour les titres, droite pour les salaires
            const titlePositions = [
              { top: "0px", left: "0%" }, // Job 1 titre - gauche haut
              { top: "140px", left: "0%" }, // Job 2 titre - gauche milieu
              { top: "280px", left: "0%" }, // Job 3 titre - gauche bas
            ];

            const salaryPositions = [
              { top: "70px", right: "0%" }, // Job 1 salaire - droite haut
              { top: "210px", right: "0%" }, // Job 2 salaire - droite milieu
              { top: "350px", right: "0%" }, // Job 3 salaire - droite bas
            ];

            return (
              <div key={jobIdx}>
                {/* Info pour le titre du job - Position absolue à gauche */}
                {frame >= titleDelay && (
                  <Sequence
                    name={`Job ${jobIdx + 1} Title`}
                    from={titleDelay}
                    style={{
                      position: "absolute",
                      top: titlePositions[jobIdx].top,
                      left: titlePositions[jobIdx].left,
                      width: "45%",
                      transform: infoTransforms[titleIdx],
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                      contain: "layout style paint",
                      isolation: "isolate",
                    }}
                  >
                    <Info value={job.title} isAlternate={titleIdx % 2 === 1} />
                  </Sequence>
                )}

                {/* Info pour le salaire du job - Position absolue à droite */}
                {frame >= salaryDelay && (
                  <Sequence
                    name={`Job ${jobIdx + 1} Salary`}
                    from={salaryDelay}
                    style={{
                      position: "absolute",
                      top: salaryPositions[jobIdx].top,
                      right: salaryPositions[jobIdx].right,
                      width: "45%",
                      transform: infoTransforms[salaryIdx],
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                      contain: "layout style paint",
                      isolation: "isolate",
                    }}
                  >
                    <Info
                      value={job.salary}
                      isAlternate={salaryIdx % 2 === 1}
                    />
                  </Sequence>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
