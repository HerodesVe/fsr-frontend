# Cambios de Elaboración de Proyecto – Resumen para Backend

Este documento resume los cambios estructurales y de documentos aplicados al flujo de **Elaboración de Proyecto**, relevantes para el backend (nuevos/eliminados documentos, nueva sección, `steps_status`, etc.). No se incluyen cambios de textos ni de etiquetas.

---

## 1. Nueva sección: **Predio**

Se agregó un paso **Predio** después de **Licencias/Normativas** y antes de **Arquitectura**. El orden de pasos queda:

1. Anteproyecto Aprobado  
2. Tipo de Obra / Normativas (Licencias)  
3. **Predio** *(nuevo)*  
4. Arquitectura  
5. Estructuras  
6. Sanitarias  
7. Eléctricas  
8. Sustento Técnico  

### 1.1. `StepStatus` (steps_status)

- Nuevo campo: **`predio`**  
  - Valores: `'Completada' | 'Pendiente' | 'En progreso'`  
  - Opcional (`predio?`) para compatibilidad con proyectos creados antes del cambio.

### 1.2. `ProyectoData` – Nueva clave **`datos_predio`**

- **`datos_predio`** (opcional): objeto con la siguiente estructura:

```
datos_predio: {
  ubicacion: {
    departmentId: string,
    provinceId: string,
    districtId: string,
    urbanization: string,
    mz: string,
    lote: string,
    subLote: string,
    street: string,
    number: string,
    interior: string
  },
  latitud: number,
  longitud: number,
  medidas_perimetricas: {
    area_total_m2: number,
    frente: number,
    derecha: number,
    izquierda: number,
    fondo: number
  },
  edificacion: {
    tipo_edificacion: string,
    numero_pisos: number,
    area_techada_total_m2: number,
    area_libre_m2: number,
    area_libre_porcentaje: number,
    descripcion_proyecto: string
  }
}
```

- En **create/update** del proyecto, el front envía `datos_predio` al completar el paso Predio (igual que con `licencias_normativas` en el paso de Licencias).

---

## 2. **Arquitectura** (`arquitectura_docs`)

### Documentos agregados

| Clave en backend / DocumentKey | Descripción |
|--------------------------------|-------------|
| `fue_presupuesto_obra` | FUE (Formulario Único de Edificación) y Presupuesto de Obra |
| `sustento_tecnico_legal_mvcs` | Sustento Técnico – Legal con Consulta al MVCS |

*(En el front se usan `arq_fue_presupuesto_obra` y `arq_sustento_tecnico_legal_mvcs`; el backend puede mapearlos a `arquitectura_docs.fue_presupuesto_obra` y `arquitectura_docs.sustento_tecnico_legal_mvcs`.)*

### Documentos existentes (sin cambio)

- `plano_ubicacion`, `plano_arquitectura`, `plano_seguridad`  
- `memoria_descriptiva_seguridad`, `memoria_descriptiva_arquitectura`, `memoria_descriptiva_estructura`  
- `otros_archivos` (si se usa en backend)

---

## 3. **Estructuras** (`estructuras_docs`)

### Documentos eliminados

- `plano_ubicacion`  
- `plano_arquitectura`  
- `plano_seguridad`  
- `memoria_descriptiva_seguridad`  
- `memoria_descriptiva_arquitectura`  
- `memoria_descriptiva_estructura`  

### Documentos agregados

| Clave en backend / DocumentKey | Descripción |
|--------------------------------|-------------|
| `planos_estructuras` | Planos de Estructuras |
| `memoria_calculos_estructuras` | Memoria de Cálculos de Estructuras |
| `memoria_especificaciones_tecnicas_estructuras` | Memoria de Especificaciones Técnicas de Estructuras |
| `planos_sostenimiento_excavaciones` | Planos de Sostenimiento de Excavaciones |
| `memoria_descriptiva_sostenimiento_excavaciones` | Memoria Descriptiva de Sostenimiento de Excavaciones |
| `estudio_mecanica_suelos` | Estudio de Mecánicas de Suelos |
| `otros_archivos` | Otros Documentos *(agregado en tipo; en UI ya existía)* |

*(En el front: `est_planos_estructuras`, `est_memoria_calculos_estructuras`, etc.; el backend puede mapearlos a las claves de `estructuras_docs`.)*

---

## 4. **Sanitarias** (`sanitarias_docs`)

### Documentos agregados

| Clave en backend / DocumentKey | Descripción |
|--------------------------------|-------------|
| `memoria_calculos` | Memoria de Cálculos |
| `otros_archivos` | Otros Documentos *(agregado en tipo para responder/guardar; en UI ya existía)* |

*(En el front: `san_memoria_calculos`, `san_otros_archivos`.)*

### Documentos existentes (sin cambio)

- `plano_instalacion_sanitaria`, `memoria_descriptiva`, `especificaciones_tecnicas`, `factibilidad_desague`

