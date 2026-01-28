import { useState } from 'react';
import { LuFileText, LuMapPin, LuBuilding, LuFolder } from 'react-icons/lu';
import { Input, Select, FileUpload } from '@/components/ui';
import type { GestionAnteproyectoFormData, UploadedDocument } from '@/types/gestionAnteproyecto.types';

interface AnteproyectoExternoFormProps {
  formData: GestionAnteproyectoFormData;
  gestionId: string;
  uploadedDocuments: UploadedDocument[];
  errors: Record<string, string>;
  departments: { id: string; name: string }[];
  provinces: { id: string; name: string }[];
  districts: { id: string; name: string }[];
  onInputChange: (field: keyof GestionAnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

type TabKey = 'tipo_obra' | 'predio' | 'documentos_admin' | 'documentos_fsr';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  shortLabel: string;
}

const TABS: Tab[] = [
  { key: 'tipo_obra', label: 'Tipo de Obra', shortLabel: 'Obra', icon: <LuBuilding className="w-4 h-4" /> },
  { key: 'predio', label: 'Datos del Predio', shortLabel: 'Predio', icon: <LuMapPin className="w-4 h-4" /> },
  { key: 'documentos_admin', label: 'Docs. Administrado', shortLabel: 'Admin', icon: <LuFolder className="w-4 h-4" /> },
  { key: 'documentos_fsr', label: 'Docs. FSR', shortLabel: 'FSR', icon: <LuFileText className="w-4 h-4" /> },
];

export default function AnteproyectoExternoForm({
  formData,
  gestionId,
  uploadedDocuments,
  errors,
  departments,
  provinces,
  districts,
  onInputChange,
  onFileUpload,
  onDownloadDocument,
}: AnteproyectoExternoFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('tipo_obra');

  const docKeyPrefix = 'seleccion_anteproyecto.anteproyecto_externo_docs';

  // Opciones para selects
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

  const departmentOptions = departments?.map(dept => ({
    value: dept.id,
    label: dept.name,
  })) || [];

  const provinceOptions = provinces?.map(prov => ({
    value: prov.id,
    label: prov.name,
  })) || [];

  const districtOptions = districts?.map(dist => ({
    value: dist.id,
    label: dist.name,
  })) || [];

  // Renderizar contenido según tab activo
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tipo_obra':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Tipo de Obra y Modalidad
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  required
                />

                <Select
                  label="Modalidad de Aprobación"
                  placeholder="Seleccionar modalidad"
                  options={modalidadOptions}
                  selectedKeys={formData.tipo_modalidad ? [formData.tipo_modalidad] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    onInputChange('tipo_modalidad', value || '');
                  }}
                  error={errors.tipo_modalidad}
                  required
                />
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Normativa Aplicable
              </h4>
              <div className="space-y-4">
                <Input
                  label="Link de normativa aplicable"
                  placeholder="Pegar el link de la normativa"
                  value={formData.link_normativas || ''}
                  onChange={(e) => onInputChange('link_normativas', e.target.value)}
                />

