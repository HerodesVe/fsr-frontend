import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { Modal, Input, Select, Switch } from '@/components/ui';
import { createUser, updateUser, type CreateUserData, type UpdateUserData } from '@/services/user.service';
import type { UserOut } from '@/types/user.types';
import type { SelectOption } from '@/components/ui';

interface ModalUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserOut | null;
  mode: 'create' | 'edit';
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  first_name: Yup.string()
    .required('El nombre es requerido'),
  last_name: Yup.string()
    .required('El apellido es requerido'),
  dni: Yup.string()
    .required('El DNI es requerido'),
  worker_code: Yup.number()
    .required('El código de trabajador es requerido')
    .positive('Debe ser un número positivo'),
  role: Yup.string()
    .oneOf(['OPERATOR', 'ADMIN', 'SUPERVISOR'], 'Rol inválido')
    .required('El rol es requerido'),
});

const roleOptions: SelectOption[] = [
  { value: 'OPERATOR', label: 'Operador' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
];

export const ModalUser: React.FC<ModalUserProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
  mode
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: user?.email || '',
      password: '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      dni: user?.dni || '',
      worker_code: user?.worker_code || 1,
      role: user?.role || 'OPERATOR',
      is_active: user?.status === 'ACTIVE' || true,
    },
    validationSchema: mode === 'create' ? validationSchema : validationSchema.omit(['password']),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        if (mode === 'create') {
          const userData: CreateUserData = {
            email: values.email,
            password: values.password,
            first_name: values.first_name,
            last_name: values.last_name,
            dni: values.dni,
            worker_code: values.worker_code,
            role: values.role as 'OPERATOR' | 'ADMIN' | 'SUPERVISOR',
          };
          await createUser(userData);
        } else if (user) {
          const userData: UpdateUserData = {
            id: user.id,
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            dni: values.dni,
            worker_code: values.worker_code,
            role: values.role as 'OPERATOR' | 'ADMIN' | 'SUPERVISOR',
            ...(values.password && { password: values.password }),
          };
          await updateUser(userData);
        }
        
        // Mostrar toast de éxito
        toast.success(
          `Usuario ${mode === 'create' ? 'creado' : 'actualizado'} exitosamente`,
          {
            duration: 4000,
          }
        );
        
        onSuccess();
        onClose();
        formik.resetForm();
      } catch (error: any) {
        console.error('Error al guardar usuario:', error);
        
        // Mostrar toast de error
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.email || 
                           error.message || 
                           'Error al guardar el usuario';
        
        toast.error(errorMessage, {
          duration: 6000,
        });
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  // useEffect(() => {
  //   if (!isOpen) {
  //     formik.resetForm();
  //   }
  // }, [isOpen, formik]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Si no está abierto, no renderizar nada
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={() => formik.handleSubmit()}
            disabled={isLoading}
            style={{ backgroundColor: 'var(--primary-color)', fontFamily: 'Inter, sans-serif' }}
            className="px-6 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : (mode === 'create' ? 'Crear' : 'Guardar')}
          </button>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombres <span className="text-red-500">*</span>
            </label>
            <Input
              name="first_name"
              placeholder="Ingresa los nombres"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.first_name && formik.errors.first_name ? formik.errors.first_name : undefined}
              textOnly={true}
              maxLength={50}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <Input
              name="last_name"
              placeholder="Ingresa los apellidos"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.last_name && formik.errors.last_name ? formik.errors.last_name : undefined}
              textOnly={true}
              maxLength={50}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            name="email"
            type="email"
            placeholder="Ingresa el email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
            maxLength={100}
          />
        </div>

        {/* Password (solo para crear) */}
        {mode === 'create' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <Input
              name="password"
              type="password"
              placeholder="Ingresa la contraseña"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
              maxLength={50}
            />
          </div>
        )}

        {/* DNI y Código de Trabajador */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI <span className="text-red-500">*</span>
            </label>
            <Input
              name="dni"
              placeholder="Ingresa el DNI"
              value={formik.values.dni}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.dni && formik.errors.dni ? formik.errors.dni : undefined}
              numbersOnly={true}
              maxLength={8}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Trabajador <span className="text-red-500">*</span>
            </label>
            <Input
              name="worker_code"
              type="number"
              placeholder="Ingresa el código"
              value={String(formik.values.worker_code)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.worker_code && formik.errors.worker_code ? formik.errors.worker_code : undefined}
              numbersOnly={true}
              maxLength={10}
            />
          </div>
        </div>

        {/* Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rol <span className="text-red-500">*</span>
          </label>
          <Select
            name="role"
            placeholder="Selecciona un rol"
            options={roleOptions}
            selectedKeys={formik.values.role ? [formik.values.role] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              formik.setFieldValue('role', selectedKey);
            }}
            error={formik.touched.role && formik.errors.role ? formik.errors.role : undefined}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <Switch
            isSelected={formik.values.is_active}
            onValueChange={(value) => formik.setFieldValue('is_active', value)}
            label={formik.values.is_active ? 'Activo' : 'Inactivo'}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ModalUser;
