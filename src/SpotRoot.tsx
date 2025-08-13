import "./index.css";
import { Composition, getStaticFiles, StaticFile } from "remotion";
import { spotSchema } from "./SpotProfile/SpotProfile";
import { z } from "zod";
import { SpotMain } from "./SpotMain/SpotMain";
import { decodeHtmlEntitiesInObject } from "./utils/htmlDecode";

type Spot = z.infer<typeof spotSchema>;

// Spot par défaut pour tester (adapté au nouveau schéma)
const spotWithSpecialChars: Spot = {
  Id: 1,
  name: "Amsterdam &amp; Co-working Space",
  country: "Netherlands &copy;",
  cost_eur: 2500,
  star_rating: 4,
  temparature_C: 15,
  pros: "Very safe | Fast internet | Very affordable | Friendly people | Great food",
  cons: "Expensive taxis | Rainy winters | Crowded in summer | High rent | Noisy nightlife",
  hotel_m: 1200,
  diner: 15,
  mobile_data: 20,
  taxi_price: 12,
  airbnb_m: 1500,
};

// Décoder le spot par défaut
const spot = decodeHtmlEntitiesInObject(spotWithSpecialChars);

// Each <Composition> is an entry in the sidebar!
const allVideoFiles = getStaticFiles().filter((file) =>
  file.name.endsWith("mp4")
);

// Préférer les vidéos 1080p stables en preview
const getOptimizedVideoFiles = () => {
  const hdVideos = allVideoFiles.filter(
    (file) => file.name.includes("hd_1080_1920") || file.name.includes("_1080_1920_")
  );

  if (hdVideos.length > 0) {
    console.log(`📹 VIDÉOS (SPOT): HD uniquement (${hdVideos.length})`);
    return hdVideos;
  }

  // Fallback: exclure explicitement les UHD qui causent des soucis de parsing en dev
  const nonUhd = allVideoFiles.filter(
    (file) => !file.name.includes("uhd_2160_3840") && !file.name.includes("uhd_2160_4096")
  );
  console.log(`📹 VIDÉOS (SPOT): fallback non-UHD (${nonUhd.length})`);
  return nonUhd.length > 0 ? nonUhd : allVideoFiles;
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
        // Nouveau timing: 4 slides standardisés (8s chacun) + Outro (8s) = 240*4 + 240 = 1200
        durationInFrames={1200}
        fps={30}
        width={1080}
        height={1920}
        // Nouveau schema: 1 spot (mais on garde un array pour Intro qui peut en afficher 3)
        schema={z.object({
          spots: z.array(spotSchema),
          randomVideos: z.array(staticFileSchema),
        })}
        defaultProps={{
          spots: [spot, spot, spot],
          randomVideos: getRandomVideos(6), // Intro + 4 slides + Outro
        }}
        calculateMetadata={async ({ props }) => {
          const XC_TOKEN = process.env.XC_TOKEN;

          let decodedSpots: Spot[] = [spot];
          try {
            if (!XC_TOKEN) {
              console.warn(
                "XC_TOKEN manquant. Utilisation du spot local par défaut pour le rendu."
              );
            } else {
              const data = await fetch(
                `https://crm.ngsylvain.com/api/v2/tables/m45i3ovmckjnnax/records?offset=0&limit=25&where=&viewId=vw4al89z9njfvrx0`,
                {
                  headers: {
                    "xc-token": XC_TOKEN,
                  },
                }
              );
              const json = await data.json();
              const selectedForIntro = getUniqueRandomSpots(json.list, 3);
              decodedSpots = [...selectedForIntro].map((s) =>
                decodeHtmlEntitiesInObject(s)
              );
            }
          } catch (err: any) {
            console.warn(
              `Échec de la récupération des spots distants. Fallback local. Détail: ${err?.message || err}`
            );
          }

          const randomVideos = getRandomVideos(6);

          return {
            props: {
              ...props,
              spots: decodedSpots.length ? decodedSpots : [spot],
              randomVideos,
            },
          };
        }}
      />
    </>
  );
};
