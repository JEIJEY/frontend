// 1) Tomamos la referencia al contenedor principal donde se inyectarán las vistas del dashboard.
const main = document.querySelector(".dashboard-main");


// 2) Función asíncrona que carga una sección HTML dentro de <main> y, si aplica,
//    importa el JS específico de esa sección (carga bajo demanda = mejor rendimiento).
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
    //      (innerHTML es síncrono, pero si el módulo busca nodos recién insertados,
    //      este "respiro" evita carreras de tiempo).
    await new Promise(r => setTimeout(r, 50));

    // 2.6) Según la sección pedida, cargamos dinámicamente el módulo JS correspondiente.
    //      Esto evita cargar todos los scripts de golpe (mejor primera carga).
    switch (nombreSeccion) {
      case "inventario":
        // import(...) devuelve una promesa con el "namespace" del módulo.
        // Llamamos a la función pública que inicializa la sección.
        import("./inventario.js").then(mod => mod.inicializarInventario());
        break;

      // 🔹 NUEVO BLOQUE: soporte para Categorías (sin alterar nada más)
      case "categorias":
        import("./categorias.js").then(mod => {
          if (mod.inicializarCategorias) mod.inicializarCategorias();
        });
        break;

      case "agregar-producto":
        // Si el módulo solo auto-ejecuta lógica al importarse y no expone funciones,
        // basta con importarlo (sin .then).
        import("./agregar-producto.js");
        break;
    }

  } catch (err) {
    // 2.7) Si algo falla (fetch, import, etc.), lo registramos y mostramos un mensaje en pantalla.
    console.error("❌ Error al cargar sección:", err);
    main.innerHTML = `<p>Error al cargar ${nombreSeccion}</p>`;
  }
}


// 3) Cargamos por defecto la sección "inventario" al iniciar la app.
cargarSeccion("inventario");


// 4) Activamos la navegación del sidebar: por cada enlace con .sidebar-menu__link
//    prevenimos la navegación estándar y llamamos a cargarSeccion() con su data-seccion.
document.querySelectorAll(".sidebar-menu__link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();                       // Evita que el <a> recargue la página.
    cargarSeccion(link.dataset.seccion);      // Usa el atributo data-seccion="..." del enlace.
  });
});


// 5) Control visual del submenú de INVENTARIO (no afecta la carga de vistas)
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("inventarioToggle");
  const item = toggle.closest(".sidebar-menu__item");

  toggle.addEventListener("click", () => {
    // Al hacer clic, alterna la clase "open"
    item.classList.toggle("open");
  });
});
