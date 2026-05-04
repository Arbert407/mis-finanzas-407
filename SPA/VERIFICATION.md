# VERIFICATION.md

## Verificación de SPA (file://)

### 1. Test Runner Automatizado

**Archivo:** `test-runner.html`

Si el archivo `test-runner.html` no existe, debe crearse. Este archivo sirve para ejecutar tests automatizados antes de cualquier verificación manual.

**Estructura requerida del test-runner:**

1. Debe incluir un `<iframe>` visible que cargue `index.html` para mostrar la aplicación durante los tests
2. Debe tener botones para ejecutar todos los tests y limpiar resultados
3. Debe mostrar un resumen con cantidad de tests pasados, fallidos y totales

```html
<!-- Iframe visible para testing interactivo -->
<iframe id="app-frame" src="index.html" style="width:100%; height:500px; border:1px solid #ccc;"></iframe>

<!-- Controles -->
<button onclick="runAllTests()">▶ Ejecutar Todos</button>
<button onclick="clearResults()">Limpiar</button>

<!-- Resultados -->
<div id="results"></div>
<div>Pasados: <span id="passed">0</span></div>
<div>Fallidos: <span id="failed">0</span></div>
```

**Para ejecutar:**
1. Abrir `test-runner.html` en navegador
2. Click en "▶ Ejecutar Todos"

Los tests utilizan el `<iframe>` para acceder al código de `index.html` (state, localStorage, DOM).

```html
<script>
// Acceder al código del iframe
const app = document.getElementById('app-frame').contentWindow;
const state = app.state;
const iframeDoc = app.document;
</script>
```

#### Formato de Tests con Detalle

Cada test debe incluir:
- **ID único** (ej: T-001)
- **Descripción clara** del test
- **Valores de entrada** usados
- **Resultado esperado**
- **Valor obtenido** si falla
- **Ubicación** del código que falló

```javascript
function test(id, name, fn, details) {
  try {
    fn();
    results.innerHTML += `<div class="test-result test-pass">[${id}] ✓ ${name}</div>`;
    return true;
  } catch (e) {
    results.innerHTML += `<div class="test-result test-fail">
      [${id}] ✗ ${name}<br>
      <pre class="test-details">${details}</pre>
    </div>`;
    return false;
  }
}

// Ejemplo de uso
test('T-001', 'DataService.create() crea transacción', () => {
  const input = { tipo: 'Ingreso', monto: 100, descripcion: 'Test' };
  const t = DataService.create(input);
  assert(t.id, 'debe tener id');
}, 'Input: {"tipo":"Ingreso","monto":100}\nExpected: id existe\nGot: ' + JSON.stringify(t));
```

### 1.1 Test Runner Interactivo (UI Testing)

Para pruebas de UI que requieren interacción (clicks, navegación), el test-runner muestra el iframe:

```html
<!-- Iframe visible para testing interactivo -->
<iframe id="app-frame" src="index.html" style="width:100%; height:500px; border:1px solid #ccc;"></iframe>

<script>
// Obtener acceso al iframe
const iframe = document.getElementById('app-frame');
const iframeDoc = iframe.contentDocument;

// Simular click en botón Editar
const editButton = iframeDoc.querySelector('[data-edit="id-transaccion"]');
editButton.click();

// Verificar que navega al formulario de edición
// La URL del iframe debe cambiar a #/editar/id-transaccion
</script>
```

El iframe visible permite:
- **Click manual** en botones (Editar, Eliminar, etc.)
- **Verificar navegación** entre rutas
- **Probar formularios** de manera visual
- **Debug UI** en tiempo real

### 1.2 Tests Automatizados de Botones

Para automatizar clicks en botones dentro del iframe:

```javascript
function clickButton(iframe, selector) {
  const doc = iframe.contentDocument;
  const btn = doc.querySelector(selector);
  if (btn) {
    btn.click();
    return true;
  }
  return false;
}

function getIframeURL(iframe) {
  return iframe.contentWindow.location.hash;
}

// Ejemplo: Test de navegación al editar
test('T-009', 'Click en Editar navega a /editar/:id', () => {
  const iframe = document.getElementById('app-frame');
  const doc = iframe.contentDocument;
  
  // Crear transacción primero
  DataService.create({ tipo: 'Ingreso', monto: 100 });
  
  // Ir a movimientos
  iframe.contentWindow.location.hash = '#/movimientos';
  
  // Click en botón editar
  const editBtn = doc.querySelector('[data-edit]');
  assert(editBtn !== null, 'debe haber botón editar');
  editBtn.click();
  
  // Verificar navegación
  const hash = getIframeURL(iframe);
  assert(hash.includes('/editar/'), 'debe navegar a /editar/');
}, 'Input: Click en botón [data-edit]\nExpected: URL cambia a #/editar/:id\nGot: ' + hash);
```

**Funciones helper para UI testing:**
- `clickButton(iframe, selector)` - Simula click en botón
- `getIframeURL(iframe)` - Obtiene hash actual del iframe
- `fillForm(iframe, data)` - Rellena formulario
- `submitForm(iframe)` - Envía formulario

### 2. Checklist de Tests por HU

*Plantilla genérica para cualquier Historia de Usuario (HU). No hardcodee HUs específicas; agregue filas dinámicamente según las HUs asignadas.*

| HU | Tests Requeridos | Estado |
|----|------------------|--------|
| **[ID-HU]** [Título de la HU] | [Tipos de tests: Lógica, UI, Integración] | [ ] |

**Instrucciones:**
1. Para cada HU nueva, añada una fila con su ID, título, tests requeridos y estado inicial `[ ]`.
2. Marque `[x]` al completar todos los tests de la HU.
3. Los tests deben cubrir los criterios de aceptación de la HU.

### 3. Checklist Funcional Manual

**Navegación SPA**
- [ ] Al hacer clic, la URL cambia sin recarga de página
- [ ] Botón "atrás" vuelve a la vista anterior
- [ ] Botón "adelante" funciona

**UI/UX**
- [ ] Loading spinner durante carga de datos
- [ ] Mensajes de error visibles
- [ ] Estados vacíos tienen diseño
- [ ] Sin parpadeo entre vistas

**Console (F12)**
- [ ] Sin errores rojos
- [ ] Sin warnings

### 4. Verificación de Tests (Console DevTools)

```javascript
// Ejecutar en test-runner.html
// Tests de Lógica
window.app.getTotalIncome()
window.app.getTotalExpense()
window.app.getBalance()
window.getCategoryById('salario')

// Tests de UI
document.querySelectorAll('.summary__item').length  // 3
document.querySelectorAll('.nav-link').length       // 3
document.querySelector('#transaction-form')         // no null

// Tests de Integración
localStorage.getItem('finanzas_transactions')
window.location.hash = '#/movimientos'
```

### 5. Criterios de Calidad

- [ ] Sin dependencias innecesarias
- [ ] Código modular
- [ ] Sin memory leaks
- [ ] CSS no bloqueante
- [ ] Imágenes optimizadas

### 6. Performance

En DevTools > Performance: grabar 3s de interacción, verificar "Long Tasks" <50ms.

---

##Historial de Ejecución de Tests

| Fecha | HU | Tests Pasados | Tests Fallidos | Ejecutado Por |
|-------|-----|---------------|----------------|---------------|
| | | | | |