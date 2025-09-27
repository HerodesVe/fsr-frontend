import { LuFileText, LuCalendar, LuSave, LuCheck, LuClock } from 'react-icons/lu';
import { Button } from '@/components/ui';
import type { GestionAnteproyectoFormData, FormStep } from '@/types/gestionAnteproyecto.types';

interface ResumenGestionAnteproyectoProps {
  formData: GestionAnteproyectoFormData;
  currentStep: number;
  steps: FormStep[];
  gestionId: string;
  onSave: () => void;
  isSaving: boolean;
  uploadedDocuments: any[];
}

export function ResumenGestionAnteproyecto({
  formData,
  currentStep,
  steps,
  gestionId,
  onSave,
  isSaving,
  uploadedDocuments
}: ResumenGestionAnteproyectoProps) {
  const calculateProgress = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Resumen de Gestión
          </h3>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {gestionId === 'new' ? 'Nueva gestión de anteproyecto' : `Gestión ${gestionId}`}
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Progreso
            </span>
            <span className="text-sm font-medium text-teal-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Anteproyecto Info */}
        {formData.selectedAnteproyecto && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Anteproyecto Seleccionado
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LuFileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.selectedAnteproyecto.nombre || 'Anteproyecto seleccionado'}
                </span>
              </div>
              {formData.selectedAnteproyecto.codigo && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 ml-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Código: {formData.selectedAnteproyecto.codigo}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Datos del Trámite */}
        {(formData.fecha_ingreso || formData.numero_expediente) && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Datos del Trámite
            </h4>
            <div className="space-y-2">
              {formData.fecha_ingreso && (
                <div className="flex items-center gap-2">
                  <LuCalendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Ingreso: {formData.fecha_ingreso}
                  </span>
                </div>
              )}
              {formData.numero_expediente && (
                <div className="flex items-center gap-2">
                  <LuFileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Exp. {formData.numero_expediente}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado de la Respuesta */}
        {formData.resultado_acta && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Estado de la Respuesta
            </h4>
            <div className={`flex items-center gap-2 p-2 rounded-md ${
              formData.resultado_acta === 'conforme' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-yellow-50 text-yellow-700'
            }`}>
              {formData.resultado_acta === 'conforme' ? (
                <LuCheck className="w-4 h-4" />
              ) : (
                <LuClock className="w-4 h-4" />
              )}
              <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.resultado_acta === 'conforme' ? 'Conforme' : 'Requiere Subsanación'}
              </span>
            </div>
          </div>
        )}

        {/* Steps Status */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Estado de Pasos
          </h4>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 p-2 rounded-md ${
                  index === currentStep
                    ? 'bg-teal-50 text-teal-700'
                    : step.completed
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-50 text-gray-500'
                }`}
              >
                {step.completed ? (
                  <LuCheck className="w-4 h-4" />
                ) : index === currentStep ? (
                  <LuClock className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-current" />
                )}
                <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Documentos Cargados */}
        {uploadedDocuments.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos Cargados
            </h4>
            <div className="space-y-1">
              {uploadedDocuments.slice(0, 3).map((doc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <LuFileText className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {doc.name}
                  </span>
                </div>
              ))}
              {uploadedDocuments.length > 3 && (
                <p className="text-xs text-gray-500 ml-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  +{uploadedDocuments.length - 3} más
                </p>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="border-t border-gray-200 pt-4">
          <Button
            onClick={onSave}
            disabled={isSaving}
            style={{ backgroundColor: 'var(--primary-color)' }}
            className="w-full text-white hover:opacity-90"
            startContent={<LuSave className="w-4 h-4" />}
          >
            {isSaving ? 'Guardando...' : 'Guardar Gestión'}
          </Button>
        </div>
      </div>
    </div>
  );
}
