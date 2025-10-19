# 🧠 PLAN DE IMPLEMENTACIÓN - TAXONOMÍA DINÁMICA

**Proyecto:** Sistema de Gestión de Inventario “La Rivera”  
**Módulo:** Taxonomía Dinámica de Categorías  
**Autor:** Jeison Ferney Ávila Quintero  
**Metodología:** SCRUM (Iterativo Continuo)  
**Versión:** 1.0  

---

## 📋 FASE 0: PREPARACIÓN — **PRIORIDAD ABSOLUTA**

### 🔧 0.1 Setup Frontend
**Tareas:**
- [ b] Crear `categorias.html` (estructura base)
- [ b] Crear `categorias.js` (módulo vacío)
- [ b] Configurar `EventBus.js` en `/src/js/utils/`
- [ b] Establecer conexión API básica (`fetch wrapper`)

**Acciones inmediatas:**
1. Crear `categorias.html` en `/src/pages/dashboard/`
2. Crear `categorias.js` en `/src/js/dashboard/`
3. Implementar `EventBus.js` en `/src/js/utils/`
4. Verificar comunicación básica con API (`GET /api/categorias`)

---

## 🚀 FASE 1: MVP FUNCIONAL — **BASE DEL SISTEMA**

### ⚙️ Backend – CRUD Básico
- [ ] Modelo `Categoria` con campos mínimos:
  - `id`, `nombre`, `descripcion`, `parent_id`, `es_activo`
- [ ] Endpoints REST activos
- [ ] Soft delete implementado (`es_activo = false`)
- [ ] Pruebas con Thunder Client (crear, listar, eliminar)

### 💻 Frontend – Interfaz Mínima
- [ ] Formulario simple: nombre + descripción
- [ ] Lista plana (`ul > li`)
- [ ] Botones: Crear / Eliminar (con confirmación)
- [ ] Conexión real con API (`fetch` o wrapper)

### 🔗 Integración Inventario
- [ ] En `categorias.js`: emitir evento al crear/eliminar categoría
- [ ] En `inventario.js`: escuchar evento y recargar filtros dinámicamente
- [ ] Verificar que las categorías nuevas aparecen en los filtros de inventario

#### ✅ **Criterios de Éxito Fase 1**
- Puedo crear una categoría raíz (ej. “Bebidas”) desde el frontend  
- “Bebidas” aparece en los filtros del inventario  
- Puedo filtrar productos por la nueva categoría  
- No existen errores visibles en consola  

---

## 🌳 FASE 2: JERARQUÍA VISUAL — **NAVEGACIÓN ESTRUCTURADA**

### ⚙️ Backend – Árbol
- [ ] Endpoint `/api/categorias/arbol` devuelve jerarquía completa
- [ ] Campo `has_children` para optimización
- [ ] Validaciones básicas de integridad

### 💻 Frontend – Componente Árbol
- [ ] Crear componente `category-tree.js`
- [ ] Renderizar estructura jerárquica (`ul > li`)
- [ ] Botones expandir / contraer (`+` / `–`)
- [ ] Iconos o indentaciones visuales para niveles

### ➕ Subcategorías
- [ ] Dropdown para seleccionar categoría padre al crear
- [ ] Validar duplicados en mismo nivel
- [ ] Verificar posición correcta dentro del árbol visual

#### ✅ **Criterios de Éxito Fase 2**
- El árbol jerárquico muestra correctamente relaciones padre-hijo  
- Puedo crear subcategorías desde el frontend  
- Puedo navegar entre categorías sin recargar la página  

---

## ⚡ FASE 3: GESTIÓN AVANZADA — **EXPERIENCIA PROFESIONAL**

### ⚙️ Backend – Validaciones Empresariales
- [ ] Prevenir ciclos jerárquicos (A → B → A)
- [ ] Evitar eliminar categorías con productos asociados
- [ ] Impedir eliminar categorías con subcategorías activas
- [ ] Calcular `nivel` y `ruta_completa` automáticamente

### 💻 Frontend – Edición Inline y Optimista
- [ ] Edición directa (doble click sobre el nombre)
- [ ] Actualización visual inmediata (*optimistic UI*)
- [ ] Revertir cambios si la API falla
- [ ] Confirmación para operaciones destructivas

