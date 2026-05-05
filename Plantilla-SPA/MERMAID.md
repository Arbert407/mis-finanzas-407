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

    subgraph TESTING["Testing"]
        TRT[test-runner-template.html]
    end

    AG --> WF
    AG --> CT
    AG --> AN

    WF --> CT
    WF --> AN

    AN --> ST
    CT --> ST

    VG -.-> WF
    VG -.-> TRT
    TS -.-> WF
    UI -.-> CT
```

### Diagrama de Dependencias de Lectura

```mermaid
flowchart TD
    INICIO[Lector / Agente Inicia Sesión] --> AG

    AG{AGENTS.md<br/>Obligatorio} -->|"Lee"| WF[WORKFLOW.md]
    AG -->|"Lee"| AN[ANALISIS.md]
    AG -->|"Lee"| CT[CONTEXT.md]
    AG -->|"Lee"| UI[UI-GUIDE.md]
    AG -->|"Lee"| TS[TASKS.md]

    WF -->|"Referencia"| AN
    WF -->|"Referencia"| ST[STACK.md]
    WF -->|"Referencia"| CT
    WF -->|"Usa para verificación"| VG[VERIFICATION.md]
    WF -->|"Usa para testing"| TRT[test-runner-template.html]

    AN -->|"Usa para implementación"| ST
    AN -->|"Usa para contexto"| CT

    CT -->|"Define arquitectura"| ST

    VG -->|"Genera tests desde"| TRT
    TRT -->|"Instancia"| TR[test-runner.html]

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

    subgraph TESTRUNNER["test-runner-template.html"]
        plantilla["Plantilla Genérica"]
        config["CONFIG personalizable"]
        ejemplos["Ejemplos de Tests"]
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
        C -->|OBLIGATORIO| UI[UI-GUIDE.md]
        C -->|OBLIGATORIO| TS[TASKS.md]
        C -->|RECOMENDADO| G[STACK.md]
        C -->|RECOMENDADO| H[VERIFICATION.md]
        D --> I[Confirma comprensión<br/>de la US]
        E --> I
        F --> I
        UI --> I
        TS --> I
    end

    subgraph FASE2["Fase 2: Desarrollo"]
        I --> J[Revisa código<br/>existente]
        J --> K[Implementa según<br/>criterios de aceptación]
        K --> L{¿Aplica Tests?}
        L -->|Sí| M[Usa test-runner-template.html]
        L -->|No| N[Sin tests]
        M --> O[Personaliza CONFIG<br/>y define tests]
        O --> P[Ejecuta tests<br/>automatizados]
        N --> P[Verifica: Lint/Build]
    end

    subgraph FASE3["Fase 3: Entregable"]
        P --> Q[Archivos<br/>creados/modificados]
        P --> R[Confirmación de<br/>criterios cumplidos]
        P --> S[Notas de<br/>decisiones de diseño]
        P --> T[Advertencias si<br/>hay bloqueos]
    end

    subgraph FIN["Fin"]
        Q --> U[Usuario revisa<br/>y aprueba]
        R --> U
        S --> U
        T --> U
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

### Workflow de Testing con test-runner-template.html

