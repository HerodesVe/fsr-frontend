import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import type { LicenciaFuncionamientoFormData } from '@/types/licenciaFuncionamiento.types';

interface StepConsultaInicialProps {
  formData: LicenciaFuncionamientoFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof LicenciaFuncionamientoFormData, value: any) => void;
}

export default function StepConsultaInicial({
  formData,
  errors,
  onInputChange,
}: StepConsultaInicialProps) {
  const [verificando, setVerificando] = useState(false);

  const handleVerificarCompatibilidad = async () => {
    if (!formData.direccion_local || !formData.giro_negocio) {
      return;
    }

    setVerificando(true);
    
    // Simular verificación de compatibilidad
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulación de respuesta
    onInputChange('zonificacion', 'RDM (Residencial Densidad Media)');
    onInputChange('compatibilidad_uso', 'Apto para Actividades Profesionales');
    onInputChange('compatibilidad_verificada', true);
    
    setVerificando(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2: Consulta Inicial y Verificación de Compatibilidad
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Ingrese la información básica del local comercial para verificar la compatibilidad de uso
        </p>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Dirección del Local"
                placeholder="Ej: Av. Principal 123, Miraflores"
                value={formData.direccion_local}
                onChange={(e) => onInputChange('direccion_local', e.target.value)}
                error={errors.direccion_local}
                required
              />
            </div>
            <div>
              <Input
                label="Giro del Negocio"
                placeholder="Ej: Consultorio médico dermatológico"
                value={formData.giro_negocio}
                onChange={(e) => onInputChange('giro_negocio', e.target.value)}
                error={errors.giro_negocio}
                required
              />
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleVerificarCompatibilidad}
              disabled={!formData.direccion_local || !formData.giro_negocio || verificando}
              style={{ backgroundColor: 'var(--primary-color)' }}
              className="text-white hover:opacity-90 disabled:opacity-50"
            >
              {verificando ? 'Verificando...' : 'Verificar Compatibilidad'}
            </Button>
          </div>

          {/* Resultado de la verificación */}
          {formData.compatibilidad_verificada && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Resultado de la Verificación
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Zonificación
                  </label>
                  <p className="font-mono bg-gray-200 p-2 rounded text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {formData.zonificacion}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Compatibilidad de Uso
                  </label>
                  <p className="font-mono p-2 rounded text-sm bg-green-100 text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {formData.compatibilidad_uso}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}







