# UI-GUIDE.md - Guía de Diseño UI/UX

## Objetivo
Establecer estándares de diseño para la SPA de [NOMBRE_DEL_PROYECTO] con estilo [ESTILO_DE_DISEÑO, ej: minimalista, material design, glassmorphism, etc.].

---

## Paleta de Colores

### Colores Principales
| Nombre | Hex | Uso |
|--------|-----|-----|
| Primary | `#[color]` | Botones principales, headers, links |
| Primary Dark | `#[color]` | Hover en elementos primary |
| Secondary | `#[color]` | Elementos secundarios |
| Success | `#[color]` | Estados positivos, confirmaciones |
| Warning | `#[color]` | Advertencias, alertas |
| Danger | `#[color]` | Errores, acciones destructivas |
| Info | `#[color]` | Información, tooltips |

### Colores Neutros
| Nombre | Hex | Uso |
|--------|-----|-----|
| Background | `#[color]` | Fondo principal |
| Surface | `#[color]` | Fondo de cards, modales |
| Text Primary | `#[color]` | Texto principal |
| Text Secondary | `#[color]` | Texto secundario, labels |
| Text Muted | `#[color]` | Placeholders, texto deshabilitado |
| Border | `#[color]` | Bordes, divisores |

### Variables CSS
```css
:root {
    --primary: #[color];
    --primary-dark: #[color];
    --secondary: #[color];
    --success: #[color];
    --warning: #[color];
    --danger: #[color];
    --info: #[color];

    --bg: #[color];
    --surface: #[color];
    --text-primary: #[color];
    --text-secondary: #[color];
    --text-muted: #[color];
    --border: #[color];
}
```

---

## Tipografía

### Familia de Fuentes
```
Font Family: '[fuente_principal]', [fallback_fonts]
```

### Jerarquía
| Elemento | Tamaño | Peso | Letter Spacing | Line Height |
|----------|--------|------|----------------|-------------|
| H1 | [size]px | [weight] | [spacing]px | [height] |
| H2 | [size]px | [weight] | [spacing]px | [height] |
| H3 | [size]px | [weight] | [spacing]px | [height] |
| H4 | [size]px | [weight] | [spacing]px | [height] |
| Body | [size]px | [weight] | [spacing]px | [height] |
| Small | [size]px | [weight] | [spacing]px | [height] |
| Caption | [size]px | [weight] | [spacing]px | [height] |

---

## Componentes UI

### Cards
- Background: `[color/valor]`
- Border: `[valor]`
- Border radius: `[valor]`
- Box shadow: `[valor]`
- Padding: `[valor]`

### Botones
| Tipo | Background | Color Texto | Estado Hover | Estado Active |
|------|------------|-------------|---------------|---------------|
| Primary | `[valor]` | `[color]` | `[efecto]` | `[efecto]` |
| Secondary | `[valor]` | `[color]` | `[efecto]` | `[efecto]` |
| Outline | `[valor]` | `[color]` | `[efecto]` | `[efecto]` |
| Ghost | `[valor]` | `[color]` | `[efecto]` | `[efecto]` |
| Danger | `[valor]` | `[color]` | `[efecto]` | `[efecto]` |

### Inputs
- Height: `[valor]`
- Border radius: `[valor]`
- Background: `[valor]`
- Border: `[valor]`
- Focus: `[efecto/estado]`
- Error: `[efecto/estado]`

### Tablas
- Header background: `[valor]`
- Row hover: `[valor]`
- Border: `[valor]`
- Padding celda: `[valor]`

### Modales/Dialogs
- Overlay: `[valor]`
- Background: `[valor]`
- Border radius: `[valor]`
- Max width: `[valor]`
- Padding: `[valor]`

---

## Animaciones

### Transiciones
```css
--transition-fast: all 0.15s [easing];
--transition-normal: all 0.3s [easing];
--transition-slow: all 0.5s [easing];
```

### Micro-interacciones
- Hover cards: `[efecto]`
- Click buttons: `[efecto]`
- Focus inputs: `[efecto]`
- Loading states: `[efecto]`

### Animaciones de Entrada
```css
@keyframes [nombre] {
    from {
        [propiedad]: [valor];
    }
    to {
        [propiedad]: [valor];
    }
}
```

| Animación | Duración | Easing | Uso |
|-----------|----------|--------|-----|
| fadeIn | [duración]ms | [easing] | Elementos nuevos |
| slideUp | [duración]ms | [easing] | Cards, modales |
| scaleIn | [duración]ms | [easing] | Tooltips, popovers |
| shimmer | [duración]ms | linear | Skeleton loaders |

---

## Layout y Espaciado

### Container
- Max width: `[valor]` (mobile) → `[valor]` (tablet) → `[valor]` (desktop)
- Padding: `[valor]`

### Espaciado (Spacing Scale)
| Nombre | Valor | Uso |
|--------|-------|-----|
| xs | [valor]px | Espaciado mínimo |
| sm | [valor]px | Elementos compactos |
| md | [valor]px | Espaciado estándar |
| lg | [valor]px | Secciones |
| xl | [valor]px | Separación mayor |

### Grid
- Gap: `[valor]` (mobile) → `[valor]` (desktop)
- Columnas mobile: [número]
- Columnas tablet: [número]
- Columnas desktop: [número]

---

## Sombras y Profundidad

```css
--shadow-sm: [valor];
--shadow-md: [valor];
--shadow-lg: [valor];
--shadow-xl: [valor];
```

| Nivel | Uso |
|-------|-----|
| sm | Elementos internos, inputs |
| md | Cards principales |
| lg | Dropdowns, popovers |
| xl | Modales, elementos elevados |

---

## Iconografía

