import { useState } from 'react';
import { LuSearch, LuFileText, LuUpload } from 'react-icons/lu';
import { Button, Input, FileUpload } from '@/components/ui';
import type { GestionProyectoFormData } from '@/types/gestionProyecto.types';

interface StepSeleccionProyectoProps {
  formData: GestionProyectoFormData;
  gestionId: string;
  uploadedDocuments: any[];
  onInputChange: (field: keyof GestionProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepSeleccionProyecto({
  formData,
  onInputChange,
  onFileUpload
}: StepSeleccionProyectoProps) {
  const [modoSeleccion, setModoSeleccion] = useState<'buscar' | 'cargar'>('buscar');

  // Documentos requeridos para proyecto externo
  const documentosRequeridos = [
    { key: 'acta_anteproyecto_conforme', label: 'Acta de Anteproyecto Conforme', required: true },
    { key: 'ficha_registral', label: 'Ficha Registral (Propiedad)', required: true },
    { key: 'planos_especialidades', label: 'Planos y Memorias de Especialidades', required: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Selección del Proyecto a Gestionar
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione un proyecto existente o cargue los documentos de un proyecto externo.
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
          Buscar Proyecto Existente
        </Button>
        <Button
          variant={modoSeleccion === 'cargar' ? 'solid' : 'bordered'}
          onClick={() => setModoSeleccion('cargar')}
          startContent={<LuUpload className="w-4 h-4" />}
          style={modoSeleccion === 'cargar' ? { backgroundColor: 'var(--primary-color)' } : {}}
          className={modoSeleccion === 'cargar' ? 'text-white' : ''}
        >
          Cargar Proyecto Externo
        </Button>
      </div>

      {/* Contenido según el modo seleccionado */}
      {modoSeleccion === 'buscar' ? (
        <div className="space-y-4">
          <div>
            <Input
              label="Buscar Proyecto"
              placeholder="Ingrese el nombre del proyecto o código..."
              value=""
              onChange={() => {}}
            />
          </div>
          
          {/* Lista de proyectos disponibles (dummy) */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Proyectos Disponibles
            </h4>
            <div className="space-y-2">
              {[
                { id: '1', titulo: 'Edificio Residencial San Isidro', codigo: 'PRO-2024-001', cliente: 'Constructora Lima S.A.C.', especialidades: ['Arquitectura', 'Estructuras', 'Sanitarias', 'Eléctricas'] },
                { id: '2', titulo: 'Centro Comercial Miraflores', codigo: 'PRO-2024-002', cliente: 'Inversiones Norte S.A.C.', especialidades: ['Arquitectura', 'Estructuras', 'Eléctricas'] },
                { id: '3', titulo: 'Oficinas Corporativas La Molina', codigo: 'PRO-2024-003', cliente: 'Desarrollos Sur S.A.C.', especialidades: ['Arquitectura', 'Estructuras', 'Sanitarias', 'Eléctricas'] },
              ].map((proyecto) => (
                <div
                  key={proyecto.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg hover:border-teal-300 cursor-pointer"
                  onClick={() => onInputChange('selectedProyecto', proyecto)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <LuFileText className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {proyecto.titulo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {proyecto.codigo} - {proyecto.cliente}
                    </p>
                    <div className="flex gap-1 ml-6 mt-1">
                      {proyecto.especialidades.map((esp, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {esp}
                        </span>
                      ))}
                    </div>
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
              Documentos Requeridos para Proyecto Externo
            </h4>
            <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Los siguientes documentos son obligatorios para procesar un proyecto externo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {documentosRequeridos.map((documento) => (
              <div key={documento.key}>
                <FileUpload
                  label={documento.label}
                  required={documento.required}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple={documento.key === 'planos_especialidades'}
                  onChange={async (files: File[]) => {
                    if (files.length > 0) {
                      try {
                        if (files.length === 1) {
                          await onFileUpload(files[0], documento.key);
                        } else {
                          // Para múltiples archivos
                          const uploadPromises = files.map((file: File) => onFileUpload(file, documento.key));
                          await Promise.all(uploadPromises);
                        }
                        onInputChange(documento.key as keyof GestionProyectoFormData, files);
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
      {formData.selectedProyecto && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Proyecto Seleccionado
          </h4>
          <div className="flex items-center gap-2">
            <LuFileText className="w-4 h-4 text-green-600" />
            <span className="text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.selectedProyecto.titulo || 'Proyecto seleccionado'}
            </span>
          </div>
          {formData.selectedProyecto.especialidades && (
            <div className="flex gap-1 mt-2">
              {formData.selectedProyecto.especialidades.map((esp: string, index: number) => (
                <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {esp}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
