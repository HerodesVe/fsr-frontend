import { useState } from 'react';
import { LuTriangle } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import { DOCUMENT_KEYS } from '@/services/proyectos.service';
import type { ProyectoFormData, UploadedDocument } from '@/types/proyecto.types';

interface StepEstructurasProps {
  formData: ProyectoFormData;
  proyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepEstructuras({
  formData,
  proyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepEstructurasProps) {
  const [showOtherFiles, setShowOtherFiles] = useState(false);
  return (
    <div className="space-y-6">
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">🏗️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Especialidad de Estructuras
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
         Adjuntar los documentos de la especialidad de Estructuras
        </p>

        <div className="space-y-6">
          <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Documentos Técnicos Elaborados por FSR:
          </h4>

          {/* Planos de Estructuras */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Estructuras <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.est_planos_estructuras || []}
              onChange={(files) => onInputChange('est_planos_estructuras', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ESTRUCTURAS.PLANOS}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Memoria de Cálculos de Estructuras */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria de Cálculos de Estructuras <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.est_memoria_calculos_estructuras || []}
              onChange={(files) => onInputChange('est_memoria_calculos_estructuras', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ESTRUCTURAS.MEMORIA_CALCULOS}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Memoria de Especificaciones Técnicas de Estructuras */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria de Especificaciones Técnicas de Estructuras <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.est_memoria_especificaciones_tecnicas_estructuras || []}
              onChange={(files) => onInputChange('est_memoria_especificaciones_tecnicas_estructuras', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ESTRUCTURAS.ESPECIFICACIONES_TECNICAS}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Planos de Sostenimiento de Excavaciones */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos de Sostenimiento de Excavaciones <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.est_planos_sostenimiento_excavaciones || []}
              onChange={(files) => onInputChange('est_planos_sostenimiento_excavaciones', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ESTRUCTURAS.PLANOS_SOSTENIMIENTO}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Memoria Descriptiva de Sostenimiento de Excavaciones */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memoria Descriptiva de Sostenimiento de Excavaciones <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.est_memoria_descriptiva_sostenimiento_excavaciones || []}
              onChange={(files) => onInputChange('est_memoria_descriptiva_sostenimiento_excavaciones', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ESTRUCTURAS.MEMORIA_SOSTENIMIENTO}
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Estudio de Mecánicas de Suelos */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Estudio de Mecánicas de Suelos <span className="text-red-500">*</span>
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.est_estudio_mecanica_suelos || []}
              onChange={(files) => onInputChange('est_estudio_mecanica_suelos', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey={DOCUMENT_KEYS.ESTRUCTURAS.ESTUDIO_MECANICA_SUELOS}
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
                    Archivos adicionales relacionados con estructuras
                  </p>
                </div>
              </div>
              <FileUpload
                placeholder="Seleccione archivos"
                value={formData.est_otros_archivos || []}
                onChange={(files) => onInputChange('est_otros_archivos', files)}
                accept="*"
                multiple
                onUpload={onFileUpload}
                documentKey={DOCUMENT_KEYS.ESTRUCTURAS.OTROS}
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

