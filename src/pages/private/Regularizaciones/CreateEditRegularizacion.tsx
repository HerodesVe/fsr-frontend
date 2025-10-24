import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { useRegularizacion } from '@/hooks/useRegularizaciones';
import { ResumenRegularizacion } from './components';
import { StepAdministrado, StepCargo } from '@/components/utils/Steps';
import StepDocumentacionInicial from './StepRegularizacion/StepDocumentacionInicial';
import StepDatosPredio from './StepRegularizacion/StepDatosPredio';
import StepFueFirmado from './StepRegularizacion/StepFueFirmado';
import StepGestionMunicipal from './StepRegularizacion/StepGestionMunicipal';
import type { 
  RegularizacionFormData, 
  FormStep, 
  UploadedDocument,
  CreateRegularizacionRequest,
  DocumentInfo
} from '@/types/regularizacion.types';

const stepLabels = [
  'Administrado',
  'Documentación Inicial', 
  'Datos del Predio',
  'FUE Firmado',
  'Gestión Municipal',
  'Entrega al Administrado'
];

export default function CreateEditRegularizacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const { clients, isLoading: clientsLoading } = useClients();
  const { regularizacion, isLoading: regularizacionLoading, createNew, update, uploadDocs, downloadDoc } = useRegularizacion(id);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [regularizacionId, setRegularizacionId] = useState<string | null>(id || null);
  
  // Estado para manejar los pasos del formulario
  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Documentación Inicial', completed: false },
    { id: 3, title: 'Datos del Predio', completed: false },
    { id: 4, title: 'FUE Firmado', completed: false },
    { id: 5, title: 'Gestión Municipal', completed: false },
    { id: 6, title: 'Entrega al Administrado', completed: false },
  ]);
  
  const [formData, setFormData] = useState<RegularizacionFormData>({
    // Paso 1: Administrado
    selectedClient: null,
    nombre_proyecto: '',
    administrado: '',
    fue_nombre: '',
    fue_dni: '',
    fue_domicilio: '',
    fue_telefono: '',

    // Paso 2: Documentación Inicial
    fechaCulminacion: '',
    licenciaAnterior: [],
    declaratoriaFabrica: [],
    planosAntecedentes: [],
    otros: [],

    // Paso 3: Datos del Predio
    fue_ubicacion: '',
    fue_partida: '',
    fue_modalidad: '',
    fue_presupuesto: '',

    // Paso 4: FUE Firmado
    fueFirmado: [],

    // Paso 5: Gestión Municipal
    cargoMunicipal: [],
    actaObservacion: [],
    docSubsanacion: [],
    resolucionFinal: [],

    // Paso 6: Entrega al Administrado
    fecha_entrega_administrado: '',
    receptor_administrado: '',
    cargo_entrega_administrado: [],
    observaciones_entrega: '',
  });

  const isEdit = Boolean(id);

  // Cargar datos de la regularización cuando se edita
  useEffect(() => {
    if (regularizacion && isEdit && clients && clients.length > 0) {
      // Buscar el cliente seleccionado en la lista de clients
      const selectedClient = clients.find(client => client.id === regularizacion.client_id) || null;

      // Cargar datos del formulario desde el backend
      setFormData(prev => ({
        ...prev,
        selectedClient,
        nombre_proyecto: regularizacion.data?.nombre_proyecto || regularizacion.data?.titulo_proceso || '',
        
        // Documentación Inicial
        fechaCulminacion: regularizacion.data?.documentacion_inicial?.fecha_culminacion || '',
        
        // Datos del Predio
        fue_ubicacion: regularizacion.data?.datos_predio?.fue_ubicacion || '',
        fue_partida: regularizacion.data?.datos_predio?.fue_partida || '',
        fue_modalidad: regularizacion.data?.datos_predio?.fue_modalidad || '',
        fue_presupuesto: regularizacion.data?.datos_predio?.fue_presupuesto || '',
        
        // Entrega Final
        fecha_entrega_administrado: regularizacion.data?.entrega_final?.fecha_entrega_administrado || '',
        receptor_administrado: regularizacion.data?.entrega_final?.receptor_administrado || '',
        observaciones_entrega: regularizacion.data?.entrega_final?.observaciones_entrega || '',
      }));

      // Cargar documentos subidos desde el backend
      const allDocs: UploadedDocument[] = [];
      
      // 1. Cargar desde uploaded_documents (documentos con key)
      if (regularizacion.uploaded_documents && regularizacion.uploaded_documents.length > 0) {
        const docs = regularizacion.uploaded_documents.map((doc: any) => ({
          file_id: doc.file_id,
          name: doc.name,
          key: doc.key,
        }));
        allDocs.push(...docs);
      }

      // 2. Cargar documento del cargo de entrega final si existe
      if (regularizacion.data?.entrega_final?.cargo_entrega_administrado?.file_reference) {
        const cargoDoc = regularizacion.data.entrega_final.cargo_entrega_administrado;
        allDocs.push({
          file_id: cargoDoc.file_reference,
          name: cargoDoc.name || 'Cargo Entrega Administrado',
          key: 'entrega_final.cargo_entrega_administrado',
        });
      }

      if (allDocs.length > 0) {
        setUploadedDocuments(allDocs);
      }
    }
  }, [regularizacion, isEdit, clients]);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Regularización de Licencia' : 'Nueva Regularización de Licencia',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = (field: keyof RegularizacionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });

    // Ocultar mensaje de validación general si está visible
    setShowValidationError(false);
  };

  const handleFileUpload = async (file: File, documentKey?: string): Promise<UploadedDocument> => {
    const tempId = Date.now().toString();
    
    // Crear objeto local inmediatamente
    const uploadedDoc: UploadedDocument = {
      key: documentKey || '',
      name: file.name,
      file_id: tempId,
    };
    
    setUploadedDocuments(prev => [...prev, uploadedDoc]);

    // Si ya tenemos un ID de regularización, subir el archivo inmediatamente
    if (regularizacionId && documentKey) {
      try {
        const response = await uploadDocs(regularizacionId, [file], [documentKey]);
        
        // Actualizar con file_id real del backend
        if (response && response.uploaded_documents) {
          const uploadedFromBackend = response.uploaded_documents.find(
            (doc: any) => doc.key === documentKey && doc.name === file.name
          );
          
          if (uploadedFromBackend) {
            setUploadedDocuments(prev => 
              prev.map(doc => 
                doc.file_id === tempId 
                  ? { ...doc, file_id: uploadedFromBackend.file_id }
                  : doc
              )
            );
          }
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Remover el documento si falla la subida
        setUploadedDocuments(prev => prev.filter(doc => doc.file_id !== tempId));
      }
    }
    
    return uploadedDoc;
  };

  const handleDownloadDocument = async (documentId: string, fileName: string) => {
    if (!regularizacionId) {
      alert('No se puede descargar el documento en este momento');
      return;
    }
    
    try {
      await downloadDoc(regularizacionId, documentId, fileName);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error al descargar el documento');
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Administrado
        if (!formData.selectedClient && !formData.fue_nombre) {
          newErrors.selectedClient = 'Debe seleccionar un administrado o crear uno nuevo';
        }
        if (!formData.nombre_proyecto || formData.nombre_proyecto.trim() === '') {
          newErrors.nombre_proyecto = 'El nombre del proyecto es requerido';
        }
        if (!formData.selectedClient) {
          if (!formData.fue_nombre) {
            newErrors.fue_nombre = 'El nombre es requerido';
          }
          if (!formData.fue_dni) {
            newErrors.fue_dni = 'El DNI/RUC es requerido';
          }
          if (!formData.fue_domicilio) {
            newErrors.fue_domicilio = 'El domicilio es requerido';
          }
        }
        break;
      case 1: // Documentación Inicial
        if (!formData.fechaCulminacion) {
          newErrors.fechaCulminacion = 'La fecha de culminación es requerida';
        }
        break;
      case 2: // Datos del Predio
        if (!formData.fue_ubicacion) {
          newErrors.fue_ubicacion = 'La ubicación del predio es requerida';
        }
        if (!formData.fue_partida) {
          newErrors.fue_partida = 'La partida registral es requerida';
        }
        if (!formData.fue_modalidad) {
          newErrors.fue_modalidad = 'La modalidad de licencia es requerida';
        }
        if (!formData.fue_presupuesto) {
          newErrors.fue_presupuesto = 'El presupuesto de obra es requerido';
        }
        break;
      case 3: // FUE Firmado
        if (!formData.fueFirmado || formData.fueFirmado.length === 0) {
          newErrors.fueFirmado = 'El FUE firmado es requerido';
        }
        break;
      case 4: // Gestión Municipal
        // Validaciones opcionales para gestión municipal
        break;
      case 5: // Entrega al Administrado
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

  const handleNext = async () => {
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

    // Si es el primer paso y no hay regularizacionId, crear la regularización
    if (currentStep === 0 && !regularizacionId) {
      try {
        setIsSaving(true);
        const requestData = buildCreateRequest();
        const newRegularizacion = await createNew(requestData);
        setRegularizacionId(newRegularizacion.id);
      } catch (error) {
        console.error('Error creating regularizacion:', error);
        setShowValidationError(true);
        return;
      } finally {
        setIsSaving(false);
      }
    } else if (regularizacionId) {
      // Si ya existe, actualizar solo según el paso actual
      try {
        setIsSaving(true);
        const updateData = buildUpdateRequestForCurrentStep();
        if (updateData) {
          await update(regularizacionId, updateData);
        }
      } catch (error) {
        console.error('Error updating regularizacion:', error);
      } finally {
        setIsSaving(false);
      }
    }

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

  // Helper global para convertir fechas al formato ISO (YYYY-MM-DD)
  const formatDateForBackend = (dateString: string): string | undefined => {
    if (!dateString || dateString.trim() === '') return undefined;
    
    // Si ya está en formato ISO (YYYY-MM-DD), devolverlo tal cual
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString.split('T')[0];
    }
    
    // Si está en formato DD/MM/YYYY, convertir a YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    
    // Si puede ser parseado como fecha, convertir a ISO
    if (!isNaN(Date.parse(dateString))) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    }
    
    return undefined;
  };

  // Función helper para crear DocumentInfo
  const createDocumentInfo = (name: string, is_mandatory: boolean): DocumentInfo => {
    return {
      name,
      is_mandatory,
      status: 'Pendiente',
      file_reference: '',
      observation: '',
    };
  };

  // Función para construir el request de creación
  const buildCreateRequest = (): CreateRegularizacionRequest => {
    const requestData: any = {
      client_id: formData.selectedClient?.id || '',
      data: {
        service_type: 'regularizacion_licencia',
        nombre_proyecto: formData.nombre_proyecto,
        documentacion_inicial: {
          licencia_anterior: createDocumentInfo('Licencia Anterior', false),
          declaratoria_fabrica: createDocumentInfo('Declaratoria de Fábrica', false),
          planos_antecedentes: createDocumentInfo('Planos Antecedentes', false),
          otros_documentos: createDocumentInfo('Otros Documentos', false),
        },
        datos_predio: {
          fue_ubicacion: formData.fue_ubicacion,
          fue_partida: formData.fue_partida,
          fue_modalidad: formData.fue_modalidad,
          fue_presupuesto: formData.fue_presupuesto,
        },
        fue: {
          fue_firmado: createDocumentInfo('FUE Firmado', true),
        },
        gestion_municipal: {
          cargo_municipal: createDocumentInfo('Cargo Municipal', false),
          acta_observacion: createDocumentInfo('Acta de Observación', false),
          doc_subsanacion: createDocumentInfo('Documento de Subsanación', false),
          resolucion_final: createDocumentInfo('Resolución Final', false),
        },
        entrega_final: {
          receptor_administrado: formData.receptor_administrado,
          cargo_entrega_administrado: createDocumentInfo('Cargo Entrega Administrado', false),
          observaciones_entrega: formData.observaciones_entrega,
        },
      },
    };

    // Solo agregar fecha de culminación si tiene valor (formato ISO)
    const fechaCulminacion = formatDateForBackend(formData.fechaCulminacion);
    if (fechaCulminacion) {
      requestData.data.documentacion_inicial.fecha_culminacion = fechaCulminacion;
    }

    // Solo agregar fecha de entrega si tiene valor (formato ISO)
    const fechaEntrega = formatDateForBackend(formData.fecha_entrega_administrado);
    if (fechaEntrega) {
      requestData.data.entrega_final.fecha_entrega_administrado = fechaEntrega;
    }

    return requestData;
  };

  // Función para construir el request de actualización según el paso actual
  const buildUpdateRequestForCurrentStep = (): any | null => {
    switch (currentStep) {
      case 0: // Paso 1: Administrado
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            service_type: 'regularizacion_licencia',
            nombre_proyecto: formData.nombre_proyecto,
          }
        };

      case 1: // Paso 2: Documentación Inicial
        // ⚠️ NO enviar estructura de documentos, los documentos se suben automáticamente con handleFileUpload
        // Solo enviar fecha de culminación
        const docInicialData: any = {};
        
        const fechaCulminacion = formatDateForBackend(formData.fechaCulminacion);
        if (fechaCulminacion) {
          docInicialData.fecha_culminacion = fechaCulminacion;
        }

        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            documentacion_inicial: docInicialData
          }
        };

      case 2: // Paso 3: Datos del Predio
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            datos_predio: {
              fue_ubicacion: formData.fue_ubicacion,
              fue_partida: formData.fue_partida,
              fue_modalidad: formData.fue_modalidad,
              fue_presupuesto: formData.fue_presupuesto,
            }
          }
        };

      case 3: // Paso 4: FUE Firmado
        // ⚠️ NO enviar estructura de documentos, solo se suben con handleFileUpload
        // Este paso solo maneja documentos, no hay campos de formulario adicionales
        return null;

      case 4: // Paso 5: Gestión Municipal
        // ⚠️ NO enviar estructura de documentos, solo se suben con handleFileUpload
        // Este paso solo maneja documentos, no hay campos de formulario adicionales
        return null;

      case 5: // Paso 6: Entrega al Administrado
        // ⚠️ NO enviar estructura de documentos, solo campos de texto/formulario
        // Los documentos (cargo_entrega_administrado) se suben con handleFileUpload
        const entregaData: any = {
          receptor_administrado: formData.receptor_administrado,
          observaciones_entrega: formData.observaciones_entrega,
        };

        const fechaEntrega = formatDateForBackend(formData.fecha_entrega_administrado);
        if (fechaEntrega) {
          entregaData.fecha_entrega_administrado = fechaEntrega;
        }

        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            entrega_final: entregaData
          }
        };

      default:
        return null;
    }
  };

  // Función para construir el request de actualización completo (si se necesita)
  const buildUpdateRequest = () => {
    return buildCreateRequest();
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
      if (regularizacionId) {
        const updateData = buildUpdateRequest();
        await update(regularizacionId, updateData);
      }
      navigate('/dashboard/regularizaciones');
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
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof RegularizacionFormData, value)}
            title="Paso 1: Datos del Administrado"
            description="Seleccione o ingrese la información del cliente (administrado) para este trámite de regularización."
            showCreateButton={true}
            showProjectName={true}
          />
        );
      case 1:
        return (
          <StepDocumentacionInicial
            formData={formData}
            regularizacionId={regularizacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 2:
        return (
          <StepDatosPredio
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <StepFueFirmado
            formData={formData}
            regularizacionId={regularizacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 4:
        return (
          <StepGestionMunicipal
            formData={formData}
            regularizacionId={regularizacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 5:
        return (
          <StepCargo
            formData={formData}
            projectId={regularizacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof RegularizacionFormData, value)}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
            title="Cargo"
            description="Complete la información de la entrega final de la regularización al administrado"
          />
        );
      default:
        return null;
    }
  };

  if (clientsLoading || (isEdit && regularizacionLoading)) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
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
                onClick={() => navigate('/dashboard/regularizaciones')}
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
                  onClick={handleSave}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className="text-white hover:opacity-90"
                  disabled={isSaving}
                >
                  {isSaving ? 'Finalizando...' : 'Finalizar Proceso'}
                </Button>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <ResumenRegularizacion
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            regularizacionId={regularizacionId || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
