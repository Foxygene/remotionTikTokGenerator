import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CSSProperties } from "react";
import { useDecodedText } from "../utils/htmlDecode";

type TitleTextProps = {
  titleText: string;
};

export const TitleText = ({ titleText }: TitleTextProps) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();

  // 🚀 FIX SPECIAL CHARACTERS: Décoder les entités HTML (&amp; → &, etc.)
  const decodedTitle = useDecodedText(titleText);

  // 🚀 FIX LINE WRAPPING: Remplacer les tirets et ajouter des espaces autour des "/" pour permettre le retour à la ligne
  const normalizedTitle = decodedTitle
    .replace(/-/g, " ") // Remplacer les tirets par des espaces
    .replace(/\//g, " / ") // Ajouter des espaces autour des slashes
    .replace(/\s+/g, " "); // Normaliser les espaces multiples en un seul espace
  const words = normalizedTitle.split(" ").filter((word) => word.trim() !== ""); // Filtrer les mots vides

  // 🚀 NOUVELLE ANIMATION: Slide-in global comme les Info
  const slideSpring = spring({
    fps: videoConfig.fps,
    frame: frame,
    config: {
      // 🚀 SMOOTH ANIMATIONS: Config spring plus smooth sans bounce
      damping: 15, // Augmenté pour réduire le bounce
      mass: 1, // Valeur équilibrée pour un mouvement fluide
      stiffness: 80, // Réduit pour une animation plus douce
    },
  });

  // Calcul du slide transform (même logique que Info.tsx)
  const slideX = -100 + 100 * slideSpring;
  const slideTransform = `translate3d(${slideX}%, 0, 0)`;

  // 🚀 SYNCHRONISATION AMÉLIORÉE: Délais plus courts et plus prévisibles
  const springValues = words.map((_, i) => {
    const delay = i * 3; // Réduit de 5 à 3 pour des animations plus rapides
    return spring({
      fps: videoConfig.fps,
      frame: frame - delay,
      config: {
        // 🚀 SMOOTH ANIMATIONS: Config spring plus smooth sans bounce pour les mots
        damping: 20, // Augmenté pour un effet plus fluide
        mass: 1.2, // Légèrement plus lourd pour un mouvement plus élégant
        stiffness: 60, // Réduit pour une animation plus douce
      },
    });
  });

  // 🚀 FIX LAYOUT SHIFT: Style du container pour réserver l'espace complet
  const containerStyle: CSSProperties = {
    // Réserver l'espace complet pour éviter le layout shift
    width: "100%",
    minHeight: "1em", // Réserve la hauteur du texte
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.625rem", // Équivalent à mx-2.5 mais en gap
    // Optimisations de performance
    contain: "layout style",
    willChange: "transform, opacity",
    // 🚀 NOUVELLE ANIMATION: Slide-in transform
    transform: slideTransform,
    // Optimisations GPU pour l'animation de slide
    backfaceVisibility: "hidden",
    transformStyle: "preserve-3d",
  };

  // 🚀 FIX LAYOUT SHIFT: Style pour chaque mot
  const wordStyle: CSSProperties = {
    // 🚀 CRITICAL FIX: Réserver l'espace complet même quand invisible
    visibility: "visible", // Toujours visible pour le layout
    display: "inline-block",
    // 🚀 CRITICAL FIX: transform-origin centré pour éviter les shifts
    transformOrigin: "center center",
    // Optimisations GPU
    backfaceVisibility: "hidden",
    willChange: "transform, opacity",
    // 🚀 FIX: Assurer que l'espace est toujours réservé
    minWidth: "fit-content",
    textAlign: "center",
    // 🚀 FIX: Éviter que le texte cause des reflows
    whiteSpace: "nowrap",
  };

  return (
    <h1 className="text-8xl w-full roboto-title" style={containerStyle}>
      {words.map((t, i) => {
        // 🚀 OPTIMISATION: Utiliser les springs précalculés
        const springValue = springValues[i];

        // 🚀 SYNCHRONISATION: Animation plus prévisible avec scale minimal plus élevé
        const scale = 0.3 + 0.7 * springValue; // Va de 0.3 à 1.0 (au lieu de 0.1 à 1.0)
        const opacity = Math.max(0.1, springValue); // Opacity minimale pour éviter la disparition complète

        return (
          <span
            key={t}
            style={{
              ...wordStyle,
              // 🚀 SYNCHRONISATION: Transform plus visible et prévisible
              transform: `scale(${scale})`,
              opacity: opacity,
            }}
          >
            {t}
          </span>
        );
      })}
    </h1>
  );
};
