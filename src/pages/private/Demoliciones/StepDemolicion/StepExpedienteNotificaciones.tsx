import { useState } from 'react';
import { LuPlus, LuX, LuClock } from 'react-icons/lu';
import { Input, Select, FileUpload, DateInput, Textarea } from '@/components/ui';
import type { DemolicionFormData, UploadedDocument, CitaTecnico } from '@/types/demolicion.types';

interface StepExpedienteNotificacionesProps {
  formData: DemolicionFormData;
  demolicionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof DemolicionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepExpedienteNotificaciones({
  formData,
  demolicionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepExpedienteNotificacionesProps) {
  const [funcionarios] = useState([
    { value: 'funcionario1', label: 'Juan Pérez - Arquitecto' },
    { value: 'funcionario2', label: 'María García - Ingeniera' },
    { value: 'funcionario3', label: 'Carlos López - Supervisor' },
  ]);

  const addCitaTecnico = () => {
    const nuevaCita: CitaTecnico = {
      id: Date.now().toString(),
      fecha: '',
      hora: '',
      motivo: '',
      enlace_reunion: '',
    };
    onInputChange('citas_tecnico', [...formData.citas_tecnico, nuevaCita]);
  };

  const removeCitaTecnico = (id: string) => {
    const citasActualizadas = formData.citas_tecnico.filter(cita => cita.id !== id);
    onInputChange('citas_tecnico', citasActualizadas);
  };

  const updateCitaTecnico = (id: string, field: keyof CitaTecnico, value: string) => {
    const citasActualizadas = formData.citas_tecnico.map(cita => 
      cita.id === id ? { ...cita, [field]: value } : cita
    );
    onInputChange('citas_tecnico', citasActualizadas);
  };

  return (
    <div className="space-y-8">
      {/* Header con icono */}
      <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Expediente y Notificaciones
          </h3>
        </div>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Gestión del expediente municipal y notificaciones
        </p>
      </div>

      {/* ¿Se ingresó el expediente a la municipalidad? */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          ¿Se ingresó el expediente a la municipalidad?
        </p>
        <div className="flex gap-6 mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="expediente_ingresado"
              checked={formData.expediente_ingresado === true}
              onChange={() => onInputChange('expediente_ingresado', true)}
              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>Sí</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="expediente_ingresado"
              checked={formData.expediente_ingresado === false}
              onChange={() => onInputChange('expediente_ingresado', false)}
              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>No</span>
          </label>
        </div>

        {/* Cargo de ingreso y Número de expediente */}
        {formData.expediente_ingresado && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FileUpload
                  label="Cargo de ingreso"
                  placeholder="Seleccione archivo"
                  value={formData.cargo_ingreso ? [formData.cargo_ingreso] : []}
                  onChange={(files) => onInputChange('cargo_ingreso', files[0])}
                  accept=".pdf,.doc,.docx"
                  onUpload={onFileUpload}
                  documentKey="cargo_ingreso"
                  anteproyectoId={demolicionId}
                  uploadedFiles={uploadedDocuments.map(doc => ({
                    key: doc.id,
                    name: doc.name,
                    file_id: doc.id
                  }))}
                />
              </div>
              <div>
                <Input
                  label="Número de expediente"
                  placeholder="Ej. EXP-2023-1234"
                  value={formData.numero_expediente}
                  onChange={(e) => onInputChange('numero_expediente', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Ingrese el número de expediente asignado por la municipalidad
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notificación del Expediente - Primera Instancia */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Notificación del Expediente
        </h4>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Suba el documento de notificación y registre las fechas importantes
        </p>
        
        <div className="space-y-6">
          <FileUpload
            label="Consulta al ministerio"
            placeholder="Seleccione archivo"
            value={formData.consulta_ministerio ? [formData.consulta_ministerio] : []}
            onChange={(files) => onInputChange('consulta_ministerio', files[0])}
            accept=".pdf,.doc,.docx"
            onUpload={onFileUpload}
            documentKey="consulta_ministerio"
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
              value={formData.fecha_subida}
              onChange={(value) => onInputChange('fecha_subida', value)}
            />
            <DateInput
              label="Fecha de recepción"
              placeholder="dd/mm/aaaa"
              value={formData.fecha_recepcion}
              onChange={(value) => onInputChange('fecha_recepcion', value)}
            />
            <DateInput
              label="Fecha de emisión"
              placeholder="dd/mm/aaaa"
              value={formData.fecha_emision}
              onChange={(value) => onInputChange('fecha_emision', value)}
            />
            <DateInput
              label="Fecha de vencimiento del plazo"
              placeholder="dd/mm/aaaa"
              value={formData.fecha_vencimiento}
              onChange={(value) => onInputChange('fecha_vencimiento', value)}
            />
          </div>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            Calculado automáticamente (10-15 días después de la fecha de recepción)
          </p>
        </div>
      </div>

      {/* Notificación del Expediente - Segunda Instancia */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Notificación del Expediente
        </h4>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Suba el documento de notificación y registre las fechas importantes
        </p>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateInput
              label="Fecha"
              placeholder="dd/mm/aaaa"
              value={formData.fecha_notificacion}
              onChange={(value) => onInputChange('fecha_notificacion', value)}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Hora
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.hora_notificacion}
                  onChange={(e) => onInputChange('hora_notificacion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-100"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <LuClock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <Textarea
            label="Motivo"
            placeholder="Describe el motivo de la cita"
            value={formData.motivo_notificacion}
            onChange={(e) => onInputChange('motivo_notificacion', e.target.value)}
            rows={3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Con quién"
              placeholder="Seleccione funcionario"
              options={funcionarios}
              selectedKeys={formData.funcionario ? [formData.funcionario] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                onInputChange('funcionario', value || '');
              }}
            />
            <FileUpload
              label="Documento relacionado"
              placeholder="Seleccione archivo"
              value={formData.documento_relacionado ? [formData.documento_relacionado] : []}
              onChange={(files) => onInputChange('documento_relacionado', files[0])}
              accept=".pdf,.doc,.docx"
              onUpload={onFileUpload}
              documentKey="documento_relacionado"
              anteproyectoId={demolicionId}
              uploadedFiles={uploadedDocuments.map(doc => ({
              key: doc.id,
              name: doc.name,
              file_id: doc.id
            }))}
            />
          </div>
        </div>
      </div>

      {/* Levantamiento de Observaciones */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Levantamiento de Observaciones
        </h4>
        <div className="flex gap-6 mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="levantamiento_presentado"
              checked={formData.levantamiento_presentado === true}
              onChange={() => onInputChange('levantamiento_presentado', true)}
              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Sí, se presentó el levantamiento
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="levantamiento_presentado"
              checked={formData.levantamiento_presentado === false}
              onChange={() => onInputChange('levantamiento_presentado', false)}
              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              No se ha presentado aún
            </span>
          </label>
        </div>
        
        {formData.levantamiento_presentado && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DateInput
                label="Fecha de presentación"
                placeholder="dd/mm/aaaa"
                value={formData.fecha_presentacion}
                onChange={(value) => onInputChange('fecha_presentacion', value)}
              />
              <FileUpload
                label="Documento relacionado"
                placeholder="Seleccione archivo"
                value={formData.documento_levantamiento ? [formData.documento_levantamiento] : []}
                onChange={(files) => onInputChange('documento_levantamiento', files[0])}
                accept=".pdf,.doc,.docx"
                onUpload={onFileUpload}
                documentKey="documento_levantamiento"
                anteproyectoId={demolicionId}
                uploadedFiles={uploadedDocuments.map(doc => ({
              key: doc.id,
              name: doc.name,
              file_id: doc.id
            }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Citas con el Equipo Técnico del Cliente */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Citas con el Equipo Técnico del Cliente
            </h4>
            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Registre las reuniones programadas con el equipo técnico
            </p>
          </div>
          <button
            type="button"
            onClick={addCitaTecnico}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <LuPlus className="w-4 h-4" />
            Agregar cita
          </button>
        </div>
        
        <div className="space-y-6">
          {formData.citas_tecnico.map((cita, index) => (
            <div key={cita.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h5 className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cita {index + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => removeCitaTecnico(cita.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <LuX className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <DateInput
                  label="Fecha"
                  placeholder="dd/mm/aaaa"
                  value={cita.fecha}
                  onChange={(value) => updateCitaTecnico(cita.id, 'fecha', value)}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Hora
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={cita.hora}
                      onChange={(e) => updateCitaTecnico(cita.id, 'hora', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <LuClock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <Textarea
                  label="Motivo"
                  placeholder="Describe el motivo de la cita"
                  value={cita.motivo}
                  onChange={(e) => updateCitaTecnico(cita.id, 'motivo', e.target.value)}
                  rows={3}
                />
                <Input
                  label="Enlace de reunión"
                  placeholder="Ingrese enlace de la reunión"
                  value={cita.enlace_reunion}
                  onChange={(e) => updateCitaTecnico(cita.id, 'enlace_reunion', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          {formData.citas_tecnico.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p style={{ fontFamily: 'Inter, sans-serif' }}>
                No hay citas registradas. Haga clic en "Agregar cita" para comenzar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
