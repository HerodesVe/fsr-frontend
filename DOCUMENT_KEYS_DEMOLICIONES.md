# Document Keys - Demoliciones

Este documento lista todas las **document keys** (claves de documento) que se utilizan para subir archivos en el módulo de **Demoliciones**, siguiendo la notación de puntos que refleja la estructura JSON del backend.

## 📋 Estructura de Keys

### 1. Documentación del Administrado
Sección: **documentacion_administrado**

| Documento | Document Key | Obligatorio |
|-----------|--------------|-------------|
| Partida Registral del Terreno | `documentacion_administrado.partida_registral` | ✅ Sí |
| FUE (Formulario Único de Edificación) | `documentacion_administrado.fue` | ✅ Sí |
| Documentos de Antecedentes | `documentacion_administrado.documentos_antecedentes` | ❌ No |
| Licencia de Obra Nueva / Proyecto | `documentacion_administrado.licencia_obra_nueva` | ⚠️ Condicional* |

*Solo obligatorio si el predio está en Zona de Reglamentación Especial

### 2. Documentación FSR
Sección: **documentacion_fsr**

| Documento | Document Key | Obligatorio |
|-----------|--------------|-------------|
| Memoria Descriptiva | `documentacion_fsr.memoria_descriptiva` | ✅ Sí |
| Plano de Ubicación | `documentacion_fsr.plano_ubicacion` | ✅ Sí |
| Plano de Arquitectura | `documentacion_fsr.plano_arquitectura` | ✅ Sí |
| Plano de Cerco | `documentacion_fsr.plano_cerco` | ✅ Sí |
| Plano de Sostenimiento | `documentacion_fsr.plano_sostenimiento` | ❌ No |

### 3. Panel Fotográfico
Sección: **panel_fotografico**

| Documento | Document Key | Obligatorio |
|-----------|--------------|-------------|
| Fotografías | `panel_fotografico.fotografias` | ❌ No |

### 4. Gestión Municipal
Sección: **gestion_municipal**

| Documento | Document Key | Obligatorio |
|-----------|--------------|-------------|
| Cargo de Ingreso a Municipalidad | `gestion_municipal.cargo_ingreso_municipalidad` | ❌ No |
| Respuesta / Resolución Municipal | `gestion_municipal.respuesta_resolucion_municipal` | ❌ No |
| Cargo de Entrega al Administrado | `gestion_municipal.cargo_entrega_administrado` | ❌ No |

### 5. Entrega Final
Sección: **entrega_final**

| Documento | Document Key | Obligatorio |
|-----------|--------------|-------------|
| Cargo de Entrega Final al Administrado | `entrega_final.cargo_entrega_final_administrado` | ❌ No |

## 🔧 Implementación Técnica

### Función handleFileUpload

La función `handleFileUpload` en `CreateEditDemolicion.tsx` maneja la subida de archivos:

```typescript
const handleFileUpload = async (file: File, documentKey?: string) => {
  // Crear objeto local inmediatamente
  const uploadedDoc: UploadedDocument = {
    id: Date.now().toString(),
    name: file.name,
    url: URL.createObjectURL(file),
    size: file.size,
    type: file.type,
  };
  
  setUploadedDocuments(prev => [...prev, uploadedDoc]);

  // Si ya tenemos un ID de demolición, subir el archivo inmediatamente
  if (demolicionId && documentKey) {
    try {
      await uploadDocs(demolicionId, [file], [documentKey]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  
  return uploadedDoc;
};
```

### Servicio uploadDocuments

El servicio `uploadDocuments` en `src/services/demoliciones.service.ts`:

```typescript
export const uploadDocuments = async (
  id: string, 
  files: File[], 
  keys: string[]
): Promise<any> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  keys.forEach(key => formData.append('keys', key));

  const response = await api.post(`/demoliciones/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
```

## 📤 Ejemplo de Petición

Cuando se sube un archivo, la petición al backend se ve así:

```
POST /demoliciones/{demolicion_id}/documents

Content-Type: multipart/form-data

files: [archivo1.pdf, archivo2.pdf]
keys: ['documentacion_administrado.partida_registral', 'documentacion_fsr.memoria_descriptiva']
```

## ✅ Archivos Modificados

- ✅ `src/pages/private/Demoliciones/StepDemolicion/StepDocumentacion.tsx`
- ✅ `src/pages/private/Demoliciones/StepDemolicion/StepGestionMunicipal.tsx`
- ✅ `src/components/utils/Steps/StepCargo.tsx` (ahora acepta `cargoDocumentKey` como prop)
- ✅ `src/pages/private/Demoliciones/CreateEditDemolicion.tsx`

## 🎯 Validación

Para validar que las keys están correctas:

1. Crear una nueva demolición
2. Subir archivos en cada paso
3. Verificar en la consola del navegador que no haya errores
4. Verificar que los archivos se suban al backend correctamente
5. La estructura debe coincidir con el JSON que se envía en `buildCreateRequest()`



