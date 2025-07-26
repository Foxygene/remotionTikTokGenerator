# 🚀 Guide de Render Optimisé - Post SIGKILL Fix

## 🧪 Commandes de test

### 1. **Test de render optimisé** (Recommandé)

```bash
npm run render-optimized
```

- ✅ Concurrency: 1 (au lieu de 2x)
- ✅ Cache: 512MB (au lieu de 50% RAM)
- ✅ Logs verbeux pour monitoring
- ✅ Vidéos HD prioritaires

### 2. **Test de render sécurisé** (Si problème persiste)

```bash
npm run render-safe
```

- ✅ Concurrency: 1
- ✅ Scale: 0.8 (résolution réduite)
- ✅ Encore plus sécurisé pour mémoire limitée

### 3. **Benchmark de concurrency**

```bash
npm run benchmark
```

- 🧪 Teste différentes valeurs de concurrency
- 📊 Trouve la valeur optimale pour ton serveur
- ⚡ Recommandations automatiques

### 4. **Check vidéos utilisées**

```bash
npm run check-videos
```

- 📹 Liste les vidéos HD vs UHD
- 📊 Affiche les tailles des fichiers
- ✅ Vérifie la sélection optimisée

## 📊 Métriques à surveiller

### Pendant le render :

- **Mémoire** : Ne doit pas dépasser 80% de la RAM disponible
- **Concurrency** : Commence par 1, augmente progressivement si stable
- **Cache hits** : Logs verbeux montrent l'efficacité du cache

### Logs à surveiller :

```bash
# ✅ Bon signe
Building...
Built in 520ms
Rendering frames ━━━━━━━━━━━━━━━━━━ 480/480

# ❌ Problème potentiel
Compositor quit with signal SIGKILL
Could not extract frame from compositor
```

## 🎯 Optimisations appliquées

### Configuration mémoire (`remotion.config.ts`)

- **Concurrency**: 1 (au lieu de 2x)
- **Cache OffthreadVideo**: 512MB (au lieu de 50% RAM)
- **Timeout**: 120s (au lieu de 30s)
- **Format**: JPEG (plus rapide que PNG)

### Sélection vidéos (`Root.tsx`)

- **Priorité HD**: 1080p (3-6MB) privilégiées
- **Évite UHD 4K**: 2160p (26-42MB) en dernier recours
- **Évite 60fps**: 25fps/30fps prioritaires
- **Fallback intelligent**: Sécurité si pas assez de HD

## 🚨 Si problèmes persistent

### Réduire encore plus la mémoire :

```bash
# Scale 0.5 = résolution divisée par 2
remotion render Main out/Main.mp4 --concurrency=1 --scale=0.5

# Ou cache encore plus petit dans remotion.config.ts
Config.setOffthreadVideoCacheSizeInBytes(256 * 1024 * 1024); // 256MB
```

### Diagnostic approfondi :

```bash
# Logs ultra-verbeux
remotion render Main out/Main.mp4 --log=verbose --concurrency=1

# Monitoring mémoire système pendant render
htop
# ou
watch -n 1 'free -h'
```

## ✅ Résultat attendu

Avec ces optimisations, le render devrait :

- ✅ **Compléter sans SIGKILL**
- ✅ **Prendre 480 frames** (16 secondes à 30fps)
- ✅ **Utiliser 3 jobs + 3 vidéos HD** uniques
- ✅ **Maintenir qualité** suffisante pour TikTok
- ✅ **Rester stable** en mémoire (<512MB cache)

## 📱 Format de sortie

- **Résolution**: 1080x1920 (TikTok/Stories format)
- **Durée**: 16 secondes (JobIntro + 3 JobProfiles)
- **Codec**: H264 (compatible universel)
- **Format**: MP4 (standard)
- **Qualité**: CRF 18 (équilibre taille/qualité)
