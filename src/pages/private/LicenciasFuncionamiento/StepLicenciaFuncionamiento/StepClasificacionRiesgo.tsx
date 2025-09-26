import { Select, FileUpload } from '@/components/ui';
import type { LicenciaFuncionamientoFormData, UploadedDocument } from '@/types/licenciaFuncionamiento.types';

interface StepClasificacionRiesgoProps {
  formData: LicenciaFuncionamientoFormData;
  licenciaId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof LicenciaFuncionamientoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepClasificacionRiesgo({
  formData,
  licenciaId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepClasificacionRiesgoProps) {
  const nivelRiesgoOptions = [
    { value: 'Bajo', label: 'Bajo' },
    { value: 'Medio', label: 'Medio' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Muy Alto', label: 'Muy Alto' },
  ];

  const esRiesgoAltoOMuyAlto = formData.nivel_riesgo === 'Alto' || formData.nivel_riesgo === 'Muy Alto';
  const esRisgoBajoOMedio = formData.nivel_riesgo === 'Bajo' || formData.nivel_riesgo === 'Medio';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 5: Clasificación del Riesgo y Preparación del Expediente
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Determine el nivel de riesgo ITSE y prepare la documentación correspondiente
        </p>
        
        <div className="space-y-6">
          <div>
            <Select
              label="Nivel de Riesgo ITSE"
              placeholder="Seleccione un nivel"
              options={nivelRiesgoOptions}
              selectedKeys={formData.nivel_riesgo ? [formData.nivel_riesgo] : []}
              onSelectionChange={(keys) => {
                const nivel = Array.from(keys)[0] as string;
                onInputChange('nivel_riesgo', nivel);
              }}
            />
          </div>

          {/* Información para riesgo bajo y medio */}
          {esRisgoBajoOMedio && (
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 mt-0.5">ℹ️</div>
                <div>
                  <h4 className="font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Riesgo {formData.nivel_riesgo}
                  </h4>
                  <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Para riesgos bajos y medios, se deben llenar los formatos normativos (Anexos 1, 2, 3 y 4) como declaraciones juradas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expediente técnico para riesgo alto y muy alto */}
          {esRiesgoAltoOMuyAlto && (
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Carga de Expediente Técnico
              </h4>
              <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Para riesgos altos y muy altos, se requiere documentación técnica especializada
              </p>
              
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Planos de Arquitectura <span className="text-red-500">*</span>
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">
                        Planos arquitectónicos del establecimiento
                      </p>
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.planos_arquitectura || []}
                    onChange={(files) => onInputChange('planos_arquitectura', files)}
                    accept=".pdf,.dwg"
                    multiple
                    onUpload={onFileUpload}
                    documentKey="planos_arquitectura"
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
                      <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Planos de Seguridad <span className="text-red-500">*</span>
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">
                        Planos de evacuación y seguridad contra incendios
                      </p>
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.planos_seguridad || []}
                    onChange={(files) => onInputChange('planos_seguridad', files)}
                    accept=".pdf,.dwg"
                    multiple
                    onUpload={onFileUpload}
                    documentKey="planos_seguridad"
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
                      <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Planos Eléctricos <span className="text-red-500">*</span>
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">
                        Planos de instalaciones eléctricas
                      </p>
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.planos_electricos || []}
                    onChange={(files) => onInputChange('planos_electricos', files)}
                    accept=".pdf,.dwg"
                    multiple
                    onUpload={onFileUpload}
                    documentKey="planos_electricos"
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
                      <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Plan de Seguridad <span className="text-red-500">*</span>
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">
                        Plan de seguridad y evacuación del establecimiento
                      </p>
                    </div>
                  </div>
                  <FileUpload
                    placeholder="Seleccione archivo"
                    value={formData.plan_seguridad || []}
                    onChange={(files) => onInputChange('plan_seguridad', files)}
                    accept=".pdf,.doc,.docx"
                    multiple
                    onUpload={onFileUpload}
                    documentKey="plan_seguridad"
                    anteproyectoId={licenciaId}
                    uploadedFiles={uploadedDocuments.map(doc => ({
                      key: doc.key || '',
                      name: doc.name,
                      file_id: doc.id
                    }))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
