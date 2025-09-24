import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button } from '@/components/ui';
import { StepAdministrado, StepLicencia, StepPredio, StepDocumentos } from '@/components/utils/Steps';
import { useAnteproyectos, useAnteproyectoById } from '@/hooks/useAnteproyectos';
import { useClients } from '@/hooks/useClients';
import { useDepartments, useProvinces, useDistricts } from '@/hooks/useUbigeo';
import { ResumenExpediente } from './components/ResumenExpediente';
import type { AnteproyectoFormData, FormStep, StepStatus } from '@/types/anteproyecto.types';
import { DocumentStatus } from '@/types/anteproyecto.types';

export default function CreateEditAnteproyecto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { setHeader } = useHeaderStore();
  const { createInitialMutation, updateMutation, uploadSingleDocumentMutation } = useAnteproyectos();
  const { data: anteproyectoData, isLoading: isLoadingAnteproyecto } = useAnteproyectoById(id || '');
  const { clients } = useClients();

  const [currentStep, setCurrentStep] = useState(0);
  const [anteproyectoId, setAnteproyectoId] = useState<string>(id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState<Record<number, boolean>>({});

  const [formData, setFormData] = useState<AnteproyectoFormData>({
    selectedClient: null,
    tipo_licencia_edificacion: '',
    tipo_modalidad: '',
    link_normativas: '',
    departmentId: '',
    provinceId: '',
    districtId: '',
    urbanization: '',
    mz: '',
    lote: '',
    subLote: '',
    street: '',
    number: '',
    interior: '',
    latitud: 0,
    longitud: 0,
    area_total_m2: 0,
    frente: 0,
    derecha: 0,
    izquierda: 0,
    fondo: 0,
    tipo_edificacion: '',
    numero_pisos: 0,
    descripcion_proyecto: '',
  });

  const { data: departments } = useDepartments();
  const { data: provinces } = useProvinces(formData.departmentId);
  const { data: districts } = useDistricts(formData.provinceId);

  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Licencias/Normativas', completed: false },
    { id: 3, title: 'Predio', completed: false },
    { id: 4, title: 'Documentos', completed: false },
  ]);

  useEffect(() => {
    setHeader(
      isEditing ? 'Editar Anteproyecto' : 'Nuevo Anteproyecto',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEditing]);

  // Cargar datos para edición
  useEffect(() => {
    if (isEditing && anteproyectoData && !isLoadingAnteproyecto) {
      const data = anteproyectoData.data;
      
      setFormData({
        selectedClient: null, // Se cargará cuando tengamos los clients
        tipo_licencia_edificacion: data.licencias_normativas?.tipo_licencia_edificacion || '',
        tipo_modalidad: data.licencias_normativas?.tipo_modalidad || '',
        link_normativas: data.licencias_normativas?.link_normativas || '',
        departmentId: data.datos_predio?.ubicacion?.departmentId || '',
        provinceId: data.datos_predio?.ubicacion?.provinceId || '',
        districtId: data.datos_predio?.ubicacion?.districtId || '',
        urbanization: data.datos_predio?.ubicacion?.urbanization || '',
        mz: data.datos_predio?.ubicacion?.mz || '',
        lote: data.datos_predio?.ubicacion?.lote || '',
        subLote: data.datos_predio?.ubicacion?.subLote || '',
        street: data.datos_predio?.ubicacion?.street || '',
        number: data.datos_predio?.ubicacion?.number || '',
        interior: data.datos_predio?.ubicacion?.interior || '',
        latitud: data.datos_predio?.latitud || 0,
        longitud: data.datos_predio?.longitud || 0,
        area_total_m2: data.datos_predio?.medidas_perimetricas?.area_total_m2 || 0,
        frente: data.datos_predio?.medidas_perimetricas?.frente || 0,
        derecha: data.datos_predio?.medidas_perimetricas?.derecha || 0,
        izquierda: data.datos_predio?.medidas_perimetricas?.izquierda || 0,
        fondo: data.datos_predio?.medidas_perimetricas?.fondo || 0,
        tipo_edificacion: data.datos_predio?.edificacion?.tipo_edificacion || '',
        numero_pisos: data.datos_predio?.edificacion?.numero_pisos || 0,
        descripcion_proyecto: data.datos_predio?.edificacion?.descripcion_proyecto || '',
      });

      // Buscar cliente correspondiente
      if (clients && anteproyectoData.client_id) {
        const client = clients.find(c => c.id === anteproyectoData.client_id);
        if (client) {
          setFormData(prev => ({ ...prev, selectedClient: client }));
        }
      }

      // Si existe steps_status, usar esa información para determinar el paso actual y estados
      if (anteproyectoData.steps_status) {
        const completedSteps = determineCompletedSteps(anteproyectoData.steps_status);
        const currentStepIndex = determineCurrentStep(anteproyectoData.steps_status);
        
        setSteps(completedSteps);
        setCurrentStep(currentStepIndex);
      } else {
        // Fallback: marcar todos como completados si no hay steps_status
        setSteps(prev => prev.map(step => ({ ...step, completed: true })));
        setCurrentStep(3); // Ir al último paso por defecto
      }
    }
  }, [isEditing, anteproyectoData, isLoadingAnteproyecto, clients]);

  const handleInputChange = (field: keyof AnteproyectoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Marcar que hay cambios en el paso actual
    setHasChanges(prev => ({ ...prev, [currentStep]: true }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Datos del Administrado
        if (!formData.selectedClient) newErrors.selectedClient = 'Debe seleccionar un administrado';
        break;
      
      case 1: // Datos de Licencia
        if (!formData.tipo_licencia_edificacion) newErrors.tipo_licencia_edificacion = 'Tipo de licencia es requerido';
        if (!formData.tipo_modalidad) newErrors.tipo_modalidad = 'Tipo de modalidad es requerido';
        break;
      
      case 2: // Predio
        if (!formData.departmentId) newErrors.departmentId = 'Departamento es requerido';
        if (!formData.provinceId) newErrors.provinceId = 'Provincia es requerida';
        if (!formData.districtId) newErrors.districtId = 'Distrito es requerido';
        if (!formData.street) newErrors.street = 'Calle es requerida';
        if (!formData.area_total_m2) newErrors.area_total_m2 = 'Área total es requerida';
        if (!formData.tipo_edificacion) newErrors.tipo_edificacion = 'Tipo de edificación es requerido';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    try {
      // Paso 1: Crear anteproyecto solo con datos del administrado (o actualizar si está editando)
      if (currentStep === 0 && !isEditing && formData.selectedClient) {
        const createData = {
          client_id: formData.selectedClient.id,
          data: {
            service_type: 'anteproyecto',
            nombre_proyecto: `Proyecto ${formData.selectedClient.businessName || 
              `${formData.selectedClient.names} ${formData.selectedClient.paternalSurname}`.trim()}`,
          },
        };

        const result = await createInitialMutation.mutateAsync(createData);
        setAnteproyectoId(result.id);
      }
      // Paso 1: Si está editando y hay cambios en el administrado (cambio de cliente)
      else if (currentStep === 0 && isEditing && anteproyectoId && hasChanges[currentStep]) {
        // En este caso podríamos actualizar el client_id, pero generalmente no se permite cambiar el cliente
        // Por ahora solo avanzamos sin hacer PATCH
        console.log('Cambios en administrado durante edición - no se actualiza el cliente');
      }
      
      // Paso 2: Actualizar solo datos de licencia (solo si hay cambios)
      else if (currentStep === 1 && anteproyectoId && hasChanges[currentStep]) {
        const updateData = {
          id: anteproyectoId,
          client_id: formData.selectedClient?.id || '',
          data: {
            licencias_normativas: {
              tipo_licencia_edificacion: formData.tipo_licencia_edificacion,
              tipo_modalidad: formData.tipo_modalidad,
              link_normativas: formData.link_normativas,
              archivo_normativo: {
                name: formData.archivo_normativo?.name || '',
                is_mandatory: true,
                status: DocumentStatus.PENDIENTE,
                file_reference: '',
                emission_date: new Date().toISOString().split('T')[0],
                observation: '',
              },
            },
          },
        };

        await updateMutation.mutateAsync(updateData);
      }
      
      // Paso 3: Actualizar solo datos del predio (solo si hay cambios)
      else if (currentStep === 2 && anteproyectoId && hasChanges[currentStep]) {
        const updateData = {
          id: anteproyectoId,
          client_id: formData.selectedClient?.id || '',
          data: {
            datos_predio: {
              ubicacion: {
                urbanization: formData.urbanization,
                mz: formData.mz,
                lote: formData.lote,
                subLote: formData.subLote,
                street: formData.street,
                number: formData.number,
                interior: formData.interior,
                departmentId: formData.departmentId,
                provinceId: formData.provinceId,
                districtId: formData.districtId,
              },
              latitud: formData.latitud,
              longitud: formData.longitud,
              medidas_perimetricas: {
                area_total_m2: formData.area_total_m2,
                frente: formData.frente,
                derecha: formData.derecha,
                izquierda: formData.izquierda,
                fondo: formData.fondo,
              },
              edificacion: {
                tipo_edificacion: formData.tipo_edificacion,
                numero_pisos: formData.numero_pisos,
                descripcion_proyecto: formData.descripcion_proyecto,
              },
            },
          },
        };

        await updateMutation.mutateAsync(updateData);
      }

      // Marcar paso como completado
      setSteps(prev => prev.map(step => 
        step.id === currentStep + 1 ? { ...step, completed: true } : step
      ));

      // Limpiar flag de cambios para el paso actual
      setHasChanges(prev => ({ ...prev, [currentStep]: false }));

      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } catch (error) {
      // El error ya se maneja en las mutaciones
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

  const handleFileUpload = async (file: File, documentKey: string): Promise<any> => {
    if (!anteproyectoId) {
      throw new Error('No hay anteproyecto ID disponible');
    }
    
    return uploadSingleDocumentMutation.mutateAsync({
      id: anteproyectoId,
      file,
      documentKey
    });
  };

  // Función para determinar el paso actual basado en el estado de los pasos
  const determineCurrentStep = (stepStatus: StepStatus): number => {
    const stepMapping = {
      'datos_administrado': 0,
      'licencias_normativas': 1,
      'datos_predio': 2,
      'documentos': 3
    };

    // Encontrar el primer paso pendiente
    for (const [stepKey, stepIndex] of Object.entries(stepMapping)) {
      if (stepStatus[stepKey as keyof StepStatus] === 'Pendiente') {
        return stepIndex;
      }
    }
    
    // Si todos están completados, ir al último paso
    return 3;
  };

  // Función para determinar qué pasos están completados
  const determineCompletedSteps = (stepStatus: StepStatus): FormStep[] => {
    const baseSteps = [
      { id: 1, title: 'Administrado', completed: false },
      { id: 2, title: 'Licencias/Normativas', completed: false },
      { id: 3, title: 'Predio', completed: false },
      { id: 4, title: 'Documentos', completed: false },
    ];

    return baseSteps.map((step, index) => {
      const stepKeys = ['datos_administrado', 'licencias_normativas', 'datos_predio', 'documentos'];
      const stepKey = stepKeys[index] as keyof StepStatus;
      
      return {
        ...step,
        completed: stepStatus[stepKey] === 'Completada'
      };
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/anteproyectos');
  };

  const handleSaveExpediente = () => {
    // Lógica para guardar el expediente completo
    console.log('Guardando expediente...');
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Datos del Administrado
        return (
          <StepAdministrado
            formData={formData}
            clients={clients}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof AnteproyectoFormData, value)}
          />
        );

      case 1: // Licencia
        return (
          <StepLicencia
            formData={formData}
            errors={errors}
            anteproyectoId={anteproyectoId}
            uploadedDocuments={anteproyectoData?.uploaded_documents || []}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 2: // Predio
        return (
          <StepPredio
            formData={formData}
            errors={errors}
            departments={departments}
            provinces={provinces}
            districts={districts}
            onInputChange={handleInputChange}
          />
        );

      case 3: // Documentos
        return (
          <StepDocumentos
            formData={formData}
            anteproyectoId={anteproyectoId}
            uploadedDocuments={anteproyectoData?.uploaded_documents || []}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      default:
        return null;
    }
  };

  if (isLoadingAnteproyecto) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Cargando anteproyecto...</p>
        </div>
      </div>
    );
  }

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
                  Anterior: {currentStep === 1 ? 'Administrado' : currentStep === 2 ? 'Licencia' : 'Predio'}
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
                  disabled={createInitialMutation.isPending || updateMutation.isPending}
                >
                  {(createInitialMutation.isPending || updateMutation.isPending) ? 'Guardando...' : 
                   `Siguiente: ${currentStep === 0 ? 'Licencia' : currentStep === 1 ? 'Predio' : 'Documentos'}`}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/dashboard/anteproyectos')}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className="text-white hover:opacity-90"
                >
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Resumen del expediente */}
        <div className="w-80 flex-shrink-0">
          <ResumenExpediente
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            expedienteId={anteproyectoId}
            onSave={handleSaveExpediente}
            isSaving={false}
            uploadedDocuments={anteproyectoData?.uploaded_documents || []}
          />
        </div>
      </div>
    </div>
  );
}
