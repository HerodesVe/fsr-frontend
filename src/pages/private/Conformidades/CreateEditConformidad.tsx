import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { Button } from '@/components/ui';
import { useHeaderStore } from '@/store/headerStore';
import { useClients } from '@/hooks/useClients';
import { useConformidad } from '@/hooks/useConformidades';
import toast from 'react-hot-toast';

import type { 
  ConformidadFormData, 
  FormStep, 
  UploadedDocument,
  CreateConformidadRequest,
  DocumentInfo 
} from '@/types/conformidad.types';
import { StepAdministrado, StepCargo } from '@/components/utils/Steps';
import StepModalidad from './StepConformidad/StepModalidad';
import StepDocumentosIniciales from './StepConformidad/StepDocumentosIniciales';
import StepAntecedentes from './StepConformidad/StepAntecedentes';
import StepDocumentosExpediente from './StepConformidad/StepDocumentosExpediente';
import StepVerificacion from './StepConformidad/StepVerificacion';
import { ResumenConformidad } from './components';

const stepLabels = [
  'Modalidad',
  'Administrado',
  'Documentos Iniciales',
  'Antecedentes',
  'Documentos Expediente',
  'Verificación',
  'Cargo'
];

export default function CreateEditConformidad() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();
  const { clients, isLoading: clientsLoading } = useClients();
  const { conformidad, isLoading: conformidadLoading, createNew, update, uploadDocs, downloadDoc } = useConformidad(id);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [conformidadId, setConformidadId] = useState<string | null>(id || null);
  
  // Estado para manejar los pasos del formulario
  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Modalidad', completed: false },
    { id: 2, title: 'Administrado', completed: false },
    { id: 3, title: 'Documentos Iniciales', completed: false },
    { id: 4, title: 'Antecedentes', completed: false },
    { id: 5, title: 'Documentos Expediente', completed: false },
    { id: 6, title: 'Verificación', completed: false },
    { id: 7, title: 'Entrega al Administrado', completed: false },
  ]);
  
  const [formData, setFormData] = useState<ConformidadFormData>({
    // Información General
    selectedClient: null,
    nombre_proyecto: '',
    modalidad: 'sin_variaciones', // ✅ Valor por defecto

    // Sin Variaciones - Documentos del Cliente
    licencia_obra_sv: [],
    planos_aprobados_sv: [],
    
    // Sin Variaciones - Verificación Preliminar
    verificacion_campo_sv: false,
    fecha_verificacion_sv: '',

    // Con Variaciones - Información Inicial
    servicios_previos_fsr: false,
    
    // Con Variaciones - Documentos Iniciales del Cliente
    licencia_obra_cv: [],
    planos_aprobados_licencia_cv: [],
    planos_digitales_cad_cv: [],

    // Con Variaciones - Análisis de Antecedentes
    primer_expediente: true,
    descripcion_antecedentes: '',
    expedientes_anteriores: [],

    // Con Variaciones - Documentos del Expediente (Elaboración FSR)
    fue_conformidad: [],
    planos_conformidad: [],
    memoria_descriptiva: [],
    cuaderno_obra: [],
    protocolos: [],
    declaraciones_juradas: [],
    sustentos_tecnicos: [],

    // Paso 7: Entrega al Administrado
    fecha_entrega_administrado: '',
    receptor_administrado: '',
    cargo_entrega_administrado: [],
    observaciones_entrega: '',
  });

  const isEdit = Boolean(id);

  // Cargar datos de la conformidad cuando se edita
  useEffect(() => {
    if (conformidad && isEdit && clients && clients.length > 0) {
      // Buscar el cliente seleccionado
      const selectedClient = clients.find(client => client.id === conformidad.client_id) || null;

      setFormData(prev => ({
        ...prev,
        selectedClient,
        nombre_proyecto: conformidad.data?.nombre_proyecto || '',
        modalidad: conformidad.data?.modalidad || 'sin_variaciones',
        
        // Sin Variaciones - Verificación
        verificacion_campo_sv: conformidad.data?.verificacion_sv?.verificacion_campo_sv || false,
        fecha_verificacion_sv: conformidad.data?.verificacion_sv?.fecha_verificacion_sv || '',
        
        // Con Variaciones - Información Inicial
        servicios_previos_fsr: conformidad.data?.informacion_inicial_cv?.servicios_previos_fsr || false,
        
        // Con Variaciones - Antecedentes
        primer_expediente: conformidad.data?.antecedentes_cv?.primer_expediente ?? true,
        descripcion_antecedentes: conformidad.data?.antecedentes_cv?.descripcion_antecedentes || '',
        
        // Entrega Final
        fecha_entrega_administrado: conformidad.data?.entrega_final?.fecha_entrega_administrado || '',
        receptor_administrado: conformidad.data?.entrega_final?.receptor_administrado || '',
        observaciones_entrega: conformidad.data?.entrega_final?.observaciones_entrega || '',
      }));

      // Cargar documentos subidos
      const allDocs: UploadedDocument[] = [];
      
      // 1. Desde uploaded_documents
      if (conformidad.uploaded_documents && conformidad.uploaded_documents.length > 0) {
        const docs = conformidad.uploaded_documents.map((doc: any) => ({
          id: doc.file_id,
          name: doc.name,
          url: '',
          size: 0,
          type: 'application/pdf',
          key: doc.key,
        }));
        allDocs.push(...docs);
      }

      // 2. Desde data.entrega_final
      if (conformidad.data?.entrega_final?.cargo_entrega_administrado?.file_reference) {
        const cargoDoc = conformidad.data.entrega_final.cargo_entrega_administrado;
        allDocs.push({
          id: cargoDoc.file_reference,
          name: cargoDoc.name || 'Cargo Entrega Administrado',
          url: '',
          size: 0,
          type: 'application/pdf',
          key: 'entrega_final.cargo_entrega_administrado',
        });
      }

      if (allDocs.length > 0) {
        setUploadedDocuments(allDocs);
      }
    }
  }, [conformidad, isEdit, clients]);

  useEffect(() => {
    setHeader(
      isEdit ? 'Editar Conformidad de Obra' : 'Nueva Conformidad de Obra',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEdit]);

  const handleInputChange = useCallback((field: keyof ConformidadFormData, value: any) => {
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
  }, []);

  const handleFileUpload = useCallback(async (file: File, documentKey?: string): Promise<UploadedDocument> => {
    const tempId = Date.now().toString();
    
    // Crear objeto local inmediatamente
    const uploadedDoc: UploadedDocument = {
      id: tempId,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      key: documentKey,
    };
    
    setUploadedDocuments(prev => [...prev, uploadedDoc]);

    // Si ya tenemos un ID de conformidad, subir el archivo inmediatamente
    if (conformidadId && documentKey) {
      try {
        const response = await uploadDocs(conformidadId, [file], [documentKey]);
        
        // Actualizar con file_id real del backend
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
  }, [conformidadId, uploadDocs]);

  const handleDownloadDocument = useCallback(async (documentId: string, fileName: string) => {
    if (!conformidadId) {
      toast.error('No se puede descargar el documento en este momento');
      return;
    }
    
    try {
      await downloadDoc(conformidadId, documentId, fileName);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  }, [conformidadId, downloadDoc]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Modalidad
        if (!formData.modalidad) {
          newErrors.modalidad = 'Debe seleccionar una modalidad';
        }
        break;
      case 1: // Administrado
        if (!formData.selectedClient) {
          newErrors.selectedClient = 'Debe seleccionar un administrado';
        }
        if (!formData.nombre_proyecto || formData.nombre_proyecto.trim() === '') {
          newErrors.nombre_proyecto = 'El nombre del proyecto es requerido';
        }
        break;
      case 2: // Documentos Iniciales
        if (formData.modalidad === 'sin_variaciones') {
          if (formData.licencia_obra_sv.length === 0) {
            newErrors.licencia_obra_sv = 'La licencia de obra es requerida';
          }
          if (formData.planos_aprobados_sv.length === 0) {
            newErrors.planos_aprobados_sv = 'Los planos aprobados son requeridos';
          }
        } else if (formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') {
          if (!formData.servicios_previos_fsr && formData.licencia_obra_cv.length === 0) {
            newErrors.licencia_obra_cv = 'La licencia de obra es requerida';
          }
        }
        break;
      case 3: // Antecedentes
        // Validaciones opcionales para antecedentes
        if (!formData.primer_expediente && !formData.descripcion_antecedentes) {
          newErrors.descripcion_antecedentes = 'La descripción de antecedentes es requerida';
        }
        break;
      case 4: // Documentos Expediente
        if (formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') {
          if (formData.fue_conformidad.length === 0) {
            newErrors.fue_conformidad = 'El FUE de conformidad es requerido';
          }
          if (formData.planos_conformidad.length === 0) {
            newErrors.planos_conformidad = 'Los planos de conformidad son requeridos';
          }
        }
        break;
      case 5: // Verificación
        if (formData.modalidad === 'sin_variaciones' && !formData.fecha_verificacion_sv) {
          newErrors.fecha_verificacion_sv = 'La fecha de verificación es requerida';
        }
        break;
      case 6: // Entrega al Administrado
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

    // Si es el paso de Administrado (paso 1) y no hay conformidadId, crear la conformidad
    if (currentStep === 1 && !conformidadId) {
      try {
        setIsSaving(true);
        const requestData = buildCreateRequest();
        const newConformidad = await createNew(requestData);
        setConformidadId(newConformidad.id);
      } catch (error) {
        console.error('Error creating conformidad:', error);
        setShowValidationError(true);
        return;
      } finally {
        setIsSaving(false);
      }
    } else if (conformidadId) {
      // Si ya existe, actualizar solo según el paso actual
      try {
        setIsSaving(true);
        const updateData = buildUpdateRequestForCurrentStep();
        if (updateData) {
          await update(conformidadId, updateData);
        }
      } catch (error) {
        console.error('Error updating conformidad:', error);
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

  // Función para construir el request de actualización según el paso actual
  const buildUpdateRequestForCurrentStep = (): any | null => {
    switch (currentStep) {
      case 0: // Paso 1: Modalidad
        // ⚠️ La modalidad se establece en el estado local solamente
        // NO se hace PATCH aquí porque el POST se hará en el siguiente paso (Administrado)
        return null;

      case 1: // Paso 2: Administrado
        // Solo actualizar datos básicos si ya existe la conformidad
        return {
          client_id: formData.selectedClient?.id || '',
          data: {
            service_type: 'conformidad_obra',
            nombre_proyecto: formData.nombre_proyecto,
          }
        };

      case 2: // Paso 3: Documentos Iniciales
        // ⚠️ NO enviar estructura de documentos, los documentos se suben automáticamente con handleFileUpload
        // Solo enviar campos de formulario (inputs del usuario)
        if (formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') {
          return {
            client_id: formData.selectedClient?.id || '',
            data: {
              informacion_inicial_cv: {
                servicios_previos_fsr: formData.servicios_previos_fsr,
              }
            }
          };
        }
        // Sin Variaciones no tiene campos adicionales en este paso (solo documentos que ya se suben automáticamente)
        return null;

      case 3: // Paso 4: Antecedentes
        // ⚠️ NO enviar estructura de documentos, solo campos de texto/formulario
        if (formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') {
          return {
            client_id: formData.selectedClient?.id || '',
            data: {
              antecedentes_cv: {
                primer_expediente: formData.primer_expediente,
                descripcion_antecedentes: formData.descripcion_antecedentes,
              }
            }
          };
        }
        // Sin Variaciones no tiene este paso
        return null;

      case 4: // Paso 5: Documentos Expediente
        // ⚠️ NO enviar estructura de documentos, solo se suben con handleFileUpload
        // Este paso solo maneja documentos, no hay campos de formulario adicionales
        return null;

      case 5: // Paso 6: Verificación
        // Solo para Sin Variaciones - enviar campos de verificación
        if (formData.modalidad === 'sin_variaciones') {
          const verificacionData: any = {
            verificacion_campo_sv: formData.verificacion_campo_sv,
          };
          
          const fechaVerificacion = formatDateForBackend(formData.fecha_verificacion_sv);
          if (fechaVerificacion) {
            verificacionData.fecha_verificacion_sv = fechaVerificacion;
          }
          
          return {
            client_id: formData.selectedClient?.id || '',
            data: {
              verificacion_sv: verificacionData
            }
          };
        }
        // Con Variaciones/Casco Habitable no tiene este paso de verificación
        return null;

      case 6: // Paso 7: Entrega al Administrado
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

  // Función para construir el request de creación
  const buildCreateRequest = (): CreateConformidadRequest => {
    const baseData: any = {
      client_id: formData.selectedClient?.id || '',
      data: {
        service_type: 'conformidad_obra',
        nombre_proyecto: formData.nombre_proyecto,
        modalidad: formData.modalidad as 'sin_variaciones' | 'con_variaciones' | 'casco_habitable',
        entrega_final: {
          receptor_administrado: formData.receptor_administrado,
          cargo_entrega_administrado: createDocumentInfo('Cargo Entrega Administrado', false),
          observaciones_entrega: formData.observaciones_entrega,
        },
      },
    };

    // Solo agregar fecha de entrega si tiene valor (formato ISO)
    const fechaEntrega = formatDateForBackend(formData.fecha_entrega_administrado);
    if (fechaEntrega) {
      baseData.data.entrega_final.fecha_entrega_administrado = fechaEntrega;
    }

    // Agregar datos según modalidad
    if (formData.modalidad === 'sin_variaciones') {
      baseData.data.documentos_iniciales_sv = {
        licencia_obra_sv: createDocumentInfo('Licencia de Obra', true),
        planos_aprobados_sv: createDocumentInfo('Planos Aprobados', true),
      };
      baseData.data.verificacion_sv = {
        verificacion_campo_sv: formData.verificacion_campo_sv,
      };
      
      // Solo agregar fecha de verificación si tiene valor (formato ISO)
      const fechaVerificacion = formatDateForBackend(formData.fecha_verificacion_sv);
      if (fechaVerificacion) {
        baseData.data.verificacion_sv.fecha_verificacion_sv = fechaVerificacion;
      }
    } else if (formData.modalidad === 'con_variaciones' || formData.modalidad === 'casco_habitable') {
      baseData.data.informacion_inicial_cv = {
        servicios_previos_fsr: formData.servicios_previos_fsr,
      };
      baseData.data.documentos_iniciales_cv = {
        licencia_obra_cv: createDocumentInfo('Licencia de Obra', !formData.servicios_previos_fsr),
        planos_aprobados_licencia_cv: createDocumentInfo('Planos Aprobados Licencia', !formData.servicios_previos_fsr),
        planos_digitales_cad_cv: createDocumentInfo('Planos Digitales CAD', false),
      };
      baseData.data.antecedentes_cv = {
        primer_expediente: formData.primer_expediente,
        descripcion_antecedentes: formData.descripcion_antecedentes,
        expedientes_anteriores: createDocumentInfo('Expedientes Anteriores', false),
      };
      baseData.data.documentos_expediente = {
        fue_conformidad: createDocumentInfo('FUE Conformidad', true),
        planos_conformidad: createDocumentInfo('Planos Conformidad', true),
        memoria_descriptiva: createDocumentInfo('Memoria Descriptiva', false),
        cuaderno_obra: createDocumentInfo('Cuaderno de Obra', false),
        protocolos: createDocumentInfo('Protocolos', false),
        declaraciones_juradas: createDocumentInfo('Declaraciones Juradas', false),
        sustentos_tecnicos: createDocumentInfo('Sustentos Técnicos', false),
      };
    }

    return baseData;
  };

  // Función para construir el request de actualización
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
      if (conformidadId) {
        const updateData = buildUpdateRequest();
        await update(conformidadId, updateData);
      }
      navigate('/dashboard/conformidades');
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
          <StepModalidad
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <StepAdministrado
            formData={formData}
            clients={clients || []}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ConformidadFormData, value)}
            title="Paso 2: Seleccionar Administrado"
            description="Seleccione el administrado para este trámite de conformidad de obra"
            showProjectName={true}
          />
        );
      case 2:
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
      case 3:
        return (
          <StepAntecedentes
            formData={formData}
            errors={errors}
            conformidadId={conformidadId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 4:
        return (
          <StepDocumentosExpediente
            formData={formData}
            errors={errors}
            conformidadId={conformidadId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 5:
        return (
          <StepVerificacion
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 6:
        return (
          <StepCargo
            formData={formData}
            projectId={conformidadId || 'new'}
            uploadedDocuments={uploadedDocuments}
            errors={errors}
            onInputChange={(field: string, value: any) => handleInputChange(field as keyof ConformidadFormData, value)}
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

  if (clientsLoading || (isEdit && conformidadLoading)) {
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
                  onClick={() => navigate('/dashboard/conformidades')}
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
                    onClick={() => navigate('/dashboard/conformidades')}
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

        {/* Resumen */}
        <div className="lg:col-span-1">
          <ResumenConformidad
            formData={formData}
            currentStep={currentStep}
            steps={steps}
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
