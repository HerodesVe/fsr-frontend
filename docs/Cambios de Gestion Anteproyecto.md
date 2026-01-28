# Guía de Configuración del Backend para Gestión de Anteproyectos

## Resumen Ejecutivo

Este documento describe la estructura de datos y endpoints necesarios para el módulo de **Gestión de Anteproyectos**, que incluye:

1. **Selección de Anteproyecto** (buscar existente o cargar anteproyecto externo).
2. **Presentación en Municipalidad**.
3. **Seguimiento y Respuesta** (hasta 4 revisiones con notificación, reconsideración y apelación).
4. **Entrega Final**.

---

## 0. Entidad: Gestión de Anteproyecto vs. Elaboración de Anteproyecto

### Diferencia de entidades

| Aspecto | **Elaboración de Anteproyecto** | **Gestión de Anteproyecto** |
|--------|----------------------------------|-----------------------------|
| Entidad | `anteproyectos` | `gestion_anteproyectos` |
| Propósito | Crear y elaborar un anteproyecto desde cero | Gestionar trámites de un anteproyecto (existente o externo) ante la municipalidad |
| Origen del anteproyecto | Siempre se crea uno nuevo en el sistema | Puede ser **existente** (referencia a `anteproyectos.id`) o **externo** (cargado en la gestión) |

### Anteproyecto cargado como externo

**Importante:** Cuando el usuario elige **“Cargar Anteproyecto Externo”** en el paso de Selección:

- **No** se crea un registro en la entidad **Elaboración de Anteproyecto** (`anteproyectos`).
- **No** se usa `anteproyectos.id` como referencia.
- Los datos (tipo de obra, predio, documentos) **se guardan dentro de la Gestión de Anteproyecto**, en:
  - `data.seleccion_anteproyecto.anteproyecto_externo` (licencias_normativas, datos_predio)
  - `data.seleccion_anteproyecto.anteproyecto_externo_docs` (referencias a archivos)
  - `uploaded_documents` de la **gestión** (`gestion_anteproyectos`), con `key` bajo el prefijo `seleccion_anteproyecto.anteproyecto_externo_docs.*`.

Los documentos se suben al `gestion_id` (Gestión de Anteproyecto), **no** a un `anteproyecto_id`.

---

## 1. Estructura de Datos (Modelos)

### 1.1 Tipos Enumerados

```python
# enums.py

from enum import Enum

class ResultadoActa(str, Enum):
    CONFORME = "conforme"
    NO_CONFORME = "no_conforme"

class ResultadoRecurso(str, Enum):
    FUNDADO = "fundado"
    INFUNDADO = "infundado"
    FUNDADO_EN_PARTE = "fundado_en_parte"

class EstadoRevision(str, Enum):
    EN_PROGRESO = "en_progreso"
    COMPLETADA = "completada"
    IMPROCEDENTE = "improcedente"

class EstadoSeguimiento(str, Enum):
    EN_PROCESO = "en_proceso"
    CONFORME = "conforme"
    IMPROCEDENTE = "improcedente"
```

### 1.2 Esquemas de Datos (Pydantic/Schemas)

```python
# schemas/seguimiento_respuesta.py

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from enum import Enum

# ============================================
# NOTIFICACIÓN (Flujo A)
# ============================================
class NotificacionSchema(BaseModel):
    tiene_notificacion: bool = False
    fecha_notificacion: Optional[date] = None
    subsanacion_completada: Optional[bool] = False
    # Referencias a archivos (IDs en storage)
    archivo_notificacion_id: Optional[str] = None
    documentos_subsanacion_notificacion_ids: Optional[List[str]] = []

# ============================================
# PROCESO DE RECURSO (Reconsideración/Apelación)
# ============================================
class ProcesoRecursoSchema(BaseModel):
    habilitado: bool = False
    fecha_presentacion: Optional[date] = None
    resultado: Optional[ResultadoRecurso] = None
    observaciones: Optional[str] = None
    # Referencias a archivos
    documento_recurso_id: Optional[str] = None
    resolucion_recurso_id: Optional[str] = None

# ============================================
# REVISIÓN INDIVIDUAL
# ============================================
class RevisionSchema(BaseModel):
    id: str
    numero_revision: int = Field(..., ge=1, le=4, description="Número de revisión (1-4)")
    fecha_creacion: date
    
    # Notificación previa (Flujo A)
    notificacion: Optional[NotificacionSchema] = None
    
    # Datos del Acta (Flujo B)
    fecha_respuesta: Optional[date] = None
    resultado_acta: Optional[ResultadoActa] = None
    archivo_acta_id: Optional[str] = None
    
    # Subsanación de observaciones
    documentos_subsanacion_ids: Optional[List[str]] = []
    subsanacion_completada: bool = False
    
    # Proceso de Reconsideración (Flujo C)
    reconsideracion: Optional[ProcesoRecursoSchema] = None
    
    # Proceso de Apelación (Flujo D)
    apelacion: Optional[ProcesoRecursoSchema] = None
    
    # Estado de la revisión
    estado: EstadoRevision = EstadoRevision.EN_PROGRESO

# ============================================
# SEGUIMIENTO Y RESPUESTA COMPLETO
# ============================================
class SeguimientoRespuestaSchema(BaseModel):
    revisiones: List[RevisionSchema] = []
    revision_actual_index: int = 0
    estado_seguimiento: EstadoSeguimiento = EstadoSeguimiento.EN_PROCESO
    
    # Campos legacy para compatibilidad
    fecha_respuesta: Optional[date] = None
    resultado_acta: Optional[ResultadoActa] = None
    fecha_presentacion_reconsideracion: Optional[date] = None
```

