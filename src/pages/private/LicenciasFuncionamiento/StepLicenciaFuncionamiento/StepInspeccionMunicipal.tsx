import { Input, Select, FileUpload } from '@/components/ui';
import type { LicenciaFuncionamientoFormData, UploadedDocument } from '@/types/licenciaFuncionamiento.types';

interface StepInspeccionMunicipalProps {
  formData: LicenciaFuncionamientoFormData;
  licenciaId: string;
  uploadedDocuments: UploadedDocument[];
  errors: Record<string, string>;
  onInputChange: (field: keyof LicenciaFuncionamientoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepInspeccionMunicipal({
  formData,
  licenciaId,
  uploadedDocuments,
  errors,
  onInputChange,
  onFileUpload,
}: StepInspeccionMunicipalProps) {
  const resultadoInspeccionOptions = [
    { value: 'Conforme', label: 'Conforme' },
    { value: 'Observado', label: 'Observado' },
  ];

  const esObservado = formData.resultado_inspeccion === 'Observado';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 7: Inspección Municipal y Observaciones
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre los resultados de la inspección realizada por la municipalidad
        </p>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Fecha de Inspección"
                type="date"
                value={formData.fecha_inspeccion}
                onChange={(e) => onInputChange('fecha_inspeccion', e.target.value)}
                error={errors.fecha_inspeccion}
              />
            </div>
            <div>
              <Select
                label="Resultado de Inspección"
                options={resultadoInspeccionOptions}
                selectedKeys={formData.resultado_inspeccion ? [formData.resultado_inspeccion] : []}
                onSelectionChange={(keys) => {
                  const resultado = Array.from(keys)[0] as string;
                  onInputChange('resultado_inspeccion', resultado);
                }}
              />
            </div>
          </div>

          {/* Acta de Inspección */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Acta de Inspección (Checklist) <span className="text-red-500">*</span>
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documento oficial de la inspección municipal
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.acta_inspeccion || []}
              onChange={(files) => onInputChange('acta_inspeccion', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="acta_inspeccion"
              anteproyectoId={licenciaId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Sección de subsanación para observados */}
          {esObservado && (
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Levantamiento de Observaciones
              </h4>
              <p className="text-sm text-red-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                La inspección ha resultado observada. Se requiere subsanar las observaciones encontradas.
              </p>
              <div>
                <Input
                  label="Fecha Límite para Subsanar"
                  type="date"
                  value={formData.fecha_limite_subsanar}
                  onChange={(e) => onInputChange('fecha_limite_subsanar', e.target.value)}
                  error={errors.fecha_limite_subsanar}
                />
              </div>
            </div>
          )}

          {/* Información del resultado */}
          {formData.resultado_inspeccion && (
            <div className={`p-4 rounded-lg border ${
              formData.resultado_inspeccion === ResultadoInspeccion.CONFORME 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Resultado: {formData.resultado_inspeccion}
              </h4>
              <div className="text-sm">
                {formData.resultado_inspeccion === 'Conforme' ? (
                  <div className="text-green-700">
                    <p className="font-medium">✅ Inspección Conforme</p>
                    <p>El local cumple con todos los requisitos de seguridad y puede proceder a la emisión de certificados.</p>
                  </div>
                ) : (
                  <div className="text-yellow-700">
                    <p className="font-medium">⚠️ Inspección Observada</p>
                    <p>Se han encontrado observaciones que deben ser corregidas antes de la emisión de certificados.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resumen de la inspección */}
          {(formData.fecha_inspeccion || formData.resultado_inspeccion) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Resumen de la Inspección
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {formData.fecha_inspeccion && (
                  <div>
                    <span className="font-medium text-gray-700">Fecha de Inspección:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(formData.fecha_inspeccion).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
                {formData.resultado_inspeccion && (
                  <div>
                    <span className="font-medium text-gray-700">Resultado:</span>
                    <span className="ml-2 text-gray-600">{formData.resultado_inspeccion}</span>
                  </div>
                )}
                {formData.fecha_limite_subsanar && (
                  <div>
                    <span className="font-medium text-gray-700">Fecha Límite Subsanación:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(formData.fecha_limite_subsanar).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
