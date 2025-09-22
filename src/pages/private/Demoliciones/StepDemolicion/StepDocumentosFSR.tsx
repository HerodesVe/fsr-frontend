import { FileUpload } from '@/components/ui';
import type { DemolicionFormData, UploadedDocument } from '@/types/demolicion.types';

interface StepDocumentosFSRProps {
  formData: DemolicionFormData;
  demolicionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof DemolicionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepDocumentosFSR({
  formData,
  demolicionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepDocumentosFSRProps) {
  const toggleOtrosPlanos = () => {
    onInputChange('mostrar_otros_planos', !formData.mostrar_otros_planos);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos FSR
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Sube los documentos FSR necesarios para el proyecto de demolición
        </p>
        
        <div className="space-y-6">
          {/* Memoria Descriptiva */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria Descriptiva
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.memoria_descriptiva || []}
              onChange={(files) => onInputChange('memoria_descriptiva', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="memoria_descriptiva"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Plano de Ubicación */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Ubicación
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.plano_ubicacion || []}
              onChange={(files) => onInputChange('plano_ubicacion', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_ubicacion"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Plano de Arquitectura de lo que se Demolerá */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Arquitectura de lo que se Demolerá
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.plano_arquitectura_demoler || []}
              onChange={(files) => onInputChange('plano_arquitectura_demoler', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_arquitectura_demoler"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Plano de Serramiento */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Serramiento
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.plano_serramiento || []}
              onChange={(files) => onInputChange('plano_serramiento', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_serramiento"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Otros Planos */}
          {formData.mostrar_otros_planos && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Otros Planos
                  </h5>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Planos adicionales relacionados con el proyecto
                  </p>
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivos"
                value={formData.otros_planos || []}
                onChange={(files) => onInputChange('otros_planos', files)}
                accept="*"
                multiple
                onUpload={onFileUpload}
                documentKey="otros_planos"
                anteproyectoId={demolicionId}
                uploadedFiles={uploadedDocuments}
              />
            </div>
          )}
          
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={toggleOtrosPlanos}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {formData.mostrar_otros_planos ? '- Ocultar Otros Planos' : '+ Agregar Otros Planos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