### 🔍 Búsqueda y Navegación
- [ ] Input de búsqueda en tiempo real (con debounce)
- [ ] Expandir/contraer todo el árbol
- [ ] Breadcrumbs dinámicos
- [ ] Navegación por teclado o clic

#### ✅ **Criterios de Éxito Fase 3**
- Edición inline estable y fluida  
- Validaciones evitan inconsistencias lógicas  
- Búsqueda funcional e instantánea  
- Árbol completamente interactivo  

---

## 🎨 FASE 4: OPTIMIZACIÓN Y PULIDO — **PERFORMANCE Y UX**

### ⚙️ Rendimiento
- [ ] Lazy loading (cargar subcategorías solo al expandir)
- [ ] Debounce 300 ms en búsqueda
- [ ] Cache local de categorías
- [ ] Reducción de consultas redundantes

### 💻 UX y Diseño
- [ ] Estados de carga (`spinners`, placeholders)
- [ ] Mensajes visuales de éxito/error
- [ ] Tooltips informativos en botones
- [ ] Diseño responsive para tablet/móvil

### 🧪 Testing y QA
- [ ] Probar con más de 100 categorías
- [ ] Validar accesibilidad (etiquetas ARIA)
- [ ] Test manuales en distintos navegadores
- [ ] Documentación básica para administradores

#### ✅ **Criterios de Éxito Fase 4**
- Interfaz rápida y fluida incluso con muchos datos  
- Experiencia uniforme en móvil y escritorio  
- Sin bloqueos ni errores de rendimiento  

---

## 🔮 FASE 5: ATRIBUTOS DINÁMICOS (Opcional)

> Se implementa solo si las fases 1–4 están 100 % estables y funcionales.

### ⚙️ Backend – Esquema Flexible
- [ ] Campo `atributos_personalizados` (JSON)
- [ ] Endpoints para definir/editar esquemas
- [ ] Validación dinámica de tipos

### 💻 Frontend – Constructor Dinámico
- [ ] UI para crear atributos (texto, número, select, boolean)
- [ ] Drag & drop de campos (si es viable)
- [ ] Previsualización del formulario generado
- [ ] Persistencia en productos según categoría

### 🔗 Integración
- [ ] Formulario de producto se adapta automáticamente
- [ ] Validación de atributos requeridos
- [ ] Filtrado dinámico por atributos

#### ✅ **Criterios de Éxito Fase 5**
- El sistema soporta categorías con atributos personalizados  
- Los formularios de productos se adaptan dinámicamente  
- Se mantienen integridad y validaciones  

---

## 🛡️ GESTIÓN DE RIESGOS

| Riesgo | Impacto | Mitigación |
|--------|----------|------------|
| EventBus no comunica correctamente | Alto | Usar `CustomEvent` como fallback nativo |
| API no responde o tarda | Alto | Mock local temporal para desarrollo |
| Jerarquía excesiva o recursiva | Medio | Limitar profundidad inicial a 5 niveles |
| Errores en edición | Medio | Aplicar patrón *optimistic UI* con rollback |
| Saturación de DOM en árbol grande | Alto | Lazy rendering + virtual scrolling |
| Filtros de inventario no actualizan | Medio | Escuchar evento `categorias:actualizadas` en inventario |

---

## 📞 PUNTOS DE DECISIÓN

| Verificación | Acción |
|---------------|--------|
| Integración con inventario estable | Proceder a Jerarquía Visual |
| Árbol visual usable y estable | Proceder a Gestión Avanzada |
| Edición inline y búsqueda funcional | Proceder a Optimización |
| Optimización validada y sin errores | Considerar atributos dinámicos |

---

## 🚨 REGLA DE ORO

> ⚠️ **No avanzar a la siguiente fase hasta que la actual funcione al 100 %.**  
> Cada fase debe entregar valor funcional tangible y estable antes de continuar.

---

## ✅ RESULTADO ESPERADO

- Taxonomía jerárquica completamente dinámica  
- Comunicación modular mediante EventBus  
- Integración automática con el inventario  
- Interfaz fluida, intuitiva y optimizada  
- Arquitectura escalable lista para atributos personalizados  

---

> 🧱 *“Primero que funcione, luego que escale, y finalmente que brille.”*  
> — **Jeison Ferney Ávila Q.**  
> Arquitectura de Software – *Proyecto La Rivera*
