import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { ResumenLicenciaFuncionamiento } from './components';
import { StepAdministrado } from '@/components/utils/Steps';
import StepConsultaInicial from './StepLicenciaFuncionamiento/StepConsultaInicial';
import StepDocumentacionCliente from './StepLicenciaFuncionamiento/StepDocumentacionCliente';
import StepVisitasVerificacion from './StepLicenciaFuncionamiento/StepVisitasVerificacion';
import StepClasificacionRiesgo from './StepLicenciaFuncionamiento/StepClasificacionRiesgo';
import StepIngresoExpediente from './StepLicenciaFuncionamiento/StepIngresoExpediente';
import StepInspeccionMunicipal from './StepLicenciaFuncionamiento/StepInspeccionMunicipal';
import StepEmisionEntrega from './StepLicenciaFuncionamiento/StepEmisionEntrega';
import type { 
  LicenciaFuncionamientoFormData, 
  FormStep, 
  UploadedDocument, 
} from '@/types/licenciaFuncionamiento.types';

const stepLabels = [
  'Administrado',
  'Consulta Inicial',
  'Documentación',
  'Verificación',
  'Clasificación',
  'Ingreso Expediente',
  'Inspección',
  'Entrega Final'
];

export default function CreateEditLicenciaFuncionamiento() {
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
    { id: 2, title: 'Consulta Inicial', completed: false },
    { id: 3, title: 'Documentación', completed: false },
    { id: 4, title: 'Verificación', completed: false },
    { id: 5, title: 'Clasificación', completed: false },
    { id: 6, title: 'Ingreso Expediente', completed: false },
    { id: 7, title: 'Inspección', completed: false },
    { id: 8, title: 'Entrega Final', completed: false },
  ]);
  
  const [formData, setFormData] = useState<LicenciaFuncionamientoFormData>({
    // Paso 1: Administrado
    selectedClient: null,

    // Paso 2: Consulta Inicial
    direccion_local: '',
    giro_negocio: '',
    zonificacion: '',
    compatibilidad_uso: '',
    compatibilidad_verificada: false,

    // Paso 3: Documentación del Cliente
    vigencia_poder: [],
    hrpu: [],
    declaratoria_fabrica: [],
    certificado_pozo_tierra: [],

    // Paso 4: Visitas de Verificación
    visitas: [],

    // Paso 5: Clasificación del Riesgo
    nivel_riesgo: '' as any,
    planos_arquitectura: [],
    planos_seguridad: [],
    planos_electricos: [],
    plan_seguridad: [],

    // Paso 6: Ingreso de Expediente
    fecha_ingreso_expediente: '',
    numero_expediente_municipal: '',
    estado_tramite: '' as any,

    // Paso 7: Inspección Municipal
    fecha_inspeccion: '',
    resultado_inspeccion: '' as any,
    acta_inspeccion: [],
    fecha_limite_subsanar: '',

    // Paso 8: Emisión y Entrega
    certificado_itse: [],
    licencia_funcionamiento: [],
    acta_entrega_firmada: [],
    fecha_entrega_cliente: '',
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Licencia de Funcionamiento' : 'Nueva Licencia de Funcionamiento',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = (field: keyof LicenciaFuncionamientoFormData, value: any) => {
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
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      key: documentKey,
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
      case 1: // Consulta Inicial
        if (!formData.direccion_local) {
          newErrors.direccion_local = 'La dirección del local es requerida';
        }
        if (!formData.giro_negocio) {
          newErrors.giro_negocio = 'El giro del negocio es requerido';
        }
        if (!formData.compatibilidad_verificada) {
          newErrors.compatibilidad_verificada = 'Debe verificar la compatibilidad de uso';
        }
        break;
      case 2: // Documentación Cliente
        if (!formData.vigencia_poder || formData.vigencia_poder.length === 0) {
          newErrors.vigencia_poder = 'La vigencia de poder es requerida';
        }
        if (!formData.hrpu || formData.hrpu.length === 0) {
          newErrors.hrpu = 'El HRPU es requerido';
        }
        if (!formData.declaratoria_fabrica || formData.declaratoria_fabrica.length === 0) {
          newErrors.declaratoria_fabrica = 'La declaratoria de fábrica es requerida';
        }
        if (!formData.certificado_pozo_tierra || formData.certificado_pozo_tierra.length === 0) {
          newErrors.certificado_pozo_tierra = 'El certificado de pozo a tierra es requerido';
        }
        break;
      case 3: // Visitas de Verificación
        if (!formData.visitas || formData.visitas.length === 0) {
          newErrors.visitas = 'Se requiere al menos una visita de verificación';
        }
        break;
      case 4: // Clasificación del Riesgo
        if (!formData.nivel_riesgo) {
          newErrors.nivel_riesgo = 'Debe seleccionar un nivel de riesgo';
        }
        // Validar documentos adicionales para riesgo alto/muy alto
        if (formData.nivel_riesgo === 'Alto' || formData.nivel_riesgo === 'Muy Alto') {
          if (!formData.planos_arquitectura || formData.planos_arquitectura.length === 0) {
            newErrors.planos_arquitectura = 'Los planos de arquitectura son requeridos para este nivel de riesgo';
          }
          if (!formData.planos_seguridad || formData.planos_seguridad.length === 0) {
            newErrors.planos_seguridad = 'Los planos de seguridad son requeridos para este nivel de riesgo';
          }
        }
        break;
      case 5: // Ingreso Expediente
        // Validaciones opcionales
        break;
      case 6: // Inspección Municipal
        if (!formData.acta_inspeccion || formData.acta_inspeccion.length === 0) {
          newErrors.acta_inspeccion = 'El acta de inspección es requerida';
        }
        break;
      case 7: // Emisión y Entrega
        if (!formData.certificado_itse || formData.certificado_itse.length === 0) {
          newErrors.certificado_itse = 'El certificado ITSE es requerido';
        }
        if (!formData.licencia_funcionamiento || formData.licencia_funcionamiento.length === 0) {
          newErrors.licencia_funcionamiento = 'La licencia de funcionamiento es requerida';
        }
        if (!formData.acta_entrega_firmada || formData.acta_entrega_firmada.length === 0) {
          newErrors.acta_entrega_firmada = 'El acta de entrega firmada es requerida';
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
      console.log('Licencia de funcionamiento guardada:', formData);
      navigate('/dashboard/licencias-funcionamiento');
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
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof LicenciaFuncionamientoFormData, value)}
            title="Paso 1: Vincular Administrado"
            description="Seleccione el administrado para este servicio de licencia de funcionamiento"
          />
        );
      case 1:
        return (
          <StepConsultaInicial
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <StepDocumentacionCliente
            formData={formData}
            licenciaId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <StepVisitasVerificacion
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <StepClasificacionRiesgo
            formData={formData}
            licenciaId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 5:
        return (
          <StepIngresoExpediente
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 6:
        return (
          <StepInspeccionMunicipal
            formData={formData}
            licenciaId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 7:
        return (
          <StepEmisionEntrega
            formData={formData}
            licenciaId={id || 'new'}
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
              <div className="flex items-center gap-2 overflow-x-auto">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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
                  onClick={() => navigate('/dashboard/licencias-funcionamiento')}
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
                    onClick={() => navigate('/dashboard/licencias-funcionamiento')}
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
          <ResumenLicenciaFuncionamiento
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            licenciaId={id || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
