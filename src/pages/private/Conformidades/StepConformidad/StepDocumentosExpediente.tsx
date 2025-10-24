import { FileUpload } from '@/components/ui';
import type { StepProps } from '@/types/conformidad.types';

export default function StepDocumentosExpediente({
  formData,
  errors,
  uploadedDocuments,
  conformidadId,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepProps) {

  // Solo mostrar para modalidades con variaciones o casco habitable
  if (formData.modalidad === 'sin_variaciones') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Documentos del Expediente
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                Los documentos del expediente no son requeridos para la modalidad "Sin Variaciones".
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos del Expediente (Elaboración FSR)
        </h2>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Cargar todos los documentos técnicos elaborados por FSR para el expediente de conformidad.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* FUE de Conformidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            FUE de Conformidad <span className="text-red-500">*</span>
          </label>
          <FileUpload
            placeholder="Subir FUE de Conformidad"
            value={formData.fue_conformidad || []}
            onChange={(files) => onInputChange('fue_conformidad', files)}
            accept=".pdf,.doc,.docx"
            multiple
            onUpload={onFileUpload}
            documentKey="documentos_expediente.fue_conformidad"
            anteproyectoId={conformidadId}
            uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onDownload={onDownloadDocument}
          />
          {errors?.fue_conformidad && (
            <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              {errors.fue_conformidad}
            </p>
          )}
        </div>

        {/* Planos de Conformidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Planos de Conformidad <span className="text-red-500">*</span>
          </label>
          <FileUpload
            placeholder="Subir Planos de Conformidad"
            value={formData.planos_conformidad || []}
            onChange={(files) => onInputChange('planos_conformidad', files)}
            accept=".pdf,.dwg,.jpg,.jpeg,.png"
            multiple
            onUpload={onFileUpload}
            documentKey="documentos_expediente.planos_conformidad"
            anteproyectoId={conformidadId}
            uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onDownload={onDownloadDocument}
          />
          {errors?.planos_conformidad && (
            <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              {errors.planos_conformidad}
            </p>
          )}
        </div>

        {/* Memoria Descriptiva */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Memoria Descriptiva
          </label>
          <FileUpload
            placeholder="Subir Memoria Descriptiva"
            value={formData.memoria_descriptiva || []}
            onChange={(files) => onInputChange('memoria_descriptiva', files)}
            accept=".pdf,.doc,.docx"
            multiple
            onUpload={onFileUpload}
            documentKey="documentos_expediente.memoria_descriptiva"
            anteproyectoId={conformidadId}
            uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onDownload={onDownloadDocument}
          />
        </div>

        {/* Cuaderno de Obra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Cuaderno de Obra
          </label>
          <FileUpload
            placeholder="Subir Cuaderno de Obra"
            value={formData.cuaderno_obra || []}
            onChange={(files) => onInputChange('cuaderno_obra', files)}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
            onUpload={onFileUpload}
            documentKey="documentos_expediente.cuaderno_obra"
            anteproyectoId={conformidadId}
            uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onDownload={onDownloadDocument}
          />
        </div>

        {/* Protocolos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Protocolos
          </label>
          <FileUpload
            placeholder="Subir Protocolos"
            value={formData.protocolos || []}
            onChange={(files) => onInputChange('protocolos', files)}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            multiple
            onUpload={onFileUpload}
            documentKey="documentos_expediente.protocolos"
            anteproyectoId={conformidadId}
            uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onDownload={onDownloadDocument}
          />
        </div>

        {/* Declaraciones Juradas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Declaraciones Juradas
          </label>
          <FileUpload
            placeholder="Subir Declaraciones Juradas"
            value={formData.declaraciones_juradas || []}
            onChange={(files) => onInputChange('declaraciones_juradas', files)}
            accept=".pdf,.doc,.docx"
            multiple
            onUpload={onFileUpload}
            documentKey="documentos_expediente.declaraciones_juradas"
            anteproyectoId={conformidadId}
            uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
            onDownload={onDownloadDocument}
          />
        </div>
      </div>

      {/* Sustentos Técnicos - Ocupa toda la fila */}
      <div className="col-span-full">
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Sustentos Técnicos, Legales, Fichas, Fotos y otros
        </label>
        <FileUpload
          placeholder="Subir Sustentos Técnicos"
          value={formData.sustentos_tecnicos || []}
          onChange={(files) => onInputChange('sustentos_tecnicos', files)}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.dwg"
          multiple
          onUpload={onFileUpload}
          documentKey="documentos_expediente.sustentos_tecnicos"
          anteproyectoId={conformidadId}
          uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
          onDownload={onDownloadDocument}
        />
        <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          Cargar todos los documentos de sustento adicionales necesarios para el expediente
        </p>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-amber-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos Técnicos
            </h4>
            <p className="text-sm text-amber-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Asegúrese de que todos los documentos técnicos estén completos y firmados por los profesionales responsables.
              Los campos marcados con asterisco (*) son obligatorios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
