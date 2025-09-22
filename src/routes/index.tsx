import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/layout/DashboardLayout';
import Login from '@/pages/Login';
import Users from '@/pages/private/Usuarios/Users';
import { Administrados, CreateEditAdministrado } from '@/pages/private/Administrados';
import Servicios from '@/pages/private/Servicios';
import Anteproyectos from '@/pages/private/Anteproyectos';
import CreateEditAnteproyecto from '@/pages/private/Anteproyectos/CreateEditAnteproyecto';
import Proyectos, { CreateEditProyecto } from '@/pages/private/Proyectos';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore();

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/users" replace />} />
        {/* Aquí irán las rutas hijas del dashboard */}
        <Route path="dashboard/users" element={<Users />} />
        <Route path="dashboard/administrados" element={<Administrados />} />
        <Route path="dashboard/administrados/create" element={<CreateEditAdministrado />} />
        <Route path="dashboard/administrados/edit/:id" element={<CreateEditAdministrado />} />
        <Route path="dashboard/services" element={<Servicios />} />
        <Route path="dashboard/anteproyectos" element={<Anteproyectos />} />
        <Route path="dashboard/anteproyectos/create" element={<CreateEditAnteproyecto />} />
        <Route path="dashboard/anteproyectos/edit/:id" element={<CreateEditAnteproyecto />} />
        <Route path="dashboard/proyectos" element={<Proyectos />} />
        <Route path="dashboard/proyectos/create" element={<CreateEditProyecto />} />
        <Route path="dashboard/proyectos/edit/:id" element={<CreateEditProyecto />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}