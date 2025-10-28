import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { useModificacion } from '@/hooks/useModificaciones';
import toast from 'react-hot-toast';
import { ResumenModificacion } from './components';
import { StepAdministrado } from '@/components/utils/Steps';
import StepLicencia from './StepModificacion/StepLicencia';
import StepAntecedentes from './StepModificacion/StepAntecedentes';
import StepElaboracion from './StepModificacion/StepElaboracion';
import StepGestion from './StepModificacion/StepGestion';
import type { ModificacionFormData, FormStep, UploadedDocument, DocumentInfo } from '@/types/modificacion.types';

const stepLabels = [
  'Administrado',
  'Licencia',
  'Antecedentes',
  'Elaboración',
  'Gestión'
];

export default function CreateEditModificacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const { clients, isLoading: clientsLoading } = useClients();
  const { modificacion, isLoading: modificacionLoading, createNew, update, uploadDocs, downloadDoc } = useModificacion(id);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [modificacionId, setModificacionId] = useState<string | null>(id || null);
  
  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Licencia', completed: false },
    { id: 3, title: 'Antecedentes', completed: false },
    { id: 4, title: 'Elaboración', completed: false },
    { id: 5, title: 'Gestión', completed: false },
  ]);
  
  const [formData, setFormData] = useState<ModificacionFormData>({
    selectedClient: null,
    nombre_proyecto: '',
    tipo_licencia_edificacion: '',
    tipo_modalidad: '',
    vincular_expediente_fsr: '',
    numero_expediente_externo: '',
    licencia_obra_anterior: [],
    planos_aprobados_anteriores: [],
    formulario_unico_anterior: [],
    planos_arquitectura: [],
    planos_estructuras: [],
    planos_sanitarias: [],
    planos_electricas: [],
    memoria_descriptiva: [],
    documentacion_adicional: [],
    fecha_ingreso_entidad: '',
    cargo_ingreso_expediente: null,
    acta_observaciones: null,
    acta_conformidad: null,
    acta_reconsideracion: null,
    anexo_subsanacion: null,
    planos_corregidos: null,
    licencia_modificacion_emitida: null,
    cargo_entrega_administrado: null,
  });

  const isEdit = Boolean(id);

  // Cargar datos cuando se edita
  useEffect(() => {
    if (modificacion && isEdit && clients && clients.length > 0) {
      const selectedClient = clients.find(client => client.id === modificacion.client_id) || null;

      setFormData(prev => ({
        ...prev,
        selectedClient,
        nombre_proyecto: modificacion.data?.nombre_proyecto || '',
        tipo_licencia_edificacion: modificacion.data?.licencia_modificacion?.tipo_licencia_edificacion || '',
        tipo_modalidad: modificacion.data?.licencia_modificacion?.tipo_modalidad || '',
        vincular_expediente_fsr: modificacion.data?.antecedentes_modificacion?.vincular_expediente_fsr || '',
        numero_expediente_externo: modificacion.data?.antecedentes_modificacion?.numero_expediente_externo || '',
        fecha_ingreso_entidad: modificacion.data?.gestion_modificacion?.fecha_ingreso_entidad || '',
      }));

      // Cargar documentos subidos desde el backend
      const allDocs: UploadedDocument[] = [];
      
      // 1. Cargar desde uploaded_documents (documentos con key)
      if (modificacion.uploaded_documents && modificacion.uploaded_documents.length > 0) {
        const docs = modificacion.uploaded_documents.map((doc: any) => ({
          id: doc.file_id,
          name: doc.name,
          url: '',
          size: 0,
          type: 'application/pdf',
          key: doc.key,
        }));
        allDocs.push(...docs);
      }

      // 2. Cargar documentos desde gestion_modificacion
      if (modificacion.data?.gestion_modificacion) {
        const gestion = modificacion.data.gestion_modificacion;
        
        const gestionDocs = [
          { key: 'gestion_modificacion.cargo_ingreso_expediente', doc: gestion.cargo_ingreso_expediente },
          { key: 'gestion_modificacion.acta_observaciones', doc: gestion.acta_observaciones },
          { key: 'gestion_modificacion.acta_conformidad', doc: gestion.acta_conformidad },
          { key: 'gestion_modificacion.acta_reconsideracion', doc: gestion.acta_reconsideracion },
          { key: 'gestion_modificacion.anexo_subsanacion', doc: gestion.anexo_subsanacion },
          { key: 'gestion_modificacion.planos_corregidos', doc: gestion.planos_corregidos },
          { key: 'gestion_modificacion.licencia_modificacion_emitida', doc: gestion.licencia_modificacion_emitida },
          { key: 'gestion_modificacion.cargo_entrega_administrado', doc: gestion.cargo_entrega_administrado },
        ];

        gestionDocs.forEach(({ key, doc }) => {
          if (doc?.file_reference) {
            allDocs.push({
              id: doc.file_reference,
              name: doc.name || key.split('.')[1],
              url: '',
              size: 0,
              type: 'application/pdf',
              key: key,
            });
          }
        });
      }

      if (allDocs.length > 0) {
        setUploadedDocuments(allDocs);
      }
    }
  }, [modificacion, isEdit, clients]);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Modificación de Obra' : 'Nueva Modificación de Obra',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    return () => setHeader('Dashboard');
  }, [setHeader, isEdit]);

  const handleInputChange = useCallback((field: keyof ModificacionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
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

    if (modificacionId && documentKey) {
      try {
        const response = await uploadDocs(modificacionId, [file], [documentKey]);
        
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
  }, [modificacionId, uploadDocs]);

  const handleDownloadDocument = useCallback(async (documentId: string, fileName: string) => {
    if (!modificacionId) {
      toast.error('No se puede descargar el documento en este momento');
      return;
    }
    
    try {
      await downloadDoc(modificacionId, documentId, fileName);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  }, [modificacionId, downloadDoc]);

  // Helper para convertir fechas
  const formatDateForBackend = (dateString: string): string | undefined => {
    if (!dateString || dateString.trim() === '') return undefined;
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString.split('T')[0];
    }
    if (/^\d{2}\/\d{2}\/\d{4}/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    if (!isNaN(Date.parse(dateString))) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    }
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

  // Función para construir el request de actualización según el paso actual
  const buildUpdateRequestForCurrentStep = (): any | null => {
    switch (currentStep) {
      case 0: // Paso 1: Administrado
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            service_type: 'modificacion_obra',
            nombre_proyecto: formData.nombre_proyecto,
          }
        };

      case 1: // Paso 2: Licencia
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            licencia_modificacion: {
              tipo_licencia_edificacion: formData.tipo_licencia_edificacion,
              tipo_modalidad: formData.tipo_modalidad,
            }
          }
        };

      case 2: // Paso 3: Antecedentes
        // ⚠️ NO enviar estructura de documentos, los documentos se suben automáticamente con handleFileUpload
        // Solo enviar campos de formulario (inputs del usuario)
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            antecedentes_modificacion: {
              vincular_expediente_fsr: formData.vincular_expediente_fsr,
              numero_expediente_externo: formData.numero_expediente_externo,
            }
          }
        };

      case 3: // Paso 4: Elaboración
        // ⚠️ NO enviar estructura de documentos, solo se suben con handleFileUpload
        // Este paso solo maneja documentos, no hay campos de formulario adicionales
        return null;

      case 4: // Paso 5: Gestión
        // ⚠️ NO enviar estructura de documentos, solo fecha
        // Los documentos se suben automáticamente con handleFileUpload
        const gestionData: any = {};
        
        const fechaIngreso = formatDateForBackend(formData.fecha_ingreso_entidad);
        if (fechaIngreso) {
          gestionData.fecha_ingreso_entidad = fechaIngreso;
        }

        // Si no hay fecha, no hay nada que actualizar en este paso
        if (Object.keys(gestionData).length === 0) {
          return null;
        }

        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            gestion_modificacion: gestionData
          }
        };

      default:
        return null;
    }
  };

  // Función para construir el request de creación
  const buildCreateRequest = (): any => {
    const baseData: any = {
      client_id: formData.selectedClient?.id || '',
      data: {
        service_type: 'modificacion_obra',
        nombre_proyecto: formData.nombre_proyecto,
        licencia_modificacion: {
          tipo_licencia_edificacion: formData.tipo_licencia_edificacion,
          tipo_modalidad: formData.tipo_modalidad,
        },
        antecedentes_modificacion: {
          vincular_expediente_fsr: formData.vincular_expediente_fsr,
          numero_expediente_externo: formData.numero_expediente_externo,
          licencia_obra_anterior: createDocumentInfo('Licencia de Obra Anterior', true),
          planos_aprobados_anteriores: createDocumentInfo('Planos Aprobados Anteriores', true),
          formulario_unico_anterior: createDocumentInfo('Formulario Único Anterior', true),
        },
        elaboracion_modificacion: {
          planos_arquitectura: createDocumentInfo('Planos de Arquitectura', true),
          planos_estructuras: createDocumentInfo('Planos de Estructuras', true),
          planos_sanitarias: createDocumentInfo('Planos de Sanitarias', true),
          planos_electricas: createDocumentInfo('Planos de Eléctricas', true),
          memoria_descriptiva: createDocumentInfo('Memoria Descriptiva', true),
          documentacion_adicional: createDocumentInfo('Documentación Adicional', false),
        },
        gestion_modificacion: {
          cargo_ingreso_expediente: createDocumentInfo('Cargo de Ingreso del Expediente', true),
          acta_observaciones: createDocumentInfo('Acta de Observaciones', false),
          acta_conformidad: createDocumentInfo('Acta de Conformidad', false),
          acta_reconsideracion: createDocumentInfo('Acta de Reconsideración', false),
          anexo_subsanacion: createDocumentInfo('Anexo de Subsanación', false),
          planos_corregidos: createDocumentInfo('Planos Corregidos', false),
          licencia_modificacion_emitida: createDocumentInfo('Licencia de Modificación Emitida', false),
          cargo_entrega_administrado: createDocumentInfo('Cargo de Entrega al Administrado', false),
        },
      },
    };

    const fechaIngreso = formatDateForBackend(formData.fecha_ingreso_entidad);
    if (fechaIngreso) {
      baseData.data.gestion_modificacion.fecha_ingreso_entidad = fechaIngreso;
    }

    return baseData;
  };

  // Función para construir el request de actualización completo (si se necesita)
  const buildUpdateRequest = () => {
    return buildCreateRequest();
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Administrado
        if (!formData.selectedClient) {
          newErrors.selectedClient = 'Debe seleccionar un administrado';
        }
        if (!formData.nombre_proyecto || formData.nombre_proyecto.trim() === '') {
          newErrors.nombre_proyecto = 'El nombre del proyecto es requerido';
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
        // Validaciones opcionales
        break;
      case 3: // Elaboración
        // Documentos se validan automáticamente
        break;
      case 4: // Gestión
        if (!formData.fecha_ingreso_entidad) {
          newErrors.fecha_ingreso_entidad = 'La fecha de ingreso es requerida';
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

    // Si es el primer paso y no hay modificacionId, crear
    if (currentStep === 0 && !modificacionId) {
      try {
        setIsSaving(true);
        const requestData = buildCreateRequest();
        const newModificacion = await createNew(requestData);
        setModificacionId(newModificacion.id);
      } catch (error) {
        console.error('Error creating modificacion:', error);
        setShowValidationError(true);
        return;
      } finally {
        setIsSaving(false);
      }
    } else if (modificacionId) {
      // Si ya existe, actualizar solo el paso actual
      try {
        setIsSaving(true);
        const updateData = buildUpdateRequestForCurrentStep();
        if (updateData) {
          await update(modificacionId, updateData);
        }
      } catch (error) {
        console.error('Error updating modificacion:', error);
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
      if (modificacionId) {
        const updateData = buildUpdateRequest();
        await update(modificacionId, updateData);
      }
      navigate('/dashboard/modificaciones');
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
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ModificacionFormData, value)}
            title="Paso 1: Seleccionar Administrado"
            description="Seleccione el administrado para este trámite de modificación de obra"
            showProjectName={true}
          />
        );
      case 1:
        return (
          <StepLicencia
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <StepAntecedentes
            formData={formData}
            modificacionId={modificacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 3:
        return (
          <StepElaboracion
            formData={formData}
            modificacionId={modificacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 4:
        return (
          <StepGestion
            formData={formData}
            modificacionId={modificacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      default:
        return null;
    }
  };

  if (clientsLoading || (isEdit && modificacionLoading)) {
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
                  onClick={() => navigate('/dashboard/modificaciones')}
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
                    onClick={() => navigate('/dashboard/modificaciones')}
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
          <ResumenModificacion
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            modificacionId={modificacionId || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
