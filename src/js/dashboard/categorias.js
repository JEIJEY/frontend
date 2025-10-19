// ✅ CRUD COMPLETO CATEGORÍAS - VERSIÓN CON TARJETAS CLICKEABLES
import apiClient from "../utilities/apiClient.js";
import { appEvents } from "../utilities/EventBus.js";
import { NavegacionCategorias } from "./navegacion-categorias.js";

console.log("🎯 Módulo de categorías iniciando...");
console.log("🔍 NavegacionCategorias importado:", typeof NavegacionCategorias);
console.log("🔍 Estado del DOM:", document.readyState);

const form = document.getElementById("formCategoria");
const lista = document.getElementById("listaCategorias");

// 🔒 Helper para evitar errores con comillas
const _safe = (s = "") => String(s).replace(/'/g, "\\'");

// ======================================================
// 🎯 CARGAR JERARQUÍA COMPLETA DE CATEGORÍAS
// ======================================================
async function cargarCategorias() {
  try {
    console.log("🔄 Cargando jerarquía de categorías...");
    const categorias = await apiClient.getJerarquiaCategorias();
    console.log("✅ Jerarquía recibida:", categorias);

    lista.innerHTML = "";

    if (!categorias || categorias.length === 0) {
      lista.innerHTML = '<li class="no-items">No hay categorías registradas</li>';
      return;
    }

    // 🔥 FILTRAR SOLO CATEGORÍAS RAÍZ (nivel 0)
    const categoriasRaiz = categorias.filter(cat => cat.nivel === 0);
    console.log(`📊 Mostrando ${categoriasRaiz.length} categorías raíz de ${categorias.length} total`);

    if (categoriasRaiz.length === 0) {
      lista.innerHTML = '<li class="no-items">No hay categorías raíz registradas</li>';
      return;
    }

    // 🔥 Renderizado SOLO categorías raíz
    categoriasRaiz.forEach(cat => {
      const li = document.createElement("li");
      li.className = "categoria-card";
      li.innerHTML = `
        <div class="card" onclick="abrirDetalleCategoria(${cat.id_categoria}, '${_safe(cat.nombre)}')">
          <div class="card-header">
            <h3>${cat.nombre}</h3>
            <span class="badge">${cat.nivel === 0 ? 'Categoría' : 'Subcategoría'}</span>
          </div>
          <p class="card-desc">${cat.descripcion && cat.descripcion.trim() !== "" ? cat.descripcion : "Sin descripción"}</p>
          <div class="card-actions">
            <button class="btn-small" onclick="event.stopPropagation(); crearSubcategoria(${cat.id_categoria}, '${_safe(cat.nombre)}')">
              ➕ Sub
            </button>
            <button class="btn-small btn-edit" onclick="event.stopPropagation(); editarCategoria(${cat.id_categoria}, '${_safe(cat.nombre)}', '${_safe(cat.descripcion || '')}')">
              ✏️
            </button>
            <button class="btn-small btn-delete" onclick="event.stopPropagation(); eliminarCategoria(${cat.id_categoria})">
              🗑️
            </button>
          </div>
        </div>
      `;
      lista.appendChild(li);
    });

  } catch (err) {
    console.error("❌ Error cargando jerarquía:", err);
    alert("Error al cargar categorías jerárquicas: " + err.message);
  }
}

// ======================================================
// 🎯 ABRIR VISTA DETALLE DE CATEGORÍA
// ======================================================
window.abrirDetalleCategoria = (id, nombre) => {
  console.log(`🔍 Abriendo detalle de: ${nombre}`);
  
  // Ocultar lista principal
  document.getElementById('vistaRaiz').style.display = 'none';
  // Mostrar vista detalle
  document.getElementById('vistaDetalle').style.display = 'block';
  
  // Cargar información de esa categoría
  cargarVistaDetalle(id, nombre);
};

// ======================================================
// 🎯 CARGAR VISTA DETALLADA DE UNA CATEGORÍA
// ======================================================
async function cargarVistaDetalle(categoriaId, nombreCategoria) {
  try {
    // Actualizar textos base
    document.getElementById("detalleTitulo").textContent = `Categoría: ${nombreCategoria}`;
    document.getElementById("detalleNombre").textContent = nombreCategoria;

    // ✅ Guardar el ID actual globalmente
    window.categoriaActualId = categoriaId;

    // 1️⃣ Obtener información completa de la categoría
    const categoria = await apiClient.getCategoriaById(categoriaId);
    document.getElementById("detalleDescripcion").textContent =
      categoria.descripcion || "Sin descripción";

    // 2️⃣ Cargar subcategorías
    const subcategorias = await apiClient.get(`/categorias/${categoriaId}/subcategorias`);
    document.getElementById("detalleSubcount").textContent = subcategorias.length;
    renderSubcategorias(subcategorias);

    // 3️⃣ Cargar productos (más adelante lo conectaremos con tu módulo de productos)
    let productos = [];
    try {
      productos = await apiClient.get(`/productos/categoria/${categoriaId}`);
    } catch {
      console.warn("⚠️ No se encontró endpoint de productos, se omite por ahora.");
    }

    document.getElementById("detalleProductos").textContent = productos.length;
    renderProductos(productos);

  } catch (err) {
    console.error("❌ Error cargando detalle:", err);
    alert("Error al cargar el detalle de la categoría");
  }
}

// ======================================================
// 🎯 RENDERIZAR SUBCATEGORÍAS
// ======================================================
function renderSubcategorias(subcategorias) {
  const container = document.getElementById("listaSubcategorias");
  container.innerHTML = "";

  if (subcategorias.length === 0) {
    container.innerHTML = '<p class="no-items">No hay subcategorías</p>';
    return;
  }

  subcategorias.forEach(sub => {
    const card = document.createElement("div");
    card.className = "categoria-card small";
    card.innerHTML = `
      <div class="card" onclick="abrirDetalleCategoria(${sub.id_categoria}, '${_safe(sub.nombre)}')">
        <h4>${sub.nombre}</h4>
        <p>${sub.descripcion || "Sin descripción"}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// ======================================================
// 🎯 RENDERIZAR PRODUCTOS (con precio real formateado)
// ======================================================
function renderProductos(productos) {
  const container = document.getElementById("listaProductos");
  container.innerHTML = "";

  if (!productos || productos.length === 0) {
    container.innerHTML = '<p class="no-items">No hay productos en esta categoría</p>';
    return;
  }

  productos.forEach(prod => {
    console.log("🧾 Producto recibido:", prod); // 👈 útil para verificar campos
    const card = document.createElement("div");
    card.className = "producto-card";
    
    // Formatear el precio en formato colombiano
    const precioFormateado = parseFloat(prod.precio_unitario || 0).toLocaleString("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    card.innerHTML = `
      <div class="card">
        <img src="${prod.imagen || '../assets/images/default-product.png'}" alt="${prod.nombre}">
        <h4>${prod.nombre}</h4>
        <p class="precio">$${precioFormateado}</p>
        <p class="stock">Stock: ${prod.stock || 0}</p>
      </div>
    `;
    container.appendChild(card);
  });
}


// ======================================================
// 🎯 VOLVER A LA LISTA PRINCIPAL
// ======================================================
window.volverALista = () => {
  document.getElementById("vistaDetalle").style.display = "none";
  document.getElementById("vistaRaiz").style.display = "block";
};

// ======================================================
// 🎯 CREAR SUBCATEGORÍA DESDE LA VISTA DETALLE
// ======================================================
window.crearSubcategoriaEnDetalle = async () => {
  const categoriaActual = document.getElementById("detalleNombre").textContent;
  const categoriaId = window.categoriaActualId;

  await crearSubcategoria(categoriaId, categoriaActual);
  await cargarVistaDetalle(categoriaId, categoriaActual); // 🔁 recargar después de crear
};

// ======================================================
// 🎯 CREAR SUBCATEGORÍA (contextual)
// ======================================================
window.crearSubcategoria = async (parentId, nombrePadre) => {
  const nombre = prompt(`Nombre de la subcategoría dentro de "${nombrePadre}":`);
  if (!nombre) return;

  const descripcion = prompt("Descripción (opcional):") || "";

  try {
    await apiClient.createCategoria({ nombre, descripcion, parent_id: parentId });
    await cargarCategorias();
    alert(`✅ Subcategoría "${nombre}" creada correctamente bajo "${nombrePadre}"`);
  } catch (err) {
    console.error("❌ Error creando subcategoría:", err);
    alert("Error al crear subcategoría: " + err.message);
  }
};

// ======================================================
// 🎯 EDITAR CATEGORÍA
// ======================================================
window.editarCategoria = async (id_categoria, nombreActual, descripcionActual) => {
  const nuevoNombre = prompt("Nuevo nombre:", nombreActual);
  if (nuevoNombre === null) return;

  const nuevaDescripcion = prompt("Nueva descripción:", descripcionActual);

  try {
    await apiClient.updateCategoria(id_categoria, {
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion,
    });
    await cargarCategorias();
    appEvents.emit("categoria:actualizada", { id_categoria, nombre: nuevoNombre });
    alert("✅ Categoría actualizada correctamente");
  } catch (err) {
    console.error("❌ Error editando categoría:", err);
    alert("Error al editar categoría: " + err.message);
  }
};

// ======================================================
// 🎯 ELIMINAR CATEGORÍA
// ======================================================
window.eliminarCategoria = async (id_categoria) => {
  if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;

  try {
    await apiClient.deleteCategoria(id_categoria);
    await cargarCategorias();
    appEvents.emit("categoria:eliminada", { id_categoria });
    alert("✅ Categoría eliminada correctamente");
  } catch (err) {
    console.error("❌ Error eliminando categoría:", err);

    if (err.message.includes("400")) {
      alert("❌ No se puede eliminar la categoría porque tiene productos asociados.");
    } else {
      alert("Error al eliminar categoría: " + err.message);
    }
  }
};

// ======================================================
// 🎯 MANEJADOR DEL FORMULARIO (CREATE)
// ======================================================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!nombre) {
      alert("El nombre es requerido");
      return;
    }

    try {
      await apiClient.createCategoria({ nombre, descripcion });
      form.reset();
      await cargarCategorias();
      appEvents.emit("categoria:creada", { nombre, descripcion });
      alert("✅ Categoría creada correctamente");
    } catch (err) {
      console.error("❌ Error creando categoría:", err);
      alert("Error al crear categoría: " + err.message);
    }
  });
}

// ======================================================
// 🎯 INICIALIZACIÓN
// ======================================================
function inicializarModulos() {
  console.log("🎯 DOM listo - Iniciando módulos...");
  cargarCategorias();
  console.log("🎯 Llamando a NavegacionCategorias.init()...");
  NavegacionCategorias.init();
}

// Verificar si el DOM ya está cargado
if (document.readyState === "loading") {
  console.log("🎯 DOM todavía cargando, esperando DOMContentLoaded...");
  document.addEventListener("DOMContentLoaded", inicializarModulos);
} else {
  console.log("🎯 DOM ya está listo, ejecutando inmediatamente...");
  setTimeout(inicializarModulos, 0);
}

// 🔥 EXPORTAR PARA USO GLOBAL
window.cargarCategorias = cargarCategorias;


// ======================================================
// 🎯 MODAL PARA AGREGAR PRODUCTOS
// ======================================================

// Función para abrir el modal
window.mostrarModalProducto = function(categoriaId, categoriaNombre) {
  document.getElementById('modalCategoriaId').value = categoriaId;
  document.getElementById('modalCategoriaNombre').textContent = categoriaNombre;
  document.getElementById('modalProducto').style.display = 'flex';
  
  // Cargar marcas y proveedores
  cargarMarcasYProveedores();
  
  // Enfocar el primer campo
  document.getElementById('productoNombre').focus();
};

// Función para cerrar el modal
window.cerrarModalProducto = function() {
  document.getElementById('modalProducto').style.display = 'none';
  document.getElementById('formProducto').reset();
};

// Cargar marcas y proveedores para los selects
async function cargarMarcasYProveedores() {
  try {
    // Cargar marcas
    const marcas = await apiClient.get('/marcas');
    const marcaSelect = document.getElementById('productoMarca');
    marcaSelect.innerHTML = '<option value="">Sin marca</option>';
    marcas.forEach(marca => {
      if (marca.estado) {
        const option = document.createElement('option');
        option.value = marca.id_marca;
        option.textContent = marca.nombre;
        marcaSelect.appendChild(option);
      }
    });

    // Cargar proveedores
    const proveedores = await apiClient.get('/proveedores');
    const proveedorSelect = document.getElementById('productoProveedor');
    proveedorSelect.innerHTML = '<option value="">Sin proveedor</option>';
    proveedores.forEach(proveedor => {
      const option = document.createElement('option');
      option.value = proveedor.id_proveedor;
      option.textContent = proveedor.nombre;
      proveedorSelect.appendChild(option);
    });
  } catch (error) {
    console.warn('⚠️ No se pudieron cargar marcas/proveedores:', error);
  }
}

// Manejar envío del formulario
document.getElementById('formProducto').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const categoriaId = document.getElementById('modalCategoriaId').value;
  const productoData = {
    nombre: document.getElementById('productoNombre').value.trim(),
    descripcion: document.getElementById('productoDescripcion').value.trim(),
    precio_unitario: parseFloat(document.getElementById('productoPrecio').value),
    stock: parseInt(document.getElementById('productoStock').value),
    unidad_medida: document.getElementById('productoUnidad').value,
    id_marca: document.getElementById('productoMarca').value || null,
    id_proveedor: document.getElementById('productoProveedor').value || null,
    estado: parseInt(document.getElementById('productoEstado').value)
  };

  // Validación básica
  if (!productoData.nombre || !productoData.precio_unitario || !productoData.stock || !productoData.unidad_medida) {
    alert('❌ Por favor completa los campos obligatorios');
    return;
  }

  try {
    console.log('🔄 Creando producto en categoría:', categoriaId, productoData);
    
    // ✅ Usar el NUEVO endpoint específico para categorías
    const response = await apiClient.post(`/categorias/${categoriaId}/productos`, productoData);
    
    console.log('✅ Producto creado:', response);
    
    // Cerrar modal
    cerrarModalProducto();
    
    // Recargar la vista detalle para mostrar el nuevo producto
    const categoriaNombre = document.getElementById('detalleNombre').textContent;
    await cargarVistaDetalle(categoriaId, categoriaNombre);
    
    // Mostrar mensaje de éxito
    alert(`✅ Producto "${productoData.nombre}" agregado correctamente`);
    
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    alert('❌ Error al crear producto: ' + error.message);
  }
});

// Cerrar modal al hacer clic fuera del contenido
document.getElementById('modalProducto').addEventListener('click', function(e) {
  if (e.target.id === 'modalProducto') {
    cerrarModalProducto();
  }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('modalProducto').style.display === 'flex') {
    cerrarModalProducto();
  }
});