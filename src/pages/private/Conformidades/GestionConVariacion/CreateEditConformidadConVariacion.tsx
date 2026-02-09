import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import toast from 'react-hot-toast';

import type { 
  ConformidadConVariacionFormData, 
  FormStep, 
  UploadedDocument,
  createEmptyExpedienteLicencia,
  createEmptyRevisionConformidad,
  initialConformidadConVariacionFormData,
} from '@/types/conformidad.types';

import { StepAdministrado, StepCargo } from '@/components/utils/Steps';
import {
  StepDocumentosIniciales,
  StepAntecedentesLicencias,
  StepLicenciaEdificacion,
  StepChecklistCascoHabitable,
  StepPredioConformidadObra,
  StepVerificacionOcular,
  StepPresentacionMunicipal,
  StepSeguimiento,
  StepPresentacionCopias,
} from './Steps';
import { ResumenConformidadConVariacion } from './components';

// Labels de los pasos
const stepLabels = [
  'Administrado',
  'Documentos Iniciales',
  'Antecedentes',
  'Licencia Edificación',
  'Casco Habitable',
  'Predio',
  'Inspección Ocular',
  'Presentación Municipal',
  'Seguimiento',
  'Presentación Copias',
  'Entrega'
];

export default function CreateEditConformidadConVariacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const { clients, isLoading: clientsLoading } = useClients();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [conformidadId, setConformidadId] = useState<string | null>(id || null);
  
  // Estado para manejar los pasos del formulario
  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Documentos Iniciales', completed: false },
    { id: 3, title: 'Antecedentes', completed: false },
    { id: 4, title: 'Licencia Edificación', completed: false },
    { id: 5, title: 'Casco Habitable', completed: false },
    { id: 6, title: 'Predio', completed: false },
    { id: 7, title: 'Inspección Ocular', completed: false },
    { id: 8, title: 'Presentación Municipal', completed: false },
    { id: 9, title: 'Seguimiento', completed: false },
    { id: 10, title: 'Presentación Copias', completed: false },
    { id: 11, title: 'Entrega', completed: false },
  ]);
  
  const [formData, setFormData] = useState<ConformidadConVariacionFormData>({
    // Step 1: Administrado
    selectedClient: null,
    nombre_proyecto: '',

    // Step 2: Documentos Iniciales
    documentos_iniciales: [],
    
    // Step 3: Antecedentes (CRUD de Licencias)
    expedientes_licencias: [],
    
    // Step 4: Licencia de Edificación y Uso
    licencia_edificacion: {
      resolucion_licencia: '',
      modalidad_aprobacion: '',
      tipo_licencia: '',
      uso_aprobado: '',
      zonificacion: '',
      altura: '',
      uso_edificacion: '',
      solicita_casco_habitable: false,
    },
    
    // Step 5: Checklist Casco Habitable
    checklist_casco_habitable: {
      estructuras_terminadas: false,
      fachadas_terminadas: false,
      instalaciones_operativas: false,
      ascensores_operativos: false,
      areas_comunes_terminadas: false,
      estacionamientos_habilitados: false,
      muros_revocados: false,
      falsos_pisos_terminados: false,
      vidrios_instalados: false,
      bano_terminado: false,
      instalaciones_electricas_operativas: false,
      instalaciones_sanitarias_operativas: false,
    },
    
    // Step 6: Datos del Predio
    predio: {
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
      numero_sotanos: 0,
      numero_semisotanos: 0,
      tiene_azotea: false,
      area_techada_total_m2: 0,
      area_libre_m2: 0,
      descripcion_proyecto: '',
    },
    
    // Step 7: Inspección Ocular
    verificacion_campo: false,
    fecha_verificacion: '',
    observaciones_verificacion: '',
    
    // Step 8: Presentación ante Municipalidad
    fecha_ingreso: '',
    numero_expediente: '',
    archivo_cargo: [],
    
    // Step 9: Seguimiento
    revisiones: [],
    revision_actual_index: 0,
    estado_seguimiento: 'en_proceso',
    
    // Step 10: Presentación de Copias
    presentacion_copias: {
      cargo_presentacion: [],
      fecha_recoleccion: '',
      fue_conformidad_declaratoria: [],
      plano_ubicacion: [],
      resolucion_conformidad: [],
      otros_documentos: [],
    },
    
    // Step 11: Entrega al Administrado
    fecha_entrega_administrado: '',
    receptor_administrado: '',
    cargo_entrega_administrado: [],
    observaciones_entrega: '',
  });

  const isEdit = Boolean(id);

  // Determinar si se debe mostrar el paso de Casco Habitable
  const shouldShowCascoHabitable = 
    formData.licencia_edificacion.uso_edificacion === 'vivienda_multifamiliar' &&
    formData.licencia_edificacion.solicita_casco_habitable;

  // Obtener los pasos visibles (filtrar Casco Habitable si no aplica)
  const getVisibleSteps = useCallback(() => {
    if (shouldShowCascoHabitable) {
      return steps;
    }
    // Filtrar el paso de Casco Habitable (índice 4)
    return steps.filter((_, index) => index !== 4);
  }, [steps, shouldShowCascoHabitable]);

  const visibleSteps = getVisibleSteps();

  // Mapear índice visible a índice real
  const getActualStepIndex = useCallback((visibleIndex: number): number => {
    if (shouldShowCascoHabitable) {
      return visibleIndex;
    }
    // Si el índice visible es >= 4, sumar 1 para saltar Casco Habitable
    return visibleIndex >= 4 ? visibleIndex + 1 : visibleIndex;
  }, [shouldShowCascoHabitable]);

  // Mapear índice real a índice visible
  const getVisibleStepIndex = useCallback((actualIndex: number): number => {
    if (shouldShowCascoHabitable) {
      return actualIndex;
    }
    // Si el índice real es > 4, restar 1
    return actualIndex > 4 ? actualIndex - 1 : actualIndex;
  }, [shouldShowCascoHabitable]);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Conformidad Con Variación' : 'Nueva Conformidad Con Variación',
      'Gestión de conformidad de obra con variaciones'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = useCallback((field: keyof ConformidadConVariacionFormData, value: any) => {
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
    
    return uploadedDoc;
  }, []);

  const handleDownloadDocument = useCallback(async (documentId: string, fileName: string) => {
    if (!conformidadId) {
      toast.error('No se puede descargar el documento en este momento');
      return;
    }
    
    // TODO: Implementar descarga real
    console.log('Downloading:', documentId, fileName);
  }, [conformidadId]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const actualStep = getActualStepIndex(step);

    switch (actualStep) {
      case 0: // Administrado
        if (!formData.selectedClient) {
          newErrors.selectedClient = 'Debe seleccionar un administrado';
        }
        if (!formData.nombre_proyecto || formData.nombre_proyecto.trim() === '') {
          newErrors.nombre_proyecto = 'El nombre del proyecto es requerido';
        }
        break;
      case 1: // Documentos Iniciales
        // Validación opcional
        break;
      case 2: // Antecedentes
        if (formData.expedientes_licencias.length === 0) {
          newErrors.expedientes_licencias = 'Debe agregar al menos una licencia';
        }
        break;
      case 3: // Licencia Edificación
        if (!formData.licencia_edificacion.resolucion_licencia) {
          newErrors.resolucion_licencia = 'La resolución de licencia es requerida';
        }
        if (!formData.licencia_edificacion.uso_edificacion) {
          newErrors.uso_edificacion = 'El uso de edificación es requerido';
        }
        break;
      case 4: // Casco Habitable (solo si aplica)
        // Validación del checklist
        break;
      case 5: // Predio
        if (!formData.predio.departmentId) {
          newErrors.departmentId = 'El departamento es requerido';
        }
        if (!formData.predio.districtId) {
          newErrors.districtId = 'El distrito es requerido';
        }
        break;
      case 6: // Inspección Ocular
        // Validación opcional
        break;
      case 7: // Presentación Municipal
        if (!formData.fecha_ingreso) {
          newErrors.fecha_ingreso = 'La fecha de ingreso es requerida';
        }
        if (!formData.numero_expediente) {
          newErrors.numero_expediente = 'El número de expediente es requerido';
        }
        break;
      case 8: // Seguimiento
        // Validación del seguimiento
        break;
      case 9: // Presentación Copias
        // Validación opcional
        break;
      case 10: // Entrega
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

    // Marcar paso como completado y avanzar
    setSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === getActualStepIndex(currentStep) ? { ...step, completed: true } : step
      )
    );
    
    if (currentStep < visibleSteps.length - 1) {
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
    } else if (visibleSteps[stepIndex]?.completed || stepIndex === currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implementar guardado real
      toast.success('Conformidad guardada correctamente');
      navigate('/dashboard/gestion-conformidad-con-variacion');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar la conformidad');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    const actualStep = getActualStepIndex(currentStep);

    switch (actualStep) {
      case 0: // Administrado
        return (
          <StepAdministrado
            formData={formData}
            clients={clients || []}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ConformidadConVariacionFormData, value)}
            title="Paso 1: Seleccionar Administrado"
            description="Seleccione el administrado para este trámite de conformidad de obra con variación"
            showProjectName={true}
          />
        );
      case 1: // Documentos Iniciales
        return (
          <StepDocumentosIniciales
            formData={formData}
            errors={errors}
            conformidadId={conformidadId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 2: // Antecedentes (CRUD Licencias)
        return (
          <StepAntecedentesLicencias
            formData={formData}
            errors={errors}
            conformidadId={conformidadId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 3: // Licencia Edificación
        return (
          <StepLicenciaEdificacion
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 4: // Casco Habitable (condicional)
        return (
          <StepChecklistCascoHabitable
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 5: // Predio
        return (
          <StepPredioConformidadObra
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 6: // Inspección Ocular
        return (
          <StepVerificacionOcular
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 7: // Presentación Municipal
        return (
          <StepPresentacionMunicipal
            formData={formData}
            errors={errors}
            conformidadId={conformidadId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 8: // Seguimiento
        return (
          <StepSeguimiento
            formData={formData}
            errors={errors}
            conformidadId={conformidadId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 9: // Presentación Copias
        return (
          <StepPresentacionCopias
            formData={formData}
            errors={errors}
            conformidadId={conformidadId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 10: // Entrega
        return (
          <StepCargo
            formData={formData}
            projectId={conformidadId || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ConformidadConVariacionFormData, value)}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
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
              <div className="flex items-center gap-2 flex-wrap">
                {visibleSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
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
                    Anterior
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="bordered"
                  onClick={() => navigate('/dashboard/gestion-conformidad-con-variacion')}
                  startContent={<LuX className="w-4 h-4" />}
                >
                  Cancelar
                </Button>

                {currentStep < visibleSteps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    className="text-white hover:opacity-90"
                    endContent={<LuArrowRight className="w-4 h-4" />}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Guardando...' : 'Siguiente'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    className="text-white hover:opacity-90"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Guardando...' : 'Finalizar'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <ResumenConformidadConVariacion
            formData={formData}
            currentStep={currentStep}
            steps={visibleSteps}
            conformidadId={conformidadId || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
