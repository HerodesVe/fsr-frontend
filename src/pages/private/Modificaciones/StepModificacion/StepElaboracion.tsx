import { LuInfo } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { ModificacionFormData, UploadedDocument } from '@/types/modificacion.types';

interface StepElaboracionProps {
  formData: ModificacionFormData;
  modificacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ModificacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepElaboracion({
  modificacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepElaboracionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Elaboración del Nuevo Proyecto
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Carga los nuevos planos y documentos que conforman la modificación
        </p>
        
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Arquitectura <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('planos_arquitectura', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_arquitectura"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Estructuras
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('planos_estructuras', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_estructuras"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Inst. Sanitarias
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('planos_sanitarias', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_sanitarias"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Inst. Eléctricas
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('planos_electricas', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_electricas"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria Descriptiva <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('memoria_descriptiva', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="memoria_descriptiva"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Documentación Adicional
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('documentacion_adicional', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="documentacion_adicional"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
