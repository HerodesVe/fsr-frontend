import { Input, FileUpload } from '@/components/ui';
import type { LicenciaFuncionamientoFormData, UploadedDocument } from '@/types/licenciaFuncionamiento.types';

interface StepEmisionEntregaProps {
  formData: LicenciaFuncionamientoFormData;
  licenciaId: string;
  uploadedDocuments: UploadedDocument[];
  errors: Record<string, string>;
  onInputChange: (field: keyof LicenciaFuncionamientoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepEmisionEntrega({
  formData,
  licenciaId,
  uploadedDocuments,
  errors,
  onInputChange,
  onFileUpload,
}: StepEmisionEntregaProps) {
  const todosDocumentosCompletos = 
    formData.certificado_itse?.length > 0 &&
    formData.licencia_funcionamiento?.length > 0 &&
    formData.acta_entrega_firmada?.length > 0 &&
    formData.fecha_entrega_cliente;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 8: Emisión y Entrega de Certificados
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Etapa final del proceso. Adjunte los documentos finales emitidos por la municipalidad y el acta de conformidad del cliente.
        </p>
        
        <div className="space-y-6">
          {/* Documentos finales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Certificado ITSE <span className="text-red-500">*</span>
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Certificado de Inspección Técnica de Seguridad en Edificaciones
                  </p>
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={formData.certificado_itse || []}
                onChange={(files) => onInputChange('certificado_itse', files)}
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey="certificado_itse"
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
                    Licencia de Funcionamiento <span className="text-red-500">*</span>
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Licencia municipal de funcionamiento del establecimiento
                  </p>
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={formData.licencia_funcionamiento || []}
                onChange={(files) => onInputChange('licencia_funcionamiento', files)}
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey="licencia_funcionamiento"
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
                    Acta de Entrega Firmada <span className="text-red-500">*</span>
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Documento de conformidad firmado por el cliente
                  </p>
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={formData.acta_entrega_firmada || []}
                onChange={(files) => onInputChange('acta_entrega_firmada', files)}
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey="acta_entrega_firmada"
                anteproyectoId={licenciaId}
                uploadedFiles={uploadedDocuments.map(doc => ({
                  key: doc.key || '',
                  name: doc.name,
                  file_id: doc.id
                }))}
              />
            </div>
          </div>

          {/* Fecha de entrega */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div>
              <Input
                label="Fecha de Entrega al Cliente"
                type="date"
                value={formData.fecha_entrega_cliente}
                onChange={(e) => onInputChange('fecha_entrega_cliente', e.target.value)}
                error={errors.fecha_entrega_cliente}
              />
            </div>
          </div>

          {/* Estado del servicio completado */}
          {todosDocumentosCompletos && (
            <div className="bg-green-50 text-green-800 p-6 rounded-lg border border-green-200 text-center">
              <h4 className="text-lg font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                🎉 ¡Servicio Completado Exitosamente!
              </h4>
              <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Todos los documentos han sido entregados y el proceso de licencia de funcionamiento ha sido completado satisfactoriamente.
              </p>
            </div>
          )}

          {/* Resumen de entrega */}
          {(formData.fecha_entrega_cliente || formData.certificado_itse?.length > 0) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Resumen de Entrega
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {formData.fecha_entrega_cliente && (
                  <div>
                    <span className="font-medium text-gray-700">Fecha de Entrega:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(formData.fecha_entrega_cliente).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
                {formData.giro_negocio && (
                  <div>
                    <span className="font-medium text-gray-700">Giro del Negocio:</span>
                    <span className="ml-2 text-gray-600">{formData.giro_negocio}</span>
                  </div>
                )}
                {formData.direccion_local && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Dirección:</span>
                    <span className="ml-2 text-gray-600">{formData.direccion_local}</span>
                  </div>
                )}
              </div>
              
              {/* Estado de documentos */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2">Estado de Documentos:</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${formData.certificado_itse?.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{formData.certificado_itse?.length > 0 ? '✅' : '⏳'}</span>
                    <span>Certificado ITSE</span>
                  </div>
                  <div className={`flex items-center gap-1 ${formData.licencia_funcionamiento?.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{formData.licencia_funcionamiento?.length > 0 ? '✅' : '⏳'}</span>
                    <span>Licencia de Funcionamiento</span>
                  </div>
                  <div className={`flex items-center gap-1 ${formData.acta_entrega_firmada?.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{formData.acta_entrega_firmada?.length > 0 ? '✅' : '⏳'}</span>
                    <span>Acta de Entrega</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
