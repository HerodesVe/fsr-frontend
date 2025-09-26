import { FileUpload } from '@/components/ui';
import type { LicenciaFuncionamientoFormData, UploadedDocument } from '@/types/licenciaFuncionamiento.types';

interface StepDocumentacionClienteProps {
  formData: LicenciaFuncionamientoFormData;
  licenciaId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof LicenciaFuncionamientoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepDocumentacionCliente({
  formData,
  licenciaId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepDocumentacionClienteProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 3: Recopilación y Carga de Documentación
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta los documentos necesarios proporcionados por el cliente
        </p>
        
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Vigencia de Poder <span className="text-red-500">*</span>
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documento que acredita la representación legal
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.vigencia_poder || []}
              onChange={(files) => onInputChange('vigencia_poder', files)}
              accept=".pdf,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="vigencia_poder"
              anteproyectoId={licenciaId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  HRPU (Hoja Resumen y Predio Urbano) <span className="text-red-500">*</span>
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documento municipal del predio
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.hrpu || []}
              onChange={(files) => onInputChange('hrpu', files)}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="hrpu"
              anteproyectoId={licenciaId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Declaratoria de Fábrica <span className="text-red-500">*</span>
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documento que declara la construcción del inmueble
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.declaratoria_fabrica || []}
              onChange={(files) => onInputChange('declaratoria_fabrica', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="declaratoria_fabrica"
              anteproyectoId={licenciaId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Certificado de Pozo a Tierra <span className="text-red-500">*</span>
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Certificado de instalación eléctrica segura
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.certificado_pozo_tierra || []}
              onChange={(files) => onInputChange('certificado_pozo_tierra', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="certificado_pozo_tierra"
              anteproyectoId={licenciaId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
