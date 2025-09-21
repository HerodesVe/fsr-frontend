import { LuTriangle } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { AnteproyectoFormData, UploadedDocument } from '@/types/anteproyecto.types';

interface StepDocumentosProps {
  formData: AnteproyectoFormData;
  anteproyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof AnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepDocumentos({
  formData,
  anteproyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepDocumentosProps) {
  return (
    <div className="space-y-8">
      {/* Documentos Administrado */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos Administrado
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
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Arquitectura <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.plano_arquitectura_adm || []}
              onChange={(files) => onInputChange('plano_arquitectura_adm', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_arquitectura_adm"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Pago derecho de revisión (CAP) - Factura
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.pago_derecho_revision_factura || []}
              onChange={(files) => onInputChange('pago_derecho_revision_factura', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="pago_derecho_revision_factura"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>
        </div>
      </div>

      {/* Documentos FSR */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos FSR
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
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Presupuesto
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
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Seguridad <span className="text-red-500">*</span>
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
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Pago derecho de revisión (CAP) - Liquidación
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.pago_derecho_revision_liquidacion || []}
              onChange={(files) => onInputChange('pago_derecho_revision_liquidacion', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="pago_derecho_revision_liquidacion"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Arquitectura <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={() => {}}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_arquitectura_fsr"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
