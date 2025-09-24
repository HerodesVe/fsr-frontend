import { LuUser, LuFileText, LuCalendar, LuSave, LuCheck, LuClock } from 'react-icons/lu';
import { Button } from '@/components/ui';
import type { ModificacionFormData, FormStep, UploadedDocument } from '@/types/modificacion.types';

interface ResumenModificacionProps {
  formData: ModificacionFormData;
  currentStep: number;
  steps: FormStep[];
  modificacionId: string;
  onSave: () => void;
  isSaving: boolean;
  uploadedDocuments: UploadedDocument[];
}

export default function ResumenModificacion({
  formData,
  currentStep,
  steps,
  modificacionId,
  onSave,
  isSaving,
  uploadedDocuments,
}: ResumenModificacionProps) {
  const isEdit = modificacionId !== 'new';

  const getStepIcon = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <LuUser className="w-4 h-4" />;
      case 1:
        return <LuFileText className="w-4 h-4" />;
      case 2:
        return <LuFileText className="w-4 h-4" />;
      case 3:
        return <LuFileText className="w-4 h-4" />;
      case 4:
        return <LuFileText className="w-4 h-4" />;
      default:
        return <LuFileText className="w-4 h-4" />;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return steps[stepIndex]?.completed ? 'completed' : 'incomplete';
    } else if (stepIndex === currentStep) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-teal-600 bg-teal-100';
      case 'incomplete':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-400 bg-gray-100';
    }
  };

  const calculateProgress = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {isEdit ? 'Editar Modificación' : 'Nueva Modificación'}
        </h3>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Progreso del trámite
        </p>
      </div>

      {/* Información del administrado */}
      {formData.selectedClient && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <LuUser className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Administrado
            </span>
          </div>
          <p className="text-sm text-gray-900 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            {formData.selectedClient.clientType === 'natural'
              ? `${formData.selectedClient.names} ${formData.selectedClient.paternalSurname} ${formData.selectedClient.maternalSurname}`.trim()
              : formData.selectedClient.businessName}
          </p>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            {formData.selectedClient.clientType === 'natural'
              ? `${formData.selectedClient.docType}: ${formData.selectedClient.docNumber}`
              : `RUC: ${formData.selectedClient.ruc}`}
          </p>
        </div>
      )}

      {/* Información del proyecto */}
      {formData.tipo_licencia_edificacion && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <LuFileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Proyecto
            </span>
          </div>
          <p className="text-sm text-gray-900 font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {formData.tipo_licencia_edificacion}
          </p>
          {formData.tipo_modalidad && (
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Modalidad: {formData.tipo_modalidad}
            </p>
          )}
        </div>
      )}

      {/* Progreso de pasos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Progreso
          </span>
          <span className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            {calculateProgress()}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const statusColor = getStepStatusColor(status);
            
            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusColor}`}>
                  {status === 'completed' ? (
                    <LuCheck className="w-4 h-4" />
                  ) : status === 'current' ? (
                    <LuClock className="w-4 h-4" />
                  ) : (
                    getStepIcon(index)
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    status === 'current' ? 'text-teal-700' : 
                    status === 'completed' ? 'text-green-700' : 
                    'text-gray-500'
                  }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Información de fechas */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <LuCalendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Información del Trámite
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            <strong>ID:</strong> {isEdit ? modificacionId : 'Nuevo'}
          </p>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            <strong>Creado:</strong> {new Date().toLocaleDateString('es-ES')}
          </p>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            <strong>Documentos:</strong> {uploadedDocuments.length}
          </p>
        </div>
      </div>

      {/* Botón de guardado */}
      <Button
        onClick={onSave}
        disabled={isSaving}
        style={{ backgroundColor: 'var(--primary-color)' }}
        className="w-full text-white hover:opacity-90"
        startContent={<LuSave className="w-4 h-4" />}
      >
        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </div>
  );
}
