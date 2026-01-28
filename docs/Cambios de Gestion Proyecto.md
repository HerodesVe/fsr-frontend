# Guía Backend: Cambios en Gestión de Proyecto

> **Alcance:** Este documento aplica únicamente al módulo **Gestión de Proyecto** (`gestion_proyectos`).  
> No debe confundirse con **Gestión de Anteproyecto** (`gestion_anteproyectos`), que tiene su propia guía y lógica (p. ej. 4 revisiones máximas).

---

## 1. Resumen de Cambios

En el paso **Gestión de Especialidades** (`StepGestionEspecialidades`) se implementó:

- **Contador global de 8 revisiones** para todo el proyecto (no 4 como en Anteproyecto).
- **Límites por especialidad** según secuencialidad (Arquitectura 8, Estructuras 7, Eléctricas/Sanitarias 6).
- **Historial de revisiones por especialidad**: cada especialidad tiene un array `revisiones[]` con el flujo completo (notificación, acta, subsanación, reconsideración, apelación).
- **Secuencialidad:** Arquitectura → Estructuras → (Eléctricas y Sanitarias en paralelo).
- **Improcedencia** de especialidad y de proyecto cuando se agotan las revisiones sin conformidad.

---

## 2. Qué Agregar en el Backend

### 2.1 Nuevos campos en `data` (JSONB) de `gestion_proyectos`

En el objeto `data` del modelo `GestionProyecto` (o equivalente), agregar o asegurar:

| Ruta en `data` | Tipo | Descripción |
|----------------|------|-------------|
| `revisiones_globales_usadas` | `int` | Número de revisiones con resultado "no_conforme" consideradas en el contador global (máx. 8). Puede derivarse de las especialidades; si se persiste, debe mantenerse consistente. |
| `estado_proyecto` | `string` | `"en_proceso"` \| `"conforme"` \| `"improcedente"`. `"conforme"` si todas las especialidades están conformes; `"improcedente"` si alguna es improcedente o si `revisiones_globales_usadas >= 8` sin conformidad total. |
| `especialidades.arquitectura` | objeto | Ver 2.2. |
| `especialidades.estructuras` | objeto | Ver 2.2. |
| `especialidades.electricas` | objeto | Ver 2.2. |
| `especialidades.sanitarias` | objeto | Ver 2.2. |

### 2.2 Estructura de cada especialidad en `data.especialidades.{key}`

**Reemplazar** la estructura legacy (solo `revision_count`, `resultado_acta`, `fecha_respuesta`, etc.) por:

```json
{
  "revisiones": [ /* ver 2.3 */ ],
  "revision_actual_index": 0,
  "es_conforme": false,
  "es_improcedente": false,
  "estado": "pendiente" | "en_progreso" | "conforme" | "improcedente",
  "revision_count": 0
}
```

- **`revisiones`:** array de revisiones (ver 2.3). Solo cuentan para el contador global las que tienen `resultado_acta === "no_conforme"`.
- **`revision_actual_index`:** índice en `revisiones` de la revisión en edición. `-1` si no hay revisión activa.
- **`es_conforme`:** `true` cuando alguna revisión tiene `resultado_acta === "conforme"`.
- **`es_improcedente`:** `true` cuando se alcanza el límite de la especialidad o el global (8) con última revisión "no_conforme".
- **`estado`:** `"pendiente"` (bloqueada por secuencialidad), `"en_progreso"`, `"conforme"`, `"improcedente"`.
- **`revision_count`:** puede usarse como legacy; el frontend usa `revisiones.length` y el número de `no_conforme` para límites.

### 2.3 Estructura de una revisión (`RevisionEspecialidadData`)

Cada elemento de `especialidades.{key}.revisiones`:

```json
{
  "id": "rev_1234567890_abc123",
  "numero_revision": 1,
  "numero_revision_global": 1,
  "fecha_creacion": "25/01/2025",
  "notificacion": {
    "tiene_notificacion": false,
    "fecha_notificacion": null,
    "archivo_notificacion": null,
    "documentos_subsanacion_notificacion": null,
    "subsanacion_completada": false
  },
  "fecha_respuesta": null,
  "archivo_acta": null,
  "resultado_acta": null,
  "documentos_subsanacion": null,
  "subsanacion_completada": false,
  "reconsideracion": {
    "habilitado": false,
    "fecha_presentacion": null,
    "documento_recurso": null,
    "resolucion_recurso": null,
    "resultado": null,
    "observaciones": null
  },
  "apelacion": {
    "habilitado": false,
    "fecha_presentacion": null,
    "documento_recurso": null,
    "resolucion_recurso": null,
    "resultado": null,
    "observaciones": null
  },
  "estado": "en_progreso" | "completada" | "improcedente"
}
```

