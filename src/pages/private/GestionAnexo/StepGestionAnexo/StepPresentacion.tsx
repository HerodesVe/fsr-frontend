import { FileUpload, DateInput } from '@/components/ui';
import type { GestionAnexoFormData, UploadedDocument } from '@/types/gestionAnexo.types';

interface StepPresentacionProps {
  formData: GestionAnexoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof GestionAnexoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepPresentacion({
  formData,
  errors,
  gestionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument,
}: StepPresentacionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 3: Presentación en Municipalidad
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre el cargo de recepción y la fecha de ingreso de los documentos en la municipalidad.
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hoja de Trámite (Cargo) */}
            <div>
              <FileUpload
                label="Hoja de Trámite (Cargo)"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(files) => onInputChange('hoja_tramite_cargo', files)}
                required
                onUpload={onFileUpload}
                documentKey="presentacion_municipal.hoja_tramite_cargo"
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'presentacion_municipal.hoja_tramite_cargo').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
                error={errors.hoja_tramite_cargo}
              />
            </div>

            {/* Fecha de Ingreso */}
            <div>
              <DateInput
                label="Fecha de Ingreso"
                value={formData.fecha_ingreso_municipalidad || ''}
                onChange={(value) => onInputChange('fecha_ingreso_municipalidad', value)}
                placeholder="dd/mm/aaaa"
                required
                error={errors.fecha_ingreso_municipalidad}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
