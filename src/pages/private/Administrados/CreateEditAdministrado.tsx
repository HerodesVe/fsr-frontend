import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LuArrowLeft } from 'react-icons/lu';
import toast from 'react-hot-toast';

import { useHeaderStore } from '@/store/headerStore';
import { Button, Input, Select } from '@/components/ui';
import type { SelectOption } from '@/components/ui';
import { createClient, updateClient, getClientById } from '@/services/clients.service';
import { useDepartments, useProvinces, useDistricts } from '@/hooks/useUbigeo';
import type { CreateClientRequest, UpdateClientRequest } from '@/types/client.types';
import type { Department, Province, District } from '@/services/ubigeo.service';

interface FormData {
  clientType: 'natural' | 'juridical';
  
  // Campos para persona natural
  docType: string;
  docNumber: string;
  maritalStatus: string;
  names: string;
  paternalSurname: string;
  maternalSurname: string;
  phone: string;
  email: string;
  
  // Campos del cónyuge (solo si está casado)
  spouseNames: string;
  spousePaternalSurname: string;
  spouseMaternalSurname: string;
  spouseDocType: string;
  spouseDocNumber: string;
  spousePhone: string;
  spouseEmail: string;
  
  // Campos para persona jurídica
  businessName: string;
  ruc: string;
  
  // Dirección
  departmentId: string;
  provinceId: string;
  districtId: string;
  urbanization: string;
  mz: string;
  lote: string;
  subLote: string;
  street: string;
  number: string;
  interior: string;
}

