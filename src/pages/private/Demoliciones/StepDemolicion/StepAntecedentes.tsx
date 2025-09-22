import { FileUpload } from '@/components/ui';
import type { DemolicionFormData, UploadedDocument } from '@/types/demolicion.types';

interface StepAntecedentesProps {
  formData: DemolicionFormData;
  demolicionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof DemolicionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepAntecedentes({
  formData,
  demolicionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepAntecedentesProps) {
  const toggleOtrosAntecedentes = () => {
    onInputChange('mostrar_otros_antecedentes', !formData.mostrar_otros_antecedentes);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Antecedentes
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Sube los documentos de antecedentes del proyecto de demolición
        </p>
        
        <div className="space-y-6">
          {/* Planos de Ubicación */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Ubicación
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.planos_ubicacion || []}
              onChange={(files) => onInputChange('planos_ubicacion', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_ubicacion"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Plano de Arquitectura */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Arquitectura
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.planos_arquitectura || []}
              onChange={(files) => onInputChange('planos_arquitectura', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_arquitectura"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Planos de Sostenimiento */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Sostenimiento
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.planos_sostenimiento || []}
              onChange={(files) => onInputChange('planos_sostenimiento', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_sostenimiento"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Planos de Cercos */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Cercos
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.planos_cercos || []}
              onChange={(files) => onInputChange('planos_cercos', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_cercos"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Planos de Excavaciones */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Excavaciones
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.planos_excavaciones || []}
              onChange={(files) => onInputChange('planos_excavaciones', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_excavaciones"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Partida Registral */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Partida Registral
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.partida_registral || []}
              onChange={(files) => onInputChange('partida_registral', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="partida_registral"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* FUE */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  FUE
                </h5>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.fue || []}
              onChange={(files) => onInputChange('fue', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="fue"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Otros Antecedentes */}
          {formData.mostrar_otros_antecedentes && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Otros Antecedentes
                  </h5>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Documentos adicionales relacionados con los antecedentes
                  </p>
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivos"
                value={formData.otros_antecedentes || []}
                onChange={(files) => onInputChange('otros_antecedentes', files)}
                accept="*"
                multiple
                onUpload={onFileUpload}
                documentKey="otros_antecedentes"
                anteproyectoId={demolicionId}
                uploadedFiles={uploadedDocuments}
              />
            </div>
          )}
          
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={toggleOtrosAntecedentes}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {formData.mostrar_otros_antecedentes ? '- Ocultar Otros Antecedentes' : '+ Agregar Otros Antecedentes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
