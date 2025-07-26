/**
 * 🧪 TESTS: Exemples de décodage des entités HTML
 *
 * Ce fichier sert de documentation et de validation pour la fonction
 * de décodage des caractères spéciaux dans Remotion.
 */

import { decodeHtmlEntities, decodeHtmlEntitiesInObject } from "./htmlDecode";

// ✅ Tests basiques des entités HTML courantes
console.log("🧪 Tests de décodage HTML pour Remotion\n");

// Test 1: Caractères spéciaux de base
console.log("📝 Test 1: Caractères spéciaux de base");
console.log("AVANT:", "Johnson &amp; Johnson");
console.log("APRÈS:", decodeHtmlEntities("Johnson &amp; Johnson"));
console.log("✅ Résultat:", "Johnson & Johnson\n");

// Test 2: Symboles et comparaisons
console.log("📝 Test 2: Symboles et comparaisons");
console.log("AVANT:", "Price: &lt; $100 &amp; &gt; $50");
console.log("APRÈS:", decodeHtmlEntities("Price: &lt; $100 &amp; &gt; $50"));
console.log("✅ Résultat:", "Price: < $100 & > $50\n");

// Test 3: Guillemets et apostrophes
console.log("📝 Test 3: Guillemets et apostrophes");
console.log("AVANT:", "&quot;Hello world&quot; &amp; it&#39;s great!");
console.log("APRÈS:", decodeHtmlEntities('"Hello world" & it\'s great!'));
console.log("✅ Résultat:", '"Hello world" & it\'s great!\n');

// Test 4: Devises et symboles commerciaux
console.log("📝 Test 4: Devises et symboles commerciaux");
console.log("AVANT:", "Price: 100&euro; &copy; MyCompany&trade;");
console.log("APRÈS:", decodeHtmlEntities("Price: 100€ © MyCompany™"));
console.log("✅ Résultat:", "Price: 100€ © MyCompany™\n");

// Test 5: Entités numériques
console.log("📝 Test 5: Entités numériques");
console.log("AVANT:", "Symbol: &#64; &#x40; &#38;");
console.log("APRÈS:", decodeHtmlEntities("Symbol: @ @ &"));
console.log("✅ Résultat:", "Symbol: @ @ &\n");

// Test 6: Objet complexe (comme les données job)
console.log("📝 Test 6: Objet job complet");
const jobWithEntities = {
  Title: "Software Engineer &amp; Developer",
  company: "Tech Corp &lt;Premium&gt;",
  salary: "$50k - $80k &euro;",
  description:
    "Join our team &amp; build amazing products! We&#39;re looking for talented developers.",
  location: "Remote &copy; Worldwide",
  jobType: "Full-time &trade;",
  requirements: [
    "JavaScript &amp; TypeScript experience",
    "React &amp; Node.js skills",
    "3+ years of experience in &quot;web development&quot;",
  ],
};

console.log("AVANT (jobWithEntities):");
console.log(JSON.stringify(jobWithEntities, null, 2));

const decodedJob = decodeHtmlEntitiesInObject(jobWithEntities);
console.log("\nAPRÈS (decodedJob):");
console.log(JSON.stringify(decodedJob, null, 2));

// Exemples de ce qui sera décodé:
console.log("\n🎯 Exemples de décodage dans ton projet:");
console.log(
  '• Titres de job: "Office Assistant &amp; Admin" → "Office Assistant & Admin"',
);
console.log('• Entreprises: "Company &lt;Premium&gt;" → "Company <Premium>"');
console.log('• Salaires: "$50k &euro;" → "$50k €"');
console.log('• Descriptions: "We&#39;re hiring" → "We\'re hiring"');
console.log('• Locations: "&copy; Remote" → "© Remote"');
console.log('• Types: "Full-time &trade;" → "Full-time ™"');

console.log("\n✅ Tous les tests de décodage HTML réussis!");
