import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { ResumenDemolicion } from './components';
import { StepAdministrado } from '@/components/utils/Steps';
import StepDocumentacion from './StepDemolicion/StepDocumentacion';
import StepMedidasPerimetricas from './StepDemolicion/StepMedidasPerimetricas';
import StepGestionMunicipal from './StepDemolicion/StepGestionMunicipal';
import type { DemolicionFormData, FormStep, UploadedDocument } from '@/types/demolicion.types';


const stepLabels = [
  'Administrado',
  'Documentación',
  'Medidas Perimétricas',
  'Gestión Municipal'
];

export default function CreateEditDemolicion() {
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
    { id: 3, title: 'Medidas Perimétricas', completed: false },
    { id: 4, title: 'Gestión Municipal', completed: false },
  ]);
  
  const [formData, setFormData] = useState<DemolicionFormData>({
    // Paso 1: Administrado
    selectedClient: null,

    // Paso 2: Documentación
    // 2.1: Documentación del Administrado
    partida_registral: [],
    fue: [],
    documentos_antecedentes: [],
    es_zona_reglamentacion_especial: false,
    licencia_obra_nueva: [],
    comentarios_adicionales: '',

    // 2.2: Documentación FSR
    memoria_descriptiva: [],
    plano_ubicacion: [],
    plano_arquitectura: [],
    plano_cerco: [],
    plano_sostenimiento: [],

    // 2.3: Panel Fotográfico
    fotografias: [],
    link_video: '',

    // Paso 3: Medidas Perimétricas
    // Según Partida Registral
    frente_partida: '',
    fondo_partida: '',
    derecha_partida: '',
    izquierda_partida: '',
    area_total_partida: '',

    // Medidas Reales (de Campo)
    frente_real: '',
    fondo_real: '',
    derecha_real: '',
    izquierda_real: '',
    area_total_real: '',

    // Observaciones
    observaciones_medidas: '',

    // Paso 4: Gestión Municipal
    cargo_ingreso_municipalidad: [],
    fecha_ingreso_municipalidad: '',
    respuesta_resolucion_municipal: [],
    fecha_respuesta_municipal: '',
    cargo_entrega_administrado: [],
    fecha_entrega_administrado: '',
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Demolición Total' : 'Nueva Demolición Total',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = (field: keyof DemolicionFormData, value: any) => {
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
        // Validar documentos obligatorios del administrado
        if (!formData.partida_registral || formData.partida_registral.length === 0) {
          newErrors.partida_registral = 'La partida registral es requerida';
        }
        if (!formData.fue || formData.fue.length === 0) {
          newErrors.fue = 'El FUE es requerido';
        }
        // Validar documentos obligatorios de FSR
        if (!formData.memoria_descriptiva || formData.memoria_descriptiva.length === 0) {
          newErrors.memoria_descriptiva = 'La memoria descriptiva es requerida';
        }
        if (!formData.plano_ubicacion || formData.plano_ubicacion.length === 0) {
          newErrors.plano_ubicacion = 'El plano de ubicación es requerido';
        }
        if (!formData.plano_arquitectura || formData.plano_arquitectura.length === 0) {
          newErrors.plano_arquitectura = 'El plano de arquitectura es requerido';
        }
        if (!formData.plano_cerco || formData.plano_cerco.length === 0) {
          newErrors.plano_cerco = 'El plano de cerco es requerido';
        }
        break;
      case 2: // Medidas Perimétricas
        // Validar medidas según partida registral
        if (!formData.frente_partida) {
          newErrors.frente_partida = 'La medida del frente según partida es requerida';
        }
        if (!formData.fondo_partida) {
          newErrors.fondo_partida = 'La medida del fondo según partida es requerida';
        }
        if (!formData.derecha_partida) {
          newErrors.derecha_partida = 'La medida derecha según partida es requerida';
        }
        if (!formData.izquierda_partida) {
          newErrors.izquierda_partida = 'La medida izquierda según partida es requerida';
        }
        if (!formData.area_total_partida) {
          newErrors.area_total_partida = 'El área total según partida es requerida';
        }
        // Validar medidas reales
        if (!formData.frente_real) {
          newErrors.frente_real = 'La medida real del frente es requerida';
        }
        if (!formData.fondo_real) {
          newErrors.fondo_real = 'La medida real del fondo es requerida';
        }
        if (!formData.derecha_real) {
          newErrors.derecha_real = 'La medida real derecha es requerida';
        }
        if (!formData.izquierda_real) {
          newErrors.izquierda_real = 'La medida real izquierda es requerida';
        }
        if (!formData.area_total_real) {
          newErrors.area_total_real = 'El área total real es requerida';
        }
        break;
      case 3: // Gestión Municipal
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
      console.log('Demolición guardada:', formData);
      navigate('/dashboard/demoliciones');
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
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof DemolicionFormData, value)}
            title="Paso 1: Vincular Administrado"
            description="Seleccione el administrado para este servicio de demolición total"
          />
        );
      case 1:
        return (
          <StepDocumentacion
            formData={formData}
            demolicionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 2:
        return (
          <StepMedidasPerimetricas
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <StepGestionMunicipal
            formData={formData}
            demolicionId={id || 'new'}
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
                  onClick={() => navigate('/dashboard/demoliciones')}
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
                    onClick={() => navigate('/dashboard/demoliciones')}
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
          <ResumenDemolicion
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            demolicionId={id || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
