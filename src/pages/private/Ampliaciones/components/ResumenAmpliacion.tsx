import { LuSave, LuUser, LuBuilding2, LuFileText, LuClipboardList } from 'react-icons/lu';
import { Button } from '@/components/ui';
import type { AmpliacionFormData, FormStep, UploadedDocument } from '@/types/ampliacion.types';

interface ResumenAmpliacionProps {
  formData: AmpliacionFormData;
  currentStep: number;
  steps: FormStep[];
  ampliacionId: string;
  onSave: () => void;
  isSaving: boolean;
  uploadedDocuments: UploadedDocument[];
}

export default function ResumenAmpliacion({
  formData,
  currentStep,
  steps,
  ampliacionId,
  onSave,
  isSaving,
  uploadedDocuments,
}: ResumenAmpliacionProps) {
  const getStepIcon = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <LuUser className="w-4 h-4" />;
      case 1:
        return <LuFileText className="w-4 h-4" />;
      case 2:
        return <LuBuilding2 className="w-4 h-4" />;
      case 3:
        return <LuFileText className="w-4 h-4" />;
      case 4:
        return <LuClipboardList className="w-4 h-4" />;
      default:
        return <LuFileText className="w-4 h-4" />;
    }
  };

  const getCompletionPercentage = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const getTotalDocuments = () => {
    return uploadedDocuments.length;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <LuBuilding2 className="w-5 h-5 text-teal-600" />
        <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
          Resumen del Proyecto
        </h3>
      </div>

      {/* Información básica */}
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Código del Trámite
          </p>
          <p className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            {ampliacionId === 'new' ? 'Se generará automáticamente' : ampliacionId}
          </p>
        </div>

        {formData.nombre_proyecto && (
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Nombre del Proyecto
            </p>
            <p className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.nombre_proyecto}
            </p>
          </div>
        )}

        {formData.selectedClient && (
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Administrado
            </p>
            <p className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.selectedClient.clientType === 'natural' 
                ? `${formData.selectedClient.names} ${formData.selectedClient.paternalSurname} ${formData.selectedClient.maternalSurname}`.trim()
                : formData.selectedClient.businessName}
            </p>
          </div>
        )}

        {formData.modalidad && (
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Modalidad
            </p>
            <p className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Modalidad {formData.modalidad}
            </p>
          </div>
        )}
      </div>

      {/* Progreso general */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Progreso General
          </p>
          <p className="text-sm font-semibold text-teal-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {getCompletionPercentage()}%
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Estado de los pasos */}
      <div className="space-y-3 mb-6">
        <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Estado de los Pasos
        </p>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${
              index === currentStep
                ? 'bg-teal-600 text-white'
                : step.completed
                ? 'bg-teal-100 text-teal-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {getStepIcon(index)}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${
                index === currentStep
                  ? 'font-semibold text-teal-600'
                  : step.completed
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {step.title}
              </p>
            </div>
            <div className="flex items-center">
              {step.completed ? (
                <div className="w-2 h-2 bg-teal-500 rounded-full" />
              ) : index === currentStep ? (
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              ) : (
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas de documentos */}
      <div className="border-t pt-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Documentos Adjuntos
          </p>
          <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            {getTotalDocuments()}
          </p>
        </div>
      </div>

      {/* Información adicional */}
      {formData.gestionado_por_fsr && (
        <div className="border-t pt-4 mb-6">
          <p className="text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Información Adicional
          </p>
          <div className="p-3 bg-teal-50 rounded-lg">
            <p className="text-sm text-teal-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              ✓ Proyecto anterior gestionado por FSR
            </p>
          </div>
        </div>
      )}

      {formData.es_condominio && (
        <div className="border-t pt-4 mb-6">
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              ⚠️ Proyecto sujeto a régimen de propiedad horizontal
            </p>
          </div>
        </div>
      )}

      {/* Botón de guardado */}
      <div className="border-t pt-4">
        <Button
          onClick={onSave}
          style={{ backgroundColor: 'var(--primary-color)' }}
          className="w-full text-white hover:opacity-90"
          startContent={<LuSave className="w-4 h-4" />}
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar Progreso'}
        </Button>
      </div>

      {/* Nota informativa */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          💡 Los cambios se guardan automáticamente al avanzar entre pasos. 
          Use este botón para guardar el progreso actual sin cambiar de paso.
        </p>
      </div>
    </div>
  );
}
