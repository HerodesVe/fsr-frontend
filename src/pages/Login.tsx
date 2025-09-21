import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useAuthStore } from '@/store/authStore';
import { login } from '@/services/auth.service';
import { Button, Input } from '@/components/ui';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
});

export default function Login() {
  const setSession = useAuthStore((state) => state.setSession);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const data = await login(values.email, values.password);

        setSession({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });
      } catch (error) {
        setFieldError('password', 'Credenciales incorrectas. Por favor, intente de nuevo.');
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Panel izquierdo con imagen */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src="/assets/login_image.svg" 
          alt="FSR Asesoría y Gestiones" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Panel derecho con formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inicio de sesión</h1>
            <p className="text-gray-600">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <Input
                id="email"
                name="email"
                placeholder="Ingresa tu usuario"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                />
                <span className="ml-2 text-gray-600">Recuérdame</span>
              </label>
              <a href="#" style={{ color: '#007C88' }} className="hover:opacity-80 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button 
              type="submit" 
              style={{ backgroundColor: '#007C88' }}
              className="w-full hover:opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-opacity duration-200"
              isLoading={formik.isSubmitting}
            >
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a href="#" style={{ color: '#007C88' }} className="hover:opacity-80 font-medium">
              Crear una cuenta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}