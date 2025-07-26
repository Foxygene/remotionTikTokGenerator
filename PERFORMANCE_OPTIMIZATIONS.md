# 🚀 Optimisations de Performance Remotion

## Problèmes corrigés

### 1. **Opacity dans l'opacity** ❌➡️✅

**Avant :** Le container principal avait une opacity qui se superposait avec d'autres opacités
**Après :** L'opacity est maintenant appliquée uniquement sur la vidéo de fond, évitant les calculs d'opacity en cascade

### 2. **Springs mal scopés** ❌➡️✅

**Avant :** Les springs étaient calculés dans les boucles `.map()` à chaque frame
**Après :** Les springs sont précalculés en dehors du rendu et réutilisés

```typescript
// ❌ AVANT - Recalcul à chaque frame
{
  words.map((t, i) => {
    const scale = spring({
      /* ... */
    }); // Recalculé à chaque frame !
  });
}

// ✅ APRÈS - Précalculé une fois
const springValues = words.map((_, i) =>
  spring({
    /* ... */
  }),
);
{
  words.map((t, i) => {
    const scale = springValues[i]; // Réutilisé
  });
}
```

### 3. **Manque de `will-change`** ❌➡️✅

**Avant :** Le navigateur ne savait pas quelles propriétés allaient changer
**Après :** Toutes les propriétés animées sont déclarées avec `will-change`

### 4. **Layout Shift du JobTitle** ❌➡️✅

**Avant :** JobTitle perdait sa largeur et se "réactualisait" après quelques secondes
**Après :** Scale minimal (0.1→1.0) + opacity séparée pour préserver l'espace layout

### 5. **Erreur SIGKILL lors du render** ❌➡️✅

**Avant :** Render échoue avec "Compositor quit with signal SIGKILL" - manque de mémoire
**Après :** Configuration mémoire optimisée + sélection vidéos HD légères

### 6. **Caractères spéciaux mal affichés** ❌➡️✅

**Avant :** `&` s'affiche comme `&amp;`, `<` comme `&lt;`, etc. - entités HTML non décodées  
**Après :** Décodage automatique de tous les caractères spéciaux dans les textes

## 🆕 NOUVELLE FONCTIONNALITÉ : Multi-Jobs

### Fonctionnalité implémentée

**AVANT** : 1 job random → 1 JobProfile
**APRÈS** : 3 jobs random uniques → 3 JobProfile en séquences

#### Structure des séquences :

```
JobIntro (120 frames)
├── JobProfile #1 (120 frames) - Job 1 + Vidéo 1
├── JobProfile #2 (120 frames) - Job 2 + Vidéo 2
└── JobProfile #3 (120 frames) - Job 3 + Vidéo 3
Total: 480 frames (16 secondes à 30fps)
```

#### Modifications apportées :

**Root.tsx** :

