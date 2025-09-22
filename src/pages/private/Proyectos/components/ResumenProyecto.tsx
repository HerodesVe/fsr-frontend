import { Button } from '@/components/ui';
import type { ProyectoFormData, FormStep, UploadedDocument } from '@/types/proyecto.types';

interface ResumenProyectoProps {
  formData: ProyectoFormData;
  currentStep: number;
  steps: FormStep[];
  proyectoId: string;
  onSave: () => void;
  isSaving: boolean;
  uploadedDocuments: UploadedDocument[];
}

export function ResumenProyecto({
  formData,
  currentStep,
  steps,
  proyectoId,
  onSave,
  isSaving,
  uploadedDocuments,
}: ResumenProyectoProps) {
  const calculateProgress = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const progress = calculateProgress();

  const getStepStatus = (stepIndex: number) => {
    if (steps[stepIndex]?.completed) {
      return 'Completada';
    } else if (stepIndex === currentStep) {
      return 'En progreso';
    } else {
      return 'Pendiente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada':
        return 'text-green-600';
      case 'En progreso':
        return 'text-blue-600';
      case 'Pendiente':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const stepLabels = [
    'Anteproyecto',
    'Estructura',
    'Sanitarias',
    'Eléctricas',
    'Mecánicas',
    'Gas',
    'Paneles Solares',
    'Sustento Técnico',
    'Expediente',
    'Actas',
    'Licencia'
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Resumen del Proceso
          </h3>
        </div>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Pasos para crear un proyecto.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Completado
          </span>
          <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4 mb-6">
        <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
          Secciones
        </h4>
        
        <div className="space-y-3">
          {stepLabels.map((label, index) => {
            const status = index < steps.length ? getStepStatus(index) : 'Pendiente';
            const isActive = index === currentStep;
            
            return (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isActive ? 'border-teal-200 bg-teal-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                    status === 'Completada' ? 'bg-green-100 text-green-600' :
                    status === 'En progreso' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {getStepIcon(label)}
                  </div>
                  <span 
                    className={`text-sm font-medium ${isActive ? 'text-teal-900' : 'text-gray-700'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {label}
                  </span>
                </div>
                <span 
                  className={`text-xs font-medium ${getStatusColor(status)}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={onSave}
        disabled={isSaving}
        style={{ backgroundColor: 'var(--primary-color)' }}
        className="w-full text-white hover:opacity-90 disabled:opacity-50"
        startContent={
          <span className="text-white text-sm">💾</span>
        }
      >
        {isSaving ? 'Guardando...' : 'Guardar Proyecto'}
      </Button>

      <Button
        variant="bordered"
        className="w-full mt-3"
        startContent={<span className="text-red-500">✕</span>}
      >
        Cancelar
      </Button>

      {/* Project Info */}
      {(formData.titulo_proyecto || formData.selectedAnteproyecto?.nombre_proyecto) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Información del Proyecto
          </h5>
          <div className="text-xs text-gray-600 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p>
              <span className="font-medium">Título:</span>{' '}
              {formData.titulo_proyecto || formData.selectedAnteproyecto?.nombre_proyecto}
            </p>
            {formData.selectedAnteproyecto && (
              <p>
                <span className="font-medium">Anteproyecto:</span>{' '}
                {formData.selectedAnteproyecto.id}
              </p>
            )}
            <p>
              <span className="font-medium">ID:</span> {proyectoId || 'Nuevo'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getStepIcon(label: string): string {
  const iconMap: { [key: string]: string } = {
    'Anteproyecto': '📋',
    'Estructura': '🏗️',
    'Sanitarias': '🚿',
    'Eléctricas': '⚡',
    'Mecánicas': '⚙️',
    'Gas': '🔥',
    'Paneles Solares': '☀️',
    'Sustento Técnico': '⚖️',
    'Expediente': '📁',
    'Actas': '📝',
    'Licencia': '📜'
  };
  return iconMap[label] || '📄';
}

