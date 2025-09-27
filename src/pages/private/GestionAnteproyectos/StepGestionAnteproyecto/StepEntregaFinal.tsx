import { LuCheck } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { GestionAnteproyectoFormData } from '@/types/gestionAnteproyecto.types';

interface StepEntregaFinalProps {
  formData: GestionAnteproyectoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: any[];
  onInputChange: (field: keyof GestionAnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepEntregaFinal({
  formData,
  onInputChange,
  onFileUpload
}: StepEntregaFinalProps) {

  const documentosFinales = [
    {
      key: 'carta_conformidad',
      label: 'Carta de Conformidad',
      description: 'Carta que indica la conformidad del anteproyecto',
      required: true
    },
    {
      key: 'acta_final',
      label: 'Acta Final Firmada',
      description: 'Acta de conformidad firmada por los delegados municipales',
      required: true
    },
    {
      key: 'fue_aprobado',
      label: 'FUE Aprobado y Sellado',
      description: 'Formulario Único de Edificación sellado y aprobado',
      required: true
    },
    {
      key: 'planos_aprobados',
      label: 'Planos Aprobados y Sellados',
      description: 'Planos sellados y firmados por la municipalidad',
      required: true
    },
    {
      key: 'otros_documentos',
      label: 'Otros Documentos',
      description: 'Documentos adicionales si son necesarios',
      required: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Entrega de Documentos Finales al Cliente
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Cargue toda la documentación final aprobada para la entrega al cliente.
        </p>
      </div>

      {/* Mensaje de éxito */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <LuCheck className="w-5 h-5 text-green-600" />
          <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Anteproyecto Aprobado
          </h4>
        </div>
        <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          El trámite ha sido completado exitosamente. Proceda a cargar los documentos finales para la entrega al cliente.
        </p>
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
                multiple={documento.key === 'planos_aprobados' || documento.key === 'otros_documentos'}
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

      {/* Información de entrega */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Información de Entrega
        </h4>
        <ul className="text-sm text-blue-700 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          <li>• Todos los documentos deben estar sellados y firmados por la municipalidad</li>
          <li>• Verifique que los planos correspondan a la versión aprobada</li>
          <li>• El FUE debe contener el sello de conformidad municipal</li>
          <li>• Conserve copias de todos los documentos para el archivo</li>
          <li>• Notifique al cliente sobre la disponibilidad de los documentos</li>
        </ul>
      </div>

      {/* Estado de completitud */}
      {formData.carta_conformidad && formData.acta_final && formData.fue_aprobado && formData.planos_aprobados && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <LuCheck className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos Completos
            </h4>
          </div>
          <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Todos los documentos requeridos han sido cargados. El trámite está listo para finalizar.
          </p>
        </div>
      )}
    </div>
  );
}
