import { useState } from 'react';
import { LuTriangle } from 'react-icons/lu';
import { FileUpload } from '@/components/ui';
import type { ProyectoFormData, UploadedDocument, ElectricasTabType } from '@/types/proyecto.types';

interface StepElectricasProps {
  formData: ProyectoFormData;
  proyectoId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof ProyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepElectricas({
  formData,
  proyectoId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepElectricasProps) {
  const [activeTab, setActiveTab] = useState<ElectricasTabType>('electricas');
  const [showOtherFiles, setShowOtherFiles] = useState<Record<ElectricasTabType, boolean>>({
    electricas: false,
    mecanicas: false,
    gas: false,
    paneles_solares: false,
  });

  const tabs = [
    { key: 'electricas' as ElectricasTabType, label: 'Eléctricas' },
    { key: 'mecanicas' as ElectricasTabType, label: 'Mecánicas' },
    { key: 'gas' as ElectricasTabType, label: 'Gas' },
    { key: 'paneles_solares' as ElectricasTabType, label: 'Paneles solares' },
  ];

  const toggleOtherFiles = (tabKey: ElectricasTabType) => {
    setShowOtherFiles(prev => ({
      ...prev,
      [tabKey]: !prev[tabKey]
    }));
  };

  const renderOtherFilesSection = (tabKey: ElectricasTabType, fieldKey: keyof ProyectoFormData, description: string) => (
    <>
      {showOtherFiles[tabKey] && (
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Otros Archivos
              </h5>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {description}
              </p>
            </div>
          </div>
          <FileUpload
            placeholder="Seleccione archivos"
            value={formData[fieldKey] as File[] || []}
            onChange={(files) => onInputChange(fieldKey, files)}
            accept="*"
            multiple
            onUpload={onFileUpload}
            documentKey={fieldKey as string}
            anteproyectoId={proyectoId}
            uploadedFiles={uploadedDocuments}
          />
        </div>
      )}
      
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => toggleOtherFiles(tabKey)}
          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {showOtherFiles[tabKey] ? '- Ocultar Otros Archivos' : '+ Agregar Otros Archivos'}
        </button>
      </div>
    </>
  );

  const renderElectricasContent = () => (
    <div className="space-y-6">
      {/* Plano de instalación eléctrica */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Plano de instalación eléctrica
            </h5>
          </div>
          <div className="text-xs text-gray-500">
            <LuTriangle className="inline w-4 h-4 mr-1" />
          </div>
        </div>
        <FileUpload
          placeholder="Seleccione archivo"
          value={formData.elec_plano_instalacion_electrica || []}
          onChange={(files) => onInputChange('elec_plano_instalacion_electrica', files)}
          accept=".pdf,.dwg,.dxf"
          multiple
          onUpload={onFileUpload}
          documentKey="elec_plano_instalacion_electrica"
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
          value={formData.elec_memoria_descriptiva || []}
          onChange={(files) => onInputChange('elec_memoria_descriptiva', files)}
          accept=".pdf,.doc,.docx"
          multiple
          onUpload={onFileUpload}
          documentKey="elec_memoria_descriptiva"
          anteproyectoId={proyectoId}
          uploadedFiles={uploadedDocuments}
        />
      </div>

      {/* Especificaciones técnicas */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Especificaciones técnicas
            </h5>
          </div>
          <div className="text-xs text-gray-500">
            <LuTriangle className="inline w-4 h-4 mr-1" />
          </div>
        </div>
        <FileUpload
          placeholder="Seleccione archivo"
          value={formData.elec_especificaciones_tecnicas || []}
          onChange={(files) => onInputChange('elec_especificaciones_tecnicas', files)}
          accept=".pdf,.doc,.docx"
          multiple
          onUpload={onFileUpload}
          documentKey="elec_especificaciones_tecnicas"
          anteproyectoId={proyectoId}
          uploadedFiles={uploadedDocuments}
        />
      </div>

      {/* Factibilidad de energía */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Factibilidad de energía
            </h5>
          </div>
          <div className="text-xs text-gray-500">
            <LuTriangle className="inline w-4 h-4 mr-1" />
          </div>
        </div>
        <FileUpload
          placeholder="Seleccione archivo"
          value={formData.elec_factibilidad_energia || []}
          onChange={(files) => onInputChange('elec_factibilidad_energia', files)}
          accept=".pdf,.doc,.docx"
          multiple
          onUpload={onFileUpload}
          documentKey="elec_factibilidad_energia"
          anteproyectoId={proyectoId}
          uploadedFiles={uploadedDocuments}
        />
      </div>

      {/* Otros Archivos */}
      {renderOtherFilesSection('electricas', 'elec_otros_archivos', 'Archivos adicionales relacionados con instalaciones eléctricas')}
    </div>
  );

  const renderMecanicasContent = () => (
    <div className="space-y-6">
      {/* Plano de instalación mecánica */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Plano de instalación mecánica
            </h5>
          </div>
          <div className="text-xs text-gray-500">
            <LuTriangle className="inline w-4 h-4 mr-1" />
          </div>
        </div>
        <FileUpload
          placeholder="Seleccione archivo"
          value={formData.mec_plano_instalacion_mecanica || []}
          onChange={(files) => onInputChange('mec_plano_instalacion_mecanica', files)}
          accept=".pdf,.dwg,.dxf"
          multiple
          onUpload={onFileUpload}
          documentKey="mec_plano_instalacion_mecanica"
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
          value={formData.mec_memoria_descriptiva || []}
          onChange={(files) => onInputChange('mec_memoria_descriptiva', files)}
          accept=".pdf,.doc,.docx"
          multiple
          onUpload={onFileUpload}
          documentKey="mec_memoria_descriptiva"
          anteproyectoId={proyectoId}
          uploadedFiles={uploadedDocuments}
        />
      </div>

      {/* Especificaciones técnicas */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Especificaciones técnicas
            </h5>
          </div>
          <div className="text-xs text-gray-500">
            <LuTriangle className="inline w-4 h-4 mr-1" />
          </div>
        </div>
        <FileUpload
          placeholder="Seleccione archivo"
          value={formData.mec_especificaciones_tecnicas || []}
          onChange={(files) => onInputChange('mec_especificaciones_tecnicas', files)}
          accept=".pdf,.doc,.docx"
          multiple
          onUpload={onFileUpload}
          documentKey="mec_especificaciones_tecnicas"
          anteproyectoId={proyectoId}
          uploadedFiles={uploadedDocuments}
        />
      </div>

      {/* Otros Archivos */}
      {renderOtherFilesSection('mecanicas', 'mec_otros_archivos', 'Archivos adicionales relacionados con instalaciones mecánicas')}
    </div>
  );

  const renderGasContent = () => (
    <div className="space-y-6">
      {/* Plano de instalación de gas */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Plano de instalación de gas
            </h5>
          </div>
          <div className="text-xs text-gray-500">
            <LuTriangle className="inline w-4 h-4 mr-1" />
          </div>
        </div>
        <FileUpload
          placeholder="Seleccione archivo"
          value={formData.gas_plano_instalacion_gas || []}
          onChange={(files) => onInputChange('gas_plano_instalacion_gas', files)}
          accept=".pdf,.dwg,.dxf"
          multiple
          onUpload={onFileUpload}
          documentKey="gas_plano_instalacion_gas"
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
          value={formData.gas_memoria_descriptiva || []}
          onChange={(files) => onInputChange('gas_memoria_descriptiva', files)}
          accept=".pdf,.doc,.docx"
          multiple
          onUpload={onFileUpload}
          documentKey="gas_memoria_descriptiva"
          anteproyectoId={proyectoId}
          uploadedFiles={uploadedDocuments}
        />
      </div>

      {/* Especificaciones técnicas */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Especificaciones técnicas
            </h5>
          </div>
          <div className="text-xs text-gray-500">
            <LuTriangle className="inline w-4 h-4 mr-1" />
          </div>
        </div>
        <FileUpload
          placeholder="Seleccione archivo"
          value={formData.gas_especificaciones_tecnicas || []}
          onChange={(files) => onInputChange('gas_especificaciones_tecnicas', files)}
          accept=".pdf,.doc,.docx"
          multiple
          onUpload={onFileUpload}
          documentKey="gas_especificaciones_tecnicas"
          anteproyectoId={proyectoId}
          uploadedFiles={uploadedDocuments}
        />
      </div>

      {/* Factibilidad de gas */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Factibilidad de gas
            </h5>
          </div>
          <div className="text-xs text-gray-500">
            <LuTriangle className="inline w-4 h-4 mr-1" />
          </div>
        </div>
        <FileUpload
          placeholder="Seleccione archivo"
          value={formData.gas_factibilidad_gas || []}
          onChange={(files) => onInputChange('gas_factibilidad_gas', files)}
          accept=".pdf,.doc,.docx"
          multiple
          onUpload={onFileUpload}
          documentKey="gas_factibilidad_gas"
          anteproyectoId={proyectoId}
          uploadedFiles={uploadedDocuments}
        />
      </div>

      {/* Otros Archivos */}
      {renderOtherFilesSection('gas', 'gas_otros_archivos', 'Archivos adicionales relacionados con instalaciones de gas')}
    </div>
  );

  const renderPanelesSolaresContent = () => (
    <div className="space-y-8">
      {/* Instalaciones de paneles solares */}
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Instalaciones de paneles solares
        </h4>
        <div className="space-y-6">
          {/* Planos */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.pan_planos || []}
              onChange={(files) => onInputChange('pan_planos', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="pan_planos"
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
              value={formData.pan_memoria_descriptiva || []}
              onChange={(files) => onInputChange('pan_memoria_descriptiva', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="pan_memoria_descriptiva"
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>

          {/* Especificaciones técnicas */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Especificaciones técnicas
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.pan_especificaciones_tecnicas || []}
              onChange={(files) => onInputChange('pan_especificaciones_tecnicas', files)}
              accept=".pdf,.doc,.docx"
              multiple
              onUpload={onFileUpload}
              documentKey="pan_especificaciones_tecnicas"
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>
        </div>
      </div>

      {/* Comunicaciones */}
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Comunicaciones
        </h4>
        <div className="space-y-6">
          {/* Planos */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Planos
                </h5>
              </div>
              <div className="text-xs text-gray-500">
                <LuTriangle className="inline w-4 h-4 mr-1" />
              </div>
            </div>
            <FileUpload
              placeholder="Seleccione archivo"
              value={formData.com_planos || []}
              onChange={(files) => onInputChange('com_planos', files)}
              accept=".pdf,.dwg,.dxf"
              multiple
              onUpload={onFileUpload}
              documentKey="com_planos"
              anteproyectoId={proyectoId}
              uploadedFiles={uploadedDocuments}
            />
          </div>
        </div>
      </div>

      {/* Otros Archivos */}
      {renderOtherFilesSection('paneles_solares', 'pan_otros_archivos', 'Archivos adicionales relacionados con paneles solares y comunicaciones')}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'electricas':
        return renderElectricasContent();
      case 'mecanicas':
        return renderMecanicasContent();
      case 'gas':
        return renderGasContent();
      case 'paneles_solares':
        return renderPanelesSolaresContent();
      default:
        return renderElectricasContent();
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">⚡</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Instalaciones Eléctricas
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Sube los documentos relacionados con instalaciones eléctricas.
        </p>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

