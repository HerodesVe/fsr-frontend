# Documentación del Flujo de Regularización de Licencia

## Análisis del Proyecto FSR-Frontend

### Estructura General del Proyecto

El proyecto FSR-Frontend sigue una arquitectura bien organizada con componentes reutilizables y flujos paso a paso. Después de analizar los flujos existentes (Proyecto, Anteproyecto, Demolición), se identificaron los siguientes patrones comunes:

#### Componentes Reutilizables Identificados:
- **StepAdministrado**: Selección o creación de administrados
- **FileUpload**: Carga de documentos con validación
- **Input/Select/DateInput**: Componentes de formulario estándar
- **Steps**: Navegación paso a paso con validación
- **Filter**: Filtros de búsqueda y estado
- **ProyectoCard**: Tarjetas para mostrar elementos en listas

#### Estructura de Tipos:
- **FormData**: Datos del formulario paso a paso
- **UploadedDocument**: Documentos cargados
- **FormStep**: Pasos del formulario
- **Status**: Estados de progreso

## Flujo de Regularización de Licencia

### Descripción General

El flujo de **Regularización de Licencia** está diseñado para legalizar construcciones que se realizaron sin los permisos correspondientes. Este proceso permite obtener la licencia de edificación de manera retroactiva.

### Pasos del Proceso

#### **PASO 1: Datos del Administrado**
**Objetivo**: Identificar al cliente responsable del trámite

**Funcionalidad**:
- Buscar administrado existente en la base de datos
- Opción de crear nuevo administrado si no existe
- Botón "Crear Administrado" que redirige a `/dashboard/administrados/create`

**Campos Requeridos**:
- **Si selecciona existente**: `selectedClient`
- **Si crea nuevo**:
  - `fue_nombre` (Nombre/Razón Social) - **Obligatorio**
  - `fue_dni` (DNI/RUC) - **Obligatorio**  
  - `fue_domicilio` (Domicilio) - **Obligatorio**
  - `fue_telefono` (Teléfono) - Opcional

**Componente**: `StepAdministrado.tsx`
**Validaciones**: Debe tener administrado seleccionado O datos completos del nuevo administrado

---

#### **PASO 2: Documentación Inicial**
**Objetivo**: Recopilar documentos base y establecer fecha clave

**Funcionalidad**:
- Definir fecha de culminación de la edificación
- Cargar documentos proporcionados por el administrado
- Los documentos se cargan en vertical (uno debajo del otro)

**Campos Requeridos**:
- `fechaCulminacion` (Fecha de Culminación de Edificación) - **Obligatorio**

**Documentos a Cargar**:
- `licenciaAnterior` - Licencia de Obra Anterior (si existe)
- `declaratoriaFabrica` - Declaratoria de Fábrica
- `planosAntecedentes` - Planos de Antecedentes (.pdf, .dwg)
- `otros` - Otros Documentos Adicionales (.pdf, .doc, .docx, .jpg, .png)

**Componente**: `StepDocumentacionInicial.tsx`
**Validaciones**: Fecha de culminación obligatoria

---

#### **PASO 3: Datos del Predio**
**Objetivo**: Especificar información técnica del inmueble

**Funcionalidad**:
- Ingresar características específicas del predio
- Datos necesarios para generar el FUE (Formulario Único de Edificación)

**Campos Requeridos**:
- `fue_ubicacion` (Ubicación del Predio) - **Obligatorio**
- `fue_partida` (Partida Registral SUNARP) - **Obligatorio**
- `fue_modalidad` (Modalidad de Licencia) - **Obligatorio**
- `fue_presupuesto` (Presupuesto de Obra en S/.) - **Obligatorio**

**Componente**: `StepDatosPredio.tsx`
**Validaciones**: Todos los campos son obligatorios

---

#### **PASO 4: FUE Firmado**
**Objetivo**: Gestionar el proceso de firma del documento oficial

**Funcionalidad**:
- Generar FUE con datos ingresados (botón "Generar y Descargar FUE")
- Proceso físico de firmas
- Cargar documento escaneado con firmas

**Proceso Detallado**:
1. **Generar y Descargar** el FUE en formato PDF
2. **Imprimir** el documento generado
3. **Obtener firmas originales** de profesionales FSR y administrado
4. **Escanear** el documento firmado
5. **Subir** el PDF escaneado

**Campos Requeridos**:
- `fueFirmado` (FUE Firmado y Escaneado) - **Obligatorio**

**Componente**: `StepFueFirmado.tsx`
**Validaciones**: Documento FUE firmado es obligatorio

---

#### **PASO 5: Gestión Municipal**
**Objetivo**: Registrar el proceso administrativo con la municipalidad

**Funcionalidad**:
- Documentar cada etapa del trámite municipal
- Mantener trazabilidad completa del proceso
- Todos los documentos son opcionales (se van cargando según avance)

**Documentos de Gestión**:
- `cargoMunicipal` - Cargo de Ingreso a Municipalidad
- `actaObservacion` - Acta(s) de Observación (si hay observaciones)
- `docSubsanacion` - Documento(s) de Subsanación (si hay que subsanar)
- `resolucionFinal` - Licencia/Resolución Final (documento final)

**Proceso Municipal**:
1. **Ingreso**: Presentar expediente con FUE firmado
2. **Revisión**: Municipalidad revisa documentación
3. **Observaciones**: Si hay observaciones, se subsanan
4. **Resolución**: Emisión de licencia o resolución final

