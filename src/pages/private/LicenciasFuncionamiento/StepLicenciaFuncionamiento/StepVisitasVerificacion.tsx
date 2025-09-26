import { useState } from 'react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { Button, Input, Select, Textarea } from '@/components/ui';
import type { LicenciaFuncionamientoFormData, VisitaVerificacion } from '@/types/licenciaFuncionamiento.types';

interface StepVisitasVerificacionProps {
  formData: LicenciaFuncionamientoFormData;
  onInputChange: (field: keyof LicenciaFuncionamientoFormData, value: any) => void;
}

export default function StepVisitasVerificacion({
  formData,
  onInputChange,
}: StepVisitasVerificacionProps) {
  const [nuevaVisita, setNuevaVisita] = useState<Partial<VisitaVerificacion>>({
    fecha: '',
    estado_local: 'Pendiente',
    observaciones: ''
  });

  const estadoLocalOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Observado', label: 'Observado' },
    { value: 'Conforme', label: 'Conforme' },
  ];

  const handleAgregarVisita = () => {
    if (!nuevaVisita.fecha) return;

    const visita: VisitaVerificacion = {
      id: Date.now().toString(),
      fecha: nuevaVisita.fecha!,
      estado_local: nuevaVisita.estado_local || 'Pendiente',
      observaciones: nuevaVisita.observaciones || ''
    };

    const visitasActualizadas = [...(formData.visitas || []), visita];
    onInputChange('visitas', visitasActualizadas);

    // Limpiar formulario
    setNuevaVisita({
      fecha: '',
      estado_local: 'Pendiente',
      observaciones: ''
    });
  };

  const handleEliminarVisita = (visitaId: string) => {
    const visitasActualizadas = formData.visitas?.filter(v => v.id !== visitaId) || [];
    onInputChange('visitas', visitasActualizadas);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Conforme':
        return 'text-green-600 bg-green-100';
      case 'Observado':
        return 'text-yellow-600 bg-yellow-100';
      case 'Pendiente':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 4: Visita(s) de Verificación y Asesoría
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre las visitas realizadas al local para verificar las condiciones de funcionamiento
        </p>
        
        <div className="space-y-6">
          {/* Formulario para nueva visita */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="font-semibold text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Registrar Nueva Visita
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Fecha de Visita"
                  type="date"
                  value={nuevaVisita.fecha || ''}
                  onChange={(e) => setNuevaVisita(prev => ({ ...prev, fecha: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Select
                  label="Estado del Local"
                  options={estadoLocalOptions}
                  selectedKeys={nuevaVisita.estado_local ? [nuevaVisita.estado_local] : []}
                  onSelectionChange={(keys) => {
                    const estado = Array.from(keys)[0] as string;
                    setNuevaVisita(prev => ({ ...prev, estado_local: estado }));
                  }}
                />
              </div>
              <div className="md:col-span-3">
                <Textarea
                  label="Observaciones de la Visita"
                  placeholder="Describir los hallazgos, puntos de mejora, etc."
                  value={nuevaVisita.observaciones || ''}
                  onChange={(e) => setNuevaVisita(prev => ({ ...prev, observaciones: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <div className="text-right mt-4">
              <Button
                onClick={handleAgregarVisita}
                disabled={!nuevaVisita.fecha}
                style={{ backgroundColor: 'var(--primary-color)' }}
                className="text-white hover:opacity-90 disabled:opacity-50"
                startContent={<LuPlus className="w-4 h-4" />}
              >
                Agregar Visita
              </Button>
            </div>
          </div>

          {/* Historial de visitas */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Historial de Visitas ({formData.visitas?.length || 0})
            </h4>
            <div className="space-y-3">
              {formData.visitas && formData.visitas.length > 0 ? (
                formData.visitas.map((visita, index) => (
                  <div key={visita.id} className="p-4 border rounded-lg flex justify-between items-start bg-white">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Visita {index + 1}
                        </p>
                        <span className="font-normal text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                          - {new Date(visita.fecha).toLocaleDateString('es-ES')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(visita.estado_local)}`}>
                          {visita.estado_local}
                        </span>
                      </div>
                      {visita.observaciones && (
                        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <span className="font-medium">Observación:</span> {visita.observaciones}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="bordered"
                      size="sm"
                      onClick={() => handleEliminarVisita(visita.id)}
                      startContent={<LuTrash2 className="w-4 h-4" />}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No hay visitas registradas aún
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
