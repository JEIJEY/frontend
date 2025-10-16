import { api } from "../utilities/apiClient.js";
import { appEvents } from "../utilities/EventBus.js";


const form = document.getElementById("formCategoria");
const lista = document.getElementById("listaCategorias");

async function cargarCategorias() {
  try {
    const categorias = await api.get("/categorias");
    lista.innerHTML = "";
    categorias.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = `${cat.nombre} — ${cat.descripcion || ""}`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Error cargando categorías:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  if (!nombre) return;

  try {
    await api.post("/categorias", { nombre, descripcion });
    form.reset();
    await cargarCategorias();
    appEvents.emit("categorias:actualizadas");
  } catch (err) {
    console.error("Error creando categoría:", err);
  }
});

cargarCategorias();
