// ✅ CRUD COMPLETO CATEGORÍAS - VERSIÓN CORREGIDA
import apiClient from "../utilities/apiClient.js";
import { appEvents } from "../utilities/EventBus.js";

const form = document.getElementById("formCategoria");
const lista = document.getElementById("listaCategorias");

// 📝 FUNCIÓN PARA CARGAR CATEGORÍAS - SOLO ACTIVAS (estado = 1)
async function cargarCategorias() {
  try {
    console.log("🔄 Cargando categorías...");
    const categorias = await apiClient.getCategorias();
    console.log("✅ Categorías recibidas:", categorias);
    
    // 🔥 FILTRAR: Mostrar solo categorías activas (estado = 1)
    const categoriasActivas = categorias.filter(cat => cat.estado === 1);
    console.log("🔥 Categorías activas:", categoriasActivas);
    
    lista.innerHTML = "";
    
    if (categoriasActivas.length === 0) {
      lista.innerHTML = '<li class="no-items">No hay categorías activas</li>';
      return;
    }
    
    categoriasActivas.forEach(cat => {
      const li = document.createElement("li");
      li.className = "categoria-item";
      li.innerHTML = `
        <span class="categoria-info">
          <strong>${cat.nombre}</strong> - ${cat.descripcion || "Sin descripción"}
        </span>
        <div class="categoria-actions">
          <button class="btn-editar" onclick="editarCategoria(${cat.id_categoria}, '${cat.nombre}', '${cat.descripcion || ''}')">
            <span class="material-icons">edit</span>
          </button>
          <button class="btn-eliminar" onclick="eliminarCategoria(${cat.id_categoria})">
            <span class="material-icons">delete</span>
          </button>
        </div>
      `;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("❌ Error cargando categorías:", err);
    alert("Error al cargar categorías: " + err.message);
  }
}

// 🆕 FUNCIÓN PARA EDITAR CATEGORÍA
window.editarCategoria = async (id_categoria, nombreActual, descripcionActual) => {
  const nuevoNombre = prompt("Nuevo nombre:", nombreActual);
  if (nuevoNombre === null) return;
  
  const nuevaDescripcion = prompt("Nueva descripción:", descripcionActual);
  
  try {
    await apiClient.updateCategoria(id_categoria, {
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion
    });
    await cargarCategorias(); // 🔄 Recargar la lista
    appEvents.emit("categoria:actualizada", { id_categoria, nombre: nuevoNombre });
    alert("✅ Categoría actualizada correctamente");
  } catch (err) {
    console.error("❌ Error editando categoría:", err);
    alert("Error al editar categoría: " + err.message);
  }
};

// 🗑️ FUNCIÓN PARA ELIMINAR CATEGORÍA
window.eliminarCategoria = async (id_categoria) => {
  if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
  
  try {
    await apiClient.deleteCategoria(id_categoria);
    // 🔥 IMPORTANTE: Recargar la lista después de eliminar
    await cargarCategorias();
    appEvents.emit("categoria:eliminada", { id_categoria });
    alert("✅ Categoría eliminada correctamente");
  } catch (err) {
    console.error("❌ Error eliminando categoría:", err);
    
    if (err.message.includes('400')) {
      alert('❌ No se puede eliminar la categoría porque tiene productos asociados.\n\nPor favor, reassigna o elimina los productos primero.');
    } else {
      alert("Error al eliminar categoría: " + err.message);
    }
  }
};

// 📤 MANEJADOR DEL FORMULARIO (CREATE)
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
      // 🔥 IMPORTANTE: Recargar la lista después de crear
      await cargarCategorias();
      appEvents.emit("categoria:creada", { nombre, descripcion });
      alert("✅ Categoría creada correctamente");
    } catch (err) {
      console.error("❌ Error creando categoría:", err);
      alert("Error al crear categoría: " + err.message);
    }
  });
}

// 🚀 INICIALIZAR
console.log("🎯 Módulo de categorías iniciando...");
document.addEventListener('DOMContentLoaded', function() {
  cargarCategorias();
});

// 🔥 EXPORTAR PARA USO GLOBAL
window.cargarCategorias = cargarCategorias;