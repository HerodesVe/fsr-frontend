import { useState, useCallback, useEffect } from 'react';
import { LuPlus, LuTrash2, LuFileText, LuChevronDown, LuChevronUp, LuInfo } from 'react-icons/lu';
import { Button, FileUpload } from '@/components/ui';
import type { 
  ConformidadConVariacionFormData, 
  UploadedDocument,
  ExpedienteLicencia,
} from '@/types/conformidad.types';

interface StepAntecedentesLicenciasProps {
  formData: ConformidadConVariacionFormData;
  errors: Record<string, string>;
  conformidadId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey?: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

// Helper para crear expediente vacío
const createEmptyExpediente = (numeroLicencia: number): ExpedienteLicencia => ({
  id: `licencia_${Date.now()}_${numeroLicencia}`,
  numero_licencia: numeroLicencia,
  nombre: `Licencia ${numeroLicencia}`,
  fecha_creacion: new Date().toISOString().split('T')[0],
  documentos: {
    licencia_edificacion_primigenia: [],
    fue: [],
    arquitectura_aprobada: [],
    planos_arquitectura: [],
    planos_seguridad: [],
    memoria_arquitectura: [],
    memoria_seguridad: [],
    especialidades_aprobadas: [],
    otros_documentos: [],
  },
  observaciones: '',
});

// Documentos requeridos por expediente
const DOCUMENTOS_EXPEDIENTE = [
  { key: 'licencia_edificacion_primigenia', label: 'Licencia de Edificación Primigenia', required: true },
  { key: 'fue', label: 'FUE (Formulario Único de Edificación)', required: true },
  { key: 'arquitectura_aprobada', label: 'Documentos de Especialidad Arquitectura Aprobada', required: false },
  { key: 'planos_arquitectura', label: 'Planos de Arquitectura Aprobados', required: true },
  { key: 'planos_seguridad', label: 'Planos de Seguridad Aprobados', required: false },
  { key: 'memoria_arquitectura', label: 'Memoria Descriptiva de Arquitectura', required: false },
  { key: 'memoria_seguridad', label: 'Memoria Descriptiva de Seguridad', required: false },
  { key: 'especialidades_aprobadas', label: 'Documentos de Especialidades Aprobadas', required: false },
  { key: 'otros_documentos', label: 'Otros Documentos', required: false },
];

export default function StepAntecedentesLicencias({
  formData,
  errors,
  conformidadId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepAntecedentesLicenciasProps) {
  
  // Estado para controlar qué licencias están expandidas
  const [expandedLicencias, setExpandedLicencias] = useState<Set<string>>(new Set());

  // Inicializar expedientes si no hay ninguno
  useEffect(() => {
    if (!formData.expedientes_licencias || formData.expedientes_licencias.length === 0) {
      const primeraLicencia = createEmptyExpediente(1);
      onInputChange('expedientes_licencias', [primeraLicencia]);
      setExpandedLicencias(new Set([primeraLicencia.id]));
    } else if (expandedLicencias.size === 0) {
      // Si hay expedientes pero ninguno expandido, expandir el primero
      setExpandedLicencias(new Set([formData.expedientes_licencias[0].id]));
    }
  }, []);

  const expedientes = formData.expedientes_licencias || [];

  // Agregar nueva licencia
  const handleAddLicencia = useCallback(() => {
    const nuevoNumero = expedientes.length + 1;
    const nuevaLicencia = createEmptyExpediente(nuevoNumero);
    onInputChange('expedientes_licencias', [...expedientes, nuevaLicencia]);
    setExpandedLicencias(prev => new Set([...prev, nuevaLicencia.id]));
  }, [expedientes, onInputChange]);

  // Eliminar licencia
  const handleRemoveLicencia = useCallback((licenciaId: string) => {
    if (expedientes.length <= 1) {
      return; // No permitir eliminar la última licencia
    }
    const nuevosExpedientes = expedientes
      .filter(exp => exp.id !== licenciaId)
      .map((exp, index) => ({
        ...exp,
        numero_licencia: index + 1,
        nombre: `Licencia ${index + 1}`,
      }));
    onInputChange('expedientes_licencias', nuevosExpedientes);
    setExpandedLicencias(prev => {
      const newSet = new Set(prev);
      newSet.delete(licenciaId);
      return newSet;
    });
  }, [expedientes, onInputChange]);

  // Toggle expandir/colapsar licencia
  const toggleExpand = useCallback((licenciaId: string) => {
    setExpandedLicencias(prev => {
      const newSet = new Set(prev);
      if (newSet.has(licenciaId)) {
        newSet.delete(licenciaId);
      } else {
        newSet.add(licenciaId);
      }
      return newSet;
    });
  }, []);

  // Actualizar documento de una licencia
  const handleDocumentoChange = useCallback((licenciaId: string, docKey: string, files: File[]) => {
    const nuevosExpedientes = expedientes.map(exp => {
      if (exp.id === licenciaId) {
        return {
          ...exp,
          documentos: {
            ...exp.documentos,
            [docKey]: files,
          },
        };
      }
      return exp;
    });
    onInputChange('expedientes_licencias', nuevosExpedientes);
  }, [expedientes, onInputChange]);

  // Actualizar observaciones de una licencia
  const handleObservacionesChange = useCallback((licenciaId: string, observaciones: string) => {
    const nuevosExpedientes = expedientes.map(exp => {
      if (exp.id === licenciaId) {
        return { ...exp, observaciones };
      }
      return exp;
    });
    onInputChange('expedientes_licencias', nuevosExpedientes);
  }, [expedientes, onInputChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 3: Antecedentes (Expedientes de Licencias)
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre los expedientes de licencias anteriores del proyecto. La Licencia 1 es obligatoria.
        </p>
      </div>

      {/* Información */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuInfo className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              CRUD de Expedientes/Licencias
            </h4>
            <p className="text-sm text-yellow-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Puede agregar múltiples licencias (Licencia 1, Licencia 2, Licencia 3...). 
              Cada licencia debe contener los documentos históricos del expediente.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Licencias */}
      <div className="space-y-4">
        {expedientes.map((expediente, index) => (
          <div 
            key={expediente.id}
            className={`border-2 rounded-xl overflow-hidden ${
              index === 0 ? 'border-teal-300 bg-teal-50/30' : 'border-gray-200 bg-white'
            }`}
          >
            {/* Header de la licencia */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${
                index === 0 ? 'bg-teal-100/50' : 'bg-gray-50'
              }`}
              onClick={() => toggleExpand(expediente.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-teal-600 text-white' : 'bg-gray-400 text-white'
                }`}>
                  <LuFileText size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {expediente.nombre}
                    {index === 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full">
                        Obligatoria
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Creada: {new Date(expediente.fecha_creacion).toLocaleDateString('es-PE')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {index > 0 && (
                  <Button
                    variant="bordered"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLicencia(expediente.id);
                    }}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <LuTrash2 size={16} />
                  </Button>
                )}
                {expandedLicencias.has(expediente.id) ? (
                  <LuChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <LuChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>

            {/* Contenido expandible */}
            {expandedLicencias.has(expediente.id) && (
              <div className="p-6 space-y-6 border-t border-gray-200">
                {/* Documentos */}
                <div className="grid grid-cols-1 gap-4">
                  {DOCUMENTOS_EXPEDIENTE.map((doc) => (
                    <div key={doc.key} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {doc.label}
                          {doc.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                      <FileUpload
                        placeholder={`Cargar ${doc.label}`}
                        value={expediente.documentos[doc.key as keyof typeof expediente.documentos] || []}
                        onChange={(files) => handleDocumentoChange(expediente.id, doc.key, files)}
                        accept=".pdf,.jpg,.jpeg,.png,.dwg"
                        multiple
                        onUpload={onFileUpload}
                        documentKey={`antecedentes.${expediente.id}.${doc.key}`}
                        anteproyectoId={conformidadId}
                        uploadedFiles={uploadedDocuments
                          .filter(d => d.key?.includes(`${expediente.id}.${doc.key}`))
                          .map(d => ({ key: d.key || d.id, name: d.name, file_id: d.id }))}
                        onDownload={onDownloadDocument}
                      />
                    </div>
                  ))}
                </div>

                {/* Observaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Observaciones de la Licencia
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                    rows={3}
                    placeholder="Observaciones adicionales sobre esta licencia..."
                    value={expediente.observaciones || ''}
                    onChange={(e) => handleObservacionesChange(expediente.id, e.target.value)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón agregar licencia */}
      <div className="flex justify-center">
        <Button
          variant="bordered"
          onClick={handleAddLicencia}
          startContent={<LuPlus className="w-4 h-4" />}
          className="border-teal-500 text-teal-600 hover:bg-teal-50"
        >
          Agregar Nueva Licencia
        </Button>
      </div>

      {/* Error */}
      {errors.expedientes_licencias && (
        <p className="text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          {errors.expedientes_licencias}
        </p>
      )}
    </div>
  );
}
