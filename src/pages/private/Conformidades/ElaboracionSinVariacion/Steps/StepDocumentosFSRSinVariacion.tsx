import { useCallback } from 'react';
import { LuFileText, LuInfo } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { 
  ElaboracionSinVariacionFormData, 
  UploadedDocument,
  DocumentosFSRSinVariacion,
} from '@/types/conformidad.types';

interface StepDocumentosFSRSinVariacionProps {
  formData: ElaboracionSinVariacionFormData;
  errors: Record<string, string>;
  elaboracionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ElaboracionSinVariacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey?: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

// Documentos FSR (Técnicos) - SIN VARIACIÓN
const DOCUMENTOS_FSR_SIN_VARIACION = [
  { key: 'fue_conformidad_declaratoria', label: 'FUE de Conformidad de Obra y Declaratoria', required: true },
  { key: 'presupuesto_obra', label: 'Presupuesto de Obra', required: true },
  { key: 'fecha_ejecucion_obra', label: 'Documento de Fecha de Ejecución de Obra', required: true },
  { key: 'otros_documentos', label: 'Otros Documentos', required: false },
];

export default function StepDocumentosFSRSinVariacion({
  formData,
  errors,
  elaboracionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepDocumentosFSRSinVariacionProps) {
  
  const documentos = formData.documentos_fsr;

  const handleDocumentoChange = useCallback((key: keyof DocumentosFSRSinVariacion, files: File[]) => {
    onInputChange('documentos_fsr', {
      ...documentos,
      [key]: files,
    });
  }, [documentos, onInputChange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 8: Documentación FSR (Técnicos)
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos técnicos elaborados por FSR para la conformidad sin variación.
        </p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuInfo className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentación Técnica FSR - Sin Variación
            </h4>
            <p className="text-sm text-purple-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Cargue los documentos técnicos elaborados internamente para el expediente.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
            <LuFileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentación Técnica
            </h3>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Adjunte los documentos técnicos elaborados por FSR
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {DOCUMENTOS_FSR_SIN_VARIACION.map((doc) => (
            <div key={doc.key} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {doc.label}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              </div>
              <FileUpload
                placeholder={`Cargar ${doc.label}`}
                value={documentos[doc.key as keyof DocumentosFSRSinVariacion] || []}
                onChange={(files) => handleDocumentoChange(doc.key as keyof DocumentosFSRSinVariacion, files)}
                accept=".pdf,.jpg,.jpeg,.png,.dwg,.doc,.docx"
                multiple
                onUpload={onFileUpload}
                documentKey={`docs_fsr_sv.${doc.key}`}
                anteproyectoId={elaboracionId}
                uploadedFiles={uploadedDocuments
                  .filter(d => d.key === `docs_fsr_sv.${doc.key}`)
                  .map(d => ({ key: d.key || d.id, name: d.name, file_id: d.id }))}
                onDownload={onDownloadDocument}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
