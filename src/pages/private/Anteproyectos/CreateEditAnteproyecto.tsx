import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuX, LuTriangle } from 'react-icons/lu';
import { useHeaderStore } from '@/store/headerStore';
import { Button, Input, Select, FileUpload } from '@/components/ui';
import { useAnteproyectos, useAnteproyectoById } from '@/hooks/useAnteproyectos';
import { useClients } from '@/hooks/useClients';
import { useDepartments, useProvinces, useDistricts } from '@/hooks/useUbigeo';
import { ResumenExpediente } from './components/ResumenExpediente';
import type { AnteproyectoFormData, FormStep, StepStatus } from '@/types/anteproyecto.types';
import { DocumentStatus } from '@/types/anteproyecto.types';

export default function CreateEditAnteproyecto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { setHeader } = useHeaderStore();
  const { createInitialMutation, updateMutation, uploadSingleDocumentMutation } = useAnteproyectos();
  const { data: anteproyectoData, isLoading: isLoadingAnteproyecto } = useAnteproyectoById(id || '');
  const { clients } = useClients();

  const [currentStep, setCurrentStep] = useState(0);
  const [anteproyectoId, setAnteproyectoId] = useState<string>(id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState<Record<number, boolean>>({});

  const [formData, setFormData] = useState<AnteproyectoFormData>({
    selectedClient: null,
    tipo_licencia_edificacion: '',
    tipo_modalidad: '',
    link_normativas: '',
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
    descripcion_proyecto: '',
  });

  const { data: departments } = useDepartments();
  const { data: provinces } = useProvinces(formData.departmentId);
  const { data: districts } = useDistricts(formData.provinceId);

  const [steps, setSteps] = useState<FormStep[]>([
    { id: 1, title: 'Administrado', completed: false },
    { id: 2, title: 'Licencias/Normativas', completed: false },
    { id: 3, title: 'Predio', completed: false },
    { id: 4, title: 'Documentos', completed: false },
  ]);

  useEffect(() => {
    setHeader(
      isEditing ? 'Editar Anteproyecto' : 'Nuevo Anteproyecto',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEditing]);

  // Cargar datos para edición
  useEffect(() => {
    if (isEditing && anteproyectoData && !isLoadingAnteproyecto) {
      const data = anteproyectoData.data;
      
      setFormData({
        selectedClient: null, // Se cargará cuando tengamos los clients
        tipo_licencia_edificacion: data.licencias_normativas?.tipo_licencia_edificacion || '',
        tipo_modalidad: data.licencias_normativas?.tipo_modalidad || '',
        link_normativas: data.licencias_normativas?.link_normativas || '',
        departmentId: data.datos_predio?.ubicacion?.departmentId || '',
        provinceId: data.datos_predio?.ubicacion?.provinceId || '',
        districtId: data.datos_predio?.ubicacion?.districtId || '',
        urbanization: data.datos_predio?.ubicacion?.urbanization || '',
        mz: data.datos_predio?.ubicacion?.mz || '',
        lote: data.datos_predio?.ubicacion?.lote || '',
        subLote: data.datos_predio?.ubicacion?.subLote || '',
        street: data.datos_predio?.ubicacion?.street || '',
        number: data.datos_predio?.ubicacion?.number || '',
        interior: data.datos_predio?.ubicacion?.interior || '',
        latitud: data.datos_predio?.latitud || 0,
        longitud: data.datos_predio?.longitud || 0,
        area_total_m2: data.datos_predio?.medidas_perimetricas?.area_total_m2 || 0,
        frente: data.datos_predio?.medidas_perimetricas?.frente || 0,
        derecha: data.datos_predio?.medidas_perimetricas?.derecha || 0,
        izquierda: data.datos_predio?.medidas_perimetricas?.izquierda || 0,
        fondo: data.datos_predio?.medidas_perimetricas?.fondo || 0,
        tipo_edificacion: data.datos_predio?.edificacion?.tipo_edificacion || '',
        numero_pisos: data.datos_predio?.edificacion?.numero_pisos || 0,
        descripcion_proyecto: data.datos_predio?.edificacion?.descripcion_proyecto || '',
      });

      // Buscar cliente correspondiente
      if (clients && anteproyectoData.client_id) {
        const client = clients.find(c => c.id === anteproyectoData.client_id);
        if (client) {
          setFormData(prev => ({ ...prev, selectedClient: client }));
        }
      }

      // Si existe steps_status, usar esa información para determinar el paso actual y estados
      if (anteproyectoData.steps_status) {
        const completedSteps = determineCompletedSteps(anteproyectoData.steps_status);
        const currentStepIndex = determineCurrentStep(anteproyectoData.steps_status);
        
        setSteps(completedSteps);
        setCurrentStep(currentStepIndex);
      } else {
        // Fallback: marcar todos como completados si no hay steps_status
        setSteps(prev => prev.map(step => ({ ...step, completed: true })));
        setCurrentStep(3); // Ir al último paso por defecto
      }
    }
  }, [isEditing, anteproyectoData, isLoadingAnteproyecto, clients]);

  const handleInputChange = (field: keyof AnteproyectoFormData, value: any) => {
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
      case 0: // Datos del Administrado
        if (!formData.selectedClient) newErrors.selectedClient = 'Debe seleccionar un administrado';
        break;
      
      case 1: // Datos de Licencia
        if (!formData.tipo_licencia_edificacion) newErrors.tipo_licencia_edificacion = 'Tipo de licencia es requerido';
        if (!formData.tipo_modalidad) newErrors.tipo_modalidad = 'Tipo de modalidad es requerido';
        break;
      
      case 2: // Predio
        if (!formData.departmentId) newErrors.departmentId = 'Departamento es requerido';
        if (!formData.provinceId) newErrors.provinceId = 'Provincia es requerida';
        if (!formData.districtId) newErrors.districtId = 'Distrito es requerido';
        if (!formData.street) newErrors.street = 'Calle es requerida';
        if (!formData.area_total_m2) newErrors.area_total_m2 = 'Área total es requerida';
        if (!formData.tipo_edificacion) newErrors.tipo_edificacion = 'Tipo de edificación es requerido';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    try {
      // Paso 1: Crear anteproyecto solo con datos del administrado (o actualizar si está editando)
      if (currentStep === 0 && !isEditing && formData.selectedClient) {
        const createData = {
          client_id: formData.selectedClient.id,
          data: {
            service_type: 'anteproyecto',
            nombre_proyecto: `Proyecto ${formData.selectedClient.businessName || 
              `${formData.selectedClient.names} ${formData.selectedClient.paternalSurname}`.trim()}`,
          },
        };

        const result = await createInitialMutation.mutateAsync(createData);
        setAnteproyectoId(result.id);
      }
      // Paso 1: Si está editando y hay cambios en el administrado (cambio de cliente)
      else if (currentStep === 0 && isEditing && anteproyectoId && hasChanges[currentStep]) {
        // En este caso podríamos actualizar el client_id, pero generalmente no se permite cambiar el cliente
        // Por ahora solo avanzamos sin hacer PATCH
        console.log('Cambios en administrado durante edición - no se actualiza el cliente');
      }
      
      // Paso 2: Actualizar solo datos de licencia (solo si hay cambios)
      else if (currentStep === 1 && anteproyectoId && hasChanges[currentStep]) {
        const updateData = {
          id: anteproyectoId,
          client_id: formData.selectedClient?.id || '',
          data: {
            licencias_normativas: {
              tipo_licencia_edificacion: formData.tipo_licencia_edificacion,
              tipo_modalidad: formData.tipo_modalidad,
              link_normativas: formData.link_normativas,
              archivo_normativo: {
                name: formData.archivo_normativo?.name || '',
                is_mandatory: true,
                status: DocumentStatus.PENDIENTE,
                file_reference: '',
                emission_date: new Date().toISOString().split('T')[0],
                observation: '',
              },
            },
          },
        };

        await updateMutation.mutateAsync(updateData);
      }
      
      // Paso 3: Actualizar solo datos del predio (solo si hay cambios)
      else if (currentStep === 2 && anteproyectoId && hasChanges[currentStep]) {
        const updateData = {
          id: anteproyectoId,
          client_id: formData.selectedClient?.id || '',
          data: {
            datos_predio: {
              ubicacion: {
                urbanization: formData.urbanization,
                mz: formData.mz,
                lote: formData.lote,
                subLote: formData.subLote,
                street: formData.street,
                number: formData.number,
                interior: formData.interior,
                departmentId: formData.departmentId,
                provinceId: formData.provinceId,
                districtId: formData.districtId,
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
                descripcion_proyecto: formData.descripcion_proyecto,
              },
            },
          },
        };

        await updateMutation.mutateAsync(updateData);
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
    if (!anteproyectoId) {
      throw new Error('No hay anteproyecto ID disponible');
    }
    
    return uploadSingleDocumentMutation.mutateAsync({
      id: anteproyectoId,
      file,
      documentKey
    });
  };

  // Función para determinar el paso actual basado en el estado de los pasos
  const determineCurrentStep = (stepStatus: StepStatus): number => {
    const stepMapping = {
      'datos_administrado': 0,
      'licencias_normativas': 1,
      'datos_predio': 2,
      'documentos': 3
    };

    // Encontrar el primer paso pendiente
    for (const [stepKey, stepIndex] of Object.entries(stepMapping)) {
      if (stepStatus[stepKey as keyof StepStatus] === 'Pendiente') {
        return stepIndex;
      }
    }
    
    // Si todos están completados, ir al último paso
    return 3;
  };

  // Función para determinar qué pasos están completados
  const determineCompletedSteps = (stepStatus: StepStatus): FormStep[] => {
    const baseSteps = [
      { id: 1, title: 'Administrado', completed: false },
      { id: 2, title: 'Licencias/Normativas', completed: false },
      { id: 3, title: 'Predio', completed: false },
      { id: 4, title: 'Documentos', completed: false },
    ];

    return baseSteps.map((step, index) => {
      const stepKeys = ['datos_administrado', 'licencias_normativas', 'datos_predio', 'documentos'];
      const stepKey = stepKeys[index] as keyof StepStatus;
      
      return {
        ...step,
        completed: stepStatus[stepKey] === 'Completada'
      };
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/anteproyectos');
  };

  const handleSaveExpediente = () => {
    // Lógica para guardar el expediente completo
    console.log('Guardando expediente...');
  };

  // Opciones para selects
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: client.clientType === 'natural' 
      ? `${client.names} ${client.paternalSurname} ${client.maternalSurname}`.trim()
      : client.businessName || '',
  })) || [];

  const departmentOptions = departments?.map(dept => ({
    value: dept.id,
    label: dept.name,
  })) || [];

  const provinceOptions = provinces?.map(prov => ({
    value: prov.id,
    label: prov.name,
  })) || [];

  const districtOptions = districts?.map(dist => ({
    value: dist.id,
    label: dist.name,
  })) || [];

  const modalidadOptions = [
    { value: 'A', label: 'Modalidad A' },
    { value: 'B', label: 'Modalidad B' },
    { value: 'C', label: 'Modalidad C' },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Datos del Administrado
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Seleccionar Administrado
              </h3>
              <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Seleccione el administrado para este anteproyecto
              </p>
              
              <div>
                <Select
                  label="Administrado"
                  placeholder="Seleccione un administrado"
                  options={clientOptions}
                  selectedKeys={formData.selectedClient ? [formData.selectedClient.id] : []}
                  onSelectionChange={(keys) => {
                    const clientId = Array.from(keys)[0] as string;
                    const client = clients?.find(c => c.id === clientId);
                    handleInputChange('selectedClient', client || null);
                  }}
                  error={errors.selectedClient}
                />
              </div>

              {formData.selectedClient && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Información del Administrado
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Tipo:</strong> {formData.selectedClient.clientType === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}</p>
                    <p><strong>Documento:</strong> {
                      formData.selectedClient.clientType === 'natural' 
                        ? `${formData.selectedClient.docType}: ${formData.selectedClient.docNumber}`
                        : `RUC: ${formData.selectedClient.ruc}`
                    }</p>
                    {formData.selectedClient.email && <p><strong>Email:</strong> {formData.selectedClient.email}</p>}
                    {formData.selectedClient.phone && <p><strong>Teléfono:</strong> {formData.selectedClient.phone}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 1: // Licencia
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Tipo de Licencia
              </h3>
              <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Seleccione un anteproyecto aprobado para importar sus datos e ingresar la información manualmente
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Tipo de Licencia de Edificación"
                    placeholder="Ingrese tipo de licencia de edificación"
                    value={formData.tipo_licencia_edificacion}
                    onChange={(e) => handleInputChange('tipo_licencia_edificacion', e.target.value)}
                    error={errors.tipo_licencia_edificacion}
                  />
                </div>

                <div>
                  <Select
                    label="Tipo de Modalidad"
                    placeholder="Seleccionar opción"
                    options={modalidadOptions}
                    selectedKeys={formData.tipo_modalidad ? [formData.tipo_modalidad] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handleInputChange('tipo_modalidad', value || '');
                    }}
                    error={errors.tipo_modalidad}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Normativas
              </h3>
              <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Adjunta los documentos necesarios para las normativas del proyecto
              </p>
              
              <div className="space-y-6">
                <div>
                  <Input
                    label="Link"
                    placeholder="Pegar el link"
                    value={formData.link_normativas}
                    onChange={(e) => handleInputChange('link_normativas', e.target.value)}
                  />
                </div>

                <FileUpload
                  label="Normativa"
                  placeholder="Seleccione archivo"
                  value={formData.archivo_normativo ? [formData.archivo_normativo] : []}
                  onChange={(files) => handleInputChange('archivo_normativo', files[0])}
                  accept=".pdf,.doc,.docx"
                  required
                  onUpload={handleFileUpload}
                  documentKey="archivo_normativo"
                  anteproyectoId={anteproyectoId}
                  uploadedFiles={anteproyectoData?.uploaded_documents || []}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Predio
        return (
          <div className="space-y-6">
            {/* Sección 1: Datos del Predio */}
            <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>📍</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-teal-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Datos del Predio
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Información sobre la ubicación del terreno
                  </p>
                </div>
              </div>

              {/* Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Select
                    label="Departamento"
                    placeholder="Lima"
                    options={departmentOptions}
                    selectedKeys={formData.departmentId ? [formData.departmentId] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handleInputChange('departmentId', value || '');
                      handleInputChange('provinceId', '');
                      handleInputChange('districtId', '');
                    }}
                    error={errors.departmentId}
                  />
                </div>

                <div>
                  <Select
                    label="Provincia"
                    placeholder="Lima"
                    options={provinceOptions}
                    selectedKeys={formData.provinceId ? [formData.provinceId] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handleInputChange('provinceId', value || '');
                      handleInputChange('districtId', '');
                    }}
                    error={errors.provinceId}
                    disabled={!formData.departmentId}
                  />
                </div>

                <div>
                  <Select
                    label="Distrito"
                    placeholder="Miraflores"
                    options={districtOptions}
                    selectedKeys={formData.districtId ? [formData.districtId] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handleInputChange('districtId', value || '');
                    }}
                    error={errors.districtId}
                    disabled={!formData.provinceId}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
       
                  <Input
                    placeholder="Ingrese urbanización"
                    value={formData.urbanization}
                    onChange={(e) => handleInputChange('urbanization', e.target.value)}
                    label='Urbanización / A.H. / Otro'
                  />
            
                  <Input
                    label="Mz"
                    placeholder="Mz"
                    value={formData.mz}
                    onChange={(e) => handleInputChange('mz', e.target.value)}
                  />
              
                  <Input
                    label="Lote"
                    placeholder="Lote"
                    value={formData.lote}
                    onChange={(e) => handleInputChange('lote', e.target.value)}
                  />
      
                  <Input
                    label="Sub Lote"
                    placeholder="Sub Lote"
                    value={formData.subLote}
                    onChange={(e) => handleInputChange('subLote', e.target.value)}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Input
                    label="Av. / Jr. / Calle / Pasaje"
                    placeholder="Ingrese vía"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    error={errors.street}
                  />
                </div>

                <div>
                  <Input
                    label="Número"
                    placeholder="Número"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Interior"
                    placeholder="Interior"
                    value={formData.interior}
                    onChange={(e) => handleInputChange('interior', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="Latitud"
                    placeholder="Número"
                    value={formData.latitud.toString()}
                    onChange={(e) => handleInputChange('latitud', parseFloat(e.target.value) || 0)}
                    numbersOnly
                  />
                </div>

                <div>
                  <Input
                    label="Longitud"
                    placeholder="Interior"
                    value={formData.longitud.toString()}
                    onChange={(e) => handleInputChange('longitud', parseFloat(e.target.value) || 0)}
                    numbersOnly
                  />
                </div>

                <div>
                  <Input
                    label="Código postal"
                    placeholder="Interior"
                    value=""
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Área y Medidas Perimétricas */}
            <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>📐</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-teal-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Área y Medidas Perimétricas
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Información sobre las dimensiones del terreno
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <Input
                  label="Área Total (m²)"
                  placeholder="Ingrese área total"
                  value={formData.area_total_m2.toString()}
                  onChange={(e) => handleInputChange('area_total_m2', parseFloat(e.target.value) || 0)}
                  error={errors.area_total_m2}
                  numbersOnly
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Input
                    label="Por el frente (m)"
                    placeholder="Ingrese área local"
                    value={formData.frente.toString()}
                    onChange={(e) => handleInputChange('frente', parseFloat(e.target.value) || 0)}
                    numbersOnly
                  />
                </div>

                <div>
                  <Input
                    label="Por la derecha (m)"
                    placeholder="Ingrese área local"
                    value={formData.derecha.toString()}
                    onChange={(e) => handleInputChange('derecha', parseFloat(e.target.value) || 0)}
                    numbersOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Input
                    label="Por la izquierda (m)"
                    placeholder="Ingrese área local"
                    value={formData.izquierda.toString()}
                    onChange={(e) => handleInputChange('izquierda', parseFloat(e.target.value) || 0)}
                    numbersOnly
                  />
                </div>

                <div>
                  <Input
                    label="Por el fondo (m)"
                    placeholder="Ingrese área local"
                    value={formData.fondo.toString()}
                    onChange={(e) => handleInputChange('fondo', parseFloat(e.target.value) || 0)}
                    numbersOnly
                  />
                </div>
              </div>

              {/* Edificación */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Edificación
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Input
                      label="Tipo de Edificación"
                      placeholder="Ej: Vivienda multifamiliar, Oficinas, Local comercial"
                      value={formData.tipo_edificacion}
                      onChange={(e) => handleInputChange('tipo_edificacion', e.target.value)}
                      error={errors.tipo_edificacion}
                    />
                  </div>

                  <div>
                    <Input
                      label="Número de Pisos"
                      placeholder="Ingrese número de pisos"
                      value={formData.numero_pisos.toString()}
                      onChange={(e) => handleInputChange('numero_pisos', parseInt(e.target.value) || 0)}
                      numbersOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Descripción del Proyecto
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                    rows={4}
                    placeholder="Describe brevemente el proyecto"
                    value={formData.descripcion_proyecto}
                    onChange={(e) => handleInputChange('descripcion_proyecto', e.target.value)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Documentos
        return (
          <div className="space-y-8">
            {/* Documentos Administrado */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Documentos Administrado
              </h3>
              <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Adjunta los documentos necesarios para el expediente de anteproyecto
              </p>
              
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Partida Registral (SUNARP) <span className="text-red-500">*</span>
                      </h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.partida_registral || []}
                    onChange={(files) => handleInputChange('partida_registral', files)}
                    accept=".pdf"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="partida_registral"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Plano de Arquitectura <span className="text-red-500">*</span>
                      </h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.plano_arquitectura_adm || []}
                    onChange={(files) => handleInputChange('plano_arquitectura_adm', files)}
                    accept=".pdf,.dwg"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="plano_arquitectura_adm"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Pago derecho de revisión (CAP) - Factura
                      </h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.pago_derecho_revision_factura || []}
                    onChange={(files) => handleInputChange('pago_derecho_revision_factura', files)}
                    accept=".pdf"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="pago_derecho_revision_factura"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>
              </div>
            </div>

            {/* Documentos FSR */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Documentos FSR
              </h3>
              <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Adjunta los documentos necesarios para el expediente de anteproyecto
              </p>
              
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Memoria descriptiva de arquitectura <span className="text-red-500">*</span>
                      </h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.memoria_descriptiva_arquitectura || []}
                    onChange={(files) => handleInputChange('memoria_descriptiva_arquitectura', files)}
                    accept=".pdf,.doc,.docx"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="memoria_descriptiva_arquitectura"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Memoria descriptiva de seguridad <span className="text-red-500">*</span>
                      </h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.memoria_descriptiva_seguridad || []}
                    onChange={(files) => handleInputChange('memoria_descriptiva_seguridad', files)}
                    accept=".pdf,.doc,.docx"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="memoria_descriptiva_seguridad"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        FUE (Formulario Único de Edificación) <span className="text-red-500">*</span>
                      </h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.formulario_unico_edificacion || []}
                    onChange={(files) => handleInputChange('formulario_unico_edificacion', files)}
                    accept=".pdf"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="formulario_unico_edificacion"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Presupuesto
                      </h4>
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.presupuesto || []}
                    onChange={(files) => handleInputChange('presupuesto', files)}
                    accept=".pdf,.xlsx,.xls"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="presupuesto"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Plano de Seguridad <span className="text-red-500">*</span>
                      </h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.plano_seguridad || []}
                    onChange={(files) => handleInputChange('plano_seguridad', files)}
                    accept=".pdf,.dwg"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="plano_seguridad"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Pago derecho de revisión (CAP) - Liquidación
                      </h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.pago_derecho_revision_liquidacion || []}
                    onChange={(files) => handleInputChange('pago_derecho_revision_liquidacion', files)}
                    accept=".pdf"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="pago_derecho_revision_liquidacion"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Plano de Arquitectura <span className="text-red-500">*</span>
                      </h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={[]}
                    onChange={() => {}}
                    accept=".pdf,.dwg"
                    multiple
                    onUpload={handleFileUpload}
                    documentKey="plano_arquitectura_fsr"
                    anteproyectoId={anteproyectoId}
                    uploadedFiles={anteproyectoData?.uploaded_documents || []}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoadingAnteproyecto) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Cargando anteproyecto...</p>
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
                  Anterior: {currentStep === 1 ? 'Administrado' : currentStep === 2 ? 'Licencia' : 'Predio'}
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
                   `Siguiente: ${currentStep === 0 ? 'Licencia' : currentStep === 1 ? 'Predio' : 'Documentos'}`}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/dashboard/anteproyectos')}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className="text-white hover:opacity-90"
                >
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Resumen del expediente */}
        <div className="w-80 flex-shrink-0">
          <ResumenExpediente
            formData={formData}
            currentStep={currentStep}
            steps={steps}
            expedienteId={anteproyectoId}
            onSave={handleSaveExpediente}
            isSaving={false}
            uploadedDocuments={anteproyectoData?.uploaded_documents || []}
          />
        </div>
      </div>
    </div>
  );
}
