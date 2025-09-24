# Documentación Completa de Flujos - FSR Frontend

## Análisis del Proyecto FSR-Frontend

### Estructura General del Proyecto

El proyecto FSR-Frontend es una aplicación React con TypeScript que gestiona múltiples flujos de trámites arquitectónicos y urbanísticos. Utiliza una arquitectura modular con componentes reutilizables y flujos paso a paso.

#### Componentes Reutilizables Identificados:
- **StepAdministrado**: Selección o creación de administrados
- **StepLicencia/StepLicenciaProyecto**: Gestión de licencias y normativas
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

---

## 1. FLUJO DE ANTEPROYECTO

### Descripción General
El **Anteproyecto** es el primer paso en el proceso de obtención de licencias de edificación. Establece las bases técnicas y legales del proyecto antes de desarrollar la documentación técnica completa.

### Pasos del Proceso (4 pasos)

#### **PASO 1: Administrado**
**Objetivo**: Identificar al cliente responsable del trámite

**Funcionalidad**:
- Buscar administrado existente en la base de datos
- Seleccionar cliente de lista desplegable
- Mostrar información del administrado seleccionado

**Campos Requeridos**:
- `selectedClient` (Cliente/Administrado) - **Obligatorio**

**Componente**: `StepAdministrado.tsx`
**Validaciones**: Debe tener administrado seleccionado

---

#### **PASO 2: Licencias/Normativas**
**Objetivo**: Definir tipo de licencia y normativas aplicables

**Funcionalidad**:
- Especificar tipo de licencia de edificación
- Seleccionar modalidad de aprobación (A, B, C)
- Adjuntar documentos normativos
- Ingresar enlaces a normativas

**Campos Requeridos**:
- `tipo_licencia_edificacion` (Tipo de Licencia) - **Obligatorio**
- `tipo_modalidad` (Modalidad A/B/C) - **Obligatorio**
- `link_normativas` (Link a normativas) - Opcional
- `archivo_normativo` (Archivo normativo) - Opcional

**Componente**: `StepLicencia.tsx`
**Validaciones**: Tipo de licencia y modalidad son obligatorios

---

#### **PASO 3: Predio**
**Objetivo**: Definir ubicación y características del terreno

**Funcionalidad**:
- Ingresar ubicación completa del predio
- Especificar medidas perimétricas
- Definir tipo de edificación y características

**Campos Requeridos**:
**Ubicación**:
- `departmentId` (Departamento) - **Obligatorio**
- `provinceId` (Provincia) - **Obligatorio**
- `districtId` (Distrito) - **Obligatorio**
- `street` (Calle/Avenida) - **Obligatorio**
- `number` (Número) - Opcional
- `urbanization` (Urbanización) - Opcional
- `mz` (Manzana) - Opcional
- `lote` (Lote) - Opcional
- `subLote` (Sub-lote) - Opcional
- `interior` (Interior) - Opcional

**Coordenadas**:
- `latitud` (Latitud) - Opcional
- `longitud` (Longitud) - Opcional

**Medidas Perimétricas**:
- `area_total_m2` (Área total en m²) - **Obligatorio**
- `frente` (Frente en m) - Opcional
- `derecha` (Derecha en m) - Opcional
- `izquierda` (Izquierda en m) - Opcional
- `fondo` (Fondo en m) - Opcional

**Edificación**:
- `tipo_edificacion` (Tipo de edificación) - **Obligatorio**
- `numero_pisos` (Número de pisos) - Opcional
- `descripcion_proyecto` (Descripción del proyecto) - Opcional

**Componente**: `StepPredio.tsx`
**Validaciones**: Ubicación básica, área total y tipo de edificación son obligatorios

---

#### **PASO 4: Documentos**
**Objetivo**: Cargar documentación técnica requerida

**Funcionalidad**:
- Cargar múltiples tipos de documentos
- Validar formatos y tamaños
- Mostrar estado de carga de documentos

**Documentos a Cargar**:
- `partida_registral` - Partida Registral
- `plano_arquitectura_adm` - Plano de Arquitectura (Administrado)
- `pago_derecho_revision_factura` - Pago Derecho de Revisión (Factura)
- `memoria_descriptiva_arquitectura` - Memoria Descriptiva de Arquitectura
- `memoria_descriptiva_seguridad` - Memoria Descriptiva de Seguridad
- `formulario_unico_edificacion` - Formulario Único de Edificación (FUE)
- `presupuesto` - Presupuesto de Obra
- `plano_seguridad` - Plano de Seguridad
- `pago_derecho_revision_liquidacion` - Pago Derecho de Revisión (Liquidación)

