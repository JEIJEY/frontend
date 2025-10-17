# 🧾 BITÁCORA DE AVANCE – TAXONOMÍA DINÁMICA

**Proyecto:** Sistema de Gestión de Inventario “La Rivera”  
**Módulo:** Taxonomía Dinámica de Categorías  
**Autor:** Jeison Ferney Ávila Quintero  
**Metodología:** SCRUM Continuo  
**Repositorio:** `github.com/jeije/la-rivera`  
**Versión:** 1.0  

---

## 📋 Convenciones de Estado
| Estado | Significado |
|---------|-------------|
| 🟢 **Completado** | La tarea fue implementada y validada correctamente |
| 🟡 **En progreso** | Actualmente en desarrollo |
| 🔴 **Pendiente** | No iniciada o bloqueada |
| ⚫ **Revisión** | En proceso de testing o validación final |

---

## 🚧 SECCIÓN 1 – FASE 0: PREPARACIÓN

| Tarea | Estado | Detalle Técnico / Notas | Commit Asociado |
|--------|---------|--------------------------|------------------|
| Crear `categorias.html` base | 🟢 | Página creada en `/src/pages/dashboard/` con estructura inicial y header. | `init-categorias-html` |
| Crear `categorias.js` vacío | 🟢 | Archivo módulo creado y vinculado al HTML. | `init-categorias-js` |
| Configurar `EventBus.js` | 🟢 | Clase `EventBus` implementada en `/src/js/utils/` (emit/on). Falta probar eventos globales. | `feature-eventbus` |
| Configurar conexión API | 🟢 | Pendiente creación de `apiClient.js` con wrapper `fetch`. | — |

---

## ⚙️ SECCIÓN 2 – FASE 1: MVP FUNCIONAL

| Tarea | Estado | Detalle Técnico / Notas | Commit Asociado |
|--------|---------|--------------------------|------------------|
| Modelo `Categoria` y endpoints CRUD | 🟢 | Aún no implementado. Plan: usar Express + MySQL. | — |
| Formulario básico (nombre + descripción) | 🟢 | Pendiente estructura `<form>` y evento submit. | — |
| Listado plano de categorías (`ul > li`) | 🟢 | Requiere datos del endpoint `/api/categorias`. | — |
| Integración con inventario (`EventBus`) | 🔴 | Pendiente prueba de comunicación entre módulos. | — |

🧠 **Notas:**  
- Validar API backend antes de integrar frontend.  
- Implementar `fetchWrapper.js` reutilizable para `GET`, `POST`, `DELETE`.  

---

## 🌳 SECCIÓN 3 – FASE 2: JERARQUÍA VISUAL

| Tarea | Estado | Detalle Técnico / Notas | Commit Asociado |
|--------|---------|--------------------------|------------------|
| Endpoint `/api/categorias/arbol` | 🔴 | Por definir lógica recursiva en backend. | — |
| Componente `category-tree.js` | 🔴 | Estructura prevista: renderNode(), attachEvents(). | — |
| Crear subcategorías vía dropdown | 🔴 | Espera endpoint jerárquico estable. | — |
| Validar duplicados en mismo nivel | 🔴 | Implementar lógica backend (nombre + parent_id). | — |

🧠 **Notas:**  
- Usar estructura recursiva controlada (nivel ≤ 5).  
- Añadir íconos o indentación según profundidad.  

---

## ⚡ SECCIÓN 4 – FASE 3: GESTIÓN AVANZADA

| Tarea | Estado | Detalle Técnico / Notas | Commit Asociado |
|--------|---------|--------------------------|------------------|
| Edición inline optimista | 🔴 | Implementar `dblclick` + input editable. | — |
| Validaciones backend (ciclos, hijos, productos) | 🔴 | Pendiente implementación en modelo `Categoria`. | — |
| Búsqueda en tiempo real (debounce) | 🔴 | Requiere API `GET /api/categorias/search?q=`. | — |
| Breadcrumbs visuales | 🔴 | Crear componente reutilizable `breadcrumbs.js`. | — |

---

## 🎨 SECCIÓN 5 – FASE 4: OPTIMIZACIÓN Y UX

| Tarea | Estado | Detalle Técnico / Notas | Commit Asociado |
|--------|---------|--------------------------|------------------|
| Lazy loading de subcategorías | 🔴 | Pendiente implementación en `category-tree.js`. | — |
| Cache local de categorías | 🔴 | Usar `localStorage` o variable global temporal. | — |
| Tooltips y feedback visual | 🔴 | Integrar microcomponentes de UI. | — |
| Responsive design | 🔴 | Validar CSS grid + Tailwind responsive utilities. | — |

---

## 🔮 SECCIÓN 6 – ATRIBUTOS DINÁMICOS (Opcional)

| Tarea | Estado | Detalle Técnico / Notas | Commit Asociado |
|--------|---------|--------------------------|------------------|
| Campo `atributos_personalizados` (JSON) | 🔴 | Pendiente definición de esquema en backend. | — |
| UI de constructor dinámico | 🔴 | Implementar `DynamicFormBuilder` (drag & drop). | — |
| Adaptación del formulario de producto | 🔴 | Vincular atributos al modelo de producto. | — |

---

## 🧱 SECCIÓN 7 – BLOQUEADORES Y DEPENDENCIAS

| Tipo | Descripción | Acción Correctiva |
|------|--------------|------------------|
| ⚠️ Bloqueador | API backend aún no responde correctamente | Depurar conexión, probar con Thunder Client |
| ⚙️ Dependencia | Módulo de inventario activo en `/dashboard/inventario.js` | Sincronizar eventos con `appEvents` |
| 🧩 Tarea dependiente | Árbol requiere `GET /api/categorias/arbol` funcional | Completar backend antes del renderizado |

---

## 📈 SECCIÓN 8 – OBSERVACIONES GENERALES

- Priorizar integración funcional antes de estilos visuales.  
- Validar comunicación `EventBus` con módulo inventario antes de implementar jerarquía.  
- Usar commits descriptivos (`feature-`, `fix-`, `refactor-`).  
- Registrar capturas o evidencias técnicas de cada avance (Postman, navegador, consola).  

---

## 🧩 SECCIÓN 9 – REGISTRO DE COMMITS (HISTORIAL)

| Commit | Descripción breve | Fecha | Resultado |
|---------|--------------------|--------|------------|
| `init-categorias-html` | Creación de página base `categorias.html` | — | 🟢 Exitoso |
| `init-categorias-js` | Creación de módulo JS base | — | 🟢 Exitoso |
| `feature-eventbus` | Implementación inicial del EventBus global | — | 🟡 Pruebas pendientes |
| `fix-fetch-wrapper` | Wrapper API fetch reutilizable | — | 🔴 Fallo parcial |
| ... | ... | ... | ... |

---

## ✅ SECCIÓN 10 – CRITERIOS DE FINALIZACIÓN

- Todas las fases completadas sin errores críticos.  
- Árbol jerárquico estable y navegable.  
- EventBus comunica correctamente entre módulos.  
- Inventario filtra por categorías dinámicas.  
- Interfaz fluida, accesible y optimizada.  
- Código documentado y con commits limpios.

---

> ✍️ *Este documento sirve como registro técnico real de desarrollo y control de sprints.  
> 
> — **Jeison Ferney Ávila Q.**
