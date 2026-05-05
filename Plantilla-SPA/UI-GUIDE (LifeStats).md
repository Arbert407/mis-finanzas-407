# UI-GUIDE.md - Guía de Diseño UI/UX

## Objetivo
Establecer estándares de diseño para la SPA de Lifestats Dashboard con estilo glassmorphism moderno (dark UI + neon accents).

---

## Paleta de Colores

### Colores Principales
| Nombre | Hex | Uso |
|--------|-----|-----|
| Primary | #4CC9F0 | Gráficos, highlights, acciones principales |
| Primary Dark | #3AA7CC | Hover |
| Secondary | #F5C518 | Progreso, gráficos circulares |
| Success | #22C55E | Estados completados |
| Warning | #EAB308 | Progreso parcial |
| Danger | #EF4444 | Errores |
| Info | #60A5FA | Datos informativos |

### Colores Neutros
| Nombre | Hex | Uso |
|--------|-----|-----|
| Background | #0F172A | Fondo principal oscuro |
| Surface | rgba(255,255,255,0.08) | Cards glass |
| Text Primary | #E5E7EB | Texto principal |
| Text Secondary | #9CA3AF | Labels |
| Text Muted | #6B7280 | Deshabilitado |
| Border | rgba(255,255,255,0.12) | Bordes glass |

### Variables CSS
```css
:root {
    --primary: #4CC9F0;
    --primary-dark: #3AA7CC;
    --secondary: #F5C518;
    --success: #22C55E;
    --warning: #EAB308;
    --danger: #EF4444;
    --info: #60A5FA;

    --bg: #0F172A;
    --surface: rgba(255,255,255,0.08);
    --text-primary: #E5E7EB;
    --text-secondary: #9CA3AF;
    --text-muted: #6B7280;
    --border: rgba(255,255,255,0.12);
}
```

---

## Tipografía

### Familia de Fuentes
Font Family: 'Inter', system-ui, -apple-system, sans-serif

### Jerarquía
| Elemento | Tamaño | Peso | Letter Spacing | Line Height |
|----------|--------|------|----------------|-------------|
| H1 | 32px | 700 | -0.5px | 1.2 |
| H2 | 24px | 600 | -0.3px | 1.3 |
| H3 | 20px | 600 | -0.2px | 1.4 |
| H4 | 16px | 500 | 0px | 1.4 |
| Body | 14px | 400 | 0px | 1.5 |
| Small | 12px | 400 | 0.2px | 1.4 |
| Caption | 11px | 400 | 0.3px | 1.3 |

---

## Componentes UI

### Cards
- Background: rgba(255,255,255,0.08) + backdrop-filter: blur(20px)
- Border: 1px solid rgba(255,255,255,0.12)
- Border radius: 20px
- Box shadow: 0 8px 32px rgba(0,0,0,0.4)
- Padding: 24px

### Botones
| Tipo | Background | Color Texto | Estado Hover | Estado Active |
|------|------------|-------------|---------------|---------------|
| Primary | #4CC9F0 | #0F172A | brillo + elevación | scale 0.97 |
| Secondary | #1F2937 | #E5E7EB | lighten | scale |
| Outline | transparent | #4CC9F0 | bg semi | scale |
| Ghost | transparent | #9CA3AF | bg blur | scale |
| Danger | #EF4444 | white | darken | scale |

### Inputs
- Height: 40px
- Border radius: 12px
- Background: rgba(255,255,255,0.05)
- Border: 1px solid rgba(255,255,255,0.12)
- Focus: 0 0 0 2px rgba(76,201,240,0.4)
- Error: borde rojo

---

## Animaciones

### Transiciones
```css
--transition-fast: all 0.15s ease-out;
--transition-normal: all 0.3s ease;
--transition-slow: all 0.5s ease;
```

### Micro-interacciones
- Hover cards: translateY(-4px) + shadow
- Click buttons: scale(0.97)
- Focus inputs: glow azul
- Loading states: shimmer

---

## Layout y Espaciado

### Container
- Max width: 100% → 768px → 1280px
- Padding: 16px → 24px

### Espaciado
| Nombre | Valor |
|--------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |

---

## Sombras
```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.2);
--shadow-md: 0 8px 24px rgba(0,0,0,0.3);
--shadow-lg: 0 12px 40px rgba(0,0,0,0.4);
--shadow-xl: 0 20px 60px rgba(0,0,0,0.5);
```

---

## Responsive

### Breakpoints
| Nombre | Valor |
|--------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

---

## Accesibilidad
```css
:focus-visible {
    outline: 2px solid #4CC9F0;
    outline-offset: 2px;
}
```

---

## Próximos Pasos
1. Crear layout base
2. Crear componentes reutilizables
3. Integrar gráficos
4. Optimizar dark mode
5. Validar accesibilidad