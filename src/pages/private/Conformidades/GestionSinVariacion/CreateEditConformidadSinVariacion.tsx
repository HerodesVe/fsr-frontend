import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeaderStore } from '@/store/headerStore';

// Placeholder - Este componente se implementará completamente más adelante
export default function CreateEditConformidadSinVariacion() {
  const navigate = useNavigate();
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(
      'Nueva Conformidad Sin Variación',
      'Gestión de conformidad de obra sin variaciones'
    );
    
    return () => {
      setHeader('Dashboard');
    };
  }, [setHeader]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          En Desarrollo
        </h3>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          El módulo de Conformidad Sin Variación está en desarrollo.
          Por favor, utilice el módulo de Conformidad Con Variación por ahora.
        </p>
        <button
          onClick={() => navigate('/dashboard/servicios')}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Volver a Servicios
        </button>
      </div>
    </div>
  );
}
