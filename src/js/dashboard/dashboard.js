// dashboard.js
const main = document.querySelector(".dashboard-main");

// Cargar sección por defecto
cargarSeccion("inventario");

// Escuchar clicks en el sidebar
document.querySelectorAll(".sidebar-menu__link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const seccion = link.dataset.seccion;
    cargarSeccion(seccion);
  });
});

function cargarSeccion(nombreSeccion) {
  fetch(`../pages/dashboard/${nombreSeccion}.html`)
    .then(res => res.text())
    .then(html => {
      main.innerHTML = html;

      // Después de cargar el HTML, importar el JS de la sección
      switch(nombreSeccion) {
        case "inventario":
          import("./inventario.js");
          break;
        case "agregar-producto":
          import("./agregar-producto.js");
          break;
        // Agrega más secciones si tienen JS
      }
    })
    .catch(err => console.error("Error al cargar sección:", err));
}
