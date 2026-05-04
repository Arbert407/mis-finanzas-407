# MERMAID.md - Diagramas de Relaciones y Workflow

---

## 1. Relación entre Archivos de Plantillas

### Diagrama de Arquitectura de Archivos

```mermaid
flowchart TB
    subgraph PRINCIPAL["Archivos Principales"]
        AG[AGENTS.md]
        WF[WORKFLOW.md]
        CT[CONTEXT.md]
        AN[ANALISIS.md]
    end

    subgraph SOPORTE["Archivos de Soporte"]
        ST[STACK.md]
        VG[VERIFICATION.md]
        UI[UI-GUIDE.md]
        TS[TASKS.md]
    end

    AG --> WF
    AG --> CT
    AG --> AN

    WF --> CT
    WF --> AN

    AN --> ST
    CT --> ST

    VG -.-> WF
    TS -.-> WF
    UI -.-> CT
```

### Diagrama de Dependencias de Lectura

```mermaid
flowchart TD
    INICIO[Lector Agente Inicia Sesión] --> AG
    
    AG{AGENTS.md<br/>Obligatorio} -->|"Lee"| WF[WORKFLOW.md]
    AG -->|"Lee"| AN[ANALISIS.md]
    AG -->|"Lee"| CT[CONTEXT.md]
    
    WF -->|"Referencia"| AN
    WF -->|"Referencia"| ST[STACK.md]
    WF -->|"Referencia"| CT
    WF -->|"Usa para verificación"| VG[VERIFICATION.md]
    
    AN -->|"Usa para implementación"| ST
    AN -->|"Usa para contexto"| CT
    
    CT -->|"Define arquitectura"| ST
    
    VG -->|"Pruebas"| WF
```

### Diagrama de Propósito por Archivo

```mermaid
graph TD
    subgraph AGENTS["AGENTS.md - Definición del Agente"]
        rol["Rol: Especialista SPA Vanilla"]
        espec["Especialización y Limitaciones"]
        convenciones["Convenciones de Código"]
    end
    
    subgraph WORKFLOW["WORKFLOW.md - Proceso de Trabajo"]
        recep["Recepción de US"]
        revision["Revisión Previa"]
        desarrollo["Desarrollo"]
        entregable["Entregable"]
    end
    
    subgraph ANALISIS["ANALISIS.md - Requisitos"]
        rf["Requisitos Funcionales"]
        ent["Entidades"]
        rn["Reglas de Negocio"]
        uc["Casos de Uso"]
    end
    
    subgraph CONTEXT["CONTEXT.md - Contexto"]
        desc["Descripción del Proyecto"]
        estado["Estado del Desarrollo"]
        arquitectura["Arquitectura SPA"]
    end
    
    subgraph STACK["STACK.md - Tecnologías"]
        tecn["Tecnologías"]
        estructura["Estructura del Proyecto"]
        reglas["Reglas de Organización"]
    end
    
    subgraph VERIFICATION["VERIFICATION.md - Verificación"]
        tests["Test Runner Automatizado"]
        checklist["Checklist de Tests"]
        calidad["Criterios de Calidad"]
    end
    
    subgraph TASKS["TASKS.md - Tareas"]
        pendientes["Pendientes"]
        progreso["En Progreso"]
        completadas["Completadas"]
    end
```

---

## 2. Workflow Completo

### Flujo de Desarrollo de Historias de Usuario

