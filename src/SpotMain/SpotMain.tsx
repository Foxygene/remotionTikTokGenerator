import { Series, StaticFile } from "remotion";
import { SpotIntro } from "../SpotIntro/SpotIntro";
import { SpotProfile, spotSchema } from "../SpotProfile/SpotProfile";
import { SpotOutro } from "../SpotOutro/SpotOutro";
import { RandomBackgroundMusic } from "../components/BackgroundMusic";
import { z } from "zod";

// Props pour 3 spots et 3 vidéos
export const SpotMain = (props: {
  randomVideos: StaticFile[];
  spots: z.infer<typeof spotSchema>[];
}) => {
  // Fonction pour convertir une note numérique en étoiles
  const convertToStars = (rating: string | number): string => {
    const numValue = typeof rating === "string" ? parseFloat(rating) : rating;
    if (!isNaN(numValue)) {
      const stars = Math.round(numValue / 2); // Convertir sur 5 étoiles
      return "★".repeat(Math.min(Math.max(stars, 0), 5));
    }
    return rating.toString();
  };

  return (
    <>
      {/* 🎵 MUSIQUE DE FOND: Joue pendant toute la durée de la vidéo */}
      <RandomBackgroundMusic />

      <Series>
        {/* SpotIntro en premier - adapté pour spots */}
        <Series.Sequence durationInFrames={150}>
          <SpotIntro
            videoBg={props.randomVideos[0]}
            spots={props.spots.slice(0, 3).map((spot) => ({
              title: spot.name,
              salary: convertToStars(spot.overall_rating),
            }))}
          />
        </Series.Sequence>

        {/* 3 SpotProfile séquences avec spots et vidéos uniques */}
        {props.spots.map((spot, index) => (
          <Series.Sequence key={spot.Id || index} durationInFrames={450}>
            <div>
              <SpotProfile
                videoBg={props.randomVideos[index + 1] || props.randomVideos[0]}
                spot={spot}
              />
            </div>
          </Series.Sequence>
        ))}

        {/* SpotOutro en final */}
        <Series.Sequence durationInFrames={450}>
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