**Componente**: `StepDocumentos.tsx`
**Validaciones**: Ningún documento es estrictamente obligatorio en esta etapa

---

## 2. FLUJO DE PROYECTO

### Descripción General
El **Proyecto** es la etapa de desarrollo técnico completo que se basa en un anteproyecto aprobado. Incluye toda la documentación técnica especializada requerida para la construcción.

### Pasos del Proceso (7 pasos)

#### **PASO 1: Anteproyecto**
**Objetivo**: Seleccionar anteproyecto base o ingresar datos manualmente

**Funcionalidad**:
- Buscar y seleccionar anteproyecto aprobado existente
- Importar datos del anteproyecto seleccionado
- Opción de ingreso manual si no hay anteproyecto base
- Mostrar progreso del anteproyecto seleccionado

**Campos Requeridos**:
**Si hay anteproyecto**:
- `selectedAnteproyecto` (Anteproyecto seleccionado)
- `anteproyecto_importado_id` (ID del anteproyecto)

**Si no hay anteproyecto**:
- `selectedClient` (Cliente) - **Obligatorio**
- `titulo_proyecto` (Título del proyecto) - **Obligatorio**
- `tipo_proyecto` (Tipo de proyecto) - **Obligatorio**
- `descripcion` (Descripción) - Opcional

**Componente**: `StepAnteproyecto.tsx`
**Validaciones**: Debe seleccionar anteproyecto O completar datos manuales

---

#### **PASO 2: Licencias/Normativas**
**Objetivo**: Definir o heredar configuración de licencias del anteproyecto

**Funcionalidad**:
- Reutilizar datos del anteproyecto (si existe)
- Modificar tipo de licencia si es necesario
- Actualizar normativas aplicables

**Campos Requeridos**:
- `tipo_licencia_edificacion` (Tipo de Licencia) - **Obligatorio**
- `tipo_modalidad` (Modalidad A/B/C/D) - **Obligatorio**
- `link_normativas` (Link a normativas) - Opcional
- `archivo_normativo` (Archivo normativo) - Opcional

**Componente**: `StepLicenciaProyecto.tsx`
**Validaciones**: Tipo de licencia y modalidad son obligatorios

---

#### **PASO 3: Arquitectura**
**Objetivo**: Cargar documentación técnica de arquitectura

**Funcionalidad**:
- Cargar planos de arquitectura
- Subir memorias descriptivas
- Incluir documentos de seguridad
- Otros documentos arquitectónicos

**Documentos a Cargar**:
- `arq_plano_ubicacion` - Plano de Ubicación
- `arq_plano_arquitectura` - Planos de Arquitectura
- `arq_plano_seguridad` - Planos de Seguridad
- `arq_memoria_descriptiva_seguridad` - Memoria Descriptiva de Seguridad
- `arq_memoria_descriptiva_arquitectura` - Memoria Descriptiva de Arquitectura
- `arq_memoria_descriptiva_estructura` - Memoria Descriptiva de Estructura
- `arq_otros_archivos` - Otros Archivos de Arquitectura

**Componente**: `StepArquitectura.tsx`
**Validaciones**: Ningún documento específico es obligatorio

---

#### **PASO 4: Estructuras**
**Objetivo**: Cargar documentación técnica de estructuras

**Funcionalidad**:
- Cargar planos estructurales
- Subir memorias de cálculo
- Incluir especificaciones técnicas

**Documentos a Cargar**:
- `est_plano_ubicacion` - Plano de Ubicación (Estructural)
- `est_plano_arquitectura` - Planos de Arquitectura (Estructural)
- `est_plano_seguridad` - Planos de Seguridad (Estructural)
- `est_memoria_descriptiva_seguridad` - Memoria Descriptiva de Seguridad
- `est_memoria_descriptiva_arquitectura` - Memoria Descriptiva de Arquitectura
- `est_memoria_descriptiva_estructura` - Memoria Descriptiva de Estructura
- `est_otros_archivos` - Otros Archivos de Estructuras

**Componente**: `StepEstructuras.tsx`
**Validaciones**: Ningún documento específico es obligatorio

---

#### **PASO 5: Sanitarias**
**Objetivo**: Cargar documentación de instalaciones sanitarias

**Funcionalidad**:
- Cargar planos de instalaciones sanitarias
- Subir memorias descriptivas
- Incluir factibilidades de servicios

