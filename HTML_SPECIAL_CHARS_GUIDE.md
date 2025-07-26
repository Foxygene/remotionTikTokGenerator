# 🔤 Guide : Caractères Spéciaux HTML dans Remotion

## 🚨 Problème résolu

**AVANT** : Les caractères spéciaux venant de l'API s'affichaient encodés :

- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#39;`

**APRÈS** : Décodage automatique pour un affichage correct ! ✅

## 🧪 Comment tester

### 1. **Test rapide de la fonction**

```bash
npm run test-html-decode
```

Cela exécute les tests et montre des exemples de décodage en temps réel.

### 2. **Test dans la preview**

1. Lance `npm run dev`
2. Regarde les JobTitle et Info dans la preview
3. Tu verras les caractères spéciaux correctement décodés :
   - `"Office Assistant & Admin Support"` (au lieu de `&amp;`)
   - `"Coalition Technologies <Premium>"` (au lieu de `&lt;Premium&gt;`)

### 3. **Test avec de vraies données API**

Les données de ton API seront automatiquement décodées dans `calculateMetadata`.

## 📋 Entités HTML supportées

### Caractères de base

| Entité HTML | Caractère | Exemple d'usage   |
| ----------- | --------- | ----------------- |
| `&amp;`     | `&`       | Johnson & Johnson |
| `&lt;`      | `<`       | Price < $100      |
| `&gt;`      | `>`       | Salary > $50k     |
| `&quot;`    | `"`       | "Premium" service |
| `&#39;`     | `'`       | We're hiring      |
| `&apos;`    | `'`       | It's great        |

### Symboles et devises

| Entité HTML | Caractère | Exemple d'usage    |
| ----------- | --------- | ------------------ |
| `&euro;`    | `€`       | 50€ salary         |
| `&pound;`   | `£`       | £40k package       |
| `&yen;`     | `¥`       | ¥500k compensation |
| `&copy;`    | `©`      | © 2025 Company    |
| `&reg;`     | `®`      | Brand®            |
| `&trade;`   | `™`      | Service™          |

### Ponctuation spéciale

| Entité HTML | Caractère | Exemple d'usage         |
| ----------- | --------- | ----------------------- |
| `&nbsp;`    | ` `       | Espace insécable        |
| `&bull;`    | `•`       | Liste • à puces         |
| `&hellip;`  | `…`       | Suite…                  |
| `&ndash;`   | `–`       | Date range 2020–2025    |
| `&mdash;`   | `—`       | Em dash — emphasis      |
| `&laquo;`   | `«`       | « Guillemets français » |
| `&raquo;`   | `»`       | « Guillemets français » |

### Entités numériques

| Entité HTML | Caractère | Explication           |
| ----------- | --------- | --------------------- |
| `&#64;`     | `@`       | Arobase (décimal)     |
| `&#x40;`    | `@`       | Arobase (hexadécimal) |
| `&#38;`     | `&`       | Ampersand (décimal)   |

## 🔧 Architecture technique

### Fichiers modifiés

#### `src/utils/htmlDecode.ts` (NOUVEAU)

- **Fonction principale** : `decodeHtmlEntities()`
- **Hook React** : `useDecodedText()` avec memoization
- **Décodage objets** : `decodeHtmlEntitiesInObject()`
- **Support** : Entités nommées + numériques + DOMParser

#### `src/components/JobTitle.tsx`

```typescript
// AJOUTÉ
import { useDecodedText } from "../utils/htmlDecode";

// Dans le composant
const decodedTitle = useDecodedText(titleText);
const words = decodedTitle.split(" ");
```

#### `src/components/Info.tsx`

```typescript
// AJOUTÉ
import { useDecodedText } from "../utils/htmlDecode";

// Dans le composant
const decodedLabel = label ? useDecodedText(label) : undefined;
const decodedValue = useDecodedText(value);
```

#### `src/Root.tsx`

```typescript
// AJOUTÉ
import { decodeHtmlEntitiesInObject } from "./utils/htmlDecode";

// Dans calculateMetadata
const decodedJobs = randomJobs.map((job) => decodeHtmlEntitiesInObject(job));
```

## 🎯 Exemples concrets

### Données API typiques

```json
{
  "Title": "Software Engineer &amp; Developer",
  "company": "TechCorp &lt;Premium&gt;",
  "salary": "$50k - $80k &euro;",
  "jobDescription": "We&#39;re looking for a passionate developer who loves to code &amp; create amazing products. Requirements: 3+ years in &quot;web development&quot;.",
  "location": "Remote &copy; Worldwide",
  "jobType": "Full-time &trade;"
}
```

### Après décodage automatique

```json
{
  "Title": "Software Engineer & Developer",
  "company": "TechCorp <Premium>",
  "salary": "$50k - $80k €",
  "jobDescription": "We're looking for a passionate developer who loves to code & create amazing products. Requirements: 3+ years in \"web development\".",
  "location": "Remote © Worldwide",
  "jobType": "Full-time ™"
}
```

## ⚡ Performance

### Optimisations implémentées

- ✅ **Memoization React** : `useMemo()` cache les résultats
- ✅ **Décodage à la source** : Une fois dans `calculateMetadata`
- ✅ **Regex optimisées** : Remplacement groupé des entités
- ✅ **Fallback intelligent** : DOMParser quand disponible

### Impact performance

- 📈 **Zéro impact render** : Décodage une seule fois
- 📈 **Cache efficace** : Re-calculs évités
- 📈 **Memory friendly** : Pas de stockage double

## 🐛 Debugging

### Si les caractères ne se décodent pas

1. **Vérifier les imports** :

   ```typescript
   import { useDecodedText } from "../utils/htmlDecode";
   ```

2. **Vérifier l'usage** :

   ```typescript
   const decodedText = useDecodedText(originalText);
   ```

3. **Tester manuellement** :

   ```bash
   npm run test-html-decode
   ```

4. **Console log** :
   ```typescript
   console.log("AVANT:", originalText);
   console.log("APRÈS:", decodedText);
   ```

### Entités non supportées

Si tu rencontres une entité HTML non supportée, ajoute-la dans `HTML_ENTITIES_MAP` :

```typescript
const HTML_ENTITIES_MAP: Record<string, string> = {
  // ... entités existantes
  "&nouvelle;": "🆕", // Exemple
};
```

## ✅ Checklist de validation

- [ ] `npm run test-html-decode` fonctionne
- [ ] Preview affiche `&` au lieu de `&amp;`
- [ ] JobTitle avec caractères spéciaux OK
- [ ] Info labels/values décodés OK
- [ ] Données API décodées automatiquement
- [ ] Performance maintenue
- [ ] Pas d'erreurs console

## 🎬 Résultat final

Maintenant, **tous les caractères spéciaux** dans tes vidéos Remotion s'affichent correctement :

- ✅ **Titres de jobs** : `"Developer & Designer"`
- ✅ **Noms d'entreprises** : `"Tech <Premium>"`
- ✅ **Salaires** : `"50€ - 80€"`
- ✅ **Descriptions** : `"We're hiring talented developers"`
- ✅ **Symboles** : `"© Company™"`

**Plus jamais de `&amp;` ou `&lt;` dans tes vidéos !** 🎉