- **`id`:** string único (p. ej. `rev_{timestamp}_{random}`).
- **`numero_revision`:** 1-based dentro de la especialidad.
- **`numero_revision_global`:** 1-based en el contador global (1–8).
- **`fecha_creacion`:** string en formato `DD/MM/YYYY` (o normalizar a ISO en backend).
- **`notificacion`:** Flujo A. Si `tiene_notificacion` es `true`, pueden existir `fecha_notificacion`, archivos y `subsanacion_completada`.
- **`fecha_respuesta`:** requerida para elegir `resultado_acta` (junto con archivo de acta).
- **`resultado_acta`:** `"conforme"` \| `"no_conforme"` \| `null`. Solo **`"no_conforme"`** incrementa el contador global.
- **`reconsideracion.resultado`** / **`apelacion.resultado`:** `"fundado"` \| `"infundado"` \| `"fundado_en_parte"` \| `null`.
- **`estado`:** `"completada"` si `resultado_acta === "conforme"`; `"improcedente"` si se alcanzó límite con "no_conforme"; si no, `"en_progreso"`.

---

## 3. Constantes y Límites (Solo Gestión de Proyecto)

| Constante | Valor | Uso |
|-----------|-------|-----|
| `MAX_REVISIONES_GLOBALES` | `8` | Techo de revisiones "no_conforme" en todo el proyecto. |
| Límite **Arquitectura** | `8` | Puede usar las 8 globales. |
| Límite **Estructuras** | `7` | Global 8 − 1 (mínimo de Arquitectura). |
| Límite **Eléctricas** | `6` | Global 8 − 1 Arq − 1 Est. |
| Límite **Sanitarias** | `6` | Idem. |

Secuencialidad de habilitación:

1. **Arquitectura:** siempre habilitada.
2. **Estructuras:** se habilita cuando **Arquitectura** está `es_conforme`.
3. **Eléctricas** y **Sanitarias:** se habilitan **ambas** cuando **Estructuras** está `es_conforme` (compiten por el mismo pool global de 8).

---

## 4. Qué Eliminar o Deprecar (Legacy)

En `data.especialidades.{key}` se puede **deprecar** o dejar de usar como fuente de verdad:

- `fecha_respuesta` (a nivel de especialidad)
- `archivo_respuesta`
- `resultado_acta` (a nivel de especialidad)
- `documentos_subsanacion` (a nivel de especialidad)
- `fecha_presentacion_reconsideracion`
- `documento_reconsideracion`
- `resolucion_reconsideracion`

Toda esa información pasa a estar **por revisión** dentro de `revisiones[]`. El backend puede seguir leyendo esos campos para migración o compatibilidad, pero no debe basar la lógica nueva en ellos.

---

## 5. Esquemas Pydantic Sugeridos (Gestión de Proyecto)

```python
# enums (específicos de Gestión de Proyecto, no reutilizar de Anteproyecto sin ajustar)
class ResultadoActa(str, Enum):
    CONFORME = "conforme"
    NO_CONFORME = "no_conforme"

class ResultadoRecursoProyecto(str, Enum):
    FUNDADO = "fundado"
    INFUNDADO = "infundado"
    FUNDADO_EN_PARTE = "fundado_en_parte"

class EstadoRevisionProyecto(str, Enum):
    EN_PROGRESO = "en_progreso"
    COMPLETADA = "completada"
    IMPROCEDENTE = "improcedente"

class EstadoEspecialidad(str, Enum):
    PENDIENTE = "pendiente"
    EN_PROGRESO = "en_progreso"
    CONFORME = "conforme"
    IMPROCEDENTE = "improcedente"

class EstadoProyecto(str, Enum):
    EN_PROCESO = "en_proceso"
    CONFORME = "conforme"
    IMPROCEDENTE = "improcedente"

# ---

class NotificacionProyectoSchema(BaseModel):
    tiene_notificacion: bool = False
    fecha_notificacion: Optional[str] = None
    subsanacion_completada: bool = False
    archivo_notificacion_id: Optional[str] = None
    documentos_subsanacion_notificacion_ids: Optional[List[str]] = []

class ProcesoRecursoProyectoSchema(BaseModel):
    habilitado: bool = False
    fecha_presentacion: Optional[str] = None
    resultado: Optional[ResultadoRecursoProyecto] = None
    observaciones: Optional[str] = None
    documento_recurso_id: Optional[str] = None
    resolucion_recurso_id: Optional[str] = None

class RevisionEspecialidadSchema(BaseModel):
    id: str
    numero_revision: int
    numero_revision_global: int
    fecha_creacion: str
    notificacion: Optional[NotificacionProyectoSchema] = None
    fecha_respuesta: Optional[str] = None
    resultado_acta: Optional[ResultadoActa] = None
    archivo_acta_id: Optional[str] = None
    documentos_subsanacion_ids: Optional[List[str]] = []
    subsanacion_completada: bool = False
    reconsideracion: Optional[ProcesoRecursoProyectoSchema] = None
    apelacion: Optional[ProcesoRecursoProyectoSchema] = None
    estado: EstadoRevisionProyecto = EstadoRevisionProyecto.EN_PROGRESO

class EspecialidadDataSchema(BaseModel):
    revisiones: List[RevisionEspecialidadSchema] = []
    revision_actual_index: int = -1
    es_conforme: bool = False
    es_improcedente: bool = False
    estado: EstadoEspecialidad = EstadoEspecialidad.PENDIENTE
    revision_count: int = 0

class GestionEspecialidadesSchema(BaseModel):
    arquitectura: EspecialidadDataSchema
    estructuras: EspecialidadDataSchema
    electricas: EspecialidadDataSchema
    sanitarias: EspecialidadDataSchema

# En data (raíz)
# revisiones_globales_usadas: int
# estado_proyecto: EstadoProyecto
```

