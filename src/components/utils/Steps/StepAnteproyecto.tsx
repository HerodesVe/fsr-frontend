import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSearch, LuRefreshCw, LuPlus } from 'react-icons/lu';
import { Input, Button, Modal } from '@/components/ui';
import { useAnteproyectos } from '@/hooks/useAnteproyectos';
import type { ProyectoFormData, AnteproyectoImportado } from '@/types/proyecto.types';

interface StepAnteproyectoProps {
  formData: ProyectoFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof ProyectoFormData, value: any) => void;
}

export default function StepAnteproyecto({
  formData,
  errors,
  onInputChange,
}: StepAnteproyectoProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnteproyectoInModal, setSelectedAnteproyectoInModal] = useState<string>('');
  const [showImportedData, setShowImportedData] = useState(false);
  const { anteproyectos, isLoading, refetch } = useAnteproyectos();

  const calculateProgress = (stepsStatus: any) => {
    if (!stepsStatus) return 0;
    const steps = Object.values(stepsStatus);
    const completedSteps = steps.filter(step => step === 'Completada').length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  // Filtrar anteproyectos (mostrar todos los disponibles)
  const availableAnteproyectos = anteproyectos || [];

  // Filtrar por búsqueda
  const filteredAnteproyectos = availableAnteproyectos.filter(anteproyecto => {
    const searchLower = searchTerm.toLowerCase();
    return anteproyecto.data?.nombre_proyecto?.toLowerCase().includes(searchLower) ||
           anteproyecto.instance_code?.toLowerCase().includes(searchLower) ||
           anteproyecto.administrado?.toLowerCase().includes(searchLower);
  });

  const handleBuscarAnteproyecto = () => {
    setIsModalOpen(true);
    // Refrescar los datos cuando se abre el modal
    refetch();
  };

  const handleSelectAnteproyecto = () => {
    const selectedAnteproyecto = anteproyectos?.find(a => a.id === selectedAnteproyectoInModal);
    if (selectedAnteproyecto) {
      const anteproyectoImportado: AnteproyectoImportado = {
        id: selectedAnteproyecto.id,
        nombre_proyecto: selectedAnteproyecto.data?.nombre_proyecto || '',
        client_id: selectedAnteproyecto.client_id,
        administrado: selectedAnteproyecto.administrado || '',
        direccion: `${selectedAnteproyecto.data?.datos_predio?.ubicacion?.street || ''} ${selectedAnteproyecto.data?.datos_predio?.ubicacion?.number || ''}`.trim(),
        tipo_proyecto: selectedAnteproyecto.data?.datos_predio?.edificacion?.tipo_edificacion || '',
        descripcion: selectedAnteproyecto.data?.datos_predio?.edificacion?.descripcion_proyecto || '',
        documentos_disponibles: []
      };

      onInputChange('selectedAnteproyecto', anteproyectoImportado);
      onInputChange('anteproyecto_importado_id', selectedAnteproyecto.id);
      
      // Limpiar datos manuales si existían
      onInputChange('titulo_proyecto', '');
      onInputChange('tipo_proyecto', '');
      onInputChange('descripcion', '');
      onInputChange('selectedClient', null);
    }
    setIsModalOpen(false);
    setSelectedAnteproyectoInModal('');
  };

  const handleCrearAnteproyecto = () => {
    navigate('/dashboard/anteproyectos');
  };

  const handleImportarDatos = () => {
    // Lógica para importar todos los datos del anteproyecto
    if (formData.selectedAnteproyecto) {
      onInputChange('titulo_proyecto', formData.selectedAnteproyecto.nombre_proyecto);
      onInputChange('tipo_proyecto', formData.selectedAnteproyecto.tipo_proyecto);
      onInputChange('descripcion', formData.selectedAnteproyecto.descripcion);
      setShowImportedData(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Datos del Anteproyecto
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione un anteproyecto aprobado para importar sus datos o cree un nuevo anteproyecto
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Seleccionar Anteproyecto
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar Anteproyecto"
                value={formData.selectedAnteproyecto?.nombre_proyecto || ''}
                readOnly
                className="bg-gray-50"
                error={errors.selectedAnteproyecto}
              />
            </div>
            <Button
              variant="bordered"
              onClick={handleBuscarAnteproyecto}
              startContent={<LuSearch className="w-4 h-4" />}
            >
              Buscar
            </Button>
          </div>

          {!formData.selectedAnteproyecto && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-orange-600">⚠️</div>
                <div>
                  <p className="text-sm font-medium text-orange-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                    No hay anteproyecto seleccionado
                  </p>
                  <p className="text-sm text-orange-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Selecciona un anteproyecto existente para importar sus datos o crea un nuevo anteproyecto.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              onClick={handleCrearAnteproyecto}
              style={{ backgroundColor: 'var(--primary-color)' }}
              className="text-white hover:opacity-90"
              startContent={<LuPlus className="w-4 h-4" />}
            >
              Crear Anteproyecto
            </Button>
            
            {formData.selectedAnteproyecto && (
              <Button
                onClick={handleImportarDatos}
                style={{ backgroundColor: 'var(--primary-color)' }}
                className="text-white hover:opacity-90"
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Resumen del anteproyecto seleccionado */}
      {formData.selectedAnteproyecto && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Anteproyecto Seleccionado
            </h4>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Activo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Expediente:</p>
              <p className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.selectedAnteproyecto.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Cliente:</p>
              <p className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.selectedAnteproyecto.administrado}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Dirección:</p>
              <p className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.selectedAnteproyecto.direccion}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Tipo de proyecto:</p>
              <p className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formData.selectedAnteproyecto.tipo_proyecto}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos disponibles:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Partida Registral.pdf', 'Partida Registral.pdf', 'Partida Registral.pdf', '+5 más'].map((doc, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  📄 {doc}
                </span>
              ))}
            </div>
          </div>


          <Button
            onClick={handleImportarDatos}
            style={{ backgroundColor: 'var(--primary-color)' }}
            className="w-full text-white hover:opacity-90 mt-4"
            startContent={<LuRefreshCw className="w-4 h-4" />}
          >
            Importar datos del Anteproyecto
          </Button>
        </div>
      )}

      {/* Datos importados del anteproyecto */}
      {formData.selectedAnteproyecto && showImportedData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Datos importados del anteproyecto
            </h4>
          </div>

          {/* Campos de datos importados */}
          <div className="space-y-6">
            {/* Título y Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Título del Proyecto
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 relative">
                  <input
                    type="text"
                    value={formData.selectedAnteproyecto.nombre_proyecto}
                    readOnly
                    className="w-full bg-transparent text-gray-900 text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 text-xs font-medium">
                    Importado del anteproyecto
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cliente
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 relative">
                  <input
                    type="text"
                    value={formData.selectedAnteproyecto.administrado || 'No especificado'}
                    readOnly
                    className="w-full bg-transparent text-gray-900 text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 text-xs font-medium">
                    Importado del anteproyecto
                  </span>
                </div>
              </div>
            </div>

            {/* Dirección y Tipo de proyecto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Dirección
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 relative">
                  <input
                    type="text"
                    value={formData.selectedAnteproyecto.direccion || 'No especificada'}
                    readOnly
                    className="w-full bg-transparent text-gray-900 text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 text-xs font-medium">
                    Importado del anteproyecto
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Tipo de proyecto
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 relative">
                  <input
                    type="text"
                    value={formData.selectedAnteproyecto.tipo_proyecto || 'No especificado'}
                    readOnly
                    className="w-full bg-transparent text-gray-900 text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 text-xs font-medium">
                    Importado del anteproyecto
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Descripción del Proyecto
              </label>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 relative">
                <textarea
                  value={formData.selectedAnteproyecto.descripcion || 'No especificada'}
                  readOnly
                  rows={3}
                  className="w-full bg-transparent text-gray-900 text-sm resize-none"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <span className="absolute right-2 top-2 text-green-600 text-xs font-medium">
                  Importado del anteproyecto
                </span>
              </div>
            </div>

            {/* Documentos disponibles */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Documentos disponibles:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.selectedAnteproyecto.documentos_disponibles && formData.selectedAnteproyecto.documentos_disponibles.length > 0 ? (
                  formData.selectedAnteproyecto.documentos_disponibles.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Subido el {doc.emission_date || 'No especificado'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          Importado
                        </span>
                        <div className="text-green-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Si no hay documentos en el anteproyecto importado, mostrar los uploaded_documents
                  anteproyectos?.find(a => a.id === formData.selectedAnteproyecto?.id)?.uploaded_documents?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                            ID: {doc.file_id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          Importado
                        </span>
                        <div className="text-green-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de selección de anteproyecto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Seleccionar Anteproyecto"
        size="lg"
      >
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Busque y seleccione un anteproyecto existente para importar sus datos
          </p>

          <div className="mb-6">
            <Input
              placeholder="Ingrese un título descriptivo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<LuSearch className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Cargando anteproyectos...</p>
              </div>
            ) : filteredAnteproyectos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No se encontraron anteproyectos
                </p>
              </div>
            ) : (
              filteredAnteproyectos.map((anteproyecto) => (
                <div
                  key={anteproyecto.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAnteproyectoInModal === anteproyecto.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAnteproyectoInModal(anteproyecto.id)}
                >
                  {/* Header con título y badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-base mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {anteproyecto.data?.nombre_proyecto}
                      </h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Expediente: {anteproyecto.instance_code}
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Cliente: {anteproyecto.administrado || 'No especificado'}
                      </p>
                    </div>
                    <span className="bg-teal-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Activo
                    </span>
                  </div>

                  {/* Documentos disponibles */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Documentos disponibles:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {anteproyecto.uploaded_documents && anteproyecto.uploaded_documents.length > 0 ? (
                        <>
                          {anteproyecto.uploaded_documents.slice(0, 5).map((doc, index) => (
                            <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              <span>📄</span>
                              <span>{doc.name}</span>
                            </div>
                          ))}
                          {anteproyecto.uploaded_documents.length > 5 && (
                            <div className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              <span>+{anteproyecto.uploaded_documents.length - 5} más</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          <span>📄</span>
                          <span>Sin documentos</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-teal-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${calculateProgress(anteproyecto.steps_status)}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {calculateProgress(anteproyecto.steps_status)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="bordered"
              onClick={() => setIsModalOpen(false)}
            >
              Limpiar selección
            </Button>
            
            <Button
              onClick={handleSelectAnteproyecto}
              disabled={!selectedAnteproyectoInModal}
              style={{ backgroundColor: 'var(--primary-color)' }}
              className="text-white hover:opacity-90 disabled:opacity-50"
            >
              Seleccionar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

