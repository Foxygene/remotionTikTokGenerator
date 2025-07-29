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
import { TitleText } from "../components/TitleText";
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
  // Ajout de will-change pour optimiser les transitions
  willChange: "opacity",
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

  const infoItems = [
    { label: "Salary", value: job.salary },
    { label: "Job Type", value: job.jobType },
    { label: "Date Posted", value: job.datePosted },
    { label: "Job Description", value: job.jobDescription },
  ];

  // 🚀 OPTIMISATION: Timing plus espacé pour réduire les calculs simultanés
  const baseDelay = 8; // Réduit de 15 à 8 pour x2 plus rapide
  const delayStep = 8; // Réduit de 15 à 8 pour x2 plus rapide

  // 🚀 OPTIMISATION: Précalculer TOUS les springs en dehors du rendu
  // avec une configuration plus performante
  const springValues = infoItems.map((_, idx) => {
    const delay = baseDelay + idx * delayStep;
    return spring({
      fps,
      frame: Math.max(0, frame - delay),
      config: {
        // 🚀 SMOOTH ANIMATIONS: Config spring plus smooth sans bounce
        damping: 15, // Augmenté pour réduire le bounce
        mass: 1, // Valeur équilibrée pour un mouvement fluide
        stiffness: 80, // Réduit pour une animation plus douce
      },
    });
  });

  // 🚀 OPTIMISATION: Précalculer toutes les transformations avec memoization
  const slideTransforms = springValues.map((springVal) => {
    // Utiliser transform3d au lieu de translateX pour l'accélération GPU
    const slideX = -100 + 100 * springVal;
    return `translate3d(${slideX}%, 0, 0)`;
  });

  // Gestion d'erreur pour la vidéo
  const handleVideoError = (error: Error) => {
    console.error("Erreur de chargement de la vidéo background:", error);
  };

  return (
    <>
      <AbsoluteFill>
        <OffthreadVideo
          src={videoBg.src}
          volume={0} // Désactive l'audio pour les vidéos background
          muted // Double sécurité pour l'audio
          onError={handleVideoError} // Gestion d'erreur
          toneMapped={false} // Améliore les performances
          showInTimeline={false} // Masque dans la timeline du studio
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
      {/* Contenu principal - dans AbsoluteFill pour remplir toute la composition */}
      <AbsoluteFill>
        <div
          className="flex flex-col p-5 gap-10 text-white font-bold pt-64"
          style={{
            ...fontStyle,
            // 🚀 OPTIMISATION: Retirer l'opacity d'ici pour éviter la double opacity
            // L'opacity est maintenant sur la vidéo de fond
          }}
        >
          <Sequence
            name="JobTitle"
            from={0}
            durationInFrames={durationInFrames} // Durée complète de la composition, indépendante des delays
            style={{
              position: "relative",
              willChange: "transform, opacity",
            }}
            className="py-10 justify-center text-white font-bold rounded-2xl bg-opacity-20 backdrop-blur-3xl shadow-2xl"
          >
            <TitleText titleText={job.Title} />
          </Sequence>
          {/* ---------------------------------------------- */}
          {infoItems.map((item, idx) => {
            const delay = baseDelay + idx * delayStep;
            // 🚀 OPTIMISATION: Utiliser les transformations précalculées
            const slideTransform = slideTransforms[idx];

            // 🚀 OPTIMISATION: Ne rendre que si l'animation a commencé pour économiser les ressources
            if (frame < delay) {
              return null;
            }

            return (
              <Sequence
                key={item.label + item.value}
                name={item.label}
                from={delay}
                style={{
                  position: "relative",
                  // 🚀 OPTIMISATION: Utiliser transform3d pour l'accélération GPU maximale
                  transform: slideTransform,
                  // 🚀 OPTIMISATION: will-change optimisé seulement pour transform
                  willChange: "transform",
                  // Optimisations CSS critiques pour les performances
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                  // 🚀 OPTIMISATION: CSS Containment pour éviter les re-layouts
                  contain: "layout style paint",
                  // 🚀 OPTIMISATION: Isolation pour réduire les repaints
                  isolation: "isolate",
                }}
                className="slide-animation"
              >
                <Info
                  value={item.value}
                  isAlternate={idx % 2 === 1}
                  isSalary={item.label === "Salary"}
                />
              </Sequence>
            );
          })}
        </div>
      </AbsoluteFill>
    </>
  );
};
