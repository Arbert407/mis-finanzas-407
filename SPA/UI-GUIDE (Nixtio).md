# UI-GUIDE.md - Guía de Diseño UI/UX

## Objetivo
Establecer estándares de diseño para la SPA de Dashboard de Analítica Inmobiliaria y Financiera con estilo Moderno, de alto contraste y basado en datos (Data-Rich UI).

---

## Paleta de Colores

### Colores Principales
| Nombre | Hex | Uso |
|--------|-----|-----|
| Primary (Development) | #FF5722 | Gradientes de tendencia, botón de acción, estado activo |
| Success (WA) | #00E676 | Indicadores de crecimiento, zonas de éxito en el mapa |
| Danger (OLD) | #FF1744 | Alertas, estados críticos, indicadores de caída |
| Warning (SA) | #FFC107 | Estados intermedios, alertas preventivas |
| Info / Investment | #90A4AE | Elementos secundarios, líneas de tendencia neutral |

### Colores Neutros
| Nombre | Hex | Uso |
|--------|-----|-----|
| Background | #9BA9A9 | Fondo de la aplicación (gris azulado medio) |
| Surface | #FFFFFF | Fondo de cards, contenedores de widgets |
| Text Primary | #000000 | Títulos, valores numéricos destacados ($25.5M) |
| Text Secondary | #546E7A | Subtítulos, etiquetas de ejes |
| Text Muted | #B0BEC5 | Leyendas inactivas, placeholders |
| Border | #ECEFF1 | Divisores, bordes de elementos |

---

## Tipografía

### Familia de Fuentes
Font Family: 'Inter', -apple-system, sans-serif

### Jerarquía
- H1 (Grandes Cifras): 32px | Peso: 700 | Letter Spacing: -0.5px
- H2 (Títulos Cards): 16px | Peso: 600 | Letter Spacing: 0px
- Body: 14px | Peso: 400 | Line Height: 1.5
- Small: 12px | Peso: 500 | Letter Spacing: 0.1px
- Caption: 10px | Peso: 600 | Uppercase

---

## Componentes UI

### Cards
- Background: #FFFFFF
- Border: none
- Border radius: 24px
- Box shadow: none (estilo flat sobre fondo gris)
- Padding: 24px

### Botones (Acciones de Widget)
- Icon Button: Background #F5F7F8 | Color #263238
- Floating Add: Background #FFFFFF | Sombra suave
- Hover State: Opacidad al 90% o oscurecimiento leve del fondo.

---

## Colores para Gráficos

### Paleta de Gráficos (Gradientes)
- Warm (Heatmap): #FFEB3B -> #FF9800 -> #F44336
- Cool (WA data): #00E676 -> #81C784
- Neutral (Investment): #B0BEC5 -> #455A64

### Estilo de Líneas
- Development: Línea naranja sólida (grosor 3px) con sombra de color.
- Investment: Línea gris sólida media (grosor 2px).
- Build and Hold: Línea gris clara (grosor 2px).

---

## Layout y Espaciado

### Grid
- Gap (espacio entre cards): 20px
- Columnas desktop: 2 (layout de 2x2 para los widgets principales)
- Padding general del contenedor: 32px

---

## Estados

### Loading/Skeleton
- Background: linear-gradient(90deg, #F0F2F3 25%, #E0E4E6 50%, #F0F2F3 75%)
- Animación: Shimmer (barrido horizontal) de 1.5s

### Tooltips
- Background: #000000 (Negro puro)
- Text Color: #FFFFFF (Blanco)
- Border Radius: 8px
- Padding: 8px 12px

---

## Checklist de Implementación
1. Configurar variables CSS en el :root con los colores extraídos.
2. Aplicar border-radius de 24px a todos los contenedores principales.
3. Implementar el mapa de Australia con gradientes térmicos (verde a rojo).
4. Configurar el gráfico de flujo (Stream chart) con opacidades para las áreas de datos.
5. Asegurar que las cifras grandes ($M) tengan el peso visual principal.