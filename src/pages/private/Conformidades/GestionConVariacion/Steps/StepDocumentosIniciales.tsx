import { LuFileText, LuInfo } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { ConformidadConVariacionFormData, UploadedDocument } from '@/types/conformidad.types';

interface StepDocumentosInicialesProps {
  formData: ConformidadConVariacionFormData;
  errors: Record<string, string>;
  conformidadId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey?: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

// Documentos requeridos para Gestión CON VARIACIÓN
const DOCUMENTOS_CON_VARIACION = [
  { key: 'derecho_edificar', label: 'Documento que Acredite el Derecho a Edificar', required: true },
  { key: 'comprobantes_pago_revision', label: 'Copia de los Comprobantes de Pago de Revisión', required: true },
  { key: 'fecha_ejecucion_obra', label: 'Documento que Registre la Fecha de Ejecución de la Obra', required: true },
  { key: 'fue_conformidad_declaratoria', label: 'FUE de Conformidad de Obra y Declaratoria de Edificación', required: true },
  { key: 'presupuesto_obra', label: 'Presupuesto de Obra', required: true },
  { key: 'vigencia_poder', label: 'Vigencia de Poder', required: false },
  { key: 'planos_replanteo_ubicacion', label: 'Planos de Replanteo de Ubicación y Localización', required: true },
  { key: 'planos_replanteo_arquitectura', label: 'Planos de Replanteo de Arquitectura', required: true },
  { key: 'planos_replanteo_seguridad', label: 'Planos de Replanteo de Seguridad', required: true },
  { key: 'cuaderno_obra_variaciones', label: 'Copia de la Sección del Cuaderno de Obra que Acredita las Variaciones Ejecutadas', required: true },
  { key: 'protocolos_equipos', label: 'Protocolos de Equipos y/o Otros', required: false },
  { key: 'otros_documentos', label: 'Otros Documentos', required: false },
];

export default function StepDocumentosIniciales({
  formData,
  errors,
  conformidadId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepDocumentosInicialesProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2: Documentos Iniciales
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos requeridos al administrado para realizar la presente gestión.
        </p>
      </div>

      {/* Información */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuInfo className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos Requeridos al Administrado
            </h4>
            <p className="text-sm text-blue-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Cargue cada uno de los documentos solicitados para iniciar el trámite de conformidad de obra con variación.
            </p>
          </div>
        </div>
      </div>

      {/* Sección de carga de documentos */}
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
              Adjunte los documentos necesarios para la gestión
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {DOCUMENTOS_CON_VARIACION.map((doc) => (
            <div key={doc.key} className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {doc.label}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              </div>
              <FileUpload
                placeholder={`Cargar ${doc.label}`}
                value={[]}
                onChange={(files) => {
                  // Manejar cambio de archivos
                }}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                onUpload={onFileUpload}
                documentKey={`documentos_iniciales.${doc.key}`}
                anteproyectoId={conformidadId}
                uploadedFiles={uploadedDocuments
                  .filter(d => d.key === `documentos_iniciales.${doc.key}`)
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
