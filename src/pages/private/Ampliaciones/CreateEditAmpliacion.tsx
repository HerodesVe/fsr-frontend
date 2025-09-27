import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { ResumenAmpliacion } from './components';
import { StepCargo } from '@/components/utils/Steps';
import StepProyectoPersonalizado from './StepAmpliacion/StepProyectoPersonalizado';
import StepLicencias from './StepAmpliacion/StepLicencias';
import StepAntecedentes from './StepAmpliacion/StepAntecedentes';
import StepDocumentacion from './StepAmpliacion/StepDocumentacion';
import StepTramiteMunicipal from './StepAmpliacion/StepTramiteMunicipal';
import type { AmpliacionFormData, FormStep, UploadedDocument } from '@/types/ampliacion.types';

const stepLabels = [
  'Información del Proyecto',
  'Licencias y Normativas',
  'Antecedentes',
  'Documentación Técnica',
  'Trámite Municipal',
  'Entrega al Administrado'
];

export default function CreateEditAmpliacion() {
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
    { id: 1, title: 'Información del Proyecto', completed: false },
    { id: 2, title: 'Licencias y Normativas', completed: false },
    { id: 3, title: 'Antecedentes', completed: false },
    { id: 4, title: 'Documentación Técnica', completed: false },
    { id: 5, title: 'Trámite Municipal', completed: false },
    { id: 6, title: 'Entrega al Administrado', completed: false },
  ]);
  
  const [formData, setFormData] = useState<AmpliacionFormData>({
    // Paso 1: Información del Proyecto
    nombre_proyecto: '',
    selectedClient: null,

    // Paso 2: Licencias
    tipo_licencia_edificacion: '',
    modalidad: 'B',
    link_normativas: '',
    archivo_normativo: [],

    // Paso 3: Antecedentes
    gestionado_por_fsr: false,
    proyecto_fsr_id: '',
    certificado_parametros: [],
    licencia_obra: [],
    conformidad_obra: [],
    declaratoria_fabrica: [],
    planos_fabrica: [],
    partida_registral: [],

    // Paso 4: Documentación Técnica
    fue: [],
    
    // Arquitectura
    arquitectura_intervencion: [],
    arquitectura_resultante: [],
    arquitectura_memoria: [],
    
    // Estructuras
    estructuras_intervencion: [],
    estructuras_resultante: [],
    
    // Sanitarias
    sanitarias_intervencion: [],
    sanitarias_resultante: [],
    sanitarias_sedapal: [],
    
    // Eléctricas
    electricas_resultante: [],
    electricas_luz_del_sur: [],
    
    // Mecánicas
    mecanicas_ficha_tecnica: [],
    
    // Gas
    gas_resultante: [],
    gas_calidda: [],
    
    // Casos Especiales
    es_condominio: false,
    tiene_junta: 'no',
    autorizacion_condominio: [],
    observaciones_condominio: '',

    // Paso 5: Trámite Municipal
    fecha_ingreso_municipalidad: '',
    cargo_ingreso: [],
    fecha_comision: '',
    dictamen_comision: 'conforme',
    acta_comision: [],
    
    // Seguimiento
    seguimiento: [],

    // Paso 6: Entrega al Administrado
    fecha_entrega_administrado: '',
    receptor_administrado: '',
    cargo_entrega_administrado: [],
    observaciones_entrega: '',
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Ampliación/Remodelación/Demolición' : 'Nueva Ampliación/Remodelación/Demolición',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = (field: keyof AmpliacionFormData, value: any) => {
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
      case 0: // Información del Proyecto
        if (!formData.nombre_proyecto.trim()) {
          newErrors.nombre_proyecto = 'El nombre del proyecto es requerido';
        }
        if (!formData.selectedClient) {
          newErrors.selectedClient = 'Debe seleccionar un administrado';
        }
        break;
        
      case 1: // Licencias y Normativas
        if (!formData.tipo_licencia_edificacion?.trim()) {
          newErrors.tipo_licencia_edificacion = 'El tipo de licencia es requerido';
        }
        if (!formData.modalidad) {
          newErrors.modalidad = 'Debe seleccionar una modalidad';
        }
        break;
        
      case 2: // Antecedentes
        if (!formData.certificado_parametros || formData.certificado_parametros.length === 0) {
          newErrors.certificado_parametros = 'El certificado de parámetros urbanísticos es requerido';
        }
        if (formData.gestionado_por_fsr && !formData.proyecto_fsr_id) {
          newErrors.proyecto_fsr_id = 'Debe seleccionar un proyecto FSR';
        }
        break;
        
      case 3: // Documentación Técnica
        if (!formData.fue || formData.fue.length === 0) {
          newErrors.fue = 'El FUE es requerido';
        }
        if (!formData.arquitectura_intervencion || formData.arquitectura_intervencion.length === 0) {
          newErrors.arquitectura_intervencion = 'Los planos de intervención de arquitectura son requeridos';
        }
        if (!formData.arquitectura_resultante || formData.arquitectura_resultante.length === 0) {
          newErrors.arquitectura_resultante = 'Los planos resultantes de arquitectura son requeridos';
        }
        if (!formData.arquitectura_memoria || formData.arquitectura_memoria.length === 0) {
          newErrors.arquitectura_memoria = 'La memoria descriptiva es requerida';
        }
        if (formData.es_condominio && (!formData.autorizacion_condominio || formData.autorizacion_condominio.length === 0)) {
          newErrors.autorizacion_condominio = 'La autorización de condominio es requerida';
        }
        break;
        
      case 4: // Trámite Municipal
        // Validaciones opcionales para trámite municipal
        break;
      case 5: // Entrega al Administrado
        if (!formData.fecha_entrega_administrado) {
          newErrors.fecha_entrega_administrado = 'La fecha de entrega es requerida';
        }
        if (!formData.receptor_administrado) {
          newErrors.receptor_administrado = 'El nombre del receptor es requerido';
        }
        if (!formData.cargo_entrega_administrado || formData.cargo_entrega_administrado.length === 0) {
          newErrors.cargo_entrega_administrado = 'El cargo de entrega es requerido';
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
      console.log('Ampliación guardada:', formData);
      navigate('/dashboard/ampliaciones');
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
          <StepProyectoPersonalizado
            formData={formData}
            clients={clients}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <StepLicencias
            formData={formData}
            errors={errors}
            ampliacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 2:
        return (
          <StepAntecedentes
            formData={formData}
            errors={errors}
            ampliacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <StepDocumentacion
            formData={formData}
            errors={errors}
            ampliacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 4:
        return (
          <StepTramiteMunicipal
            formData={formData}
            errors={errors}
            ampliacionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 5:
        return (
          <StepCargo
            formData={formData}
            projectId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof AmpliacionFormData, value)}
            onFileUpload={handleFileUpload}
            title="Cargo"
            description="Complete la información de la entrega final de la ampliación al administrado"
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
                  onClick={() => navigate('/dashboard/ampliaciones')}
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
                    onClick={() => navigate('/dashboard/ampliaciones')}
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
          <ResumenAmpliacion
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            ampliacionId={id || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
