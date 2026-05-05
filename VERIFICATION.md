# VERIFICATION.md

## Verificación de SPA - Guía Genérica

Esta guía proporciona instrucciones para crear tests automatizados usando la plantilla `test-runner-template.html`.

---

## 1. Preparación del Entorno

### 1.1 Requisitos

- **Servidor HTTP**: Las pruebas requieren un servidor HTTP (no funciona con `file://`).
  - Five Server (VS Code): Click derecho > "Open with Live Server"
  - Python: `python -m http.server 8000`
  - Node: `npx serve`
- **Navegador moderno** con soporte para iframes

### 1.2 Instalación

1. Copiar `test-runner-template.html` y renombrarlo (ej: `test-runner.html`)
2. Modificar `CONFIG.SPA_URL` si el archivo de la SPA es diferente a `index.html`
3. Servir la carpeta con un servidor HTTP
4. Abrir `test-runner.html` en el navegador

---

## 2. Configuración del Test Runner

### 2.1 Constantes de Configuración

En el archivo `test-runner.html`, modificar según necesidad:

```javascript
const CONFIG = {
  SPA_URL: 'index.html',           // Archivo de la SPA
  IFRAME_SELECTOR: '#app-frame',  // Selector del iframe
  BASE_DELAY: 500,                 // Delay base entre pasos (ms)
  SUBMIT_DELAY: 2000              // Delay después de submits (ms)
};
```

### 2.2 Estructura Requerida

El test-runner debe incluir:

1. **Iframe visible** que cargue la SPA destino
2. **Botón "Ejecutar Todos"** para correr todos los tests
3. **Botón "Limpiar"** para resetear resultados
4. **Panel de logs** con contadores de Passed/Failed

```html
<iframe id="app-frame" src="index.html"></iframe>
<button onclick="runAllTests()">▶ Ejecutar Todos</button>
<button onclick="clearResults()">Limpiar</button>
<div id="passed">0</div>
<div id="failed">0</div>
```

---

## 3. Estructura de un Test

### 3.1 Plantilla Base

Cada test debe seguir esta estructura:

```javascript
async function runMiTest() {
  // 1. Obtener referencia al DOM del iframe
  const doc = getIframeDoc();
  if (!doc) return;

  // 2. Registrar inicio del test
  logStep('🚀 Test: Descripción del test');

  try {
    // 3. Ejecutar pasos del test
    //    - Navegar a rutas (#/ruta)
    //    - Rellenar formularios
    //    - Hacer click en botones
    //    - Verificar resultados

    // 4. Marcar como Passed o Failed
    logStep('✅ Test completado', 'success');
    passedCount++;
  } catch (e) {
    logStep(`❌ Error: ${e.message}`, 'error');
    failedCount++;
  }

  updateSummary();
}
```

### 3.2 Pasos Típicos de un Test

1. **Navegación**: Usar links con rutas hash
   ```javascript
   const navLink = doc.querySelector('a[href="#/ruta"]');
   if (navLink) navLink.click();
   await delay(CONFIG.BASE_DELAY);
   ```

2. **Rellenar formularios**: Seleccionar inputs por ID
   ```javascript
   doc.querySelector('#monto').value = '100';
   doc.querySelector('#categoria').value = 'categoria1';
   doc.querySelector('#descripcion').value = 'Test';
   ```

3. **Enviar formularios**: Usar dispatchEvent
   ```javascript
   const form = doc.querySelector('#mi-form');
   form.dispatchEvent(new Event('submit', { bubbles: true }));
   await delay(CONFIG.SUBMIT_DELAY);
   ```

4. **Hacer clicks**: Seleccionar botones
   ```javascript
   const btn = doc.querySelector('.btn--edit');
   if (btn) btn.click();
   ```

5. **Regresar a Home**: Al final del test (recomendado)
   ```javascript
   const homeLink = doc.querySelector('a[href="#/"]');
   if (homeLink) homeLink.click();
   ```

### 3.3 Funciones Auxiliares Disponibles

| Función | Descripción |
|---------|-------------|
| `getIframeDoc()` | Obtiene el documento del iframe |
| `logStep(msg, type)` | Registra mensaje (type: 'info', 'success', 'error') |
| `delay(ms)` | Espera milisegundos |
| `waitForElement(selector)` | Espera a que exista un elemento |
| `updateSummary()` | Actualiza contadores en UI |

---

## 4. Tipos de Tests Comunes

### 4.1 Test de Creación (Create)

