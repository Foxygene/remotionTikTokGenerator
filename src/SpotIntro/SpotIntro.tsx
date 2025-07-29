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

// Schema pour un spot simplifié (nom + coût)
export const spotIntroSchema = z.object({
  title: z.string(),
  salary: z.string(),
});

type SpotIntroData = z.infer<typeof spotIntroSchema>;

const fontStyle: CSSProperties = {
  textShadow:
    "0px 10px 20px rgb(0 0 0 / 0.1), 0px 30px 20px rgb(0 0 0 / 0.1), 0px 40px 80px rgb(0 0 0 / 0.1), 0px 80px 160px rgb(0 0 0 / 0.1)",
  willChange: "opacity",
};

export const SpotIntro = ({
  videoBg,
  spots,
}: {
  videoBg: StaticFile;
  spots: SpotIntroData[];
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation: Slide-in du sticker depuis le haut
  const stickerSlideSpring = spring({
    fps,
    frame: frame,
    config: {
      // Config spring plus smooth sans bounce
      damping: 15, // Augmenté pour réduire le bounce
      mass: 1, // Valeur équilibrée pour un mouvement fluide
      stiffness: 80, // Réduit pour une animation plus douce
    },
  });

  // Slide depuis le haut (Y négatif vers 0)
  const stickerSlideY = -200 + 200 * stickerSlideSpring;
  const stickerTransform = `translate3d(0, ${stickerSlideY}px, 0)`;

  // TIMING: Délais pour les éléments
  const dateDelay = 20; // Date apparaît après le sticker
  const infoBaseDelay = 35; // Premier Info après la date
  const infoDelayStep = 8; // Délai entre chaque Info

  // OPTIMISATION: Précalculer les springs pour les Info
  const infoSpringValues = spots.flatMap((_, spotIdx) => [
    // Spring pour le titre du spot
    spring({
      fps,
      frame: Math.max(0, frame - (infoBaseDelay + spotIdx * 2 * infoDelayStep)),
      config: {
        // Config spring plus smooth sans bounce
        damping: 15, // Augmenté pour réduire le bounce
        mass: 1, // Valeur équilibrée pour un mouvement fluide
        stiffness: 80, // Réduit pour une animation plus douce
      },
    }),
    // Spring pour le coût du spot
    spring({
      fps,
      frame: Math.max(
        0,
        frame - (infoBaseDelay + (spotIdx * 2 + 1) * infoDelayStep)
      ),
      config: {
        // Config spring plus smooth sans bounce
        damping: 15, // Augmenté pour réduire le bounce
        mass: 1, // Valeur équilibrée pour un mouvement fluide
        stiffness: 80, // Réduit pour une animation plus douce
      },
    }),
  ]);

  // OPTIMISATION: Précalculer les transforms pour les Info
  const infoSlideTransforms = infoSpringValues.map((springVal) => {
    const slideX = -100 + 100 * springVal;
    return `translate3d(${slideX}%, 0, 0)`;
  });

  const convertToStars = (value: string): string => {
    // Si c'est déjà au format "rating r3", extraire le nombre
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

    return value;
  };

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
              src={staticFile("spotIntro.png")}
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

          {/* Container pour les Info spots */}
          <div className="flex flex-col gap-6 w-full max-w-4xl">
            {spots.map((spot, spotIdx) => {
              const titleDelay = infoBaseDelay + spotIdx * 2 * infoDelayStep;
              const salaryDelay =
                infoBaseDelay + (spotIdx * 2 + 1) * infoDelayStep;

              const titleTransform = infoSlideTransforms[spotIdx * 2];
              const salaryTransform = infoSlideTransforms[spotIdx * 2 + 1];

              // ALTERNANCE: Calculer l'index global pour une vraie alternance
              const titleGlobalIndex = spotIdx * 2;
              const salaryGlobalIndex = spotIdx * 2 + 1;

              console.log(spot.salary, "salary");
              return (
                <div key={spotIdx} className="flex flex-col gap-4">
                  {/* Titre du spot */}
                  {frame >= titleDelay && (
                    <Sequence
                      from={titleDelay}
                      name={`Spot-${spotIdx + 1}-Title`}
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
                        value={spot.title}
                        isAlternate={titleGlobalIndex % 2 === 1}
                      />
                    </Sequence>
                  )}

                  {/* Coût du spot */}
                  {frame >= salaryDelay && (
                    <Sequence
                      from={salaryDelay}
                      name={`Spot-${spotIdx + 1}-Cost`}
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
                        value={convertToStars(spot.salary)}
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
