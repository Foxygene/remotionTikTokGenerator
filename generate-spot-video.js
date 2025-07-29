#!/usr/bin/env node

/**
 * Script pour générer une vidéo TikTok SPOT avec un nom de fichier unique
 * Usage: node generate-spot-video.js [options]
 * Options:
 *   --safe: Utilise les paramètres safe (scale=0.8)
 *   --optimized: Utilise les paramètres optimisés (concurrency=1)
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Fonction pour générer un timestamp unique
const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

// Fonction pour générer un nom de fichier unique pour spot
const generateUniqueFilename = () => {
  const timestamp = generateTimestamp();
  return `TikTok-Spot-${timestamp}.mp4`;
};

// Créer le répertoire out s'il n'existe pas
const outDir = path.join(__dirname, "out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Parser les arguments de ligne de commande
const args = process.argv.slice(2);
const isOptimized = args.includes("--optimized");
const isSafe = args.includes("--safe");

// Générer le nom de fichier unique
const filename = generateUniqueFilename();
const outputPath = path.join("out", filename);

// Construire la commande Remotion pour les vidéos spot
let command = `npx remotion render src/index-spot.ts SpotMain "${outputPath}"`;

// Ajouter les options selon les arguments
if (isOptimized || isSafe) {
  command += " --concurrency=1 --log=verbose";
}

if (isSafe) {
  command += " --scale=0.8";
}

console.log(`🎬 Génération de la vidéo TikTok SPOT...`);
console.log(`📁 Fichier de sortie: ${outputPath}`);
console.log(`⚙️  Commande: ${command}`);
console.log("");

try {
  // Exécuter la commande
  execSync(command, {
    stdio: "inherit",
    cwd: __dirname,
  });

  console.log("");
  console.log(`✅ Vidéo SPOT générée avec succès: ${outputPath}`);
  console.log(
    `📊 Taille du fichier: ${(
      fs.statSync(outputPath).size /
      (1024 * 1024)
    ).toFixed(2)} MB`
  );
} catch (error) {
  console.error(
    "❌ Erreur lors de la génération de la vidéo SPOT:",
    error.message
  );
  process.exit(1);
}
