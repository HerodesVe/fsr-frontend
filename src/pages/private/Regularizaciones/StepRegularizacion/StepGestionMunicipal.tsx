import { LuClipboardCheck, LuTriangle } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { RegularizacionFormData, UploadedDocument } from '@/types/regularizacion.types';

interface StepGestionMunicipalProps {
  formData: RegularizacionFormData;
  regularizacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof RegularizacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepGestionMunicipal({
  formData,
  regularizacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepGestionMunicipalProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 5: Gestión Municipal
        </h3>
        <div className="p-4 border-l-4 border-teal-500 bg-teal-50 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <LuClipboardCheck className="h-5 w-5 text-teal-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-teal-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Gestione el expediente en la municipalidad. Registre aquí todos los cargos, observaciones y resoluciones para mantener una trazabilidad completa.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Cargo de Ingreso a Municipalidad */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cargo de Ingreso a Municipalidad
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documento que acredita la presentación del expediente en la municipalidad
                </p>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir Cargo de Ingreso"
              value={formData.cargoMunicipal || []}
              onChange={(files) => onInputChange('cargoMunicipal', files)}
              accept=".pdf,.jpg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="cargoMunicipal"
              anteproyectoId={regularizacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key, name: doc.name, file_id: doc.file_id }))}
            />
          </div>

          {/* Acta(s) de Observación */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Acta(s) de Observación
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documentos con observaciones realizadas por la municipalidad (si las hubiera)
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Subir Actas de Observación"
              value={formData.actaObservacion || []}
              onChange={(files) => onInputChange('actaObservacion', files)}
              accept=".pdf,.jpg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="actaObservacion"
              anteproyectoId={regularizacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key, name: doc.name, file_id: doc.file_id }))}
            />
          </div>

          {/* Documento(s) de Subsanación */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Documento(s) de Subsanación
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documentos presentados para subsanar las observaciones (si las hubiera)
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Subir Documentos de Subsanación"
              value={formData.docSubsanacion || []}
              onChange={(files) => onInputChange('docSubsanacion', files)}
              accept=".pdf,.doc,.docx,.dwg,.jpg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="docSubsanacion"
              anteproyectoId={regularizacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key, name: doc.name, file_id: doc.file_id }))}
            />
          </div>

          {/* Licencia / Resolución Final */}
          <div className="p-4 border border-gray-200 rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Licencia / Resolución Final
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Documento final emitido por la municipalidad con la resolución del trámite
                </p>
              </div>
              <div className="text-xs text-green-600">
                <LuTriangle className="inline w-4 h-4 mr-1" />
                Final
              </div>
            </div>
            <FileUpload
              placeholder="Subir Licencia o Resolución Final"
              value={formData.resolucionFinal || []}
              onChange={(files) => onInputChange('resolucionFinal', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="resolucionFinal"
              anteproyectoId={regularizacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key, name: doc.name, file_id: doc.file_id }))}
            />
          </div>
        </div>

        {/* Información sobre el proceso */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Proceso de Gestión Municipal
          </h4>
          <div className="text-sm text-blue-700 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p>• <strong>Ingreso:</strong> Presentar el expediente completo con el FUE firmado</p>
            <p>• <strong>Revisión:</strong> La municipalidad revisará la documentación</p>
            <p>• <strong>Observaciones:</strong> Si hay observaciones, se deberán subsanar</p>
            <p>• <strong>Resolución:</strong> Emisión de la licencia o resolución final</p>
          </div>
        </div>
      </div>
    </div>
  );
}