### 1.3 Modelo de Base de Datos

```python
# models/gestion_anteproyecto.py

from sqlalchemy import Column, String, Integer, Date, Enum, JSON, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from database import Base

class GestionAnteproyecto(Base):
    __tablename__ = "gestion_anteproyectos"
    
    id = Column(String, primary_key=True)
    instance_code = Column(String, unique=True)
    client_id = Column(String, ForeignKey("clients.id"))
    user_id = Column(String, ForeignKey("users.id"))
    service_id = Column(String)
    status = Column(String, default="pendiente")
    progress_percentage = Column(Integer, default=0)
    
    # Datos del formulario (JSONB para flexibilidad)
    data = Column(JSONB, default={})
    
    # Estado de los pasos
    steps_status = Column(JSONB, default={
        "seleccion_anteproyecto": "Pendiente",
        "presentacion_municipal": "Pendiente",
        "seguimiento_respuesta": "Pendiente",
        "entrega_final": "Pendiente"
    })
    
    created_at = Column(Date)
    scheduled_completion_date = Column(Date, nullable=True)
```

### 1.4 Selección de Anteproyecto: Anteproyecto Externo

Cuando `selected_anteproyecto` es `null` y el usuario carga un anteproyecto externo, los datos se persisten en `data.seleccion_anteproyecto` con la siguiente estructura. **Todo pertenece a la Gestión de Anteproyecto**; no se crea ni se vincula un registro en `anteproyectos`.

#### 1.4.1 Esquema: Licencias / Tipo de Obra

```python
# schemas/seleccion_anteproyecto.py

class LicenciasNormativasExternoSchema(BaseModel):
    tipo_licencia_edificacion: Optional[str] = None   # ampliacion, remodelacion, etc.
    tipo_modalidad: Optional[str] = None             # A, B, C, D
    link_normativas: Optional[str] = None
    # archivo_normativo: se guarda en anteproyecto_externo_docs.archivo_normativo
```

#### 1.4.2 Esquema: Datos del Predio

```python
class UbicacionPredioExternoSchema(BaseModel):
    departmentId: Optional[str] = None
    provinceId: Optional[str] = None
    districtId: Optional[str] = None
    urbanization: Optional[str] = None
    mz: Optional[str] = None
    lote: Optional[str] = None
    subLote: Optional[str] = None
    street: Optional[str] = None
    number: Optional[str] = None
    interior: Optional[str] = None

class MedidasPerimetricasExternoSchema(BaseModel):
    area_total_m2: Optional[float] = None
    frente: Optional[float] = None
    derecha: Optional[float] = None
    izquierda: Optional[float] = None
    fondo: Optional[float] = None

class EdificacionExternoSchema(BaseModel):
    tipo_edificacion: Optional[str] = None
    numero_pisos: Optional[int] = None
    area_techada_total_m2: Optional[float] = None
    area_libre_m2: Optional[float] = None
    area_libre_porcentaje: Optional[float] = None
    descripcion_proyecto: Optional[str] = None

class DatosPredioExternoSchema(BaseModel):
    ubicacion: Optional[UbicacionPredioExternoSchema] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    medidas_perimetricas: Optional[MedidasPerimetricasExternoSchema] = None
    edificacion: Optional[EdificacionExternoSchema] = None
```

#### 1.4.3 Esquema: Documentos del Anteproyecto Externo

Cada documento se almacena como referencia (file_id) en el storage de la **gestión**. Clave: `seleccion_anteproyecto.anteproyecto_externo_docs.{clave}`.

```python
# Claves usadas en anteproyecto_externo_docs (todos bajo la Gestión de Anteproyecto)

class AnteproyectoExternoDocsSchema(BaseModel):
    # Tipo de obra
    archivo_normativo: Optional[DocumentInfo] = None

    # Documentos del administrado
    partida_registral: Optional[DocumentInfo] = None
    certificado_parametro_municipal: Optional[DocumentInfo] = None
    plano_ubicacion: Optional[DocumentInfo] = None
    cabida_arquitectonica: Optional[DocumentInfo] = None
    vigencia_poder: Optional[DocumentInfo] = None
    otros_documentos_administrado: Optional[DocumentInfo] = None

    # Documentos FSR
    memoria_descriptiva_arquitectura: Optional[DocumentInfo] = None
    memoria_descriptiva_seguridad: Optional[DocumentInfo] = None
    formulario_unico_edificacion: Optional[DocumentInfo] = None
    presupuesto: Optional[DocumentInfo] = None
    plano_seguridad: Optional[DocumentInfo] = None
    plano_arquitectura: Optional[DocumentInfo] = None
    pago_derecho_revision_cap: Optional[DocumentInfo] = None
    factura: Optional[DocumentInfo] = None
    liquidacion: Optional[DocumentInfo] = None
    otros_documentos_fsr: Optional[DocumentInfo] = None
```

