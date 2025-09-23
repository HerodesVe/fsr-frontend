import { Input, Select, FileUpload } from '@/components/ui';
import type { ProyectoFormData, UploadedDocument } from '@/types/proyecto.types';

interface StepLicenciaProyectoProps {
  formData: ProyectoFormData;
  errors: Record<string, string>;
  anteproyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepLicenciaProyecto({
  formData,
  errors,
  anteproyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepLicenciaProyectoProps) {
  return (
    <div className="space-y-6">
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Licencias y Normativas
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Configura las licencias y normativas aplicables al proyecto.
        </p>

        <div className="space-y-6">
          {/* Tipo de licencia de edificación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Tipo de licencia de edificación <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Seleccione tipo de licencia"
              value={formData.tipo_licencia_edificacion}
              onChange={(value) => onInputChange('tipo_licencia_edificacion', value)}
              error={errors.tipo_licencia_edificacion}
              options={[
                { value: "licencia_edificacion", label: "Licencia de Edificación" },
                { value: "licencia_funcionamiento", label: "Licencia de Funcionamiento" },
                { value: "licencia_ampliacion", label: "Licencia de Ampliación" },
                { value: "licencia_remodelacion", label: "Licencia de Remodelación" }
              ]}
            />
          </div>

          {/* Tipo de modalidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Tipo de modalidad <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Seleccione modalidad"
              value={formData.tipo_modalidad}
              onChange={(value) => onInputChange('tipo_modalidad', value)}
              error={errors.tipo_modalidad}
              options={[
                { value: "modalidad_1", label: "Modalidad 1" },
                { value: "modalidad_2", label: "Modalidad 2" },
                { value: "modalidad_3", label: "Modalidad 3" }
              ]}
            />
          </div>

          {/* Link de normativas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Link de normativas
            </label>
            <Input
              type="url"
              placeholder="https://ejemplo.com/normativas"
              value={formData.link_normativas}
              onChange={(e) => onInputChange('link_normativas', e.target.value)}
              error={errors.link_normativas}
            />
          </div>

          {/* Archivo normativo */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Archivo normativo
                </h5>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Documento con las normativas aplicables
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.archivo_normativo ? [formData.archivo_normativo] : []}
              onChange={(files) => onInputChange('archivo_normativo', files[0] || null)}
              accept=".pdf,.doc,.docx"
              multiple={false}
              onUpload={onFileUpload}
              documentKey="archivo_normativo"
              anteproyectoId={anteproyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