### Librería
- [Nombre de la librería, ej: Heroicons, Lucide, Feather, etc.]
- Versión: [versión]
- CDN/Install: [instrucciones]

### Tamaños
| Tamaño | Valor | Uso |
|--------|-------|-----|
| sm | [valor]px | Inline, botones pequeños |
| md | [valor]px | Botones estándar, listas |
| lg | [valor]px | Headers, empty states |
| xl | [valor]px | Hero sections, ilustraciones |

---

## Colores para Gráficos

### Paleta de Gráficos
```javascript
const chartColors = [
    'rgba([r], [g], [b], [a])',
    'rgba([r], [g], [b], [a])',
    'rgba([r], [g], [b], [a])',
    'rgba([r], [g], [b], [a])',
    'rgba([r], [g], [b], [a])',
    'rgba([r], [g], [b], [a])',
    'rgba([r], [g], [b], [a])',
    'rgba([r], [g], [b], [a])',
];
```

### Colores por Tipo
| Tipo | Color | Uso |
|------|-------|-----|
| Ingresos | `[color]` | Gráficos de ingresos |
| Gastos | `[color]` | Gráficos de gastos |
| Balance | `[color]` | Gráficos de balance |

---

## Estados

### Loading/Skeleton
```css
.skeleton {
    background: linear-gradient(90deg,
        [color_inicio] 25%,
        [color_fin] 50%,
        [color_inicio] 75%);
    background-size: 200% 100%;
    animation: shimmer [duración]s infinite;
}
```

### Empty States
```css
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: [valor]px [valor]px;
    text-align: center;
}

.empty-state__icon {
    font-size: [valor]px;
    margin-bottom: [valor]px;
    opacity: [valor];
}

.empty-state__title {
    font-size: [valor]px;
    font-weight: [valor];
    margin-bottom: [valor]px;
}

.empty-state__text {
    font-size: [valor]px;
    color: [valor];
}
```

### Error States
- Icon: [descripción/icono]
- Title style: [estilo]
- Message style: [estilo]
- Action button: [tipo de botón]

---

## Responsive

### Breakpoints
| Nombre | Valor | Descripción |
|--------|-------|-------------|
| sm | [valor]px | Móviles grandes |
| md | [valor]px | Tablets |
| lg | [valor]px | Desktops pequeños |
| xl | [valor]px | Desktops grandes |

### Comportamiento por Breakpoint
| Elemento | Mobile (<sm) | Tablet (sm-md) | Desktop (>md) |
|----------|--------------|----------------|---------------|
| Columnas | [número] | [número] | [número] |
| Padding | [valor] | [valor] | [valor] |
| Font size | [valor] | [valor] | [valor] |

---

## Accesibilidad

### Contraste
- Mínimo ratio WCAG AA: 4.5:1 (texto normal)
- Mínimo ratio WCAG AA: 3:1 (texto grande)

### Focus Visible
```css
:focus-visible {
    outline: [valor];
    outline-offset: [valor];
}
```

### Estados de Navegación por Teclado
- Focus ring: `[estilo]`
- Skip links: [sí/no]
- ARIA labels: [obligatorios]

---

## Checklist de Implementación

- [ ] Definir paleta de colores completa
- [ ] Configurar variables CSS en :root
- [ ] Definir tipografía y jerarquía
- [ ] Crear componentes base (cards, botones, inputs)
- [ ] Implementar sistema de sombras
- [ ] Configurar animaciones y transiciones
- [ ] Definir spacing scale
- [ ] Implementar responsive breakpoints
- [ ] Crear estados (loading, empty, error)
- [ ] Verificar accesibilidad (contraste, focus)
- [ ] Documentar colores de gráficos
- [ ] Definir iconografía

---

## Referencias de Diseño

- **[Referencia 1]**: [descripción]
- **[Referencia 2]**: [descripción]
- **[Referencia 3]**: [descripción]

---

## Ejemplo de Implementación Completa

```css
/* Variables CSS */
:root {
    /* Colores */
    --primary: #[color];
    --surface: #[color];
    --bg: #[color];

    /* Tipografía */
    --font-family: '[fuente]', [fallbacks];

    /* Espaciado */
    --spacing-sm: [valor]px;
    --spacing-md: [valor]px;
    --spacing-lg: [valor]px;

    /* Border radius */
    --radius-sm: [valor]px;
    --radius-md: [valor]px;
    --radius-lg: [valor]px;

    /* Sombras */
    --shadow-sm: [valor];
    --shadow-md: [valor];
    --shadow-lg: [valor];

    /* Transiciones */
    --transition: all 0.3s [easing];
}

/* Body */
body {
    background: var(--bg);
    font-family: var(--font-family);
    min-height: 100vh;
}

/* Card */
.card {
    background: var(--surface);
    border: [valor];
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: var(--spacing-lg);
    transition: var(--transition);
}

.card:hover {
    transform: translateY(-[valor]px);
    box-shadow: var(--shadow-lg);
}

/* Botón Primary */
.btn-primary {
    background: var(--primary);
    color: white;
    border-radius: var(--radius-md);
    font-weight: 600;
    padding: [valor]px [valor]px;
    transition: var(--transition);
}

.btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-[valor]px);
}

.btn-primary:active {
    transform: scale(0.98);
}

/* Input */
.input {
    background: [valor];
    border: [valor];
    border-radius: var(--radius-md);
    height: [valor]px;
    padding: 0 var(--spacing-md);
    transition: var(--transition);
}

.input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 [valor]px rgba([r], [g], [b], [a]);
}
```

---

## Próximos Pasos

1. [Paso 1 - acción específica]
2. [Paso 2 - acción específica]
3. [Paso 3 - acción específica]
4. [Paso 4 - acción específica]
5. [Paso 5 - acción específica]
