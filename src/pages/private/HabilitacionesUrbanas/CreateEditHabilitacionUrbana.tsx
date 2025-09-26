import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { ResumenHabilitacion } from './components';
import { StepAdministrado } from '@/components/utils/Steps';
import {
  StepInformacionInicial,
  StepDocumentacionTecnica,
  StepBaseLegal,
  StepIngresoExpediente,
  StepRevisionObservaciones,
  StepAprobacionFinal
} from './StepHabilitacion';
import type { HabilitacionUrbanaFormData, FormStep, UploadedDocument } from '@/types/habilitacionUrbana.types';

const elaboracionSteps = [
  'Administrado',
  'Información Inicial',
  'Documentación Técnica',
  'Base Legal',
  'Ingreso Expediente',
  'Revisión',
  'Aprobación Final'
];

const gestionSteps = [
  'Administrado',
  'Recopilación',
  'Base Legal',
  'Ingreso Expediente',
  'Revisión',
  'Aprobación Final'
];

export default function CreateEditHabilitacionUrbana() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const { clients, isLoading: clientsLoading } = useClients();
  
  const [activeTab, setActiveTab] = useState<'elaboracion' | 'gestion'>('elaboracion');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  
  // Estados para manejar los pasos del formulario por tab
  const [elaboracionStepsState, setElaboracionStepsState] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Información Inicial', completed: false },
    { id: 3, title: 'Documentación Técnica', completed: false },
    { id: 4, title: 'Base Legal', completed: false },
    { id: 5, title: 'Ingreso Expediente', completed: false },
    { id: 6, title: 'Revisión', completed: false },
    { id: 7, title: 'Aprobación Final', completed: false },
  ]);
  
  const [gestionStepsState, setGestionStepsState] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Recopilación', completed: false },
    { id: 3, title: 'Base Legal', completed: false },
    { id: 4, title: 'Ingreso Expediente', completed: false },
    { id: 5, title: 'Revisión', completed: false },
    { id: 6, title: 'Aprobación Final', completed: false },
  ]);

  const [currentSteps, setCurrentSteps] = useState({
    elaboracion: 0,
    gestion: 0
  });
  
  const [formData, setFormData] = useState<HabilitacionUrbanaFormData>({
    // Paso 1: Administrado
    selectedClient: null,

    // Paso 2: Información Inicial y Clasificación
    tipo_habilitacion: '',
    uso_habilitacion: '',
    descripcion_proyecto: '',
    ficha_registros_publicos: [],
    recibos_servicios: [],

    // Paso 3: Documentación Técnica FSR
    levantamiento_topografico: [],
    estudio_mecanica_suelos: [],
    planos_tecnicos_proyecto: [],
    formulario_unico_fuhu: [],
    certificado_zonificacion_vias: [],
    factibilidad_servicios_electricos: [],
    factibilidad_agua_desague: [],
    sira_cultura: [],
    estudio_impacto_ambiental: [],
    estudio_impacto_vial: [],
    permisos_ana_mtc: [],

    // Paso 4: Base Legal y Normativa
    normas_aplicadas: [],

    // Paso 5: Ingreso del Expediente
    fecha_ingreso: '',
    cargo_ingreso: [],
    numero_expediente: '',

    // Paso 6: Proceso de Revisión y Observaciones
    acta_observaciones: [],
    documentacion_rectificada: [],

    // Paso 7: Aprobación y Entrega Final
    acta_dictamen_conforme: [],
    resolucion_habilitacion_urbana: [],
    proyecto_reconsideracion_apelacion: [],
    cargo_entrega_cliente: [],
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Proyecto de Licencia de Habilitación Urbana' : 'Nuevo Proyecto de Licencia de Habilitación Urbana',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  // Actualizar currentStep cuando cambie el tab activo
  useEffect(() => {
    setCurrentStep(currentSteps[activeTab]);
  }, [activeTab, currentSteps]);

  const handleTabChange = (tab: 'elaboracion' | 'gestion') => {
    setActiveTab(tab);
    setCurrentStep(currentSteps[tab]);
  };

  const handleInputChange = (field: keyof HabilitacionUrbanaFormData, value: any) => {
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

    if (activeTab === 'elaboracion') {
      switch (step) {
        case 0: // Administrado
          if (!formData.selectedClient) {
            newErrors.selectedClient = 'Debe seleccionar un administrado';
          }
          break;
        case 1: // Información Inicial
          if (!formData.tipo_habilitacion) {
            newErrors.tipo_habilitacion = 'Tipo de habilitación es requerido';
          }
          if (!formData.uso_habilitacion) {
            newErrors.uso_habilitacion = 'Uso de habilitación es requerido';
          }
          if (!formData.descripcion_proyecto) {
            newErrors.descripcion_proyecto = 'Descripción del proyecto es requerida';
          }
          if (!formData.ficha_registros_publicos || formData.ficha_registros_publicos.length === 0) {
            newErrors.ficha_registros_publicos = 'La ficha de registros públicos es requerida';
          }
          break;
        case 2: // Documentación Técnica
          if (!formData.levantamiento_topografico || formData.levantamiento_topografico.length === 0) {
            newErrors.levantamiento_topografico = 'El levantamiento topográfico es requerido';
          }
          if (!formData.estudio_mecanica_suelos || formData.estudio_mecanica_suelos.length === 0) {
            newErrors.estudio_mecanica_suelos = 'El estudio de mecánica de suelos es requerido';
          }
          if (!formData.planos_tecnicos_proyecto || formData.planos_tecnicos_proyecto.length === 0) {
            newErrors.planos_tecnicos_proyecto = 'Los planos técnicos del proyecto son requeridos';
          }
          if (!formData.formulario_unico_fuhu || formData.formulario_unico_fuhu.length === 0) {
            newErrors.formulario_unico_fuhu = 'El formulario único (FUHU) es requerido';
          }
          break;
        case 4: // Ingreso Expediente
          if (!formData.fecha_ingreso) {
            newErrors.fecha_ingreso = 'La fecha de ingreso es requerida';
          }
          if (!formData.cargo_ingreso || formData.cargo_ingreso.length === 0) {
            newErrors.cargo_ingreso = 'El cargo de ingreso es requerido';
          }
          if (!formData.numero_expediente) {
            newErrors.numero_expediente = 'El número de expediente es requerido';
          }
          break;
      }
    } else { // gestion
      switch (step) {
        case 0: // Administrado
          if (!formData.selectedClient) {
            newErrors.selectedClient = 'Debe seleccionar un administrado';
          }
          break;
        case 3: // Ingreso Expediente (paso 4 en gestión)
          if (!formData.fecha_ingreso) {
            newErrors.fecha_ingreso = 'La fecha de ingreso es requerida';
          }
          if (!formData.cargo_ingreso || formData.cargo_ingreso.length === 0) {
            newErrors.cargo_ingreso = 'El cargo de ingreso es requerido';
          }
          if (!formData.numero_expediente) {
            newErrors.numero_expediente = 'El número de expediente es requerido';
          }
          break;
      }
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
    const currentStepsState = activeTab === 'elaboracion' ? elaboracionStepsState : gestionStepsState;
    const setCurrentStepsState = activeTab === 'elaboracion' ? setElaboracionStepsState : setGestionStepsState;
    
    setCurrentStepsState(prevSteps => 
      prevSteps.map((step, index) => 
        index === currentStep ? { ...step, completed: true } : step
      )
    );
    
    if (currentStep < currentStepsState.length - 1) {
      const newStep = currentStep + 1;
      setCurrentSteps(prev => ({ ...prev, [activeTab]: newStep }));
      setCurrentStep(newStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentSteps(prev => ({ ...prev, [activeTab]: newStep }));
      setCurrentStep(newStep);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    const currentStepsState = activeTab === 'elaboracion' ? elaboracionStepsState : gestionStepsState;
    
    // Permitir navegación hacia atrás a cualquier paso
    if (stepIndex <= currentStep) {
      setCurrentSteps(prev => ({ ...prev, [activeTab]: stepIndex }));
      setCurrentStep(stepIndex);
    }
    // Permitir navegación hacia adelante solo a pasos completados o al siguiente paso inmediato
    else if (currentStepsState[stepIndex].completed || stepIndex === currentStep + 1) {
      setCurrentSteps(prev => ({ ...prev, [activeTab]: stepIndex }));
      setCurrentStep(stepIndex);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Habilitación Urbana guardada:', formData);
      navigate('/dashboard/habilitaciones-urbanas');
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentSteps = () => {
    return activeTab === 'elaboracion' ? elaboracionStepsState : gestionStepsState;
  };

  const getCurrentStepLabels = () => {
    return activeTab === 'elaboracion' ? elaboracionSteps : gestionSteps;
  };

  const renderStepContent = () => {
    const stepIndex = currentStep;
    
    if (activeTab === 'elaboracion') {
      switch (stepIndex) {
        case 0:
          return (
            <StepAdministrado
              formData={formData}
              clients={clients}
              errors={errors}
              onInputChange={(field: string, value: any) => handleInputChange(field as keyof HabilitacionUrbanaFormData, value)}
              title="Paso 1: Vincular Administrado"
              description="Seleccione el administrado para este proyecto de habilitación urbana"
            />
          );
        case 1:
          return (
            <StepInformacionInicial
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              errors={errors}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 2:
          return (
            <StepDocumentacionTecnica
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 3:
          return (
            <StepBaseLegal
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 4:
          return (
            <StepIngresoExpediente
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              errors={errors}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 5:
          return (
            <StepRevisionObservaciones
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 6:
          return (
            <StepAprobacionFinal
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        default:
          return null;
      }
    } else { // gestion
      switch (stepIndex) {
        case 0:
          return (
            <StepAdministrado
              formData={formData}
              clients={clients}
              errors={errors}
              onInputChange={(field: string, value: any) => handleInputChange(field as keyof HabilitacionUrbanaFormData, value)}
              title="Paso 1: Vincular Administrado"
              description="Seleccione el administrado para este proyecto de habilitación urbana"
            />
          );
        case 1:
          return (
            <StepDocumentacionTecnica
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 2:
          return (
            <StepBaseLegal
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 3:
          return (
            <StepIngresoExpediente
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              errors={errors}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 4:
          return (
            <StepRevisionObservaciones
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 5:
          return (
            <StepAprobacionFinal
              formData={formData}
              habilitacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        default:
          return null;
      }
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
            {/* Selector de Flujo (Tabs) */}
            <div className="mb-6 flex justify-center border-b border-gray-200">
              <button
                onClick={() => handleTabChange('elaboracion')}
                className={`text-lg font-semibold py-4 px-6 border-b-2 transition-colors ${
                  activeTab === 'elaboracion'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Elaboración de Proyecto
              </button>
              <button
                onClick={() => handleTabChange('gestion')}
                className={`text-lg font-semibold py-4 px-6 border-b-2 transition-colors ${
                  activeTab === 'gestion'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Gestión de Proyecto
              </button>
            </div>

            {/* Indicadores de pasos */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                {getCurrentSteps().map((step, index) => (
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
                    Anterior: {getCurrentStepLabels()[currentStep - 1]}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="bordered"
                  onClick={() => navigate('/dashboard/habilitaciones-urbanas')}
                  startContent={<LuX className="w-4 h-4" />}
                >
                  Cancelar
                </Button>

                {currentStep < getCurrentSteps().length - 1 ? (
                  <Button
                    onClick={handleNext}
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    className="text-white hover:opacity-90"
                    endContent={<LuArrowRight className="w-4 h-4" />}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Guardando...' : `Siguiente: ${getCurrentStepLabels()[currentStep + 1]}`}
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('/dashboard/habilitaciones-urbanas')}
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
          <ResumenHabilitacion
            formData={formData}
            currentStep={currentStep}
            steps={getCurrentSteps()}
            habilitacionId={id || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
