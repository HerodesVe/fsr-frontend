import { LuFileText, LuUser, LuMapPin, LuBuilding, LuCheck } from 'react-icons/lu';
import { Button } from '@/components/ui';
import type { ElaboracionSinVariacionFormData, FormStep, UploadedDocument } from '@/types/conformidad.types';

interface ResumenElaboracionSinVariacionProps {
  formData: ElaboracionSinVariacionFormData;
  currentStep: number;
  steps: FormStep[];
  elaboracionId: string;
  onSave: () => void;
  isSaving: boolean;
  uploadedDocuments: UploadedDocument[];
}

export default function ResumenElaboracionSinVariacion({
  formData,
  currentStep,
  steps,
  elaboracionId,
  onSave,
  isSaving,
  uploadedDocuments
}: ResumenElaboracionSinVariacionProps) {
  
  const completedSteps = steps.filter(s => s.completed).length;
  const progressPercentage = Math.round((completedSteps / steps.length) * 100);
  const documentCount = uploadedDocuments.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        Resumen de Elaboración
      </h3>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Progreso
          </span>
          <span className="text-sm font-medium text-teal-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          {completedSteps} de {steps.length} pasos completados
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <LuUser className="w-4 h-4 text-teal-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Administrado
            </p>
            <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.selectedClient 
                ? (formData.selectedClient.clientType === 'natural'
                    ? `${formData.selectedClient.names} ${formData.selectedClient.paternalSurname}`
                    : formData.selectedClient.businessName)
                : 'No seleccionado'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <LuBuilding className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Proyecto
            </p>
            <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.nombre_proyecto || 'Sin nombre'}
            </p>
          </div>
        </div>

        {formData.predio.districtId && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <LuMapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                Ubicación
              </p>
              <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.predio.urbanization || 'Sin especificar'}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <LuFileText className="w-4 h-4 text-orange-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos
            </p>
            <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              {documentCount} archivo(s) cargado(s)
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Pasos del Trámite
        </h4>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center gap-2 text-sm ${
                index === currentStep 
                  ? 'text-teal-600 font-medium' 
                  : step.completed 
                  ? 'text-gray-500' 
                  : 'text-gray-400'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                index === currentStep 
                  ? 'bg-teal-600 text-white' 
                  : step.completed 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step.completed ? <LuCheck className="w-3 h-3" /> : index + 1}
              </div>
              <span className="truncate">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {elaboracionId && elaboracionId !== 'new' && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            Código del Trámite
          </p>
          <p className="text-sm font-mono text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            {elaboracionId}
          </p>
        </div>
      )}

      <Button
        onClick={onSave}
        style={{ backgroundColor: 'var(--primary-color)' }}
        className="w-full text-white hover:opacity-90"
        disabled={isSaving}
      >
        {isSaving ? 'Guardando...' : 'Guardar Progreso'}
      </Button>
    </div>
  );
}
