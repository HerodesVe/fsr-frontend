import { useState, useEffect, useCallback } from 'react';
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
import { useGestionProyecto } from '@/hooks/useGestionProyectos';
import { generateDocumentKey } from '@/services/gestionProyectos.service';
import type { GestionProyectoFormData, FormStep, EspecialidadData } from '@/types/gestionProyecto.types';

export default function CreateEditGestionProyecto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id && id !== 'new';
  
  const { setHeader } = useHeaderStore();

  // Hook para gestión de proyecto con API
  const {
    gestionProyecto,
    isLoading,
    createNew,
    update,
    uploadDocs,
    isCreating,
    isUpdating,
    isUploading,
  } = useGestionProyecto(id);

  const [currentStep, setCurrentStep] = useState(0);
  const [gestionId, setGestionId] = useState<string>(id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

  // Estado inicial de especialidad
  const createInitialEspecialidad = (): EspecialidadData => ({
    revisiones: [],
    revision_actual_index: -1,
    es_conforme: false,
    es_improcedente: false,
    estado: 'pendiente' as const,
    revision_count: 0,
    resultado_acta: null,
  });

  const [formData, setFormData] = useState<GestionProyectoFormData>({
    selectedProyecto: null,
    especialidades: {
      arquitectura: createInitialEspecialidad(),
      estructuras: createInitialEspecialidad(),
      electricas: createInitialEspecialidad(),
      sanitarias: createInitialEspecialidad(),
    },
    revisiones_globales_usadas: 0,
    estado_proyecto: 'en_proceso',
  });

  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Selección Proyecto', completed: false },
    { id: 2, title: 'Gestión Especialidades', completed: false },
    { id: 3, title: 'Emisión Licencia', completed: false },
  ]);

  // Cargar datos del backend cuando se está editando
  useEffect(() => {
    if (gestionProyecto && isEditing) {
      const backendData = gestionProyecto.data;
      
      // Mapear datos del backend al formato del frontend
      const mappedEspecialidades = {
        arquitectura: mapEspecialidadFromBackend(backendData.especialidades?.arquitectura),
        estructuras: mapEspecialidadFromBackend(backendData.especialidades?.estructuras),
        electricas: mapEspecialidadFromBackend(backendData.especialidades?.electricas),
        sanitarias: mapEspecialidadFromBackend(backendData.especialidades?.sanitarias),
      };

      setFormData({
        ...formData,
        selectedProyecto: backendData.selectedProyecto || { titulo: backendData.nombre_proyecto },
        especialidades: mappedEspecialidades,
        revisiones_globales_usadas: backendData.revisiones_globales_usadas || 0,
        estado_proyecto: backendData.estado_proyecto || 'en_proceso',
      });

      // Cargar documentos subidos
      if (gestionProyecto.uploaded_documents) {
        setUploadedDocuments(gestionProyecto.uploaded_documents.map(doc => ({
          ...doc,
          id: doc.file_id,
        })));
      }
    }
  }, [gestionProyecto, isEditing]);

  // Función para mapear especialidad del backend al frontend
  const mapEspecialidadFromBackend = (backendEsp: any): EspecialidadData => {
    if (!backendEsp) return createInitialEspecialidad();

    const revisiones = backendEsp.revisiones || [];
    const ultimaRevision = revisiones[revisiones.length - 1];
    
    return {
      revisiones: revisiones.map((rev: any) => ({
        ...rev,
        notificacion: rev.notificacion || { tiene_notificacion: false },
        reconsideracion: rev.reconsideracion || { habilitado: false },
        apelacion: rev.apelacion || { habilitado: false },
      })),
      revision_actual_index: revisiones.length - 1,
      es_conforme: backendEsp.estado === 'conforme' || ultimaRevision?.resultado_acta === 'conforme',
      es_improcedente: backendEsp.estado === 'improcedente',
      estado: backendEsp.estado || 'pendiente',
      revision_count: revisiones.length,
      resultado_acta: ultimaRevision?.resultado_acta || null,
    };
  };

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

  // Función para sincronizar especialidades con el backend
  const syncEspecialidadWithBackend = useCallback(async (
    especialidadKey: 'arquitectura' | 'estructuras' | 'electricas' | 'sanitarias',
    especialidadData: EspecialidadData
  ) => {
    if (!gestionId || gestionId === 'new') return;

    try {
      await update({
        id: gestionId,
        payload: {
          data: {
            especialidades: {
              [especialidadKey]: {
                estado: especialidadData.estado,
                revision_actual_index: especialidadData.revision_actual_index,
                revisiones: especialidadData.revisiones.map(rev => ({
                  id: rev.id,
                  numero_revision: rev.numero_revision,
                  numero_revision_global: rev.numero_revision_global,
                  fecha_creacion: rev.fecha_creacion,
                  fecha_respuesta: rev.fecha_respuesta,
                  estado: rev.estado,
                  resultado_acta: rev.resultado_acta,
                  notificacion: rev.notificacion,
                  reconsideracion: rev.reconsideracion ? {
                    habilitado: rev.reconsideracion.habilitado,
                    fecha_presentacion: rev.reconsideracion.fecha_presentacion,
                    resultado: rev.reconsideracion.resultado,
                  } : { habilitado: false },
                  apelacion: rev.apelacion ? {
                    habilitado: rev.apelacion.habilitado,
                    fecha_presentacion: rev.apelacion.fecha_presentacion,
                    resultado: rev.apelacion.resultado,
                  } : { habilitado: false },
                })),
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error sincronizando con backend:', error);
    }
  }, [gestionId, update]);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Selección Proyecto
        if (!formData.selectedProyecto) {
          newErrors.selectedProyecto = 'Debe seleccionar un proyecto o cargar documentos externos';
        }
        break;
      
      case 1: // Gestión Especialidades
        // Validar que arquitectura haya iniciado al menos una revisión
        const arq = formData.especialidades.arquitectura;
        if (!arq.revisiones || arq.revisiones.length === 0) {
          newErrors['arquitectura'] = 'Debe iniciar al menos una revisión de arquitectura';
        } else {
          const revisionActual = arq.revisiones[arq.revision_actual_index];
          if (revisionActual && !revisionActual.resultado_acta) {
            newErrors['arquitectura.resultado_acta'] = 'Debe seleccionar el resultado del acta de arquitectura';
          }
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
      // Si es el primer paso y no hay gestionId, crear el expediente
      if (currentStep === 0 && (!gestionId || gestionId === 'new')) {
        // Crear expediente en el backend (Endpoint 1)
        const clientId = formData.selectedProyecto?.client_id || 'default_client_id'; // TODO: Obtener del contexto de usuario
        const result = await createNew({
          client_id: clientId,
          data: {
            nombre_proyecto: formData.selectedProyecto?.titulo || 'Nuevo Proyecto',
          },
        });
        
        if (result?.id) {
          setGestionId(result.id);
        }
      }

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

  const handleFileUpload = async (file: File, documentKey: string): Promise<any> => {
    // Si no hay gestionId, no podemos subir archivos
    if (!gestionId || gestionId === 'new') {
      console.warn('No se puede subir archivo sin gestionId');
      return {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        key: documentKey,
      };
    }

    try {
      // Subir archivo al backend (Endpoint 4)
      const result = await uploadDocs({
        gestionId,
        files: [file],
        documentKeys: [documentKey],
      });

      // Actualizar lista de documentos subidos
      if (result?.uploaded_documents) {
        setUploadedDocuments(result.uploaded_documents.map(doc => ({
          ...doc,
          id: doc.file_id,
        })));
      }

      return {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        key: documentKey,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/gestion-proyectos');
  };

  const handleSaveGestion = async () => {
    if (!gestionId || gestionId === 'new') {
      console.warn('No hay gestionId para guardar');
      return;
    }

    try {
      // Sincronizar todas las especialidades con el backend
      const especialidadesKeys = ['arquitectura', 'estructuras', 'electricas', 'sanitarias'] as const;
      
      for (const key of especialidadesKeys) {
        await syncEspecialidadWithBackend(key, formData.especialidades[key]);
      }
      
      console.log('Gestión guardada exitosamente');
    } catch (error) {
      console.error('Error guardando gestión:', error);
    }
  };

  const renderStepContent = () => {
    if (isLoading && isEditing) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-600">Cargando datos...</span>
        </div>
      );
    }

    switch (currentStep) {
      case 0: // Selección Proyecto
        return (
          <StepSeleccionProyecto
            formData={formData}
            gestionId={gestionId}
            uploadedDocuments={uploadedDocuments}
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
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onSyncWithBackend={syncEspecialidadWithBackend}
          />
        );

      case 2: // Emisión Licencia
        return (
          <StepEmisionLicencia
            formData={formData}
            errors={errors}
            gestionId={gestionId}
            uploadedDocuments={uploadedDocuments}
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
            isSaving={isUpdating || isUploading}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