---

## 6. Cálculo de `revisiones_globales_usadas` y `estado_proyecto`

- **`revisiones_globales_usadas`:**  
  Suma, sobre las 4 especialidades, de `cantidad de revisiones con resultado_acta === "no_conforme"`. Máximo 8.

- **`estado_proyecto`:**
  - `"conforme"` si las cuatro especialidades tienen `es_conforme === true`.
  - `"improcedente"` si alguna tiene `es_improcedente === true` **o** `revisiones_globales_usadas >= 8` sin que todas estén conformes.
  - En caso contrario: `"en_proceso"`.

---

## 7. Lógica de Negocio: Crear Nueva Revisión

Permitir **crear nueva revisión** en una especialidad solo si:

1. `revisiones_globales_usadas < 8`
2. La especialidad no está `es_conforme` ni `es_improcedente`
3. La especialidad no ha alcanzado su límite:
   - arquitectura: 8
   - estructuras: 7
   - electricas: 6
   - sanitarias: 6
4. Si ya hay revisión actual:
   - `resultado_acta` debe ser `"no_conforme"`
   - Y se cumple una de:
     - `subsanacion_completada === true`, o
     - `reconsideracion.resultado === "fundado"`, o
     - `apelacion.resultado === "fundado"`

Al crear la nueva revisión:

- `numero_revision` = `revisiones.length + 1`
- `numero_revision_global` = `revisiones_globales_usadas + 1`
- `estado` = `"en_progreso"`, `notificacion.tiene_notificacion` = false, `resultado_acta` = null.
- `revision_actual_index` = `revisiones.length` (el nuevo elemento).

---

## 8. Lógica: Improcedencia de Especialidad

Marcar especialidad como **improcedente** cuando:

- La revisión actual tiene `resultado_acta === "no_conforme"` **y**
- Se cumple alguna de:
  - La cantidad de revisiones "no_conforme" en esa especialidad ≥ su límite (8/7/6), o
  - `revisiones_globales_usadas >= 8`

En ese caso: `es_improcedente = true`, `estado = "improcedente"`, y la revisión actual `estado = "improcedente"`.

---

## 9. Mapeo de Documentos (document_key) – Gestión de Proyecto

Los archivos se suben al `gestion_id` de **Gestión de Proyecto**. El frontend envía `documentKey` en el formato siguiente. El backend debe aceptar y almacenar por dicha clave (p. ej. en `uploaded_documents` o en el documento de la revisión).

Prefijo por revisión: `{especialidad}_rev{numero_revision}`  
Especialidades: `arquitectura`, `estructuras`, `electricas`, `sanitarias`.

| document_key (ejemplo) | Descripción |
|------------------------|-------------|
| `arquitectura_rev1_notificacion` | Archivo de notificación/carta (Flujo A) |
| `arquitectura_rev1_subsanacion_notificacion` | Subsanación de la notificación |
| `arquitectura_rev1_acta` | Archivo del acta de respuesta (Flujo B) |
| `arquitectura_rev1_subsanacion` | Subsanación cuando acta es "no_conforme" |
| `reconsideracion_arquitectura_rev1_documento` | Documento del recurso de reconsideración |
| `reconsideracion_arquitectura_rev1_resolucion` | Resolución del recurso de reconsideración |
| `apelacion_arquitectura_rev1_documento` | Documento del recurso de apelación |
| `apelacion_arquitectura_rev1_resolucion` | Resolución del recurso de apelación |

Patrón general:

