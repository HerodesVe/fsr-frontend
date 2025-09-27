import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { ResumenRectificacion } from './components';
import { StepAdministrado, StepCargo } from '@/components/utils/Steps';
import {
  StepSeleccionAnteproyecto,
  StepDocumentosLegales,
  StepElaboracionPlano,
  StepProgramacionCita,
  StepSeguimientoObservaciones,
  StepAprobacionFinal
} from './StepRectificacion';
import type { RectificacionLinderosFormData, FormStep, UploadedDocument } from '@/types/rectificacionLinderos.types';

const elaboracionSteps = [
  'Administrado',
  'Selección Anteproyecto',
  'Documentos Legales',
  'Elaboración Plano',
  'Entrega al Administrado'
];

const gestionSteps = [
  'Administrado',
  'Programación Cita',
  'Seguimiento',
  'Aprobación Final'
];

export default function CreateEditRectificacionLinderos() {
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
    { id: 2, title: 'Selección Anteproyecto', completed: false },
    { id: 3, title: 'Documentos Legales', completed: false },
    { id: 4, title: 'Elaboración Plano', completed: false },
    { id: 5, title: 'Entrega al Administrado', completed: false },
  ]);
  
  const [gestionStepsState, setGestionStepsState] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Programación Cita', completed: false },
    { id: 3, title: 'Seguimiento', completed: false },
    { id: 4, title: 'Aprobación Final', completed: false },
  ]);

  const [currentSteps, setCurrentSteps] = useState({
    elaboracion: 0,
    gestion: 0
  });
  
  const [formData, setFormData] = useState<RectificacionLinderosFormData>({
    // Paso 1: Administrado
    selectedClient: null,

    // Paso 2: Selección del Anteproyecto (Elaboración)
    anteproyecto_id: '',

    // Paso 3: Documentos Legales y Técnicos (Elaboración)
    titulo_propiedad: [],
    planos_anteriores: [],
    memoria_original: [],
    documento_identidad: [],
    pago_predial: [],

    // Paso 4: Elaboración del Plano de Rectificación (Elaboración)
    plano_propuesto: [],
    fecha_elaboracion_plano: '',

    // Paso 5: Programación de Cita (Gestión)
    fecha_cita: '',
    hora_cita: '',
    entidad_revisora: '',
    funcionario_contacto: '',

    // Paso 6: Seguimiento y Observaciones (Gestión)
    notas_observaciones: '',
    documento_observaciones: [],

    // Paso 7: Aprobación Final (Gestión)
    documento_aprobacion: [],
    fecha_aprobacion: '',

    // Paso 5: Entrega al Administrado (solo para elaboración)
    fecha_entrega_administrado: '',
    receptor_administrado: '',
    cargo_entrega_administrado: [],
    observaciones_entrega: '',
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Rectificación de Linderos' : 'Nueva Rectificación de Linderos',
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

  const handleInputChange = (field: keyof RectificacionLinderosFormData, value: any) => {
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
        case 1: // Selección Anteproyecto
          if (!formData.anteproyecto_id) {
            newErrors.anteproyecto_id = 'Debe seleccionar un anteproyecto';
          }
          break;
        case 2: // Documentos Legales
          if (!formData.titulo_propiedad || formData.titulo_propiedad.length === 0) {
            newErrors.titulo_propiedad = 'El título de propiedad es requerido';
          }
          if (!formData.documento_identidad || formData.documento_identidad.length === 0) {
            newErrors.documento_identidad = 'El documento de identidad es requerido';
          }
          if (!formData.pago_predial || formData.pago_predial.length === 0) {
            newErrors.pago_predial = 'El comprobante de pago predial es requerido';
          }
          break;
        case 3: // Elaboración Plano
          if (!formData.plano_propuesto || formData.plano_propuesto.length === 0) {
            newErrors.plano_propuesto = 'El plano de rectificación es requerido';
          }
          if (!formData.fecha_elaboracion_plano) {
            newErrors.fecha_elaboracion_plano = 'La fecha de elaboración es requerida';
          }
          break;
        case 4: // Entrega al Administrado (solo para elaboración)
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
    } else { // gestion
      switch (step) {
        case 0: // Administrado
          if (!formData.selectedClient) {
            newErrors.selectedClient = 'Debe seleccionar un administrado';
          }
          break;
        case 1: // Programación Cita
          if (!formData.fecha_cita) {
            newErrors.fecha_cita = 'La fecha de cita es requerida';
          }
          if (!formData.hora_cita) {
            newErrors.hora_cita = 'La hora de cita es requerida';
          }
          if (!formData.entidad_revisora) {
            newErrors.entidad_revisora = 'La entidad revisora es requerida';
          }
          break;
        case 3: // Aprobación Final
          if (!formData.documento_aprobacion || formData.documento_aprobacion.length === 0) {
            newErrors.documento_aprobacion = 'El documento de aprobación es requerido';
          }
          if (!formData.fecha_aprobacion) {
            newErrors.fecha_aprobacion = 'La fecha de aprobación es requerida';
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
      console.log('Rectificación de Linderos guardada:', formData);
      navigate('/dashboard/rectificacion-linderos');
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
              onInputChange={(field: string, value: any) => handleInputChange(field as keyof RectificacionLinderosFormData, value)}
              title="Paso 1: Vincular Administrado"
              description="Seleccione el administrado para esta rectificación de linderos"
            />
          );
        case 1:
          return (
            <StepSeleccionAnteproyecto
              formData={formData}
              rectificacionId={id || 'new'}
              errors={errors}
              onInputChange={handleInputChange}
            />
          );
        case 2:
          return (
            <StepDocumentosLegales
              formData={formData}
              rectificacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              errors={errors}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 3:
          return (
            <StepElaboracionPlano
              formData={formData}
              rectificacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              errors={errors}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 4:
          return (
            <StepCargo
              formData={formData}
              projectId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              errors={errors}
              onInputChange={(field: string, value: any) => handleInputChange(field as keyof RectificacionLinderosFormData, value)}
              onFileUpload={handleFileUpload}
              title="Cargo"
              description="Complete la información de la entrega final de la rectificación de linderos al administrado"
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
              onInputChange={(field: string, value: any) => handleInputChange(field as keyof RectificacionLinderosFormData, value)}
              title="Paso 1: Vincular Administrado"
              description="Seleccione el administrado para esta rectificación de linderos"
            />
          );
        case 1:
          return (
            <StepProgramacionCita
              formData={formData}
              rectificacionId={id || 'new'}
              errors={errors}
              onInputChange={handleInputChange}
            />
          );
        case 2:
          return (
            <StepSeguimientoObservaciones
              formData={formData}
              rectificacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
            />
          );
        case 3:
          return (
            <StepAprobacionFinal
              formData={formData}
              rectificacionId={id || 'new'}
              uploadedDocuments={uploadedDocuments}
              errors={errors}
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
                  onClick={() => navigate('/dashboard/rectificacion-linderos')}
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
                    onClick={() => navigate('/dashboard/rectificacion-linderos')}
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

        {/* Resumen - Solo para elaboración */}
        {activeTab === 'elaboracion' && (
          <div className="lg:col-span-1">
            <ResumenRectificacion
              formData={formData}
              currentStep={currentStep}
              steps={getCurrentSteps()}
              rectificacionId={id || 'new'}
              onSave={handleSave}
              isSaving={isSaving}
              uploadedDocuments={uploadedDocuments}
            />
          </div>
        )}
      </div>
    </div>
  );
}
