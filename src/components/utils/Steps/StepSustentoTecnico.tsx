import { useState } from 'react';
import { LuTriangle } from 'react-icons/lu';
import { FileUpload, Switch } from '@/components/ui';
import type { ProyectoFormData, UploadedDocument } from '@/types/proyecto.types';

interface StepSustentoTecnicoProps {
  formData: ProyectoFormData;
  proyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepSustentoTecnico({
  formData,
  proyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepSustentoTecnicoProps) {
  const [showOtherFiles, setShowOtherFiles] = useState(false);
  return (
    <div className="space-y-6">
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">⚖️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Sustento Técnico Legal
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentación de sustento técnico e informe vinculante
        </p>

        <div className="space-y-6">
          {/* Switch de Sustento Técnico Legal */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Sustento Técnico Legal
                </h4>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Indica si el proyecto requiere sustento técnico legal
                </p>
              </div>
              <Switch
                isSelected={formData.requiere_sustento_legal}
                onValueChange={(checked) => onInputChange('requiere_sustento_legal', checked)}
              />
            </div>

            {/* Documento de sustento técnico legal - Solo se muestra si el switch está activado */}
            {formData.requiere_sustento_legal && (
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Documento sustento técnico legal <span className="text-red-500">*</span>
                    </h5>
                  </div>
                  <div className="text-xs text-gray-500">
                    <LuTriangle className="inline w-4 h-4 mr-1" />
                  </div>
                </div>
                <FileUpload
                  placeholder="Seleccione archivo"
                  value={formData.documento_sustento_tecnico_legal || []}
                  onChange={(files) => onInputChange('documento_sustento_tecnico_legal', files)}
                  accept=".pdf,.doc,.docx"
                  multiple
                  onUpload={onFileUpload}
                  documentKey="documento_sustento_tecnico_legal"
                  anteproyectoId={proyectoId}
                  uploadedFiles={uploadedDocuments}
                />
              </div>
            )}
          </div>

          {/* Radio buttons para Informe Vinculante */}
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                ¿Se requiere Informe Vinculante?
              </h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="requiere_informe_vinculante"
                    value="true"
                    checked={formData.requiere_informe_vinculante === true}
                    onChange={() => onInputChange('requiere_informe_vinculante', true)}
                    className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Sí
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="requiere_informe_vinculante"
                    value="false"
                    checked={formData.requiere_informe_vinculante === false}
                    onChange={() => onInputChange('requiere_informe_vinculante', false)}
                    className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    No
                  </span>
                </label>
              </div>
            </div>

            {/* Documentos adicionales - Solo se muestran si requiere informe vinculante */}
            {formData.requiere_informe_vinculante && (
              <div className="space-y-6 mt-6">
                {/* Consulta al Ministerio */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Consulta al Ministerio <span className="text-red-500">*</span>
                      </h5>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.consulta_ministerio || []}
                    onChange={(files) => onInputChange('consulta_ministerio', files)}
                    accept=".pdf,.doc,.docx"
                    multiple
                    onUpload={onFileUpload}
                    documentKey="consulta_ministerio"
                    anteproyectoId={proyectoId}
                    uploadedFiles={uploadedDocuments}
                  />
                </div>

                {/* Cargo de presentación de consulta */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Cargo de presentación de consulta <span className="text-red-500">*</span>
                      </h5>
                    </div>
                    <div className="text-xs text-gray-500">
                      <LuTriangle className="inline w-4 h-4 mr-1" />
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.cargo_presentacion_consulta || []}
                    onChange={(files) => onInputChange('cargo_presentacion_consulta', files)}
                    accept=".pdf,.doc,.docx"
                    multiple
                    onUpload={onFileUpload}
                    documentKey="cargo_presentacion_consulta"
                    anteproyectoId={proyectoId}
                    uploadedFiles={uploadedDocuments}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Otros Archivos */}
          {showOtherFiles && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Otros Archivos
                  </h5>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Archivos adicionales relacionados con sustento técnico
                  </p>
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivos"
                value={formData.sustento_otros_archivos || []}
                onChange={(files) => onInputChange('sustento_otros_archivos', files)}
                accept="*"
                multiple
                onUpload={onFileUpload}
                documentKey="sustento_otros_archivos"
                anteproyectoId={proyectoId}
                uploadedFiles={uploadedDocuments}
              />
            </div>
          )}

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setShowOtherFiles(!showOtherFiles)}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {showOtherFiles ? '- Ocultar Otros Archivos' : '+ Agregar Otros Archivos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

