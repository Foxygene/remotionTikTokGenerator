// This is your entry file for SPOT videos! Refer to it when you render:
// npx remotion render <entry-file> SpotMain out/spot-video.mp4

import { registerRoot } from "remotion";
import { SpotRemotionRoot } from "./SpotRoot";

registerRoot(SpotRemotionRoot);