```mermaid
flowchart TB
    subgraph TESTING["Proceso de Testing"]
        A[Copiar<br/>test-runner-template.html] --> B[Renombrar a<br/>test-runner.html]
        B --> C[Personalizar CONFIG]
        C --> D[Definir Tests en<br/>runAllTestsSequence()]
        D --> E[Servir con<br/>HTTP Server]
        E --> F[Abrir test-runner.html<br/>en navegador]
        F --> G[Click en<br/>Ejecutar Todos]
        G --> H{Tests Pasan?}
        H -->|Sí| I[Ejecutar Checklist<br/>Manual]
        H -->|No| J[Revisar logs y<br/>corregir]
        J --> G

        I --> K{Validaciones OK?}
        K -->|Sí| L[Verificar Console<br/>DevTools]
        K -->|No| M[Corregir Issues]
        M --> I

        L --> N{Checkpoints OK?}
        N -->|Sí| O[Verificar Performance]
        N -->|No| M

        O --> P[✓ Código Listo]
    end

    subgraph CONFIG["Configuración del Test Runner"]
        Q[SPA_URL: 'index.html']
        R[IFRAME_SELECTOR: '#app-frame']
        S[BASE_DELAY: 500]
        T[SUBMIT_DELAY: 2000]
    end

    subgraph TIPOS_TEST["Tipos de Tests Soportados"]
        U[Create - Crear elementos]
        V[Update - Editar elementos]
        W[Delete - Eliminar elementos]
        X[Filtros - Aplicar filtros]
        Y[Export - Exportar datos]
    end

    C -.-> Q
    C -.-> R
    C -.-> S
    C -.-> T

    D -.-> U
    D -.-> V
    D -.-> W
    D -.-> X
    D -.-> Y
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
    A->>A: Lee UI-GUIDE.md, TASKS.md
    A->>A: Confirma comprensión de US

    rect rgb(240, 248, 255)
    Note over A: Fase de Desarrollo
    A->>P: Revisa código existente
    A->>P: Implementa funcionalidad
    A->>P: Copia test-runner-template.html
    A->>P: Personaliza CONFIG y define tests
    A->>P: Ejecuta tests automatizados
    A->>P: Verifica con VERIFICATION.md
    end

    A->>U: Entrega:<br/>- Archivos modificados<br/>- Criterios cumplidos<br/>- Notas de diseño<br/>- test-runner.html (si aplica)<br/>- Advertencias si hay bloqueos

    U->>A: Revisa y aprueba
    A->>P: Merge a main
```

---

## 3. Estructura de Archivos de Plantilla

```mermaid
graph TB
    subgraph PLANTILLA_SPA["Plantilla-SPA/"]
        A[AGENTS.md]
        B[WORKFLOW.md]
        C[CONTEXT.md]
        D[ANALISIS.md]
        E[STACK.md]
        F[UI-GUIDE.md]
        G[TASKS.md]
        H[VERIFICATION.md]
        I[MERMAID.md]
        J[test-runner-template.html]
    end

    A -->|"Define rol de"| B
    B -->|"Guía proceso de"| C
    C -->|"Da contexto a"| D
    D -->|"Provee requisitos a"| E
    E -->|"Tecnologías para"| J
    J -->|"Usado por"| H
    F -->|"Estilo para"| H
```

---

## 4. Resumen Visual

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

    subgraph GRUPO6["Testing"]
        J[test-runner-template.html]
    end

    A --> E
    B --> E
    C --> E
    D --> E
    F --> E

    E --> G
    G --> H
    G --> I

    H --> J
```

---

## 5. Testing: De Plantilla a Instancia

```mermaid
flowchart LR
    subgraph PLANTILLA["test-runner-template.html"]
        T1["CONFIG genérico"]
        T2["Funciones auxiliares"]
        T3["Ejemplos de tests"]
        T4["Plantilla base"]
    end

    subgraph PERSONALIZACION["Personalización"]
        P1["Copiar archivo"]
        P2["Renombrar a test-runner.html"]
        P3["Modificar SPA_URL"]
        P4["Ajustar selectors"]
        P5["Definir tests"]
    end

    subgraph INSTANCIA["Instancia (test-runner.html)"]
        I1["CONFIG personalizado"]
        I2["Tests específicos"]
        I3["Listo para ejecutar"]
    end

    T1 --> P1
    T2 --> P1
    T3 --> P4
    T4 --> P1

    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5

    P5 --> I1
    P5 --> I2
    P5 --> I3
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

*Este documento muestra la estructura y relaciones entre las plantillas del proyecto SPA, incluyendo el flujo de testing con test-runner-template.html.*