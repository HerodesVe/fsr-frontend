import { DateInput, Input, FileUpload } from '@/components/ui';
import type { HabilitacionUrbanaFormData, UploadedDocument } from '@/types/habilitacionUrbana.types';

interface StepIngresoExpedienteProps {
  formData: HabilitacionUrbanaFormData;
  habilitacionId: string;
  uploadedDocuments: UploadedDocument[];
  errors: Record<string, string>;
  onInputChange: (field: keyof HabilitacionUrbanaFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepIngresoExpediente({
  formData,
  habilitacionId,
  uploadedDocuments,
  errors,
  onInputChange,
  onFileUpload,
}: StepIngresoExpedienteProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Ingreso del Expediente a la Municipalidad
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre la información del ingreso del expediente
        </p>
        
        <div className="space-y-6">
          <div>
            <DateInput
              label="Fecha de Ingreso"
              value={formData.fecha_ingreso}
              onChange={(value) => onInputChange('fecha_ingreso', value)}
              error={errors.fecha_ingreso}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo de Ingreso (escaneado) <span className="text-red-500">*</span>
            </label>
            <FileUpload
              placeholder="Subir archivo"
              value={formData.cargo_ingreso || []}
              onChange={(files) => onInputChange('cargo_ingreso', files)}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="cargo_ingreso"
              anteproyectoId={habilitacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
              error={errors.cargo_ingreso}
            />
          </div>

          <div>
            <Input
              label="Número de Expediente"
              placeholder="Ej: 12345-2025"
              value={formData.numero_expediente}
              onChange={(e) => onInputChange('numero_expediente', e.target.value)}
              error={errors.numero_expediente}
              isRequired
            />
          </div>
        </div>
      </div>
    </div>
  );
}
