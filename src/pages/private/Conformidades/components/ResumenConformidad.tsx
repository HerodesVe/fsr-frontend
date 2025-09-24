import { Button } from '@/components/ui';
import { LuSave, LuFileText, LuUser, LuCalendar, LuCheck, LuClock } from 'react-icons/lu';
import type { ConformidadFormData, FormStep, UploadedDocument } from '@/types/conformidad.types';

interface ResumenConformidadProps {
  formData: ConformidadFormData;
  currentStep: number;
  steps: FormStep[];
  conformidadId: string;
  onSave: () => void;
  isSaving: boolean;
  uploadedDocuments: UploadedDocument[];
}

export default function ResumenConformidad({
  formData,
  currentStep,
  steps,
  conformidadId,
  onSave,
  isSaving,
}: ResumenConformidadProps) {

  const isEdit = conformidadId !== 'new';
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const getModalidadLabel = (modalidad: string) => {
    switch (modalidad) {
      case 'sin_variaciones':
        return 'Sin Variaciones';
      case 'con_variaciones':
        return 'Con Variaciones';
      case 'casco_habitable':
        return 'En Casco Habitable';
      default:
        return 'No seleccionada';
    }
  };

  const getStepIcon = (stepIndex: number, completed: boolean) => {
    if (stepIndex === currentStep) {
      return <LuClock className="w-4 h-4 text-teal-600" />;
    } else if (completed) {
      return <LuCheck className="w-4 h-4 text-green-600" />;
    } else {
      return <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>;
    }
  };

  const countDocuments = () => {
    let count = 0;
    
    // Contar documentos según la modalidad
    if (formData.modalidad === 'sin_variaciones') {
      count += formData.licencia_obra_sv.length;
      count += formData.planos_aprobados_sv.length;
    } else if (formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') {
      if (!formData.servicios_previos_fsr) {
        count += formData.licencia_obra_cv.length;
        count += formData.planos_aprobados_licencia_cv.length;
        count += formData.planos_digitales_cad_cv.length;
      }
      count += formData.expedientes_anteriores.length;
      count += formData.fue_conformidad.length;
      count += formData.planos_conformidad.length;
      count += formData.memoria_descriptiva.length;
      count += formData.cuaderno_obra.length;
      count += formData.protocolos.length;
      count += formData.declaraciones_juradas.length;
      count += formData.sustentos_tecnicos.length;
    }
    
    return count;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {isEdit ? 'Resumen del Expediente' : 'Nuevo Expediente'}
        </h3>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Conformidad de Obra
        </p>
      </div>

      {/* Progreso */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Progreso
          </span>
          <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {completedSteps}/{totalSteps} pasos
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          {progress}% completado
        </p>
      </div>

      {/* Información General */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <LuUser className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Administrado
            </p>
            <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.selectedClient?.name || 'No seleccionado'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LuFileText className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Modalidad
            </p>
            <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {getModalidadLabel(formData.modalidad)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LuCalendar className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Fecha de Creación
            </p>
            <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {new Date().toLocaleDateString('es-PE')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LuFileText className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos
            </p>
            <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {countDocuments()} archivos adjuntos
            </p>
          </div>
        </div>
      </div>

      {/* Estado de los pasos */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Estado de los Pasos
        </h4>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              {getStepIcon(index, step.completed)}
              <span
                className={`text-sm ${
                  index === currentStep
                    ? 'text-teal-600 font-medium'
                    : step.completed
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Información específica según modalidad */}
      {formData.modalidad && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Detalles Específicos
          </h4>
          
          {formData.modalidad === 'sin_variaciones' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Verificación en campo:
                </span>
                <span className={`text-sm font-medium ${
                  formData.verificacion_campo_sv ? 'text-green-600' : 'text-gray-500'
                }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.verificacion_campo_sv ? 'Realizada' : 'Pendiente'}
                </span>
              </div>
              {formData.verificacion_campo_sv && formData.fecha_verificacion_sv && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Fecha verificación:
                  </span>
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {new Date(formData.fecha_verificacion_sv).toLocaleDateString('es-PE')}
                  </span>
                </div>
              )}
            </div>
          )}

          {(formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Servicios previos FSR:
                </span>
                <span className={`text-sm font-medium ${
                  formData.servicios_previos_fsr ? 'text-green-600' : 'text-gray-500'
                }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.servicios_previos_fsr ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Primer expediente:
                </span>
                <span className={`text-sm font-medium ${
                  formData.primer_expediente ? 'text-green-600' : 'text-amber-600'
                }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.primer_expediente ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón de guardado */}
      <div className="border-t border-gray-200 pt-4">
        <Button
          onClick={onSave}
          style={{ backgroundColor: 'var(--primary-color)' }}
          className="w-full text-white hover:opacity-90"
          startContent={<LuSave className="w-4 h-4" />}
          disabled={isSaving || completedSteps === 0}
        >
          {isSaving ? 'Guardando...' : isEdit ? 'Actualizar Expediente' : 'Guardar Expediente'}
        </Button>
        
        {completedSteps === 0 && (
          <p className="text-xs text-gray-500 text-center mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Complete al menos un paso para guardar
          </p>
        )}
      </div>
    </div>
  );
}
