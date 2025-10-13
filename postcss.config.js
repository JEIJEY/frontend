/**
 * Archivo: postcss.config.js
 * 
 * Este archivo configura PostCSS, una herramienta que transforma tu CSS
 * mediante el uso de "plugins" (extensiones). 
 * En este caso se usa junto con TailwindCSS para generar los estilos finales.
 */

module.exports = {
  // 🔧 Sección de configuración de los plugins de PostCSS
  plugins: {
    // 🌀 TailwindCSS: este plugin analiza tu HTML y JS para generar
    // solo las clases que realmente estás usando.
    tailwindcss: {},

    // 🌍 Autoprefixer: agrega automáticamente prefijos a las propiedades CSS
    // (por ejemplo: -webkit-, -moz-) para asegurar compatibilidad con distintos navegadores.
    autoprefixer: {},
  },
};