#### 1.4.4 Estructura `seleccion_anteproyecto` en `data`

```python
class SeleccionAnteproyectoSchema(BaseModel):
    # Si viene de Elaboración de Anteproyecto (existente en el sistema)
    selected_anteproyecto: Optional[dict] = None  # { id, nombre, codigo } o null

    # Solo cuando es ANTEPROYECTO EXTERNO (selected_anteproyecto is None)
    anteproyecto_externo: Optional[dict] = None   # { licencias_normativas, datos_predio }
    anteproyecto_externo_docs: Optional[dict] = None  # DocumentInfo por clave
```

En `data` (JSONB) de `gestion_anteproyectos`:

```json
{
  "seleccion_anteproyecto": {
    "selected_anteproyecto": null,
    "anteproyecto_externo": {
      "licencias_normativas": {
        "tipo_licencia_edificacion": "ampliacion",
        "tipo_modalidad": "B",
        "link_normativas": "https://..."
      },
      "datos_predio": {
        "ubicacion": { "departmentId": "...", "provinceId": "...", ... },
        "latitud": -12.0,
        "longitud": -77.0,
        "medidas_perimetricas": { "area_total_m2": 120, ... },
        "edificacion": { "tipo_edificacion": "Vivienda", ... }
      }
    },
    "anteproyecto_externo_docs": {
      "partida_registral": { "name": "...", "file_reference": "file_xxx", ... },
      "plano_ubicacion": { ... }
    }
  }
}
```

---

## 2. Endpoints API

### 2.1 Estructura de Rutas

```
# Gestión (CRUD general y paso 1: selección)
PATCH /api/v1/gestion-anteproyectos/{gestion_id}
POST  /api/v1/gestion-anteproyectos/{gestion_id}/upload

# Seguimiento y Respuesta
GET   /api/v1/gestion-anteproyectos/{gestion_id}/seguimiento-respuesta
PATCH /api/v1/gestion-anteproyectos/{gestion_id}/seguimiento-respuesta/revision-actual
POST  /api/v1/gestion-anteproyectos/{gestion_id}/seguimiento-respuesta/revisiones
POST  /api/v1/gestion-anteproyectos/{gestion_id}/seguimiento-respuesta/documentos
```

### 2.2 Endpoints Detallados

#### 2.2.0 Paso 1: Selección de Anteproyecto (PATCH de la gestión)

```python
# PATCH /api/v1/gestion-anteproyectos/{gestion_id}

# Body (parcial). Para anteproyecto EXTERNO se envía:
{
  "data": {
    "nombre_proyecto": "string",
    "seleccion_anteproyecto": {
      "selected_anteproyecto": null,
      "anteproyecto_externo": {
        "licencias_normativas": {
          "tipo_licencia_edificacion": "ampliacion",
          "tipo_modalidad": "B",
          "link_normativas": "https://..."
        },
        "datos_predio": {
          "ubicacion": { "departmentId", "provinceId", "districtId", "urbanization", "mz", "lote", "subLote", "street", "number", "interior" },
          "latitud": 0.0,
          "longitud": 0.0,
          "medidas_perimetricas": { "area_total_m2", "frente", "derecha", "izquierda", "fondo" },
          "edificacion": { "tipo_edificacion", "numero_pisos", "area_techada_total_m2", "area_libre_m2", "descripcion_proyecto" }
        }
      }
    }
  }
}
```

- Los **documentos** del anteproyecto externo **no** van en este body. Se suben con `POST /gestion-anteproyectos/{gestion_id}/upload` usando `document_key` con prefijo `seleccion_anteproyecto.anteproyecto_externo_docs.{clave}`.
- Si `selected_anteproyecto` tiene `id`, entonces es anteproyecto existente y normalmente `anteproyecto_externo` y `anteproyecto_externo_docs` serán vacíos o ignorados.

#### 2.2.0b Subida de documentos de la Gestión (incl. Anteproyecto Externo)

