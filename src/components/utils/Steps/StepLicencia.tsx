import { Input, Select, FileUpload } from '@/components/ui';
import type { AnteproyectoFormData, UploadedDocument } from '@/types/anteproyecto.types';

interface StepLicenciaProps {
  formData: AnteproyectoFormData;
  errors: Record<string, string>;
  anteproyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof AnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepLicencia({
  formData,
  errors,
  anteproyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument,
}: StepLicenciaProps) {
  const modalidadOptions = [
    { value: 'A', label: 'Modalidad A' },
    { value: 'B', label: 'Modalidad B' },
    { value: 'C', label: 'Modalidad C' },
    { value: 'D', label: 'Modalidad D' },
  ];

  const tipoObraOptions = [
    { value: 'ampliacion', label: 'Ampliación' },
    { value: 'remodelacion', label: 'Remodelación' },
    { value: 'demolicion_total', label: 'Demolición Total' },
    { value: 'demolicion_parcial', label: 'Demolición Parcial' },
    { value: 'cercado', label: 'Cercado' },
    { value: 'acondicionamiento', label: 'Acondicionamiento' },
    { value: 'refaccion', label: 'Refacción' },
    { value: 'puesta_valor_historico_monumental', label: 'Puesta en Valor Histórico Monumental' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Tipo de Obra
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione un anteproyecto aprobado para importar sus datos e ingresar la información manualmente
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tipo de Obra"
            placeholder="Seleccionar tipo de obra"
            options={tipoObraOptions}
            selectedKeys={formData.tipo_licencia_edificacion ? [formData.tipo_licencia_edificacion] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onInputChange('tipo_licencia_edificacion', value || '');
            }}
            error={errors.tipo_licencia_edificacion}
          />

          <Select
            label="Modalidad de Aprobación"
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
          Normativa aplicable para anteproyecto
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta los documentos necesarios para las normativas del proyecto
        </p>
        
        <div className="space-y-6">
          <Input
            label="Link de normativa aplicable para anteproyecto"
            placeholder="Pegar el link"
            value={formData.link_normativas}
            onChange={(e) => onInputChange('link_normativas', e.target.value)}
          />

          <FileUpload
            label="Normativa aplicable para anteproyecto"
            placeholder="Seleccione archivo"
            value={formData.archivo_normativo ? [formData.archivo_normativo] : []}
            onChange={(files) => onInputChange('archivo_normativo', files[0])}
            accept=".pdf,.doc,.docx"
            required
            onUpload={onFileUpload}
            documentKey="licencias_normativas.archivo_normativo"
            anteproyectoId={anteproyectoId}
            uploadedFiles={uploadedDocuments}
            onDownload={onDownloadDocument}
          />
        </div>
      </div>
    </div>
  );
}
