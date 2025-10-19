# 🧠 PLAN DE ATAQUE — FASE 2 (Vista Categorías)

**Proyecto:** Sistema de Gestión de Inventario “La Rivera”  
**Módulo:** Taxonomía Dinámica – Vista Jerárquica de Categorías  
**Autor:** Jeison Ferney Ávila Quintero  
**Objetivo general:**  
Permitir que el usuario (administrador o empleado) pueda **navegar desde la vista de categorías hasta los productos finales**, mostrando la jerarquía completa y manteniendo coherencia visual con el dashboard principal.

---

## 🎯 OBJETIVO PRINCIPAL
Hacer que en `/categorias` se pueda navegar por toda la jerarquía de categorías, subcategorías y productos finales, con retroalimentación visual y navegación fluida.

---

## 🧭 ETAPA 1 — NAVEGACIÓN + BREADCRUMBS  

### 🎯 Meta
Construir la experiencia jerárquica completa de navegación entre niveles.

### 🔹 Tareas principales
- Implementar **breadcrumbs dinámicos** que muestren la ruta:
  ```
  Inicio > Categoría > Subcategoría > Producto
  ```
- Cada miga anterior debe ser **clickeable** para retroceder.  
- La última miga indica el **nivel actual** (texto sin acción).  
- Al hacer clic en una categoría:
  - Cargar sus **subcategorías** en el `main`.
- Al hacer clic en una subcategoría:
  - Cargar sus **productos** asociados.
- Agregar un **botón “Volver”** que sincronice con los breadcrumbs.  
- Mantener un **estado interno** con `rutaActual`, `categoriaActual` y `nivelActual`.  
- Emitir eventos globales con `EventBus` para mantener sincronía entre vistas.

### 🧩 Entregable
- Navegación fluida entre categorías / subcategorías / productos.  
- Breadcrumbs funcionales y dinámicos.  
- Transición de vistas sin recargar la página.

---

## 🪄 ETAPA 2 — VISTA DE PRODUCTOS EN CATEGORÍAS  

### 🎯 Meta
Mostrar productos asociados a cada categoría o subcategoría.

### 🔹 Tareas principales
- Diseñar **tarjetas de producto** con:
  - Imagen
  - Nombre
  - Descripción breve
  - Botón **“Ver detalles”**
- Mostrar productos consultando el endpoint:
  ```
  GET /api/productos?categoria_id={id}
  ```
- Implementar **transiciones suaves** entre niveles (fade o slide).  
- Crear **modal o vista detalle** para el producto seleccionado.  
- Mantener coherencia visual con los estilos del dashboard (`_product-cards.css`).

### 🧩 Entregable
- Vista limpia de productos dentro de sus categorías.  
- Navegación fluida desde subcategoría → productos → detalle.

---

## 🧱 ETAPA 3 — CREACIÓN DE SUBCATEGORÍAS  

### 🎯 Meta
Permitir la creación jerárquica de subcategorías directamente en la vista `/categorias`.

### 🔹 Tareas principales
- Botón contextual **“Agregar subcategoría”** visible en cada nivel de breadcrumb.  
- Abrir un **modal de creación contextual**, que detecte el `id` del padre actual.  
- Campos mínimos:
  - `nombre`
  - `descripcion`
  - `parent_id` (oculto, tomado del contexto)
- Validar **nombres únicos por nivel jerárquico.**
- Al guardar:
  - Emitir `categorias:actualizadas` con `EventBus`.
  - Actualizar el árbol visual y los breadcrumbs sin recargar.

### 🧩 Entregable
- Creación directa de subcategorías desde cualquier nivel.  
- Actualización automática del árbol jerárquico.  
- Validaciones activas con feedback visual.

---

## 🎨 ETAPA 4 — INTEGRACIÓN Y PULIDO FINAL  

### 🎯 Meta
Unificar todas las funciones de la Fase 2 y estabilizar la experiencia completa del módulo de categorías.

### 🔹 Tareas principales
- Sincronizar **`categorias.js` ↔ `inventario.js`** mediante `EventBus`.  
  - Si se crean o eliminan categorías, actualizar los filtros del inventario.
- Normalizar **estilos visuales**:
  - Bordes, tipografía, espaciados, colores y componentes reutilizables.  
- Agregar **manejo de estados visuales**:
  - `loading`: spinner o mensaje de carga.  
  - `error`: alerta visual o toast.  
  - `empty`: texto tipo “Sin categorías” o “Sin productos”.
- Verificar coherencia visual y navegacional en todos los niveles.
- Testing funcional con distintas profundidades (nivel 1 a nivel 5).

### 🧩 Entregable
- Módulo de categorías totalmente integrado y estable.  
- Interfaz fluida y profesional, coherente con el resto del dashboard.

---

## 🔁 ORDEN DE IMPLEMENTACIÓN

| Orden | Foco | Dependencia | Resultado |
|--------|------|--------------|------------|
| 1️⃣ | Estado de navegación (`rutaActual`, `categoriaActual`) | — | Base lógica del módulo |
| 2️⃣ | Breadcrumbs dinámicos | 1️⃣ | Navegación jerárquica visual |
| 3️⃣ | Carga de subniveles (categorías → subcategorías → productos) | 2️⃣ | Flujo funcional |
| 4️⃣ | Tarjetas de productos + transición | 3️⃣ | Vista fluida |
| 5️⃣ | Modal de subcategorías | 3️⃣ | Creación jerárquica directa |
| 6️⃣ | EventBus + Estilos + Estados | 4️⃣ / 5️⃣ | Integración completa |

---

## ✅ CRITERIOS DE ÉXITO (CIERRE DE FASE 2)

| Requisito | Resultado esperado |
|------------|--------------------|
| Breadcrumbs dinámicos operativos | Reflejan la ruta actual correctamente |
| Clic en categoría → subcategorías | Transición fluida |
| Clic en subcategoría → productos | Carga dinámica sin reload |
| Botón “Agregar subcategoría” contextual | Crea hijas correctamente |
| Árbol y formulario sincronizados | Comunicación EventBus estable |
| Estilos visuales coherentes | UI limpia, moderna y unificada |
| Estados de carga y error implementados | Flujo robusto y claro |

---

## 🧱 ARQUITECTURA DE FLUJO GENERAL

```
Usuario → /categorias
        ↓
[ Vista principal ]
  ├─ Breadcrumbs dinámicos
  ├─ Árbol jerárquico (categorías/subcategorías)
  ├─ Productos finales (tarjetas)
  └─ Botones: Volver / Crear subcategoría

        ↓ (acciones del usuario)

EventBus  ⇄  categorias.js  ⇄  inventario.js
        ↓
API REST (categorias / productos)
        ↓
Base de datos MySQL (parent_id, categoria_id)
```

---

## 🧩 RESULTADO FINAL ESPERADO

- Módulo `/categorias` totalmente funcional con jerarquía navegable.  
- Breadcrumbs dinámicos que reflejan la ruta actual.  
- Carga dinámica de subniveles y productos sin recargar la página.  
- Creación de subcategorías dentro del contexto actual.  
- Sincronización automática con inventario y otros módulos.  
- Interfaz limpia, fluida y coherente con todo el ecosistema *La Rivera*.

---

> 💬 *“Primero que funcione, luego que escale, y finalmente que brille.”*  
> — **Jeison Ferney Ávila Q.**
