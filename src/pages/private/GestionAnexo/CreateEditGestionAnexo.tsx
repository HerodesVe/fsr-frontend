import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { useGestionAnexo } from '@/hooks/useGestionAnexos';
import toast from 'react-hot-toast';
import { ResumenGestionAnexo } from './components';
import { StepAdministrado } from '@/components/utils/Steps';
import StepDocumentacion from './StepGestionAnexo/StepDocumentacion';
import StepPresentacion from './StepGestionAnexo/StepPresentacion';
import StepCierre from './StepGestionAnexo/StepCierre';
import type { GestionAnexoFormData, FormStep, UploadedDocument, DocumentInfo } from '@/types/gestionAnexo.types';

const stepLabels = [
  'Administrado',
  'Documentación',
  'Presentación',
  'Cierre'
];

export default function CreateEditGestionAnexo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const { clients, isLoading: clientsLoading } = useClients();
  const { gestionAnexo, isLoading: gestionLoading, createNew, update, uploadDocs, downloadDoc } = useGestionAnexo(id);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [gestionId, setGestionId] = useState<string | null>(id || null);
  
  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Documentación', completed: false },
    { id: 3, title: 'Presentación', completed: false },
    { id: 4, title: 'Cierre', completed: false },
  ]);
  
  const [formData, setFormData] = useState<GestionAnexoFormData>({
    // Paso 1: Administrado
    selectedClient: null,
    nombre_proyecto: '',

    // Paso 2: Documentación del Administrado
    anexo_h_formato: [],
    contrato_supervisor: [],
    poliza_car: [],
    resolucion_licencia_obra: [],
    cronograma_visitas: [],
    cronograma_obra: [],
    otros_documentos: [],
    fecha_inicio_ejecucion: '',
    comentarios_documentacion: '',

    // Paso 3: Presentación en Municipalidad
    hoja_tramite_cargo: [],
    fecha_ingreso_municipalidad: '',

    // Paso 4: Cierre y Entrega
    fecha_entrega_administrado: '',
    receptor_administrado: '',
    cargo_entrega_administrado: [],
    observaciones_entrega: '',
  });

  const isEdit = Boolean(id);

  // Cargar datos cuando se edita
  useEffect(() => {
    if (gestionAnexo && isEdit && clients && clients.length > 0) {
      const selectedClient = clients.find(client => client.id === gestionAnexo.client_id) || null;

      setFormData(prev => ({
        ...prev,
        selectedClient,
        nombre_proyecto: gestionAnexo.data?.nombre_proyecto || '',
        comentarios_documentacion: gestionAnexo.data?.documentacion_anexo?.comentarios_documentacion || '',
        fecha_inicio_ejecucion: gestionAnexo.data?.documentacion_anexo?.fecha_inicio_ejecucion || '',
        fecha_ingreso_municipalidad: gestionAnexo.data?.presentacion_municipal?.fecha_ingreso_municipalidad || '',
        fecha_entrega_administrado: gestionAnexo.data?.cierre_servicio?.fecha_entrega_administrado || '',
        receptor_administrado: gestionAnexo.data?.cierre_servicio?.receptor_administrado || '',
        observaciones_entrega: gestionAnexo.data?.cierre_servicio?.observaciones_entrega || '',
      }));

      // Cargar documentos
      const allDocs: UploadedDocument[] = [];
      if (gestionAnexo.uploaded_documents && gestionAnexo.uploaded_documents.length > 0) {
        const docs = gestionAnexo.uploaded_documents.map((doc: any) => ({
          id: doc.file_id,
          name: doc.name,
          url: '',
          size: 0,
          type: 'application/pdf',
          key: doc.key,
        }));
        allDocs.push(...docs);
      }

      if (allDocs.length > 0) {
        setUploadedDocuments(allDocs);
      }
    }
  }, [gestionAnexo, isEdit, clients]);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Gestión del Anexo H' : 'Nueva Gestión del Anexo H',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    return () => setHeader('Dashboard');
  }, [setHeader, isEdit]);

  const handleInputChange = useCallback((field: keyof GestionAnexoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
    setShowValidationError(false);
  }, []);

  const handleFileUpload = useCallback(async (file: File, documentKey?: string): Promise<UploadedDocument> => {
    const tempId = Date.now().toString();
    
    const uploadedDoc: UploadedDocument = {
      id: tempId,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      key: documentKey,
    };
    
    setUploadedDocuments(prev => [...prev, uploadedDoc]);

    if (gestionId && documentKey) {
      try {
        const response = await uploadDocs({ gestionId, files: [file], documentKeys: [documentKey] });
        
        if (response && response.uploaded_documents) {
          const uploadedFromBackend = response.uploaded_documents.find(
            (doc: any) => doc.key === documentKey && doc.name === file.name
          );
          
          if (uploadedFromBackend) {
            setUploadedDocuments(prev => 
              prev.map(doc => 
                doc.id === tempId 
                  ? { ...doc, id: uploadedFromBackend.file_id }
                  : doc
              )
            );
          }
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadedDocuments(prev => prev.filter(doc => doc.id !== tempId));
      }
    }
    
    return uploadedDoc;
  }, [gestionId, uploadDocs]);

  const handleDownloadDocument = useCallback(async (documentId: string, fileName: string) => {
    if (!gestionId) {
      toast.error('No se puede descargar el documento en este momento');
      return;
    }
    
    try {
      await downloadDoc(gestionId, documentId, fileName);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  }, [gestionId, downloadDoc]);

  const formatDateForBackend = (dateString: string): string | undefined => {
    if (!dateString || dateString.trim() === '') return undefined;
    
    console.log('🔍 formatDateForBackend - Input:', dateString);
    
    // Formato ISO: YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      const result = dateString.split('T')[0];
      console.log('✅ ISO format detected:', result);
      return result;
    }
    
    // Formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      const result = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      console.log('✅ DD/MM/YYYY format detected:', result);
      return result;
    }
    
    // Formato MM/DD/YYYY (formato americano)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      const parts = dateString.split('/');
      // Asumimos que si el primer número es > 12, es DD/MM/YYYY, sino es MM/DD/YYYY
      const month = parseInt(parts[0]);
      const day = parseInt(parts[1]);
      
      if (month > 12) {
        // Definitivamente es DD/MM/YYYY
        const result = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        console.log('✅ DD/MM/YYYY detected (month > 12):', result);
        return result;
      } else if (day > 12) {
        // Es MM/DD/YYYY
        const result = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        console.log('✅ MM/DD/YYYY detected (day > 12):', result);
        return result;
      } else {
        // Ambiguo, asumimos DD/MM/YYYY (formato estándar en Latinoamérica)
        const result = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        console.log('⚠️ Ambiguous format, assuming DD/MM/YYYY:', result);
        return result;
      }
    }
    
    // Intentar parsear como fecha
    if (!isNaN(Date.parse(dateString))) {
      const date = new Date(dateString);
      const result = date.toISOString().split('T')[0];
      console.log('✅ Date.parse fallback:', result);
      return result;
    }
    
    console.error('❌ Could not parse date:', dateString);
    return undefined;
  };

  const createDocumentInfo = (name: string, is_mandatory: boolean): DocumentInfo => {
    return {
      name,
      is_mandatory,
      status: 'Pendiente',
      file_reference: '',
      observation: '',
    };
  };

  // PATCH por paso - Solo lo editado
  const buildUpdateRequestForCurrentStep = (): any | null => {
    switch (currentStep) {
      case 0: // Paso 1: Administrado
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            nombre_proyecto: formData.nombre_proyecto,
          }
        };

      case 1: // Paso 2: Documentación
        const documentacionData: any = {
          comentarios_documentacion: formData.comentarios_documentacion,
        };
        
        const fechaInicio = formatDateForBackend(formData.fecha_inicio_ejecucion);
        if (fechaInicio) documentacionData.fecha_inicio_ejecucion = fechaInicio;

        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            documentacion_anexo: documentacionData
          }
        };

      case 2: // Paso 3: Presentación Municipal
        const presentacionData: any = {};
        
        const fechaIngreso = formatDateForBackend(formData.fecha_ingreso_municipalidad);
        if (fechaIngreso) presentacionData.fecha_ingreso_municipalidad = fechaIngreso;

        if (Object.keys(presentacionData).length === 0) {
          return null;
        }

        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            presentacion_municipal: presentacionData
          }
        };

      case 3: // Paso 4: Cierre
        const cierreData: any = {
          receptor_administrado: formData.receptor_administrado,
          observaciones_entrega: formData.observaciones_entrega,
        };
        
        const fechaEntrega = formatDateForBackend(formData.fecha_entrega_administrado);
        if (fechaEntrega) cierreData.fecha_entrega_administrado = fechaEntrega;

        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            cierre_servicio: cierreData
          }
        };

      default:
        return null;
    }
  };

  // Construir request de creación completo
  const buildCreateRequest = (): any => {
    const baseData: any = {
      client_id: formData.selectedClient?.id || '',
      data: {
        service_type: 'gestion_anexo_h',
        nombre_proyecto: formData.nombre_proyecto,
        documentacion_anexo: {
          anexo_h_formato: createDocumentInfo('Anexo H (Formato)', true),
          contrato_supervisor: createDocumentInfo('Contrato Supervisor / Convenio de Visitas', true),
          poliza_car: createDocumentInfo('Póliza CAR', true),
          resolucion_licencia_obra: createDocumentInfo('Resolución de Licencia de Obra', true),
          cronograma_visitas: createDocumentInfo('Cronograma de Visitas', true),
          cronograma_obra: createDocumentInfo('Cronograma de Obra', true),
          otros_documentos: createDocumentInfo('Otros Documentos', false),
          comentarios_documentacion: formData.comentarios_documentacion,
        },
        presentacion_municipal: {
          hoja_tramite_cargo: createDocumentInfo('Hoja de Trámite (Cargo)', true),
        },
        cierre_servicio: {
          receptor_administrado: formData.receptor_administrado,
          cargo_entrega_administrado: createDocumentInfo('Cargo de Entrega al Administrado', true),
          observaciones_entrega: formData.observaciones_entrega,
        },
      },
    };

    // Agregar fechas si existen
    const fechaInicio = formatDateForBackend(formData.fecha_inicio_ejecucion);
    if (fechaInicio) baseData.data.documentacion_anexo.fecha_inicio_ejecucion = fechaInicio;

    const fechaIngreso = formatDateForBackend(formData.fecha_ingreso_municipalidad);
    if (fechaIngreso) baseData.data.presentacion_municipal.fecha_ingreso_municipalidad = fechaIngreso;

    const fechaEntrega = formatDateForBackend(formData.fecha_entrega_administrado);
    if (fechaEntrega) baseData.data.cierre_servicio.fecha_entrega_administrado = fechaEntrega;

    return baseData;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!formData.nombre_proyecto.trim()) {
          newErrors.nombre_proyecto = 'El nombre del proyecto es requerido';
        }
        if (!formData.selectedClient) {
          newErrors.selectedClient = 'Debe seleccionar un administrado';
        }
        break;
        
      case 1:
        // Validación de documentos obligatorios
        const docsRequeridos = [
          'documentacion_anexo.anexo_h_formato',
          'documentacion_anexo.contrato_supervisor',
          'documentacion_anexo.poliza_car',
          'documentacion_anexo.resolucion_licencia_obra',
          'documentacion_anexo.cronograma_visitas',
          'documentacion_anexo.cronograma_obra',
        ];

        const docsSubidos = docsRequeridos.filter(docKey => 
          uploadedDocuments.some(doc => doc.key === docKey)
        );

        if (docsSubidos.length < docsRequeridos.length) {
          newErrors.documentos = 'Debe subir todos los documentos obligatorios';
        }

        if (!formData.fecha_inicio_ejecucion) {
          newErrors.fecha_inicio_ejecucion = 'La fecha de inicio es requerida';
        }
        break;
        
      case 2:
        if (!uploadedDocuments.some(doc => doc.key === 'presentacion_municipal.hoja_tramite_cargo')) {
          newErrors.hoja_tramite_cargo = 'La Hoja de Trámite es requerida';
        }
        if (!formData.fecha_ingreso_municipalidad) {
          newErrors.fecha_ingreso_municipalidad = 'La fecha de ingreso es requerida';
        }
        break;

      case 3:
        if (!formData.fecha_entrega_administrado) {
          newErrors.fecha_entrega_administrado = 'La fecha de entrega es requerida';
        }
        if (!formData.receptor_administrado) {
          newErrors.receptor_administrado = 'El nombre del receptor es requerido';
        }
        if (!uploadedDocuments.some(doc => doc.key === 'cierre_servicio.cargo_entrega_administrado')) {
          newErrors.cargo_entrega_administrado = 'El cargo de entrega es requerido';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      setShowValidationError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setShowValidationError(false), 5000);
      return;
    }

    setShowValidationError(false);

    // Si es el primer paso y no hay gestionId, crear
    if (currentStep === 0 && !gestionId) {
      try {
        setIsSaving(true);
        const requestData = buildCreateRequest();
        const newGestion = await createNew(requestData);
        setGestionId(newGestion.id);
      } catch (error) {
        console.error('Error creating gestion:', error);
        setShowValidationError(true);
        return;
      } finally {
        setIsSaving(false);
      }
    } else if (gestionId) {
      try {
        setIsSaving(true);
        const updateData = buildUpdateRequestForCurrentStep();
        if (updateData) {
          await update({ id: gestionId, data: updateData });
        }
      } catch (error) {
        console.error('Error updating gestion:', error);
      } finally {
        setIsSaving(false);
      }
    }

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
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    } else if (steps[stepIndex].completed || stepIndex === currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (gestionId) {
        const updateData = buildCreateRequest();
        await update({ id: gestionId, data: updateData });
      }
      navigate('/dashboard/gestion-anexo');
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
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof GestionAnexoFormData, value)}
            title="Paso 1: Vincular Administrado"
            description="Seleccione el administrado para este servicio de gestión del anexo H"
            showProjectName={true}
          />
        );
      case 1:
        return (
          <StepDocumentacion
            formData={formData}
            errors={errors}
            gestionId={gestionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 2:
        return (
          <StepPresentacion
            formData={formData}
            errors={errors}
            gestionId={gestionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 3:
        return (
          <StepCierre
            formData={formData}
            errors={errors}
            gestionId={gestionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      default:
        return null;
    }
  };

  if (clientsLoading || (isEdit && gestionLoading)) {
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
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
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

            <div className="mb-6">
              {renderStepContent()}
            </div>

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
                  onClick={() => navigate('/dashboard/gestion-anexo')}
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
                    onClick={() => navigate('/dashboard/gestion-anexo')}
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

        <div className="lg:col-span-1">
          <ResumenGestionAnexo
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            gestionId={gestionId || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
