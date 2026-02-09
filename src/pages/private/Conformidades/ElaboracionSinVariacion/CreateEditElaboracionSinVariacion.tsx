import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import toast from 'react-hot-toast';

import type { 
  ElaboracionSinVariacionFormData, 
  FormStep, 
  UploadedDocument,
} from '@/types/conformidad.types';
import {
  createEmptyPredioConformidad,
  createEmptyLicenciaEdificacion,
  createEmptyChecklistCascoHabitable,
  createEmptyDocumentosAdministradoSinVariacion,
  createEmptyDocumentosFSRSinVariacion,
} from '@/types/conformidad.types';

import { StepAdministrado, StepCargo } from '@/components/utils/Steps';
import { StepPredioConformidadObra, StepLicenciaEdificacion, StepChecklistCascoHabitable, StepVerificacionOcular } from '../GestionConVariacion/Steps';
import { StepAntecedentesElaboracion } from '../ElaboracionConVariacion/Steps';
import { StepDocumentosAdministradoSinVariacion, StepDocumentosFSRSinVariacion } from './Steps';
import { ResumenElaboracionSinVariacion } from './components';

export default function CreateEditElaboracionSinVariacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const { clients, isLoading: clientsLoading } = useClients();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [elaboracionId, setElaboracionId] = useState<string | null>(id || null);
  
  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Predio', completed: false },
    { id: 3, title: 'Antecedentes', completed: false },
    { id: 4, title: 'Licencia Edificación', completed: false },
    { id: 5, title: 'Casco Habitable', completed: false },
    { id: 6, title: 'Inspección Ocular', completed: false },
    { id: 7, title: 'Docs. Administrado', completed: false },
    { id: 8, title: 'Docs. FSR', completed: false },
    { id: 9, title: 'Entrega', completed: false },
  ]);
  
  const [formData, setFormData] = useState<ElaboracionSinVariacionFormData>({
    selectedClient: null,
    nombre_proyecto: '',
    predio: createEmptyPredioConformidad(),
    expedientes_licencias: [],
    licencia_edificacion: createEmptyLicenciaEdificacion(),
    checklist_casco_habitable: createEmptyChecklistCascoHabitable(),
    verificacion_campo: false,
    fecha_verificacion: '',
    observaciones_verificacion: '',
    documentos_administrado: createEmptyDocumentosAdministradoSinVariacion(),
    documentos_fsr: createEmptyDocumentosFSRSinVariacion(),
    fecha_entrega_administrado: '',
    receptor_administrado: '',
    cargo_entrega_administrado: [],
    observaciones_entrega: '',
  });

  const isEdit = Boolean(id);

  const shouldShowCascoHabitable = 
    formData.licencia_edificacion.uso_edificacion === 'vivienda_multifamiliar' &&
    formData.licencia_edificacion.solicita_casco_habitable;

  const getVisibleSteps = useCallback(() => {
    if (shouldShowCascoHabitable) {
      return steps;
    }
    return steps.filter((_, index) => index !== 4);
  }, [steps, shouldShowCascoHabitable]);

  const visibleSteps = getVisibleSteps();

  const getActualStepIndex = useCallback((visibleIndex: number): number => {
    if (shouldShowCascoHabitable) {
      return visibleIndex;
    }
    return visibleIndex >= 4 ? visibleIndex + 1 : visibleIndex;
  }, [shouldShowCascoHabitable]);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Elaboración Sin Variación' : 'Nueva Elaboración Sin Variación',
      'Elaboración de conformidad de obra sin variaciones'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = useCallback((field: keyof ElaboracionSinVariacionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
    if (!elaboracionId) {
      toast.error('No se puede descargar el documento en este momento');
      return;
    }
    console.log('Downloading:', documentId, fileName);
  }, [elaboracionId]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const actualStep = getActualStepIndex(step);

    switch (actualStep) {
      case 0:
        if (!formData.selectedClient) {
          newErrors.selectedClient = 'Debe seleccionar un administrado';
        }
        if (!formData.nombre_proyecto || formData.nombre_proyecto.trim() === '') {
          newErrors.nombre_proyecto = 'El nombre del proyecto es requerido';
        }
        break;
      case 1:
        if (!formData.predio.departmentId) {
          newErrors.departmentId = 'El departamento es requerido';
        }
        break;
      case 2:
        if (formData.expedientes_licencias.length === 0) {
          newErrors.expedientes_licencias = 'Debe agregar al menos una licencia';
        }
        break;
      case 3:
        if (!formData.licencia_edificacion.resolucion_licencia) {
          newErrors.resolucion_licencia = 'La resolución de licencia es requerida';
        }
        break;
      case 8:
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
      toast.success('Elaboración guardada correctamente');
      navigate('/dashboard/elaboracion-conformidad-sin-variacion');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar la elaboración');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    const actualStep = getActualStepIndex(currentStep);

    switch (actualStep) {
      case 0:
        return (
          <StepAdministrado
            formData={formData}
            clients={clients || []}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ElaboracionSinVariacionFormData, value)}
            title="Paso 1: Seleccionar Administrado"
            description="Seleccione el administrado para este trámite de elaboración de conformidad"
            showProjectName={true}
          />
        );
      case 1:
        return (
          <StepPredioConformidadObra
            formData={formData as any}
            errors={errors}
            onInputChange={handleInputChange as any}
          />
        );
      case 2:
        return (
          <StepAntecedentesElaboracion
            formData={formData}
            errors={errors}
            elaboracionId={elaboracionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 3:
        return (
          <StepLicenciaEdificacion
            formData={formData as any}
            errors={errors}
            onInputChange={handleInputChange as any}
          />
        );
      case 4:
        return (
          <StepChecklistCascoHabitable
            formData={formData as any}
            errors={errors}
            onInputChange={handleInputChange as any}
          />
        );
      case 5:
        return (
          <StepVerificacionOcular
            formData={formData as any}
            errors={errors}
            onInputChange={handleInputChange as any}
          />
        );
      case 6:
        return (
          <StepDocumentosAdministradoSinVariacion
            formData={formData}
            errors={errors}
            elaboracionId={elaboracionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 7:
        return (
          <StepDocumentosFSRSinVariacion
            formData={formData}
            errors={errors}
            elaboracionId={elaboracionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 8:
        return (
          <StepCargo
            formData={formData}
            projectId={elaboracionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ElaboracionSinVariacionFormData, value)}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
            title="Entrega al Administrado"
            description="Complete la información de la entrega final al administrado"
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
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
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

            {showValidationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <LuInfo className="w-5 h-5 text-red-600" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Por favor, complete los campos obligatorios
                    </h4>
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
                    Anterior
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="bordered"
                  onClick={() => navigate('/dashboard/elaboracion-conformidad-sin-variacion')}
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
                    Siguiente
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

        <div className="lg:col-span-1">
          <ResumenElaboracionSinVariacion
            formData={formData}
            currentStep={currentStep}
            steps={visibleSteps}
            elaboracionId={elaboracionId || 'new'}
            onSave={handleSave}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
