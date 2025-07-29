import "./index.css";
import { Composition, getStaticFiles, StaticFile } from "remotion";
import { jobSchema } from "./JobProfile/JobProfile";
import { z } from "zod";
import { Main } from "./Main/Main";
import { decodeHtmlEntitiesInObject } from "./utils/htmlDecode";

type Job = z.infer<typeof jobSchema>;

// 🚀 FIX SPECIAL CHARACTERS: Job par défaut avec exemples de caractères spéciaux pour tester
const jobWithSpecialChars: Job = {
  Id: 711,
  Title: "Office Assistant &amp; Admin Support", // Test: &amp; → &
  company: "Coalition Technologies &lt;Premium&gt;", // Test: &lt; → < et &gt; → >
  category: "Marketing &amp; Communications",
  salary: "$31,2k - $72,8k &euro;", // Test: &euro; → €
  location: "Worldwide &copy; Remote", // Test: &copy; → ©
  datePosted: "11/07/2025",
  jobUrl: "https://remotive.com/remote-jobs/marketing/office-assistant-1680495",
  jobDescription:
    "Coalition Technologies recherche un assistant administratif à distance, maîtrisant la communication &amp; la comptabilité de base, pour gérer les tâches de support client &lt;premium&gt; et de tenue de dossiers.",
  jobType: "Full-time &trade;", // Test: &trade; → ™
};

// Décoder le job par défaut
const job = decodeHtmlEntitiesInObject(jobWithSpecialChars);

// Each <Composition> is an entry in the sidebar!
const allVideoFiles = getStaticFiles().filter((file) =>
  file.name.endsWith("mp4")
);

// 🚀 TOUTES LES VIDÉOS: Utiliser les 11 vidéos disponibles sans filtre
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

  console.log(`📹 TOUTES LES VIDÉOS UTILISÉES:`);
  console.log(`📹 Total disponible: ${allVideos.length}`);
  console.log(`📹 HD (1080p): ${hdVideos.length} vidéos`);
  console.log(`📹 UHD 3840: ${uhd3840Videos.length} vidéos`);
  console.log(`📹 UHD 4096: ${uhd4096Videos.length} vidéos`);

  return allVideos;
};

const videoFiles = getOptimizedVideoFiles();

// 🚀 OPTIMISÉ: Fonction pour récupérer des vidéos random uniques avec équilibrage
const getRandomVideos = (count: number): StaticFile[] => {
  // Utiliser un mélange de Fisher-Yates pour une meilleure randomisation
  const shuffled = [...videoFiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 🚀 FIX: Garantir l'unicité - utiliser Set pour éviter les doublons
  const uniqueVideos = Array.from(new Set(shuffled.map((v) => v.name)))
    .map((name) => shuffled.find((v) => v.name === name)!)
    .slice(0, Math.min(count, videoFiles.length));

  // 🚀 FIX: Si pas assez de vidéos uniques, compléter avec les restantes
  if (uniqueVideos.length < count && videoFiles.length >= count) {
    const usedNames = new Set(uniqueVideos.map((v) => v.name));
    const remainingVideos = videoFiles.filter((v) => !usedNames.has(v.name));
    uniqueVideos.push(...remainingVideos.slice(0, count - uniqueVideos.length));
  }

  console.log(
    `📹 Vidéos sélectionnées (${uniqueVideos.length}/${count}):`,
    uniqueVideos.map((v) => v.name)
  );

  return uniqueVideos;
};

// 🚀 NOUVEAU: Fonction pour récupérer des jobs uniques
const getUniqueRandomJobs = (jobs: any[], count: number) => {
  const shuffled = [...jobs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, jobs.length));
};

// 🚀 NOUVEAU: Schema Zod pour StaticFile
const staticFileSchema = z.object({
  name: z.string(),
  src: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* <Composition
        id="JobIntro"
        component={JobIntro}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      /> */}

      {/* <Composition
        id="JobProfile"
        component={JobProfile}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        schema={z.object({
          job: jobSchema,
        })}
        defaultProps={{ job: job }}
      /> */}

      <Composition
        id="Main"
        component={Main}
        // 🚀 NOUVEAU: Durée ajustée pour JobIntro + 3 JobProfiles + JobOutro
        // JobIntro: 150 (5s) + 3 JobProfiles: 1350 (45s) + JobOutro: 450 (15s) = 1950 frames
        durationInFrames={1950}
        fps={30}
        width={1080}
        height={1920}
        // 🚀 NOUVEAU: Schema pour 3 jobs au lieu d'1
        schema={z.object({
          jobs: z.array(jobSchema), // Array de 3 jobs
          randomVideos: z.array(staticFileSchema), // Array de 3 vidéos avec bon type
        })}
        defaultProps={{
          jobs: [job, job, job], // 3 jobs par défaut avec caractères spéciaux décodés
          randomVideos: getRandomVideos(4), // 4 vidéos random optimisées (JobIntro + 3 JobProfile + JobOutro)
        }}
        calculateMetadata={async ({ props }) => {
          const data = await fetch(
            `https://crm.ngsylvain.com/api/v2/tables/muojvnd4ujc8v94/records?offset=0&limit=25&where=&viewId=vw3z77z6pmxa4otf`,
            {
              headers: {
                "xc-token": "IDHIUcZvNphX3WGbI0C_bKTw3Vb2b-B3KiCU9985", // Remplace par ton token réel
              },
            }
          );
          const json = await data.json();

          // 🚀 NOUVEAU: Récupérer 3 jobs random uniques
          const randomJobs = getUniqueRandomJobs(json.list, 3);

          // 🚀 FIX SPECIAL CHARACTERS: Décoder les entités HTML dans tous les jobs
          // Traite &amp; → &, &lt; → <, etc. directement à la source
          const decodedJobs = randomJobs.map((job) =>
            decodeHtmlEntitiesInObject(job)
          );

          // 🚀 NOUVEAU: Récupérer 4 vidéos random uniques (optimisées mémoire)
          const randomVideos = getRandomVideos(4);

          return {
            props: {
              ...props,
              jobs: decodedJobs, // 3 jobs uniques avec caractères spéciaux décodés
              randomVideos: randomVideos, // 3 vidéos uniques optimisées
            },
          };
        }}
      />
      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      {/* <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      /> */}
    </>
  );
};
