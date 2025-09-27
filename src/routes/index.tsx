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
import Demoliciones from '@/pages/private/Demoliciones';
import CreateEditDemolicion from '@/pages/private/Demoliciones/CreateEditDemolicion';
import { Conformidades, CreateEditConformidad } from '@/pages/private/Conformidades';
import { Modificaciones, CreateEditModificacion } from '@/pages/private/Modificaciones';
import { Regularizaciones, CreateEditRegularizacion } from '@/pages/private/Regularizaciones';
import { Ampliaciones, CreateEditAmpliacion } from '@/pages/private/Ampliaciones';
import { GestionAnexo, CreateEditGestionAnexo } from '@/pages/private/GestionAnexo';
import { HabilitacionesUrbanas, CreateEditHabilitacionUrbana } from '@/pages/private/HabilitacionesUrbanas';
import { LicenciasFuncionamiento, CreateEditLicenciaFuncionamiento } from '@/pages/private/LicenciasFuncionamiento';
import { RectificacionLinderos, CreateEditRectificacionLinderos } from '@/pages/private/RectificacionLinderos';
import { GestionAnteproyectos, CreateEditGestionAnteproyecto } from '@/pages/private/GestionAnteproyectos';
import { GestionProyectos, CreateEditGestionProyecto } from '@/pages/private/GestionProyectos';

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
        <Route index element={<Navigate to="/dashboard/services" replace />} />
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
        <Route path="dashboard/demoliciones" element={<Demoliciones />} />
        <Route path="dashboard/demoliciones/create" element={<CreateEditDemolicion />} />
        <Route path="dashboard/demoliciones/edit/:id" element={<CreateEditDemolicion />} />
        <Route path="dashboard/conformidades" element={<Conformidades />} />
        <Route path="dashboard/conformidades/create" element={<CreateEditConformidad />} />
        <Route path="dashboard/conformidades/edit/:id" element={<CreateEditConformidad />} />
        <Route path="dashboard/modificaciones" element={<Modificaciones />} />
        <Route path="dashboard/modificaciones/create" element={<CreateEditModificacion />} />
        <Route path="dashboard/modificaciones/edit/:id" element={<CreateEditModificacion />} />
        <Route path="dashboard/regularizaciones" element={<Regularizaciones />} />
        <Route path="dashboard/regularizaciones/create" element={<CreateEditRegularizacion />} />
        <Route path="dashboard/regularizaciones/edit/:id" element={<CreateEditRegularizacion />} />
        <Route path="dashboard/ampliaciones" element={<Ampliaciones />} />
        <Route path="dashboard/ampliaciones/create" element={<CreateEditAmpliacion />} />
        <Route path="dashboard/ampliaciones/edit/:id" element={<CreateEditAmpliacion />} />
        <Route path="dashboard/gestion-anexo" element={<GestionAnexo />} />
        <Route path="dashboard/gestion-anexo/create" element={<CreateEditGestionAnexo />} />
        <Route path="dashboard/gestion-anexo/edit/:id" element={<CreateEditGestionAnexo />} />
        <Route path="dashboard/habilitaciones-urbanas" element={<HabilitacionesUrbanas />} />
        <Route path="dashboard/habilitaciones-urbanas/create" element={<CreateEditHabilitacionUrbana />} />
        <Route path="dashboard/habilitaciones-urbanas/edit/:id" element={<CreateEditHabilitacionUrbana />} />
        <Route path="dashboard/licencias-funcionamiento" element={<LicenciasFuncionamiento />} />
        <Route path="dashboard/licencias-funcionamiento/create" element={<CreateEditLicenciaFuncionamiento />} />
        <Route path="dashboard/licencias-funcionamiento/edit/:id" element={<CreateEditLicenciaFuncionamiento />} />
        <Route path="dashboard/rectificacion-linderos" element={<RectificacionLinderos />} />
        <Route path="dashboard/rectificacion-linderos/create" element={<CreateEditRectificacionLinderos />} />
        <Route path="dashboard/rectificacion-linderos/edit/:id" element={<CreateEditRectificacionLinderos />} />
        <Route path="dashboard/gestion-anteproyectos" element={<GestionAnteproyectos />} />
        <Route path="dashboard/gestion-anteproyectos/create" element={<CreateEditGestionAnteproyecto />} />
        <Route path="dashboard/gestion-anteproyectos/edit/:id" element={<CreateEditGestionAnteproyecto />} />
        <Route path="dashboard/gestion-proyectos" element={<GestionProyectos />} />
        <Route path="dashboard/gestion-proyectos/create" element={<CreateEditGestionProyecto />} />
        <Route path="dashboard/gestion-proyectos/edit/:id" element={<CreateEditGestionProyecto />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}