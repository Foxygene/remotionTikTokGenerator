import "./index.css";
import { Composition, getStaticFiles, StaticFile } from "remotion";
import { spotSchema } from "./SpotProfile/SpotProfile";
import { z } from "zod";
import { SpotMain } from "./SpotMain/SpotMain";
import { decodeHtmlEntitiesInObject } from "./utils/htmlDecode";

type Spot = z.infer<typeof spotSchema>;

// Spot par défaut pour tester
const spotWithSpecialChars: Spot = {
  Id: 1,
  name: "Amsterdam &amp; Co-working Space", // Test: &amp; → &
  country: "Netherlands &copy;", // Test: &copy; → ©
  cost_usd: 2500,
  internet_speed: 100,
  overall_rating: 8.5,
  temperature: 15,
};

// Décoder le spot par défaut
const spot = decodeHtmlEntitiesInObject(spotWithSpecialChars);

// Each <Composition> is an entry in the sidebar!
const allVideoFiles = getStaticFiles().filter((file) =>
  file.name.endsWith("mp4")
);

// Utiliser les 11 vidéos disponibles sans filtre
const getOptimizedVideoFiles = () => {
  // Prendre TOUTES les vidéos disponibles
  const allVideos = allVideoFiles;

  // Catégorisation pour information (logs)
  const hdVideos = allVideos.filter(
    (file) =>
      file.name.includes("hd_1080_1920") || file.name.includes("_1080_1920_")
  );

  const uhd3840Videos = allVideos.filter((file) =>
    file.name.includes("uhd_2160_3840")
  );

  const uhd4096Videos = allVideos.filter((file) =>
    file.name.includes("uhd_2160_4096")
  );

  console.log(`📹 TOUTES LES VIDÉOS UTILISÉES (SPOT):`);
  console.log(`📹 Total disponible: ${allVideos.length}`);
  console.log(`📹 HD (1080p): ${hdVideos.length} vidéos`);
  console.log(`📹 UHD 3840: ${uhd3840Videos.length} vidéos`);
  console.log(`📹 UHD 4096: ${uhd4096Videos.length} vidéos`);

  return allVideos;
};

const videoFiles = getOptimizedVideoFiles();

// Fonction pour récupérer des vidéos random uniques avec équilibrage
const getRandomVideos = (count: number): StaticFile[] => {
  // Utiliser un mélange de Fisher-Yates pour une meilleure randomisation
  const shuffled = [...videoFiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Garantir l'unicité - utiliser Set pour éviter les doublons
  const uniqueVideos = Array.from(new Set(shuffled.map((v) => v.name)))
    .map((name) => shuffled.find((v) => v.name === name)!)
    .slice(0, Math.min(count, videoFiles.length));

  // Si pas assez de vidéos uniques, compléter avec les restantes
  if (uniqueVideos.length < count && videoFiles.length >= count) {
    const usedNames = new Set(uniqueVideos.map((v) => v.name));
    const remainingVideos = videoFiles.filter((v) => !usedNames.has(v.name));
    uniqueVideos.push(...remainingVideos.slice(0, count - uniqueVideos.length));
  }

  console.log(
    `📹 Vidéos sélectionnées (SPOT) (${uniqueVideos.length}/${count}):`,
    uniqueVideos.map((v) => v.name)
  );

  return uniqueVideos;
};

// Fonction pour récupérer des spots uniques
const getUniqueRandomSpots = (spots: any[], count: number) => {
  const shuffled = [...spots].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, spots.length));
};

// Schema Zod pour StaticFile
const staticFileSchema = z.object({
  name: z.string(),
  src: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const SpotRemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SpotMain"
        component={SpotMain}
        // Durée ajustée pour SpotIntro + 3 SpotProfiles + SpotOutro
        // SpotIntro: 150 (5s) + 3 SpotProfiles: 1350 (45s) + SpotOutro: 450 (15s) = 1950 frames
        durationInFrames={1950}
        fps={30}
        width={1080}
        height={1920}
        // Schema pour 3 spots au lieu d'1
        schema={z.object({
          spots: z.array(spotSchema), // Array de 3 spots
          randomVideos: z.array(staticFileSchema), // Array de 3 vidéos avec bon type
        })}
        defaultProps={{
          spots: [spot, spot, spot], // 3 spots par défaut avec caractères spéciaux décodés
          randomVideos: getRandomVideos(5), // 5 vidéos random uniques (SpotIntro + 3 SpotProfile + SpotOutro)
        }}
        calculateMetadata={async ({ props }) => {
          const data = await fetch(
            `https://crm.ngsylvain.com/api/v2/tables/mirilc3dbif4c4t/records?offset=0&limit=25&where=&viewId=vwcvpa5i17ivyplz`,
            {
              headers: {
                "xc-token": "IDHIUcZvNphX3WGbI0C_bKTw3Vb2b-B3KiCU9985", // Remplace par ton token réel
              },
            }
          );
          const json = await data.json();

          // Récupérer 3 spots random uniques
          const randomSpots = getUniqueRandomSpots(json.list, 3);

          // Décoder les entités HTML dans tous les spots
          const decodedSpots = randomSpots.map((spot) =>
            decodeHtmlEntitiesInObject(spot)
          );

          // Récupérer 5 vidéos random uniques (optimisées mémoire)
          const randomVideos = getRandomVideos(5);

          return {
            props: {
              ...props,
              spots: decodedSpots, // 3 spots uniques avec caractères spéciaux décodés
              randomVideos: randomVideos, // 4 vidéos uniques optimisées
            },
          };
        }}
      />
    </>
  );
};