                <FileUpload
                  label="Archivo de Normativa"
                  placeholder="Seleccione archivo"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onUpload={onFileUpload}
                  documentKey={`${docKeyPrefix}.archivo_normativo`}
                  anteproyectoId={gestionId}
                  uploadedFiles={uploadedDocuments}
                  onDownload={onDownloadDocument}
                />
              </div>
            </div>
          </div>
        );

      case 'predio':
        return (
          <div className="space-y-6">
            {/* Ubicación */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Ubicación del Predio
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Select
                  label="Departamento"
                  placeholder="Seleccionar"
                  options={departmentOptions}
                  selectedKeys={formData.departmentId ? [formData.departmentId] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    onInputChange('departmentId', value || '');
                    onInputChange('provinceId', '');
                    onInputChange('districtId', '');
                  }}
                  error={errors.departmentId}
                  required
                />

                <Select
                  label="Provincia"
                  placeholder="Seleccionar"
                  options={provinceOptions}
                  selectedKeys={formData.provinceId ? [formData.provinceId] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    onInputChange('provinceId', value || '');
                    onInputChange('districtId', '');
                  }}
                  error={errors.provinceId}
                  disabled={!formData.departmentId}
                  required
                />

                <Select
                  label="Distrito"
                  placeholder="Seleccionar"
                  options={districtOptions}
                  selectedKeys={formData.districtId ? [formData.districtId] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    onInputChange('districtId', value || '');
                  }}
                  error={errors.districtId}
                  disabled={!formData.provinceId}
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <Input
                  label="Urbanización / A.H."
                  placeholder="Ingrese"
                  value={formData.urbanization || ''}
                  onChange={(e) => onInputChange('urbanization', e.target.value)}
                  error={errors.urbanization}
                  required
                />
                <Input
                  label="Mz"
                  placeholder="Mz"
                  value={formData.mz || ''}
                  onChange={(e) => onInputChange('mz', e.target.value)}
                />
                <Input
                  label="Lote"
                  placeholder="Lote"
                  value={formData.lote || ''}
                  onChange={(e) => onInputChange('lote', e.target.value)}
                />
                <Input
                  label="Sub Lote"
                  placeholder="Sub Lote"
                  value={formData.subLote || ''}
                  onChange={(e) => onInputChange('subLote', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Av. / Jr. / Calle"
                  placeholder="Ingrese vía"
                  value={formData.street || ''}
                  onChange={(e) => onInputChange('street', e.target.value)}
                  error={errors.street}
                  required
                />
                <Input
                  label="Número"
                  placeholder="Número"
                  value={formData.number || ''}
                  onChange={(e) => onInputChange('number', e.target.value)}
                />
                <Input
                  label="Interior"
                  placeholder="Interior"
                  value={formData.interior || ''}
                  onChange={(e) => onInputChange('interior', e.target.value)}
                />
              </div>
            </div>

            {/* Medidas */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Área y Medidas Perimétricas
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                <Input
                  label="Área Total (m²)"
                  placeholder="0.00"
                  value={formData.area_total_m2?.toString() || ''}
                  onChange={(e) => onInputChange('area_total_m2', parseFloat(e.target.value) || 0)}
                  error={errors.area_total_m2}
                  numbersOnly
                  required
                />
                <Input
                  label="Frente (m)"
                  placeholder="0.00"
                  value={formData.frente?.toString() || ''}
                  onChange={(e) => onInputChange('frente', parseFloat(e.target.value) || 0)}
                  numbersOnly
                />
                <Input
                  label="Derecha (m)"
                  placeholder="0.00"
                  value={formData.derecha?.toString() || ''}
                  onChange={(e) => onInputChange('derecha', parseFloat(e.target.value) || 0)}
                  numbersOnly
                />
                <Input
                  label="Izquierda (m)"
                  placeholder="0.00"
                  value={formData.izquierda?.toString() || ''}
                  onChange={(e) => onInputChange('izquierda', parseFloat(e.target.value) || 0)}
                  numbersOnly
                />
                <Input
                  label="Fondo (m)"
                  placeholder="0.00"
                  value={formData.fondo?.toString() || ''}
                  onChange={(e) => onInputChange('fondo', parseFloat(e.target.value) || 0)}
                  numbersOnly
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Latitud"
                  placeholder="Coordenada"
                  value={formData.latitud?.toString() || ''}
                  onChange={(e) => onInputChange('latitud', parseFloat(e.target.value) || 0)}
                  numbersOnly
                />
                <Input
                  label="Longitud"
                  placeholder="Coordenada"
                  value={formData.longitud?.toString() || ''}
                  onChange={(e) => onInputChange('longitud', parseFloat(e.target.value) || 0)}
                  numbersOnly
                />
              </div>
            </div>

            {/* Edificación */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Características de la Edificación
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Input
                  label="Tipo de Edificación"
                  placeholder="Ej: Vivienda multifamiliar"
                  value={formData.tipo_edificacion || ''}
                  onChange={(e) => onInputChange('tipo_edificacion', e.target.value)}
                  error={errors.tipo_edificacion}
                />
                <Input
                  label="Número de Pisos"
                  placeholder="0"
                  value={formData.numero_pisos?.toString() || ''}
                  onChange={(e) => onInputChange('numero_pisos', parseInt(e.target.value) || 0)}
                  numbersOnly
                />
                <Input
                  label="Área Techada (m²)"
                  placeholder="0.00"
                  value={formData.area_techada_total_m2?.toString() || ''}
                  onChange={(e) => onInputChange('area_techada_total_m2', parseFloat(e.target.value) || 0)}
                  numbersOnly
                />
                <Input
                  label="Área Libre (m²)"
                  placeholder="0.00"
                  value={formData.area_libre_m2?.toString() || ''}
                  onChange={(e) => onInputChange('area_libre_m2', parseFloat(e.target.value) || 0)}
                  numbersOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Descripción del Proyecto
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm"
                  rows={3}
                  placeholder="Describe brevemente el proyecto"
                  value={formData.descripcion_proyecto || ''}
                  onChange={(e) => onInputChange('descripcion_proyecto', e.target.value)}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>
          </div>
        );

      case 'documentos_admin':
        return (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos proporcionados por el Administrado
            </h4>
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Adjunte los documentos necesarios para el expediente
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FileUpload
                label="Partida Registral (SUNARP)"
                placeholder="Seleccione archivo"
                accept=".pdf"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.partida_registral`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Certificado de Parámetros Urbanísticos"
                placeholder="Seleccione archivo"
                accept=".pdf"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.certificado_parametro_municipal`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Croquis o Plano de Ubicación"
                placeholder="Seleccione archivo"
                accept=".pdf,.dwg"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.plano_ubicacion`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Cabida Arquitectónica"
                placeholder="Seleccione archivo"
                accept=".pdf,.dwg"
                multiple
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.cabida_arquitectonica`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Vigencia de Poder"
                placeholder="Seleccione archivo"
                accept=".pdf"
                multiple
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.vigencia_poder`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Otros Documentos del Administrado"
                placeholder="Seleccione archivo"
                accept=".pdf,.doc,.docx,.xlsx,.xls,.dwg"
                multiple
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.otros_documentos_administrado`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />
            </div>
          </div>
        );

      case 'documentos_fsr':
        return (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos elaborados por FSR
            </h4>
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Adjunte los documentos técnicos del expediente
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FileUpload
                label="Memoria Descriptiva de Arquitectura"
                placeholder="Seleccione archivo"
                accept=".pdf,.doc,.docx"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.memoria_descriptiva_arquitectura`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Memoria Descriptiva de Seguridad"
                placeholder="Seleccione archivo"
                accept=".pdf,.doc,.docx"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.memoria_descriptiva_seguridad`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="FUE (Formulario Único de Edificación)"
                placeholder="Seleccione archivo"
                accept=".pdf"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.formulario_unico_edificacion`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Presupuesto de Obra"
                placeholder="Seleccione archivo"
                accept=".pdf,.xlsx,.xls"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.presupuesto`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Planos de Seguridad"
                placeholder="Seleccione archivo"
                accept=".pdf,.dwg"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.plano_seguridad`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Planos de Arquitectura"
                placeholder="Seleccione archivo"
                accept=".pdf,.dwg"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.plano_arquitectura`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Pago por Derecho de Revisión al CAP"
                placeholder="Seleccione archivo"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.pago_derecho_revision_cap`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Factura del pago al CAP"
                placeholder="Seleccione archivo"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.factura`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Liquidación del pago al CAP"
                placeholder="Seleccione archivo"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                required
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.liquidacion`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />

              <FileUpload
                label="Otros Documentos FSR"
                placeholder="Seleccione archivo"
                accept=".pdf,.doc,.docx,.xlsx,.xls,.dwg"
                multiple
                onUpload={onFileUpload}
                documentKey={`${docKeyPrefix}.otros_documentos_fsr`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments}
                onDownload={onDownloadDocument}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Datos del Anteproyecto Externo
        </h4>
        <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
          Complete la información del anteproyecto externo. Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
        </p>
      </div>

      {/* Tabs responsivos */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-1" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors
                ${activeTab === tab.key
                  ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido del tab */}
      <div className="pt-4">
        {renderTabContent()}
      </div>
    </div>
  );
}