```python
# POST /api/v1/gestion-anteproyectos/{gestion_id}/upload
# Content-Type: multipart/form-data
# Parámetros: file, document_key

# document_key para ANTEPROYECTO EXTERNO (gestión de anteproyecto, NO elaboración):
#   seleccion_anteproyecto.anteproyecto_externo_docs.archivo_normativo
#   seleccion_anteproyecto.anteproyecto_externo_docs.partida_registral
#   seleccion_anteproyecto.anteproyecto_externo_docs.certificado_parametro_municipal
#   seleccion_anteproyecto.anteproyecto_externo_docs.plano_ubicacion
#   seleccion_anteproyecto.anteproyecto_externo_docs.cabida_arquitectonica
#   seleccion_anteproyecto.anteproyecto_externo_docs.vigencia_poder
#   seleccion_anteproyecto.anteproyecto_externo_docs.otros_documentos_administrado
#   seleccion_anteproyecto.anteproyecto_externo_docs.memoria_descriptiva_arquitectura
#   seleccion_anteproyecto.anteproyecto_externo_docs.memoria_descriptiva_seguridad
#   seleccion_anteproyecto.anteproyecto_externo_docs.formulario_unico_edificacion
#   seleccion_anteproyecto.anteproyecto_externo_docs.presupuesto
#   seleccion_anteproyecto.anteproyecto_externo_docs.plano_seguridad
#   seleccion_anteproyecto.anteproyecto_externo_docs.plano_arquitectura
#   seleccion_anteproyecto.anteproyecto_externo_docs.pago_derecho_revision_cap
#   seleccion_anteproyecto.anteproyecto_externo_docs.factura
#   seleccion_anteproyecto.anteproyecto_externo_docs.liquidacion
#   seleccion_anteproyecto.anteproyecto_externo_docs.otros_documentos_fsr
```

- El `gestion_id` es siempre el de **Gestión de Anteproyecto**. No se usa `anteproyecto_id` para el anteproyecto externo.

---

#### 2.2.1 Obtener Estado del Seguimiento

```python
# GET /api/v1/gestion-anteproyectos/{gestion_id}/seguimiento-respuesta

@router.get("/{gestion_id}/seguimiento-respuesta")
async def get_seguimiento_respuesta(
    gestion_id: str,
    current_user: User = Depends(get_current_user)
) -> SeguimientoRespuestaResponse:
    """
    Obtiene el estado actual del seguimiento y respuesta.
    
    Returns:
        - revisiones: Lista de todas las revisiones
        - revision_actual_index: Índice de la revisión activa
        - estado_seguimiento: Estado general (en_proceso, conforme, improcedente)
        - puede_crear_nueva_revision: Boolean indicando si se puede crear otra revisión
    """
    pass
```

**Response Schema:**

```json
{
  "revisiones": [
    {
      "id": "revision_1",
      "numero_revision": 1,
      "fecha_creacion": "2024-01-15",
      "notificacion": {
        "tiene_notificacion": true,
        "fecha_notificacion": "2024-01-20",
        "subsanacion_completada": true,
        "archivo_notificacion_id": "file_123",
        "documentos_subsanacion_notificacion_ids": ["file_124"]
      },
      "fecha_respuesta": "2024-01-25",
      "resultado_acta": "no_conforme",
      "archivo_acta_id": "file_125",
      "documentos_subsanacion_ids": ["file_126", "file_127"],
      "subsanacion_completada": true,
      "reconsideracion": {
        "habilitado": true,
        "fecha_presentacion": "2024-01-28",
        "resultado": "infundado",
        "documento_recurso_id": "file_128",
        "resolucion_recurso_id": "file_129"
      },
      "apelacion": {
        "habilitado": false
      },
      "estado": "completada"
    }
  ],
  "revision_actual_index": 0,
  "estado_seguimiento": "en_proceso",
  "puede_crear_nueva_revision": true,
  "max_revisiones": 4
}
```

---

#### 2.2.2 Actualizar Revisión Actual

```python
# PATCH /api/v1/gestion-anteproyectos/{gestion_id}/seguimiento-respuesta/revision-actual

@router.patch("/{gestion_id}/seguimiento-respuesta/revision-actual")
async def update_revision_actual(
    gestion_id: str,
    revision_data: RevisionUpdateSchema,
    current_user: User = Depends(get_current_user)
) -> RevisionSchema:
    """
    Actualiza la revisión actual (parcialmente).
    
    Validaciones:
        - No se puede modificar una revisión con estado "completada" o "improcedente"
        - Para seleccionar resultado_acta, debe existir fecha_respuesta y archivo_acta
        - Si resultado_acta = "conforme", el estado_seguimiento pasa a "conforme"
        - Si es la 4ta revisión y resultado_acta = "no_conforme", estado = "improcedente"
    """
    pass
```

**Request Schema:**

```json
{
  "fecha_respuesta": "2024-01-25",
  "resultado_acta": "no_conforme",
  "notificacion": {
    "tiene_notificacion": true,
    "fecha_notificacion": "2024-01-20"
  },
  "reconsideracion": {
    "habilitado": true,
    "fecha_presentacion": "2024-01-28",
    "resultado": "infundado"
  },
  "subsanacion_completada": true
}
```

---

#### 2.2.3 Crear Nueva Revisión

