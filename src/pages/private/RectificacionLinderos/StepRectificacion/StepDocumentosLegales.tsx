import { FileUpload } from '@/components/ui';
import type { RectificacionLinderosFormData, UploadedDocument } from '@/types/rectificacionLinderos.types';

interface StepDocumentosLegalesProps {
  formData: RectificacionLinderosFormData;
  rectificacionId: string;
  uploadedDocuments: UploadedDocument[];
  errors: Record<string, string>;
  onInputChange: (field: keyof RectificacionLinderosFormData, value: any) => void;
  onFileUpload: (file: File) => Promise<any>;
}

export default function StepDocumentosLegales({
  formData,
  rectificacionId,
  uploadedDocuments,
  errors,
  onInputChange,
  onFileUpload,
}: StepDocumentosLegalesProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 3: Carga de Documentos Legales y Técnicos
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Suba los documentos proporcionados por el cliente. Son indispensables para elaborar el plano de rectificación.
        </p>
        
        <div className="space-y-6">
          {/* Título de Propiedad */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Título de Propiedad o Ficha Registral <span className="text-red-500">*</span>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Documento que acredita la propiedad del inmueble
              </p>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.titulo_propiedad || []}
              onChange={(files) => onInputChange('titulo_propiedad', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="titulo_propiedad"
              anteproyectoId={rectificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
              error={errors.titulo_propiedad} 
            />
          </div>

          {/* Planos Anteriores */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Planos de Ubicación y Perimétricos Anteriores
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Planos existentes del inmueble (si los hubiera)
              </p>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.planos_anteriores || []}
              onChange={(files) => onInputChange('planos_anteriores', files)}
              accept=".pdf,.dwg,.jpg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="planos_anteriores"
              anteproyectoId={rectificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
            />
          </div>

          {/* Memoria Descriptiva Original */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Memoria Descriptiva Original
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Memoria descriptiva del proyecto original (si existe)
              </p>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.memoria_original || []}
              onChange={(files) => onInputChange('memoria_original', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="memoria_original"
              anteproyectoId={rectificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
            />
          </div>

          {/* Documento de Identidad */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Documento de Identidad del Propietario(s) <span className="text-red-500">*</span>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                DNI, CE o pasaporte del propietario o propietarios
              </p>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.documento_identidad || []}
              onChange={(files) => onInputChange('documento_identidad', files)}
              accept=".pdf,.jpg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="documento_identidad"
              anteproyectoId={rectificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
              error={errors.documento_identidad}
            />
          </div>

          {/* Pago Predial */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Comprobante de Pago de Impuesto Predial <span className="text-red-500">*</span>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Comprobante del último año pagado del impuesto predial
              </p>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.pago_predial || []}
              onChange={(files) => onInputChange('pago_predial', files)}
              accept=".pdf,.jpg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="pago_predial"
              anteproyectoId={rectificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({
                key: doc.key || '',
                name: doc.name,
                file_id: doc.id
              }))}
              error={errors.pago_predial}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Documentos Requeridos
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Los documentos deben estar vigentes y legibles</li>
            <li>• Se aceptan formatos PDF, JPG, PNG y DWG</li>
            <li>• Tamaño máximo por archivo: 10MB</li>
            <li>• Los documentos marcados con (*) son obligatorios</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
