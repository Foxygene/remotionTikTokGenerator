/**
 * 🚀 UTILITY: Décodage des entités HTML pour Remotion
 *
 * Résout le problème des caractères spéciaux affichés comme &amp; au lieu de &
 * Basé sur les meilleures pratiques de décodage HTML en JavaScript
 */

// Map des entités HTML courantes vers leurs caractères réels
const HTML_ENTITIES_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&copy;": "\u00A9",
  "&reg;": "\u00AE",
  "&trade;": "\u2122",
  "&euro;": "\u20AC",
  "&pound;": "\u00A3",
  "&yen;": "\u00A5",
  "&cent;": "\u00A2",
  "&sect;": "\u00A7",
  "&para;": "\u00B6",
  "&bull;": "\u2022",
  "&hellip;": "\u2026",
  "&ndash;": "\u2013",
  "&mdash;": "\u2014",
  "&lsquo;": "\u2018",
  "&rsquo;": "\u2019",
  "&ldquo;": "\u201C",
  "&rdquo;": "\u201D",
  "&laquo;": "\u00AB",
  "&raquo;": "\u00BB",
};

/**
 * Décode les entités HTML dans une chaîne de caractères
 *
 * @param text - Texte contenant potentiellement des entités HTML
 * @returns Texte avec les entités HTML décodées
 *
 * @example
 * ```typescript
 * decodeHtmlEntities("Johnson &amp; Johnson") // "Johnson & Johnson"
 * decodeHtmlEntities("Price: &lt; $100") // "Price: < $100"
 * ```
 */
export function decodeHtmlEntities(text: string): string {
  if (!text || typeof text !== "string") {
    return text || "";
  }

  let decodedText = text;

  // Méthode 1: Remplacer les entités nommées courantes
  Object.entries(HTML_ENTITIES_MAP).forEach(([entity, char]) => {
    decodedText = decodedText.replace(new RegExp(entity, "g"), char);
  });

  // Méthode 2: Décoder les entités numériques (&#123; ou &#x1A;)
  decodedText = decodedText.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });

  decodedText = decodedText.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Méthode 3: Utiliser DOMParser pour les cas complexes (si disponible)
  if (typeof window !== "undefined" && window.DOMParser) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        `<!doctype html><body>${decodedText}`,
        "text/html"
      );
      decodedText = doc.body.textContent || decodedText;
    } catch (error) {
      // Fallback silencieux si DOMParser échoue
      console.warn("HTML decoding fallback used:", error);
    }
  }

  return decodedText;
}

/**
 * Décode récursivement les entités HTML dans un objet
 * Utile pour les objets job venant de l'API
 *
 * @param obj - Objet contenant potentiellement des entités HTML
 * @returns Objet avec toutes les chaînes décodées
 */
export function decodeHtmlEntitiesInObject<T extends Record<string, any>>(
  obj: T
): T {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const decoded: Record<string, any> = { ...obj };

  Object.keys(decoded).forEach((key) => {
    const value = decoded[key];

    if (typeof value === "string") {
      decoded[key] = decodeHtmlEntities(value);
    } else if (Array.isArray(value)) {
      decoded[key] = (value as any[]).map((item) =>
        typeof item === "string"
          ? decodeHtmlEntities(item)
          : typeof item === "object"
          ? decodeHtmlEntitiesInObject(item)
          : item
      );
    } else if (typeof value === "object" && value !== null) {
      decoded[key] = decodeHtmlEntitiesInObject(value as Record<string, any>);
    }
  });

  return decoded as T;
}

/**
 * Hook personnalisé pour décoder automatiquement les chaînes HTML
 * Optimisé pour Remotion avec memoization
 */
import { useMemo } from "react";

export function useDecodedText(text: string): string {
  return useMemo(() => decodeHtmlEntities(text), [text]);
}

export function useDecodedObject<T extends Record<string, any>>(obj: T): T {
  return useMemo(() => decodeHtmlEntitiesInObject(obj), [obj]);
}
