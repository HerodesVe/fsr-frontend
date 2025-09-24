import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { ResumenRegularizacion } from './components';
import { StepAdministrado } from '@/components/utils/Steps';
import StepDocumentacionInicial from './StepRegularizacion/StepDocumentacionInicial';
import StepDatosPredio from './StepRegularizacion/StepDatosPredio';
import StepFueFirmado from './StepRegularizacion/StepFueFirmado';
import StepGestionMunicipal from './StepRegularizacion/StepGestionMunicipal';
import type { RegularizacionFormData, FormStep, UploadedDocument } from '@/types/regularizacion.types';

const stepLabels = [
  'Administrado',
  'Documentación Inicial', 
  'Datos del Predio',
  'FUE Firmado',
  'Gestión Municipal'
];

export default function CreateEditRegularizacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const { clients, isLoading: clientsLoading } = useClients();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  
  // Estado para manejar los pasos del formulario
  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Documentación Inicial', completed: false },
    { id: 3, title: 'Datos del Predio', completed: false },
    { id: 4, title: 'FUE Firmado', completed: false },
    { id: 5, title: 'Gestión Municipal', completed: false },
  ]);
  
  const [formData, setFormData] = useState<RegularizacionFormData>({
    // Paso 1: Administrado
    selectedClient: null,
    administrado: '',
    fue_nombre: '',
    fue_dni: '',
    fue_domicilio: '',
    fue_telefono: '',

    // Paso 2: Documentación Inicial
    fechaCulminacion: '',
    licenciaAnterior: [],
    declaratoriaFabrica: [],
    planosAntecedentes: [],
    otros: [],

    // Paso 3: Datos del Predio
    fue_ubicacion: '',
    fue_partida: '',
    fue_modalidad: '',
    fue_presupuesto: '',

    // Paso 4: FUE Firmado
    fueFirmado: [],

    // Paso 5: Gestión Municipal
    cargoMunicipal: [],
    actaObservacion: [],
    docSubsanacion: [],
    resolucionFinal: [],
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Regularización de Licencia' : 'Nueva Regularización de Licencia',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = (field: keyof RegularizacionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Ocultar mensaje de validación general si está visible
    if (showValidationError) {
      setShowValidationError(false);
    }
  };

  const handleFileUpload = async (file: File, documentKey: string) => {
    // Simular upload
    const uploadedDoc: UploadedDocument = {
      key: documentKey,
      name: file.name,
      file_id: Date.now().toString(),
    };
    
    setUploadedDocuments(prev => [...prev, uploadedDoc]);
    return uploadedDoc;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Administrado
        if (!formData.selectedClient && !formData.fue_nombre) {
          newErrors.selectedClient = 'Debe seleccionar un administrado o crear uno nuevo';
        }
        if (!formData.selectedClient) {
          if (!formData.fue_nombre) {
            newErrors.fue_nombre = 'El nombre es requerido';
          }
          if (!formData.fue_dni) {
            newErrors.fue_dni = 'El DNI/RUC es requerido';
          }
          if (!formData.fue_domicilio) {
            newErrors.fue_domicilio = 'El domicilio es requerido';
          }
        }
        break;
      case 1: // Documentación Inicial
        if (!formData.fechaCulminacion) {
          newErrors.fechaCulminacion = 'La fecha de culminación es requerida';
        }
        break;
      case 2: // Datos del Predio
        if (!formData.fue_ubicacion) {
          newErrors.fue_ubicacion = 'La ubicación del predio es requerida';
        }
        if (!formData.fue_partida) {
          newErrors.fue_partida = 'La partida registral es requerida';
        }
        if (!formData.fue_modalidad) {
          newErrors.fue_modalidad = 'La modalidad de licencia es requerida';
        }
        if (!formData.fue_presupuesto) {
          newErrors.fue_presupuesto = 'El presupuesto de obra es requerido';
        }
        break;
      case 3: // FUE Firmado
        if (!formData.fueFirmado || formData.fueFirmado.length === 0) {
          newErrors.fueFirmado = 'El FUE firmado es requerido';
        }
        break;
      case 4: // Gestión Municipal
        // Validaciones opcionales para gestión municipal
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      // Mostrar mensaje de error de validación
      setShowValidationError(true);
      // Scroll hacia arriba para mostrar los errores
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => setShowValidationError(false), 5000);
      return;
    }

    // Ocultar mensaje de error si está visible
    setShowValidationError(false);

    // Marcar paso como completado y avanzar
    setSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === currentStep ? { ...step, completed: true } : step
      )
    );
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Permitir navegación hacia atrás a cualquier paso
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
    // Permitir navegación hacia adelante solo a pasos completados o al siguiente paso inmediato
    else if (steps[stepIndex].completed || stepIndex === currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Regularización guardada:', formData);
      navigate('/dashboard/regularizaciones');
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepAdministrado
            formData={formData}
            clients={clients}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof RegularizacionFormData, value)}
            title="Paso 1: Datos del Administrado"
            description="Seleccione o ingrese la información del cliente (administrado) para este trámite de regularización."
            showCreateButton={true}
          />
        );
      case 1:
        return (
          <StepDocumentacionInicial
            formData={formData}
            regularizacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 2:
        return (
          <StepDatosPredio
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <StepFueFirmado
            formData={formData}
            regularizacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 4:
        return (
          <StepGestionMunicipal
            formData={formData}
            regularizacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      default:
        return null;
    }
  };

  if (clientsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Indicadores de pasos */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    index === currentStep
                      ? 'bg-teal-600 text-white'
                      : step.completed
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                      : index > currentStep && index !== currentStep + 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  disabled={index > currentStep && !step.completed && index !== currentStep + 1}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>

          {/* Mensaje de error de validación */}
          {showValidationError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <LuInfo className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="text-sm font-medium text-red-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Por favor, complete los campos obligatorios
                  </h4>
                  <p className="text-sm text-red-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Revise los campos marcados con error antes de continuar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contenido del paso */}
          <div className="mb-6">
            {renderStepContent()}
          </div>

          {/* Navegación entre pasos */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              {currentStep > 0 && (
                <Button
                  variant="bordered"
                  onClick={handlePrevious}
                  startContent={<LuArrowLeft className="w-4 h-4" />}
                >
                  Anterior: {stepLabels[currentStep - 1]}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="bordered"
                onClick={() => navigate('/dashboard/regularizaciones')}
                startContent={<LuX className="w-4 h-4" />}
              >
                Cancelar
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className="text-white hover:opacity-90"
                  endContent={<LuArrowRight className="w-4 h-4" />}
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : `Siguiente: ${stepLabels[currentStep + 1]}`}
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className="text-white hover:opacity-90"
                  disabled={isSaving}
                >
                  {isSaving ? 'Finalizando...' : 'Finalizar Proceso'}
                </Button>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <ResumenRegularizacion
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            regularizacionId={id || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