```javascript
async function runCreateTest() {
  const doc = getIframeDoc();
  if (!doc) return;

  logStep('🚀 Test: Crear elemento');

  // Navegar al formulario
  const addLink = doc.querySelector('a[href="#/agregar"]');
  if (addLink) addLink.click();
  await delay(CONFIG.BASE_DELAY);

  // Rellenar campos
  const form = doc.querySelector('#transaction-form');
  if (!form) {
    logStep('❌ Formulario no encontrado', 'error');
    failedCount++;
    updateSummary();
    return;
  }

  doc.querySelector('#monto').value = '100';
  doc.querySelector('#categoria').value = 'g1';
  doc.querySelector('#descripcion').value = 'Test';

  // Enviar
  form.dispatchEvent(new Event('submit', { bubbles: true }));
  await delay(CONFIG.SUBMIT_DELAY);

  // Regresar a home
  const homeLink = doc.querySelector('a[href="#/"]');
  if (homeLink) homeLink.click();

  logStep('✅ Test completado', 'success');
  passedCount++;
  updateSummary();
}
```

### 4.2 Test de Edición (Update)

```javascript
async function runEditTest() {
  const doc = getIframeDoc();
  if (!doc) return;

  logStep('🚀 Test: Editar elemento');

  // Ir a lista/historial
  const historyLink = doc.querySelector('a[href="#/historial"]');
  if (historyLink) historyLink.click();
  await delay(CONFIG.BASE_DELAY);

  // Buscar botón de edición
  const editBtn = doc.querySelector('.btn--edit');
  if (!editBtn) {
    logStep('❌ No hay elementos para editar', 'error');
    failedCount++;
    updateSummary();
    return;
  }
  editBtn.click();
  await delay(CONFIG.BASE_DELAY);

  // Modificar valores
  const montoInput = doc.querySelector('#monto');
  if (montoInput) montoInput.value = '200';

  // Guardar
  const form = doc.querySelector('#transaction-form');
  if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
  await delay(CONFIG.SUBMIT_DELAY);

  // Regresar a home
  const homeLink = doc.querySelector('a[href="#/"]');
  if (homeLink) homeLink.click();

  logStep('✅ Test completado', 'success');
  passedCount++;
  updateSummary();
}
```

### 4.3 Test de Eliminación (Delete)

```javascript
async function runDeleteTest() {
  const doc = getIframeDoc();
  if (!doc) return;

  logStep('🚀 Test: Eliminar elemento');

  // Ir a historial
  const historyLink = doc.querySelector('a[href="#/historial"]');
  if (historyLink) historyLink.click();
  await delay(CONFIG.BASE_DELAY);

  // Buscar botón de eliminación
  const deleteBtn = doc.querySelector('.btn--delete');
  if (!deleteBtn) {
    logStep('❌ No hay elementos para eliminar', 'error');
    failedCount++;
    updateSummary();
    return;
  }
  deleteBtn.click();
  await delay(300);

  // Confirmar si hay modal
  const confirmBtn = doc.querySelector('.modal__btn--confirm');
  if (confirmBtn) confirmBtn.click();
  await delay(CONFIG.BASE_DELAY);

  // Regresar a home
  const homeLink = doc.querySelector('a[href="#/"]');
  if (homeLink) homeLink.click();

  logStep('✅ Test completado', 'success');
  passedCount++;
  updateSummary();
}
```

### 4.4 Test de Filtros

```javascript
async function runFilterTest() {
  const doc = getIframeDoc();
  if (!doc) return;

  logStep('🚀 Test: Filtros');

  // Ir a historial donde están los filtros
  const historyLink = doc.querySelector('a[href="#/historial"]');
  if (historyLink) historyLink.click();
  await delay(CONFIG.BASE_DELAY);

  // Probar cada filtro
  const filterA = doc.querySelector('#filter-tipoA');
  if (filterA) filterA.click();
  await delay(CONFIG.BASE_DELAY);

  const filterB = doc.querySelector('#filter-tipoB');
  if (filterB) filterB.click();
  await delay(CONFIG.BASE_DELAY);

  // Quitar filtros
  const filterAll = doc.querySelector('#filter-all');
  if (filterAll) filterAll.click();

  logStep('✅ Test completado', 'success');
  passedCount++;
  updateSummary();
}
```

### 4.5 Test de Exportación

