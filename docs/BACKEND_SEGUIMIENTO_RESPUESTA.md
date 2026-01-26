# Guía de Configuración del Backend para el Flujo de Seguimiento y Respuesta

## Resumen Ejecutivo

Este documento describe la estructura de datos y endpoints necesarios para gestionar el flujo de "Seguimiento y Respuesta" en el módulo de Gestión de Anteproyectos. El flujo soporta hasta 4 revisiones iterativas con procesos de notificación, reconsideración y apelación.

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

---

## 2. Endpoints API

### 2.1 Estructura de Rutas

```
/api/v1/gestion-anteproyectos/{gestion_id}/seguimiento-respuesta
```

### 2.2 Endpoints Detallados

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

| Frontend (documentKey) | Backend (document_type) |
|------------------------|-------------------------|
| `seguimiento_respuesta.revision_{N}.archivo_acta` | `archivo_acta` |
| `seguimiento_respuesta.revision_{N}.notificacion.archivo_notificacion` | `notificacion.archivo_notificacion` |
| `seguimiento_respuesta.revision_{N}.notificacion.documentos_subsanacion` | `notificacion.documentos_subsanacion` |
| `seguimiento_respuesta.revision_{N}.documentos_subsanacion` | `documentos_subsanacion` |
| `seguimiento_respuesta.revision_{N}.reconsideracion.documento_recurso` | `reconsideracion.documento_recurso` |
| `seguimiento_respuesta.revision_{N}.reconsideracion.resolucion_recurso` | `reconsideracion.resolucion_recurso` |
| `seguimiento_respuesta.revision_{N}.apelacion.documento_recurso` | `apelacion.documento_recurso` |
| `seguimiento_respuesta.revision_{N}.apelacion.resolucion_recurso` | `apelacion.resolucion_recurso` |

### 5.2 Campos Legacy (Compatibilidad)

Para mantener compatibilidad con el código existente, el backend debe:

1. **Al leer**: Si no existen `revisiones`, crear una revisión inicial con los datos legacy
2. **Al escribir**: Actualizar tanto `revisiones` como los campos legacy (`fecha_respuesta`, `resultado_acta`, etc.)

---

## 6. Resumen de Validaciones por Endpoint

| Endpoint | Validaciones |
|----------|--------------|
| `PATCH /revision-actual` | - Revisión no completada<br>- Fecha y archivo requeridos para resultado<br>- Resultado válido (conforme/no_conforme) |
| `POST /revisiones` | - Máximo 4 revisiones<br>- Revisión anterior = no_conforme<br>- Subsanación completada o recurso fundado<br>- Estado = en_proceso |
| `POST /documentos` | - Revisión existe<br>- Tipo de documento válido<br>- Archivo válido (PDF, JPG, PNG) |

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
```

---

Esta guía proporciona toda la estructura necesaria para implementar el backend del flujo de Seguimiento y Respuesta. El frontend ya está preparado para consumir estos endpoints con la estructura de datos descrita.
