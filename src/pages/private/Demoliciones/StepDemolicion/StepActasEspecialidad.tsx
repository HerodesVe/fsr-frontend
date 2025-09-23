import { useState } from 'react';
import { FileUpload, Select, DateInput } from '@/components/ui';
import type { DemolicionFormData, UploadedDocument } from '@/types/demolicion.types';

interface StepActasEspecialidadProps {
  formData: DemolicionFormData;
  demolicionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof DemolicionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

type EspecialidadTabType = 'arquitectura' | 'estructura' | 'electrica' | 'sanitaria';

export default function StepActasEspecialidad({
  formData,
  demolicionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepActasEspecialidadProps) {
  const [activeTab, setActiveTab] = useState<EspecialidadTabType>('arquitectura');

  const tabs = [
    { key: 'arquitectura' as EspecialidadTabType, label: 'Arquitectura' },
    { key: 'estructura' as EspecialidadTabType, label: 'Estructura' },
    { key: 'electrica' as EspecialidadTabType, label: 'Eléctrica' },
    { key: 'sanitaria' as EspecialidadTabType, label: 'Sanitaria' },
  ];

  const resultadoOptions = [
    { value: 'conforme', label: 'Conforme' },
    { value: 'conforme_observaciones', label: 'Conforme con observaciones' },
  ];

  const updateActasEspecialidad = (especialidad: keyof typeof formData.actas_especialidad, field: string, value: any) => {
    const actasActualizadas = {
      ...formData.actas_especialidad,
      [especialidad]: {
        ...formData.actas_especialidad[especialidad],
        [field]: value,
      },
    };
    onInputChange('actas_especialidad', actasActualizadas);
  };

  const renderArquitecturaContent = () => (
    <div className="space-y-6">
      <FileUpload
        label="Cargo de ingreso"
        placeholder="Seleccione archivo"
        value={formData.actas_especialidad.arquitectura.cargo_ingreso ? [formData.actas_especialidad.arquitectura.cargo_ingreso] : []}
        onChange={(files) => updateActasEspecialidad('arquitectura', 'cargo_ingreso', files[0])}
        accept=".pdf,.doc,.docx"
        onUpload={onFileUpload}
        documentKey="actas_arquitectura_cargo_ingreso"
        anteproyectoId={demolicionId}
        uploadedFiles={uploadedDocuments.map(doc => ({
          key: doc.id,
          name: doc.name,
          file_id: doc.id
        }))}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateInput
          label="Fecha de subida"
          placeholder="dd/mm/aaaa"
          value={formData.actas_especialidad.arquitectura.fecha_subida}
          onChange={(value) => updateActasEspecialidad('arquitectura', 'fecha_subida', value)}
        />
        <DateInput
          label="Fecha de recepción"
          placeholder="dd/mm/aaaa"
          value={formData.actas_especialidad.arquitectura.fecha_recepcion}
          onChange={(value) => updateActasEspecialidad('arquitectura', 'fecha_recepcion', value)}
        />
        <DateInput
          label="Fecha de emisión"
          placeholder="dd/mm/aaaa"
          value={formData.actas_especialidad.arquitectura.fecha_emision}
          onChange={(value) => updateActasEspecialidad('arquitectura', 'fecha_emision', value)}
        />
        <DateInput
          label="Fecha de vencimiento del plazo"
          placeholder="dd/mm/aaaa"
          value={formData.actas_especialidad.arquitectura.fecha_vencimiento}
          onChange={(value) => updateActasEspecialidad('arquitectura', 'fecha_vencimiento', value)}
        />
      </div>
      
      <Select
        label="Resultado"
        placeholder="Seleccione resultado"
        options={resultadoOptions}
        selectedKeys={formData.actas_especialidad.arquitectura.resultado ? [formData.actas_especialidad.arquitectura.resultado] : []}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as string;
          updateActasEspecialidad('arquitectura', 'resultado', value);
        }}
      />
      
      {formData.actas_especialidad.arquitectura.resultado === 'conforme_observaciones' && (
        <FileUpload
          label="Subir levantamiento de observaciones"
          placeholder="Seleccione archivo"
          value={formData.actas_especialidad.arquitectura.levantamiento_observaciones ? [formData.actas_especialidad.arquitectura.levantamiento_observaciones] : []}
          onChange={(files) => updateActasEspecialidad('arquitectura', 'levantamiento_observaciones', files[0])}
          accept=".pdf,.doc,.docx"
          onUpload={onFileUpload}
          documentKey="actas_arquitectura_levantamiento"
          anteproyectoId={demolicionId}
          uploadedFiles={uploadedDocuments.map(doc => ({
          key: doc.id,
          name: doc.name,
          file_id: doc.id
        }))}
        />
      )}
    </div>
  );

  const renderEstructuraContent = () => (
    <div className="space-y-6">
      <FileUpload
        label="Acta de estructura"
        placeholder="Seleccione archivo"
        value={formData.actas_especialidad.estructura.acta_estructura ? [formData.actas_especialidad.estructura.acta_estructura] : []}
        onChange={(files) => updateActasEspecialidad('estructura', 'acta_estructura', files[0])}
        accept=".pdf,.doc,.docx"
        onUpload={onFileUpload}
        documentKey="actas_estructura"
        anteproyectoId={demolicionId}
        uploadedFiles={uploadedDocuments.map(doc => ({
          key: doc.id,
          name: doc.name,
          file_id: doc.id
        }))}
      />
    </div>
  );

  const renderElectricaContent = () => (
    <div className="space-y-6">
      <FileUpload
        label="Acta eléctrica"
        placeholder="Seleccione archivo"
        value={formData.actas_especialidad.electrica.acta_electrica ? [formData.actas_especialidad.electrica.acta_electrica] : []}
        onChange={(files) => updateActasEspecialidad('electrica', 'acta_electrica', files[0])}
        accept=".pdf,.doc,.docx"
        onUpload={onFileUpload}
        documentKey="actas_electrica"
        anteproyectoId={demolicionId}
        uploadedFiles={uploadedDocuments.map(doc => ({
          key: doc.id,
          name: doc.name,
          file_id: doc.id
        }))}
      />
    </div>
  );

  const renderSanitariaContent = () => (
    <div className="space-y-6">
      <FileUpload
        label="Acta sanitaria"
        placeholder="Seleccione archivo"
        value={formData.actas_especialidad.sanitaria.acta_sanitaria ? [formData.actas_especialidad.sanitaria.acta_sanitaria] : []}
        onChange={(files) => updateActasEspecialidad('sanitaria', 'acta_sanitaria', files[0])}
        accept=".pdf,.doc,.docx"
        onUpload={onFileUpload}
        documentKey="actas_sanitaria"
        anteproyectoId={demolicionId}
        uploadedFiles={uploadedDocuments.map(doc => ({
          key: doc.id,
          name: doc.name,
          file_id: doc.id
        }))}
      />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'arquitectura':
        return renderArquitecturaContent();
      case 'estructura':
        return renderEstructuraContent();
      case 'electrica':
        return renderElectricaContent();
      case 'sanitaria':
        return renderSanitariaContent();
      default:
        return renderArquitecturaContent();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Actas por Especialidad
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestión de actas de cada especialidad
        </p>
      </div>

      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
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