- `{especialidad}_rev{N}_notificacion`
- `{especialidad}_rev{N}_subsanacion_notificacion`
- `{especialidad}_rev{N}_acta`
- `{especialidad}_rev{N}_subsanacion`
- `reconsideracion_{especialidad}_rev{N}_documento`
- `reconsideracion_{especialidad}_rev{N}_resolucion`
- `apelacion_{especialidad}_rev{N}_documento`
- `apelacion_{especialidad}_rev{N}_resolucion`

El backend debe resolver `{especialidad}` y `N` para asociar el archivo a la revisión correcta dentro de `data.especialidades.{especialidad}.revisiones[N-1]` (o por `numero_revision`).

---

## 10. Endpoints Sugeridos (Solo Gestión de Proyecto)

### 10.1 PATCH `gestion_proyectos/{id}` (paso Gestión de Especialidades)

Actualización parcial de `data`:

- `data.especialidades` (objeto con las 4 especialidades)
- `data.revisiones_globales_usadas`
- `data.estado_proyecto`

Validaciones a aplicar en servidor:

- `revisiones_globales_usadas` ≤ 8 y coherente con el conteo real de "no_conforme".
- Límites por especialidad (8/7/6) y secuencialidad (no marcar conforme Estructuras si Arquitectura no está conforme, etc.), según la lógica descrita arriba.

### 10.2 POST `gestion_proyectos/{id}/upload`

- `file`, `document_key` (multipart).
- `document_key` debe coincidir con los patrones de la sección 9.
- Almacenar en el storage de la **gestión de proyecto** y registrar la referencia (p. ej. `file_id`) en la revisión correspondiente (notificación, acta, subsanación, reconsideración o apelación).

### 10.3 GET `gestion_proyectos/{id}`

Incluir en la respuesta `data`:

- `especialidades` con la estructura de 2.2 y 2.3.
- `revisiones_globales_usadas`
- `estado_proyecto`

---

## 11. Diferencias con Gestión de Anteproyecto (No Confundir)

| Aspecto | Gestión de **Anteproyecto** | Gestión de **Proyecto** |
|---------|-----------------------------|--------------------------|
| Entidad | `gestion_anteproyectos` | `gestion_proyectos` |
| Máx. revisiones | 4 | **8** |
| Unidades | Una sola “secuencia” de revisiones (seguimiento y respuesta) | **4 especialidades** (Arq, Est, Ele, San) con su propio array de revisiones cada una |
| Contador | Por revisión (1–4) | **Contador global 1–8** compartido entre especialidades |
| Límites por “unidad” | N/A | Arq 8, Est 7, Ele 6, San 6 |
| Secuencialidad | N/A | Arq → Est → (Ele y San en paralelo) |
| document_key | `seguimiento_respuesta.revision_{N}.*` | `{especialidad}_rev{N}_*`, `reconsideracion_{esp}_rev{N}_*`, `apelacion_{esp}_rev{N}_*` |

---

## 12. Resumen: Agregar / Editar / Eliminar

### Agregar

- En `data`: `revisiones_globales_usadas`, `estado_proyecto`.
- En `data.especialidades.{key}`: `revisiones[]`, `revision_actual_index`, `es_conforme`, `es_improcedente`, `estado`.
- Estructura completa de cada revisión: `notificacion`, `reconsideracion`, `apelacion`, y campos de acta y subsanación.
- Lógica de límites 8/7/6, secuencialidad e improcedencia.
- Endpoint de upload que acepte los `document_key` de la sección 9.
- Constantes `MAX_REVISIONES_GLOBALES = 8` y límites por especialidad.

### Editar

- Formato de `data.especialidades.{key}`: de un objeto plano (legacy) al nuevo formato con `revisiones` y estados.
- Cálculo de `revisiones_globales_usadas` y `estado_proyecto` en cada PATCH o en un hook post-validación.
- Si se usaba `revision_count` o `resultado_acta` a nivel de especialidad para reglas: pasar a usar `revisiones[]` y los nuevos campos.

### Eliminar / Deprecar

- No usar como fuente de verdad los campos legacy a nivel de especialidad: `fecha_respuesta`, `archivo_respuesta`, `resultado_acta`, `documentos_subsanacion`, `fecha_presentacion_reconsideracion`, `documento_reconsideracion`, `resolucion_reconsideracion`. Mantener solo si se necesita migración o compatibilidad lectora.

---

Esta guía debe usarse **exclusivamente** para el backend de **Gestión de Proyecto**. Para Gestión de Anteproyecto, consultar la documentación correspondiente (`BACKEND_SEGUIMIENTO_RESPUESTA.md`, `Cambios de Gestion Anteproyecto.md`, etc.).
