import { FileUpload, DateInput } from '@/components/ui';
import type { GestionAnexoFormData, UploadedDocument } from '@/types/gestionAnexo.types';

interface StepPresentacionProps {
  formData: GestionAnexoFormData;
  gestionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof GestionAnexoFormData, value: any) => void;
  onFileUpload: (file: File) => Promise<UploadedDocument>;
}

export default function StepPresentacion({
  formData,
  onInputChange,
}: StepPresentacionProps) {

  const handleFileChange = async (field: keyof GestionAnexoFormData, files: File[]) => {
    onInputChange(field, files);
  };

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
                multiple={false}
                value={formData.hoja_tramite_cargo || []}
                onChange={(files) => handleFileChange('hoja_tramite_cargo', files)}
                required
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
