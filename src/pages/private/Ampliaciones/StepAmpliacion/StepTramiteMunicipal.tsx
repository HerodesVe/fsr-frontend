import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { DateInput, Select, FileUpload, Input, Button } from '@/components/ui';
import type { AmpliacionFormData, UploadedDocument, SeguimientoItem } from '@/types/ampliacion.types';

interface StepTramiteMunicipalProps {
  formData: AmpliacionFormData;
  errors: Record<string, string>;
  ampliacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof AmpliacionFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepTramiteMunicipal({
  formData,
  errors,
  ampliacionId,
  onInputChange,
  onFileUpload,
}: StepTramiteMunicipalProps) {
  const addNewSeguimiento = () => {
    const newEntry: SeguimientoItem = {
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0],
      metodo: 'llamada',
      comentario: ''
    };
    
    const updatedSeguimiento = [...(formData.seguimiento || []), newEntry];
    onInputChange('seguimiento', updatedSeguimiento);
  };

  const updateSeguimiento = (id: string, field: keyof SeguimientoItem, value: string) => {
    const updatedSeguimiento = formData.seguimiento.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onInputChange('seguimiento', updatedSeguimiento);
  };

  const removeSeguimiento = (id: string) => {
    const updatedSeguimiento = formData.seguimiento.filter(item => item.id !== id);
    onInputChange('seguimiento', updatedSeguimiento);
  };

  return (
    <div className="space-y-8">
      {/* Proceso y Trámite */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Proceso y Trámite en Municipalidad
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre las fechas y documentos del proceso municipal
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateInput
            label="Fecha de Ingreso a Municipalidad"
            value={formData.fecha_ingreso_municipalidad}
            onChange={(value) => onInputChange('fecha_ingreso_municipalidad', value)}
            error={errors.fecha_ingreso_municipalidad}
          />

          <div className="md:col-start-1 md:col-end-3">
            <FileUpload
              label="Cargo de Ingreso"
              placeholder="Seleccione archivo"
              onChange={(files) => onInputChange('cargo_ingreso', files)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onUpload={onFileUpload}
              documentKey="cargo_ingreso"
              anteproyectoId={ampliacionId}
              uploadedFiles={formData.cargo_ingreso}
              error={errors.cargo_ingreso}
            />
          </div>

          <DateInput
            label="Fecha de Pase a Comisión Técnica"
            value={formData.fecha_comision}
            onChange={(value) => onInputChange('fecha_comision', value)}
            error={errors.fecha_comision}
          />

          <Select
            label="Dictamen de Comisión"
            placeholder="Seleccione el dictamen"
            options={[
              { value: 'conforme', label: 'Conforme' },
              { value: 'no-conforme', label: 'No Conforme (Requiere subsanación)' },
            ]}
            selectedKeys={formData.dictamen_comision ? [formData.dictamen_comision] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as 'conforme' | 'no-conforme';
              onInputChange('dictamen_comision', value || 'conforme');
            }}
            error={errors.dictamen_comision}
          />

          <div className="md:col-start-1 md:col-end-3">
            <FileUpload
              label="Acta de Comisión Técnica"
              placeholder="Seleccione archivo"
              onChange={(files) => onInputChange('acta_comision', files)}
              accept=".pdf,.doc,.docx"
              onUpload={onFileUpload}
              documentKey="acta_comision"
              anteproyectoId={ampliacionId}
              uploadedFiles={formData.acta_comision}
              error={errors.acta_comision}
            />
          </div>
        </div>
      </div>

      {/* Historial de Seguimiento */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-md font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Historial de Seguimiento
            </h4>
            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Registre las gestiones y comunicaciones realizadas con la municipalidad
            </p>
          </div>
          <Button
            onClick={addNewSeguimiento}
            style={{ backgroundColor: 'var(--primary-color)' }}
            className="text-white hover:opacity-90"
            startContent={<LuPlus className="w-4 h-4" />}
            size="sm"
          >
            Nuevo Registro
          </Button>
        </div>

        <div className="space-y-4">
          {formData.seguimiento && formData.seguimiento.length > 0 ? (
            formData.seguimiento.map((item) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-2">
                    <DateInput
                      label="Fecha"
                      value={item.fecha}
                      onChange={(value) => updateSeguimiento(item.id, 'fecha', value)}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Select
                      label="Método"
                      placeholder="Seleccione"
                      options={[
                        { value: 'llamada', label: 'Llamada' },
                        { value: 'presencial', label: 'Presencial' },
                        { value: 'web', label: 'Portal Web' },
                      ]}
                      selectedKeys={item.metodo ? [item.metodo] : []}
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;
                        updateSeguimiento(item.id, 'metodo', value || 'llamada');
                      }}
                      size="sm"
                    />
                  </div>
                  
                  <div className="md:col-span-7">
                    <Input
                      label="Comentarios"
                      placeholder="Ej: Se habló con Arq. Ramos, indica que pasará a comisión el día viernes."
                      value={item.comentario}
                      onChange={(e) => updateSeguimiento(item.id, 'comentario', e.target.value)}
                      size="sm"
                    />
                  </div>
                  
                  <div className="md:col-span-1 flex items-end justify-center">
                    <Button
                      onClick={() => removeSeguimiento(item.id)}
                      variant="bordered"
                      className="text-red-500 border-red-300 hover:bg-red-50"
                      size="sm"
                      startContent={<LuTrash2 className="w-4 h-4" />}
                    >
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p style={{ fontFamily: 'Inter, sans-serif' }}>
                No hay registros de seguimiento.
              </p>
              <p className="text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Haga clic en "Nuevo Registro" para agregar el primer seguimiento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
