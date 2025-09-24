import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { ResumenModificacion } from './components';
import { StepAdministrado } from '@/components/utils/Steps';
import StepLicencia from './StepModificacion/StepLicencia';
import StepAntecedentes from './StepModificacion/StepAntecedentes';
import StepElaboracion from './StepModificacion/StepElaboracion';
import StepGestion from './StepModificacion/StepGestion';
import type { ModificacionFormData, FormStep, UploadedDocument } from '@/types/modificacion.types';

const stepLabels = [
  'Administrado',
  'Licencia',
  'Antecedentes',
  'Elaboración',
  'Gestión'
];

export default function CreateEditModificacion() {
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
    { id: 2, title: 'Licencia', completed: false },
    { id: 3, title: 'Antecedentes', completed: false },
    { id: 4, title: 'Elaboración', completed: false },
    { id: 5, title: 'Gestión', completed: false },
  ]);
  
  const [formData, setFormData] = useState<ModificacionFormData>({
    // Paso 1: Administrado
    selectedClient: null,

    // Paso 2: Licencia
    tipo_licencia_edificacion: '',
    tipo_modalidad: '',

    // Paso 3: Antecedentes
    vincular_expediente_fsr: '',
    numero_expediente_externo: '',
    licencia_obra_anterior: [],
    planos_aprobados_anteriores: [],
    formulario_unico_anterior: [],

    // Paso 4: Elaboración del Nuevo Proyecto
    planos_arquitectura: [],
    planos_estructuras: [],
    planos_sanitarias: [],
    planos_electricas: [],
    memoria_descriptiva: [],
    documentacion_adicional: [],

    // Paso 5: Gestión - Ingreso y Seguimiento
    fecha_ingreso_entidad: '',
    cargo_ingreso_expediente: null,
    acta_observaciones: null,
    acta_conformidad: null,
    acta_reconsideracion: null,

    // Paso 5: Gestión - Subsanación
    anexo_subsanacion: null,
    planos_corregidos: null,

    // Paso 5: Gestión - Finalización
    licencia_modificacion_emitida: null,
    cargo_entrega_administrado: null,
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Modificación de Obra' : 'Nueva Modificación de Obra',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = (field: keyof ModificacionFormData, value: any) => {
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
      case 1: // Licencia
        if (!formData.tipo_licencia_edificacion) {
          newErrors.tipo_licencia_edificacion = 'El tipo de licencia es requerido';
        }
        if (!formData.tipo_modalidad) {
          newErrors.tipo_modalidad = 'El tipo de modalidad es requerido';
        }
        break;
      case 2: // Antecedentes
        if (formData.licencia_obra_anterior.length === 0) {
          newErrors.licencia_obra_anterior = 'La licencia de obra anterior es requerida';
        }
        if (formData.planos_aprobados_anteriores.length === 0) {
          newErrors.planos_aprobados_anteriores = 'Los planos aprobados anteriores son requeridos';
        }
        break;
      case 3: // Elaboración
        if (formData.planos_arquitectura.length === 0) {
          newErrors.planos_arquitectura = 'Los planos de arquitectura son requeridos';
        }
        if (formData.memoria_descriptiva.length === 0) {
          newErrors.memoria_descriptiva = 'La memoria descriptiva es requerida';
        }
        break;
      case 4: // Gestión
        if (!formData.fecha_ingreso_entidad) {
          newErrors.fecha_ingreso_entidad = 'La fecha de ingreso es requerida';
        }
        if (!formData.cargo_ingreso_expediente) {
          newErrors.cargo_ingreso_expediente = 'El cargo de ingreso es requerido';
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
      console.log('Modificación guardada:', formData);
      navigate('/dashboard/modificaciones');
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
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ModificacionFormData, value)}
            title="Paso 1: Seleccionar Administrado"
            description="Seleccione el administrado para este trámite de modificación de obra"
          />
        );
      case 1:
        return (
          <StepLicencia
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <StepAntecedentes
            formData={formData}
            modificacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <StepElaboracion
            formData={formData}
            modificacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 4:
        return (
          <StepGestion
            formData={formData}
            modificacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
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
                  onClick={() => navigate('/dashboard/modificaciones')}
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
                    onClick={() => navigate('/dashboard/modificaciones')}
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
          <ResumenModificacion
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            modificacionId={id || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}

