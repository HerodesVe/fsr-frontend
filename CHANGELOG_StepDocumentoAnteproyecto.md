# Changelog: StepDocumentoAnteproyecto.tsx

Resumen de los cambios realizados en `src/pages/private/Anteproyectos/components/StepDocumentoAnteproyecto.tsx`.

---

## 1. Documentos proporcionados por el administrado

### Eliminados

| Documento | `documentKey` |
|-----------|---------------|
| Plano de Arquitectura | `plano_arquitectura_adm` |
| Pago derecho de revisión (CAP) - Factura | `pago_derecho_revision_factura` |

### Agregados

| Documento | `documentKey` | Obligatorio |
|----------|---------------|-------------|
| Certificado de Parámetros Urbanísticos | `certificado_parametros_urbanisticos` | Sí (*) |
| Croquis o Plano de Ubicación | `croquis_plano_ubicacion` | Sí (*) |
| Cabida Arquitectónica | `cabida_arquitectonica` | No |
| Vigencia de Poder | `vigencia_poder` | No |
| Otros Documentos | `otros_documentos_administrado` | No |

### Mantenidos

- Partida Registral (SUNARP)

---

## 2. Documentos elaborados por FSR

### Eliminados

| Documento | `documentKey` |
|-----------|---------------|
| Pago derecho de revisión (CAP) - Liquidación | `pago_derecho_revision_liquidacion` |
| Plano de Arquitectura | `plano_arquitectura_fsr` *(se reemplazó por “Planos de Arquitectura” más abajo)* |

### Agregados (debajo de Planos de Seguridad)

| Documento | `documentKey` | Obligatorio |
|----------|---------------|-------------|
| Planos de Arquitectura | `plano_arquitectura_fsr` | Sí (*) |
| Otros Documentos | `otros_documentos_fsr` | No |

### Mantenidos

- Memoria descriptiva de arquitectura  
- Memoria descriptiva de seguridad  
- FUE (Formulario Único de Edificación)  
- Presupuesto de Obra  
- Planos de Seguridad  

### Otros ajustes de texto

- "Presupuesto" → "Presupuesto de Obra"  
- "Plano de Seguridad" → "Planos de Seguridad"  

---

## 3. Orden final de documentos

### Documentos del administrado

1. Partida Registral (SUNARP) *  
2. Certificado de Parámetros Urbanísticos *  
3. Croquis o Plano de Ubicación *  
4. Cabida Arquitectónica  
5. Vigencia de Poder  
6. Otros Documentos  

### Documentos FSR

1. Memoria descriptiva de arquitectura *  
2. Memoria descriptiva de seguridad *  
3. FUE (Formulario Único de Edificación) *  
4. Presupuesto de Obra  
5. Planos de Seguridad *  
6. Planos de Arquitectura *  
7. Otros Documentos  

\* = obligatorio

---

## 4. `documentKey` usados en el formulario y backend

Asegurar que `AnteproyectoFormData` y el backend contemplen:

**Administrado:**  
`partida_registral`, `certificado_parametros_urbanisticos`, `croquis_plano_ubicacion`, `cabida_arquitectonica`, `vigencia_poder`, `otros_documentos_administrado`

**FSR:**  
`memoria_descriptiva_arquitectura`, `memoria_descriptiva_seguridad`, `formulario_unico_edificacion`, `presupuesto`, `plano_seguridad`, `plano_arquitectura_fsr`, `otros_documentos_fsr`
