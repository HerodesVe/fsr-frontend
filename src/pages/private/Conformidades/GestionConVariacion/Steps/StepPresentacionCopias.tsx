import { useCallback } from 'react';
import { LuFileText, LuInfo, LuCopy } from 'react-icons/lu';
import { DateInput, FileUpload } from '@/components/ui';
import type { ConformidadConVariacionFormData, UploadedDocument, PresentacionCopias } from '@/types/conformidad.types';

interface StepPresentacionCopiasProps {
  formData: ConformidadConVariacionFormData;
  errors: Record<string, string>;
  conformidadId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey?: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepPresentacionCopias({
  formData,
  errors,
  conformidadId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepPresentacionCopiasProps) {
  
  const presentacion = formData.presentacion_copias;

  // Actualizar campo de presentación
  const handlePresentacionChange = useCallback((field: keyof PresentacionCopias, value: any) => {
    onInputChange('presentacion_copias', {
      ...presentacion,
      [field]: value,
    });
  }, [presentacion, onInputChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 10: Presentación de Copias
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Inicio del trámite de Declaratoria de Edificación post-aprobación.
        </p>
      </div>

      {/* Información */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuInfo className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Trámite de Declaratoria de Edificación
            </h4>
            <p className="text-sm text-blue-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Una vez aprobada la conformidad de obra, se debe presentar las copias de los documentos 
              aprobados para iniciar el trámite de declaratoria de edificación.
            </p>
          </div>
        </div>
      </div>

      {/* Sección 1: Cargo de Presentación */}
      <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
            <LuCopy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              Carga de Cargo
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Cargo de presentación de copias ante la municipalidad
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Cargo de Presentación de Copias"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(files) => handlePresentacionChange('cargo_presentacion', files)}
              onUpload={onFileUpload}
              documentKey="presentacion_copias.cargo_presentacion"
              anteproyectoId={conformidadId}
              uploadedFiles={uploadedDocuments
                .filter(doc => doc.key === 'presentacion_copias.cargo_presentacion')
                .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
            />

            <DateInput
              label="Fecha de Recolección"
              value={presentacion.fecha_recoleccion}
              onChange={(value) => handlePresentacionChange('fecha_recoleccion', value)}
              error={errors.fecha_recoleccion}
            />
          </div>
        </div>
      </div>

      {/* Sección 2: Documentación Aprobada */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <LuFileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentación Aprobada
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Adjunte los documentos finales aprobados
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* FUE Conformidad/Declaratoria */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              FUE Conformidad / Declaratoria
            </h4>
            <FileUpload
              placeholder="Cargar FUE de Conformidad o Declaratoria"
              value={presentacion.fue_conformidad_declaratoria}
              onChange={(files) => handlePresentacionChange('fue_conformidad_declaratoria', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="presentacion_copias.fue_conformidad_declaratoria"
              anteproyectoId={conformidadId}
              uploadedFiles={uploadedDocuments
                .filter(doc => doc.key === 'presentacion_copias.fue_conformidad_declaratoria')
                .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
            />
          </div>

          {/* Plano de Ubicación */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Plano de Ubicación
            </h4>
            <FileUpload
              placeholder="Cargar Plano de Ubicación"
              value={presentacion.plano_ubicacion}
              onChange={(files) => handlePresentacionChange('plano_ubicacion', files)}
              accept=".pdf,.dwg"
              multiple
              onUpload={onFileUpload}
              documentKey="presentacion_copias.plano_ubicacion"
              anteproyectoId={conformidadId}
              uploadedFiles={uploadedDocuments
                .filter(doc => doc.key === 'presentacion_copias.plano_ubicacion')
                .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
            />
          </div>

          {/* Resolución de Conformidad */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Resolución de Conformidad
            </h4>
            <FileUpload
              placeholder="Cargar Resolución de Conformidad"
              value={presentacion.resolucion_conformidad}
              onChange={(files) => handlePresentacionChange('resolucion_conformidad', files)}
              accept=".pdf"
              multiple
              onUpload={onFileUpload}
              documentKey="presentacion_copias.resolucion_conformidad"
              anteproyectoId={conformidadId}
              uploadedFiles={uploadedDocuments
                .filter(doc => doc.key === 'presentacion_copias.resolucion_conformidad')
                .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
            />
          </div>

          {/* Otros Documentos */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Otros Documentos
            </h4>
            <FileUpload
              placeholder="Cargar otros documentos"
              value={presentacion.otros_documentos}
              onChange={(files) => handlePresentacionChange('otros_documentos', files)}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="presentacion_copias.otros_documentos"
              anteproyectoId={conformidadId}
              uploadedFiles={uploadedDocuments
                .filter(doc => doc.key === 'presentacion_copias.otros_documentos')
                .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
              onDownload={onDownloadDocument}
            />
            <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Cualquier documento adicional requerido para el trámite
            </p>
          </div>
        </div>
      </div>

      {/* Lista de documentos requeridos */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Documentos Típicos para Declaratoria de Edificación
        </h4>
        <ul className="text-sm text-gray-600 space-y-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            FUE de Conformidad de Obra y Declaratoria de Edificación
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Plano de Ubicación y Localización
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Resolución de Conformidad de Obra
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Planos de Arquitectura aprobados (sellados)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Memoria Descriptiva
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Cuadro de Áreas
          </li>
        </ul>
      </div>
    </div>
  );
}
