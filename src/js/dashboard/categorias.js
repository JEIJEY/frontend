// ✅ Importaciones correctas
import apiClient from "../utilities/apiClient.js";
import { appEvents } from "../utilities/EventBus.js"; // 🔥 Cambiar a { appEvents }

const form = document.getElementById("formCategoria");
const lista = document.getElementById("listaCategorias");

async function cargarCategorias() {
  try {
    const categorias = await apiClient.getCategorias(); // ✅ usamos el método de la clase
    lista.innerHTML = "";
    categorias.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = `${cat.nombre} — ${cat.descripcion || ""}`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("❌ Error cargando categorías:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  if (!nombre) return;

  try {
    await apiClient.post("/categorias", { nombre, descripcion }); // ✅ usa apiClient
    form.reset();
    await cargarCategorias();
    appEvents.emit("categorias:actualizadas");
  } catch (err) {
    console.error("❌ Error creando categoría:", err);
  }
});

cargarCategorias();