// Mensaje en consola para confirmar que el archivo se cargó correctamente
console.log("✅ inventario.js cargado correctamente");

// Exporta la función principal que inicializa la lógica del inventario
export function inicializarInventario() {
  // Obtiene referencias a los elementos del DOM
  const tabla = document.getElementById("tablaProductos");
  const estado = document.getElementById("estadoCarga");
  const btnRecargar = document.getElementById("btnRecargar");

  // Verifica que los elementos del DOM existan antes de continuar
  if (!tabla || !estado) {
    console.warn("⚠️ Elementos del DOM no encontrados todavía");
    return;
  }

  // Función asíncrona encargada de cargar los productos desde el servidor
  async function cargarProductos() {
    // Limpia la tabla y muestra mensaje de carga
    tabla.innerHTML = "";
    estado.textContent = "⏳ Cargando productos...";

    try {
      // Obtiene el token de autenticación del almacenamiento local
      const token = localStorage.getItem("authToken");
      if (!token) {
        estado.textContent = "❌ No se encontró token. Inicia sesión nuevamente.";
        return;
      }

      // Realiza la petición al servidor para obtener los productos
      const respuesta = await fetch("http://localhost:3001/api/productos", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      // Lanza error si la respuesta no es correcta
      if (!respuesta.ok) throw new Error("Error en la respuesta");

      // Convierte la respuesta en formato JSON
      const productos = await respuesta.json();

      // Si no hay productos, muestra mensaje informativo
      if (!productos.length) {
        estado.textContent = "📭 No hay productos en la base de datos.";
        return;
      }

      // Recorre la lista de productos y crea una fila por cada uno
      productos.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${p.id_producto}</td>
          <td>${p.nombre}</td>
          <td>${p.descripcion}</td>
          <td>${p.stock}</td>
          <td>${p.unidad || "-"}</td>
          <td>$${p.precio_unitario}</td>
          <td>${p.categoria_nombre || "-"}</td>
          <td>${p.proveedor_nombre || "-"}</td>
        `;
        // Agrega la fila a la tabla
        tabla.appendChild(fila);
      });

      // Muestra mensaje de éxito al finalizar la carga
      estado.textContent = "✅ Productos cargados correctamente";
    } catch (err) {
      // Muestra errores en consola y en pantalla
      console.error("💥 Error al cargar productos:", err);
      estado.textContent = "💥 Error al conectar con el servidor.";
    }
  }

  // Agrega evento al botón para recargar manualmente los productos
  btnRecargar?.addEventListener("click", cargarProductos);

  // Carga los productos automáticamente al iniciar
  cargarProductos();
}

// Ejecuta la función automáticamente si el documento ya está cargado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarInventario);
} else {
  inicializarInventario();
}
