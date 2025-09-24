import { Button } from '@/components/ui';
import { LuSave, LuFileText, LuUser, LuCalendar, LuCheck, LuClock, LuMapPin } from 'react-icons/lu';
import type { RegularizacionFormData, FormStep, UploadedDocument } from '@/types/regularizacion.types';

interface ResumenRegularizacionProps {
  formData: RegularizacionFormData;
  currentStep: number;
  steps: FormStep[];
  regularizacionId: string;
  onSave: () => void;
  isSaving: boolean;
  uploadedDocuments: UploadedDocument[];
}

export default function ResumenRegularizacion({
  formData,
  currentStep,
  steps,
  regularizacionId,
  onSave,
  isSaving,
}: ResumenRegularizacionProps) {

  const isEdit = regularizacionId !== 'new';
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

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
    
    // Documentación Inicial
    count += formData.licenciaAnterior.length;
    count += formData.declaratoriaFabrica.length;
    count += formData.planosAntecedentes.length;
    count += formData.otros.length;
    
    // FUE Firmado
    count += formData.fueFirmado.length;
    
    // Gestión Municipal
    count += formData.cargoMunicipal.length;
    count += formData.actaObservacion.length;
    count += formData.docSubsanacion.length;
    count += formData.resolucionFinal.length;
    
    return count;
  };

  const getAdministradoName = () => {
    if (formData.selectedClient) {
      return formData.selectedClient.clientType === 'natural' 
        ? `${formData.selectedClient.names} ${formData.selectedClient.paternalSurname} ${formData.selectedClient.maternalSurname}`.trim()
        : formData.selectedClient.businessName || '';
    }
    return formData.fue_nombre || 'No seleccionado';
  };

  const stepLabels = [
    'Administrado',
    'Documentación Inicial',
    'Datos del Predio',
    'FUE Firmado',
    'Gestión Municipal'
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {isEdit ? 'Resumen del Expediente' : 'Nuevo Expediente'}
        </h3>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Regularización de Licencia
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
              {getAdministradoName()}
            </p>
          </div>
        </div>

        {formData.fue_ubicacion && (
          <div className="flex items-center gap-3">
            <LuMapPin className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Ubicación del Predio
              </p>
              <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.fue_ubicacion}
              </p>
            </div>
          </div>
        )}

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
                {stepLabels[index] || step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Información específica de Regularización */}
      {(formData.fechaCulminacion || formData.fue_modalidad || formData.fue_presupuesto) && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Detalles del Proceso
          </h4>
          
          <div className="space-y-2">
            {formData.fechaCulminacion && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Fecha culminación:
                </span>
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {new Date(formData.fechaCulminacion).toLocaleDateString('es-PE')}
                </span>
              </div>
            )}
            
            {formData.fue_modalidad && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Modalidad:
                </span>
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.fue_modalidad}
                </span>
              </div>
            )}
            
            {formData.fue_presupuesto && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Presupuesto:
                </span>
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  S/ {parseFloat(formData.fue_presupuesto).toLocaleString('es-PE')}
                </span>
              </div>
            )}
            
            {formData.fue_partida && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Partida registral:
                </span>
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.fue_partida}
                </span>
              </div>
            )}
          </div>
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
