import { LuTriangle, LuFlag } from 'react-icons/lu';
import { FileUpload, DateInput } from '@/components/ui';
import type { RegularizacionFormData, UploadedDocument } from '@/types/regularizacion.types';

interface StepDocumentacionInicialProps {
  formData: RegularizacionFormData;
  regularizacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof RegularizacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepDocumentacionInicial({
  formData,
  regularizacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepDocumentacionInicialProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 2: Documentación Inicial
        </h3>
        <div className="p-4 border-l-4 border-teal-500 bg-teal-50 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <LuFlag className="h-5 w-5 text-teal-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-teal-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Cargue los documentos iniciales proporcionados por el administrado y especifique la fecha clave del proyecto.
              </p>
            </div>
          </div>
        </div>

        {/* Fecha de Culminación */}
        <div className="mb-8">
          <DateInput
            label="Fecha de Culminación de Edificación"
            value={formData.fechaCulminacion}
            onChange={(value) => onInputChange('fechaCulminacion', value)}
            required
          />
        </div>

        {/* Documentos */}
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Licencia de Obra Anterior
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documento de licencia anterior si existe
                </p>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir Licencia de Obra Anterior"
              value={formData.licenciaAnterior || []}
              onChange={(files) => onInputChange('licenciaAnterior', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="licenciaAnterior"
              anteproyectoId={regularizacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key, name: doc.name, file_id: doc.file_id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Declaratoria de Fábrica
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Documento que declara la construcción existente
                </p>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir Declaratoria de Fábrica"
              value={formData.declaratoriaFabrica || []}
              onChange={(files) => onInputChange('declaratoriaFabrica', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="declaratoriaFabrica"
              anteproyectoId={regularizacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key, name: doc.name, file_id: doc.file_id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Antecedentes
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Planos existentes de la construcción actual
                </p>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Subir Planos de Antecedentes"
              value={formData.planosAntecedentes || []}
              onChange={(files) => onInputChange('planosAntecedentes', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="planosAntecedentes"
              anteproyectoId={regularizacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key, name: doc.name, file_id: doc.file_id }))}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Otros Documentos Adicionales
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Cualquier otro documento relevante para el proceso
                </p>
              </div>
            </div>
            <FileUpload
              placeholder="Subir Otros Documentos"
              value={formData.otros || []}
              onChange={(files) => onInputChange('otros', files)}
              accept=".pdf,.doc,.docx,.jpg,.png"
              multiple
              onUpload={onFileUpload}
              documentKey="otros"
              anteproyectoId={regularizacionId}
              uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.key, name: doc.name, file_id: doc.file_id }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
