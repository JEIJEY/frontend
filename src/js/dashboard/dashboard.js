// ============================================================
// DASHBOARD PRINCIPAL - CARGA DE VISTAS DINÁMICAS
// ============================================================

// 1️⃣ Tomamos la referencia al contenedor principal donde se inyectarán las vistas del dashboard.
const main = document.querySelector(".dashboard-main");


// 2️⃣ Función asíncrona que carga una sección HTML dentro de <main> y, si aplica,
//     importa el JS específico de esa sección (carga bajo demanda = mejor rendimiento).
async function cargarSeccion(nombreSeccion) {
  try {
    // 2.1) Pedimos el fragmento HTML de la sección (por ejemplo: ./dashboard/inventario.html).
    const res = await fetch(`./dashboard/${nombreSeccion}.html`);

    // 2.2) Si el servidor responde pero con error HTTP (404, 500, etc.), lanzamos una excepción propia.
    if (!res.ok) throw new Error(`No se encontró ${nombreSeccion}.html`);

    // 2.3) Convertimos la respuesta en texto (el HTML de la sección).
    const html = await res.text();

    // 2.4) Inyectamos el HTML en el contenedor principal del dashboard.
    main.innerHTML = html;

    // 2.5) Pequeña pausa para asegurar que el DOM insertado esté disponible
    //      antes de inicializar el JS específico de la sección.
    await new Promise(r => setTimeout(r, 50));

    // 2.6) Según la sección pedida, cargamos dinámicamente el módulo JS correspondiente.
    switch (nombreSeccion) {
      case "inventario":
        // import(...) devuelve una promesa con el "namespace" del módulo.
        import("./inventario.js").then(mod => mod.inicializarInventario());
        break;

      case "agregar-producto":
        // Si el módulo solo auto-ejecuta lógica al importarse y no expone funciones,
        import("./agregar-producto.js");
        break;

      case "configuracion":
        // ✅ Cargar la vista de configuración con Tailwind dentro de un iframe aislado.
        import("./configuracion.js").then(mod => mod.inicializarConfiguracion());
        break;
    }

  } catch (err) {
    // 2.7) Si algo falla (fetch, import, etc.), lo registramos y mostramos un mensaje en pantalla.
    console.error("❌ Error al cargar sección:", err);
    main.innerHTML = `<p style="color:red; text-align:center;">Error al cargar ${nombreSeccion}</p>`;
  }
}


// 3️⃣ Cargamos por defecto la sección "inventario" al iniciar la app.
cargarSeccion("inventario");


// 4️⃣ Activamos la navegación del sidebar:
//     por cada enlace con .sidebar-menu__link prevenimos la navegación estándar
//     y llamamos a cargarSeccion() con su data-seccion.
document.querySelectorAll(".sidebar-menu__link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault(); // Evita que el <a> recargue la página.
    cargarSeccion(link.dataset.seccion); // Usa el atributo data-seccion="..." del enlace.
  });
});
