import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button } from '@/components/ui';
import { 
  StepSeleccionProyecto,
  StepGestionEspecialidades,
  StepEmisionLicencia
} from './StepGestionProyecto';
import { ResumenGestionProyecto } from './components/ResumenGestionProyecto';
import type { GestionProyectoFormData, FormStep } from '@/types/gestionProyecto.types';

export default function CreateEditGestionProyecto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { setHeader } = useHeaderStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [gestionId] = useState<string>(id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<GestionProyectoFormData>({
    selectedProyecto: null,
    especialidades: {
      arquitectura: { es_conforme: false, revision_count: 0, resultado_acta: null },
      estructuras: { es_conforme: false, revision_count: 0, resultado_acta: null },
      electricas: { es_conforme: false, revision_count: 0, resultado_acta: null },
      sanitarias: { es_conforme: false, revision_count: 0, resultado_acta: null }
    }
  });

  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Selección Proyecto', completed: false },
    { id: 2, title: 'Gestión Especialidades', completed: false },
    { id: 3, title: 'Emisión Licencia', completed: false },
  ]);

  useEffect(() => {
    setHeader(
      isEditing ? 'Editar Gestión de Proyecto' : 'Nueva Gestión de Proyecto',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEditing]);

  const handleInputChange = (field: keyof GestionProyectoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Marcar que hay cambios en el paso actual
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Selección Proyecto
        if (!formData.selectedProyecto) {
          newErrors.selectedProyecto = 'Debe seleccionar un proyecto o cargar documentos externos';
        }
        break;
      
      case 1: // Gestión Especialidades
        // Validar que al menos arquitectura tenga datos
        const arq = formData.especialidades.arquitectura;
        if (!arq.fecha_respuesta) {
          newErrors['arquitectura.fecha_respuesta'] = 'Fecha de respuesta de arquitectura es requerida';
        }
        if (!arq.resultado_acta) {
          newErrors['arquitectura.resultado_acta'] = 'Debe seleccionar el resultado del acta de arquitectura';
        }
        break;
      
      case 2: // Emisión Licencia
        // Verificar que todas las especialidades estén conformes
        const especialidades = ['arquitectura', 'estructuras', 'electricas', 'sanitarias'] as const;
        const todasConformes = especialidades.every(esp => formData.especialidades[esp].es_conforme);
        
        if (!todasConformes) {
          newErrors.especialidades = 'Todas las especialidades deben estar conformes para emitir la licencia';
        }
        if (!formData.licencia_final) {
          newErrors.licencia_final = 'Licencia final es requerida';
        }
        if (!formData.cargo_entrega_administrado) {
          newErrors.cargo_entrega_administrado = 'Cargo de entrega es requerido';
        }
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
    // Para el último paso (emisión de licencia), verificar que todas las especialidades estén conformes
    else if (stepIndex === 2) {
      const especialidades = ['arquitectura', 'estructuras', 'electricas', 'sanitarias'] as const;
      const todasConformes = especialidades.every(esp => formData.especialidades[esp].es_conforme);
      if (todasConformes) {
        setCurrentStep(stepIndex);
      }
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
    navigate('/dashboard/gestion-proyectos');
  };

  const handleSaveGestion = () => {
    console.log('Guardando gestión completa...');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Selección Proyecto
        return (
          <StepSeleccionProyecto
            formData={formData}
            gestionId={gestionId}
            uploadedDocuments={[]}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 1: // Gestión Especialidades
        return (
          <StepGestionEspecialidades
            formData={formData}
            errors={errors}
            gestionId={gestionId}
            uploadedDocuments={[]}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 2: // Emisión Licencia
        return (
          <StepEmisionLicencia
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
    const titles = ['Selección', 'Especialidades', 'Emisión'];
    return titles[index] || '';
  };

  // Verificar si el paso de emisión debe estar habilitado
  const isEmisionEnabled = () => {
    const especialidades = ['arquitectura', 'estructuras', 'electricas', 'sanitarias'] as const;
    return especialidades.every(esp => formData.especialidades[esp].es_conforme);
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
                      : index === 2 && !isEmisionEnabled()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      : index > currentStep && index !== currentStep + 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  disabled={
                    (index > currentStep && !step.completed && index !== currentStep + 1) ||
                    (index === 2 && !isEmisionEnabled())
                  }
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
                  disabled={currentStep === 1 && !isEmisionEnabled() && currentStep + 1 === 2}
                >
                  Siguiente: {getStepTitle(currentStep + 1)}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/dashboard/gestion-proyectos')}
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
          <ResumenGestionProyecto
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