```python
# POST /api/v1/gestion-anteproyectos/{gestion_id}/seguimiento-respuesta/revisiones

@router.post("/{gestion_id}/seguimiento-respuesta/revisiones")
async def crear_nueva_revision(
    gestion_id: str,
    current_user: User = Depends(get_current_user)
) -> RevisionSchema:
    """
    Crea una nueva revisión (máximo 4).
    
    Validaciones:
        - La revisión anterior debe tener resultado_acta = "no_conforme"
        - La revisión anterior debe tener subsanacion_completada = true
          O reconsideracion.resultado = "fundado"
          O apelacion.resultado = "fundado"
        - No se pueden crear más de 4 revisiones
        - El estado_seguimiento debe ser "en_proceso"
    
    Acciones:
        - Marca la revisión anterior como "completada"
        - Crea nueva revisión con numero_revision incrementado
        - Actualiza revision_actual_index
    """
    pass
```

**Response:**

```json
{
  "id": "revision_2",
  "numero_revision": 2,
  "fecha_creacion": "2024-02-01",
  "notificacion": {
    "tiene_notificacion": false
  },
  "resultado_acta": null,
  "estado": "en_progreso"
}
```

---

#### 2.2.4 Subir Documentos de Revisión

```python
# POST /api/v1/gestion-anteproyectos/{gestion_id}/seguimiento-respuesta/documentos

@router.post("/{gestion_id}/seguimiento-respuesta/documentos")
async def upload_documento_revision(
    gestion_id: str,
    revision_index: int = Query(..., description="Índice de la revisión"),
    document_type: str = Query(..., description="Tipo de documento"),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> DocumentUploadResponse:
    """
    Sube un documento asociado a una revisión.
    
    document_type puede ser:
        - "archivo_acta"
        - "notificacion.archivo_notificacion"
        - "notificacion.documentos_subsanacion"
        - "documentos_subsanacion"
        - "reconsideracion.documento_recurso"
        - "reconsideracion.resolucion_recurso"
        - "apelacion.documento_recurso"
        - "apelacion.resolucion_recurso"
    """
    pass
```

---

## 3. Lógica de Negocio

### 3.1 Reglas de Validación

```python
# services/seguimiento_respuesta_service.py

class SeguimientoRespuestaService:
    MAX_REVISIONES = 4
    
    def validar_puede_seleccionar_resultado(
        self,
        revision: RevisionSchema
    ) -> tuple[bool, str]:
        """
        Valida si se puede seleccionar el resultado del acta.
        
        Returns:
            (puede_seleccionar, mensaje_error)
        """
        if not revision.fecha_respuesta:
            return False, "Debe ingresar la fecha de respuesta"
        
        if not revision.archivo_acta_id:
            return False, "Debe cargar el archivo del acta"
        
        return True, ""
    
    def validar_puede_crear_nueva_revision(
        self,
        seguimiento: SeguimientoRespuestaSchema
    ) -> tuple[bool, str]:
        """
        Valida si se puede crear una nueva revisión.
        """
        if seguimiento.estado_seguimiento != EstadoSeguimiento.EN_PROCESO:
            return False, "El proceso ya finalizó"
        
        if len(seguimiento.revisiones) >= self.MAX_REVISIONES:
            return False, "Se alcanzó el máximo de revisiones permitidas"
        
        ultima_revision = seguimiento.revisiones[-1] if seguimiento.revisiones else None
        
        if not ultima_revision:
            return True, ""
        
        if ultima_revision.resultado_acta != ResultadoActa.NO_CONFORME:
            return False, "La revisión anterior no fue marcada como No Conforme"
        
        # Verificar si se completó subsanación o recurso fue fundado
        recurso_fundado = (
            (ultima_revision.reconsideracion and
             ultima_revision.reconsideracion.resultado == ResultadoRecurso.FUNDADO) or
            (ultima_revision.apelacion and
             ultima_revision.apelacion.resultado == ResultadoRecurso.FUNDADO)
        )
        
        if recurso_fundado:
            return True, ""
        
        if not ultima_revision.subsanacion_completada:
            return False, "Debe completar la subsanación antes de crear nueva revisión"
        
        return True, ""
    
    def calcular_estado_seguimiento(
        self,
        revisiones: List[RevisionSchema]
    ) -> EstadoSeguimiento:
        """
        Calcula el estado general del seguimiento basado en las revisiones.
        """
        # Si alguna revisión es conforme, el proceso terminó exitosamente
        if any(r.resultado_acta == ResultadoActa.CONFORME for r in revisiones):
            return EstadoSeguimiento.CONFORME
        
        # Si hay 4 revisiones y la última es no conforme, es improcedente
        if (len(revisiones) >= self.MAX_REVISIONES and
            revisiones[-1].resultado_acta == ResultadoActa.NO_CONFORME):
            return EstadoSeguimiento.IMPROCEDENTE
        
        return EstadoSeguimiento.EN_PROCESO
    
    def requiere_subsanacion(self, revision: RevisionSchema) -> bool:
        """
        Determina si la revisión requiere subsanación obligatoria.
        """
        if revision.resultado_acta != ResultadoActa.NO_CONFORME:
            return False
        
        # Si el recurso fue fundado, no requiere subsanación
        if (revision.reconsideracion and
            revision.reconsideracion.resultado == ResultadoRecurso.FUNDADO):
            return False
        
        if (revision.apelacion and
            revision.apelacion.resultado == ResultadoRecurso.FUNDADO):
            return False
        
        return True
```