**Documentos a Cargar**:
- `san_plano_instalacion_sanitaria` - Planos de Instalaciones Sanitarias
- `san_memoria_descriptiva` - Memoria Descriptiva
- `san_especificaciones_tecnicas` - Especificaciones Técnicas
- `san_factibilidad_desague` - Factibilidad de Desagüe
- `san_otros_archivos` - Otros Archivos Sanitarios

**Componente**: `StepSanitarias.tsx`
**Validaciones**: Ningún documento específico es obligatorio

---

#### **PASO 6: Eléctricas**
**Objetivo**: Cargar documentación de todas las instalaciones eléctricas

**Funcionalidad**:
- Sistema de tabs para diferentes especialidades
- Cargar documentos por sub-especialidad
- Mostrar/ocultar secciones de "otros archivos"

**Sub-especialidades (Tabs)**:

**Tab 1: Eléctricas**
- `elec_plano_instalacion_electrica` - Planos de Instalaciones Eléctricas
- `elec_memoria_descriptiva` - Memoria Descriptiva
- `elec_especificaciones_tecnicas` - Especificaciones Técnicas
- `elec_factibilidad_energia` - Factibilidad de Energía
- `elec_otros_archivos` - Otros Archivos Eléctricos

**Tab 2: Mecánicas**
- `mec_plano_instalacion_mecanica` - Planos de Instalaciones Mecánicas
- `mec_memoria_descriptiva` - Memoria Descriptiva
- `mec_especificaciones_tecnicas` - Especificaciones Técnicas
- `mec_otros_archivos` - Otros Archivos Mecánicos

**Tab 3: Gas**
- `gas_plano_instalacion_gas` - Planos de Instalaciones de Gas
- `gas_memoria_descriptiva` - Memoria Descriptiva
- `gas_especificaciones_tecnicas` - Especificaciones Técnicas
- `gas_factibilidad_gas` - Factibilidad de Gas
- `gas_otros_archivos` - Otros Archivos de Gas

**Tab 4: Paneles Solares**
- `pan_planos` - Planos de Paneles Solares
- `pan_memoria_descriptiva` - Memoria Descriptiva
- `pan_especificaciones_tecnicas` - Especificaciones Técnicas
- `pan_otros_archivos` - Otros Archivos de Paneles Solares

**Tab 5: Comunicaciones** (implícito en el código)
- `com_planos` - Planos de Comunicaciones
- `com_otros_archivos` - Otros Archivos de Comunicaciones

**Componente**: `StepElectricas.tsx`
**Validaciones**: Ningún documento específico es obligatorio

---

#### **PASO 7: Sustento Técnico**
**Objetivo**: Cargar documentación legal y técnica especializada

**Funcionalidad**:
- Configurar requerimientos de sustento legal
- Configurar requerimientos de informe vinculante
- Cargar documentos de sustento según configuración

**Campos de Configuración**:
- `requiere_sustento_legal` (¿Requiere Sustento Legal?) - Boolean
- `requiere_informe_vinculante` (¿Requiere Informe Vinculante?) - Boolean

**Documentos a Cargar** (según configuración):
- `documento_sustento_tecnico_legal` - Documento de Sustento Técnico Legal
- `consulta_ministerio` - Consulta al Ministerio
- `cargo_presentacion_consulta` - Cargo de Presentación de Consulta
- `sustento_otros_archivos` - Otros Archivos de Sustento

**Componente**: `StepSustentoTecnico.tsx`
**Validaciones**: Documentos requeridos según configuración boolean

---

## 3. FLUJO DE DEMOLICIÓN

### Descripción General
La **Demolición Total** es el proceso para obtener permisos de demolición completa de edificaciones existentes. Requiere documentación técnica específica y gestión municipal.

### Pasos del Proceso (4 pasos)

#### **PASO 1: Administrado**
**Objetivo**: Vincular administrado responsable del trámite

**Funcionalidad**:
- Seleccionar administrado existente
- Mostrar información del administrado seleccionado

**Campos Requeridos**:
- `selectedClient` (Administrado) - **Obligatorio**

**Componente**: `StepAdministrado.tsx` (reutilizado)
**Validaciones**: Debe tener administrado seleccionado

---

#### **PASO 2: Documentación**
**Objetivo**: Recopilar toda la documentación técnica necesaria

**Funcionalidad**:
- Cargar documentos del administrado
- Cargar documentos técnicos de FSR
- Incluir panel fotográfico del inmueble
- Configurar zona de reglamentación especial

