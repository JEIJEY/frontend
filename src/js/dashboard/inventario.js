// ✅ Confirmar carga del archivo
console.log("✅ inventario.js cargado correctamente");

// ============================================
// 🚀 FUNCIÓN PRINCIPAL DEL INVENTARIO
// ============================================
export function inicializarInventario() {
  const tabla = document.getElementById("tablaProductos");
  const estado = document.getElementById("estadoCarga");
  const btnRecargar = document.getElementById("btnRecargar");

  if (!tabla || !estado) {
    console.warn("⚠️ Elementos del DOM no encontrados todavía");
    return;
  }

  // ============================================
  // 🔄 FUNCIÓN PARA CARGAR PRODUCTOS DESDE EL SERVIDOR
  // ============================================
  async function cargarProductos() {
    tabla.innerHTML = "";
    estado.textContent = "⏳ Cargando productos...";

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        estado.textContent = "❌ No se encontró token. Inicia sesión nuevamente.";
        return;
      }

      const respuesta = await fetch("http://localhost:3001/api/productos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!respuesta.ok) throw new Error("Error al obtener productos");

      const productos = await respuesta.json();

      if (!productos.length) {
        estado.textContent = "📭 No hay productos en la base de datos.";
        return;
      }

      // ============================================
      // 🧾 Construir tabla con todos los campos
      // ============================================
      productos.forEach((p) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${p.id_producto}</td>
          <td>${p.nombre}</td>
          <td>${p.descripcion || "-"}</td>
          <td>${p.stock || 0}</td>
          <td>${p.unidad_medida || "-"}</td>
          <td>$${p.precio_unitario?.toLocaleString() || "-"}</td>
          <td>${p.categoria_nombre || "-"}</td>
          <td>${p.marca_nombre || "-"}</td>
          <td>${p.proveedor_nombre || "-"}</td>
          <td>${p.estado ? "🟢 Activo" : "🔴 Inactivo"}</td>
          <td>${p.fecha_creacion ? new Date(p.fecha_creacion).toLocaleDateString() : "-"}</td>
          <td>${p.fecha_actualizacion ? new Date(p.fecha_actualizacion).toLocaleDateString() : "-"}</td>
        `;
        tabla.appendChild(fila);
      });

      estado.textContent = "✅ Productos cargados correctamente";
    } catch (err) {
      console.error("💥 Error al cargar productos:", err);
      estado.textContent = "💥 Error al conectar con el servidor.";
    }
  }

  // ============================================
  // 🔁 BOTÓN PARA RECARGAR MANUALMENTE
  // ============================================
  btnRecargar?.addEventListener("click", cargarProductos);

  // Cargar automáticamente al iniciar
  cargarProductos();
}

// ============================================
// ⚡ EJECUTAR AUTOMÁTICAMENTE AL CARGAR LA PÁGINA
// ============================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarInventario);
} else {
  inicializarInventario();
}