### 3.2 Flujo de Estados

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE SEGUIMIENTO Y RESPUESTA                  │
└─────────────────────────────────────────────────────────────────────┘

                         ┌──────────────────┐
                         │  NUEVA REVISIÓN  │
                         │   (1, 2, 3 o 4)  │
                         └────────┬─────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │  ¿Tiene Notificación?     │
                    │     (Flujo A)             │
                    └─────────────┬─────────────┘
                                  │
                         ┌────────▼────────┐
                         │  Sí             │ No
                         │  ▼              │  │
              ┌──────────────────────┐     │  │
              │ - Fecha Notificación │     │  │
              │ - Archivo            │     │  │
              │ - Subsanación        │     │  │
              └──────────┬───────────┘     │  │
                         │                 │  │
                         └────────┬────────┘  │
                                  │◄──────────┘
                    ┌─────────────▼─────────────┐
                    │   EVALUACIÓN DEL ACTA     │
                    │       (Flujo B)           │
                    │  - Fecha Respuesta *      │
                    │  - Archivo Acta *         │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │    RESULTADO DEL ACTA     │
                    └──────┬──────────────┬─────┘
                           │              │
              ┌────────────▼────┐   ┌─────▼────────────┐
              │    CONFORME     │   │   NO CONFORME    │
              └────────┬────────┘   └─────┬────────────┘
                       │                  │
                       ▼                  ▼
              ┌────────────────┐   ┌──────────────────────┐
              │ estado_seguim. │   │ Revisión N utilizada │
              │ = "conforme"   │   │    (N de 4)          │
              │                │   └──────────┬───────────┘
              │ FIN EXITOSO    │              │
              └────────────────┘   ┌──────────▼───────────┐
                                   │  RECONSIDERACIÓN     │
                                   │    (Flujo C)         │
                                   │  [Opcional]          │
                                   └──────────┬───────────┘
                                              │
                                   ┌──────────▼───────────┐
                                   │     APELACIÓN        │
                                   │    (Flujo D)         │
                                   │  [Opcional]         │
                                   └──────────┬───────────┘
                                              │
                         ┌────────────────────┼────────────────────┐
                         │                    │                    │
              ┌──────────▼──────┐  ┌──────────▼──────┐  ┌──────────▼──────┐
              │    FUNDADO      │  │   INFUNDADO     │  │ FUNDADO EN PARTE│
              └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
                       │                    │                    │
                       │           ┌────────▼────────────────────▼────────┐
                       │           │      SUBSANACIÓN OBLIGATORIA         │
                       │           │  - Documentos de subsanación *        │
                       │           │  - Marcar como completada            │
                       │           └────────────────┬─────────────────────┘
                       │                            │
                       └────────────┬───────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │  ¿Puede crear nueva    │
                       │     revisión?          │
                       └────────────┬────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
           ┌────────▼────┐  ┌───────▼───────┐  ┌───▼───────────────┐
           │ Sí (N < 4)  │  │ No (N = 4)    │  │ No (sin subsanar) │
           │             │  │               │  │                   │
           │ Crear Rev.  │  │ IMPROCEDENTE  │  │ Completar         │
           │   N + 1     │  │               │  │ subsanación       │
           └─────────────┘  └───────────────┘  └───────────────────┘
```

---

## 4. Ejemplo de Implementación del Endpoint Principal

```python
# routers/seguimiento_respuesta.py

from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from services.seguimiento_respuesta_service import SeguimientoRespuestaService

router = APIRouter(prefix="/gestion-anteproyectos", tags=["Seguimiento Respuesta"])
service = SeguimientoRespuestaService()

