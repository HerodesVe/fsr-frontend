import { NavLink } from 'react-router-dom';
import { LuLayoutDashboard, LuUsers, LuBriefcase, LuUserCheck, LuLogOut } from 'react-icons/lu';
import { useAuthStore } from '@/store/authStore';
import logo from '/assets/logo.svg';

const menuItems = [
  { href: '/dashboard/users', icon: LuUsers, label: 'Gestión de Usuarios' },
  { href: '/dashboard/administrados', icon: LuUserCheck, label: 'Gestión de Administrados' },
  { href: '/dashboard/services', icon: LuBriefcase, label: 'Servicios' },
];

export default function Sidebar() {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 bg-white flex-shrink-0 shadow-lg flex flex-col h-full">
      {/* Header con logo */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <img src={logo} alt="FSR Logo" className="h-12 w-auto" />
      </div>

      {/* Contenedor principal con navegación */}
      <div className="flex-1">
        <nav className="mt-4">
          <ul>
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 ${
                    isActive ? 'bg-gray-200 font-bold' : ''
                  }`
                }
              >
                <LuLayoutDashboard className="h-6 w-6" />
                <span className="ml-4">Dashboard</span>
              </NavLink>
            </li>
            {menuItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 ${
                      isActive ? 'bg-gray-200 font-bold' : ''
                    }`
                  }
                >
                  <item.icon className="h-6 w-6" />
                  <span className="ml-4">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Contenedor inferior con botón de cerrar sesión */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LuLogOut className="h-6 w-6" />
          <span className="ml-4">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}