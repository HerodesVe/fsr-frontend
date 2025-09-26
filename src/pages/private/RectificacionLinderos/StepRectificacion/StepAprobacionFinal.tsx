import { Input, FileUpload } from '@/components/ui';
import type { RectificacionLinderosFormData, UploadedDocument } from '@/types/rectificacionLinderos.types';

interface StepAprobacionFinalProps {
  formData: RectificacionLinderosFormData;
  rectificacionId: string;
  uploadedDocuments: UploadedDocument[];
  errors: Record<string, string>;
  onInputChange: (field: keyof RectificacionLinderosFormData, value: any) => void;
  onFileUpload: (file: File) => Promise<any>;
}

export default function StepAprobacionFinal({
  formData,
  rectificacionId,
  uploadedDocuments,
  errors,
  onInputChange,
  onFileUpload,
}: StepAprobacionFinalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 4: Carga de Documento de Aprobación Final
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Suba el plano visado o la resolución de aprobación para finalizar el proceso de gestión de rectificación de linderos.
        </p>
        
        <div className="space-y-6">
          {/* Documento de Aprobación */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Documento de Aprobación Final <span className="text-red-500">*</span>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Plano visado, resolución de aprobación o documento oficial que confirme la aprobación
              </p>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.documento_aprobacion || []}
              onChange={(files) => onInputChange('documento_aprobacion', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="documento_aprobacion"
              anteproyectoId={rectificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
              error={errors.documento_aprobacion}
            />
          </div>

          {/* Fecha de Aprobación */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Información de Aprobación
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Detalles sobre la fecha y estado de la aprobación
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha de Aprobación"
                type="date"
                value={formData.fecha_aprobacion}
                onChange={(e) => onInputChange('fecha_aprobacion', e.target.value)}
                error={errors.fecha_aprobacion}
                required
              />
            </div>
          </div>

          {/* Información del proceso finalizado */}
          {formData.documento_aprobacion && formData.documento_aprobacion.length > 0 && formData.fecha_aprobacion && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Proceso Finalizado Exitosamente
              </h4>
              <div className="text-sm text-green-800 space-y-1">
                <p><strong>Documento de aprobación:</strong> {formData.documento_aprobacion.length} archivo(s) cargado(s)</p>
                <p><strong>Fecha de aprobación:</strong> {formData.fecha_aprobacion}</p>
                <p><strong>Estado del proceso:</strong> Completado exitosamente</p>
                <p><strong>Próximos pasos:</strong> Entrega de documentos al cliente</p>
              </div>
            </div>
          )}

          {/* Información sobre tipos de documentos */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Tipos de Documentos de Aprobación
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Plano visado:</strong> Plano con el visto bueno de la entidad competente</li>
              <li>• <strong>Resolución municipal:</strong> Documento oficial de aprobación</li>
              <li>• <strong>Certificado de conformidad:</strong> Documento que certifica el cumplimiento</li>
              <li>• <strong>Acta de aprobación:</strong> Documento del proceso de revisión aprobado</li>
            </ul>
          </div>

          {/* Entregables finales */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Entregables Finales al Cliente
            </h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Plano de rectificación de linderos visado</li>
              <li>• Resolución o certificado de aprobación</li>
              <li>• Memoria descriptiva actualizada</li>
              <li>• Coordenadas UTM oficiales</li>
              <li>• Documentación de respaldo del proceso</li>
            </ul>
          </div>

          {/* Advertencias importantes */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Importante
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Verificar que el documento esté correctamente firmado y sellado</li>
              <li>• Confirmar que todas las medidas coincidan con las aprobadas</li>
              <li>• Asegurar que el documento tenga validez legal</li>
              <li>• Coordinar la entrega formal al cliente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
