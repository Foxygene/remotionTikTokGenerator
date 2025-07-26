// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

// 🚀 OPTIMIZATION: Configuration mémoire optimisée selon doc Remotion
// https://www.remotion.dev/docs/troubleshooting/sigkill

Config.setVideoImageFormat("jpeg"); // Plus rapide que PNG
Config.setConcurrency(1); // 🚀 FIX SIGKILL: Réduire la concurrency pour économiser mémoire
Config.setChromiumUserAgent("Chrome/123.0.0.0"); // Agent stable
Config.setOverwriteOutput(true); // Écraser les fichiers de sortie

// 🚀 FIX SIGKILL: Réduire drastiquement le cache OffthreadVideo
// Par défaut: 50% de la RAM | Optimisé: 512MB max
Config.setOffthreadVideoCacheSizeInBytes(512 * 1024 * 1024); // 512MB au lieu de 50% RAM

// 🚀 OPTIMIZATION: Paramètres de rendu optimisés
Config.setScale(1); // Échelle normale
Config.setCodec("h264"); // Codec le plus rapide
Config.setCrf(18); // Qualité équilibrée

// 🚀 OPTIMIZATION: Timeout augmenté pour les gros fichiers
Config.setTimeoutInMilliseconds(120000); // 2 minutes

// Configuration Tailwind
Config.overrideWebpackConfig(enableTailwind);
