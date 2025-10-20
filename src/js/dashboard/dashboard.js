// ======================================================
// DASHBOARD.JS - VERSIÓN REPARADA Y OPTIMIZADA
// ======================================================

// 📦 Contenedor principal del contenido dinámico
const main = document.querySelector(".dashboard-main");

// 🧩 Utilidades globales (grilla de depuración)
import {
  toggleGrilla,
  crearGrillaExacta,
  observarRedimensionamiento,
} from "../utilities/debugGrid.js";

// ======================================================
// 🔧 FUNCIÓN PRINCIPAL: CARGA DE SECCIONES DINÁMICAS
// ======================================================
async function cargarSeccion(nombreSeccion) {
  try {
    const archivo =
      nombreSeccion === "inventario" ? "inventario_dashboard" : nombreSeccion;

    const res = await fetch(`./dashboard/${archivo}.html`);
    if (!res.ok) throw new Error(`No se encontró ${archivo}.html`);
    const html = await res.text();
    main.innerHTML = html;

    // Esperar un momento para asegurar que el DOM cargue
    await new Promise((r) => setTimeout(r, 50));

    // Carga dinámica del módulo JS correspondiente
    switch (nombreSeccion) {
      case "inventario":
        console.log("📦 Cargando vista Inventario...");

        // 1️⃣ Carga la vista
        await cargarVistaHTML("inventario_dashboard");

        // 2️⃣ Carga el módulo ABC (análisis inteligente)
        await cargarABCparaInventario();

        // 3️⃣ Observa la grilla si está activa
        observarRedimensionamiento();
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
// 🔧 FUNCIÓN AUXILIAR: CARGAR VISTAS ESTÁTICAS
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
// 🚀 Carga inicial del dashboard (por defecto inventario)
// ======================================================
(async () => {
  console.log("🚀 Cargando vista inicial (Inventario con ABC)...");
  await cargarVistaHTML("inventario_dashboard");
  await cargarABCparaInventario(); // ✅ se carga ABC al inicio
})();


// ======================================================
// 🧭 NAVEGACIÓN SIN RECARGAR LA PÁGINA
// ======================================================
document.querySelectorAll(".sidebar-menu__link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const seccion = link.dataset.seccion;
    if (seccion) cargarSeccion(seccion);
  });
});

// ======================================================
// 📂 CONTROL VISUAL DEL SUBMENÚ DE INVENTARIO
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("inventarioToggle");
  if (!toggle) return;
  const item = toggle.closest(".sidebar-menu__item");

  toggle.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

// ======================================================
// 🎹 ATAJO DE TECLADO "G" PARA MOSTRAR GRILLA DE DEPURACIÓN
// ======================================================
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "g") {
    toggleGrilla();
  }
});

// ======================================================
// 🚀 CARGA ESPECÍFICA PARA EL MÓDULO ABC (ANÁLISIS DE INVENTARIO)
// ======================================================
async function cargarABCparaInventario() {
  console.log("🔄 Iniciando carga de ABC...");

  return new Promise((resolve) => {
    // Evita recargar si ya está cargado
    if (window.recalcularABC && window.filtrarProductos) {
      console.log("⚡ ABC.js ya estaba cargado");
      return resolve();
    }

    const script = document.createElement("script");
    script.src = "/src/js/dashboard/abc.js"; // ✅ Ruta absoluta (funciona desde cualquier nivel)
    script.type = "text/javascript";
    script.defer = true;

    script.onload = () => {
      console.log("✅ ABC.js cargado exitosamente");
      console.log("🧠 Funciones disponibles:", {
        recalcularABC: typeof window.recalcularABC,
        filtrarProductos: typeof window.filtrarProductos,
        cargarDatosABC: typeof window.cargarDatosABC,
      });
      resolve();
    };

    script.onerror = (error) => {
      console.error("❌ Error al cargar ABC.js:", error);
      resolve();
    };

    document.head.appendChild(script);
  });
}