```javascript
async function runExportTest() {
  const doc = getIframeDoc();
  if (!doc) return;

  logStep('🚀 Test: Exportar Datos');

  // Abrir settings
  const settingsBtn = doc.querySelector('.settings-btn');
  if (settingsBtn) settingsBtn.click();
  await delay(CONFIG.BASE_DELAY);

  // Buscar exportar en modal
  const modal = doc.querySelector('.modal-overlay--active');
  if (!modal) {
    logStep('❌ Modal no se abrió', 'error');
    failedCount++;
    updateSummary();
    return;
  }

  const exportBtn = modal.querySelector('button[onclick="exportData()"]');
  if (exportBtn) {
    exportBtn.click();
    await delay(CONFIG.BASE_DELAY);
    logStep('✅ Datos exportados');
  }

  // Cerrar modal
  const closeBtn = doc.querySelector('#modal-cancel');
  if (closeBtn) closeBtn.click();

  logStep('✅ Test completado', 'success');
  passedCount++;
  updateSummary();
}
```

---

## 5. Registro de Tests

### 5.1 Ejecutar Tests en Secuencia

En `runAllTestsSequence()`, definir el orden de ejecución:

```javascript
async function runAllTestsSequence() {
  logStep('');
  logStep('▶ EJECUTANDO TODOS LOS TESTS');
  logStep('----------------------------------------');
  await delay(500);

  // El orden importa: algunos tests dependen de datos creados por otros
  await runCreateTest();
  await delay(1000);
  await runEditTest();
  await delay(1000);
  await runDeleteTest();
  await delay(1000);
  await runFilterTest();
  await delay(1000);
  await runExportTest();

  logStep('----------------------------------------');
  logStep('▶ TODOS LOS TESTS COMPLETADOS');
}
```

### 5.2 Orden Recomendado

1. **Create**: Crea datos necesarios para otros tests
2. **Read**: Verifica que los datos se muestren correctamente
3. **Update**: Modifica datos existentes
4. **Delete**: Elimina datos (debe ser último para limpieza)
5. **Otros**: Filtros, exportación, etc.

---

## 6. Identificación de Selectores

### 6.1 Cómo encontrar los selectores correctos

Usar DevTools del navegador (F12):

1. **Inspeccionar elemento**: Click derecho > Inspect
2. **Copiar selector**: Click derecho > Copy > Copy selector
3. **Consola de test**: En test-runner, ejecutar:
   ```javascript
   const doc = document.querySelector('#app-frame').contentDocument;
   doc.querySelectorAll('button')  // Listar todos los botones
   doc.querySelectorAll('a')        // Listar todos los links
   ```

### 6.2 Selectores Comunes

| Tipo | Ejemplo |
|------|---------|
| Por ID | `#monto`, `#categoria` |
| Por clase | `.btn--edit`, `.btn--delete` |
| Por atributo | `a[href="#/historial"]` |
| Por texto | `button:contains("Guardar")` |

---

## 7. Checklist de Tests por HU

*Plantilla genérica para cualquier Historia de Usuario (HU).*

| HU | Tests Requeridos | Estado |
|----|-----------------|--------|
| [ID-HU] | [CRUD + Filtros + Export] | [ ] |

**Instrucciones:**
1. Para cada HU nueva, añadir una fila con su ID, tests requeridos y estado `[ ]`.
2. Marcar `[x]` al completar todos los tests de la HU.
3. Los tests deben cubrir los criterios de aceptación de la HU.

---

## 8. Verificación Manual

### 8.1 Navegación SPA
- [ ] Al hacer clic, la URL cambia sin recarga de página
- [ ] Botón "atrás" vuelve a la vista anterior
- [ ] Botón "adelante" funciona

### 8.2 UI/UX
- [ ] Loading spinner durante carga de datos
- [ ] Mensajes de error visibles
- [ ] Estados vacíos tienen diseño
- [ ] Sin parpadeo entre vistas

### 8.3 Console (F12)
- [ ] Sin errores rojos
- [ ] Sin warnings

---

## 9. Criterios de Calidad

- [ ] Sin dependencias innecesarias
- [ ] Código modular y reutilizable
- [ ] Sin memory leaks
- [ ] CSS no bloqueante
- [ ] Imágenes optimizadas

---

## 10. Troubleshooting

| Problema | Solución |
|----------|----------|
| Iframe no carga | Verificar que el servidor HTTP esté corriendo |
| Tests fallan | Revisar selectores con DevTools |
| Navegación no funciona | Verificar que la SPA use rutas hash (#/ruta) |
| Datos no persisten | Verificar localStorage después de cada test |
| Tiempos de espera | Aumentar BASE_DELAY o SUBMIT_DELAY |

---

## Historial de Ejecución de Tests

| Fecha | HU | Tests Pasados | Tests Fallidos | Ejecutado Por |
|-------|-----|---------------|----------------|---------------|
| | | | | | |