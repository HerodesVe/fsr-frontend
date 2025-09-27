import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';

import type { ConformidadFormData, FormStep, UploadedDocument } from '@/types/conformidad.types';
import { StepAdministrado, StepCargo } from '@/components/utils/Steps';
import StepModalidad from './StepConformidad/StepModalidad';
import StepDocumentosIniciales from './StepConformidad/StepDocumentosIniciales';
import StepAntecedentes from './StepConformidad/StepAntecedentes';
import StepDocumentosExpediente from './StepConformidad/StepDocumentosExpediente';
import StepVerificacion from './StepConformidad/StepVerificacion';
import { ResumenConformidad } from './components';

const stepLabels = [
  'Administrado',
  'Modalidad',
  'Documentos Iniciales',
  'Antecedentes',
  'Documentos Expediente',
  'Verificación',
  'Cargo'
];

export default function CreateEditConformidad() {
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
    { id: 2, title: 'Modalidad', completed: false },
    { id: 3, title: 'Documentos Iniciales', completed: false },
    { id: 4, title: 'Antecedentes', completed: false },
    { id: 5, title: 'Documentos Expediente', completed: false },
    { id: 6, title: 'Verificación', completed: false },
    { id: 7, title: 'Entrega al Administrado', completed: false },
  ]);
  
  const [formData, setFormData] = useState<ConformidadFormData>({
    // Información General
    selectedClient: null,
    modalidad: '',

    // Sin Variaciones - Documentos del Cliente
    licencia_obra_sv: [],
    planos_aprobados_sv: [],
    
    // Sin Variaciones - Verificación Preliminar
    verificacion_campo_sv: false,
    fecha_verificacion_sv: '',

    // Con Variaciones - Información Inicial
    servicios_previos_fsr: false,
    
    // Con Variaciones - Documentos Iniciales del Cliente
    licencia_obra_cv: [],
    planos_aprobados_licencia_cv: [],
    planos_digitales_cad_cv: [],

    // Con Variaciones - Análisis de Antecedentes
    primer_expediente: true,
    descripcion_antecedentes: '',
    expedientes_anteriores: [],

    // Con Variaciones - Documentos del Expediente (Elaboración FSR)
    fue_conformidad: [],
    planos_conformidad: [],
    memoria_descriptiva: [],
    cuaderno_obra: [],
    protocolos: [],
    declaraciones_juradas: [],
    sustentos_tecnicos: [],

    // Paso 7: Entrega al Administrado
    fecha_entrega_administrado: '',
    receptor_administrado: '',
    cargo_entrega_administrado: [],
    observaciones_entrega: '',
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Conformidad de Obra' : 'Nueva Conformidad de Obra',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = (field: keyof ConformidadFormData, value: any) => {
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
      case 1: // Modalidad
        if (!formData.modalidad) {
          newErrors.modalidad = 'Debe seleccionar una modalidad';
        }
        break;
      case 2: // Documentos Iniciales
        if (formData.modalidad === 'sin_variaciones') {
          if (formData.licencia_obra_sv.length === 0) {
            newErrors.licencia_obra_sv = 'La licencia de obra es requerida';
          }
          if (formData.planos_aprobados_sv.length === 0) {
            newErrors.planos_aprobados_sv = 'Los planos aprobados son requeridos';
          }
        } else if (formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') {
          if (!formData.servicios_previos_fsr && formData.licencia_obra_cv.length === 0) {
            newErrors.licencia_obra_cv = 'La licencia de obra es requerida';
          }
        }
        break;
      case 3: // Antecedentes
        // Validaciones opcionales para antecedentes
        if (!formData.primer_expediente && !formData.descripcion_antecedentes) {
          newErrors.descripcion_antecedentes = 'La descripción de antecedentes es requerida';
        }
        break;
      case 4: // Documentos Expediente
        if (formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') {
          if (formData.fue_conformidad.length === 0) {
            newErrors.fue_conformidad = 'El FUE de conformidad es requerido';
          }
          if (formData.planos_conformidad.length === 0) {
            newErrors.planos_conformidad = 'Los planos de conformidad son requeridos';
          }
        }
        break;
      case 5: // Verificación
        if (formData.modalidad === 'sin_variaciones' && !formData.fecha_verificacion_sv) {
          newErrors.fecha_verificacion_sv = 'La fecha de verificación es requerida';
        }
        break;
      case 6: // Entrega al Administrado
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
      console.log('Conformidad guardada:', formData);
      navigate('/dashboard/conformidades');
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
            clients={clients || []}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ConformidadFormData, value)}
            title="Paso 1: Seleccionar Administrado"
            description="Seleccione el administrado para este trámite de conformidad de obra"
          />
        );
      case 1:
        return (
          <StepModalidad
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <StepDocumentosIniciales
            formData={formData}
            errors={errors}
            conformidadId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <StepAntecedentes
            formData={formData}
            errors={errors}
            conformidadId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 4:
        return (
          <StepDocumentosExpediente
            formData={formData}
            errors={errors}
            conformidadId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 5:
        return (
          <StepVerificacion
            formData={formData}
            errors={errors}
            conformidadId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 6:
        return (
          <StepCargo
            formData={formData}
            projectId={id || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ConformidadFormData, value)}
            onFileUpload={handleFileUpload}
            title="Entrega de Conformidad de Obra"
            description="Complete la información de la entrega final de la conformidad de obra al administrado"
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
                  onClick={() => navigate('/dashboard/conformidades')}
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
                    onClick={() => navigate('/dashboard/conformidades')}
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
          <ResumenConformidad
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            conformidadId={id || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
