# UI-GUIDE.md - Guía de Diseño UI/UX (Estilo macOS Glassmorphism)

## Objetivo
Establecer estándares de diseño para que la SPA de Finanzas Personales tenga una apariencia profesional con efectos de transparencia al estilo macOS/iOS.

---

## Paleta de Colores

### Colores Principales
| Nombre | Hex | Uso |
|--------|-----|-----|
| Primary | `#2563eb` | Botones principales, headers |
| Primary Dark | `#1d4ed8` | Hover en botones |
| Success | `#16a34a` | Ingresos, estados positivos |
| Danger | `#dc2626` | Gastos, errores |

### Sistema de Transparencias (Glassmorphism)
```css
--glass-bg: rgba(255, 255, 255, 0.7);
--glass-border: rgba(255, 255, 255, 0.3);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
--glass-blur: blur(20px);
--glass-highlight: rgba(255, 255, 255, 0.8);
```

---

## Efecto Glassmorphism (macOS/iOS)

### Fondo Principal
```css
body {
    background: linear-gradient(135deg,
        #e8eef3 0%,
        #d4dce6 50%,
        #c5cdd8 100%);
    /* O con imagen de fondo */
    background: url('gradient-bg.jpg'),
                linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Tarjetas Glass
```css
.glass-card {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);
}
```

### Elementos de Formulario Glass
```css
.glass-input {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 12px;
}

.glass-input:focus {
    background: rgba(255, 255, 255, 0.8);
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}
```

---

## Tipografía

### Familia de Fuentes
```
Font Family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Jerarquía
| Elemento | Tamaño | Peso | Letter Spacing |
|----------|--------|------|----------------|
| H1 | 32px | 700 | -0.5px |
| H2 | 24px | 600 | -0.3px |
| H3 | 18px | 600 | 0 |
| Body | 15px | 400 | 0 |
| Small | 13px | 500 | 0.2px |

---

## Componentes UI (Estilo Glass)

### Cards
- Background: `rgba(255, 255, 255, 0.65)`
- Backdrop blur: `20px`
- Border: `1px solid rgba(255, 255, 255, 0.3)`
- Border radius: `20px`
- Box shadow: `0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)`

### Botones
| Tipo | Background | Estado Hover |
|------|------------|---------------|
| Primary | `rgba(37, 99, 235, 0.9)` + blur | `scale(1.02)`, `box-shadow` |
| Secondary | `rgba(255, 255, 255, 0.5)` | Background más opaco |
| Danger | `rgba(220, 38, 38, 0.9)` + blur | `scale(1.02)` |

### Inputs
- Height: `48px`
- Border radius: `14px`
- Background: `rgba(255, 255, 255, 0.5)`
- Focus: border visible + glow

---

## Animaciones

### Transiciones
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Micro-interacciones
- Hover cards: `translateY(-4px)` + shadow increase
- Click buttons: `scale(0.98)`
- Focus: `box-shadow` expand

### Animaciones de Entrada
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
```

---

## Layout y Espaciado

### Container
- Max width: `640px` (mobile) → `720px` (tablet) → `800px` (desktop)
- Padding: `24px`

### Grid
- Gap: `20px` (mobile) → `24px` (desktop)

---

## Sombras y Profundidad

```css
/* Sutil ( элементы внутри cards) */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);

/* Cards principales */
--shadow-md: 0 8px 32px rgba(0, 0, 0, 0.1);

/* Elevated elements */
--shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.15);

/* Con highlight glass */
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);
```

---

## Colores para Gráficos (Glass)

### Gráfico Pastel (Gastos)
```javascript
const expenseColors = [
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(249, 115, 22, 0.8)',  // Orange
    'rgba(234, 179, 8, 0.8)',   // Yellow
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(6, 182, 212, 0.8)',    // Cyan
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
];
```

### Gráfico Barras (Ingresos vs Gastos)
```javascript
const comparisonColors = [
    'rgba(22, 163, 74, 0.85)',   // Success
    'rgba(220, 38, 38, 0.85)',   // Danger
];
```

---

## Estados Vacíos (Empty States)

```css
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 24px;
    text-align: center;
}

.empty-state__icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.6;
}

.empty-state__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-700);
    margin-bottom: 8px;
}

.empty-state__text {
    font-size: 14px;
    color: var(--gray-500);
}
```

---

## Responsive

### Breakpoints
- Mobile: `< 640px` (1 columna, padding 16px)
- Tablet: `640px - 1024px` (2 columnas)
- Desktop: `> 1024px` (container centrado)

---

## Checklist de Implementación

- [ ] Aplicar background gradient suave
- [ ] Usar glassmorphism en todas las cards
- [ ] Agregar backdrop-filter blur a elementos
- [ ] Implementar border-radius grandes (16-20px)
- [ ] Usar sombras suaves con highlight
- [ ] Animaciones de entrada en elementos
- [ ] Estados hover con translateY
- [ ] Gradientes en botones y elementos importantes
- [ ] Colores con transparencia (rgba) en gráficos
- [ ] Skeleton loaders con shimmer animation
- [ ] Transiciones suaves cubic-bezier

---

## Referencias de Diseño

- **macOS Big Sur**: ventanas translúcidas, blur extremo
- **iOS 15+**: Cards con blur, bordes sutiles
- **Fluent Design (Microsoft)**: Acrílico translúcido
- **Glassmorphism流行的**: Fondos con blur, bordes claros

---

## Ejemplo de Implementación Completa

```css
/* Variables CSS */
:root {
    --glass-bg: rgba(255, 255, 255, 0.65);
    --glass-border: rgba(255, 255, 255, 0.3);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    --radius-lg: 20px;
    --radius-md: 14px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Body */
body {
    background: linear-gradient(135deg, #e8eef3 0%, #d4dce6 100%);
    min-height: 100vh;
}

/* Glass Card */
.card {
    background: var(--glass-bg);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--glass-shadow),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);
    transition: var(--transition);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

/* Glass Input */
.input {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: var(--radius-md);
    transition: var(--transition);
}

.input:focus {
    background: rgba(255, 255, 255, 0.85);
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

/* Botón Primary Glass */
.btn-primary {
    background: linear-gradient(135deg,
        rgba(37, 99, 235, 0.9) 0%,
        rgba(59, 130, 246, 0.9) 100%);
    backdrop-filter: blur(10px);
    border-radius: var(--radius-md);
    color: white;
    font-weight: 600;
    transition: var(--transition);
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}

.btn-primary:active {
    transform: scale(0.98);
}
```

---

## Próximos Pasos

1. Actualizar CSS con variables glass
2. Aplicar backdrop-filter a todas las cards
3. Crear gradientes suaves para background
4. Agregar animaciones de entrada
5. Implementar skeleton loaders con shimmer
6. Mejorar estados empty con glass design
7. Revisar responsive en todos los breakpoints