**Secciones**:

**2.1: Documentación del Administrado**
- `partida_registral` - Partida Registral - **Obligatorio**
- `fue` - Formulario Único de Edificación (FUE) - **Obligatorio**
- `documentos_antecedentes` - Documentos de Antecedentes
- `es_zona_reglamentacion_especial` - ¿Es Zona de Reglamentación Especial? (Boolean)
- `licencia_obra_nueva` - Licencia de Obra Nueva (si aplica)
- `comentarios_adicionales` - Comentarios Adicionales (Texto)

**2.2: Documentación FSR**
- `memoria_descriptiva` - Memoria Descriptiva - **Obligatorio**
- `plano_ubicacion` - Plano de Ubicación - **Obligatorio**
- `plano_arquitectura` - Plano de Arquitectura - **Obligatorio**
- `plano_cerco` - Plano de Cerco - **Obligatorio**
- `plano_sostenimiento` - Plano de Sostenimiento

**2.3: Panel Fotográfico**
- `fotografias` - Fotografías del Inmueble
- `link_video` - Link de Video (URL)

**Componente**: `StepDocumentacion.tsx`
**Validaciones**: Documentos marcados como obligatorios son requeridos

---

#### **PASO 3: Medidas Perimétricas**
**Objetivo**: Registrar medidas según partida registral y medidas reales

**Funcionalidad**:
- Ingresar medidas según partida registral
- Ingresar medidas reales tomadas en campo
- Comparar diferencias y registrar observaciones

**Campos Requeridos**:

**Según Partida Registral**:
- `frente_partida` (Frente según partida) - **Obligatorio**
- `fondo_partida` (Fondo según partida) - **Obligatorio**
- `derecha_partida` (Derecha según partida) - **Obligatorio**
- `izquierda_partida` (Izquierda según partida) - **Obligatorio**
- `area_total_partida` (Área total según partida) - **Obligatorio**

**Medidas Reales (de Campo)**:
- `frente_real` (Frente real) - **Obligatorio**
- `fondo_real` (Fondo real) - **Obligatorio**
- `derecha_real` (Derecha real) - **Obligatorio**
- `izquierda_real` (Izquierda real) - **Obligatorio**
- `area_total_real` (Área total real) - **Obligatorio**

**Observaciones**:
- `observaciones_medidas` (Observaciones sobre medidas) - Opcional

**Componente**: `StepMedidasPerimetricas.tsx`
**Validaciones**: Todas las medidas (partida y reales) son obligatorias

---

#### **PASO 4: Gestión Municipal**
**Objetivo**: Documentar el proceso administrativo con la municipalidad

**Funcionalidad**:
- Registrar ingreso a municipalidad
- Documentar respuesta municipal
- Registrar entrega al administrado
- Todos los documentos son opcionales

**Documentos de Gestión**:
- `cargo_ingreso_municipalidad` - Cargo de Ingreso a Municipalidad
- `fecha_ingreso_municipalidad` - Fecha de Ingreso
- `respuesta_resolucion_municipal` - Respuesta/Resolución Municipal
- `fecha_respuesta_municipal` - Fecha de Respuesta
- `cargo_entrega_administrado` - Cargo de Entrega al Administrado
- `fecha_entrega_administrado` - Fecha de Entrega

**Componente**: `StepGestionMunicipal.tsx`
**Validaciones**: Ningún campo es obligatorio (se completan según avance)

---

## 4. FLUJO DE REGULARIZACIÓN

### Descripción General
La **Regularización de Licencia** está diseñada para legalizar construcciones que se realizaron sin los permisos correspondientes. Este proceso permite obtener la licencia de edificación de manera retroactiva.

### Pasos del Proceso (5 pasos)

#### **PASO 1: Datos del Administrado**
**Objetivo**: Identificar al cliente responsable del trámite

**Funcionalidad**:
- Buscar administrado existente en la base de datos
- Opción de crear nuevo administrado si no existe
- Botón "Crear Administrado" que redirige a `/dashboard/administrados/create`

**Campos Requeridos**:
- **Si selecciona existente**: `selectedClient` - **Obligatorio**
- **Si crea nuevo**:
  - `fue_nombre` (Nombre/Razón Social) - **Obligatorio**
  - `fue_dni` (DNI/RUC) - **Obligatorio**  
  - `fue_domicilio` (Domicilio) - **Obligatorio**
  - `fue_telefono` (Teléfono) - Opcional

