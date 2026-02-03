import { useState } from 'react';
import { LuTriangle } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import { DOCUMENT_KEYS } from '@/services/proyectos.service';
import type { ProyectoFormData, UploadedDocument } from '@/types/proyecto.types';

interface StepArquitecturaProps {
  formData: ProyectoFormData;
  proyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepArquitectura({
  formData,
  proyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepArquitecturaProps) {
  const [showOtherFiles, setShowOtherFiles] = useState(false);
  return (
    <div className="space-y-6">
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">🏗️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Arquitectura
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Adjuntar los documentos de la especialidad de Arquitectura
        </p>

        <div className="space-y-6">
          <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Especificaciones técnicas:
          </h4>

          {/* Plano de Ubicación */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Plano de Ubicación <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.arq_plano_ubicacion || []}
              onChange={(files) => onInputChange('arq_plano_ubicacion', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ARQUITECTURA.PLANO_UBICACION}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Plano de Arquitectura */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Arquitectura <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.arq_plano_arquitectura || []}
              onChange={(files) => onInputChange('arq_plano_arquitectura', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ARQUITECTURA.PLANO_ARQUITECTURA}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Plano de Seguridad */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Seguridad <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.arq_plano_seguridad || []}
              onChange={(files) => onInputChange('arq_plano_seguridad', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ARQUITECTURA.PLANO_SEGURIDAD}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Memoria descriptiva de Seguridad */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria descriptiva de Seguridad <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.arq_memoria_descriptiva_seguridad || []}
              onChange={(files) => onInputChange('arq_memoria_descriptiva_seguridad', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ARQUITECTURA.MEMORIA_SEGURIDAD}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Memoria descriptiva de Arquitectura */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria descriptiva de Arquitectura <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.arq_memoria_descriptiva_arquitectura || []}
              onChange={(files) => onInputChange('arq_memoria_descriptiva_arquitectura', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ARQUITECTURA.MEMORIA_ARQUITECTURA}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* FUE (Formulario Único de Edificación) y Presupuesto de Obra */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  FUE (Formulario Único de Edificación) y Presupuesto de Obra
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.arq_fue_presupuesto_obra || []}
              onChange={(files) => onInputChange('arq_fue_presupuesto_obra', files)}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ARQUITECTURA.FUE_PRESUPUESTO}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Sustento Técnico – Legal con Consulta al MVCS */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Sustento Técnico – Legal con Consulta al MVCS
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.arq_sustento_tecnico_legal_mvcs || []}
              onChange={(files) => onInputChange('arq_sustento_tecnico_legal_mvcs', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ARQUITECTURA.SUSTENTO_TECNICO_MVCS}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Otros Archivos */}
          {showOtherFiles && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Otros Archivos
                  </h5>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Archivos adicionales relacionados con arquitectura
                  </p>
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivos"
                value={formData.arq_otros_archivos || []}
                onChange={(files) => onInputChange('arq_otros_archivos', files)}
                accept="*"
                multiple
                onUpload={onFileUpload}
                documentKey="arq_otros_archivos"
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
              {showOtherFiles ? '- Ocultar Otros Archivos' : '+ Agregar Otros Archivos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

