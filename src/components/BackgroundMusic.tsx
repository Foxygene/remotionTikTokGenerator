import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  type NativeAudioProps,
  useVideoConfig,
} from "remotion";
import { useMemo } from "react";

const audioFiles = getStaticFiles().filter(
  (file) => file.name.endsWith("mp3") && file.src.startsWith("/")
);

// 🎵 Debug: Afficher les fichiers audio disponibles
console.log(`🎵 Fichiers audio disponibles: ${audioFiles.length}`);
console.log(
  `🎵 Fichiers audio:`,
  audioFiles.map((f) => f.name)
);

export const RandomBackgroundMusic = (
  props?: Omit<NativeAudioProps, "src">
) => {
  const { durationInFrames } = useVideoConfig();
  const selected = useMemo(() => {
    if (!audioFiles.length) return undefined;
    return audioFiles[Math.floor(Math.random() * audioFiles.length)];
  }, []);
  return (
    <AbsoluteFill>
      {selected ? (
        <Audio
          src={selected.src}
          {...props}
          volume={0.1}
          startFrom={0}
          endAt={durationInFrames}
          onError={(e) => {
            console.warn(
              "Background audio failed to load (likely missing Content-Range support). Disabling music.",
              e
            );
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
