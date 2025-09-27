import { useState } from 'react';
import { LuSearch, LuFileText, LuUpload } from 'react-icons/lu';
import { Button, Input, FileUpload } from '@/components/ui';
import type { GestionAnteproyectoFormData } from '@/types/gestionAnteproyecto.types';

interface StepSeleccionAnteproyectoProps {
  formData: GestionAnteproyectoFormData;
  gestionId: string;
  uploadedDocuments: any[];
  onInputChange: (field: keyof GestionAnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepSeleccionAnteproyecto({
  formData,
  onInputChange,
  onFileUpload
}: StepSeleccionAnteproyectoProps) {
  const [modoSeleccion, setModoSeleccion] = useState<'buscar' | 'cargar'>('buscar');

  // Documentos requeridos para anteproyecto externo
  const documentosRequeridos = [
    { key: 'partida_registral', label: 'Partida Registral SUNAR', required: true },
    { key: 'certificado_parametro_municipal', label: 'Certificado de Parámetro Municipal', required: true },
    { key: 'plano_ubicacion', label: 'Plano de Ubicación', required: true },
    { key: 'plano_arquitectura', label: 'Plano de Arquitectura', required: true },
    { key: 'plano_seguridad', label: 'Plano de Seguridad', required: true },
    { key: 'memoria_descriptiva_arquitectura', label: 'Memoria Descriptiva de Arquitectura', required: true },
    { key: 'memoria_descriptiva_seguridad', label: 'Memoria Descriptiva de Seguridad', required: true },
    { key: 'formulario_unico_edificacion', label: 'Formulario Único de Edificación (FUE)', required: true },
    { key: 'presupuesto', label: 'Presupuesto', required: true },
    { key: 'pago_derecho_revision_cap', label: 'Pago de Derecho a Revisión CAP', required: true },
    { key: 'factura', label: 'Factura del Pago', required: true },
    { key: 'liquidacion', label: 'Liquidación del Pago', required: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Selección del Anteproyecto a Gestionar
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione un anteproyecto existente o cargue los documentos de un anteproyecto externo.
        </p>
      </div>

      {/* Selector de modo */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <Button
          variant={modoSeleccion === 'buscar' ? 'solid' : 'bordered'}
          onClick={() => setModoSeleccion('buscar')}
          startContent={<LuSearch className="w-4 h-4" />}
          style={modoSeleccion === 'buscar' ? { backgroundColor: 'var(--primary-color)' } : {}}
          className={modoSeleccion === 'buscar' ? 'text-white' : ''}
        >
          Buscar Anteproyecto Existente
        </Button>
        <Button
          variant={modoSeleccion === 'cargar' ? 'solid' : 'bordered'}
          onClick={() => setModoSeleccion('cargar')}
          startContent={<LuUpload className="w-4 h-4" />}
          style={modoSeleccion === 'cargar' ? { backgroundColor: 'var(--primary-color)' } : {}}
          className={modoSeleccion === 'cargar' ? 'text-white' : ''}
        >
          Cargar Anteproyecto Externo
        </Button>
      </div>

      {/* Contenido según el modo seleccionado */}
      {modoSeleccion === 'buscar' ? (
        <div className="space-y-4">
          <div>
            <Input
              label="Buscar Anteproyecto"
              placeholder="Ingrese el nombre del proyecto o código del anteproyecto..."
              value=""
              onChange={() => {}}
            />
          </div>
          
          {/* Lista de anteproyectos disponibles (dummy) */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Anteproyectos Disponibles
            </h4>
            <div className="space-y-2">
              {[
                { id: '1', nombre: 'Edificio Residencial San Isidro', codigo: 'ANT-2024-001', cliente: 'Constructora Lima S.A.C.' },
                { id: '2', nombre: 'Centro Comercial Miraflores', codigo: 'ANT-2024-002', cliente: 'Inversiones Norte S.A.C.' },
                { id: '3', nombre: 'Oficinas Corporativas La Molina', codigo: 'ANT-2024-003', cliente: 'Desarrollos Sur S.A.C.' },
              ].map((anteproyecto) => (
                <div
                  key={anteproyecto.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg hover:border-teal-300 cursor-pointer"
                  onClick={() => onInputChange('selectedAnteproyecto', anteproyecto)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <LuFileText className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {anteproyecto.nombre}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {anteproyecto.codigo} - {anteproyecto.cliente}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="bordered"
                  >
                    Seleccionar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos Requeridos para Anteproyecto Externo
            </h4>
            <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Todos los siguientes documentos son obligatorios para procesar un anteproyecto externo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {documentosRequeridos.map((documento) => (
              <div key={documento.key}>
                <FileUpload
                  label={documento.label}
                  required={documento.required}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple={false}
                  onChange={async (files: File[]) => {
                    if (files.length > 0) {
                      try {
                        await onFileUpload(files[0], documento.key);
                        onInputChange(documento.key as keyof GestionAnteproyectoFormData, files);
                      } catch (error) {
                        console.error('Error uploading file:', error);
                      }
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de selección */}
      {formData.selectedAnteproyecto && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Anteproyecto Seleccionado
          </h4>
          <div className="flex items-center gap-2">
            <LuFileText className="w-4 h-4 text-green-600" />
            <span className="text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.selectedAnteproyecto.nombre || 'Anteproyecto seleccionado'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