**Componente**: `StepAdministrado.tsx` (con `showCreateButton=true`)
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

## FLUJOS ADICIONALES MENCIONADOS

Basándome en tu solicitud, mencionas 2 flujos adicionales que no están implementados en el código actual:

### 5. FLUJO DE AMPLIACIÓN, REMODELACIÓN, DEMOLICIÓN DE PROYECTO Y GESTIÓN

**Estado**: No implementado en el código actual
**Descripción**: Este sería un flujo híbrido que combinaría elementos de los flujos existentes para gestionar proyectos que involucren ampliaciones, remodelaciones y demoliciones parciales.

**Pasos Propuestos** (basándome en los patrones existentes):

#### **PASO 1: Proyecto Base (StepAdministrado + Nombre del Proyecto)**
- Usar `StepAdministrado` existente
- Agregar input para nombre del proyecto arriba del selector de administrado
- Campos: `nombreProyecto`, `selectedClient`

#### **PASO 2: Licencias (StepLicencias reutilizable)**
- Reutilizar `StepLicencia` o `StepLicenciaProyecto`
- Campos estándar de licencias y normativas

#### **PASO 3-N: Pasos Específicos según Tipo de Intervención**
- Reutilizar componentes existentes según el tipo:
  - **Ampliación**: Pasos similares a Proyecto (Arquitectura, Estructuras, etc.)
  - **Remodelación**: Documentación de estado actual + documentación nueva
  - **Demolición**: Pasos similares a Demolición (Documentación, Medidas, etc.)

---

### 6. FLUJO DE GESTIÓN DE AMPLIACIÓN, REMODELACIÓN, DEMOLICIÓN DE PROYECTO Y GESTIÓN

**Estado**: No implementado en el código actual
**Descripción**: Este sería un flujo de gestión y seguimiento de proyectos complejos que ya están en proceso.

**Pasos Propuestos**:
- **Seguimiento de Proyecto**: Dashboard de estado de cada componente
- **Gestión de Documentos**: Control de versiones y estados
- **Coordinación de Especialidades**: Gestión de diferentes equipos técnicos
- **Gestión Municipal**: Seguimiento de trámites municipales
- **Entrega Final**: Consolidación y entrega de documentación

---

## COMPONENTES REUTILIZABLES IDENTIFICADOS

### Componentes de Steps Existentes:
1. **StepAdministrado** - ✅ Implementado y reutilizable
2. **StepLicencia** - ✅ Implementado para Anteproyecto
3. **StepLicenciaProyecto** - ✅ Implementado para Proyecto
4. **StepPredio** - ✅ Implementado para Anteproyecto
5. **StepDocumentos** - ✅ Implementado para Anteproyecto
6. **StepArquitectura** - ✅ Implementado para Proyecto
7. **StepEstructuras** - ✅ Implementado para Proyecto
8. **StepSanitarias** - ✅ Implementado para Proyecto
9. **StepElectricas** - ✅ Implementado para Proyecto
10. **StepSustentoTecnico** - ✅ Implementado para Proyecto

### Componentes UI Reutilizables:
- **FileUpload** - Carga de documentos con validación
- **Input/Select/DateInput** - Componentes de formulario
- **Button** - Botones con variantes
- **Filter** - Filtros de búsqueda
- **Modal** - Modales para selección
- **ProyectoCard** - Tarjetas para listas

---

## RECOMENDACIONES PARA NUEVOS FLUJOS

### Para implementar los flujos faltantes:

1. **Reutilizar componentes existentes** siempre que sea posible
2. **Mantener el patrón de navegación** paso a paso
3. **Usar la misma estructura de tipos** (FormData, FormStep, etc.)
4. **Implementar validaciones por paso** siguiendo el patrón existente
5. **Incluir componente de Resumen** lateral siguiendo el patrón
6. **Mantener uniformidad visual** sin iconos en steps para consistencia

### Estructura propuesta para nuevos flujos:
```
src/pages/private/NuevoFlujo/
├── NuevoFlujo.tsx (Lista principal)
├── CreateEditNuevoFlujo.tsx (Formulario paso a paso)
├── components/
│   └── ResumenNuevoFlujo.tsx
├── StepNuevoFlujo/
│   ├── StepCustom1.tsx
│   └── StepCustom2.tsx
└── index.ts
```

Esta documentación proporciona la base completa para entender e implementar cualquier flujo adicional en el sistema FSR-Frontend, reutilizando la arquitectura y componentes existentes.
