import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuInfo } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button } from '@/components/ui';
import { useGestionAnteproyecto } from '@/hooks/useGestionAnteproyectos';
import toast from 'react-hot-toast';
import { 
  StepSeleccionAnteproyecto,
  StepPresentacionMunicipal,
  StepSeguimientoRespuesta,
  StepEntregaFinal
} from './StepGestionAnteproyecto';
import { ResumenGestionAnteproyecto } from './components/ResumenGestionAnteproyecto';
import type { GestionAnteproyectoFormData, FormStep, UploadedDocument, DocumentInfo, RevisionData } from '@/types/gestionAnteproyecto.types';

const stepLabels = [
  'Selección Anteproyecto',
  'Presentación Municipal',
  'Seguimiento',
  'Entrega Final'
];

export default function CreateEditGestionAnteproyecto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { setHeader } = useHeaderStore();
  const { gestionAnteproyecto, isLoading: gestionLoading, createNew, update, uploadDocs, downloadDoc } = useGestionAnteproyecto(id);

  const [currentStep, setCurrentStep] = useState(0);
  const [gestionId, setGestionId] = useState<string | null>(id || null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  const [formData, setFormData] = useState<GestionAnteproyectoFormData>({
    client_id: '',
    nombre_proyecto: '',
    selectedAnteproyecto: null,
    fecha_ingreso: '',
    numero_expediente: '',
    fecha_respuesta: '',
    resultado_acta: null,
    // Nuevos campos para revisiones
    revisiones: [],
    revision_actual_index: 0,
    estado_seguimiento: 'en_proceso',
  });

  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Selección Anteproyecto', completed: false },
    { id: 2, title: 'Presentación Municipal', completed: false },
    { id: 3, title: 'Seguimiento', completed: false },
    { id: 4, title: 'Entrega Final', completed: false },
  ]);

  // Cargar datos cuando se edita
  useEffect(() => {
    if (gestionAnteproyecto && isEditing) {
      // Cargar revisiones del backend si existen
      const revisionesBackend = gestionAnteproyecto.data?.seguimiento_respuesta?.revisiones || [];
      
      setFormData(prev => ({
        ...prev,
        client_id: gestionAnteproyecto.client_id || '',
        nombre_proyecto: gestionAnteproyecto.data?.nombre_proyecto || '',
        selectedAnteproyecto: gestionAnteproyecto.data?.seleccion_anteproyecto?.selected_anteproyecto || null,
        fecha_ingreso: gestionAnteproyecto.data?.presentacion_municipal?.fecha_ingreso || '',
        numero_expediente: gestionAnteproyecto.data?.presentacion_municipal?.numero_expediente || '',
        // Campos legacy para compatibilidad
        fecha_respuesta: gestionAnteproyecto.data?.seguimiento_respuesta?.fecha_respuesta || '',
        resultado_acta: gestionAnteproyecto.data?.seguimiento_respuesta?.resultado_acta || null,
        fecha_presentacion_reconsideracion: gestionAnteproyecto.data?.seguimiento_respuesta?.fecha_presentacion_reconsideracion || '',
        // Nuevos campos de revisiones
        revisiones: revisionesBackend.map((rev: any) => ({
          id: rev.id,
          numero_revision: rev.numero_revision,
          fecha_creacion: rev.fecha_creacion,
          fecha_respuesta: rev.fecha_respuesta,
          resultado_acta: rev.resultado_acta,
          subsanacion_completada: rev.subsanacion_completada,
          estado: rev.estado,
          notificacion: rev.notificacion || { tiene_notificacion: false },
          reconsideracion: rev.reconsideracion || { habilitado: false, resultado: null },
          apelacion: rev.apelacion || { habilitado: false, resultado: null },
        })) as RevisionData[],
        revision_actual_index: gestionAnteproyecto.data?.seguimiento_respuesta?.revision_actual_index ?? (revisionesBackend.length > 0 ? revisionesBackend.length - 1 : 0),
        estado_seguimiento: gestionAnteproyecto.data?.seguimiento_respuesta?.estado_seguimiento || 'en_proceso',
      }));

      // Cargar documentos
      const allDocs: UploadedDocument[] = [];
      if (gestionAnteproyecto.uploaded_documents && gestionAnteproyecto.uploaded_documents.length > 0) {
        const docs = gestionAnteproyecto.uploaded_documents.map((doc: any) => ({
          id: doc.file_id || doc.id,
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
  }, [gestionAnteproyecto, isEditing]);

  useEffect(() => {
    setHeader(
      isEditing ? 'Editar Gestión de Anteproyecto' : 'Nueva Gestión de Anteproyecto',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEditing]);

  const handleInputChange = useCallback((field: keyof GestionAnteproyectoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setShowValidationError(false);
  }, [errors]);

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
                  ? { ...doc, id: uploadedFromBackend.file_id || uploadedFromBackend.id }
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
    
    // Formato DD/MM/YYYY (usado por DateInput)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      
      // Validar que día y mes sean válidos
      if (monthNum < 1 || monthNum > 12) {
        console.error('❌ Invalid month:', monthNum);
        return undefined;
      }
      if (dayNum < 1 || dayNum > 31) {
        console.error('❌ Invalid day:', dayNum);
        return undefined;
      }
      
      const result = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      console.log('✅ DD/MM/YYYY format detected:', result);
      return result;
    }
    
    // Formato D/M/YYYY o DD/M/YYYY o D/MM/YYYY (fechas con números sin ceros a la izquierda)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      const [part1, part2, year] = dateString.split('/');
      const num1 = parseInt(part1);
      const num2 = parseInt(part2);
      
      // Asumimos siempre formato DD/MM/YYYY (día/mes/año)
      // ya que es el formato estándar en español
      const day = num1;
      const month = num2;
      
      // Validar que día y mes sean válidos
      if (month < 1 || month > 12) {
        console.error('❌ Invalid month:', month);
        return undefined;
      }
      if (day < 1 || day > 31) {
        console.error('❌ Invalid day:', day);
        return undefined;
      }
      
      const result = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      console.log('✅ D/M/YYYY format detected:', result);
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
      case 0: // Paso 1: Selección Anteproyecto
        // Solo se envía el nombre del proyecto y anteproyecto seleccionado
        return {
          client_id: formData.client_id,
          data: {
            nombre_proyecto: formData.nombre_proyecto,
            seleccion_anteproyecto: {
              selected_anteproyecto: formData.selectedAnteproyecto ? {
                id: formData.selectedAnteproyecto.id,
                nombre: formData.selectedAnteproyecto.nombre,
                codigo: formData.selectedAnteproyecto.codigo
              } : null
            }
          }
        };

      case 1: // Paso 2: Presentación Municipal
        const presentacionData: any = {
          numero_expediente: formData.numero_expediente,
        };
        
        const fechaIngreso = formatDateForBackend(formData.fecha_ingreso || '');
        if (fechaIngreso) presentacionData.fecha_ingreso = fechaIngreso;

        return {
          data: {
            presentacion_municipal: presentacionData
          }
        };

      case 2: // Paso 3: Seguimiento y Respuesta
        const seguimientoData: any = {
          resultado_acta: formData.resultado_acta,
          estado_seguimiento: formData.estado_seguimiento,
          revision_actual_index: formData.revision_actual_index,
        };
        
        const fechaRespuesta = formatDateForBackend(formData.fecha_respuesta || '');
        if (fechaRespuesta) seguimientoData.fecha_respuesta = fechaRespuesta;

        const fechaReconsideracion = formatDateForBackend(formData.fecha_presentacion_reconsideracion || '');
        if (fechaReconsideracion) seguimientoData.fecha_presentacion_reconsideracion = fechaReconsideracion;

        // Agregar revisiones si existen
        if (formData.revisiones && formData.revisiones.length > 0) {
          seguimientoData.revisiones = formData.revisiones.map(rev => ({
            id: rev.id,
            numero_revision: rev.numero_revision,
            fecha_creacion: rev.fecha_creacion,
            fecha_respuesta: rev.fecha_respuesta,
            resultado_acta: rev.resultado_acta,
            subsanacion_completada: rev.subsanacion_completada,
            estado: rev.estado,
            notificacion: rev.notificacion ? {
              tiene_notificacion: rev.notificacion.tiene_notificacion,
              fecha_notificacion: rev.notificacion.fecha_notificacion,
              subsanacion_completada: rev.notificacion.subsanacion_completada,
            } : undefined,
            reconsideracion: rev.reconsideracion ? {
              habilitado: rev.reconsideracion.habilitado,
              fecha_presentacion: rev.reconsideracion.fecha_presentacion,
              resultado: rev.reconsideracion.resultado,
            } : undefined,
            apelacion: rev.apelacion ? {
              habilitado: rev.apelacion.habilitado,
              fecha_presentacion: rev.apelacion.fecha_presentacion,
              resultado: rev.apelacion.resultado,
            } : undefined,
          }));
        }

        return {
          data: {
            seguimiento_respuesta: seguimientoData
          }
        };

      case 3: // Paso 4: Entrega Final
        // Los documentos se manejan mediante handleFileUpload
        // No hay campos de texto adicionales en este paso
        return null;

      default:
        return null;
    }
  };

  // Construir request de creación completo
  const buildCreateRequest = (): any => {
    const baseData: any = {
      client_id: formData.client_id,
      data: {
        service_type: 'gestion_anteproyecto',
        nombre_proyecto: formData.nombre_proyecto,
        seleccion_anteproyecto: {
          selected_anteproyecto: formData.selectedAnteproyecto ? {
            id: formData.selectedAnteproyecto.id,
            nombre: formData.selectedAnteproyecto.nombre,
            codigo: formData.selectedAnteproyecto.codigo
          } : null,
          anteproyecto_externo_docs: {
            partida_registral: createDocumentInfo('Partida Registral SUNAR', true),
            certificado_parametro_municipal: createDocumentInfo('Certificado de Parámetro Municipal', true),
            plano_ubicacion: createDocumentInfo('Plano de Ubicación', true),
            plano_arquitectura: createDocumentInfo('Plano de Arquitectura', true),
            plano_seguridad: createDocumentInfo('Plano de Seguridad', true),
            memoria_descriptiva_arquitectura: createDocumentInfo('Memoria Descriptiva de Arquitectura', true),
            memoria_descriptiva_seguridad: createDocumentInfo('Memoria Descriptiva de Seguridad', true),
            formulario_unico_edificacion: createDocumentInfo('Formulario Único de Edificación (FUE)', true),
            presupuesto: createDocumentInfo('Presupuesto', true),
            pago_derecho_revision_cap: createDocumentInfo('Pago de Derecho a Revisión CAP', true),
            factura: createDocumentInfo('Factura del Pago', true),
            liquidacion: createDocumentInfo('Liquidación del Pago', true),
          }
        },
        presentacion_municipal: {
          numero_expediente: formData.numero_expediente,
          archivo_cargo: createDocumentInfo('Archivo del Cargo', true),
        },
        seguimiento_respuesta: {
          resultado_acta: formData.resultado_acta || 'conforme',
          estado_seguimiento: formData.estado_seguimiento || 'en_proceso',
          revision_actual_index: formData.revision_actual_index || 0,
          revisiones: formData.revisiones && formData.revisiones.length > 0 
            ? formData.revisiones.map(rev => ({
                id: rev.id,
                numero_revision: rev.numero_revision,
                fecha_creacion: rev.fecha_creacion,
                fecha_respuesta: rev.fecha_respuesta,
                resultado_acta: rev.resultado_acta,
                subsanacion_completada: rev.subsanacion_completada,
                estado: rev.estado,
                notificacion: rev.notificacion,
                reconsideracion: rev.reconsideracion,
                apelacion: rev.apelacion,
              }))
            : [],
          archivo_respuesta: createDocumentInfo('Archivo de Respuesta', true),
          documentos_subsanacion: createDocumentInfo('Documentos de Subsanación', false),
          documento_reconsideracion: createDocumentInfo('Documento de Reconsideración', false),
          resolucion_reconsideracion: createDocumentInfo('Resolución de Reconsideración', false),
        },
        entrega_final: {
          carta_conformidad: createDocumentInfo('Carta de Conformidad', true),
          acta_final: createDocumentInfo('Acta Final', true),
          fue_aprobado: createDocumentInfo('FUE Aprobado', true),
          planos_aprobados: createDocumentInfo('Planos Aprobados', true),
          otros_documentos: createDocumentInfo('Otros Documentos', false),
        },
      },
    };

    // Agregar fechas si existen
    const fechaIngreso = formatDateForBackend(formData.fecha_ingreso || '');
    if (fechaIngreso) baseData.data.presentacion_municipal.fecha_ingreso = fechaIngreso;

    const fechaRespuesta = formatDateForBackend(formData.fecha_respuesta || '');
    if (fechaRespuesta) baseData.data.seguimiento_respuesta.fecha_respuesta = fechaRespuesta;

    const fechaReconsideracion = formatDateForBackend(formData.fecha_presentacion_reconsideracion || '');
    if (fechaReconsideracion) baseData.data.seguimiento_respuesta.fecha_presentacion_reconsideracion = fechaReconsideracion;

    return baseData;
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Selección Anteproyecto
        if (!formData.client_id) newErrors.client_id = 'Debe seleccionar un administrado';
        if (!formData.nombre_proyecto) newErrors.nombre_proyecto = 'El nombre del proyecto es requerido';
        
        // Validar que se haya seleccionado un anteproyecto O se hayan cargado documentos externos
        const hasSelectedAnteproyecto = formData.selectedAnteproyecto && formData.selectedAnteproyecto.id;
        const hasExternalDocs = uploadedDocuments.some(doc => 
          doc.key?.startsWith('seleccion_anteproyecto.anteproyecto_externo_docs.')
        );
        
        if (!hasSelectedAnteproyecto && !hasExternalDocs) {
          newErrors.selectedAnteproyecto = 'Debe seleccionar un anteproyecto existente o cargar los documentos de un anteproyecto externo';
        }
        break;
      
      case 1: // Presentación Municipal
        if (!formData.fecha_ingreso) newErrors.fecha_ingreso = 'Fecha de ingreso es requerida';
        if (!formData.numero_expediente) newErrors.numero_expediente = 'Número de expediente es requerido';
        if (!uploadedDocuments.some(doc => doc.key === 'presentacion_municipal.archivo_cargo')) {
          newErrors.archivo_cargo = 'Archivo del cargo es requerido';
        }
        break;
      
      case 2: // Seguimiento
        if (!formData.fecha_respuesta) newErrors.fecha_respuesta = 'Fecha de respuesta es requerida';
        if (!uploadedDocuments.some(doc => doc.key === 'seguimiento_respuesta.archivo_respuesta')) {
          newErrors.archivo_respuesta = 'Archivo de respuesta es requerido';
        }
        if (!formData.resultado_acta) newErrors.resultado_acta = 'Debe seleccionar el resultado del acta';
        break;
      
      case 3: // Entrega Final
        if (!uploadedDocuments.some(doc => doc.key === 'entrega_final.carta_conformidad')) {
          newErrors.carta_conformidad = 'Carta de conformidad es requerida';
        }
        if (!uploadedDocuments.some(doc => doc.key === 'entrega_final.acta_final')) {
          newErrors.acta_final = 'Acta final es requerida';
        }
        if (!uploadedDocuments.some(doc => doc.key === 'entrega_final.fue_aprobado')) {
          newErrors.fue_aprobado = 'FUE aprobado es requerido';
        }
        if (!uploadedDocuments.some(doc => doc.key === 'entrega_final.planos_aprobados')) {
          newErrors.planos_aprobados = 'Planos aprobados son requeridos';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
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

    // Marcar paso como completado
    setSteps(prev => prev.map(step => 
      step.id === currentStep + 1 ? { ...step, completed: true } : step
    ));

    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    } else if (steps[stepIndex].completed || stepIndex === currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/gestion-anteproyectos');
  };

  const handleSaveGestion = async () => {
    setIsSaving(true);
    try {
      if (gestionId) {
        const updateData = buildCreateRequest();
        await update({ id: gestionId, data: updateData });
      }
      navigate('/dashboard/gestion-anteproyectos');
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Selección Anteproyecto
        return (
          <StepSeleccionAnteproyecto
            formData={formData}
            errors={errors}
            gestionId={gestionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );

      case 1: // Presentación Municipal
        return (
          <StepPresentacionMunicipal
            formData={formData}
            errors={errors}
            gestionId={gestionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );

      case 2: // Seguimiento
        return (
          <StepSeguimientoRespuesta
            formData={formData}
            errors={errors}
            gestionId={gestionId || 'new'}
            uploadedDocuments={uploadedDocuments}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onDownloadDocument={handleDownloadDocument}
          />
        );

      case 3: // Entrega Final
        return (
          <StepEntregaFinal
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

  const getStepTitle = (index: number): string => {
    return stepLabels[index] || '';
  };

  if (gestionLoading && isEditing) {
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
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : `Siguiente: ${getStepTitle(currentStep + 1)}`}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/dashboard/gestion-anteproyectos')}
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
          <ResumenGestionAnteproyecto
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            gestionId={gestionId || 'new'}
            onSave={handleSaveGestion}
            isSaving={isSaving}
            uploadedDocuments={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
