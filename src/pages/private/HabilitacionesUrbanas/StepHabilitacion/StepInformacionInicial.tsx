import { FileUpload, Input, Select, Textarea } from '@/components/ui';
import type { HabilitacionUrbanaFormData, UploadedDocument } from '@/types/habilitacionUrbana.types';

interface StepInformacionInicialProps {
  formData: HabilitacionUrbanaFormData;
  habilitacionId: string;
  uploadedDocuments: UploadedDocument[];
  errors: Record<string, string>;
  onInputChange: (field: keyof HabilitacionUrbanaFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepInformacionInicial({
  formData,
  habilitacionId,
  uploadedDocuments,
  errors,
  onInputChange,
  onFileUpload,
}: StepInformacionInicialProps) {
  const tipoHabilitacionOptions = [
    { value: 'habilitacion_urbana_nueva', label: 'Habilitación Urbana Nueva' },
    { value: 'regularizacion_habilitacion_urbana', label: 'Regularización de Habilitación Urbana' },
    { value: 'habilitacion_urbana_oficio', label: 'Habilitación Urbana de Oficio' },
    { value: 'habilitacion_urbana_construccion_simultanea', label: 'Habilitación Urbana con Construcción Simultánea' },
  ];

  const usoHabilitacionOptions = [
    { value: 'residencial', label: 'Residencial' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'otros_usos', label: 'Otros Usos' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Información Inicial y Clasificación
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Complete la información básica del proyecto de habilitación urbana
        </p>
        
        <div className="space-y-6">
          {/* Documentos Iniciales */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Documentos Iniciales <span className="text-red-500">*</span>
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ficha de Registros Públicos del terreno rústico <span className="text-red-500">*</span>
                  </label>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.ficha_registros_publicos || []}
                    onChange={(files) => onInputChange('ficha_registros_publicos', files)}
                    accept=".pdf"
                    multiple
                    onUpload={onFileUpload}
                    documentKey="ficha_registros_publicos"
                    anteproyectoId={habilitacionId}
                    uploadedFiles={uploadedDocuments}
                    error={errors.ficha_registros_publicos}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recibos de servicios existentes (Opcional)
                  </label>
                  <FileUpload
                    placeholder="Seleccione archivos"
                    value={formData.recibos_servicios || []}
                    onChange={(files) => onInputChange('recibos_servicios', files)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onUpload={onFileUpload}
                    documentKey="recibos_servicios"
                    anteproyectoId={habilitacionId}
                    uploadedFiles={uploadedDocuments}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clasificación del Proyecto */}
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Clasificación del Proyecto
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Tipo de Habilitación Urbana"
                  placeholder="Seleccione el tipo de habilitación"
                  options={tipoHabilitacionOptions}
                  selectedKeys={formData.tipo_habilitacion ? [formData.tipo_habilitacion] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    onInputChange('tipo_habilitacion', value);
                  }}
                  error={errors.tipo_habilitacion}
                  isRequired
                />
              </div>

              <div>
                <Select
                  label="Uso de la Habilitación Urbana"
                  placeholder="Seleccione el uso"
                  options={usoHabilitacionOptions}
                  selectedKeys={formData.uso_habilitacion ? [formData.uso_habilitacion] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    onInputChange('uso_habilitacion', value);
                  }}
                  error={errors.uso_habilitacion}
                  isRequired
                />
              </div>
            </div>

            <div>
              <Textarea
                label="Descripción del Proyecto"
                placeholder="Detallar características específicas del terreno y el proyecto..."
                value={formData.descripcion_proyecto}
                onChange={(e) => onInputChange('descripcion_proyecto', e.target.value)}
                rows={4}
                error={errors.descripcion_proyecto}
                isRequired
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
