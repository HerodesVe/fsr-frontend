import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { ResumenGestionAnexo } from './components';
import { StepAdministrado } from '@/components/utils/Steps';
import StepDocumentacion from './StepGestionAnexo/StepDocumentacion';
import StepPresentacion from './StepGestionAnexo/StepPresentacion';
import StepCierre from './StepGestionAnexo/StepCierre';
import type { GestionAnexoFormData, FormStep, UploadedDocument } from '@/types/gestionAnexo.types';

const stepLabels = [
  'Administrado',
  'Documentación',
  'Presentación',
  'Cierre'
];

export default function CreateEditGestionAnexo() {
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
    { id: 2, title: 'Documentación', completed: false },
    { id: 3, title: 'Presentación', completed: false },
    { id: 4, title: 'Cierre', completed: false },
  ]);
  
  const [formData, setFormData] = useState<GestionAnexoFormData>({
    // Paso 1: Administrado
    selectedClient: null,

    // Paso 2: Documentación del Administrado
    anexo_h_formato: [],
    contrato_supervisor: [],
    poliza_car: [],
    resolucion_licencia_obra: [],
    cronograma_visitas: [],
    cronograma_obra: [],
    otros_documentos: [],
    fecha_inicio_ejecucion: '',
    comentarios_documentacion: '',

    // Paso 3: Presentación en Municipalidad
    hoja_tramite_cargo: [],
    fecha_ingreso_municipalidad: '',

    // Paso 4: Cierre y Entrega
    cargo_entrega_administrado: [],
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Gestión del Anexo H' : 'Nueva Gestión del Anexo H',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = (field: keyof GestionAnexoFormData, value: any) => {
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

  const handleFileUpload = async (file: File) => {
    // Simular upload
    const uploadedDoc: UploadedDocument = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
    };
    
    setUploadedDocuments(prev => [...prev, uploadedDoc]);
    return uploadedDoc;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Administrado
        if (!formData.selectedClient) {
          newErrors.selectedClient = 'Debe seleccionar un administrado';
        }
        break;
      case 1: // Documentación
        // Validar documentos obligatorios
        if (!formData.anexo_h_formato || formData.anexo_h_formato.length === 0) {
          newErrors.anexo_h_formato = 'El Anexo H (Formato) es requerido';
        }
        if (!formData.contrato_supervisor || formData.contrato_supervisor.length === 0) {
          newErrors.contrato_supervisor = 'El Contrato Supervisor o Convenio de Visitas es requerido';
        }
        if (!formData.poliza_car || formData.poliza_car.length === 0) {
          newErrors.poliza_car = 'La Póliza CAR es requerida';
        }
        if (!formData.resolucion_licencia_obra || formData.resolucion_licencia_obra.length === 0) {
          newErrors.resolucion_licencia_obra = 'La Resolución de Licencia de Obra es requerida';
        }
        if (!formData.cronograma_visitas || formData.cronograma_visitas.length === 0) {
          newErrors.cronograma_visitas = 'El Cronograma de Visitas es requerido';
        }
        if (!formData.cronograma_obra || formData.cronograma_obra.length === 0) {
          newErrors.cronograma_obra = 'El Cronograma de Obra es requerido';
        }
        if (!formData.fecha_inicio_ejecucion) {
          newErrors.fecha_inicio_ejecucion = 'La fecha de inicio de ejecución es requerida';
        }
        break;
      case 2: // Presentación
        if (!formData.hoja_tramite_cargo || formData.hoja_tramite_cargo.length === 0) {
          newErrors.hoja_tramite_cargo = 'La Hoja de Trámite (Cargo) es requerida';
        }
        if (!formData.fecha_ingreso_municipalidad) {
          newErrors.fecha_ingreso_municipalidad = 'La fecha de ingreso es requerida';
        }
        break;
      case 3: // Cierre
        if (!formData.cargo_entrega_administrado || formData.cargo_entrega_administrado.length === 0) {
          newErrors.cargo_entrega_administrado = 'El Cargo de Entrega al Administrado es requerido';
        }
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
      console.log('Gestión del Anexo guardada:', formData);
      navigate('/dashboard/gestion-anexo');
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
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof GestionAnexoFormData, value)}
            title="Paso 1: Vincular Administrado"
            description="Seleccione el administrado para este servicio de gestión del anexo H"
          />
        );
      case 1:
        return (
          <StepDocumentacion
            formData={formData}
            gestionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 2:
        return (
          <StepPresentacion
            formData={formData}
            gestionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <StepCierre
            formData={formData}
            gestionId={id || 'new'}
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
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
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
                  onClick={() => navigate('/dashboard/gestion-anexo')}
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
                    onClick={() => navigate('/dashboard/gestion-anexo')}
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    className="text-white hover:opacity-90"
                  >
                    Finalizar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <ResumenGestionAnexo
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            gestionId={id || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