@router.patch("/{gestion_id}/seguimiento-respuesta/revision-actual")
async def update_revision_actual(
    gestion_id: str,
    update_data: RevisionUpdateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Obtener la gestión
    gestion = db.query(GestionAnteproyecto).filter(
        GestionAnteproyecto.id == gestion_id
    ).first()
    
    if not gestion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gestión de anteproyecto no encontrada"
        )
    
    # 2. Obtener datos actuales de seguimiento
    seguimiento_data = gestion.data.get("seguimiento_respuesta", {})
    revisiones = seguimiento_data.get("revisiones", [])
    revision_index = seguimiento_data.get("revision_actual_index", 0)
    
    # 3. Validar que la revisión actual existe
    if not revisiones or revision_index >= len(revisiones):
        # Crear primera revisión si no existe
        nueva_revision = {
            "id": f"revision_{gestion_id}_1",
            "numero_revision": 1,
            "fecha_creacion": date.today().isoformat(),
            "estado": "en_progreso",
            "notificacion": {"tiene_notificacion": False},
            "reconsideracion": {"habilitado": False},
            "apelacion": {"habilitado": False}
        }
        revisiones.append(nueva_revision)
        revision_index = 0
    
    revision_actual = revisiones[revision_index]
    
    # 4. Validar que la revisión no esté completada
    if revision_actual.get("estado") in ["completada", "improcedente"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede modificar una revisión completada"
        )
    
    # 5. Validar si intenta seleccionar resultado
    if update_data.resultado_acta is not None:
        puede, mensaje = service.validar_puede_seleccionar_resultado(
            RevisionSchema(**revision_actual)
        )
        if not puede:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=mensaje
            )
    
    # 6. Aplicar actualizaciones
    update_dict = update_data.dict(exclude_unset=True)
    
    for key, value in update_dict.items():
        if isinstance(value, dict) and key in revision_actual:
            # Merge para objetos anidados (notificacion, reconsideracion, apelacion)
            revision_actual[key] = {**revision_actual.get(key, {}), **value}
        else:
            revision_actual[key] = value
    
    # 7. Calcular estado del seguimiento
    revisiones[revision_index] = revision_actual
    estado_seguimiento = service.calcular_estado_seguimiento(
        [RevisionSchema(**r) for r in revisiones]
    )
    
    # 8. Actualizar en base de datos
    gestion.data["seguimiento_respuesta"] = {
        "revisiones": revisiones,
        "revision_actual_index": revision_index,
        "estado_seguimiento": estado_seguimiento.value,
        # Campos legacy
        "fecha_respuesta": revision_actual.get("fecha_respuesta"),
        "resultado_acta": revision_actual.get("resultado_acta")
    }
    
    # 9. Actualizar estado del paso
    if estado_seguimiento == EstadoSeguimiento.CONFORME:
        gestion.steps_status["seguimiento_respuesta"] = "Completada"
    elif estado_seguimiento == EstadoSeguimiento.IMPROCEDENTE:
        gestion.steps_status["seguimiento_respuesta"] = "Completada"
        gestion.status = "improcedente"
    else:
        gestion.steps_status["seguimiento_respuesta"] = "En progreso"
    
    db.commit()
    db.refresh(gestion)
    
    return {
        "revision": revision_actual,
        "estado_seguimiento": estado_seguimiento.value,
        "puede_crear_nueva_revision": service.validar_puede_crear_nueva_revision(
            SeguimientoRespuestaSchema(**gestion.data["seguimiento_respuesta"])
        )[0]
    }
```

---

## 5. Mapeo Frontend ↔ Backend

### 5.1 Claves de Documentos

#### Seguimiento y Respuesta (revisiones)

| Frontend (documentKey) | Backend (document_type / almacenamiento) |
|------------------------|------------------------------------------|
| `seguimiento_respuesta.revision_{N}.archivo_acta` | `archivo_acta` |
| `seguimiento_respuesta.revision_{N}.notificacion.archivo_notificacion` | `notificacion.archivo_notificacion` |
| `seguimiento_respuesta.revision_{N}.notificacion.documentos_subsanacion` | `notificacion.documentos_subsanacion` |
| `seguimiento_respuesta.revision_{N}.documentos_subsanacion` | `documentos_subsanacion` |
| `seguimiento_respuesta.revision_{N}.reconsideracion.documento_recurso` | `reconsideracion.documento_recurso` |
| `seguimiento_respuesta.revision_{N}.reconsideracion.resolucion_recurso` | `reconsideracion.resolucion_recurso` |
| `seguimiento_respuesta.revision_{N}.apelacion.documento_recurso` | `apelacion.documento_recurso` |
| `seguimiento_respuesta.revision_{N}.apelacion.resolucion_recurso` | `apelacion.resolucion_recurso` |

#### Anteproyecto Externo (Selección – Gestión de Anteproyecto)

**Entidad:** `gestion_anteproyectos`. **No** se usa la entidad `anteproyectos`. Los archivos se asocian a `gestion_id` con `document_key`:

| Frontend (documentKey) | Backend: clave en `anteproyecto_externo_docs` / `uploaded_documents.key` |
|------------------------|--------------------------------------------------------------------------|
| `seleccion_anteproyecto.anteproyecto_externo_docs.archivo_normativo` | `archivo_normativo` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.partida_registral` | `partida_registral` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.certificado_parametro_municipal` | `certificado_parametro_municipal` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.plano_ubicacion` | `plano_ubicacion` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.cabida_arquitectonica` | `cabida_arquitectonica` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.vigencia_poder` | `vigencia_poder` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.otros_documentos_administrado` | `otros_documentos_administrado` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.memoria_descriptiva_arquitectura` | `memoria_descriptiva_arquitectura` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.memoria_descriptiva_seguridad` | `memoria_descriptiva_seguridad` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.formulario_unico_edificacion` | `formulario_unico_edificacion` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.presupuesto` | `presupuesto` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.plano_seguridad` | `plano_seguridad` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.plano_arquitectura` | `plano_arquitectura` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.pago_derecho_revision_cap` | `pago_derecho_revision_cap` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.factura` | `factura` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.liquidacion` | `liquidacion` |
| `seleccion_anteproyecto.anteproyecto_externo_docs.otros_documentos_fsr` | `otros_documentos_fsr` |

