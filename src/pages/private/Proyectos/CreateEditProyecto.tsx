import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button } from '@/components/ui';
import { 
  StepAnteproyecto, 
  StepPredio,
  StepSustentoTecnico
} from '@/components/utils/Steps';
import { useProyectos, useProyectoById } from '@/hooks/useProyectos';
import { useClients } from '@/hooks/useClients';
import { useDepartments, useProvinces, useDistricts } from '@/hooks/useUbigeo';
import { ResumenProyecto } from './components/ResumenProyecto';
import type { ProyectoFormData, FormStep, StepStatus } from '@/types/proyecto.types';
import StepTipoObraProyecto from './components/StepTipoObraProyecto';
import StepAdministrado from './components/StepAdministrado';
import StepArquitectura from './components/StepArquitecturaProyecto';
import StepEstructuras from './components/StepEstructurasProyecto';
import StepSanitarias from './components/StepSanitariasProyecto';
import StepElectricas from './components/StepElectricas';

export default function CreateEditProyecto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { setHeader } = useHeaderStore();
  const { createInitialMutation, updateMutation, uploadSingleDocumentMutation } = useProyectos();
  const { data: proyectoData, isLoading: isLoadingProyecto } = useProyectoById(id || '');
  const { clients } = useClients();

  const [currentStep, setCurrentStep] = useState(0);
  const [proyectoId, setProyectoId] = useState<string>(id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState<Record<number, boolean>>({});

  const [formData, setFormData] = useState<ProyectoFormData>({
    titulo_proyecto: '',
    tipo_proyecto: '',
    descripcion: '',
    tipo_licencia_edificacion: '',
    tipo_modalidad: '',
    link_normativas: '',
    // --- NUEVOS CAMPOS DE CONTROL (Tipo de Obra) ---
    por_etapas: false,
    numero_obras: 0,
    etapa_por_autorizar: false,
    // --- CONTROL MVCS ---
    consulta_mvcs: false,
    // --- FIN NUEVOS CAMPOS ---
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
    area_techada_total_m2: 0,
    area_libre_m2: 0,
    area_libre_porcentaje: 0,
    descripcion_proyecto: '',
    // --- NUEVOS CAMPOS DE EDIFICACIÓN ---
    zonificacion: '',
    numero_sotanos: 0,
    azotea: '',
    semisotano: '',
    uso_edificacion: '',
    // --- FIN NUEVOS CAMPOS ---
    requiere_sustento_legal: false,
    requiere_informe_vinculante: false,
  });

  const { data: departments } = useDepartments();
  const { data: provinces } = useProvinces(formData.departmentId);
  const { data: districts } = useDistricts(formData.provinceId);

  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Anteproyecto Aprobado', completed: false },
    { id: 2, title: 'Documentos', completed: false },
    { id: 3, title: 'Tipo de Obra', completed: false },
    { id: 4, title: 'Predio', completed: false },
    { id: 5, title: 'Arquitectura', completed: false },
    { id: 6, title: 'Estructuras', completed: false },
    { id: 7, title: 'Sanitarias', completed: false },
    { id: 8, title: 'Eléctricas', completed: false },
    { id: 9, title: 'Sustento Técnico', completed: false },
  ]);

  useEffect(() => {
    setHeader(
      isEditing ? 'Editar Proyecto' : 'Elaboracion de Proyecto',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEditing]);

  // Cargar datos para edición
  useEffect(() => {
    if (isEditing && proyectoData && !isLoadingProyecto) {
      const data = proyectoData.data;
      
      const dp = (data as { datos_predio?: { ubicacion?: Record<string, string>; latitud?: number; longitud?: number; medidas_perimetricas?: Record<string, number>; edificacion?: Record<string, string | number> } }).datos_predio;
      const u = dp?.ubicacion;
      const m = dp?.medidas_perimetricas;
      const e = dp?.edificacion;
      const ln = data.licencias_normativas;
      
      setFormData(prev => ({
        ...prev,
        titulo_proyecto: data.titulo_proyecto || '',
        tipo_proyecto: data.tipo_proyecto || '',
        descripcion: data.descripcion || '',
        anteproyecto_importado_id: data.anteproyecto_importado_id,
        selectedAnteproyecto: data.anteproyecto_importado,
        tipo_licencia_edificacion: ln?.tipo_licencia_edificacion || '',
        tipo_modalidad: ln?.tipo_modalidad || '',
        link_normativas: ln?.link_normativas || '',
        // --- NUEVOS CAMPOS DE CONTROL (Tipo de Obra) ---
        por_etapas: ln?.por_etapas || false,
        numero_obras: ln?.numero_obras || 0,
        etapa_por_autorizar: ln?.etapa_por_autorizar || false,
        // --- CONTROL MVCS ---
        consulta_mvcs: ln?.consulta_mvcs || false,
        // --- FIN NUEVOS CAMPOS ---
        departmentId: u?.departmentId || '',
        provinceId: u?.provinceId || '',
        districtId: u?.districtId || '',
        urbanization: u?.urbanization || '',
        mz: u?.mz || '',
        lote: u?.lote || '',
        subLote: u?.subLote || '',
        street: u?.street || '',
        number: u?.number || '',
        interior: u?.interior || '',
        latitud: dp?.latitud ?? 0,
        longitud: dp?.longitud ?? 0,
        area_total_m2: m?.area_total_m2 ?? 0,
        frente: m?.frente ?? 0,
        derecha: m?.derecha ?? 0,
        izquierda: m?.izquierda ?? 0,
        fondo: m?.fondo ?? 0,
        tipo_edificacion: (e?.tipo_edificacion as string) || '',
        numero_pisos: (e?.numero_pisos as number) ?? 0,
        area_techada_total_m2: (e?.area_techada_total_m2 as number) ?? 0,
        area_libre_m2: (e?.area_libre_m2 as number) ?? 0,
        area_libre_porcentaje: (e?.area_libre_porcentaje as number) ?? 0,
        descripcion_proyecto: (e?.descripcion_proyecto as string) || '',
        // --- NUEVOS CAMPOS DE EDIFICACIÓN ---
        zonificacion: (e?.zonificacion as string) || '',
        numero_sotanos: (e?.numero_sotanos as number) ?? 0,
        azotea: (e?.azotea as string) || '',
        semisotano: (e?.semisotano as string) || '',
        uso_edificacion: (e?.uso_edificacion as string) || '',
        // --- FIN NUEVOS CAMPOS ---
        requiere_sustento_legal: data.sustento_tecnico?.requiere_sustento_legal || false,
        requiere_informe_vinculante: data.sustento_tecnico?.requiere_informe_vinculante || false,
      }));

      // Si existe steps_status, usar esa información para determinar el paso actual y estados
      if (proyectoData.steps_status) {
        const completedSteps = determineCompletedSteps(proyectoData.steps_status);
        const currentStepIndex = determineCurrentStep(proyectoData.steps_status);
        
        setSteps(completedSteps);
        setCurrentStep(currentStepIndex);
      }
    }
  }, [isEditing, proyectoData, isLoadingProyecto, clients]);

  const handleInputChange = (field: keyof ProyectoFormData, value: any) => {
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
      case 0: // Anteproyecto
        if (!formData.selectedAnteproyecto && !formData.titulo_proyecto) {
          newErrors.titulo_proyecto = 'Debe seleccionar un anteproyecto o ingresar un título';
        }
        if (!formData.selectedAnteproyecto && !formData.tipo_proyecto) {
          newErrors.tipo_proyecto = 'Tipo de proyecto es requerido';
        }
        break;
      
      case 1: // Documentos Administrado
        // Los documentos son opcionales para avanzar
        break;

      case 2: // Tipo de Obra / Licencias
        if (!formData.tipo_licencia_edificacion) newErrors.tipo_licencia_edificacion = 'Tipo de licencia es requerido';
        if (!formData.tipo_modalidad) newErrors.tipo_modalidad = 'Tipo de modalidad es requerido';
        break;

      case 3: // Predio
        if (!formData.departmentId) newErrors.departmentId = 'Departamento es requerido';
        if (!formData.provinceId) newErrors.provinceId = 'Provincia es requerida';
        if (!formData.districtId) newErrors.districtId = 'Distrito es requerido';
        if (!formData.urbanization) newErrors.urbanization = 'Urbanización es requerida';
        if (!formData.street) newErrors.street = 'Vía es requerida';
        if (!formData.area_total_m2 || formData.area_total_m2 <= 0) newErrors.area_total_m2 = 'Área total es requerida';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    try {
      // Paso 1: Crear proyecto solo con datos básicos
      if (currentStep === 0 && !isEditing) {
        const createData = {
          client_id: formData.selectedClient?.id || formData.selectedAnteproyecto?.client_id || '',
          data: {
            service_type: 'proyecto',
            titulo_proyecto: formData.titulo_proyecto || formData.selectedAnteproyecto?.nombre_proyecto || '',
            tipo_proyecto: formData.tipo_proyecto || formData.selectedAnteproyecto?.tipo_proyecto || '',
            descripcion: formData.descripcion || formData.selectedAnteproyecto?.descripcion || '',
            anteproyecto_importado_id: formData.anteproyecto_importado_id,
          },
        };

        const result = await createInitialMutation.mutateAsync(createData);
        setProyectoId(result.id);
      }
      
      // Paso 2: Documentos Administrado (no requiere actualización de datos)
      // Los documentos se suben individualmente con handleFileUpload

      // Paso 3: Actualizar datos de licencia (solo si hay cambios)
      else if (currentStep === 2 && proyectoId && hasChanges[currentStep]) {
        const updateData = {
          id: proyectoId,
          client_id: formData.selectedClient?.id || formData.selectedAnteproyecto?.client_id || '',
          data: {
            licencias_normativas: {
              tipo_licencia_edificacion: formData.tipo_licencia_edificacion,
              tipo_modalidad: formData.tipo_modalidad,
              link_normativas: formData.link_normativas,
              // --- NUEVOS CAMPOS DE CONTROL ---
              por_etapas: formData.por_etapas,
              numero_obras: formData.numero_obras,
              etapa_por_autorizar: formData.etapa_por_autorizar,
              // --- CONTROL MVCS ---
              consulta_mvcs: formData.consulta_mvcs,
            },
          },
        };

        await updateMutation.mutateAsync(updateData);
      }

      // Paso 4: Actualizar datos del predio (solo si hay cambios)
      else if (currentStep === 3 && proyectoId && hasChanges[currentStep]) {
        const updateData = {
          id: proyectoId,
          client_id: formData.selectedClient?.id || formData.selectedAnteproyecto?.client_id || '',
          data: {
            datos_predio: {
              ubicacion: {
                departmentId: formData.departmentId,
                provinceId: formData.provinceId,
                districtId: formData.districtId,
                urbanization: formData.urbanization,
                mz: formData.mz,
                lote: formData.lote,
                subLote: formData.subLote,
                street: formData.street,
                number: formData.number,
                interior: formData.interior,
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
                area_techada_total_m2: formData.area_techada_total_m2,
                area_libre_m2: formData.area_libre_m2,
                area_libre_porcentaje: formData.area_libre_porcentaje,
                descripcion_proyecto: formData.descripcion_proyecto,
                // --- NUEVOS CAMPOS DE EDIFICACIÓN ---
                zonificacion: formData.zonificacion,
                numero_sotanos: formData.numero_sotanos,
                azotea: formData.azotea,
                semisotano: formData.semisotano,
                uso_edificacion: formData.uso_edificacion,
              },
            },
          },
        };
        await updateMutation.mutateAsync(updateData as any);
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
    if (!proyectoId) {
      throw new Error('No hay proyecto ID disponible');
    }
    
    return uploadSingleDocumentMutation.mutateAsync({
      id: proyectoId,
      file,
      documentKey
    });
  };

  // Función para determinar el paso actual basado en el estado de los pasos
  const determineCurrentStep = (stepStatus: StepStatus): number => {
    const stepMapping: Record<string, number> = {
      'anteproyecto': 0,
      'documentos_administrado': 1,
      'licencias_normativas': 2,
      'predio': 3,
      'arquitectura': 4,
      'estructuras': 5,
      'sanitarias': 6,
      'electricas': 7,
      'sustento_tecnico': 8
    };

    // Encontrar el primer paso pendiente
    for (const [stepKey, stepIndex] of Object.entries(stepMapping)) {
      if (stepStatus[stepKey as keyof StepStatus] === 'Pendiente') {
        return stepIndex;
      }
    }
    
    // Si todos están completados, ir al último paso
    return 8;
  };

  // Función para determinar qué pasos están completados
  const determineCompletedSteps = (stepStatus: StepStatus): FormStep[] => {
    const baseSteps = [
      { id: 1, title: 'Anteproyecto Aprobado', completed: false },
      { id: 2, title: 'Documentos', completed: false },
      { id: 3, title: 'Tipo de Obra', completed: false },
      { id: 4, title: 'Predio', completed: false },
      { id: 5, title: 'Arquitectura', completed: false },
      { id: 6, title: 'Estructuras', completed: false },
      { id: 7, title: 'Sanitarias', completed: false },
      { id: 8, title: 'Eléctricas', completed: false },
      { id: 9, title: 'Sustento Técnico', completed: false },
    ];

    return baseSteps.map((step, index) => {
      const stepKeys = ['anteproyecto', 'documentos_administrado', 'licencias_normativas', 'predio', 'arquitectura', 'estructuras', 'sanitarias', 'electricas', 'sustento_tecnico'];
      const stepKey = stepKeys[index] as keyof StepStatus;
      
      return {
        ...step,
        completed: stepStatus[stepKey] === 'Completada'
      };
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/proyectos');
  };

  const handleSaveProyecto = () => {
    // Lógica para guardar el proyecto completo
    console.log('Guardando proyecto...');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Anteproyecto
        return (
          <StepAnteproyecto
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );

      case 1: // Documentos Administrado
        return (
          <StepAdministrado
            formData={formData}
            proyectoId={proyectoId}
            uploadedDocuments={proyectoData?.uploaded_documents || []}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 2: // Tipo de Obra / Licencias
        return (
          <StepTipoObraProyecto
            formData={formData}
            errors={errors}
            proyectoId={proyectoId}
            uploadedDocuments={proyectoData?.uploaded_documents || []}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 3: // Predio
        return (
          <StepPredio
            formData={formData as any}
            errors={errors}
            departments={departments}
            provinces={provinces}
            districts={districts}
            onInputChange={(field, value) => handleInputChange(field as keyof ProyectoFormData, value)}
            showProyectoFields={true}
          />
        );

      case 4: // Arquitectura
        return (
          <StepArquitectura
            formData={formData}
            proyectoId={proyectoId}
            uploadedDocuments={proyectoData?.uploaded_documents || []}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 5: // Estructuras
        return (
          <StepEstructuras
            formData={formData}
            proyectoId={proyectoId}
            uploadedDocuments={proyectoData?.uploaded_documents || []}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 6: // Sanitarias
        return (
          <StepSanitarias
            formData={formData}
            proyectoId={proyectoId}
            uploadedDocuments={proyectoData?.uploaded_documents || []}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 7: // Eléctricas
        return (
          <StepElectricas
            formData={formData}
            proyectoId={proyectoId}
            uploadedDocuments={proyectoData?.uploaded_documents || []}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 8: // Sustento Técnico
        return (
          <StepSustentoTecnico
            formData={formData}
            proyectoId={proyectoId}
            uploadedDocuments={proyectoData?.uploaded_documents || []}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      default:
        return null;
    }
  };

  const getStepTitle = (index: number): string => {
    const titles = ['Anteproyecto', 'Documentos', 'Tipo de Obra', 'Predio', 'Arquitectura', 'Estructuras', 'Sanitarias', 'Eléctricas', 'Sustento Técnico'];
    return titles[index] || '';
  };

  if (isLoadingProyecto) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Cargando proyecto...</p>
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
                  disabled={createInitialMutation.isPending || updateMutation.isPending}
                >
                  {(createInitialMutation.isPending || updateMutation.isPending) ? 'Guardando...' : 
                   `Siguiente: ${getStepTitle(currentStep + 1)}`}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/dashboard/proyectos')}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className="text-white hover:opacity-90"
                >
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Resumen del proyecto */}
        <div className="w-80 flex-shrink-0">
          <ResumenProyecto
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            proyectoId={proyectoId}
            onSave={handleSaveProyecto}
            isSaving={false}
            uploadedDocuments={proyectoData?.uploaded_documents || []}
          />
        </div>
      </div>
    </div>
  );
}

