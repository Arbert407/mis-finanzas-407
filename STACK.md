# STACK.md

## Tecnologías

### Lenguajes
- HTML5
- CSS3
- JavaScript (ES6+)

### APIs del Navegador
- DOM API
- Fetch API
- Web Storage API
- Custom Elements API

### Herramientas de Desarrollo
- Live Server (VS Code extension)
- Navegadores modernos (Chrome, Firefox, Edge)
- DevTools para debug

## Estructura del Proyecto

```
proyecto-spa/
├── index.html          # HTML con CSS y JS embebidos (inline)
├── test-runner.html          # HTML para realizar pruebas según VERIFICATION.md
```

## Reglas de Organización

- **NO crear carpetas css/ ni js/ tampoco archivos de CSS ni JS** - Todo el código va embebido en index.html

## Programación Funcional

- Todo el código se construye usando **solo funciones** (no clases, no objetos complejos)
- Las funciones deben ser **puras**: misma entrada → misma salida, sin side effects
- El estado se maneja de forma inmutable (no mutar objetos diretamente)
- Cada función debe tener una sola responsabilidad

## Documentación

Toda función debe incluir documentación con:
- Propósito de la función
- Descripción de parámetros
- Descripción del valor de retorno (si aplica)
- Funciones que llama este módulo
- Archivos involucrados

### Reglas de Comentarios

**Para cada módulo (.js):**
```js
/**
 * Nombre del Módulo - Breve descripción
 *
 * Descripción detallada del propósito del módulo.
 * Incluye información de estado global, servicios, o funciones clave.
 *
 * Funciones llamadas desde este módulo:
 *   - función1() => js/archivo, descripción breve
 *   - función2() => js/archivo, descripción breve
 *
 * Archivos involucrados:
 *   - js/estado.js (descripción)
 *   - js/componentes.js (descripción)
 */
```

**Para cada función:**
```js
// Descripción breve de qué hace la función.
// Más contexto si es necesario.
// Llama a: funciónX(), funciónY()
const miFuncion = () => {};
```

### Ejemplo de documentación

```js
/**
 * Calcula el total de una lista de precios.
 * @param {number[]} prices - Array de precios a sumar
 * @returns {number} Total calculado
 */
const calculateTotal = (prices) => prices.reduce((sum, p) => sum + p, 0);
```

### Módulos del Proyecto

Los módulos existentes siguen esta estructura:

| Archivo | Propósito |
|---------|----------|
| `js/app.js` | Entry point, router, service worker |
| `js/state.js` | Store, persistencia, sincronización |
| `js/views.js` | Renderizado de vistas |
| `js/components.js` | Charts, modals, datepicker |
| `js/utils.js` | Helpers, formateo, logging |

## Tamaño de Funciones

- **Límite máximo: 30 líneas por función**
- Excepciones permitidas solo con justificación documentada en comentario

---

## Dependencias (Opcional)

Solo si es necesario:
- Ninguna librería requerida