// ======================================================
// INVENTARIO.JS — Control unificado para Inventario y Productos
// ======================================================

console.log("✅ inventario.js cargado correctamente");

// PASO 1: import necesario
import apiClient from "../utilities/apiClient.js";

// ======================================================
// 🚀 FUNCIÓN PRINCIPAL DEL INVENTARIO
// ======================================================
export async function inicializarInventario() {
  console.log("⏳ Esperando a que cargue la vista del módulo...");

  try {
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

  // 👇 PASO 2: nuevos elementos
  const btnCrear = document.getElementById("btnCrearProducto");
  const hostModal = document.getElementById("modalHostProductos");

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
  btnCrear?.addEventListener("click", abrirModalCrearProducto_P1);

  cargarProductos();

  // ======================================================
  // 🧩 PASO 2 - ABRIR MODAL BÁSICO
  // ======================================================
  async function abrirModalCrearProducto_P1() {
    if (!document.getElementById("modalProductoInventario")) {
      try {
        const res = await fetch("/src/pages/dashboard/modal-producto.html");

        if (!res.ok) throw new Error("No se encontró modal-producto.html");
        hostModal.innerHTML = await res.text();
        console.log("✅ Modal inyectado en el DOM");
      } catch (err) {
        console.error("❌ Error cargando el modal:", err);
        alert("No se pudo cargar el modal. Revisa la ruta del archivo.");
        return;
      }
    } else {
      console.log("ℹ️ El modal ya estaba cargado");
    }

    const modal = document.getElementById("modalProductoInventario");
    if (modal) {
      modal.style.display = "flex";
      console.log("✅ Modal mostrado (PASO 2)");

      // 🗂️ PASO 3 - CARGAR DATOS EN LOS SELECTS
      await cargarCategoriasEnSelect();
      await cargarMarcasEnSelect();
      await cargarProveedoresEnSelect();

      // ======================================================
      // 🧩 PASO 4 — ENLAZAR FORMULARIO DEL MODAL CON BACKEND
      // ======================================================
      const formProducto = document.getElementById("formProducto");
      const btnCancelar = document.getElementById("cancelarModal");

      btnCancelar?.addEventListener("click", () => {
        modal.style.display = "none";
      });

      formProducto?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nuevoProducto = {
          nombre: document.getElementById("nombre").value.trim(),
          descripcion: document.getElementById("descripcion").value.trim(),
          stock: parseInt(document.getElementById("stock").value || 0),
          unidad_medida: document.getElementById("unidad").value.trim(),
          precio_unitario: parseFloat(document.getElementById("precio").value || 0),
          id_categoria: parseInt(document.getElementById("categoria").value),
          id_marca: parseInt(document.getElementById("marca").value),
          id_proveedor: parseInt(document.getElementById("proveedor").value),
          estado: parseInt(document.getElementById("estado").value),
        };

        if (!nuevoProducto.nombre || !nuevoProducto.precio_unitario || !nuevoProducto.id_categoria || !nuevoProducto.id_marca || !nuevoProducto.id_proveedor) {
          alert("⚠️ Faltan campos obligatorios.");
          return;
        }

        try {
          const token = localStorage.getItem("authToken");
          const respuesta = await fetch("http://localhost:3001/api/productos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevoProducto),
          });

          const data = await respuesta.json();

          if (respuesta.ok) {
            alert("✅ Producto agregado correctamente");
            modal.style.display = "none";
            await cargarProductos();
          } else {
            alert(`❌ Error: ${data.message}`);
          }
        } catch (error) {
          console.error("💥 Error al guardar producto:", error);
          alert("❌ Error al conectar con el servidor");
        }
      });
    }
  }

  // ======================================================
  // 🗂️ PASO 3 - CARGAR CATEGORÍAS / MARCAS / PROVEEDORES
  // ======================================================
  async function cargarCategoriasEnSelect() {
    const selectCategoria = document.getElementById("categoria");
    if (!selectCategoria) return console.warn("⚠️ No se encontró el select de categorías");

    try {
      const token = localStorage.getItem("authToken");
      const respuesta = await fetch("http://localhost:3001/api/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!respuesta.ok) throw new Error("Error al obtener categorías");

      const categorias = await respuesta.json();
      selectCategoria.innerHTML = `
        <option value="">Seleccione una categoría</option>
        <option value="crear-nueva">➕ Crear nueva categoría...</option>
      `;

      categorias.forEach((cat) => {
        const opcion = document.createElement("option");
        opcion.value = cat.id_categoria;
        opcion.textContent = cat.nombre;
        selectCategoria.appendChild(opcion);
      });

      console.log(`✅ ${categorias.length} categorías cargadas`);
    } catch (err) {
      console.error("💥 Error cargando categorías:", err);
    }
  }

  async function cargarMarcasEnSelect() {
    const selectMarca = document.getElementById("marca");
    if (!selectMarca) return console.warn("⚠️ No se encontró el select de marcas");

    try {
      const token = localStorage.getItem("authToken");
      const respuesta = await fetch("http://localhost:3001/api/marcas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!respuesta.ok) throw new Error("Error al obtener marcas");

      const marcas = await respuesta.json();
      selectMarca.innerHTML = `
        <option value="">Seleccione una marca</option>
        <option value="crear-nueva">➕ Crear nueva marca...</option>
      `;

      marcas.forEach((m) => {
        const opcion = document.createElement("option");
        opcion.value = m.id_marca;
        opcion.textContent = m.nombre;
        selectMarca.appendChild(opcion);
      });

      console.log(`✅ ${marcas.length} marcas cargadas`);
    } catch (err) {
      console.error("💥 Error cargando marcas:", err);
    }
  }

  async function cargarProveedoresEnSelect() {
    const selectProveedor = document.getElementById("proveedor");
    if (!selectProveedor) return console.warn("⚠️ No se encontró el select de proveedores");

    try {
      const token = localStorage.getItem("authToken");
      const respuesta = await fetch("http://localhost:3001/api/proveedores", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!respuesta.ok) throw new Error("Error al obtener proveedores");

      const proveedores = await respuesta.json();
      selectProveedor.innerHTML = `
        <option value="">Seleccione un proveedor</option>
        <option value="crear-nueva">➕ Crear nuevo proveedor...</option>
      `;

      proveedores.forEach((p) => {
        const opcion = document.createElement("option");
        opcion.value = p.id_proveedor;
        opcion.textContent = p.nombre;
        selectProveedor.appendChild(opcion);
      });

      console.log(`✅ ${proveedores.length} proveedores cargados`);
    } catch (err) {
      console.error("💥 Error cargando proveedores:", err);
    }
  }

  // ======================================================
  // 🪄 PASO 4 — CREACIÓN RÁPIDA DESDE SELECTS
  // ======================================================
  document.addEventListener("change", async (e) => {
    // 🔹 CATEGORÍA
    if (e.target.id === "categoria" && e.target.value === "crear-nueva") {
      const nombre = prompt("🟢 Ingrese el nombre de la nueva categoría:");
      if (!nombre) return (e.target.value = "");

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:3001/api/categorias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre }),
        });
        const data = await res.json();
        alert("✅ Categoría creada correctamente");
        await cargarCategoriasEnSelect();
        e.target.value = data.data.id_categoria;
      } catch (err) {
        console.error("❌ Error creando categoría:", err);
        alert("Error al crear categoría");
        e.target.value = "";
      }
    }

    // 🔹 MARCA
    if (e.target.id === "marca" && e.target.value === "crear-nueva") {
      const nombre = prompt("🟡 Ingrese el nombre de la nueva marca:");
      if (!nombre) return (e.target.value = "");

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:3001/api/marcas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre }),
        });
        const data = await res.json();
        alert("✅ Marca creada correctamente");
        await cargarMarcasEnSelect();
        e.target.value = data.id_marca;
      } catch (err) {
        console.error("❌ Error creando marca:", err);
        alert("Error al crear marca");
        e.target.value = "";
      }
    }

    // 🔹 PROVEEDOR
    if (e.target.id === "proveedor" && e.target.value === "crear-nueva") {
      const nombre = prompt("🧩 Ingrese el nombre del nuevo proveedor:");
      if (!nombre) return (e.target.value = "");

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:3001/api/proveedores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre }),
        });
        const data = await res.json();
        alert("✅ Proveedor creado correctamente");
        await cargarProveedoresEnSelect();
        e.target.value = data.id_proveedor;
      } catch (err) {
        console.error("❌ Error creando proveedor:", err);
        alert("Error al crear proveedor");
        e.target.value = "";
      }
    }
  });
}
