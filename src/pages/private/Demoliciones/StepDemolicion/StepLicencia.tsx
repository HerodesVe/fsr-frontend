import { Input, Select, FileUpload } from '@/components/ui';
import type { DemolicionFormData, UploadedDocument } from '@/types/demolicion.types';

interface StepLicenciaProps {
  formData: DemolicionFormData;
  errors: Record<string, string>;
  demolicionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof DemolicionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepLicencia({
  formData,
  errors,
  demolicionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepLicenciaProps) {
  const modalidadOptions = [
    { value: 'A', label: 'Modalidad A' },
    { value: 'B', label: 'Modalidad B' },
    { value: 'C', label: 'Modalidad C' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Tipo de Licencia
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione un anteproyecto aprobado para importar sus datos e ingresar la información manualmente
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Tipo de Licencia de Edificación"
            placeholder="Ingrese tipo de licencia de edificación"
            value={formData.tipo_licencia_edificacion}
            onChange={(e) => onInputChange('tipo_licencia_edificacion', e.target.value)}
            error={errors.tipo_licencia_edificacion}
          />

          <Select
            label="Tipo de Modalidad"
            placeholder="Seleccionar opción"
            options={modalidadOptions}
            selectedKeys={formData.tipo_modalidad ? [formData.tipo_modalidad] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onInputChange('tipo_modalidad', value || '');
            }}
            error={errors.tipo_modalidad}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Normativas
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta los documentos necesarios para las normativas del proyecto
        </p>
        
        <div className="space-y-6">
          <Input
            label="Link"
            placeholder="Pegar el link"
            value={formData.link_normativas}
            onChange={(e) => onInputChange('link_normativas', e.target.value)}
          />

          <FileUpload
            label="Normativa"
            placeholder="Seleccione archivo"
            value={formData.archivo_normativo ? [formData.archivo_normativo] : []}
            onChange={(files) => onInputChange('archivo_normativo', files[0])}
            accept=".pdf,.doc,.docx"
            required
            onUpload={onFileUpload}
            documentKey="archivo_normativo"
            anteproyectoId={demolicionId}
            uploadedFiles={uploadedDocuments}
          />
        </div>
      </div>
    </div>
  );
}
