import { FileUpload, DateInput, Textarea } from '@/components/ui';
import type { GestionAnexoFormData, UploadedDocument } from '@/types/gestionAnexo.types';

interface StepDocumentacionProps {
  formData: GestionAnexoFormData;
  gestionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof GestionAnexoFormData, value: any) => void;
  onFileUpload: (file: File) => Promise<UploadedDocument>;
}

export default function StepDocumentacion({
  formData,
  onInputChange,
  onFileUpload,
}: StepDocumentacionProps) {

  const handleFileChange = async (field: keyof GestionAnexoFormData, files: File[]) => {
    onInputChange(field, files);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2: Documentación del Administrado
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Recopilación de todos los documentos y datos proporcionados por el cliente.
        </p>

        <div className="space-y-6">
          {/* Documentos principales en vertical */}
          <div className="space-y-6">
            {/* Anexo H (Formato) */}
            <div>
              <FileUpload
                label="Anexo H (Formato)"
                accept=".pdf,.doc,.docx"
                multiple={false}
                files={formData.anexo_h_formato || []}
                onChange={(files) => handleFileChange('anexo_h_formato', files)}
                required
              />
            </div>

            {/* Contrato Supervisor o Convenio de Visitas */}
            <div>
              <FileUpload
                label="Contrato Supervisor o Convenio de Visitas"
                accept=".pdf,.doc,.docx"
                multiple={false}
                files={formData.contrato_supervisor || []}
                onChange={(files) => handleFileChange('contrato_supervisor', files)}
                required
              />
            </div>

            {/* Póliza CAR */}
            <div>
              <FileUpload
                label="Póliza CAR"
                accept=".pdf,.doc,.docx"
                multiple={false}
                files={formData.poliza_car || []}
                onChange={(files) => handleFileChange('poliza_car', files)}
                required
              />
            </div>

            {/* Resolución de Licencia de Obra */}
            <div>
              <FileUpload
                label="Resolución de Licencia de Obra"
                accept=".pdf,.doc,.docx"
                multiple={false}
                files={formData.resolucion_licencia_obra || []}
                onChange={(files) => handleFileChange('resolucion_licencia_obra', files)}
                required
              />
            </div>

            {/* Cronograma de Visitas */}
            <div>
              <FileUpload
                label="Cronograma de Visitas"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple={false}
                files={formData.cronograma_visitas || []}
                onChange={(files) => handleFileChange('cronograma_visitas', files)}
                required
              />
            </div>

            {/* Cronograma de Obra */}
            <div>
              <FileUpload
                label="Cronograma de Obra"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple={false}
                files={formData.cronograma_obra || []}
                onChange={(files) => handleFileChange('cronograma_obra', files)}
                required
              />
            </div>

            {/* Otros Documentos (Opcional) */}
            <div>
              <FileUpload
                label="Otros Documentos (Opcional)"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple={true}
                files={formData.otros_documentos || []}
                onChange={(files) => handleFileChange('otros_documentos', files)}
                required={false}
              />
            </div>
          </div>

          {/* Fecha de Inicio de Ejecución de Obra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <DateInput
                label="Fecha de Inicio de Ejecución de Obra"
                value={formData.fecha_inicio_ejecucion || ''}
                onChange={(value) => onInputChange('fecha_inicio_ejecucion', value)}
                placeholder="dd/mm/aaaa"
                required
              />
            </div>
          </div>

          {/* Comentarios */}
          <div>
            <Textarea
              label="Comentarios"
              placeholder="Añadir observaciones sobre el proceso..."
              value={formData.comentarios_documentacion || ''}
              onChange={(value) => onInputChange('comentarios_documentacion', value)}
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
