import { FileUpload, DateInput } from '@/components/ui';
import type { DemolicionFormData, UploadedDocument } from '@/types/demolicion.types';

interface StepGestionMunicipalProps {
  formData: DemolicionFormData;
  demolicionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof DemolicionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepGestionMunicipal({
  formData,
  demolicionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepGestionMunicipalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 4: Gestión Municipal y Cierre
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestiona los documentos municipales y el proceso de cierre del servicio
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cargo de Ingreso a Municipalidad */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo de Ingreso a Municipalidad
              </label>
              <FileUpload
                placeholder="Subir Cargo"
                value={formData.cargo_ingreso_municipalidad || []}
                onChange={(files) => onInputChange('cargo_ingreso_municipalidad', files)}
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey="cargo_ingreso_municipalidad"
                anteproyectoId={demolicionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>
            <div>
              <DateInput
                label="Fecha de Ingreso"
                value={formData.fecha_ingreso_municipalidad}
                onChange={(date) => onInputChange('fecha_ingreso_municipalidad', date)}
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>

          {/* Respuesta / Resolución Municipal */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respuesta / Resolución Municipal
              </label>
              <FileUpload
                placeholder="Subir Resolución"
                value={formData.respuesta_resolucion_municipal || []}
                onChange={(files) => onInputChange('respuesta_resolucion_municipal', files)}
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey="respuesta_resolucion_municipal"
                anteproyectoId={demolicionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>
            <div>
              <DateInput
                label="Fecha de Respuesta"
                value={formData.fecha_respuesta_municipal}
                onChange={(date) => onInputChange('fecha_respuesta_municipal', date)}
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>

          {/* Cargo de Entrega al Administrado */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo de Entrega al Administrado
              </label>
              <FileUpload
                placeholder="Subir Cargo"
                value={formData.cargo_entrega_administrado || []}
                onChange={(files) => onInputChange('cargo_entrega_administrado', files)}
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey="cargo_entrega_administrado"
                anteproyectoId={demolicionId}
                uploadedFiles={uploadedDocuments.map(doc => ({ key: doc.id, name: doc.name, file_id: doc.id }))}
              />
            </div>
            <div>
              <DateInput
                label="Fecha de Entrega"
                value={formData.fecha_entrega_administrado}
                onChange={(date) => onInputChange('fecha_entrega_administrado', date)}
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
