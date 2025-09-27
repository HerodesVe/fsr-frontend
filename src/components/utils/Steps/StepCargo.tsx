import { LuPackage, LuInfo } from 'react-icons/lu';
import { Input, FileUpload } from '@/components/ui';

interface StepCargoProps {
  formData: {
    [key: string]: any;
  };
  projectId: string;
  uploadedDocuments: any[];
  errors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
  title?: string;
  description?: string;
}

export default function StepCargo({
  formData,
  projectId,
  uploadedDocuments,
  errors,
  onInputChange,
  onFileUpload,
  title = "Entrega al Administrado",
  description = "Complete la información de la entrega final del proyecto al administrado"
}: StepCargoProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {title}
        </h3>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          {description}
        </p>
      </div>

      {/* Información de Entrega */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-teal-100 text-teal-600 p-3 rounded-lg">
            <LuPackage size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Información de Entrega
            </h3>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Registre los datos de la entrega final del proyecto al administrado
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Fecha de Entrega y Receptor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha de Entrega"
              type="date"
              value={formData.fecha_entrega_administrado || ''}
              onChange={(e) => onInputChange('fecha_entrega_administrado', e.target.value)}
              error={errors.fecha_entrega_administrado}
              required
            />
            <Input
              label="Recibido por"
              type="text"
              placeholder="Nombre de quien recibe"
              value={formData.receptor_administrado || ''}
              onChange={(e) => onInputChange('receptor_administrado', e.target.value)}
              error={errors.receptor_administrado}
              required
            />
          </div>

          {/* Cargo de Entrega */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cargo de Entrega al Administrado <span className="text-red-500">*</span>
                </h4>
                <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Documento que certifica la entrega del proyecto al administrado
                </p>
              </div>
              <div className="text-xs text-gray-500">
                <LuInfo className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={[]}
              onChange={(files) => onInputChange('cargo_entrega_administrado', files[0] || null)}
              accept=".pdf"
              multiple={false}
              onUpload={onFileUpload}
              documentKey="cargo_entrega_administrado"
              anteproyectoId={projectId}
              uploadedFiles={uploadedDocuments.map(doc => ({ 
                key: doc.id || doc.key, 
                name: doc.name, 
                file_id: doc.id || doc.file_id 
              }))}
            />
            {errors.cargo_entrega_administrado && (
              <p className="text-sm text-red-600 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {errors.cargo_entrega_administrado}
              </p>
            )}
          </div>

          {/* Observaciones adicionales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Observaciones de Entrega (Opcional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              rows={3}
              placeholder="Observaciones adicionales sobre la entrega..."
              value={formData.observaciones_entrega || ''}
              onChange={(e) => onInputChange('observaciones_entrega', e.target.value)}
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
