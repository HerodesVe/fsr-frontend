import { useCallback } from 'react';
import { LuFileText, LuInfo } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { 
  ElaboracionSinVariacionFormData, 
  UploadedDocument,
  DocumentosAdministradoSinVariacion,
} from '@/types/conformidad.types';

interface StepDocumentosAdministradoSinVariacionProps {
  formData: ElaboracionSinVariacionFormData;
  errors: Record<string, string>;
  elaboracionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ElaboracionSinVariacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey?: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

// Documentos requeridos al administrado - SIN VARIACIÓN
const DOCUMENTOS_ADMINISTRADO_SIN_VARIACION = [
  { key: 'derecho_edificar', label: 'Documento que Acredite Derecho a Edificar', required: true },
  { key: 'planos_aprobados_licencia', label: 'Copia de Planos Aprobados de Licencia', required: true },
  { key: 'fecha_culminacion_obra', label: 'Fecha de Culminación de Obra', required: true },
  { key: 'anexo_h_visado', label: 'Anexo H Visado por Municipalidad', required: true },
  { key: 'vigencia_poder', label: 'Vigencia de Poder', required: false },
  { key: 'protocolos_equipos', label: 'Protocolos de Equipos y/o Otros', required: false },
  { key: 'otros_documentos', label: 'Otros Documentos', required: false },
];

export default function StepDocumentosAdministradoSinVariacion({
  formData,
  errors,
  elaboracionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepDocumentosAdministradoSinVariacionProps) {
  
  const documentos = formData.documentos_administrado;

  const handleDocumentoChange = useCallback((key: keyof DocumentosAdministradoSinVariacion, files: File[]) => {
    onInputChange('documentos_administrado', {
      ...documentos,
      [key]: files,
    });
  }, [documentos, onInputChange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 7: Documentación del Administrado
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos requeridos al administrado para la elaboración sin variación.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuInfo className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos del Administrado - Sin Variación
            </h4>
            <p className="text-sm text-blue-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Cargue cada uno de los documentos solicitados al administrado.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-teal-100 text-teal-600 p-3 rounded-lg">
            <LuFileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentación Requerida
            </h3>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Adjunte los documentos proporcionados por el administrado
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {DOCUMENTOS_ADMINISTRADO_SIN_VARIACION.map((doc) => (
            <div key={doc.key} className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {doc.label}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              </div>
              <FileUpload
                placeholder={`Cargar ${doc.label}`}
                value={documentos[doc.key as keyof DocumentosAdministradoSinVariacion] || []}
                onChange={(files) => handleDocumentoChange(doc.key as keyof DocumentosAdministradoSinVariacion, files)}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                onUpload={onFileUpload}
                documentKey={`docs_administrado_sv.${doc.key}`}
                anteproyectoId={elaboracionId}
                uploadedFiles={uploadedDocuments
                  .filter(d => d.key === `docs_administrado_sv.${doc.key}`)
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