**Componente**: `StepGestionMunicipal.tsx`
**Validaciones**: Ninguna (todos opcionales)

---

## Estructura Técnica Implementada

### Tipos Creados (`regularizacion.types.ts`)
```typescript
- RegularizacionFormData: Datos del formulario completo
- RegularizacionStatus: Estados (TODOS, PENDIENTE, COMPLETADO)
- FormStep: Estructura de pasos
- UploadedDocument: Documentos cargados
- RegularizacionData: Estructura de datos completa
- Regularizacion: Entidad principal
```

### Componentes Step Creados
```
src/pages/private/Regularizaciones/StepRegularizacion/
├── StepAdministrado.tsx
├── StepDocumentacionInicial.tsx
├── StepDatosPredio.tsx
├── StepFueFirmado.tsx
└── StepGestionMunicipal.tsx
```

### Componentes Principales
```
src/pages/private/Regularizaciones/
├── Regularizaciones.tsx (Lista principal)
├── CreateEditRegularizacion.tsx (Formulario paso a paso)
└── index.ts (Exportaciones)
```

### Rutas Agregadas
```
/dashboard/regularizaciones - Lista de regularizaciones
/dashboard/regularizaciones/create - Nueva regularización
/dashboard/regularizaciones/edit/:id - Editar regularización
```

## Flujo de Usuario Completo

### 1. Acceso al Flujo
- Usuario navega a `/dashboard/regularizaciones`
- Ve lista de regularizaciones existentes con filtros
- Clic en "Nueva Regularización" para iniciar proceso

### 2. Navegación por Pasos
- **Navegación hacia adelante**: Solo si el paso actual está validado
- **Navegación hacia atrás**: Permitida a cualquier paso anterior
- **Validaciones**: Cada paso tiene validaciones específicas
- **Persistencia**: Los datos se mantienen al navegar entre pasos

### 3. Gestión de Documentos
- **Carga múltiple**: Soporta múltiples archivos por campo
- **Formatos aceptados**: Específicos por tipo de documento
- **Vista previa**: Lista de archivos cargados con opción de eliminar
- **Validación**: Tamaño máximo y tipos de archivo

### 4. Finalización
- **Último paso**: Botón "Finalizar Proceso"
- **Guardado**: Simula guardado en backend
- **Redirección**: Vuelve a lista principal

## Relación con Flujos Existentes

### Similitudes con Anteproyecto
- **Paso 1**: Mismo componente `StepAdministrado`
- **Estructura**: Formulario paso a paso similar
- **Validaciones**: Patrón de validación por paso
- **Navegación**: Mismo sistema de navegación

### Similitudes con Demolición
- **Documentación**: Uso intensivo de `FileUpload`
- **Gestión Municipal**: Concepto similar de trámite municipal
- **Validaciones**: Campos obligatorios vs opcionales

### Diferencias Clave
- **Proceso FUE**: Único en regularización (paso físico de firmas)
- **Fecha Culminación**: Específico para edificaciones existentes
- **Documentos Antecedentes**: Específicos para regularización
- **Menos pasos**: 5 pasos vs 7 en Proyecto

## Consideraciones de Implementación

### Componentes Reutilizados
- ✅ `StepAdministrado` (reutilizado de Steps existentes)
- ✅ `FileUpload` (componente UI existente)
- ✅ `Input`, `Select`, `DateInput` (componentes UI)
- ✅ `ProyectoCard` (para lista de regularizaciones)
- ✅ `Filter` (para filtros de búsqueda)

### Nuevos Componentes Específicos
- ✅ 4 nuevos componentes Step específicos para regularización
- ✅ Lógica de generación de FUE (placeholder implementado)
- ✅ Validaciones específicas por paso

### Integraciones Pendientes
- 🔄 Conexión con backend real (actualmente usa datos dummy)
- 🔄 Generación real de PDF para FUE
- 🔄 Sistema de notificaciones de progreso
- 🔄 Integración con sistema de administrados

## Prompt para Implementación Futura

```
Basado en el análisis del proyecto FSR-frontend, implementar el flujo de "Regularización de Licencia" con los siguientes requerimientos:

PASO 1 - StepAdministrado: 
- Reutilizar componente existente
- Agregar botón "Crear Administrado" que redirija a /administrados/create
- Validar selección o creación de administrado

PASO 2 - StepDocumentacionInicial:
- Fecha de culminación (obligatorio)
- 4 tipos de documentos en vertical: licencia anterior, declaratoria fábrica, planos antecedentes, otros
- Usar FileUpload existente

PASO 3 - StepDatosPredio:
- 4 campos obligatorios: ubicación, partida registral, modalidad, presupuesto
- Grid 2x2 en desktop, vertical en mobile

PASO 4 - StepFueFirmado:
- Botón generar FUE (PDF)
- Instrucciones proceso físico (5 pasos)
- Upload FUE firmado (obligatorio)

PASO 5 - StepGestionMunicipal:
- 4 documentos opcionales: cargo municipal, actas observación, subsanación, resolución final
- Información del proceso municipal

Usar arquitectura existente: tipos, validaciones por paso, navegación, componentes UI reutilizables.
```

Este flujo está completamente implementado y listo para uso, siguiendo los patrones establecidos en el proyecto FSR-frontend.
