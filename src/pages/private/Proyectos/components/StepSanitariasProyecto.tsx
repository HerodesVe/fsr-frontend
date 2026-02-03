import { useState } from 'react';
import { LuTriangle } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import { DOCUMENT_KEYS } from '@/services/proyectos.service';
import type { ProyectoFormData, UploadedDocument } from '@/types/proyecto.types';

interface StepSanitariasProps {
  formData: ProyectoFormData;
  proyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepSanitarias({
  formData,
  proyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepSanitariasProps) {
  const [showOtherFiles, setShowOtherFiles] = useState(false);
  return (
    <div className="space-y-6">
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">🚿</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Instalaciones Sanitarias
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjuntar los documentos de la especialidad de Sanitarias
        </p>

        <div className="space-y-6">
          {/* Plano de instalación sanitaria */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Instalación de Sanitarias:
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.san_plano_instalacion_sanitaria || []}
              onChange={(files) => onInputChange('san_plano_instalacion_sanitaria', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.SANITARIAS.PLANO_INSTALACION}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Memoria descriptiva */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria descriptiva
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.san_memoria_descriptiva || []}
              onChange={(files) => onInputChange('san_memoria_descriptiva', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.SANITARIAS.MEMORIA_DESCRIPTIVA}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Especificaciones técnicas */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Memoria de Especificaciones Técnicas:
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.san_especificaciones_tecnicas || []}
              onChange={(files) => onInputChange('san_especificaciones_tecnicas', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.SANITARIAS.ESPECIFICACIONES_TECNICAS}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Factibilidad de desagüe */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Certificado de Factibilidad de Servicios de Agua Potable y Alcantarillado:
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.san_factibilidad_desague || []}
              onChange={(files) => onInputChange('san_factibilidad_desague', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.SANITARIAS.FACTIBILIDAD_DESAGUE}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Memoria de Cálculos */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria de Cálculos
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.san_memoria_calculos || []}
              onChange={(files) => onInputChange('san_memoria_calculos', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.SANITARIAS.MEMORIA_CALCULOS}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Otros Documentos */}
          {showOtherFiles && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Otros Documentos
                  </h5>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Archivos adicionales relacionados con instalaciones sanitarias
                  </p>
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivos"
                value={formData.san_otros_archivos || []}
                onChange={(files) => onInputChange('san_otros_archivos', files)}
                accept="*"
                multiple
                onUpload={onFileUpload}
                documentKey={DOCUMENT_KEYS.SANITARIAS.OTROS}
                anteproyectoId={proyectoId}
                uploadedFiles={uploadedDocuments}
              />
            </div>
          )}

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setShowOtherFiles(!showOtherFiles)}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {showOtherFiles ? '- Ocultar Otros Documentos' : '+ Agregar Otros Documentos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

