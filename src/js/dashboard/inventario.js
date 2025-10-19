// ======================================================
// INVENTARIO.JS — Control unificado para Inventario y Productos
// ======================================================

console.log("✅ inventario.js cargado correctamente");

// ======================================================
// 🚀 FUNCIÓN PRINCIPAL DEL INVENTARIO
// ======================================================
export async function inicializarInventario() {
  console.log("⏳ Esperando a que cargue la vista del módulo...");

  try {
    // Detectar si es vista INVENTARIO (dashboard tarjetas) o PRODUCTOS (tabla)
    await esperarElemento(".invp-dashboard, #tablaProductos");

    if (document.querySelector(".invp-dashboard")) {
      console.log("🎯 Vista: DASHBOARD DE INVENTARIO detectada");
      inicializarInterfazInventario();
    } else if (document.querySelector("#tablaProductos")) {
      console.log("🎯 Vista: PRODUCTOS detectada");
      inicializarProductos();
    } else {
      console.warn("⚠️ Ninguna vista compatible detectada");
    }
  } catch (err) {
    console.warn("⚠️ Elementos del DOM no encontrados:", err);
  }
}

// ======================================================
// 🕓 FUNCIÓN PARA ESPERAR ELEMENTOS DINÁMICOS
// ======================================================
function esperarElemento(selector, timeout = 4000) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) return resolve();

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.querySelector(".dashboard-main"), {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(`⛔ Timeout esperando ${selector}`);
    }, timeout);
  });
}

// ======================================================
// 📦 DASHBOARD DE INVENTARIO (tarjetas invp-*)
// ======================================================
function inicializarInterfazInventario() {
  const contenedor = document.querySelector(".invp-dashboard");
  if (!contenedor) return;

  console.log("✅ Inventario Dashboard listo para usar");

  const botones = contenedor.querySelectorAll(".invp-btn");
  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log(`🪄 Click en botón: ${btn.textContent.trim()}`);
      alert(`Has presionado: ${btn.textContent.trim()}`);
    });
  });
}

// ======================================================
// 💾 LÓGICA DE PRODUCTOS (tabla y fetch API)
// ======================================================
function inicializarProductos() {
  const tabla = document.getElementById("tablaProductos");
  const estado = document.getElementById("estadoCarga");
  const btnRecargar = document.getElementById("btnRecargar");

  if (!tabla || !estado) {
    console.warn("⚠️ Elementos del DOM de productos no encontrados todavía");
    return;
  }

  console.log("✅ Vista de productos lista, cargando datos...");

  // ============================================
  // 🔄 FUNCIÓN PARA CARGAR PRODUCTOS
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

  btnRecargar?.addEventListener("click", cargarProductos);
  cargarProductos();
}
