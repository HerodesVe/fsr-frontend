import { FileUpload } from '@/components/ui';
import type { HabilitacionUrbanaFormData, UploadedDocument } from '@/types/habilitacionUrbana.types';

interface StepAprobacionFinalProps {
  formData: HabilitacionUrbanaFormData;
  habilitacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof HabilitacionUrbanaFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepAprobacionFinal({
  formData,
  habilitacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepAprobacionFinalProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Aprobación y Entrega Final
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestione la documentación final del proceso de habilitación urbana
        </p>
        
        <div className="space-y-6">
          {/* En caso de Aprobación */}
          <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
            <h4 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              En caso de Aprobación
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acta con Dictamen Conforme
                </label>
                <FileUpload
                  placeholder="Subir Acta"
                  value={formData.acta_dictamen_conforme || []}
                  onChange={(files) => onInputChange('acta_dictamen_conforme', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="acta_dictamen_conforme"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolución de Habilitación Urbana
                </label>
                <FileUpload
                  placeholder="Subir Resolución"
                  value={formData.resolucion_habilitacion_urbana || []}
                  onChange={(files) => onInputChange('resolucion_habilitacion_urbana', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="resolucion_habilitacion_urbana"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>
            </div>
          </div>

          {/* En caso de Reconsideración / Apelación */}
          <div className="p-4 border border-gray-200 rounded-lg bg-yellow-50">
            <h4 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              En caso de Reconsideración / Apelación
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proyecto de Reconsideración / Apelación
              </label>
              <FileUpload
                placeholder="Subir Proyecto"
                value={formData.proyecto_reconsideracion_apelacion || []}
                onChange={(files) => onInputChange('proyecto_reconsideracion_apelacion', files)}
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey="proyecto_reconsideracion_apelacion"
                anteproyectoId={habilitacionId}
                uploadedFiles={uploadedDocuments}
              />
            </div>
          </div>

          {/* Documento Final */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documento Final
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo de Entrega al Cliente
              </label>
              <FileUpload
                placeholder="Subir Cargo de Entrega"
                value={formData.cargo_entrega_cliente || []}
                onChange={(files) => onInputChange('cargo_entrega_cliente', files)}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onUpload={onFileUpload}
                documentKey="cargo_entrega_cliente"
                anteproyectoId={habilitacionId}
                uploadedFiles={uploadedDocuments}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
