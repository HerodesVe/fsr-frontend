import { Input, FileUpload } from '@/components/ui';
import type { RectificacionLinderosFormData, UploadedDocument } from '@/types/rectificacionLinderos.types';

interface StepElaboracionPlanoProps {
  formData: RectificacionLinderosFormData;
  rectificacionId: string;
  uploadedDocuments: UploadedDocument[];
  errors: Record<string, string>;
  onInputChange: (field: keyof RectificacionLinderosFormData, value: any) => void;
  onFileUpload: (file: File) => Promise<any>;
}

export default function StepElaboracionPlano({
  formData,
  rectificacionId,
  uploadedDocuments,
  errors,
  onInputChange,
  onFileUpload,
}: StepElaboracionPlanoProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 4: Elaboración y Carga del Plano de Rectificación
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Cargue el plano técnico de rectificación elaborado por el equipo de FSR y registre la fecha de elaboración.
        </p>
        
        <div className="space-y-6">
          {/* Plano de Rectificación */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Plano de Rectificación Propuesto <span className="text-red-500">*</span>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Plano técnico elaborado por FSR con la propuesta de rectificación (PDF, DWG)
              </p>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.plano_propuesto || []}
              onChange={(files) => onInputChange('plano_propuesto', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_propuesto"
              anteproyectoId={rectificacionId}
              uploadedFiles={uploadedDocuments}
              error={errors.plano_propuesto}
            />
          </div>

          {/* Fecha de Elaboración */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Información de Elaboración
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Registre los detalles del proceso de elaboración del plano
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha de Elaboración del Plano"
                type="date"
                value={formData.fecha_elaboracion_plano}
                onChange={(e) => onInputChange('fecha_elaboracion_plano', e.target.value)}
                error={errors.fecha_elaboracion_plano}
                required
              />
            </div>
          </div>

          {/* Información del proceso */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Proceso de Elaboración
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• El plano debe incluir las medidas y linderos actualizados</li>
              <li>• Debe contener la firma y sello del profesional responsable</li>
              <li>• Incluir coordenadas UTM y referencias geodésicas</li>
              <li>• Cumplir con las normativas municipales vigentes</li>
              <li>• Formato recomendado: PDF para revisión y DWG para trabajo técnico</li>
            </ul>
          </div>

          {/* Estado del proceso */}
          {formData.plano_propuesto && formData.plano_propuesto.length > 0 && formData.fecha_elaboracion_plano && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Resumen de la Elaboración
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Plano cargado:</strong> {formData.plano_propuesto.length} archivo(s)</p>
                <p><strong>Fecha de elaboración:</strong> {formData.fecha_elaboracion_plano}</p>
                <p><strong>Estado:</strong> Listo para proceso de gestión</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
