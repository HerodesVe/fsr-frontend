import { LuBuilding2, LuInfo } from 'react-icons/lu';
import { DateInput, Input, FileUpload } from '@/components/ui';
import type { ConformidadConVariacionFormData, UploadedDocument } from '@/types/conformidad.types';

interface StepPresentacionMunicipalProps {
  formData: ConformidadConVariacionFormData;
  errors: Record<string, string>;
  conformidadId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey?: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepPresentacionMunicipal({
  formData,
  errors,
  conformidadId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepPresentacionMunicipalProps) {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 8: Presentación ante Municipalidad
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre los datos de la presentación formal del expediente en la municipalidad.
        </p>
      </div>

      {/* Sección principal */}
      <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
            <LuBuilding2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              Datos de Presentación
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información del ingreso del expediente a la municipalidad
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateInput
              label="Fecha de Ingreso a la Municipalidad"
              required
              value={formData.fecha_ingreso}
              onChange={(value) => onInputChange('fecha_ingreso', value)}
              error={errors.fecha_ingreso}
            />

            <Input
              label="Número de Expediente"
              placeholder="Ej: EXP-2025-123456"
              required
              value={formData.numero_expediente}
              onChange={(e) => onInputChange('numero_expediente', e.target.value)}
              error={errors.numero_expediente}
              description="Número asignado por la municipalidad al expediente"
            />
          </div>

          <div>
            <FileUpload
              label="Archivo del Cargo Sellado"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(files) => onInputChange('archivo_cargo', files)}
              onUpload={onFileUpload}
              documentKey="presentacion_municipal.archivo_cargo"
              anteproyectoId={conformidadId}
              uploadedFiles={uploadedDocuments
                .filter(doc => doc.key === 'presentacion_municipal.archivo_cargo')
                .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
              error={errors.archivo_cargo}
            />
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuInfo className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información Importante
            </h4>
            <ul className="text-sm text-blue-700 space-y-1 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li>• El expediente debe ser presentado con todos los documentos requeridos</li>
              <li>• La municipalidad tiene un plazo de 5 días hábiles para emitir respuesta</li>
              <li>• Conserve el cargo sellado como comprobante de presentación</li>
              <li>• El número de expediente será necesario para consultas posteriores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
