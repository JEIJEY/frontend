import fs from "fs";
import path from "path";
import postcss from "postcss";
import safeParser from "postcss-safe-parser";

const ROOT = "./dist/cleaned-css";
const OUTPUT = "./css_conflicts_report.html";

// 🔍 Función: obtiene todas las rutas .css dentro del directorio
function getAllCSSFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      results = results.concat(getAllCSSFiles(filepath));
    } else if (file.endsWith(".css")) {
      results.push(filepath);
    }
  });
  return results;
}

// 🔎 Analiza y extrae las reglas CSS globales (sin media queries)
function extractGlobalRules(cssContent, filepath) {
  const root = postcss.parse(cssContent, { parser: safeParser });
  const rules = [];

  root.walkRules((rule) => {
    // Ignorar reglas dentro de media queries
    if (rule.parent && rule.parent.name === "media") return;

    rule.nodes?.forEach((decl) => {
      if (decl.type === "decl") {
        rules.push({
          selector: rule.selector,
          property: decl.prop,
          value: decl.value,
          file: filepath,
        });
      }
    });
  });

  return rules;
}

// 🧠 Detecta conflictos entre archivos
function findConflicts(rules) {
  const conflicts = [];
  const seen = new Map();

  for (const rule of rules) {
    const key = `${rule.selector}::${rule.property}`;

    if (!seen.has(key)) {
      seen.set(key, [rule]);
    } else {
      seen.get(key).push(rule);
    }
  }

  for (const [key, list] of seen.entries()) {
    const values = new Set(list.map((r) => r.value));
    if (values.size > 1) {
      conflicts.push({
        selector: list[0].selector,
        property: list[0].property,
        entries: list,
      });
    }
  }

  return conflicts;
}

// 🧾 Genera el HTML con el reporte
function generateHTML(conflicts) {
  const rows = conflicts
    .map((conflict) => {
      const entries = conflict.entries
        .map(
          (r) =>
            `<div><strong>${r.file}</strong> → <code>${r.value}</code></div>`
        )
        .join("");
      return `
      <tr>
        <td><code>${conflict.selector}</code></td>
        <td>${conflict.property}</td>
        <td>${entries}</td>
      </tr>`;
    })
    .join("");

  return `
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Reporte de Conflictos CSS (sin media queries)</title>
    <style>
      body { font-family: "Poppins", sans-serif; background: #f9fafb; padding: 2rem; color: #111; }
      h1 { font-size: 1.6rem; margin-bottom: 1rem; }
      table { border-collapse: collapse; width: 100%; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
      th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; vertical-align: top; }
      th { background: #111827; color: #fff; font-weight: 600; }
      tr:nth-child(even) { background: #f3f4f6; }
      code { background: #f3f4f6; padding: 0.1rem 0.25rem; border-radius: 4px; }
      .summary { margin-bottom: 1rem; background: #e0f2fe; border-left: 4px solid #0284c7; padding: 1rem; border-radius: 6px; }
    </style>
  </head>
  <body>
    <h1>📊 Reporte de Conflictos CSS (Ignora media queries)</h1>
    <div class="summary">
      Total conflictos detectados: <strong>${conflicts.length}</strong>
    </div>
    <table>
      <thead>
        <tr>
          <th>Selector</th>
          <th>Propiedad</th>
          <th>Detalles de conflicto</th>
        </tr>
      </thead>
      <tbody>
        ${rows || "<tr><td colspan='3'>✅ Sin conflictos encontrados</td></tr>"}
      </tbody>
    </table>
  </body>
  </html>`;
}

// 🚀 Ejecuta todo
(function run() {
  const files = getAllCSSFiles(ROOT);
  let allRules = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const rules = extractGlobalRules(content, file);
    allRules = allRules.concat(rules);
  }

  const conflicts = findConflicts(allRules);
  const html = generateHTML(conflicts);
  fs.writeFileSync(OUTPUT, html);
  console.log(`✅ Reporte generado correctamente en: ${OUTPUT}`);
})();
