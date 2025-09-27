import { LuCheck, LuLock } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { GestionProyectoFormData } from '@/types/gestionProyecto.types';

interface StepEmisionLicenciaProps {
  formData: GestionProyectoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: any[];
  onInputChange: (field: keyof GestionProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepEmisionLicencia({
  formData,
  onInputChange,
  onFileUpload
}: StepEmisionLicenciaProps) {
  
  // Verificar si todas las especialidades están conformes
  const especialidades = ['arquitectura', 'estructuras', 'electricas', 'sanitarias'] as const;
  const todasEspecialidadesConformes = especialidades.every(esp => 
    formData.especialidades[esp]?.es_conforme || false
  );

  const documentosFinales = [
    {
      key: 'licencia_final',
      label: 'Resolución de Licencia Final',
      description: 'Resolución oficial que otorga la licencia de construcción',
      required: true
    },
    {
      key: 'cargo_entrega_administrado',
      label: 'Cargo de Entrega al Administrado',
      description: 'Documento que acredita la entrega de todos los documentos al cliente',
      required: true
    }
  ];

  if (!todasEspecialidadesConformes) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Emisión y Entrega de Licencia
          </h2>
          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Este paso se habilitará cuando todas las especialidades tengan un acta conforme.
          </p>
        </div>

        {/* Estado bloqueado */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
          <LuLock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Paso Bloqueado
          </h3>
          <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Para habilitar este paso, todas las especialidades deben tener un acta conforme.
          </p>
          
          {/* Estado de especialidades */}
          <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
            <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Estado de Especialidades
            </h4>
            <div className="space-y-2">
              {[
                { key: 'arquitectura', nombre: 'Arquitectura' },
                { key: 'estructuras', nombre: 'Estructuras' },
                { key: 'electricas', nombre: 'Eléctricas' },
                { key: 'sanitarias', nombre: 'Sanitarias' }
              ].map((esp) => (
                <div key={esp.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {esp.nombre}
                  </span>
                  {formData.especialidades[esp.key as keyof typeof formData.especialidades]?.es_conforme ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <LuCheck className="w-4 h-4" />
                      <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>Conforme</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Pendiente
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Emisión y Entrega de Licencia
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Cargue la licencia de construcción final y los documentos de entrega al cliente.
        </p>
      </div>

      {/* Mensaje de éxito */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <LuCheck className="w-5 h-5 text-green-600" />
          <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Proyecto Completamente Aprobado
          </h4>
        </div>
        <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          Todas las especialidades han sido aprobadas. Proceda a cargar la licencia final y los documentos de entrega.
        </p>
      </div>

      {/* Estado de especialidades aprobadas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Especialidades Aprobadas
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'arquitectura', nombre: 'Arquitectura' },
            { key: 'estructuras', nombre: 'Estructuras' },
            { key: 'electricas', nombre: 'Eléctricas' },
            { key: 'sanitarias', nombre: 'Sanitarias' }
          ].map((esp) => (
            <div key={esp.key} className="flex items-center gap-2 p-2 bg-white rounded">
              <LuCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                {esp.nombre}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Documentos finales */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos Finales
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          {documentosFinales.map((documento) => (
            <div key={documento.key}>
              <FileUpload
                label={documento.label}
                required={documento.required}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple={false}
                onChange={async (files: File[]) => {
                  if (files.length > 0) {
                    try {
                      await onFileUpload(files[0], documento.key);
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

      {/* Información de entrega */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Información de Entrega
        </h4>
        <ul className="text-sm text-blue-700 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          <li>• La licencia debe estar firmada y sellada por la autoridad competente</li>
          <li>• Verifique que todos los datos del proyecto coincidan con la licencia</li>
          <li>• El cargo de entrega debe incluir la fecha y firma del cliente</li>
          <li>• Conserve copias de todos los documentos para el archivo</li>
          <li>• Notifique al cliente sobre las condiciones y vigencia de la licencia</li>
        </ul>
      </div>

      {/* Estado de completitud */}
      {formData.licencia_final && formData.cargo_entrega_administrado && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <LuCheck className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos Completos
            </h4>
          </div>
          <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Todos los documentos finales han sido cargados. El trámite está listo para finalizar.
          </p>
        </div>
      )}
    </div>
  );
}
