import { LuInfo, LuLink } from 'react-icons/lu';
import { Input, FileUpload } from '@/components/ui';
import type { ModificacionFormData, UploadedDocument } from '@/types/modificacion.types';

interface StepAntecedentesProps {
  formData: ModificacionFormData;
  modificacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ModificacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepAntecedentes({
  formData,
  modificacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepAntecedentesProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Vinculación y Carga de Antecedentes
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta los documentos del proyecto original que será modificado
        </p>

        {/* Vinculación de Expedientes */}
        <div className="bg-gray-50 p-4 rounded-lg border mb-6">
          <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
            <LuLink size={16} className="mr-2" />
            Vincular Expedientes (Opcional)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Vincular Expediente FSR"
              placeholder="Buscar por N° de trámite..."
              value={formData.vincular_expediente_fsr}
              onChange={(e) => onInputChange('vincular_expediente_fsr', e.target.value)}
            />
            <Input
              label="N° Expediente Externo"
              placeholder="Ingresar N° de expediente municipal..."
              value={formData.numero_expediente_externo}
              onChange={(e) => onInputChange('numero_expediente_externo', e.target.value)}
            />
          </div>
        </div>

        {/* Documentos de Antecedentes */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-4">Carga de Documentos de Antecedentes</h4>
          <div className="space-y-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Licencia de Obra Anterior <span className="text-red-500">*</span>
                  </h4>
                </div>
                <div className="text-xs text-gray-500">
                  <LuInfo className="inline w-4 h-4 mr-1" />
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={[]}
                onChange={(files) => onInputChange('licencia_obra_anterior', files)}
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey="licencia_obra_anterior"
                anteproyectoId={modificacionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Planos Aprobados Anteriores <span className="text-red-500">*</span>
                  </h4>
                </div>
                <div className="text-xs text-gray-500">
                  <LuInfo className="inline w-4 h-4 mr-1" />
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={[]}
                onChange={(files) => onInputChange('planos_aprobados_anteriores', files)}
                accept=".pdf,.dwg"
                multiple
                onUpload={onFileUpload}
                documentKey="planos_aprobados_anteriores"
                anteproyectoId={modificacionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Formulario Único (FUE) Anterior
                  </h4>
                </div>
                <div className="text-xs text-gray-500">
                  <LuInfo className="inline w-4 h-4 mr-1" />
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={[]}
                onChange={(files) => onInputChange('formulario_unico_anterior', files)}
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey="formulario_unico_anterior"
                anteproyectoId={modificacionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
