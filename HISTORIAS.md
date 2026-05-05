# Historias de Usuario - SPA Finanzas

> Formato: "Como [rol], quiero [acción], para [beneficio]"

---

## Tabla de Contenidos

1. [Módulo de Autenticación y Perfil](#1-módulo-de-autenticación-y-perfil)
2. [Módulo de Gestión de Movimientos (CRUD)](#2-módulo-de-gestión-de-movimientos-crud)
3. [Módulo de Categorización](#3-módulo-de-categorización)
4. [Módulo de Visualización y Dashboard](#4-módulo-de-visualización-y-dashboard)
5. [Módulo de Historial y Filtros](#5-módulo-de-historial-y-filtros)
6. [Requisitos Técnicos y de Persistencia](#6-requisitos-técnicos-y-de-persistencia)

---

## 1. Módulo de Autenticación y Perfil

> **Nota:** Aunque el almacenamiento actual es LocalStorage, el modelo de datos requiere la identidad del usuario para futuras migraciones.

### HU-01: Registro de nuevo usuario

**Como** nuevo usuario, **quiero** crear una cuenta con mi nombre, email y contraseña **para** poder empezar a gestionar mis finanzas de forma personalizada.

**Criterios de Aceptación:**

- [ ] El email debe ser único y tener formato válido
- [ ] La contraseña debe estar oculta al escribir
- [ ] Al registrarse, se debe crear un ID único (UUID) para el usuario

---

### HU-02: Inicio de sesión

**Como** usuario registrado, **quiero** iniciar sesión con mis credenciales **para** acceder a mis datos financieros guardados.

**Criterios de Aceptación:**

- [ ] Validar que el email y contraseña coincidan con los datos almacenados
- [ ] Si los datos son incorrectos, mostrar un mensaje de error claro

---

## 2. Módulo de Gestión de Movimientos (CRUD)

> Este módulo cubre el RF-001 y la RN-001.

### HU-03: Creación de un movimiento de Gasto

**Como** usuario, **quiero** registrar un gasto ingresando monto, fecha, descripción y categoría **para** llevar el control de mis salidas de dinero.

**Criterios de Aceptación:**

- [ ] El sistema debe permitir seleccionar el tipo "Gasto"
- [ ] El monto debe ser estrictamente mayor a 0 (RN-001)
- [ ] La fecha debe permitir selección mediante un calendario
- [ ] Se debe poder seleccionar una categoría de una lista predefinida

---

### HU-04: Creación de un movimiento de Ingreso

**Como** usuario, **quiero** registrar un ingreso de dinero **para** conocer mi presupuesto disponible.

**Criterios de Aceptación:**

- [ ] Iguales validaciones que la HU-03, pero bajo el tipo "Ingreso"

---

### HU-05: Edición de movimientos existentes

**Como** usuario, **quiero** poder modificar los detalles de un movimiento ya registrado (monto, fecha o categoría) **para** corregir errores de entrada.

**Criterios de Aceptación:**

- [ ] Al guardar los cambios, el balance general debe actualizarse automáticamente
- [ ] Se deben mantener las validaciones de monto positivo

---

### HU-06: Eliminación de movimientos

**Como** usuario, **quiero** poder borrar un movimiento **para** que no se contabilice en mis estadísticas si fue un error o una cancelación.

**Criterios de Aceptación:**

- [ ] Solicitar confirmación antes de eliminar permanentemente
- [ ] Actualizar gráficos y saldos inmediatamente tras la eliminación

---

## 3. Módulo de Categorización

> Cubre el RF-002.

### HU-07: Visualización de categorías con iconos

**Como** usuario, **quiero** ver una lista de categorías con iconos visuales **para** identificar rápidamente mis transacciones.

**Criterios de Aceptación:**

- [ ] Cada categoría debe mostrar su nombre e icono asociado de la librería de UI

---

## 4. Módulo de Visualización y Dashboard

> Cubre el RF-003 y el requisito de rendimiento.

### HU-08: Visualización de Balance General

**Como** usuario, **quiero** ver el saldo total (Ingresos - Gastos) en la pantalla principal **para** conocer mi situación financiera actual de un vistazo.

**Criterios de Aceptación:**

- [ ] El cálculo debe ser en tiempo real según los datos en LocalStorage

---

### HU-09: Gráfico de distribución de gastos (Pastel)

**Como** usuario, **quiero** ver un gráfico de pastel que desglose mis gastos por categoría **para** identificar en qué área estoy gastando más dinero.

**Criterios de Aceptación:**

- [ ] El gráfico debe mostrar porcentajes o montos totales por categoría
- [ ] Debe ser interactivo (mostrar etiquetas al pasar el mouse/hover)

---

### HU-10: Gráfico comparativo Ingresos vs Gastos (Barras)

**Como** usuario, **quiero** ver una comparación visual entre mis ingresos y gastos totales **para** entender si estoy ahorrando o gastando más de lo que gano.

**Criterios de Aceptación:**

- [ ] Uso de dos barras diferenciadas por colores representativos (ej. Verde para ingresos, Rojo para gastos)

---

## 5. Módulo de Historial y Filtros

> Cubre el RF-004.

### HU-11: Listado cronológico de transacciones

**Como** usuario, **quiero** ver un historial de todas mis transacciones ordenadas de la más reciente a la más antigua **para** revisar mi actividad pasada.

**Criterios de Aceptación:**

- [ ] Cada fila debe mostrar: Fecha, Descripción, Categoría, Tipo (indicado por color o icono) y Monto

---

### HU-12: Filtrado de historial por tipo

**Como** usuario, **quiero** filtrar mi historial para ver solo los "Ingresos" o solo los "Gastos" **para** facilitar la búsqueda de información.

**Criterios de Aceptación:**

- [ ] El filtro debe aplicarse sin recargar la página (comportamiento SPA)

---

## 6. Requisitos Técnicos y de Persistencia

### HU-13: Persistencia en LocalStorage con abstracción

**Como** desarrollador, **quiero** implementar una capa de servicio de datos que use LocalStorage pero que sea independiente, **para** que en el futuro sea fácil cambiar a una API externa.

**Criterios de Aceptación:**

- [ ] Los datos deben persistir después de refrescar el navegador (F5)
- [ ] La lógica de "Storage" debe estar en un módulo separado del resto de la lógica de negocio

---

### HU-14: Optimización de carga inicial

**Como** usuario, **quiero** que la aplicación cargue rápidamente **para** no perder tiempo esperando a que se muestre mi información.

**Criterios de Aceptación:**

- [ ] El Dashboard debe ser funcional en menos de 2 segundos en condiciones normales de hardware

---

## Resumen de HUs

| Módulo | HUs |
|--------|-----|
| Autenticación y Perfil | HU-01, HU-02 |
| Gestión de Movimientos | HU-03, HU-04, HU-05, HU-06 |
| Categorización | HU-07 |
| Visualización y Dashboard | HU-08, HU-09, HU-10 |
| Historial y Filtros | HU-11, HU-12 |
| Requisitos Técnicos | HU-13, HU-14 |

**Total: 14 Historias de Usuario**