import "./index.css";
import { Composition } from "remotion";
import { JobProfile, jobSchema } from "./JobProfile/JobProfile";
import { z } from "zod";

type Job = z.infer<typeof jobSchema>;
const job: Job = {
  Id: 711,
  Title: "Office Assistant",
  company: "Coalition Technologies ",
  category: "Marketing",
  salary: "$31,2k- $72,8k",
  location: "Worldwide",
  datePosted: "11/07/2025",
  jobUrl: "https://remotive.com/remote-jobs/marketing/office-assistant-1680495",
  jobDescription:
    "Coalition Technologies recherche un assistant administratif à distance, maîtrisant la communication et la comptabilité de base, pour gérer les tâches de support client et de tenue de dossiers dans un environnement.",
  jobType: "Full-time",
};
// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="JobProfile"
        component={JobProfile}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={jobSchema}
        defaultProps={job}
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
