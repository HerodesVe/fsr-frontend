import { FileUpload, DateInput, Textarea } from '@/components/ui';
import type { GestionAnexoFormData, UploadedDocument } from '@/types/gestionAnexo.types';

interface StepDocumentacionProps {
  formData: GestionAnexoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof GestionAnexoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepDocumentacion({
  formData,
  errors,
  gestionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument,
}: StepDocumentacionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2: Documentación del Administrado
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Recopilación de todos los documentos y datos proporcionados por el cliente.
        </p>

        <div className="space-y-6">
          {/* Documentos principales en vertical */}
          <div className="space-y-6">
            {/* Anexo H (Formato) */}
            <FileUpload
              label="Anexo H (Formato)"
              accept=".pdf,.doc,.docx"
              onChange={(files) => onInputChange('anexo_h_formato', files)}
              required
              onUpload={onFileUpload}
              documentKey="documentacion_anexo.anexo_h_formato"
              anteproyectoId={gestionId}
              uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_anexo.anexo_h_formato').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
              error={errors.anexo_h_formato}
            />

            {/* Contrato Supervisor o Convenio de Visitas */}
            <FileUpload
              label="Contrato Supervisor o Convenio de Visitas"
              accept=".pdf,.doc,.docx"
              onChange={(files) => onInputChange('contrato_supervisor', files)}
              required
              onUpload={onFileUpload}
              documentKey="documentacion_anexo.contrato_supervisor"
              anteproyectoId={gestionId}
              uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_anexo.contrato_supervisor').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
              error={errors.contrato_supervisor}
            />

            {/* Póliza CAR */}
            <FileUpload
              label="Póliza CAR"
              accept=".pdf,.doc,.docx"
              onChange={(files) => onInputChange('poliza_car', files)}
              required
              onUpload={onFileUpload}
              documentKey="documentacion_anexo.poliza_car"
              anteproyectoId={gestionId}
              uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_anexo.poliza_car').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
              error={errors.poliza_car}
            />

            {/* Resolución de Licencia de Obra */}
            <FileUpload
              label="Resolución de Licencia de Obra"
              accept=".pdf,.doc,.docx"
              onChange={(files) => onInputChange('resolucion_licencia_obra', files)}
              required
              onUpload={onFileUpload}
              documentKey="documentacion_anexo.resolucion_licencia_obra"
              anteproyectoId={gestionId}
              uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_anexo.resolucion_licencia_obra').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
              error={errors.resolucion_licencia_obra}
            />

            {/* Cronograma de Visitas */}
            <FileUpload
              label="Cronograma de Visitas"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(files) => onInputChange('cronograma_visitas', files)}
              required
              onUpload={onFileUpload}
              documentKey="documentacion_anexo.cronograma_visitas"
              anteproyectoId={gestionId}
              uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_anexo.cronograma_visitas').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
              error={errors.cronograma_visitas}
            />

            {/* Cronograma de Obra */}
            <FileUpload
              label="Cronograma de Obra"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(files) => onInputChange('cronograma_obra', files)}
              required
              onUpload={onFileUpload}
              documentKey="documentacion_anexo.cronograma_obra"
              anteproyectoId={gestionId}
              uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_anexo.cronograma_obra').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
              error={errors.cronograma_obra}
            />

            {/* Otros Documentos (Opcional) */}
            <FileUpload
              label="Otros Documentos (Opcional)"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(files) => onInputChange('otros_documentos', files)}
              onUpload={onFileUpload}
              documentKey="documentacion_anexo.otros_documentos"
              anteproyectoId={gestionId}
              uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_anexo.otros_documentos').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
            />
          </div>

          {/* Fecha de Inicio de Ejecución de Obra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <DateInput
                label="Fecha de Inicio de Ejecución de Obra"
                value={formData.fecha_inicio_ejecucion || ''}
                onChange={(value) => onInputChange('fecha_inicio_ejecucion', value)}
                placeholder="dd/mm/aaaa"
                required
                error={errors.fecha_inicio_ejecucion}
              />
            </div>
          </div>

          {/* Comentarios */}
          <div>
            <Textarea
              label="Comentarios"
              placeholder="Añadir observaciones sobre el proceso..."
              value={formData.comentarios_documentacion || ''}
              onChange={(e) => onInputChange('comentarios_documentacion', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