export default function CreateEditAdministrado() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { setHeader } = useHeaderStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    clientType: 'natural',
    
    // Campos para persona natural
    docType: 'DNI',
    docNumber: '',
    maritalStatus: 'SINGLE',
    names: '',
    paternalSurname: '',
    maternalSurname: '',
    phone: '',
    email: '',
    
    // Campos del cónyuge
    spouseNames: '',
    spousePaternalSurname: '',
    spouseMaternalSurname: '',
    spouseDocType: 'DNI',
    spouseDocNumber: '',
    spousePhone: '',
    spouseEmail: '',
    
    // Campos para persona jurídica
    businessName: '',
    ruc: '',
    
    // Dirección
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
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Queries para ubigeo
  const { data: departments = [] } = useDepartments();
  const { data: provinces = [] } = useProvinces(formData.departmentId);
  const { data: districts = [] } = useDistricts(formData.provinceId);

  // Query para obtener datos del cliente si estamos editando
  const { data: clientData } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id!),
    enabled: isEditing && !!id,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Administrado creado exitosamente', {
        duration: 4000,
      });
      navigate('/dashboard/administrados');
    },
    onError: (error: any) => {
      console.error('Error creating client:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al crear el administrado';
      toast.error(errorMessage, {
        duration: 6000,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Administrado actualizado exitosamente', {
        duration: 4000,
      });
      navigate('/dashboard/administrados');
    },
    onError: (error: any) => {
      console.error('Error updating client:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al actualizar el administrado';
      toast.error(errorMessage, {
        duration: 6000,
      });
    },
  });

  // Configurar el header
  useEffect(() => {
    setHeader(
      isEditing ? 'Editar Administrado' : 'Crear Administrado',
      'Gestiona todos tus trámites y servicios en un solo lugar'
    );

    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader, isEditing]);

  // Llenar el formulario si estamos editando
  useEffect(() => {
    if (clientData && isEditing) {
      setFormData({
        clientType: clientData.clientType as 'natural' | 'juridical',
        
        // Campos para persona natural
        docType: clientData.docType || 'DNI',
        docNumber: clientData.docNumber || '',
        maritalStatus: clientData.maritalStatus || 'SINGLE',
        names: clientData.names || '',
        paternalSurname: clientData.paternalSurname || '',
        maternalSurname: clientData.maternalSurname || '',
        phone: clientData.phone || '',
        email: clientData.email || '',
        
        // Campos del cónyuge
        spouseNames: clientData.spouse?.names || '',
        spousePaternalSurname: clientData.spouse?.paternalSurname || '',
        spouseMaternalSurname: clientData.spouse?.maternalSurname || '',
        spouseDocType: clientData.spouse?.docType || 'DNI',
        spouseDocNumber: clientData.spouse?.docNumber || '',
        spousePhone: clientData.spouse?.phone || '',
        spouseEmail: clientData.spouse?.email || '',
        
        // Campos para persona jurídica
        businessName: clientData.businessName || '',
        ruc: clientData.ruc || '',
        
        // Dirección
        departmentId: clientData.address.department.id,
        provinceId: clientData.address.province.id,
        districtId: clientData.address.district.id,
        urbanization: clientData.address.urbanization,
        mz: clientData.address.mz || '',
        lote: clientData.address.lote || '',
        subLote: clientData.address.subLote || '',
        street: clientData.address.street,
        number: clientData.address.number,
        interior: clientData.address.interior,
      });
    }
  }, [clientData, isEditing]);

  // Limpiar provincia y distrito cuando cambia el departamento
  useEffect(() => {
    if (formData.departmentId) {
      setFormData(prev => ({ ...prev, provinceId: '', districtId: '' }));
    }
  }, [formData.departmentId]);

  // Limpiar distrito cuando cambia la provincia
  useEffect(() => {
    if (formData.provinceId) {
      setFormData(prev => ({ ...prev, districtId: '' }));
    }
  }, [formData.provinceId]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): { isValid: boolean; errors: Partial<FormData> } => {
    const newErrors: Partial<FormData> = {};

    if (formData.clientType === 'natural') {
      // Validaciones para persona natural
      if (!formData.names.trim()) {
        newErrors.names = 'Los nombres son obligatorios';
      }
      if (!formData.paternalSurname.trim()) {
        newErrors.paternalSurname = 'El apellido paterno es obligatorio';
      }
      if (!formData.maternalSurname.trim()) {
        newErrors.maternalSurname = 'El apellido materno es obligatorio';
      }
      if (!formData.docNumber.trim()) {
        newErrors.docNumber = 'El número de documento es obligatorio';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'El email es obligatorio';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es obligatorio';
      }
      
      // Validaciones del cónyuge si está casado
      if (formData.maritalStatus === 'MARRIED') {
        if (!formData.spouseNames.trim()) {
          newErrors.spouseNames = 'Los nombres del cónyuge son obligatorios';
        }
        if (!formData.spousePaternalSurname.trim()) {
          newErrors.spousePaternalSurname = 'El apellido paterno del cónyuge es obligatorio';
        }
        if (!formData.spouseMaternalSurname.trim()) {
          newErrors.spouseMaternalSurname = 'El apellido materno del cónyuge es obligatorio';
        }
        if (!formData.spouseDocNumber.trim()) {
          newErrors.spouseDocNumber = 'El documento del cónyuge es obligatorio';
        }
      }
    } else {
      // Validaciones para persona jurídica
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'La razón social es obligatoria';
      }
      if (!formData.ruc.trim()) {
        newErrors.ruc = 'El número de RUC es obligatorio';
      }
    }

    // Validaciones comunes
    if (!formData.departmentId) {
      newErrors.departmentId = 'El departamento es obligatorio';
    }
    if (!formData.provinceId) {
      newErrors.provinceId = 'La provincia es obligatoria';
    }
    if (!formData.districtId) {
      newErrors.districtId = 'El distrito es obligatorio';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    
    if (!validation.isValid) {
      // Mostrar toast simple indicando que hay errores
      const errorCount = Object.keys(validation.errors).length;
      toast.error(
        `Por favor, completa todos los campos obligatorios. ${errorCount} ${errorCount === 1 ? 'campo tiene errores' : 'campos tienen errores'}.`,
        {
          duration: 5000,
        }
      );
      
      // Hacer scroll al primer campo con error
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    const baseData: Omit<CreateClientRequest, 'id'> = {
      clientType: formData.clientType,
      status: 'ACTIVE',
      address: {
        urbanization: formData.urbanization,
        mz: formData.mz || undefined,
        lote: formData.lote || undefined,
        subLote: formData.subLote || undefined,
        street: formData.street,
        number: formData.number,
        interior: formData.interior,
        departmentId: formData.departmentId,
        provinceId: formData.provinceId,
        districtId: formData.districtId,
      },
    };

    // Agregar campos específicos según el tipo de cliente
    if (formData.clientType === 'natural') {
      Object.assign(baseData, {
        docType: formData.docType,
        docNumber: formData.docNumber,
        maritalStatus: formData.maritalStatus,
        names: formData.names,
        paternalSurname: formData.paternalSurname,
        maternalSurname: formData.maternalSurname,
        phone: formData.phone,
        email: formData.email,
      });

      // Agregar datos del cónyuge si está casado
      if (formData.maritalStatus === 'MARRIED') {
        Object.assign(baseData, {
          spouse: {
            paternalSurname: formData.spousePaternalSurname,
            maternalSurname: formData.spouseMaternalSurname,
            names: formData.spouseNames,
            docType: formData.spouseDocType,
            docNumber: formData.spouseDocNumber,
            phone: formData.spousePhone,
            email: formData.spouseEmail,
          },
        });
      }
    } else {
      Object.assign(baseData, {
        ruc: formData.ruc,
        businessName: formData.businessName,
      });
    }

    if (isEditing && id) {
      const updateData: UpdateClientRequest = { id, ...baseData };
      updateMutation.mutate(updateData);
    } else {
      createMutation.mutate(baseData);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard/administrados');
  };

  // Opciones para los selects
  const docTypeOptions: SelectOption[] = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PASSPORT', label: 'Pasaporte' },
  ];

  const maritalStatusOptions: SelectOption[] = [
    { value: 'SINGLE', label: 'Soltero(a)' },
    { value: 'MARRIED', label: 'Casado(a)' },
    { value: 'DIVORCED', label: 'Divorciado(a)' },
    { value: 'WIDOWED', label: 'Viudo(a)' },
  ];

  const departmentOptions: SelectOption[] = departments.map((dept: Department) => ({
    value: dept.id,
    label: dept.name,
  }));

  const provinceOptions: SelectOption[] = provinces.map((prov: Province) => ({
    value: prov.id,
    label: prov.name,
  }));

  const districtOptions: SelectOption[] = districts.map((dist: District) => ({
    value: dist.id,
    label: dist.name,
  }));

  return (
    <div className="p-6">
      {/* Header con botón de volver */}
      <div className="mb-6">
        <Button
          onClick={handleGoBack}
          variant="bordered"
          className="flex items-center gap-2 mb-4"
        >
          <LuArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* Datos del Administrado */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-medium">
              👤
            </div>
            <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Datos del Administrado
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Información de la persona o empresa solicitante
          </p>

          {/* Radio buttons para tipo de persona */}
          <div className="mb-6">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="clientType"
                  value="natural"
                  checked={formData.clientType === 'natural'}
                  onChange={(e) => handleInputChange('clientType', e.target.value as 'natural' | 'juridical')}
                  className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Persona Natural
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="clientType"
                  value="juridical"
                  checked={formData.clientType === 'juridical'}
                  onChange={(e) => handleInputChange('clientType', e.target.value as 'natural' | 'juridical')}
                  className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Persona Jurídica
                </span>
              </label>
            </div>
          </div>

          {/* Campos para Persona Natural */}
          {formData.clientType === 'natural' && (
            <div className="space-y-6">
              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="names"
                    placeholder="Ingrese nombres"
                    value={formData.names}
                    onChange={(e) => handleInputChange('names', e.target.value)}
                    error={errors.names}
                    textOnly={true}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Apellido Paterno <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="paternalSurname"
                    placeholder="Ingrese apellido paterno"
                    value={formData.paternalSurname}
                    onChange={(e) => handleInputChange('paternalSurname', e.target.value)}
                    error={errors.paternalSurname}
                    textOnly={true}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Apellido Materno <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="maternalSurname"
                    placeholder="Ingrese apellido materno"
                    value={formData.maternalSurname}
                    onChange={(e) => handleInputChange('maternalSurname', e.target.value)}
                    error={errors.maternalSurname}
                    textOnly={true}
                  />
                </div>
              </div>

              {/* Documento y Estado Civil */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Tipo de Documento <span className="text-red-500">*</span>
                  </label>
                  <Select
                    placeholder="Seleccione tipo"
                    options={docTypeOptions}
                    selectedKeys={formData.docType ? [formData.docType] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handleInputChange('docType', value || 'DNI');
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Número de Documento <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="docNumber"
                    placeholder="Ingrese número"
                    value={formData.docNumber}
                    onChange={(e) => handleInputChange('docNumber', e.target.value)}
                    error={errors.docNumber}
                    numbersOnly={true}
                    maxLength={formData.docType === 'DNI' ? 8 : undefined}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Estado Civil <span className="text-red-500">*</span>
                  </label>
                  <Select
                    placeholder="Seleccione estado"
                    options={maritalStatusOptions}
                    selectedKeys={formData.maritalStatus ? [formData.maritalStatus] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handleInputChange('maritalStatus', value || 'SINGLE');
                    }}
                  />
                </div>
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="phone"
                    placeholder="Ingrese teléfono"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                    numbersOnly={true}
                    maxLength={9}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Ingrese email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                  />
                </div>
              </div>

              {/* Datos del Cónyuge - Solo si está casado */}
              {formData.maritalStatus === 'MARRIED' && (
                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Datos del Cónyuge
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Nombres <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="spouseNames"
                        placeholder="Nombres del cónyuge"
                        value={formData.spouseNames}
                        onChange={(e) => handleInputChange('spouseNames', e.target.value)}
                        error={errors.spouseNames}
                        textOnly={true}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Apellido Paterno <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="spousePaternalSurname"
                        placeholder="Apellido paterno"
                        value={formData.spousePaternalSurname}
                        onChange={(e) => handleInputChange('spousePaternalSurname', e.target.value)}
                        error={errors.spousePaternalSurname}
                        textOnly={true}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Apellido Materno <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="spouseMaternalSurname"
                        placeholder="Apellido materno"
                        value={formData.spouseMaternalSurname}
                        onChange={(e) => handleInputChange('spouseMaternalSurname', e.target.value)}
                        error={errors.spouseMaternalSurname}
                        textOnly={true}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Tipo de Documento <span className="text-red-500">*</span>
                      </label>
                      <Select
                        placeholder="Tipo"
                        options={docTypeOptions}
                        selectedKeys={formData.spouseDocType ? [formData.spouseDocType] : []}
                        onSelectionChange={(keys) => {
                          const value = Array.from(keys)[0] as string;
                          handleInputChange('spouseDocType', value || 'DNI');
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Número <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="spouseDocNumber"
                        placeholder="Número"
                        value={formData.spouseDocNumber}
                        onChange={(e) => handleInputChange('spouseDocNumber', e.target.value)}
                        error={errors.spouseDocNumber}
                        numbersOnly={true}
                        maxLength={formData.spouseDocType === 'DNI' ? 8 : undefined}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Teléfono
                      </label>
                      <Input
                        placeholder="Teléfono"
                        value={formData.spousePhone}
                        onChange={(e) => handleInputChange('spousePhone', e.target.value)}
                        numbersOnly={true}
                        maxLength={9}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.spouseEmail}
                        onChange={(e) => handleInputChange('spouseEmail', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Campos para Persona Jurídica */}
          {formData.clientType === 'juridical' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Razón Social o Denominación <span className="text-red-500">*</span>
                </label>
                <Input
                  name="businessName"
                  placeholder="Ingrese razón social"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  error={errors.businessName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Número de RUC <span className="text-red-500">*</span>
                </label>
                <Input
                  name="ruc"
                  placeholder="Ingrese RUC"
                  value={formData.ruc}
                  onChange={(e) => handleInputChange('ruc', e.target.value)}
                  error={errors.ruc}
                  numbersOnly={true}
                  maxLength={11}
                />
              </div>
            </div>
          )}
        </div>

        {/* Domicilio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Domicilio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Departamento <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Selecciona una opción"
                options={departmentOptions}
                selectedKeys={formData.departmentId ? [formData.departmentId] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange('departmentId', value || '');
                }}
                error={errors.departmentId}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Provincia <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Selecciona una opción"
                options={provinceOptions}
                selectedKeys={formData.provinceId ? [formData.provinceId] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange('provinceId', value || '');
                }}
                error={errors.provinceId}
                isDisabled={!formData.departmentId}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Distrito <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Selecciona una opción"
                options={districtOptions}
                selectedKeys={formData.districtId ? [formData.districtId] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange('districtId', value || '');
                }}
                error={errors.districtId}
                isDisabled={!formData.provinceId}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Urbanización / A.H. / Otro <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ingrese urbanización"
                value={formData.urbanization}
                onChange={(e) => handleInputChange('urbanization', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Mz <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Mz"
                  value={formData.mz}
                  onChange={(e) => handleInputChange('mz', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Lote <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Lote"
                  value={formData.lote}
                  onChange={(e) => handleInputChange('lote', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Sub Lote <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Sub Lote"
                  value={formData.subLote}
                  onChange={(e) => handleInputChange('subLote', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Av. / Jr. / Calle / Pasaje <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ingrese vía"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Número <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Número"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Interior <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Interior"
                value={formData.interior}
                onChange={(e) => handleInputChange('interior', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="bordered"
            onClick={handleGoBack}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            style={{ backgroundColor: 'var(--primary-color)' }}
            className="text-white hover:opacity-90"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Guardando...'
              : isEditing
              ? 'Actualizar'
              : 'Crear'}
          </Button>
        </div>
      </form>
    </div>
  );
}