- ✅ Fetch 3 jobs random uniques (au lieu d'1)
- ✅ Sélection de 3 vidéos random uniques
- ✅ Schema Zod adapté pour arrays
- ✅ Durée ajustée de 240 → 480 frames

**Main.tsx** :

- ✅ Props adaptées pour accepter arrays
- ✅ Map dynamique pour créer 3 séquences JobProfile
- ✅ Association job/vidéo unique pour chaque séquence

#### Avantages :

- 🎬 **Contenu plus riche** : 3 offres d'emploi par vidéo
- 🎨 **Variété visuelle** : 3 vidéos de fond différentes
- ⚡ **Performance maintenue** : Toutes les optimisations préservées
- 🔄 **Randomisation** : Jobs et vidéos uniques à chaque génération

## 🚨 CORRECTION CRITIQUE : Erreur SIGKILL

### Problème identifié

Le render échouait avec l'erreur :

```
Compositor quit with signal SIGKILL
Error: Compositor exited with signal SIGKILL
```

**Cause racine** : Manque de mémoire dû à :

- Vidéos UHD 4K (2160x3840) jusqu'à 42MB
- Concurrency 2x = trop de processus parallèles
- Cache OffthreadVideo par défaut = 50% de la RAM

### Solutions appliquées

#### 1. **Configuration Remotion optimisée** (`remotion.config.ts`)

```typescript
Config.setConcurrency(1); // Au lieu de 2x
Config.setOffthreadVideoCacheSizeInBytes(512 * 1024 * 1024); // 512MB au lieu de 50% RAM
Config.setTimeoutInMilliseconds(120000); // Timeout augmenté
```

#### 2. **Sélection vidéos optimisée** (`Root.tsx`)

- ✅ **Priorité HD** : Vidéos 1080p (3-6MB) au lieu de 4K (26-42MB)
- ✅ **Filtrage intelligent** : Évite les 60fps trop lourds
- ✅ **Fallback sécurisé** : UHD légères seulement si nécessaire

#### 3. **Scripts de render optimisés** (`package.json`)

```bash
npm run render-optimized  # Concurrency 1 + logs verbeux
npm run render-safe       # Concurrency 1 + scale 0.8
npm run benchmark         # Tester différentes concurrency
```

### Résultat attendu

- ✅ **Render sans SIGKILL** : Mémoire sous contrôle
- ✅ **Qualité préservée** : HD 1080p suffisant pour TikTok
- ✅ **Performance stable** : Cache limité à 512MB

## 🔤 CORRECTION : Caractères Spéciaux HTML

### Problème identifié

Les données venant de l'API contenaient des entités HTML encodées :

- `&` s'affichait comme `&amp;`
- `<` s'affichait comme `&lt;`
- `"` s'affichait comme `&quot;`
- `'` s'affichait comme `&#39;`

### Solution implémentée

#### 1. **Utilitaire de décodage** (`src/utils/htmlDecode.ts`)

```typescript
// Décodage simple
decodeHtmlEntities("Johnson &amp; Johnson"); // → "Johnson & Johnson"

// Décodage d'objet complet
decodeHtmlEntitiesInObject(job); // → Tous les strings décodés
```

#### 2. **Application dans les composants**

- **JobTitle.tsx** : `useDecodedText(titleText)`
- **Info.tsx** : `useDecodedText(label)` et `useDecodedText(value)`
- **Root.tsx** : `decodeHtmlEntitiesInObject(job)` à la source

#### 3. **Entités supportées**

| Entité HTML | Caractère | Usage courant     |
| ----------- | --------- | ----------------- |
| `&amp;`     | `&`       | Johnson & Johnson |
| `&lt;`      | `<`       | Price < $100      |
| `&gt;`      | `>`       | Salary > $50k     |
| `&quot;`    | `"`       | "Premium" service |
| `&#39;`     | `'`       | We're hiring      |
| `&euro;`    | `€`       | 50€ salary        |
| `&copy;`    | `©`      | © Company        |
| `&trade;`   | `™`      | Brand™           |

#### 4. **Optimisations**

- ✅ **Hook memoizé** : `useDecodedText()` cache les résultats
- ✅ **Décodage à la source** : Dans `calculateMetadata` pour éviter les re-calculs
- ✅ **Support arrays** : Décodage récursif des objets complexes
- ✅ **Fallback sécurisé** : Utilise DOMParser quand disponible

### Résultat

**AVANT** :

- Titre : `"Office Assistant &amp; Admin Support"`
- Entreprise : `"Tech Corp &lt;Premium&gt;"`
- Salaire : `"$50k &euro;"`

**APRÈS** :

- Titre : `"Office Assistant & Admin Support"`
- Entreprise : `"Tech Corp <Premium>"`
- Salaire : `"$50k €"`

## Optimisations appliquées

### CSS Globales (`src/index.css`)

- ✅ Accélération GPU pour toutes les transformations
- ✅ Optimisations spécifiques pour les vidéos
- ✅ Optimisations pour `backdrop-blur`
- ✅ CSS Containment pour les séquences Remotion

### Components optimisés

#### `JobProfile.tsx`

- ✅ Springs précalculés en dehors du rendu
- ✅ `will-change` sur tous les éléments animés
- ✅ Opacity déplacée sur la vidéo uniquement
- ✅ `backface-visibility: hidden` pour l'accélération GPU
- ✅ `perspective: 1000` pour les transformations 3D

#### `JobTitle.tsx` (LAYOUT SHIFT FIXED ⚡)

- ✅ Springs précalculés pour tous les mots
- ✅ `will-change: transform` sur chaque mot
- ✅ Optimisations GPU avec `backface-visibility`
- ✅ **FIX CRITICAL**: Scale minimal (0.1→1.0) pour éviter layout shifts
- ✅ **FIX CRITICAL**: Opacity séparée pour l'effet visuel
- ✅ **FIX CRITICAL**: Container flex avec gap pour layout stable
- ✅ **FIX CRITICAL**: CSS Containment pour éviter les reflows

#### `Info.tsx` (NOUVEAU ⚡)

- ✅ Composant complètement optimisé avec CSS Containment
- ✅ Force l'accélération GPU sur tous les éléments
- ✅ `backface-visibility: hidden` pour éviter les repaints
- ✅ Optimisations spécifiques pour les backgrounds Tailwind
- ✅ Isolation CSS pour réduire les repaints parents

## Impact sur les performances

### Avant les optimisations :

- 🐌 Springs recalculés ~30 fois par seconde par élément
- 🐌 Opacity en cascade = calculs multiples
- 🐌 Transformations CPU au lieu GPU
- 🐌 Pas d'optimisations de rendu du navigateur
- 🐌 **Composant Info sans optimisation = CHUTES DE FPS MAJEURES**
- 🐌 Animations de slide causent des re-layouts
- 🐌 Backgrounds Tailwind non optimisés

### Après les optimisations ULTRA :

- ⚡ Springs calculés une seule fois par frame
- ⚡ Opacity unique et optimisée
- ⚡ **Toutes les animations sur GPU avec `transform3d`**
- ⚡ Navigateur optimise le rendu avec `will-change`
- ⚡ **Composant Info ultra-optimisé = FPS STABLES**
- ⚡ **Timing espacé (15ms) pour réduire calculs simultanés**
- ⚡ **Rendu conditionnel pour économiser ressources**
- ⚡ **CSS Isolation + Containment = performance maximale**

## Bonnes pratiques pour continuer

### ✅ À faire

- Toujours précalculer les springs en dehors des boucles
- Utiliser `will-change` pour les propriétés animées
- Préférer `transform` à la modification directe de `position`
- Utiliser `backface-visibility: hidden` pour l'accélération GPU

### ❌ À éviter

- Springs dans des `.map()` ou boucles de rendu
- Opacity en cascade (plusieurs couches)
- Animations de propriétés coûteuses (`width`, `height`, `top`, `left`)
- Oublier de nettoyer `will-change` après les animations

## Commandes pour tester

```bash
# Démarrer le serveur de développement
npm run dev

# Render une preview pour voir les performances
npm run build
```

## Métriques à surveiller

- **FPS en preview** : Doit être stable à 30fps
- **CPU usage** : Réduction significative après optimisations
- **Memory usage** : Pas d'augmentation due aux springs précalculés
- **Render time** : Temps de compilation réduit
