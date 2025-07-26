import { interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import { useDecodedText } from "../utils/htmlDecode";

export const Info = ({
  label,
  value,
  isAlternate = false,
  isSalary = false,
}: {
  label?: string;
  value: string;
  isAlternate?: boolean;
  isSalary?: boolean;
}) => {
  // 🚀 FIX SPECIAL CHARACTERS: Décoder les entités HTML (&amp; → &, etc.)
  const decodedLabel = label ? useDecodedText(label) : undefined;
  const decodedValue = useDecodedText(value);

  // 🚀 COULEURS: Alterner entre rose et bleu ciel
  const labelBgColor = isAlternate ? "bg-sky-400" : "bg-sky-300";
  const valueBgColor = isAlternate ? "bg-sky-300" : "bg-pink-300";

  // 🚀 POLICE ROBOTO: Détecter le type de contenu
  const textClass = isSalary ? "roboto-salary" : "roboto-info";

  // 🚀 OPTIMISATION: Styles CSS optimisés pour les performances
  const containerStyle: CSSProperties = {
    // Force l'accélération GPU pour éviter les repaints
    transform: "translateZ(0)",
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
    // Optimisation du compositing
    contain: "layout style paint",
    // Éviter les re-layouts avec les propriétés composited
    position: "relative",
  };

  const itemStyle: CSSProperties = {
    // Force l'accélération GPU pour chaque élément
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    // Optimisation pour les couleurs de background
    willChange: "background-color, transform",
    // Améliorer les performances de rendu
    contain: "layout style paint",
    // 🚀 ANTI-OVERFLOW: Empêcher le débordement de texte
    wordWrap: "break-word",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    hyphens: "auto",
    // Assurer que le texte reste dans les limites
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      className={`text-6xl flex flex-col gap-5 gpu-accelerated ${textClass}`}
      style={containerStyle}
    >
      {decodedLabel && (
        <div
          className={`w-full ${labelBgColor} rounded-2xl p-6 text-center`}
          style={itemStyle}
        >
          {decodedLabel}
        </div>
      )}
      <div
        className={`w-full ${valueBgColor} rounded-2xl p-6 text-center`}
        style={itemStyle}
      >
        {decodedValue}
      </div>
    </div>
  );
};
