import { Input, Select, FileUpload } from '@/components/ui';
import type { AmpliacionFormData, UploadedDocument } from '@/types/ampliacion.types';

interface StepLicenciasProps {
  formData: AmpliacionFormData;
  errors: Record<string, string>;
  ampliacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof AmpliacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepLicencias({
  formData,
  errors,
  ampliacionId,
  onInputChange,
  onFileUpload,
}: StepLicenciasProps) {
  const modalidadOptions = [
    { value: 'A', label: 'Modalidad A: Aprobación automática con firma de profesionales' },
    { value: 'B', label: 'Modalidad B: Aprobación con evaluación por la Municipalidad' },
    { value: 'C', label: 'Modalidad C: Aprobación con evaluación por comisión técnica' },
    { value: 'D', label: 'Modalidad D: Aprobación con evaluación por comisión técnica (proyectos de gran envergadura)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Tipo de Licencia y Modalidad
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Defina el tipo de licencia y modalidad de aprobación para el proyecto
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Tipo de Licencia de Edificación"
            placeholder="Ej: Licencia de Ampliación/Remodelación"
            value={formData.tipo_licencia_edificacion || ''}
            onChange={(e) => onInputChange('tipo_licencia_edificacion', e.target.value)}
            error={errors.tipo_licencia_edificacion}
          />

          <Select
            label="Modalidad de Aprobación"
            placeholder="Seleccione una modalidad"
            options={modalidadOptions}
            selectedKeys={formData.modalidad ? [formData.modalidad] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as 'A' | 'B' | 'C' | 'D';
              onInputChange('modalidad', value || 'B');
            }}
            error={errors.modalidad}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Normativas y Reglamentos
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunte los documentos normativos y reglamentarios aplicables al proyecto
        </p>
        
        <div className="space-y-6">
          <Input
            label="Link de Normativas (opcional)"
            placeholder="https://ejemplo.com/normativas"
            value={formData.link_normativas || ''}
            onChange={(e) => onInputChange('link_normativas', e.target.value)}
          />

          <FileUpload
            label="Archivo Normativo"
            placeholder="Seleccione archivo"
            onChange={(files) => onInputChange('archivo_normativo', files)}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="archivo_normativo"
            anteproyectoId={ampliacionId}
            uploadedFiles={formData.archivo_normativo || []}
          />
        </div>
      </div>
    </div>
  );
}
