import { LuTriangle } from 'react-icons/lu';
import { FileUpload, Switch, Textarea, Input } from '@/components/ui';
import type { DemolicionFormData, UploadedDocument } from '@/types/demolicion.types';

interface StepDocumentacionProps {
  formData: DemolicionFormData;
  demolicionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof DemolicionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepDocumentacion({
  formData,
  demolicionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepDocumentacionProps) {
  return (
    <div className="space-y-8">
      {/* Paso 2.1: Documentación del Administrado */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2.1: Documentación Proporcionada por el Administrado
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta los documentos necesarios proporcionados por el administrado
        </p>
        
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Partida Registral del Terreno <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir Partida Registral"
              value={formData.partida_registral || []}
              onChange={(files) => onInputChange('partida_registral', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="partida_registral"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  FUE (Formulario Único de Edificación) <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir archivo FUE"
              value={formData.fue || []}
              onChange={(files) => onInputChange('fue', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="fue"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Documentos de Antecedentes
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir documentos de antecedentes"
              value={formData.documentos_antecedentes || []}
              onChange={(files) => onInputChange('documentos_antecedentes', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="documentos_antecedentes"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ¿Predio en Zona de Reglamentación Especial?
                </h4>
              </div>
              <Switch
                isSelected={formData.es_zona_reglamentacion_especial}
                onValueChange={(value: boolean) => onInputChange('es_zona_reglamentacion_especial', value)}
              />
            </div>
            
            {formData.es_zona_reglamentacion_especial && (
              <div className="mt-4 pt-4 border-t space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Licencia de Obra Nueva / Proyecto
                      </h4>
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Subir Licencia"
                    value={formData.licencia_obra_nueva || []}
                    onChange={(files) => onInputChange('licencia_obra_nueva', files)}
                    accept=".pdf"
                    multiple
                    onUpload={onFileUpload}
                    documentKey="licencia_obra_nueva"
                    anteproyectoId={demolicionId}
                    uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios Adicionales
                  </label>
                  <Textarea
                    value={formData.comentarios_adicionales}
                    onChange={(e) => onInputChange('comentarios_adicionales', e.target.value)}
                    rows={3}
                    placeholder="Ingrese comentarios adicionales..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paso 2.2: Documentación FSR */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2.2: Documentación Elaborada por FSR
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta los documentos técnicos elaborados por FSR
        </p>
        
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria Descriptiva <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir Memoria"
              value={formData.memoria_descriptiva || []}
              onChange={(files) => onInputChange('memoria_descriptiva', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="memoria_descriptiva"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Ubicación <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir Plano"
              value={formData.plano_ubicacion || []}
              onChange={(files) => onInputChange('plano_ubicacion', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_ubicacion"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Arquitectura <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir Plano"
              value={formData.plano_arquitectura || []}
              onChange={(files) => onInputChange('plano_arquitectura', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_arquitectura"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Cerco <span className="text-red-500">*</span>
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir Plano"
              value={formData.plano_cerco || []}
              onChange={(files) => onInputChange('plano_cerco', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_cerco"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Sostenimiento (Opcional)
                </h4>
              </div>
            </div>
            <FileUpload
              placeholder="Subir Plano"
              value={formData.plano_sostenimiento || []}
              onChange={(files) => onInputChange('plano_sostenimiento', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="plano_sostenimiento"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>
        </div>
      </div>

      {/* Paso 2.3: Panel Fotográfico */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2.3: Panel Fotográfico (Opcional)
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta fotografías y videos del predio
        </p>
        
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Carga de Fotografías
                </h4>
              </div>
            </div>
            <FileUpload
              placeholder="Subir fotografías"
              value={formData.fotografias || []}
              onChange={(files) => onInputChange('fotografias', files)}
              accept="image/*"
              multiple
              onUpload={onFileUpload}
              documentKey="fotografias"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link de Video
            </label>
            <Input
              type="url"
              value={formData.link_video}
              onChange={(e) => onInputChange('link_video', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
