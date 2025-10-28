import { Select, Switch, FileUpload } from '@/components/ui';
import type { AmpliacionFormData, UploadedDocument, ProyectoFSR } from '@/types/ampliacion.types';

interface StepAntecedentesProps {
  formData: AmpliacionFormData;
  errors: Record<string, string>;
  ampliacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof AmpliacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

// Mock data para proyectos FSR
const mockProyectosFSR: ProyectoFSR[] = [
  { id: 'P001', name: 'Proyecto Edificio "El Mirador"', licencia: 'L00123' },
  { id: 'P002', name: 'Proyecto Condominio "Las Palmeras"', licencia: 'L00456' },
  { id: 'P003', name: 'Proyecto Residencial "Los Olivos"', licencia: 'L00789' },
];

export default function StepAntecedentes({
  formData,
  errors,
  ampliacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument,
}: StepAntecedentesProps) {
  const proyectoOptions = mockProyectosFSR.map(proyecto => ({
    value: proyecto.id,
    label: `${proyecto.name} - Licencia ${proyecto.licencia}`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Antecedentes del Inmueble
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Indique si el proyecto anterior fue gestionado por FSR y adjunte los documentos correspondientes
        </p>
        
        <div className="space-y-6">
          {/* Toggle para proyecto gestionado por FSR */}
          <div className="p-4 border-l-4 border-teal-500 bg-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ¿El proyecto anterior fue gestionado por FSR?
                </h4>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Si el proyecto anterior fue gestionado por FSR, podrá seleccionarlo de la lista
                </p>
              </div>
              <Switch
                isSelected={formData.gestionado_por_fsr}
                onValueChange={(checked) => onInputChange('gestionado_por_fsr', checked)}
              />
            </div>
          </div>

          {/* Selector de proyecto FSR o documentos manuales */}
          {formData.gestionado_por_fsr ? (
            <Select
              label="Buscar Licencia/Proyecto Anterior"
              placeholder="Seleccione un proyecto gestionado por FSR"
              options={proyectoOptions}
              selectedKeys={formData.proyecto_fsr_id ? [formData.proyecto_fsr_id] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                onInputChange('proyecto_fsr_id', value || '');
              }}
              error={errors.proyecto_fsr_id}
            />
          ) : (
            <div className="space-y-6">
              <FileUpload
                label="Licencia de Obra (si aplica)"
                placeholder="Seleccione archivo"
                onChange={(files) => onInputChange('licencia_obra', files)}
                accept=".pdf,.doc,.docx"
                onUpload={onFileUpload}
                documentKey="antecedentes.licencia_obra"
                anteproyectoId={ampliacionId}
                uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'antecedentes.licencia_obra').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Conformidad de Obra (si aplica)"
                placeholder="Seleccione archivo"
                onChange={(files) => onInputChange('conformidad_obra', files)}
                accept=".pdf,.doc,.docx"
                onUpload={onFileUpload}
                documentKey="antecedentes.conformidad_obra"
                anteproyectoId={ampliacionId}
                uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'antecedentes.conformidad_obra').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Declaratoria de Fábrica (si aplica)"
                placeholder="Seleccione archivo"
                onChange={(files) => onInputChange('declaratoria_fabrica', files)}
                accept=".pdf,.doc,.docx"
                onUpload={onFileUpload}
                documentKey="antecedentes.declaratoria_fabrica"
                anteproyectoId={ampliacionId}
                uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'antecedentes.declaratoria_fabrica').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Planos de Fábrica (si aplica)"
                placeholder="Seleccione archivo"
                onChange={(files) => onInputChange('planos_fabrica', files)}
                accept=".pdf,.dwg,.dxf"
                onUpload={onFileUpload}
                documentKey="antecedentes.planos_fabrica"
                anteproyectoId={ampliacionId}
                uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'antecedentes.planos_fabrica').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Partida Registral (si no hay planos)"
                placeholder="Seleccione archivo"
                onChange={(files) => onInputChange('partida_registral', files)}
                accept=".pdf,.doc,.docx"
                onUpload={onFileUpload}
                documentKey="antecedentes.partida_registral"
                anteproyectoId={ampliacionId}
                uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'antecedentes.partida_registral').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
              />
            </div>
          )}

          {/* Certificado de parámetros (siempre requerido) */}
          <div className="border-t pt-6">
              <FileUpload
                label="Certificado de Parámetros Urbanísticos (Actualizado)"
                placeholder="Seleccione archivo"
                onChange={(files) => onInputChange('certificado_parametros', files)}
                accept=".pdf,.doc,.docx"
                required
                onUpload={onFileUpload}
                documentKey="antecedentes.certificado_parametros"
                anteproyectoId={ampliacionId}
                uploadedFiles={uploadedDocuments.filter(doc => doc.key === 'antecedentes.certificado_parametros').map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
                error={errors.certificado_parametros}
              />
          </div>
        </div>
      </div>
    </div>
  );
}
