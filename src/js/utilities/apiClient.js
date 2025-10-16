// apiClient.js — Wrapper para peticiones API
/* const BASE_URL = "http://localhost:3001/api"; // ajusta según tu backend

async function request(endpoint, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  };
  if (options.body) config.body = JSON.stringify(options.body);

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: "POST", body }),
  put: (url, body) => request(url, { method: "PUT", body }),
  del: (url) => request(url, { method: "DELETE" }),
};
 */




// src/js/utils/apiClient.js (modo simulación temporal)
export const api = {
  get: async () => [
    { id: 1, nombre: "Bebidas", descripcion: "Categoría de prueba" },
    { id: 2, nombre: "Snacks", descripcion: "Galletas y papas" },
  ],
  post: async (url, body) => {
    console.log("Mock POST:", body);
    alert(`Categoría creada: ${body.nombre}`);
  },
};
