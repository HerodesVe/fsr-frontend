import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button } from '@/components/ui';
import { 
  StepSeleccionAnteproyecto,
  StepPresentacionMunicipal,
  StepSeguimientoRespuesta,
  StepEntregaFinal
} from './StepGestionAnteproyecto';
import { ResumenGestionAnteproyecto } from './components/ResumenGestionAnteproyecto';
import type { GestionAnteproyectoFormData, FormStep } from '@/types/gestionAnteproyecto.types';

export default function CreateEditGestionAnteproyecto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { setHeader } = useHeaderStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [gestionId] = useState<string>(id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<GestionAnteproyectoFormData>({
    selectedAnteproyecto: null,
    fecha_ingreso: '',
    numero_expediente: '',
    fecha_respuesta: '',
    resultado_acta: null,
  });

  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Selección Anteproyecto', completed: false },
    { id: 2, title: 'Presentación Municipal', completed: false },
    { id: 3, title: 'Seguimiento', completed: false },
    { id: 4, title: 'Entrega Final', completed: false },
  ]);

  useEffect(() => {
    setHeader(
      isEditing ? 'Editar Gestión de Anteproyecto' : 'Nueva Gestión de Anteproyecto',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEditing]);

  const handleInputChange = (field: keyof GestionAnteproyectoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Marcar que hay cambios en el paso actual
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Selección Anteproyecto
        if (!formData.selectedAnteproyecto) {
          newErrors.selectedAnteproyecto = 'Debe seleccionar un anteproyecto o cargar documentos externos';
        }
        break;
      
      case 1: // Presentación Municipal
        if (!formData.fecha_ingreso) newErrors.fecha_ingreso = 'Fecha de ingreso es requerida';
        if (!formData.numero_expediente) newErrors.numero_expediente = 'Número de expediente es requerido';
        if (!formData.archivo_cargo) newErrors.archivo_cargo = 'Archivo del cargo es requerido';
        break;
      
      case 2: // Seguimiento
        if (!formData.fecha_respuesta) newErrors.fecha_respuesta = 'Fecha de respuesta es requerida';
        if (!formData.archivo_respuesta) newErrors.archivo_respuesta = 'Archivo de respuesta es requerido';
        if (!formData.resultado_acta) newErrors.resultado_acta = 'Debe seleccionar el resultado del acta';
        break;
      
      case 3: // Entrega Final
        if (!formData.carta_conformidad) newErrors.carta_conformidad = 'Carta de conformidad es requerida';
        if (!formData.acta_final) newErrors.acta_final = 'Acta final es requerida';
        if (!formData.fue_aprobado) newErrors.fue_aprobado = 'FUE aprobado es requerido';
        if (!formData.planos_aprobados) newErrors.planos_aprobados = 'Planos aprobados son requeridos';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    try {
      // Simular guardado de datos
      console.log('Guardando paso:', currentStep, formData);

      // Marcar paso como completado
      setSteps(prev => prev.map(step => 
        step.id === currentStep + 1 ? { ...step, completed: true } : step
      ));

      // Limpiar flag de cambios para el paso actual

      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } catch (error) {
      console.error('Error guardando:', error);
      return;
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
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

  const handleFileUpload = async (file: File, _documentKey: string): Promise<any> => {
    // Simular upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
        });
      }, 1000);
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/gestion-anteproyectos');
  };

  const handleSaveGestion = () => {
    console.log('Guardando gestión completa...');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Selección Anteproyecto
        return (
          <StepSeleccionAnteproyecto
            formData={formData}
            gestionId={gestionId}
            uploadedDocuments={[]}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 1: // Presentación Municipal
        return (
          <StepPresentacionMunicipal
            formData={formData}
            errors={errors}
            gestionId={gestionId}
            uploadedDocuments={[]}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 2: // Seguimiento
        return (
          <StepSeguimientoRespuesta
            formData={formData}
            errors={errors}
            gestionId={gestionId}
            uploadedDocuments={[]}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 3: // Entrega Final
        return (
          <StepEntregaFinal
            formData={formData}
            errors={errors}
            gestionId={gestionId}
            uploadedDocuments={[]}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      default:
        return null;
    }
  };

  const getStepTitle = (index: number): string => {
    const titles = ['Selección', 'Presentación', 'Seguimiento', 'Entrega Final'];
    return titles[index] || '';
  };

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Contenido principal */}
        <div className="flex-1">
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

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            {renderStepContent()}
          </div>

          {/* Navegación entre pasos */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentStep > 0 && (
                <Button
                  variant="bordered"
                  onClick={handlePrevious}
                  startContent={<LuArrowLeft className="w-4 h-4" />}
                >
                  Anterior: {getStepTitle(currentStep - 1)}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="bordered"
                onClick={handleCancel}
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
                >
                  Siguiente: {getStepTitle(currentStep + 1)}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/dashboard/gestion-anteproyectos')}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className="text-white hover:opacity-90"
                >
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Resumen de la gestión */}
        <div className="w-80 flex-shrink-0">
          <ResumenGestionAnteproyecto
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            gestionId={gestionId}
            onSave={handleSaveGestion}
            isSaving={false}
            uploadedDocuments={[]}
          />
        </div>
      </div>
    </div>
  );
}
