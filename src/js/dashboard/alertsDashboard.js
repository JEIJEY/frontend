// ======================================================
// 🚨 ALERTAS URGENTES DE STOCK CRÍTICO - DASHBOARD
// ======================================================

import apiClient from "../utilities/apiClient.js";
import { appEvents } from "../utilities/EventBus.js"; // ✅ Importar EventBus

// 🔥 Escuchar cuando se carga la vista de inventario
appEvents.on("vista-cargada", (vista) => {
  if (vista === "inventario") {
    console.log("🔄 Vista inventario cargada - reconectando alertas...");
    reconectarAlertas();
  }
});

// ======================================================
// 🧠 FUNCIÓN PRINCIPAL: Actualizar tarjeta original del HTML
// ======================================================
export async function cargarAlertasStock() {
  await reconectarAlertas();
}

// 🔥 FUNCIÓN ÚNICA para actualizar y conectar alertas
async function reconectarAlertas() {
  try {
    const data = await apiClient.get("/alerts/dashboard");
    console.log("🧠 Datos de alertas:", data);

    const card = document.querySelector(".invp-action-card--urgent");
    if (!card) {
      console.warn("⚠️ No se encontró la tarjeta de alertas en el HTML");
      return;
    }

    const total = data?.data?.total ?? 0;
    const info = card.querySelector(".invp-action-card__content");
    if (info) {
      info.innerHTML = `
        <p><strong>${total}</strong> producto${total !== 1 ? "s" : ""} con stock crítico</p>
        <button class="invp-action-button invp-alert-btn"${total === 0 ? " disabled" : ""}>Ver y resolver</button>
      `;
    }

    // 🔥 RECONECTAR EVENTO - siempre que se llame esta función
    const btn = card.querySelector(".invp-alert-btn");
    if (btn && !btn.disabled) {
      // Limpiar evento anterior y agregar nuevo
      const nuevoBtn = btn.cloneNode(true);
      btn.replaceWith(nuevoBtn);
      
      nuevoBtn.addEventListener("click", abrirModalAlertas);
      console.log("🖱️ Evento click RECONECTADO al botón de alertas");
    }
  } catch (error) {
    console.error("❌ Error al cargar alertas:", error);
  }
}

// ======================================================
// 🪟 MODAL: Mostrar productos con stock crítico (SOLO UNA VEZ)
// ======================================================
async function abrirModalAlertas() {
  try {
    console.log("🔄 Abriendo modal de alertas...");
    
    const data = await apiClient.get("/alerts/dashboard");
    const productos = data?.data?.productos || [];

    // 🔹 Eliminar modal anterior si existe
    const anterior = document.querySelector(".invp-modal-overlay");
    if (anterior) {
      console.log("🗑️ Eliminando modal anterior");
      anterior.remove();
    }

    // 🔹 Crear overlay y contenido
    const overlay = document.createElement("div");
    overlay.className = "invp-modal-overlay";
    overlay.innerHTML = `
      <div class="invp-modal">
        <h2 class="invp-modal-title">📦 Productos con stock crítico</h2>
        ${
          productos.length === 0
            ? `<p class="invp-modal-empty">No hay productos críticos ✅</p>`
            : `
          <ul class="invp-modal-list">
            ${productos
              .map(
                (p) => `
                <li class="invp-modal-item">
                  <div>
                    <strong class="invp-modal-name">${p.nombre}</strong>
                    <p class="invp-modal-desc">${p.descripcion || "Sin descripción"}</p>
                  </div>
                  <div class="invp-modal-stock">
                    <span>${p.stock}/${p.stock_minimo} ${p.unidad_medida}</span>
                    <span class="invp-modal-price">$${Number(p.precio_unitario).toLocaleString()}</span>
                  </div>
                </li>`
              )
              .join("")}
          </ul>`
        }
        <button class="invp-modal-close">Cerrar</button>
      </div>
    `;

    // 🔹 Añadir al body
    document.body.appendChild(overlay);
    console.log("✅ Modal agregado al DOM");

    // 🔹 DEBUG: Verificar si el modal está en el DOM
    console.log("🔍 Modal en DOM:", document.querySelector(".invp-modal-overlay"));
    console.log("🔍 Estilos computados:", window.getComputedStyle(overlay).display);

    // 🔹 Configurar cierre
    overlay.querySelector(".invp-modal-close").addEventListener("click", () => {
      console.log("❌ Cerrando modal");
      overlay.remove();
    });
    
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        console.log("❌ Cerrando modal (click fuera)");
        overlay.remove();
      }
    });

    console.log("✅ Modal de alertas configurado correctamente");

  } catch (error) {
    console.error("❌ Error al abrir modal de alertas:", error);
  }
}