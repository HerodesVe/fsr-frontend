import { FileUpload } from '@/components/ui';
import { LuPartyPopper } from 'react-icons/lu';
import type { GestionAnexoFormData, UploadedDocument } from '@/types/gestionAnexo.types';

interface StepCierreProps {
  formData: GestionAnexoFormData;
  gestionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof GestionAnexoFormData, value: any) => void;
  onFileUpload: (file: File) => Promise<UploadedDocument>;
}

export default function StepCierre({
  formData,
  onInputChange,
}: StepCierreProps) {

  const handleFileChange = async (field: keyof GestionAnexoFormData, files: File[]) => {
    onInputChange(field, files);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 4: Cierre y Entrega
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Suba el cargo de entrega al administrado para finalizar el servicio.
        </p>

        <div className="max-w-xl mx-auto space-y-8">
          {/* Cargo de Entrega al Administrado */}
          <div>
            <FileUpload
              label="Cargo de Entrega al Administrado"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple={false}
              value={formData.cargo_entrega_administrado || []}
              onChange={(files) => handleFileChange('cargo_entrega_administrado', files)}
              required
            />
          </div>

          {/* Mensaje de finalización */}
          <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg flex items-center">
            <LuPartyPopper className="h-6 w-6 mr-3 flex-shrink-0" />
            <p className="font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
              ¡Felicidades! Al completar este paso, el servicio quedará finalizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
