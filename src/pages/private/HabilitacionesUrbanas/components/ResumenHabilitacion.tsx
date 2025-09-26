import React from 'react';
import { LuCheck, LuClock, LuSave } from 'react-icons/lu';
import { Button } from '@/components/ui';
import type { HabilitacionUrbanaFormData, FormStep, UploadedDocument } from '@/types/habilitacionUrbana.types';

interface ResumenHabilitacionProps {
  formData: HabilitacionUrbanaFormData;
  currentStep: number;
  steps: FormStep[];
  habilitacionId?: string;
  onSave?: () => void;
  isSaving?: boolean;
  uploadedDocuments?: UploadedDocument[];
}

export const ResumenHabilitacion: React.FC<ResumenHabilitacionProps> = ({
  formData,
  currentStep,
  steps,
  habilitacionId,
  onSave,
  isSaving = false,
  uploadedDocuments = [],
}) => {
  // Calcular progreso basado en pasos completados
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = Math.round((completedSteps / steps.length) * 100);

  // Función helper para verificar si un documento está completado
  const isDocumentCompleted = (documentKey: string, formDataField?: File[]) => {
    // Verificar si hay archivos en formData (archivos locales/nuevos)
    const hasLocalFiles = formDataField && formDataField.length > 0;
    
    // Verificar si hay documentos subidos en el backend
    const hasUploadedFiles = uploadedDocuments.some(doc => doc.key === documentKey);
    
    return hasLocalFiles || hasUploadedFiles;
  };

  // Documentos obligatorios con su estado
  const documentosObligatorios = [
    { 
      name: 'Ficha de Registros Públicos del terreno rústico', 
      completed: isDocumentCompleted('ficha_registros_publicos', formData.ficha_registros_publicos) 
    },
    { 
      name: 'Levantamiento Topográfico', 
      completed: isDocumentCompleted('levantamiento_topografico', formData.levantamiento_topografico) 
    },
    { 
      name: 'Estudio de Mecánica de Suelos', 
      completed: isDocumentCompleted('estudio_mecanica_suelos', formData.estudio_mecanica_suelos) 
    },
    { 
      name: 'Planos Técnicos del Proyecto', 
      completed: isDocumentCompleted('planos_tecnicos_proyecto', formData.planos_tecnicos_proyecto) 
    },
    { 
      name: 'Formulario Único (FUHU)', 
      completed: isDocumentCompleted('formulario_unico_fuhu', formData.formulario_unico_fuhu) 
    },
    { 
      name: 'Certificado de Zonificación y Vías', 
      completed: isDocumentCompleted('certificado_zonificacion_vias', formData.certificado_zonificacion_vias) 
    },
    { 
      name: 'Factibilidad de Servicios Eléctricos', 
      completed: isDocumentCompleted('factibilidad_servicios_electricos', formData.factibilidad_servicios_electricos) 
    },
    { 
      name: 'Factibilidad de Agua y Desagüe', 
      completed: isDocumentCompleted('factibilidad_agua_desague', formData.factibilidad_agua_desague) 
    },
  ];

  // Calcular plazos estimados
  const plazoMinimo = 45;
  const plazoMaximo = 90;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          Resumen del Proyecto
        </h3>
        {habilitacionId && (
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            N°: {habilitacionId}
          </p>
        )}
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Habilitación Urbana
        </p>
      </div>

      {/* Progreso del Proyecto */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Progreso del Proyecto
          </h4>
          <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          Completado
        </p>
      </div>

      {/* Secciones */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Secciones
        </h4>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.completed 
                    ? 'bg-teal-600 text-white' 
                    : index === currentStep 
                    ? 'bg-teal-100 text-teal-600 border-2 border-teal-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {step.completed ? <LuCheck className="w-3 h-3" /> : step.id}
                </div>
                <span className={`text-sm ${
                  index === currentStep ? 'font-medium text-gray-900' : 'text-gray-700'
                }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {step.title}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {step.completed ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completado
                  </span>
                ) : index === currentStep ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    En progreso
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Pendiente
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentos Obligatorios */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos Obligatorios
        </h4>
        <div className="space-y-2">
          {documentosObligatorios.map((doc, index) => (
            <div key={index} className="flex items-start gap-2 py-1">
              <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                doc.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {doc.completed ? (
                  <LuCheck className="w-2.5 h-2.5 text-white" />
                ) : (
                  <LuClock className="w-2.5 h-2.5 text-gray-500" />
                )}
              </div>
              <span className={`text-xs ${
                doc.completed ? 'text-gray-900' : 'text-gray-600'
              }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {doc.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Información del Proyecto */}
      {(formData.tipo_habilitacion || formData.uso_habilitacion) && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Información del Proyecto
          </h4>
          <div className="space-y-2">
            {formData.tipo_habilitacion && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <span className="text-xs text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Tipo: {formData.tipo_habilitacion}
                </span>
              </div>
            )}
            {formData.uso_habilitacion && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Uso: {formData.uso_habilitacion}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plazo de Elaboración */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Plazo Estimado
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Mínimo: {plazoMinimo} días
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <span className="text-xs text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Máximo: {plazoMaximo} días
            </span>
          </div>
        </div>
      </div>

      {/* Botón Guardar Proyecto */}
      <div className="pt-4 border-t border-gray-100">
        <Button
          onClick={onSave}
          disabled={isSaving}
          style={{ backgroundColor: 'var(--primary-color)' }}
          className="w-full text-white hover:opacity-90 disabled:opacity-50"
          startContent={<LuSave className="w-4 h-4" />}
        >
          {isSaving ? 'Guardando...' : 'Guardar Proyecto'}
        </Button>
      </div>
    </div>
  );
};

export default ResumenHabilitacion;
