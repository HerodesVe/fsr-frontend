import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { ResumenDemolicion } from './components';
import StepAdministrado from './StepDemolicion/StepAdministrado';
import StepLicencia from './StepDemolicion/StepLicencia';
import StepAntecedentes from './StepDemolicion/StepAntecedentes';
import StepAreaMedidas from './StepDemolicion/StepAreaMedidas';
import StepDocumentosFSR from './StepDemolicion/StepDocumentosFSR';
import StepExpedienteNotificaciones from './StepDemolicion/StepExpedienteNotificaciones';
import StepActasEspecialidad from './StepDemolicion/StepActasEspecialidad';
import type { DemolicionFormData, FormStep, UploadedDocument } from '@/types/demolicion.types';


const stepLabels = [
  'Administrado',
  'Licencia', 
  'Antecedentes',
  'Área y Medidas',
  'Documentos FSR',
  'Expediente',
  'Actas'
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
    { id: 2, title: 'Licencia', completed: false },
    { id: 3, title: 'Antecedentes', completed: false },
    { id: 4, title: 'Área y Medidas', completed: false },
    { id: 5, title: 'Documentos FSR', completed: false },
    { id: 6, title: 'Expediente', completed: false },
    { id: 7, title: 'Actas', completed: false },
  ]);
  
  const [formData, setFormData] = useState<DemolicionFormData>({
    // Paso 1: Administrado
    selectedClient: null,

    // Paso 2: Licencia
    tipo_licencia_edificacion: '',
    tipo_modalidad: '',
    link_normativas: '',
    archivo_normativo: null,

    // Paso 3: Antecedentes
    planos_ubicacion: [],
    planos_arquitectura: [],
    planos_sostenimiento: [],
    planos_cercos: [],
    planos_excavaciones: [],
    partida_registral: [],
    fue: [],
    otros_antecedentes: [],
    mostrar_otros_antecedentes: false,

    // Paso 4: Área y Medidas Perimétricas
    area_total: '',
    por_el_frente: '',
    por_la_derecha: '',
    por_la_izquierda: '',
    por_el_fondo: '',
    medidas_perimetricas_administrado: '',
    medidas_perimetricas_reales_fsr: '',
    descripcion_proyecto: '',

    // Paso 5: Documentos FSR
    memoria_descriptiva: [],
    plano_ubicacion: [],
    plano_arquitectura_demoler: [],
    plano_serramiento: [],
    otros_planos: [],
    mostrar_otros_planos: false,

    // Paso 6: Expediente y Notificaciones
    expediente_ingresado: false,
    numero_expediente: '',
    cargo_ingreso: null,
    consulta_ministerio: null,
    fecha_subida: '',
    fecha_recepcion: '',
    fecha_emision: '',
    fecha_vencimiento: '',
    fecha_notificacion: '',
    hora_notificacion: '',
    motivo_notificacion: '',
    funcionario: '',
    documento_relacionado: null,
    levantamiento_presentado: false,
    fecha_presentacion: '',
    documento_levantamiento: null,
    citas_tecnico: [],

    // Paso 7: Actas por Especialidad
    actas_especialidad: {
      arquitectura: {
        cargo_ingreso: null,
        fecha_subida: '',
        fecha_recepcion: '',
        fecha_emision: '',
        fecha_vencimiento: '',
        resultado: 'conforme',
        levantamiento_observaciones: null,
      },
      estructura: {
        acta_estructura: null,
      },
      electrica: {
        acta_electrica: null,
      },
      sanitaria: {
        acta_sanitaria: null,
      },
    },
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
      case 1: // Licencia
        if (!formData.tipo_licencia_edificacion) {
          newErrors.tipo_licencia_edificacion = 'El tipo de licencia es requerido';
        }
        if (!formData.tipo_modalidad) {
          newErrors.tipo_modalidad = 'El tipo de modalidad es requerido';
        }
        break;
      case 2: // Antecedentes
        // Validaciones opcionales para antecedentes
        break;
      case 3: // Área y Medidas
        if (!formData.area_total) {
          newErrors.area_total = 'El área total es requerida';
        }
        if (!formData.por_el_frente) {
          newErrors.por_el_frente = 'La medida del frente es requerida';
        }
        if (!formData.por_la_derecha) {
          newErrors.por_la_derecha = 'La medida derecha es requerida';
        }
        if (!formData.por_la_izquierda) {
          newErrors.por_la_izquierda = 'La medida izquierda es requerida';
        }
        if (!formData.por_el_fondo) {
          newErrors.por_el_fondo = 'La medida del fondo es requerida';
        }
        if (!formData.medidas_perimetricas_administrado) {
          newErrors.medidas_perimetricas_administrado = 'Las medidas perimétricas del administrado son requeridas';
        }
        if (!formData.medidas_perimetricas_reales_fsr) {
          newErrors.medidas_perimetricas_reales_fsr = 'Las medidas perimétricas reales FSR son requeridas';
        }
        break;
      case 4: // Documentos FSR
        // Validaciones opcionales para documentos FSR
        break;
      case 5: // Expediente
        // Validar si se ingresó el expediente
        if (formData.expediente_ingresado && !formData.numero_expediente) {
          newErrors.numero_expediente = 'El número de expediente es requerido';
        }
        if (formData.expediente_ingresado && !formData.cargo_ingreso) {
          newErrors.cargo_ingreso = 'El cargo de ingreso es requerido';
        }
        
        // Validar fechas si hay consulta al ministerio
        if (formData.consulta_ministerio) {
          if (!formData.fecha_subida) {
            newErrors.fecha_subida = 'La fecha de subida es requerida';
          }
          if (!formData.fecha_recepcion) {
            newErrors.fecha_recepcion = 'La fecha de recepción es requerida';
          }
        }
        
        // Validar levantamiento de observaciones
        if (formData.levantamiento_presentado && !formData.fecha_presentacion) {
          newErrors.fecha_presentacion = 'La fecha de presentación es requerida';
        }
        break;
      case 6: // Actas
        // Validaciones opcionales para actas
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
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <StepLicencia
            formData={formData}
            errors={errors}
            demolicionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 2:
        return (
          <StepAntecedentes
            formData={formData}
            demolicionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <StepAreaMedidas
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <StepDocumentosFSR
            formData={formData}
            demolicionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 5:
        return (
          <StepExpedienteNotificaciones
            formData={formData}
            demolicionId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 6:
        return (
          <StepActasEspecialidad
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