```mermaid
flowchart LR
    subgraph INICIO["Inicio"]
        A[Usuario Asigna US] --> B[Ticket con:<br/>Título<br/>Descripción<br/>Criterios Aceptación<br/>Enlace]
    end
    
    subgraph FASE1["Fase 1: Revisión Previa"]
        B --> C{Lee Archivos<br/>de Referencia}
        C -->|OBLIGATORIO| D[WORKFLOW.md]
        C -->|OBLIGATORIO| E[ANALISIS.md]
        C -->|OBLIGATORIO| F[CONTEXT.md]
        C -->|RECOMENDADO| G[STACK.md]
        C -->|RECOMENDADO| H[VERIFICATION.md]
        D --> I[Confirma comprensión<br/>de la US]
        E --> I
        F --> I
    end
    
    subgraph FASE2["Fase 2: Desarrollo"]
        I --> J[Revisa código<br/>existente]
        J --> K[Implementa según<br/>criterios de aceptación]
        K --> L{¿Aplica Tests?}
        L -->|Sí| M[Crear tests]
        L -->|No| N[Sin tests]
        M --> O
        N --> O[Verifica: Lint/Build]
    end
    
    subgraph FASE3["Fase 3: Entregable"]
        O --> P[Archivos<br/>creados/modificados]
        O --> Q[Confirmación de<br/>criterios cumplidos]
        O --> R[Notas de<br/>decisiones de diseño]
        O --> S[Advertencias si<br/>hay bloqueos]
    end
    
    subgraph FIN["Fin"]
        P --> T[Usuario revisa<br/>y aprueba]
        Q --> T
        R --> T
        S --> T
    end
```

### Diagrama de Estados de la US

```mermaid
stateDiagram-v2
    [*] --> Pendiente: US Asignada
    Pendiente --> EnAnalisis: Inicia Revisión
    EnAnalisis --> EnDesarrollo: Confirma Requisitos
    EnDesarrollo --> EnReview: Código Completado
    EnReview --> Completada: Aprobada y Mergeada
    EnReview --> EnDesarrollo: Requiere Cambios
    Completada --> [*]
    EnDesarrollo --> Pendiente: Bloqueada
```

### Workflow de Verificación

```mermaid
flowchart TB
    subgraph TESTING["Proceso de Testing"]
        A[Crear/Actualizar<br/>test-runner.html] --> B[Ejecutar Tests<br/>Automatizados]
        B --> C{Todos Pasan?}
        C -->|Sí| D[Ejecutar Checklist<br/>Manual]
        C -->|No| E[Corregir Errores]
        E --> B
        
        D --> F{Validaciones OK?}
        F -->|Sí| G[Verificar Console<br/>DevTools]
        F -->|No| H[Corregir Issues]
        H --> D
        
        G --> I{Checkpoints OK?}
        I -->|Sí| J[Verificar Performance]
        I -->|No| H
        
        J --> K[✓ Código Listo]
    end
    
    subgraph CHECKLIST["Checklist de Tests"]
        L[Navegación SPA]
        M[UI/UX]
        N[Console]
        O[Calidad]
    end
    
    L -.-> D
    M -.-> D
    N -.-> G
    O -.-> J
```

### Flujo Completo de Sesión de Desarrollo

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as Agente
    participant P as Proyecto

    U->>A: Asigna Historia de Usuario
    Note over A: Lee AGENTS.md obligatoriamente
    A->>A: Lee WORKFLOW.md, ANALISIS.md, CONTEXT.md
    A->>A: Confirma comprensión de US
    
    rect rgb(240, 248, 255)
    Note over A: Fase de Desarrollo
    A->>P: Revisa código existente
    A->>P: Implementa funcionalidad
    A->>P: Crea/actualiza tests si aplica
    A->>P: Verifica con VERIFICATION.md
    end
    
    A->>U: Entrega:<br/>- Archivos modificados<br/>- Criterios cumplidos<br/>- Notas de diseño<br/>- Advertencias si hay bloqueos
    
    U->>A: Revisa y approves
    A->>P: Merge a main
```

---

## 3. Resumen Visual

```mermaid
graph TB
    subgraph GRUPO1["Planeación"]
        A[ANALISIS.md]
        B[CONTEXT.md]
    end
    
    subgraph GRUPO2["Definición"]
        C[AGENTS.md]
        D[STACK.md]
    end
    
    subgraph GRUPO3["Proceso"]
        E[WORKFLOW.md]
        F[TASKS.md]
    end
    
    subgraph GRUPO4["Ejecución"]
        G[Código]
    end
    
    subgraph GRUPO5["Calidad"]
        H[VERIFICATION.md]
        I[UI-GUIDE.md]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    F --> E
    
    E --> G
    G --> H
    G --> I
```

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| → | Flujo principal |
| -.-> | Referencia indirecta |
| { } | Decisión/Condición |
| Rectángulo punteado | Grupo conceptual |

---

*Este documento muestra la estructura y relaciones entre las plantillas del proyecto SPA.*