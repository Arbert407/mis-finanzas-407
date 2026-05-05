# Flujo de Trabajo Iterativo

Este documento explica cómo funcionará la colaboración entre el humano y el agente de IA para desarrollar el proyecto.

---

## Resumen del Flujo

| Responsable | Acción |
|-------------|--------|
| **Humano** | Preparar contexto → Asignar US → Review → Aprobar |
| **Agente IA** | Leer contexto → Implementar → Verificar → Reportar |

---

## Lo que haces tú como humano:

| Paso | Tu Acción |
|------|-----------|
| **1. Preparar** | Rellenas ANALISIS.md con los requisitos del proyecto |
| **2. Asignar US** | Me pasas una Historia de Usuario (por texto o enlace) |
| **3. Reviews** | Revisas lo que entrego y das feedback |
| **4. Aprobar** | Confirmás que los criterios de aceptación se cumplieron |

---

## Lo que yo hago:

| Paso | Mi Acción |
|------|-----------|
| **1. Leer contexto** | Reviso ANALISIS.md, STACK.md, CONTEXT.md, código existente |
| **2. Confirmar comprensión** | Te confirmo lo que entiendo de la US antes de implementar |
| **3. Implementar** | Creo/modifico archivos según los criterios de aceptación |
| **4. Verificar** | Compruebo que funciona (según VERIFICATION.md) |
| **5. Reportar** | Te muestro qué creé y si cumple los criterios |

---

## Ejemplo de Iteración

```
1. Tú: Aquí tienes ANALISIS.md del sistema de finanzas personales
2. Tú: Desarrolla US-001: Registrar gasto con categoría
   
3. Yo: Leo ANALISIS → confirmo comprensión
   Yo: Revisó código existente
   Yo: Implemento: [archivos creados]
   Yo: Verifico que funciona
   
4. Tú: Revisas el resultado
5. Tú: "Cumple los criterios, ✅" o "Falta X"
   
6. (Repetir con siguiente US)
```

---

## Archivos que necesito

| Archivo | Contenido que necesito |
|---------|----------------------|
| **ANALISIS.md** | Lo llena el humano con requisitos del documento de análisis |
| **STACK.md** | Tecnologías del proyecto (ya configurado) |
| **CONTEXT.md** | Arquitectura actual (actualizado por el agente) |
| **US** | La historia de usuario específica a desarrollar |

---

## Estados de la Historia de Usuario

| Estado | Descripción |
|--------|-------------|
| **Pendiente** | US asignada pero no iniciada |
| **En Análisis** | Entendiendo requisitos |
| **En Desarrollo** | Implementando |
| **En Review** | Esperando feedback |
| **Completada** | Aprobada y mergeada |

---

## Integración con Azure DevOps / Jira

El flujo funciona como guía offline:
- Los estados oficiales viven en Azure DevOps / Jira
- Este documento guía el desarrollo
- Al completar, actualizar estado en la herramienta de project management