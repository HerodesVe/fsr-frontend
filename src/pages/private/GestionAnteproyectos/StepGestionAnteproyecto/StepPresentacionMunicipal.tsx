import { DateInput, Input, FileUpload } from '@/components/ui';
import type { GestionAnteproyectoFormData } from '@/types/gestionAnteproyecto.types';

interface StepPresentacionMunicipalProps {
  formData: GestionAnteproyectoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: any[];
  onInputChange: (field: keyof GestionAnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepPresentacionMunicipal({
  formData,
  errors,
  onInputChange,
  onFileUpload
}: StepPresentacionMunicipalProps) {

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Presentación del Expediente en la Municipalidad
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre los datos de la presentación formal del expediente en la municipalidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateInput
          label="Fecha de Ingreso a la Municipalidad"
          required
          value={formData.fecha_ingreso || ''}
          onChange={(value) => onInputChange('fecha_ingreso', value)}
          error={errors.fecha_ingreso}
        />

        <Input
          label="Número de Expediente"
          placeholder="Ej: EXP-2025-123456"
          required
          value={formData.numero_expediente || ''}
          onChange={(value) => onInputChange('numero_expediente', value)}
          error={errors.numero_expediente}
          description="Número asignado por la municipalidad al expediente"
        />
      </div>

      <div>
        <FileUpload
          label="Archivo del Cargo Sellado"
          required
          accept=".pdf,.jpg,.jpeg,.png"
          multiple={false}
          onChange={async (files: File[]) => {
            if (files.length > 0) {
              try {
                await onFileUpload(files[0], 'archivo_cargo');
                onInputChange('archivo_cargo', files);
              } catch (error) {
                console.error('Error uploading file:', error);
              }
            }
          }}
          error={errors.archivo_cargo}
        />
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Información Importante
        </h4>
        <ul className="text-sm text-blue-700 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          <li>• El expediente debe ser presentado con todos los documentos requeridos</li>
          <li>• La municipalidad tiene un plazo de 5 días hábiles para emitir respuesta</li>
          <li>• Conserve el cargo sellado como comprobante de presentación</li>
          <li>• El número de expediente será necesario para consultas posteriores</li>
        </ul>
      </div>
    </div>
  );
}
