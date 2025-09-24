import { Select, Switch, FileUpload, Textarea } from '@/components/ui';
import type { AmpliacionFormData, UploadedDocument } from '@/types/ampliacion.types';

interface StepDocumentacionProps {
  formData: AmpliacionFormData;
  errors: Record<string, string>;
  ampliacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof AmpliacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepDocumentacion({
  formData,
  errors,
  ampliacionId,
  onInputChange,
  onFileUpload,
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
          documentKey="fue"
          anteproyectoId={ampliacionId}
          uploadedFiles={formData.fue}
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
            uploadedFiles={formData.arquitectura_intervencion}
            onChange={(files) => onInputChange('arquitectura_intervencion', files)}
            accept=".pdf,.dwg,.dxf"
            required
            onUpload={onFileUpload}
            documentKey="arquitectura_intervencion"
            anteproyectoId={ampliacionId}
            error={errors.arquitectura_intervencion}
          />

          <FileUpload
            label="Planos Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.arquitectura_resultante}
            onChange={(files) => onInputChange('arquitectura_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            required
            onUpload={onFileUpload}
            documentKey="arquitectura_resultante"
            anteproyectoId={ampliacionId}
            error={errors.arquitectura_resultante}
          />

          <FileUpload
            label="Memoria Descriptiva"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.arquitectura_memoria}
            onChange={(files) => onInputChange('arquitectura_memoria', files)}
            accept=".pdf,.doc,.docx"
            required
            onUpload={onFileUpload}
            documentKey="arquitectura_memoria"
            anteproyectoId={ampliacionId}
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
            uploadedFiles={formData.estructuras_intervencion}
            onChange={(files) => onInputChange('estructuras_intervencion', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="estructuras_intervencion"
            anteproyectoId={ampliacionId}
          />

          <FileUpload
            label="Planos Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.estructuras_resultante}
            onChange={(files) => onInputChange('estructuras_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="estructuras_resultante"
            anteproyectoId={ampliacionId}
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
            uploadedFiles={formData.sanitarias_intervencion}
            onChange={(files) => onInputChange('sanitarias_intervencion', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="sanitarias_intervencion"
            anteproyectoId={ampliacionId}
          />

          <FileUpload
            label="Planos Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.sanitarias_resultante}
            onChange={(files) => onInputChange('sanitarias_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="sanitarias_resultante"
            anteproyectoId={ampliacionId}
          />

          <FileUpload
            label="Documento de Sedapal (si aplica)"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.sanitarias_sedapal}
            onChange={(files) => onInputChange('sanitarias_sedapal', files)}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="sanitarias_sedapal"
            anteproyectoId={ampliacionId}
          />
        </div>
      </div>

      {/* Eléctricas, Mecánicas y Gas */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Instalaciones Eléctricas, Mecánicas y Gas
        </h4>
        <div className="space-y-6">
          <FileUpload
            label="Planos Eléctricos Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.electricas_resultante}
            onChange={(files) => onInputChange('electricas_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="electricas_resultante"
            anteproyectoId={ampliacionId}
          />

          <FileUpload
            label="Doc. Luz del Sur/Enel (si aplica)"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.electricas_luz_del_sur}
            onChange={(files) => onInputChange('electricas_luz_del_sur', files)}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="electricas_luz_del_sur"
            anteproyectoId={ampliacionId}
          />

          <FileUpload
            label="Ficha Técnica Mecánicas (ascensor, etc.)"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.mecanicas_ficha_tecnica}
            onChange={(files) => onInputChange('mecanicas_ficha_tecnica', files)}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="mecanicas_ficha_tecnica"
            anteproyectoId={ampliacionId}
          />

          <FileUpload
            label="Planos de Gas Resultantes"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.gas_resultante}
            onChange={(files) => onInputChange('gas_resultante', files)}
            accept=".pdf,.dwg,.dxf"
            onUpload={onFileUpload}
            documentKey="gas_resultante"
            anteproyectoId={ampliacionId}
          />

          <FileUpload
            label="Doc. Factibilidad Cálidda (si aplica)"
            placeholder="Seleccione archivo"
            uploadedFiles={formData.gas_calidda}
            onChange={(files) => onInputChange('gas_calidda', files)}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="gas_calidda"
            anteproyectoId={ampliacionId}
          />
        </div>
      </div>

      {/* Casos Especiales - Condominios */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Casos Especiales (Condominios)
        </h4>
        
        <div className="space-y-6">
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ¿Proyecto sujeto a Propiedad Horizontal / Condominio?
                </h5>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Indique si el proyecto requiere autorización de condóminos
                </p>
              </div>
              <Switch
                isSelected={formData.es_condominio}
                onValueChange={(checked) => onInputChange('es_condominio', checked)}
              />
            </div>
          </div>

          {formData.es_condominio && (
            <div className="space-y-6">
              <Select
                label="¿Cuenta con Junta de Propietarios?"
                placeholder="Seleccione una opción"
                options={[
                  { value: 'no', label: 'No' },
                  { value: 'si', label: 'Sí' },
                ]}
                selectedKeys={formData.tiene_junta ? [formData.tiene_junta] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as 'si' | 'no';
                  onInputChange('tiene_junta', value || 'no');
                }}
                error={errors.tiene_junta}
              />

              <FileUpload
                label="Cargar Autorización Correspondiente"
                placeholder="Seleccione archivo"
                uploadedFiles={formData.autorizacion_condominio}
                onChange={(files) => onInputChange('autorizacion_condominio', files)}
                accept=".pdf,.doc,.docx"
                required
                onUpload={onFileUpload}
                documentKey="autorizacion_condominio"
                anteproyectoId={ampliacionId}
                error={errors.autorizacion_condominio}
              />

              <Textarea
                label="Observaciones sobre Condóminos"
                placeholder="Describir particularidades del caso, ej: terreno compartido sin subdivisión."
                value={formData.observaciones_condominio}
                onChange={(e) => onInputChange('observaciones_condominio', e.target.value)}
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
