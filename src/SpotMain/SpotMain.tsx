import { Series, StaticFile } from "remotion";
import { SpotOverview, SpotCost, SpotPros, SpotCons, spotSchema } from "../SpotProfile/SpotProfile";
import { SpotOutro } from "../SpotOutro/SpotOutro";
import { RandomBackgroundMusic } from "../components/BackgroundMusic";
import { z } from "zod";

// Nouveau flow: 1 spot random, Slides: Overview → Cost → Pros → Cons
export const SpotMain = (props: {
  randomVideos: StaticFile[];
  spots: z.infer<typeof spotSchema>[];
}) => {
  // Durées standardisées (30fps)
  const SLIDE_DURATION = 240; // 8s
  const OUTRO_DURATION = SLIDE_DURATION; // Aligner l'outro sur la durée d'un slide
  const spot = props.spots[0];

  return (
    <>
      {/* 🎵 MUSIQUE DE FOND: Joue pendant toute la durée de la vidéo */}
      <RandomBackgroundMusic />

      <Series>
        {/* Slides for a single chosen spot */}
        <Series.Sequence key={spot?.Id ?? 0} durationInFrames={SLIDE_DURATION}>
          <SpotOverview videoBg={props.randomVideos[1] || props.randomVideos[0]} spot={spot} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <SpotCost videoBg={props.randomVideos[2] || props.randomVideos[0]} spot={spot} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <SpotPros videoBg={props.randomVideos[3] || props.randomVideos[0]} spot={spot} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <SpotCons videoBg={props.randomVideos[4] || props.randomVideos[0]} spot={spot} />
        </Series.Sequence>

        {/* SpotOutro en final */}
        <Series.Sequence durationInFrames={OUTRO_DURATION}>
          <SpotOutro
            videoBg={
              props.randomVideos[props.randomVideos.length - 1] ||
              props.randomVideos[0]
            }
          />
        </Series.Sequence>
      </Series>
    </>
  );
};
