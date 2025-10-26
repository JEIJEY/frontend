# 🧼 Flujo de Limpieza y Análisis de CSS — Proyecto La Rivera

Este documento resume el **flujo completo** utilizado para limpiar, analizar y depurar el CSS del proyecto **La Rivera (Frontend)**, con los comandos exactos y la lógica aplicada paso a paso.

---

## 🧩 1️⃣ Instalación de herramientas necesarias

```bash
npm install --save-dev purgecss stylelint stylelint-config-standard
```

Estas herramientas permiten:

* **PurgeCSS** → eliminar clases CSS no utilizadas.
* **Stylelint** → analizar errores o inconsistencias de estilo CSS.

---

## 🧱 2️⃣ Configuración del flujo de limpieza

### 📦 package.json

Se añadieron los siguientes scripts personalizados:

```json
"scripts": {
  "purge": "mkdir dist && mkdir dist\\src && mkdir dist\\src\\styles && mkdir dist\\src\\styles\\atoms && mkdir dist\\src\\styles\\molecules && mkdir dist\\src\\styles\\organisms && mkdir dist\\src\\styles\\base && mkdir dist\\src\\styles\\utilities && npx purgecss --content \"src/**/*.html\" \"src/**/*.js\" --css \"src/styles/**/*.css\" --output \"dist\"",
  "purge:report": "node clean-report.mjs",
  "lint:css": "npx stylelint 'src/styles/**/*.css'"
}
```

---

## 🧼 3️⃣ Limpieza de estilos no utilizados

Ejecutar:

```bash
npm run purge
```

📁 Resultado: se genera una copia del CSS en la carpeta `dist/` con solo los estilos realmente usados.

---

## 📊 4️⃣ Generación de reporte de reducción

```bash
npm run purge:report
```

Este comando ejecuta el script `clean-report.mjs` y genera un archivo `report.txt` dentro de `dist/cleaned-css/`, con un resumen como:

```
tailwind-output.css 14991B → 12920B  ✅ (13.8% menos)
_dashboard-main.css 2072B → 1364B  ✅ (34.2% menos)
_navigation.css     826B → 50B     ✅ (93.9% menos)
```

---

## 🧠 5️⃣ Detección de conflictos entre archivos CSS

Ejecutar el analizador personalizado:

```bash
node css_conflicts_report.js
```

📄 Genera un archivo `css_conflicts_report.html` donde se muestran:

* Conflictos de propiedades repetidas.
* Sobrescrituras entre módulos (`inventario_dashboard.css` vs `_typography.css`).

---

## 🧩 6️⃣ Corrección de conflictos (ejemplo aplicado)

El conflicto detectado fue entre los selectores **globales de tipografía** (`h1, h2, h3...`) y los locales del dashboard.

Se solucionó así:

```css
.invp-dashboard-grid h1 { font-size: 20px; font-weight: 600; }
.invp-dashboard-grid h2 { font-size: 16px; font-weight: 600; }
.invp-dashboard-grid h3 { font-size: 14px; font-weight: 500; }
.invp-dashboard-grid h4 { font-size: 12px; font-weight: 500; }
.invp-dashboard-grid h5 { font-size: 10px; font-weight: 500; }
.invp-dashboard-grid p  { font-size: 12px; line-height: 1.5; color: #444; }
```

✅ Esto asegura que las fuentes del dashboard **no sobrescriben** las del resto del sistema.

---

## 🧾 7️⃣ Verificación posterior a la corrección

1. Ejecutar nuevamente:

   ```bash
   npm run purge
   npm run purge:report
   node css_conflicts_report.js
   ```

2. Confirmar que el nuevo `css_conflicts_report.html` **ya no muestra conflictos** en `h1`, `h2` o `p`.

---

## 🧭 8️⃣ Orden lógico del flujo completo

| Paso | Comando                                                               | Descripción                        |
| ---- | --------------------------------------------------------------------- | ---------------------------------- |
| 1    | `npm install --save-dev purgecss stylelint stylelint-config-standard` | Instalar dependencias              |
| 2    | Editar `package.json`                                                 | Añadir scripts personalizados      |
| 3    | `npm run purge`                                                       | Limpiar estilos no usados          |
| 4    | `npm run purge:report`                                                | Generar reporte de ahorro de bytes |
| 5    | `node css_conflicts_report.js`                                        | Analizar conflictos CSS            |
| 6    | Editar CSS problemático                                               | Encapsular selectores globales     |
| 7    | Repetir pasos 3–5                                                     | Validar que ya no haya conflictos  |

---

✅ **Resultado final:**

* CSS limpio, modular y sin sobrescrituras.
* Reportes automáticos listos para ver resultados.
* Flujo documentado para futuras iteraciones o compañeros del SENA.