### 5.2 Anteproyecto Externo en PATCH (Paso 1)

En `PATCH /gestion-anteproyectos/{id}` con `data.seleccion_anteproyecto`, el backend debe aceptar y persistir:

- `selected_anteproyecto`: `{ id, nombre, codigo }` o `null`.
- `anteproyecto_externo`: solo cuando es externo (`selected_anteproyecto` es `null`):
  - `licencias_normativas`: `{ tipo_licencia_edificacion, tipo_modalidad, link_normativas }`
  - `datos_predio`: `{ ubicacion, latitud, longitud, medidas_perimetricas, edificacion }` según los esquemas de 1.4.2.
- `anteproyecto_externo_docs`: se actualiza con las referencias de archivos al subir documentos vía `POST /upload`; no es obligatorio enviar este objeto en el PATCH.

### 5.3 Campos Legacy (Compatibilidad) – Seguimiento y Respuesta

Para mantener compatibilidad con el código existente, el backend debe:

1. **Al leer**: Si no existen `revisiones`, crear una revisión inicial con los datos legacy
2. **Al escribir**: Actualizar tanto `revisiones` como los campos legacy (`fecha_respuesta`, `resultado_acta`, etc.)

---

## 6. Resumen de Validaciones por Endpoint

| Endpoint | Validaciones |
|----------|--------------|
| `PATCH /gestion-anteproyectos/{id}` (paso 1) | - `client_id` y `nombre_proyecto` presentes<br>- `selected_anteproyecto` O `anteproyecto_externo` (+ docs vía upload): al menos uno debe estar definido para considerar el paso completable |
| `POST /gestion-anteproyectos/{id}/upload` | - `document_key` con prefijo admitido (p. ej. `seleccion_anteproyecto.anteproyecto_externo_docs.*`, `presentacion_municipal.*`, `seguimiento_respuesta.*`, `entrega_final.*`)<br>- Archivo válido (PDF, JPG, PNG, etc. según tipo) |
| `PATCH /revision-actual` | - Revisión no completada<br>- Fecha y archivo requeridos para resultado<br>- Resultado válido (conforme/no_conforme) |
| `POST /revisiones` | - Máximo 4 revisiones<br>- Revisión anterior = no_conforme<br>- Subsanación completada o recurso fundado<br>- Estado = en_proceso |
| `POST /seguimiento-respuesta/documentos` | - Revisión existe<br>- Tipo de documento válido<br>- Archivo válido (PDF, JPG, PNG) |

---

## 7. Códigos de Error Sugeridos

```python
class SeguimientoErrorCodes:
    REVISION_COMPLETADA = "REVISION_COMPLETADA"  # 400
    FALTA_FECHA_RESPUESTA = "FALTA_FECHA_RESPUESTA"  # 400
    FALTA_ARCHIVO_ACTA = "FALTA_ARCHIVO_ACTA"  # 400
    MAX_REVISIONES_ALCANZADO = "MAX_REVISIONES_ALCANZADO"  # 400
    SUBSANACION_PENDIENTE = "SUBSANACION_PENDIENTE"  # 400
    PROCESO_FINALIZADO = "PROCESO_FINALIZADO"  # 400
    REVISION_NO_ENCONTRADA = "REVISION_NO_ENCONTRADA"  # 404

# Paso 1: Selección de Anteproyecto
class SeleccionAnteproyectoErrorCodes:
    FALTA_ANTEPROYECTO = "FALTA_ANTEPROYECTO"  # 400: ni selected_anteproyecto ni anteproyecto_externo con docs
    DOCUMENT_KEY_INVALIDO = "DOCUMENT_KEY_INVALIDO"  # 400: document_key no admitido en upload
```

---

## 8. Resumen

Esta guía cubre el backend de **Gestión de Anteproyectos**:

- **Anteproyecto externo:** Los datos y documentos se almacenan en la **Gestión de Anteproyecto** (`gestion_anteproyectos`). No se crea ni se vincula un registro en **Elaboración de Anteproyecto** (`anteproyectos`). La subida de archivos usa `gestion_id` y `document_key` con prefijo `seleccion_anteproyecto.anteproyecto_externo_docs.*`.
- **Selección:** Esquemas y `document_key` para `anteproyecto_externo` (licencias_normativas, datos_predio) y `anteproyecto_externo_docs`.
- **Seguimiento y Respuesta:** Revisiones (máx. 4), notificación, reconsideración, apelación, subsanación y mapeo de documentos de revisión.

El frontend consume estos endpoints con la estructura de datos descrita.
