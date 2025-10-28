import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { useAmpliacion } from '@/hooks/useAmpliaciones';
import toast from 'react-hot-toast';
import { ResumenAmpliacion } from './components';
import { StepCargo } from '@/components/utils/Steps';
import StepProyectoPersonalizado from './StepAmpliacion/StepProyectoPersonalizado';
import StepLicencias from './StepAmpliacion/StepLicencias';
import StepAntecedentes from './StepAmpliacion/StepAntecedentes';
import StepDocumentacion from './StepAmpliacion/StepDocumentacion';
import StepTramiteMunicipal from './StepAmpliacion/StepTramiteMunicipal';
import type { AmpliacionFormData, FormStep, UploadedDocument, DocumentInfo } from '@/types/ampliacion.types';

const stepLabels = [
  'Información del Proyecto',
  'Licencias y Normativas',
  'Antecedentes',
  'Documentación Técnica',
  'Trámite Municipal',
  'Entrega al Administrado'
];

export default function CreateEditAmpliacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const { clients, isLoading: clientsLoading } = useClients();
  const { ampliacion, isLoading: ampliacionLoading, createNew, update, uploadDocs, downloadDoc } = useAmpliacion(id);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [ampliacionId, setAmpliacionId] = useState<string | null>(id || null);
  
  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Información del Proyecto', completed: false },
    { id: 2, title: 'Licencias y Normativas', completed: false },
    { id: 3, title: 'Antecedentes', completed: false },
    { id: 4, title: 'Documentación Técnica', completed: false },
    { id: 5, title: 'Trámite Municipal', completed: false },
    { id: 6, title: 'Entrega al Administrado', completed: false },
  ]);
  
  const [formData, setFormData] = useState<AmpliacionFormData>({
    nombre_proyecto: '',
    selectedClient: null,
    tipo_licencia_edificacion: '',
    modalidad: 'B',
    link_normativas: '',
    archivo_normativo: [],
    gestionado_por_fsr: false,
    proyecto_fsr_id: '',
    certificado_parametros: [],
    licencia_obra: [],
    conformidad_obra: [],
    declaratoria_fabrica: [],
    planos_fabrica: [],
    partida_registral: [],
    fue: [],
    arquitectura_intervencion: [],
    arquitectura_resultante: [],
    arquitectura_memoria: [],
    estructuras_intervencion: [],
    estructuras_resultante: [],
    sanitarias_intervencion: [],
    sanitarias_resultante: [],
    sanitarias_sedapal: [],
    electricas_resultante: [],
    electricas_luz_del_sur: [],
    mecanicas_ficha_tecnica: [],
    gas_resultante: [],
    gas_calidda: [],
    es_condominio: false,
    tiene_junta: 'no',
    autorizacion_condominio: [],
    observaciones_condominio: '',
    fecha_ingreso_municipalidad: '',
    cargo_ingreso: [],
    fecha_comision: '',
    dictamen_comision: 'conforme',
    acta_comision: [],
    seguimiento: [],
    fecha_entrega_administrado: '',
    receptor_administrado: '',
    cargo_entrega_administrado: [],
    observaciones_entrega: '',
  });

  const isEdit = Boolean(id);

  // Cargar datos cuando se edita
  useEffect(() => {
    if (ampliacion && isEdit && clients && clients.length > 0) {
      const selectedClient = clients.find(client => client.id === ampliacion.client_id) || null;

      setFormData(prev => ({
        ...prev,
        selectedClient,
        nombre_proyecto: ampliacion.data?.nombre_proyecto || '',
        tipo_licencia_edificacion: ampliacion.data?.licencias?.tipo_licencia_edificacion || '',
        modalidad: ampliacion.data?.licencias?.modalidad || 'B',
        link_normativas: ampliacion.data?.licencias?.link_normativas || '',
        gestionado_por_fsr: ampliacion.data?.antecedentes?.gestionado_por_fsr || false,
        proyecto_fsr_id: ampliacion.data?.antecedentes?.proyecto_fsr_id || '',
        es_condominio: ampliacion.data?.documentacion_tecnica?.es_condominio || false,
        tiene_junta: ampliacion.data?.documentacion_tecnica?.tiene_junta || 'no',
        observaciones_condominio: ampliacion.data?.documentacion_tecnica?.observaciones_condominio || '',
        fecha_ingreso_municipalidad: ampliacion.data?.tramite_municipal?.fecha_ingreso_municipalidad || '',
        fecha_comision: ampliacion.data?.tramite_municipal?.fecha_comision || '',
        dictamen_comision: ampliacion.data?.tramite_municipal?.dictamen_comision || 'conforme',
        seguimiento: ampliacion.data?.tramite_municipal?.seguimiento || [],
        fecha_entrega_administrado: ampliacion.data?.entrega_final?.fecha_entrega_administrado || '',
        receptor_administrado: ampliacion.data?.entrega_final?.receptor_administrado || '',
        observaciones_entrega: ampliacion.data?.entrega_final?.observaciones_entrega || '',
      }));

      // Cargar documentos
      const allDocs: UploadedDocument[] = [];
      if (ampliacion.uploaded_documents && ampliacion.uploaded_documents.length > 0) {
        const docs = ampliacion.uploaded_documents.map((doc: any) => ({
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
  }, [ampliacion, isEdit, clients]);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Ampliación/Remodelación/Demolición' : 'Nueva Ampliación/Remodelación/Demolición',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    return () => setHeader('Dashboard');
  }, [setHeader, isEdit]);

  const handleInputChange = useCallback((field: keyof AmpliacionFormData, value: any) => {
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

    if (ampliacionId && documentKey) {
      try {
        const response = await uploadDocs(ampliacionId, [file], [documentKey]);
        
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
  }, [ampliacionId, uploadDocs]);

  const handleDownloadDocument = useCallback(async (documentId: string, fileName: string) => {
    if (!ampliacionId) {
      toast.error('No se puede descargar el documento en este momento');
      return;
    }
    
    try {
      await downloadDoc(ampliacionId, documentId, fileName);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  }, [ampliacionId, downloadDoc]);

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

  // PATCH por paso - Solo lo editado
  const buildUpdateRequestForCurrentStep = (): any | null => {
    switch (currentStep) {
      case 0: // Paso 1: Información del Proyecto
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            nombre_proyecto: formData.nombre_proyecto,
          }
        };

      case 1: // Paso 2: Licencias
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            licencias: {
              tipo_licencia_edificacion: formData.tipo_licencia_edificacion,
              modalidad: formData.modalidad,
              link_normativas: formData.link_normativas,
            }
          }
        };

      case 2: // Paso 3: Antecedentes
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            antecedentes: {
              gestionado_por_fsr: formData.gestionado_por_fsr,
              proyecto_fsr_id: formData.proyecto_fsr_id,
            }
          }
        };

      case 3: // Paso 4: Documentación Técnica
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            documentacion_tecnica: {
              es_condominio: formData.es_condominio,
              tiene_junta: formData.tiene_junta,
              observaciones_condominio: formData.observaciones_condominio,
            }
          }
        };

      case 4: // Paso 5: Trámite Municipal
        const tramiteData: any = {
          dictamen_comision: formData.dictamen_comision,
          seguimiento: formData.seguimiento,
        };
        
        const fechaIngreso = formatDateForBackend(formData.fecha_ingreso_municipalidad);
        if (fechaIngreso) tramiteData.fecha_ingreso_municipalidad = fechaIngreso;
        
        const fechaComision = formatDateForBackend(formData.fecha_comision);
        if (fechaComision) tramiteData.fecha_comision = fechaComision;

        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            tramite_municipal: tramiteData
          }
        };

      case 5: // Paso 6: Entrega al Administrado
        const entregaData: any = {
          receptor_administrado: formData.receptor_administrado,
          observaciones_entrega: formData.observaciones_entrega,
        };
        
        const fechaEntrega = formatDateForBackend(formData.fecha_entrega_administrado);
        if (fechaEntrega) entregaData.fecha_entrega_administrado = fechaEntrega;

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

  // Construir request de creación completo
  const buildCreateRequest = (): any => {
    const baseData: any = {
      client_id: formData.selectedClient?.id || '',
      data: {
        service_type: 'ampliacion_remodelacion',
        nombre_proyecto: formData.nombre_proyecto,
        licencias: {
          tipo_licencia_edificacion: formData.tipo_licencia_edificacion,
          modalidad: formData.modalidad,
          link_normativas: formData.link_normativas,
          archivo_normativo: createDocumentInfo('Archivo Normativo', false),
        },
        antecedentes: {
          gestionado_por_fsr: formData.gestionado_por_fsr,
          proyecto_fsr_id: formData.proyecto_fsr_id,
          certificado_parametros: createDocumentInfo('Certificado de Parámetros', true),
          licencia_obra: createDocumentInfo('Licencia de Obra', true),
          conformidad_obra: createDocumentInfo('Conformidad de Obra', false),
          declaratoria_fabrica: createDocumentInfo('Declaratoria de Fábrica', false),
          planos_fabrica: createDocumentInfo('Planos de Fábrica', false),
          partida_registral: createDocumentInfo('Partida Registral', true),
        },
        documentacion_tecnica: {
          fue: createDocumentInfo('FUE', true),
          arquitectura_intervencion: createDocumentInfo('Planos Intervención Arquitectura', true),
          arquitectura_resultante: createDocumentInfo('Planos Resultante Arquitectura', true),
          arquitectura_memoria: createDocumentInfo('Memoria Descriptiva', true),
          estructuras_intervencion: createDocumentInfo('Planos Intervención Estructuras', false),
          estructuras_resultante: createDocumentInfo('Planos Resultante Estructuras', false),
          sanitarias_intervencion: createDocumentInfo('Planos Intervención Sanitarias', false),
          sanitarias_resultante: createDocumentInfo('Planos Resultante Sanitarias', false),
          sanitarias_sedapal: createDocumentInfo('Factibilidad Sedapal', false),
          electricas_resultante: createDocumentInfo('Planos Resultante Eléctricas', false),
          electricas_luz_del_sur: createDocumentInfo('Factibilidad Luz del Sur', false),
          mecanicas_ficha_tecnica: createDocumentInfo('Ficha Técnica Mecánicas', false),
          gas_resultante: createDocumentInfo('Planos Resultante Gas', false),
          gas_calidda: createDocumentInfo('Factibilidad Cálidda', false),
          es_condominio: formData.es_condominio,
          tiene_junta: formData.tiene_junta,
          autorizacion_condominio: createDocumentInfo('Autorización Condominio', false),
          observaciones_condominio: formData.observaciones_condominio,
        },
        tramite_municipal: {
          cargo_ingreso: createDocumentInfo('Cargo de Ingreso', false),
          dictamen_comision: formData.dictamen_comision,
          acta_comision: createDocumentInfo('Acta de Comisión', false),
          seguimiento: formData.seguimiento,
        },
        entrega_final: {
          receptor_administrado: formData.receptor_administrado,
          cargo_entrega_administrado: createDocumentInfo('Cargo de Entrega', false),
          observaciones_entrega: formData.observaciones_entrega,
        },
      },
    };

    // Agregar fechas si existen
    const fechaIngreso = formatDateForBackend(formData.fecha_ingreso_municipalidad);
    if (fechaIngreso) baseData.data.tramite_municipal.fecha_ingreso_municipalidad = fechaIngreso;

    const fechaComision = formatDateForBackend(formData.fecha_comision);
    if (fechaComision) baseData.data.tramite_municipal.fecha_comision = fechaComision;

    const fechaEntrega = formatDateForBackend(formData.fecha_entrega_administrado);
    if (fechaEntrega) baseData.data.entrega_final.fecha_entrega_administrado = fechaEntrega;

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
        if (!formData.tipo_licencia_edificacion?.trim()) {
          newErrors.tipo_licencia_edificacion = 'El tipo de licencia es requerido';
        }
        if (!formData.modalidad) {
          newErrors.modalidad = 'Debe seleccionar una modalidad';
        }
        break;
        
      case 2:
        // Validaciones opcionales
        break;
        
      case 3:
        // Validaciones de documentos
        break;
        
      case 4:
        // Validaciones opcionales
        break;

      case 5:
        if (!formData.fecha_entrega_administrado) {
          newErrors.fecha_entrega_administrado = 'La fecha de entrega es requerida';
        }
        if (!formData.receptor_administrado) {
          newErrors.receptor_administrado = 'El nombre del receptor es requerido';
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

    // Si es el primer paso y no hay ampliacionId, crear
    if (currentStep === 0 && !ampliacionId) {
      try {
        setIsSaving(true);
        const requestData = buildCreateRequest();
        const newAmpliacion = await createNew(requestData);
        setAmpliacionId(newAmpliacion.id);
      } catch (error) {
        console.error('Error creating ampliacion:', error);
        setShowValidationError(true);
        return;
      } finally {
        setIsSaving(false);
      }
    } else if (ampliacionId) {
      try {
        setIsSaving(true);
        const updateData = buildUpdateRequestForCurrentStep();
        if (updateData) {
          await update(ampliacionId, updateData);
        }
      } catch (error) {
        console.error('Error updating ampliacion:', error);
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
      if (ampliacionId) {
        const updateData = buildCreateRequest();
        await update(ampliacionId, updateData);
      }
      navigate('/dashboard/ampliaciones');
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
          <StepProyectoPersonalizado
            formData={formData}
            clients={clients || []}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <StepLicencias
            formData={formData}
            errors={errors}
            ampliacionId={ampliacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 2:
        return (
          <StepAntecedentes
            formData={formData}
            errors={errors}
            ampliacionId={ampliacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 3:
        return (
          <StepDocumentacion
            formData={formData}
            errors={errors}
            ampliacionId={ampliacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 4:
        return (
          <StepTramiteMunicipal
            formData={formData}
            errors={errors}
            ampliacionId={ampliacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 5:
        return (
          <StepCargo
            formData={formData}
            projectId={ampliacionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof AmpliacionFormData, value)}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
            title="Cargo"
            description="Complete la información de la entrega final de la ampliación al administrado"
            cargoDocumentKey="entrega_final.cargo_entrega_administrado"
          />
        );
      default:
        return null;
    }
  };

  if (clientsLoading || (isEdit && ampliacionLoading)) {
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
                  onClick={() => navigate('/dashboard/ampliaciones')}
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
                    onClick={() => navigate('/dashboard/ampliaciones')}
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
          <ResumenAmpliacion
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            ampliacionId={ampliacionId || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
