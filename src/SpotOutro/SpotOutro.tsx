import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  StaticFile,
  OffthreadVideo,
  AbsoluteFill,
  Img,
  staticFile,
} from "remotion";
import type { CSSProperties } from "react";

const fontStyle: CSSProperties = {
  textShadow:
    "0px 10px 20px rgb(0 0 0 / 0.1), 0px 30px 20px rgb(0 0 0 / 0.1), 0px 40px 80px rgb(0 0 0 / 0.1), 0px 80px 160px rgb(0 0 0 / 0.1)",
  willChange: "opacity",
};

export const SpotOutro = ({ videoBg }: { videoBg: StaticFile }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ANIMATION: Apparition du sticker avec un effet de zoom/fade
  const stickerSpring = spring({
    fps,
    frame: frame,
    config: {
      damping: 6,
      mass: 0.8,
      stiffness: 120,
    },
  });

  // OPTIMISATION: Styles CSS optimisés pour les performances
  const containerStyle: CSSProperties = {
    ...fontStyle,
    // Force l'accélération GPU
    transform: "translateZ(0)",
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
    // Optimisation du compositing
    contain: "layout style paint",
    position: "relative",
  };

  const stickerStyle: CSSProperties = {
    // Animation de zoom et opacity
    transform: `translateZ(0) scale(${0.5 + 0.5 * stickerSpring})`,
    opacity: stickerSpring,
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
    transformStyle: "preserve-3d",
    // Filtre pour l'ombre
    filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))",
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
          className="flex items-center justify-center text-white font-bold h-full"
          style={containerStyle}
        >
          <div style={stickerStyle}>
            <Img
              src={staticFile("spotOutro.png")}
              style={{
                width: "2400px", // x6 plus grand (400px → 2400px, soit x2 de la taille actuelle)
                height: "auto",
                // Retirer les contraintes maxWidth/maxHeight pour permettre la vraie taille
                // maxWidth: "90vw",
                // maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};
