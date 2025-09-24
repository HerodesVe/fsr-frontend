import { LuFileText, LuDownload } from 'react-icons/lu';
import { FileUpload, Button } from '@/components/ui';
import type { RegularizacionFormData, UploadedDocument } from '@/types/regularizacion.types';

interface StepFueFirmadoProps {
  formData: RegularizacionFormData;
  regularizacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof RegularizacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepFueFirmado({
  formData,
  regularizacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepFueFirmadoProps) {
  const handleGenerateFUE = () => {
    // TODO: Implementar generación del FUE
    console.log('Generar FUE con datos:', formData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <LuFileText className="mx-auto h-12 w-12 text-teal-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 4: Carga del FUE Firmado
        </h3>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          La información está completa. El siguiente paso es un proceso físico:
        </p>

        {/* Proceso paso a paso */}
        <div className="text-left bg-gray-50 p-6 rounded-lg mb-6">
          <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
            <li style={{ fontFamily: 'Inter, sans-serif' }}>
              <strong>Genere y Descargue</strong> el FUE en formato PDF.
            </li>
            <li style={{ fontFamily: 'Inter, sans-serif' }}>
              <strong>Imprima</strong> el documento generado.
            </li>
            <li style={{ fontFamily: 'Inter, sans-serif' }}>
              Obtenga las <strong>firmas originales</strong> de los profesionales de FSR y del administrado.
            </li>
            <li style={{ fontFamily: 'Inter, sans-serif' }}>
              <strong>Escanee</strong> el documento ya firmado.
            </li>
            <li style={{ fontFamily: 'Inter, sans-serif' }}>
              <strong>Suba</strong> el PDF escaneado en esta sección.
            </li>
          </ol>
        </div>

        {/* Botón para generar FUE */}
        <div className="mb-8">
          <Button
            onClick={handleGenerateFUE}
            startContent={<LuDownload className="w-4 h-4" />}
            style={{ backgroundColor: 'var(--primary-color)' }}
            className="text-white hover:opacity-90"
          >
            Generar y Descargar FUE
          </Button>
          <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            El documento se generará con la información ingresada en los pasos anteriores
          </p>
        </div>

        {/* Upload del FUE firmado */}
        <div className="pt-4 border-t">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Subir FUE Firmado y Escaneado <span className="text-red-500">*</span>
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documento FUE con todas las firmas requeridas
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Subir FUE Firmado"
              value={formData.fueFirmado || []}
              onChange={(files) => onInputChange('fueFirmado', files)}
              accept=".pdf"
              multiple={false}
              onUpload={onFileUpload}
              documentKey="fueFirmado"
              anteproyectoId={regularizacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key, name: doc.name, file_id: doc.file_id }))}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Importante
          </h4>
          <p className="text-sm text-yellow-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            El FUE debe contener las firmas originales de todos los profesionales responsables y del administrado. 
            Sin estas firmas, el documento no será válido para el proceso de regularización.
          </p>
        </div>
      </div>
    </div>
  );
}
