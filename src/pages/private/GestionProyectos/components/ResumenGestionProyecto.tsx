import { LuFileText, LuSave, LuCheck, LuClock, LuX } from 'react-icons/lu';
import { Button } from '@/components/ui';
import type { GestionProyectoFormData, FormStep } from '@/types/gestionProyecto.types';

interface ResumenGestionProyectoProps {
  formData: GestionProyectoFormData;
  currentStep: number;
  steps: FormStep[];
  gestionId: string;
  onSave: () => void;
  isSaving: boolean;
  uploadedDocuments: any[];
}

export function ResumenGestionProyecto({
  formData,
  currentStep,
  steps,
  gestionId,
  onSave,
  isSaving,
  uploadedDocuments
}: ResumenGestionProyectoProps) {
  const calculateProgress = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const progress = calculateProgress();

  // Calcular progreso de especialidades
  const especialidades = [
    { key: 'arquitectura', nombre: 'Arquitectura' },
    { key: 'estructuras', nombre: 'Estructuras' },
    { key: 'electricas', nombre: 'Eléctricas' },
    { key: 'sanitarias', nombre: 'Sanitarias' }
  ];

  const especialidadesConformes = especialidades.filter(esp => 
    formData.especialidades[esp.key as keyof typeof formData.especialidades]?.es_conforme
  ).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Resumen de Gestión
          </h3>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {gestionId === 'new' ? 'Nueva gestión de proyecto' : `Gestión ${gestionId}`}
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Progreso General
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

        {/* Proyecto Info */}
        {formData.selectedProyecto && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Proyecto Seleccionado
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LuFileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.selectedProyecto.titulo || 'Proyecto seleccionado'}
                </span>
              </div>
              {formData.selectedProyecto.codigo && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 ml-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Código: {formData.selectedProyecto.codigo}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progreso de Especialidades */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Especialidades ({especialidadesConformes}/4 Aprobadas)
          </h4>
          <div className="space-y-2">
            {especialidades.map((esp) => {
              const data = formData.especialidades[esp.key as keyof typeof formData.especialidades];
              return (
                <div
                  key={esp.key}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    data?.es_conforme
                      ? 'bg-green-50 text-green-700'
                      : data?.resultado_acta === 'no_conforme'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {data?.es_conforme ? (
                      <LuCheck className="w-4 h-4" />
                    ) : data?.resultado_acta === 'no_conforme' ? (
                      <LuX className="w-4 h-4" />
                    ) : (
                      <LuClock className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {esp.nombre}
                    </span>
                  </div>
                  {data?.revision_count > 0 && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Rev. {data.revision_count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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

        {/* Alertas importantes */}
        {especialidades.some(esp => {
          const data = formData.especialidades[esp.key as keyof typeof formData.especialidades];
          return data?.revision_count >= 2;
        }) && (
          <div className="border-t border-gray-200 pt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-yellow-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Atención Requerida
              </h4>
              <p className="text-xs text-yellow-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Algunas especialidades requieren pago adicional por múltiples revisiones.
              </p>
            </div>
          </div>
        )}

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

        {/* Estado final */}
        {especialidadesConformes === 4 && formData.licencia_final && formData.cargo_entrega_administrado && (
          <div className="border-t border-gray-200 pt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <LuCheck className="w-4 h-4 text-green-600" />
                <h4 className="text-sm font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Gestión Completa
                </h4>
              </div>
              <p className="text-xs text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Todas las especialidades aprobadas y licencia emitida.
              </p>
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
