# ANALISIS.md

## Resumen del Documento de Análisis

Este documento detalla los requerimientos y el diseño técnico para una Single Page Application (SPA) de Finanzas Personales. El sistema permite a los usuarios gestionar sus flujos de efectivo mediante el registro de ingresos y gastos, la categorización de movimientos y la visualización de datos financieros a través de gráficos interactivos, facilitando la toma de decisiones económicas.

---

## Requisitos Funcionales

### RF-001: Gestión de Ingresos y Gastos
**Descripción**: El sistema debe permitir al usuario crear, leer, actualizar y eliminar (CRUD) registros de movimientos financieros (ingresos y egresos).
**Prioridad**: Alta

### RF-002: Categorización de Movimientos
**Descripción**: El usuario podrá asignar una categoría (ej. Alimentación, Salario, Ocio) a cada movimiento para facilitar su agrupación.
**Prioridad**: Media

### RF-003: Visualización de Gráficos Estadísticos
**Descripción**: La aplicación debe presentar un dashboard con gráficos (ej. pastel o barras) que muestren la distribución de gastos por categoría y la relación ingresos vs gastos.
**Prioridad**: Alta

### RF-004: Historial de Transacciones
**Descripción**: Listado cronológico de todos los movimientos realizados, con posibilidad de filtrado por fecha o tipo.
**Prioridad**: Media

---

## Entities del Modelo de Datos

### Usuario (User)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único del usuario |
| email | String | Correo electrónico (único) |
| password | String | Hash de la contraseña |
| nombre | String | Nombre completo del usuario |

### Movimiento (Transaction)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| tipo | Enum | 'Ingreso' o 'Gasto' |
| monto | Decimal | Valor monetario del movimiento |
| fecha | Date | Fecha en que se realizó el movimiento |
| descripcion | String | Nota breve sobre el movimiento |
| categoria_id | UUID | Relación con la entidad Categoría |
| usuario_id | UUID | Relación con el propietario del dato |

### Categoria (Category)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| nombre | String | Nombre de la categoría (ej. Transporte) |
| icono | String | Identificador de icono para la UI |

---

## Reglas de Negocio

### RN-001: Monto Positivo
**Descripción**: El monto de cualquier ingreso o gasto debe ser estrictamente mayor a cero.
**Validación**: El sistema rechazará valores menores o iguales a 0 en el formulario de creación.

---

## Casos de Uso

### UC-001: Registrar nuevo movimiento
**Actor**: Usuario autenticado
**Flujo principal**:
1. El usuario selecciona la opción "Añadir Movimiento".
2. El usuario ingresa el monto, tipo (ingreso/gasto), fecha y selecciona una categoría.
3. El usuario confirma la acción.
4. El sistema valida los datos y guarda el registro.
5. El sistema actualiza el balance general y los gráficos en pantalla.

**Flujo alternativo**: Si el monto es inválido, el sistema muestra un mensaje de error y no permite guardar.

---

## Requisitos No Funcionales

- **Rendimiento**: La SPA debe cargar el dashboard inicial en menos de 2 segundos.

- **Almacenamiento**: La SPA debe almacenar los datos en localstorage, sin embargo debe ser capaz en el futuro de adaptarse a otro tipo de almacenamiento.

---

## Supuestos y Dependencias

- **Supuesto 1**: Se utilizará una librería de terceros (ej. Chart.js o Recharts) para la generación de gráficos.

---