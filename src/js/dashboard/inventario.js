// Datos simulados
const productos = [
  { id: 1, nombre: "Coca-Cola", categoria: "Bebidas", cantidad: 20, precio: 1500 },
  { id: 2, nombre: "Nutella", categoria: "Dulces", cantidad: 15, precio: 8000 },
  { id: 3, nombre: "M&M", categoria: "Dulces", cantidad: 50, precio: 2000 },
];

// Renderizar tabla
function renderizarTabla() {
  const tabla = document.getElementById("tablaProductos");
  tabla.innerHTML = "";

  productos.forEach(producto => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>${producto.cantidad}</td>
      <td>${producto.precio}</td>
      <td>
        <button class="btn-editar" data-id="${producto.id}">✏️</button>
        <button class="btn-eliminar" data-id="${producto.id}">🗑️</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Botón agregar producto
document.getElementById("btnAgregarProducto").addEventListener("click", () => {
  const nuevoProducto = {
    id: productos.length + 1,
    nombre: "Producto nuevo",
    categoria: "Sin categoría",
    cantidad: 1,
    precio: 1000,
  };
  productos.push(nuevoProducto);
  renderizarTabla();
});

// Inicializar tabla
renderizarTabla();
