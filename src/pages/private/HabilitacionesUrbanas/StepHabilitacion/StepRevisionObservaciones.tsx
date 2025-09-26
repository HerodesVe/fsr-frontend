import { LuInfo } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { HabilitacionUrbanaFormData, UploadedDocument } from '@/types/habilitacionUrbana.types';

interface StepRevisionObservacionesProps {
  formData: HabilitacionUrbanaFormData;
  habilitacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof HabilitacionUrbanaFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepRevisionObservaciones({
  formData,
  habilitacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepRevisionObservacionesProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Proceso de Revisión y Observaciones
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestione el proceso de revisión y levantamiento de observaciones
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Acta de Observaciones (si aplica)
            </label>
            <FileUpload
              placeholder="Subir Acta"
              value={formData.acta_observaciones || []}
              onChange={(files) => onInputChange('acta_observaciones', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="acta_observaciones"
              anteproyectoId={habilitacionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Información sobre plazo */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <LuInfo className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  El plazo para el levantamiento de observaciones es de <strong>15 días hábiles</strong>.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documentación Rectificada para Reingreso
            </label>
            <FileUpload
              placeholder="Subir archivos corregidos"
              value={formData.documentacion_rectificada || []}
              onChange={(files) => onInputChange('documentacion_rectificada', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="documentacion_rectificada"
              anteproyectoId={habilitacionId}
              uploadedFiles={uploadedDocuments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
