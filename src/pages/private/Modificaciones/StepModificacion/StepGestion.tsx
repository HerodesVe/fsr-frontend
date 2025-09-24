import { LuInfo, LuBriefcase, LuShield, LuAward } from 'react-icons/lu';
import { Input, FileUpload } from '@/components/ui';
import type { ModificacionFormData, UploadedDocument } from '@/types/modificacion.types';

interface StepGestionProps {
  formData: ModificacionFormData;
  modificacionId: string;
  uploadedDocuments: UploadedDocument[];
  errors: Record<string, string>;
  onInputChange: (field: keyof ModificacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepGestion({
  formData,
  modificacionId,
  uploadedDocuments,
  errors,
  onInputChange,
  onFileUpload,
}: StepGestionProps) {
  return (
    <div className="space-y-8">
      {/* Ingreso y Seguimiento */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-teal-100 text-teal-600 p-3 rounded-lg">
            <LuBriefcase size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ingreso y Seguimiento
            </h3>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Registra la presentación del expediente y las revisiones de la entidad
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha de Ingreso a Entidad"
              type="date"
              value={formData.fecha_ingreso_entidad}
              onChange={(e) => onInputChange('fecha_ingreso_entidad', e.target.value)}
              error={errors.fecha_ingreso_entidad}
              required
            />
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Cargo de Ingreso de Expediente <span className="text-red-500">*</span>
                  </h4>
                </div>
                <div className="text-xs text-gray-500">
                  <LuInfo className="inline w-4 h-4 mr-1" />
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={[]}
                onChange={(files) => onInputChange('cargo_ingreso_expediente', files[0] || null)}
                accept=".pdf"
                multiple={false}
                onUpload={onFileUpload}
                documentKey="cargo_ingreso_expediente"
                anteproyectoId={modificacionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>
          </div>

          <hr className="my-4" />
          
          <h4 className="font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Seguimiento de Revisiones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Acta de Observaciones
                  </h4>
                </div>
                <div className="text-xs text-gray-500">
                  <LuInfo className="inline w-4 h-4 mr-1" />
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={[]}
                onChange={(files) => onInputChange('acta_observaciones', files[0] || null)}
                accept=".pdf"
                multiple={false}
                onUpload={onFileUpload}
                documentKey="acta_observaciones"
                anteproyectoId={modificacionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Acta de Conformidad
                  </h4>
                </div>
                <div className="text-xs text-gray-500">
                  <LuInfo className="inline w-4 h-4 mr-1" />
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={[]}
                onChange={(files) => onInputChange('acta_conformidad', files[0] || null)}
                accept=".pdf"
                multiple={false}
                onUpload={onFileUpload}
                documentKey="acta_conformidad"
                anteproyectoId={modificacionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Acta de Reconsideración
                  </h4>
                </div>
                <div className="text-xs text-gray-500">
                  <LuInfo className="inline w-4 h-4 mr-1" />
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivo"
                value={[]}
                onChange={(files) => onInputChange('acta_reconsideracion', files[0] || null)}
                accept=".pdf"
                multiple={false}
                onUpload={onFileUpload}
                documentKey="acta_reconsideracion"
                anteproyectoId={modificacionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subsanación de Observaciones */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-teal-100 text-teal-600 p-3 rounded-lg">
            <LuShield size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Subsanación de Observaciones
            </h3>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Carga los documentos corregidos en caso de haber recibido observaciones
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Anexo de Subsanación
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('anexo_subsanacion', files[0] || null)}
              accept=".pdf"
              multiple={false}
              onUpload={onFileUpload}
              documentKey="anexo_subsanacion"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos Corregidos
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('planos_corregidos', files[0] || null)}
              accept=".pdf,.dwg"
              multiple={false}
              onUpload={onFileUpload}
              documentKey="planos_corregidos"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>
        </div>
      </div>

      {/* Finalización y Entrega */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-teal-100 text-teal-600 p-3 rounded-lg">
            <LuAward size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Finalización y Entrega
            </h3>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Completa el flujo con la licencia final y el cargo de entrega al cliente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Licencia de Modificación Emitida <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('licencia_modificacion_emitida', files[0] || null)}
              accept=".pdf"
              multiple={false}
              onUpload={onFileUpload}
              documentKey="licencia_modificacion_emitida"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cargo de Entrega al Administrado <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('cargo_entrega_administrado', files[0] || null)}
              accept=".pdf"
              multiple={false}
              onUpload={onFileUpload}
              documentKey="cargo_entrega_administrado"
              anteproyectoId={modificacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
