// ✅ CRUD COMPLETO CATEGORÍAS
import apiClient from "../utilities/apiClient.js";
import { appEvents } from "../utilities/EventBus.js";

const form = document.getElementById("formCategoria");
const lista = document.getElementById("listaCategorias");

// 📝 FUNCIÓN PARA CARGAR CATEGORÍAS CON BOTONES CRUD
async function cargarCategorias() {
  try {
    const categorias = await apiClient.getCategorias();
    lista.innerHTML = "";
    
    categorias.forEach(cat => {
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
  }
}

// 🆕 FUNCIÓN PARA EDITAR CATEGORÍA
window.editarCategoria = async (id_categoria, nombreActual, descripcionActual) => {
  const nuevoNombre = prompt("Nuevo nombre:", nombreActual);
  if (nuevoNombre === null) return; // Usuario canceló
  
  const nuevaDescripcion = prompt("Nueva descripción:", descripcionActual);
  
  try {
    await apiClient.updateCategoria(id_categoria, {
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion
    });
    await cargarCategorias();
    appEvents.emit("categoria:actualizada", { id_categoria, nombre: nuevoNombre });
  } catch (err) {
    console.error("❌ Error editando categoría:", err);
    alert("Error al editar categoría");
  }
};

// 🗑️ FUNCIÓN PARA ELIMINAR CATEGORÍA
window.eliminarCategoria = async (id_categoria) => {
  if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
  
  try {
    await apiClient.deleteCategoria(id_categoria);
    await cargarCategorias();
    appEvents.emit("categoria:eliminada", { id_categoria });
  } catch (err) {
    console.error("❌ Error eliminando categoría:", err);
    alert("Error al eliminar categoría");
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
      await cargarCategorias();
      appEvents.emit("categoria:creada", { nombre, descripcion });
    } catch (err) {
      console.error("❌ Error creando categoría:", err);
      alert("Error al crear categoría");
    }
  });
}

// 🚀 INICIALIZAR
cargarCategorias();
