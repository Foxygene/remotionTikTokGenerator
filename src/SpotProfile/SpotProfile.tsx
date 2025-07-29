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
import { SpotInfo } from "../components/SpotInfo";

export const spotSchema = z.object({
  Id: z.number().optional(),
  name: z.string(),
  country: z.string(),
  cost_usd: z.union([z.string(), z.number()]),
  internet_speed: z.union([z.string(), z.number()]),
  overall_rating: z.union([z.string(), z.number()]),
  temperature: z.union([z.string(), z.number()]),
});

const fontStyle: CSSProperties = {
  textShadow:
    "0px 10px 20px rgb(0 0 0 / 0.1), 0px 30px 20px rgb(0 0 0 / 0.1), 0px 40px 80px rgb(0 0 0 / 0.1), 0px 80px 160px rgb(0 0 0 / 0.1)",
  // Ajout de will-change pour optimiser les transitions
  willChange: "opacity",
};

export const SpotProfile = ({
  videoBg,
  spot,
}: {
  videoBg: StaticFile;
  spot: z.infer<typeof spotSchema>;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const infoItems = [
    { label: "Pays", value: spot.country, isRating: false },
    { label: "Coût (USD/mois)", value: `$${spot.cost_usd}`, isRating: false },
    {
      label: "Débit internet",
      value: `${spot.internet_speed} Mbps`,
      isRating: false,
    },
    {
      label: "Note Globale",
      value: `${spot.overall_rating}/10`,
      isRating: true,
    },
    { label: "Température", value: `${spot.temperature}C`, isRating: false },
  ];

  // Animation des éléments principaux (titre + infos)
  const titleAnimation = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 200,
    },
  });

  const infoAnimation = spring({
    frame: frame - 20,
    fps,
    config: {
      damping: 200,
    },
  });

  // Animation d'entrée progressive pour chaque info
  const getInfoItemAnimation = (index: number) => {
    return spring({
      frame: frame - 30 - index * 5,
      fps,
      config: {
        damping: 200,
      },
    });
  };

  // Masquer les éléments vers la fin
  const exitAnimation = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateY = interpolate(titleAnimation, [0, 1], [150, 0]);
  const opacity = titleAnimation;

  return (
    <AbsoluteFill>
      {/* Vidéo de fond */}
      <OffthreadVideo
        src={videoBg.src}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      {/* Overlay sombre pour lisibilité */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
          zIndex: 0,
        }}
      />

      {/* Titre principal */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          paddingLeft: 60,
          paddingRight: 60,
          zIndex: 1,
        }}
      >
        <div
          style={{
            transform: `translateY(${translateY}px)`,
            opacity: opacity * exitAnimation,
            ...fontStyle,
            color: "white",
          }}
        >
          <TitleText titleText={spot.name} />
        </div>

        {/* Informations */}
        <div
          style={{
            marginTop: 40,
            opacity: infoAnimation * exitAnimation,
            transform: `translateY(${interpolate(
              infoAnimation,
              [0, 1],
              [50, 0]
            )}px)`,
          }}
        >
          {infoItems.map((item, index) => (
            <div
              key={index}
              style={{
                opacity: getInfoItemAnimation(index) * exitAnimation,
                transform: `translateY(${interpolate(
                  getInfoItemAnimation(index),
                  [0, 1],
                  [30, 0]
                )}px)`,
                marginBottom: 20,
              }}
            >
              <SpotInfo
                label={item.label}
                value={item.value}
                isAlternate={getInfoItemAnimation(index) % 2 === 1}
                isRating={item.isRating}
              />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
