import { LuTriangle } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { AnteproyectoFormData, UploadedDocument } from '@/types/anteproyecto.types';

interface StepDocumentosProps {
  formData: AnteproyectoFormData;
  anteproyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof AnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepDocumentoAnteproyecto({
  formData,
  anteproyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument,
}: StepDocumentosProps) {
  return (
    <div className="space-y-8">
      {/* Documentos Administrado */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        Documentos proporcionados por el administrado
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta los documentos necesarios para el expediente de anteproyecto
        </p>
        
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Partida Registral (SUNARP) <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.partida_registral || []}
              onChange={(files) => onInputChange('partida_registral', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="partida_registral"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Certificado de Parámetros Urbanísticos <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.certificado_parametros_urbanisticos || []}
              onChange={(files) => onInputChange('certificado_parametros_urbanisticos', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="certificado_parametros_urbanisticos"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Croquis o Plano de Ubicación <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.croquis_plano_ubicacion || []}
              onChange={(files) => onInputChange('croquis_plano_ubicacion', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="croquis_plano_ubicacion"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cabida Arquitectónica
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.cabida_arquitectonica || []}
              onChange={(files) => onInputChange('cabida_arquitectonica', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="cabida_arquitectonica"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Vigencia de Poder
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.vigencia_poder || []}
              onChange={(files) => onInputChange('vigencia_poder', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="vigencia_poder"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Otros Documentos
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.otros_documentos_administrado || []}
              onChange={(files) => onInputChange('otros_documentos_administrado', files)}
              accept=".pdf,.doc,.docx,.xlsx,.xls,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="otros_documentos_administrado"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>
        </div>
      </div>

      {/* Documentos FSR */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
           Documentos elaborados por FSR
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta los documentos necesarios para el expediente de anteproyecto
        </p>
        
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria descriptiva de arquitectura <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.memoria_descriptiva_arquitectura || []}
              onChange={(files) => onInputChange('memoria_descriptiva_arquitectura', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="memoria_descriptiva_arquitectura"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria descriptiva de seguridad <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.memoria_descriptiva_seguridad || []}
              onChange={(files) => onInputChange('memoria_descriptiva_seguridad', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="memoria_descriptiva_seguridad"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  FUE (Formulario Único de Edificación) <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.formulario_unico_edificacion || []}
              onChange={(files) => onInputChange('formulario_unico_edificacion', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="formulario_unico_edificacion"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                 Presupuesto de Obra
                </h4>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.presupuesto || []}
              onChange={(files) => onInputChange('presupuesto', files)}
              accept=".pdf,.xlsx,.xls"
              multiple
              onUpload={onFileUpload}
              documentKey="presupuesto"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Planos de Seguridad <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.plano_seguridad || []}
              onChange={(files) => onInputChange('plano_seguridad', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_seguridad"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Arquitectura <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.plano_arquitectura_fsr || []}
              onChange={(files) => onInputChange('plano_arquitectura_fsr', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_arquitectura_fsr"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Otros Documentos
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.otros_documentos_fsr || []}
              onChange={(files) => onInputChange('otros_documentos_fsr', files)}
              accept=".pdf,.doc,.docx,.xlsx,.xls,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="otros_documentos_fsr"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
              onDownload={onDownloadDocument}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
