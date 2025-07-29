import type { CSSProperties } from "react";
import { useDecodedText } from "../utils/htmlDecode";

export const SpotInfo = ({
  label,
  value,
  isAlternate = false,
  isRating = false,
}: {
  label?: string;
  value: string;
  isAlternate?: boolean;
  isRating?: boolean;
}) => {
  // Décoder les entités HTML (&amp; → &, etc.)
  const decodedLabel = label ? useDecodedText(label) : undefined;
  const decodedValue = useDecodedText(value);

  // Fonction pour convertir une note numérique en étoiles
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

  // Ajouter ":" au label s'il n'en a pas déjà
  const formatLabel = (label: string): string => {
    return label.endsWith(":") ? label : `${label}:`;
  };

  // Couleurs alternées entre rose et bleu ciel
  const labelBgColor = isAlternate ? "bg-sky-400" : "bg-sky-300";
  const valueBgColor = isAlternate ? "bg-sky-300" : "bg-pink-300";

  // Styles optimisés pour les performances
  const containerStyle: CSSProperties = {
    transform: "translateZ(0)",
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
    contain: "layout style paint",
    position: "relative",
  };

  const itemStyle: CSSProperties = {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "background-color, transform",
    contain: "layout style paint",
    wordWrap: "break-word",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    hyphens: "auto",
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  // Styles pour les labels (gras) et valeurs (italique)
  const labelStyle: CSSProperties = {
    ...itemStyle,
    fontWeight: "bold",
  };

  const valueStyle: CSSProperties = {
    ...itemStyle,
    fontStyle: "italic",
  };

  // Traitement spécial pour les étoiles
  const displayValue = isRating ? convertToStars(decodedValue) : decodedValue;

  return (
    <div
      className="text-6xl flex flex-col gap-5 gpu-accelerated roboto-info"
      style={containerStyle}
    >
      {decodedLabel && (
        <div
          className={`w-full ${labelBgColor} rounded-2xl p-6 text-center`}
          style={labelStyle}
        >
          {formatLabel(decodedLabel)}
        </div>
      )}
      <div
        className={`w-full ${valueBgColor} rounded-2xl p-6 text-center`}
        style={valueStyle}
      >
        {displayValue}
      </div>
    </div>
  );
};
