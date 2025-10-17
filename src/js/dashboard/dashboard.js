// ======================================================
// DASHBOARD.JS
// Controlador principal de vistas dinámicas del panel
// ======================================================

// 1️⃣ Tomamos referencia al contenedor principal del dashboard.
const main = document.querySelector(".dashboard-main");

// ======================================================
// 🔧 Función para cargar secciones dinámicamente
// ======================================================
async function cargarSeccion(nombreSeccion) {
  try {
    // ✅ Bloque corregido: si el nombre es "inventario", cargamos inventario_dashboard.html
    const archivo = nombreSeccion === "inventario"
      ? "inventario_dashboard"
      : nombreSeccion;

    const res = await fetch(`./dashboard/${archivo}.html`);
    if (!res.ok) throw new Error(`No se encontró ${archivo}.html`);
    const html = await res.text();
    main.innerHTML = html;

    // Esperamos un poco para que el DOM cargue
    await new Promise((r) => setTimeout(r, 50));

    // Carga dinámica del módulo JS correspondiente
    switch (nombreSeccion) {
      case "inventario":
        await cargarVistaHTML("inventario_dashboard");
        break;

      case "productos":
        import("../../js/dashboard/inventario.js").then((mod) =>
          mod.inicializarInventario?.()
        );
        break;

      case "categorias":
        import("../../js/dashboard/categorias.js").then((mod) =>
          mod.inicializarCategorias?.()
        );
        break;

      case "agregar-producto":
        import("../../js/dashboard/agregar-producto.js");
        break;

      case "usuarios":
        console.log("👥 Módulo usuarios cargado");
        break;

      case "reportes":
        console.log("📊 Módulo reportes cargado");
        break;

      case "configuracion":
        console.log("⚙️ Módulo configuración cargado");
        break;
    }
  } catch (err) {
    console.error("❌ Error al cargar sección:", err);
    main.innerHTML = `<p>Error al cargar ${nombreSeccion}</p>`;
  }
}

// ======================================================
// 🔧 Función auxiliar: carga vistas estáticas simples
// ======================================================
async function cargarVistaHTML(nombreArchivo) {
  try {
    const res = await fetch(`./dashboard/${nombreArchivo}.html`);
    if (!res.ok) throw new Error(`No se encontró ${nombreArchivo}.html`);
    const html = await res.text();
    main.innerHTML = html;
  } catch (err) {
    console.error("❌ Error al cargar vista estática:", err);
  }
}

// ======================================================
// 🚀 Carga inicial del dashboard
// ======================================================
cargarVistaHTML("inventario_dashboard");

// ======================================================
// 🧭 Enlaces del sidebar (navegación sin recargar la página)
// ======================================================
document.querySelectorAll(".sidebar-menu__link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const seccion = link.dataset.seccion;
    if (seccion) cargarSeccion(seccion);
  });
});

// ======================================================
// 📂 Control visual del submenú (Inventario desplegable)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("inventarioToggle");
  if (!toggle) return;
  const item = toggle.closest(".sidebar-menu__item");

  toggle.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});
