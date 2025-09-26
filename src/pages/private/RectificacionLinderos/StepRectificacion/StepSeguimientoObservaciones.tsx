import { Textarea, FileUpload } from '@/components/ui';
import type { RectificacionLinderosFormData, UploadedDocument } from '@/types/rectificacionLinderos.types';

interface StepSeguimientoObservacionesProps {
  formData: RectificacionLinderosFormData;
  rectificacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof RectificacionLinderosFormData, value: any) => void;
  onFileUpload: (file: File) => Promise<any>;
}

export default function StepSeguimientoObservaciones({
  formData,
  rectificacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepSeguimientoObservacionesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 3: Seguimiento y Carga de Observaciones
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documente las observaciones recibidas por parte de la entidad revisora tras la cita de revisión.
        </p>
        
        <div className="space-y-6">
          {/* Notas y Comentarios */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Notas y Comentarios de la Revisión
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Describa las observaciones verbales o escritas recibidas durante la revisión
              </p>
            </div>
            <Textarea
              value={formData.notas_observaciones}
              onChange={(e) => onInputChange('notas_observaciones', e.target.value)}
              placeholder="Describa aquí las observaciones verbales o escritas recibidas durante la cita de revisión..."
              rows={6}
            />
          </div>

          {/* Documento de Observaciones */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Documento de Observaciones (Opcional)
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Adjunte el documento oficial con las observaciones de la entidad revisora
              </p>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.documento_observaciones || []}
              onChange={(files) => onInputChange('documento_observaciones', files)}
              accept=".pdf,.jpg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="documento_observaciones"
              anteproyectoId={rectificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
            />
          </div>

          {/* Información de seguimiento */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Tipos de Observaciones Comunes
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>Observaciones técnicas:</strong> Correcciones en medidas o coordenadas</li>
              <li>• <strong>Observaciones documentales:</strong> Documentos faltantes o incorrectos</li>
              <li>• <strong>Observaciones normativas:</strong> Cumplimiento de reglamentos específicos</li>
              <li>• <strong>Observaciones de forma:</strong> Formato, firmas o sellos</li>
            </ul>
          </div>

          {/* Estado del seguimiento */}
          {(formData.notas_observaciones || (formData.documento_observaciones && formData.documento_observaciones.length > 0)) && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Estado del Seguimiento
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Notas registradas:</strong> {formData.notas_observaciones ? 'Sí' : 'No'}</p>
                <p><strong>Documentos adjuntos:</strong> {formData.documento_observaciones?.length || 0} archivo(s)</p>
                <p><strong>Estado:</strong> Observaciones documentadas</p>
                {!formData.notas_observaciones && (!formData.documento_observaciones || formData.documento_observaciones.length === 0) && (
                  <p className="text-green-700"><strong>Sin observaciones:</strong> El proceso puede continuar sin modificaciones</p>
                )}
              </div>
            </div>
          )}

          {/* Guía de próximos pasos */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Próximos Pasos
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Si hay observaciones, realizar las correcciones necesarias</li>
              <li>• Coordinar una nueva cita si se requieren modificaciones mayores</li>
              <li>• Si no hay observaciones, proceder con la aprobación final</li>
              <li>• Mantener comunicación constante con la entidad revisora</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