---

## 5. **Eléctricas** (`electricas_docs`)

Estructura: `electricas_docs` con sub-objetos `electricas`, `mecanicas`, `gas`, `paneles_solares`, `comunicaciones`.

### 5.1. Sub-especialidad **Eléctricas** (`electricas_docs.electricas`)

#### Documentos agregados

| Clave en backend / DocumentKey | Descripción |
|--------------------------------|-------------|
| `memoria_calculos` | Memoria de Cálculos |
| `otros_archivos` | Otros Documentos *(agregado en tipo; en UI ya existía)* |

*(En el front: `elec_memoria_calculos`, `elec_otros_archivos`.)*

#### Documentos existentes (sin cambio)

- `plano_instalacion_electrica`, `memoria_descriptiva`, `especificaciones_tecnicas`, `factibilidad_energia`

---

### 5.2. Sub-especialidad **Gas** (`electricas_docs.gas`)

#### Documentos agregados

| Clave en backend / DocumentKey | Descripción |
|--------------------------------|-------------|
| `memoria_calculos` | Memoria de Cálculos |
| `otros_archivos` | Otros Documentos *(agregado en tipo; en UI ya existía)* |

*(En el front: `gas_memoria_calculos`, `gas_otros_archivos`.)*

#### Documentos existentes (sin cambio)

- `plano_instalacion_gas`, `memoria_descriptiva`, `especificaciones_tecnicas`, `factibilidad_gas`

---

### 5.3. Mecánicas, Paneles solares, Comunicaciones

- **Mecánicas** (`electricas_docs.mecanicas`): sin cambios de documentos.  
- **Paneles solares** (`electricas_docs.paneles_solares`): sin cambios.  
- **Comunicaciones** (`electricas_docs.comunicaciones`): sin cambios.

---

## 6. Paso **Tipo de Obra / Normativas** (Licencias)

- Se usa un step propio **StepTipoObraProyecto** con los mismos datos que el step de licencias:
  - `tipo_licencia_edificacion`, `tipo_modalidad`, `link_normativas`, `archivo_normativo`  
- Estructura en backend: **`licencias_normativas`** (sin cambios de modelo).  
- No se agregan ni eliminan documentos en esta sección.

---

## 7. Resumen de claves de documento (documentKey) usadas en uploads

El front envía `documentKey` al subir archivos. Ejemplos de posibles mapeos backend:

| documentKey (front) | Sección sugerida en backend |
|---------------------|-----------------------------|
| `arq_fue_presupuesto_obra` | `arquitectura_docs.fue_presupuesto_obra` |
| `arq_sustento_tecnico_legal_mvcs` | `arquitectura_docs.sustento_tecnico_legal_mvcs` |
| `est_planos_estructuras` | `estructuras_docs.planos_estructuras` |
| `est_memoria_calculos_estructuras` | `estructuras_docs.memoria_calculos_estructuras` |
| `est_memoria_especificaciones_tecnicas_estructuras` | `estructuras_docs.memoria_especificaciones_tecnicas_estructuras` |
| `est_planos_sostenimiento_excavaciones` | `estructuras_docs.planos_sostenimiento_excavaciones` |
| `est_memoria_descriptiva_sostenimiento_excavaciones` | `estructuras_docs.memoria_descriptiva_sostenimiento_excavaciones` |
| `est_estudio_mecanica_suelos` | `estructuras_docs.estudio_mecanica_suelos` |
| `est_otros_archivos` | `estructuras_docs.otros_archivos` |
| `san_memoria_calculos` | `sanitarias_docs.memoria_calculos` |
| `san_otros_archivos` | `sanitarias_docs.otros_archivos` |
| `elec_memoria_calculos` | `electricas_docs.electricas.memoria_calculos` |
| `elec_otros_archivos` | `electricas_docs.electricas.otros_archivos` |
| `gas_memoria_calculos` | `electricas_docs.gas.memoria_calculos` |
| `gas_otros_archivos` | `electricas_docs.gas.otros_archivos` |

*(El convenio real puede variar según la implementación del API; esto es una guía de correspondencia.)*

---

## 8. Compatibilidad y migración

- **`steps_status.predio`**: opcional. Proyectos antiguos pueden no tenerlo; el front asume `undefined` como no completado.  
- **`datos_predio`**: opcional en `ProyectoData`. Proyectos creados antes del paso Predio no lo tendrán.  
- **Estructuras**: las claves antiguas (`plano_ubicacion`, `plano_arquitectura`, etc.) dejan de usarse; si el backend las tenía, conviene planear migración o deprecación.  
- **Sanitarias, Eléctricas, Gas**: los nuevos campos (`memoria_calculos`, `otros_archivos` donde aplique) son aditivos; no se eliminan campos existentes.

---

*Documento generado a partir de los cambios realizados en el flujo de Elaboración de Proyecto del frontend.*
