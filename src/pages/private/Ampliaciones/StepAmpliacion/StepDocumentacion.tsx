import { Select, Switch, FileUpload, Textarea } from '@/components/ui';
import type { AmpliacionFormData, UploadedDocument } from '@/types/ampliacion.types';

interface StepDocumentacionProps {
  formData: AmpliacionFormData;
  errors: Record<string, string>;
  ampliacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof AmpliacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepDocumentacion({
  formData,
  errors,
  ampliacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument,
}: StepDocumentacionProps) {
  return (
    <div className="space-y-8">
      {/* FUE */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentación Técnica del Proyecto
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunte todos los documentos técnicos requeridos para el proyecto
        </p>
        
        <FileUpload
          label="Formulario Único de Edificación (FUE)"
          placeholder="Seleccione archivo"
          onChange={(files) => onInputChange('fue', files)}
          accept=".pdf,.doc,.docx"
          required
          onUpload={onFileUpload}
          documentKey="documentacion_tecnica.fue"
          anteproyectoId={ampliacionId}
          uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.fue').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
          onDownload={onDownloadDocument}
          error={errors.fue}
        />
      </div>

      {/* Arquitectura */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Arquitectura
        </h4>
        <div className="space-y-6">
          <FileUpload
            label="Planos de Intervención"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.arquitectura_intervencion').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('arquitectura_intervencion', files)}
            accept=".pdf,.dwg,.dxf"
            required
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.arquitectura_intervencion"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
            error={errors.arquitectura_intervencion}
          />

          <FileUpload
            label="Planos Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.arquitectura_resultante').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('arquitectura_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            required
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.arquitectura_resultante"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
            error={errors.arquitectura_resultante}
          />

          <FileUpload
            label="Memoria Descriptiva"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.arquitectura_memoria').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('arquitectura_memoria', files)}
            accept=".pdf,.doc,.docx"
            required
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.arquitectura_memoria"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
            error={errors.arquitectura_memoria}
          />
        </div>
      </div>

      {/* Estructuras */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Estructuras
        </h4>
        <div className="space-y-6">
          <FileUpload
            label="Planos de Intervención"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.estructuras_intervencion').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('estructuras_intervencion', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.estructuras_intervencion"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />

          <FileUpload
            label="Planos Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.estructuras_resultante').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('estructuras_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.estructuras_resultante"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />
        </div>
      </div>

      {/* Sanitarias */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Instalaciones Sanitarias
        </h4>
        <div className="space-y-6">
          <FileUpload
            label="Planos de Intervención"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.sanitarias_intervencion').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('sanitarias_intervencion', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.sanitarias_intervencion"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />

          <FileUpload
            label="Planos Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.sanitarias_resultante').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('sanitarias_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.sanitarias_resultante"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />

          <FileUpload
            label="Documento de Sedapal (si aplica)"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.sanitarias_sedapal').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('sanitarias_sedapal', files)}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.sanitarias_sedapal"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />
        </div>
      </div>

      {/* Eléctricas, Mecánicas y Gas */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Otras Especialidades
        </h4>
        <div className="space-y-6">
          <FileUpload
            label="Planos Eléctricos Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.electricas_resultante').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('electricas_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.electricas_resultante"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />

          <FileUpload
            label="Doc. Luz del Sur/Enel (si aplica)"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.electricas_luz_del_sur').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('electricas_luz_del_sur', files)}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.electricas_luz_del_sur"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />

          <FileUpload
            label="Ficha Técnica Mecánicas (ascensor, etc.)"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.mecanicas_ficha_tecnica').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('mecanicas_ficha_tecnica', files)}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.mecanicas_ficha_tecnica"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />

          <FileUpload
            label="Planos de Gas Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.gas_resultante').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('gas_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.gas_resultante"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />

          <FileUpload
            label="Doc. Factibilidad Cálidda (si aplica)"
            placeholder="Seleccione archivo"
            uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.gas_calidda').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onChange={(files) => onInputChange('gas_calidda', files)}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="documentacion_tecnica.gas_calidda"
            anteproyectoId={ampliacionId}
            onDownload={onDownloadDocument}
          />
        </div>
      </div>

      {/* Casos Especiales - Condominios */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Condominios (Si aplica)
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Switch
              label="¿El predio pertenece a un condominio?"
              isSelected={formData.es_condominio}
              onValueChange={(checked) => onInputChange('es_condominio', checked)}
            />
          </div>

          {formData.es_condominio && (
            <>
              <Select
                label="¿Tiene junta de propietarios inscrita?"
                placeholder="Seleccione una opción"
                selectedKeys={formData.tiene_junta ? [formData.tiene_junta] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as 'si' | 'no' | 'en_tramite';
                  onInputChange('tiene_junta', value || 'no');
                }}
                options={[
                  { value: 'si', label: 'Sí' },
                  { value: 'no', label: 'No' },
                  { value: 'en_tramite', label: 'En trámite' },
                ]}
                required
                error={errors.tiene_junta}
              />

              <FileUpload
                label="Autorización de la Junta de Propietarios"
                placeholder="Seleccione archivo"
                uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'documentacion_tecnica.autorizacion_condominio').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onChange={(files) => onInputChange('autorizacion_condominio', files)}
                accept=".pdf,.doc,.docx"
                required
              onUpload={onFileUpload}
              documentKey="documentacion_tecnica.autorizacion_condominio"
              anteproyectoId={ampliacionId}
              onDownload={onDownloadDocument}
                error={errors.autorizacion_condominio}
              />

              <Textarea
                label="Observaciones sobre Condóminos"
                placeholder="Detalles adicionales sobre el condominio"
                value={formData.observaciones_condominio}
                onChange={(e) => onInputChange('observaciones_condominio', e.target.value)}
                rows={3}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
