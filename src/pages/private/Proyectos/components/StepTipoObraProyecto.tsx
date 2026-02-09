import { useState } from 'react';
import { Checkbox } from '@heroui/react';
import { Input, Select, FileUpload } from '@/components/ui';
import { DOCUMENT_KEYS } from '@/services/proyectos.service';
import type { ProyectoFormData, UploadedDocument } from '@/types/proyecto.types';

interface StepTipoObraProyectoProps {
  formData: ProyectoFormData;
  errors: Record<string, string>;
  proyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepTipoObraProyecto({
  formData,
  errors,
  proyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument,
}: StepTipoObraProyectoProps) {
  // Estado local para controlar la visibilidad de la sección MVCS
  const [showMvcsSection, setShowMvcsSection] = useState(formData.consulta_mvcs || false);

  const modalidadOptions = [
    { value: 'A', label: 'Modalidad A' },
    { value: 'B', label: 'Modalidad B' },
    { value: 'C', label: 'Modalidad C' },
    { value: 'D', label: 'Modalidad D' },
  ];

  const tipoObraOptions = [
    { value: 'ampliacion', label: 'Ampliación' },
    { value: 'remodelacion', label: 'Remodelación' },
    { value: 'demolicion_total', label: 'Demolición Total' },
    { value: 'demolicion_parcial', label: 'Demolición Parcial' },
    { value: 'cercado', label: 'Cercado' },
    { value: 'acondicionamiento', label: 'Acondicionamiento' },
    { value: 'refaccion', label: 'Refacción' },
    { value: 'puesta_valor_historico_monumental', label: 'Puesta en Valor Histórico Monumental' },
  ];

  // Handler para el checkbox de consulta MVCS
  const handleConsultaMvcsChange = (checked: boolean) => {
    setShowMvcsSection(checked);
    onInputChange('consulta_mvcs', checked);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Tipo de Obra
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione el tipo de obra y modalidad de aprobación para la elaboración del proyecto
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tipo de Obra"
            placeholder="Seleccionar tipo de obra"
            options={tipoObraOptions}
            selectedKeys={formData.tipo_licencia_edificacion ? [formData.tipo_licencia_edificacion] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onInputChange('tipo_licencia_edificacion', value || '');
            }}
            error={errors.tipo_licencia_edificacion}
          />

          <Select
            label="Modalidad de Aprobación"
            placeholder="Seleccionar opción"
            options={modalidadOptions}
            selectedKeys={formData.tipo_modalidad ? [formData.tipo_modalidad] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onInputChange('tipo_modalidad', value || '');
            }}
            error={errors.tipo_modalidad}
          />
        </div>
      </div>

      {/* --- NUEVA SECCIÓN: Control de Obra por Etapas --- */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Control de Obra
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Configure las opciones de control para la ejecución de la obra
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              isSelected={formData.por_etapas || false}
              onValueChange={(checked) => onInputChange('por_etapas', checked)}
            >
              <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Obra por etapas
              </span>
            </Checkbox>
          </div>

          {formData.por_etapas && (
            <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Número de Obras/Etapas"
                placeholder="Ingrese el número de obras"
                value={(formData.numero_obras || 0).toString()}
                onChange={(e) => onInputChange('numero_obras', parseInt(e.target.value) || 0)}
                numbersOnly
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Checkbox
              isSelected={formData.etapa_por_autorizar || false}
              onValueChange={(checked) => onInputChange('etapa_por_autorizar', checked)}
            >
              <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Etapa por autorizar
              </span>
            </Checkbox>
          </div>
        </div>
      </div>

      {/* --- NUEVA SECCIÓN: Consulta MVCS --- */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Consulta MVCS (Ministerio de Vivienda)
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Active esta opción si el proyecto requiere consulta al Ministerio de Vivienda, Construcción y Saneamiento
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              isSelected={formData.consulta_mvcs || false}
              onValueChange={handleConsultaMvcsChange}
            >
              <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Requiere Consulta MVCS
              </span>
            </Checkbox>
          </div>

          {showMvcsSection && (
            <div className="ml-6 space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                <strong>Nota:</strong> El documento de consulta es obligatorio para completar este paso cuando la consulta MVCS está activa.
              </p>
              
              <div className="space-y-4">
                <FileUpload
                  label="Documento de Consulta MVCS (Cargo)"
                  placeholder="Seleccione archivo"
                  value={formData.lic_documento_consulta_mvcs || []}
                  onChange={(files) => onInputChange('lic_documento_consulta_mvcs', files)}
                  accept=".pdf,.doc,.docx"
                  required
                  onUpload={onFileUpload}
                  documentKey={DOCUMENT_KEYS.LICENCIAS.DOCUMENTO_CONSULTA_MVCS}
                  anteproyectoId={proyectoId}
                  uploadedFiles={uploadedDocuments}
                  onDownload={onDownloadDocument}
                />

                <FileUpload
                  label="Documento de Respuesta MVCS (Opcional)"
                  placeholder="Seleccione archivo"
                  value={formData.lic_documento_respuesta_mvcs || []}
                  onChange={(files) => onInputChange('lic_documento_respuesta_mvcs', files)}
                  accept=".pdf,.doc,.docx"
                  onUpload={onFileUpload}
                  documentKey={DOCUMENT_KEYS.LICENCIAS.DOCUMENTO_RESPUESTA_MVCS}
                  anteproyectoId={proyectoId}
                  uploadedFiles={uploadedDocuments}
                  onDownload={onDownloadDocument}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* --- FIN NUEVAS SECCIONES --- */}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Normativa aplicable para el proyecto
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjunta los documentos necesarios para las normativas del proyecto
        </p>
        
        <div className="space-y-6">
          <Input
            label="Link de normativa aplicable para el proyecto"
            placeholder="Pegar el link"
            value={formData.link_normativas}
            onChange={(e) => onInputChange('link_normativas', e.target.value)}
          />

          <FileUpload
            label="Normativa aplicable para el proyecto"
            placeholder="Seleccione archivo"
            value={formData.archivo_normativo ? [formData.archivo_normativo] : []}
            onChange={(files) => onInputChange('archivo_normativo', files[0])}
            accept=".pdf,.doc,.docx"
            required
            onUpload={onFileUpload}
            documentKey={DOCUMENT_KEYS.LICENCIAS.ARCHIVO_NORMATIVO}
            anteproyectoId={proyectoId}
            uploadedFiles={uploadedDocuments}
            onDownload={onDownloadDocument}
          />
        </div>
      </div>
    </div>
  );
}
