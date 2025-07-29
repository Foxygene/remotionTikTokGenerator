import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  type NativeAudioProps,
} from "remotion";

const audioFiles = getStaticFiles().filter((file) => file.name.endsWith("mp3"));
const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];

// 🎵 Debug: Afficher les fichiers audio disponibles
console.log(`🎵 Fichiers audio disponibles: ${audioFiles.length}`);
console.log(
  `🎵 Fichiers audio:`,
  audioFiles.map((f) => f.name)
);
console.log(`🎵 Audio sélectionné: ${randomAudio?.name}`);

export const RandomBackgroundMusic = (
  props?: Omit<NativeAudioProps, "src">
) => {
  return (
    <AbsoluteFill>
      <Audio src={randomAudio.src} {...props} volume={0.1} />
    </AbsoluteFill>
  );
};
