import { FileUpload } from '@/components/ui';
import type { HabilitacionUrbanaFormData, UploadedDocument } from '@/types/habilitacionUrbana.types';

interface StepDocumentacionTecnicaProps {
  formData: HabilitacionUrbanaFormData;
  habilitacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof HabilitacionUrbanaFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepDocumentacionTecnica({
  formData,
  habilitacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepDocumentacionTecnicaProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Elaboración de Documentación Técnica (FSR)
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Cargue los documentos a medida que se elaboran o gestionan
        </p>
        
        <div className="space-y-6">
          {/* Documentos Técnicos y Planos */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos Técnicos y Planos
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Levantamiento Topográfico <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.levantamiento_topografico || []}
                  onChange={(files) => onInputChange('levantamiento_topografico', files)}
                  accept=".pdf,.dwg"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="levantamiento_topografico"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estudio de Mecánica de Suelos <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.estudio_mecanica_suelos || []}
                  onChange={(files) => onInputChange('estudio_mecanica_suelos', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="estudio_mecanica_suelos"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planos Técnicos del Proyecto <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  placeholder="Seleccione archivos"
                  value={formData.planos_tecnicos_proyecto || []}
                  onChange={(files) => onInputChange('planos_tecnicos_proyecto', files)}
                  accept=".pdf,.dwg"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="planos_tecnicos_proyecto"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formulario Único (FUHU) <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.formulario_unico_fuhu || []}
                  onChange={(files) => onInputChange('formulario_unico_fuhu', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="formulario_unico_fuhu"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>
            </div>
          </div>

          {/* Certificados y Factibilidades */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Certificados y Factibilidades
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificado de Zonificación y Vías <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.certificado_zonificacion_vias || []}
                  onChange={(files) => onInputChange('certificado_zonificacion_vias', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="certificado_zonificacion_vias"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Factibilidad de Servicios Eléctricos <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.factibilidad_servicios_electricos || []}
                  onChange={(files) => onInputChange('factibilidad_servicios_electricos', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="factibilidad_servicios_electricos"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Factibilidad de Agua y Desagüe <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.factibilidad_agua_desague || []}
                  onChange={(files) => onInputChange('factibilidad_agua_desague', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="factibilidad_agua_desague"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>
            </div>
          </div>

          {/* Estudios y Permisos Especiales */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Estudios y Permisos Especiales
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SIRA (Cultura)
                </label>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.sira_cultura || []}
                  onChange={(files) => onInputChange('sira_cultura', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="sira_cultura"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estudio de Impacto Ambiental
                </label>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.estudio_impacto_ambiental || []}
                  onChange={(files) => onInputChange('estudio_impacto_ambiental', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="estudio_impacto_ambiental"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estudio de Impacto Vial
                </label>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.estudio_impacto_vial || []}
                  onChange={(files) => onInputChange('estudio_impacto_vial', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="estudio_impacto_vial"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permisos de ANA, MTC, etc.
                </label>
                <FileUpload
                  placeholder="Seleccione archivos"
                  value={formData.permisos_ana_mtc || []}
                  onChange={(files) => onInputChange('permisos_ana_mtc', files)}
                  accept=".pdf"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="permisos_ana_mtc"
                  anteproyectoId={habilitacionId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
