import { useState, useMemo } from 'react';
import { LuSearch, LuFileText, LuUpload, LuCalendar, LuUser } from 'react-icons/lu';
import { Button, Input, FileUpload } from '@/components/ui';
import StepAdministrado from '@/components/utils/Steps/StepAdministrado';
import { useClients } from '@/hooks/useClients';
import { useAnteproyectos } from '@/hooks/useAnteproyectos';
import type { GestionAnteproyectoFormData, UploadedDocument } from '@/types/gestionAnteproyecto.types';

interface StepSeleccionAnteproyectoProps {
  formData: GestionAnteproyectoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof GestionAnteproyectoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepSeleccionAnteproyecto({
  formData,
  errors,
  gestionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument
}: StepSeleccionAnteproyectoProps) {
  const [modoSeleccion, setModoSeleccion] = useState<'buscar' | 'cargar'>('buscar');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { clients } = useClients();
  const { anteproyectos, isLoading: isLoadingAnteproyectos } = useAnteproyectos();

  // Filtrar anteproyectos según el término de búsqueda
  const filteredAnteproyectos = useMemo(() => {
    if (!anteproyectos) return [];
    
    if (!searchTerm.trim()) return anteproyectos;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return anteproyectos.filter((anteproyecto) => {
      const nombreProyecto = anteproyecto.data?.nombre_proyecto?.toLowerCase() || '';
      const instanceCode = anteproyecto.instance_code?.toLowerCase() || '';
      
      return nombreProyecto.includes(lowerSearchTerm) || 
             instanceCode.includes(lowerSearchTerm);
    });
  }, [anteproyectos, searchTerm]);

  // Documentos requeridos para anteproyecto externo
  const documentosRequeridos = [
    { key: 'partida_registral', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.partida_registral', label: 'Partida Registral SUNARP', required: true },
    { key: 'certificado_parametro_municipal', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.certificado_parametro_municipal', label: 'Certificado de Parámetro Municipal', required: true },
    { key: 'plano_ubicacion', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.plano_ubicacion', label: 'Planos de Ubicación', required: true },
    { key: 'plano_arquitectura', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.plano_arquitectura', label: 'Planos de Arquitectura', required: true },
    { key: 'plano_seguridad', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.plano_seguridad', label: 'Planos de Seguridad', required: true },
    { key: 'memoria_descriptiva_arquitectura', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.memoria_descriptiva_arquitectura', label: 'Memoria Descriptiva de Arquitectura', required: true },
    { key: 'memoria_descriptiva_seguridad', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.memoria_descriptiva_seguridad', label: 'Memoria Descriptiva de Seguridad', required: true },
    { key: 'formulario_unico_edificacion', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.formulario_unico_edificacion', label: 'Formulario Único de Edificación (FUE)', required: true },
    { key: 'presupuesto', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.presupuesto', label: 'Presupuesto de Obra (Añadir la palabra Obra)', required: true },
    { key: 'pago_derecho_revision_cap', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.pago_derecho_revision_cap', label: 'Pago por Derecho de Revisión al CAP', required: true },
    { key: 'factura', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.factura', label: 'Factura del pago realizado al CAP​', required: true },
    { key: 'liquidacion', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.liquidacion', label: 'Liquidación del pago realizado al CAP​', required: true },
    { key: 'otros_documentos', documentKey: 'seleccion_anteproyecto.anteproyecto_externo_docs.otros_documentos', label: 'Otros Documentos', required: true },
  ];

  // Convertir formData para StepAdministrado
  const formDataForAdmin = {
    ...formData,
    selectedClient: clients?.find(c => c.id === formData.client_id) || null,
  };

  // Handler para cambios del StepAdministrado
  const handleAdministradoChange = (field: string, value: any) => {
    if (field === 'selectedClient') {
      onInputChange('client_id', value?.id || '');
    } else {
      onInputChange(field as keyof GestionAnteproyectoFormData, value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step de Administrado */}
      <StepAdministrado
        formData={formDataForAdmin}
        clients={clients}
        errors={errors}
        onInputChange={handleAdministradoChange}
        title="Paso 1: Vincular administrado y nombrar al anteproyecto​"
        description="Seleccione el administrado y defina el nombre del anteproyecto para iniciar la gestión del mismo​"
        showProjectName={true}
        label="Nombre del Anteproyecto"
        placeholder="Ingrese el nombre del anteproyecto..."
      />

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Selección del Anteproyecto a Gestionar
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione un anteproyecto existente o cargue los documentos de un anteproyecto externo.
        </p>
      </div>

      {/* Selector de modo */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <Button
          variant={modoSeleccion === 'buscar' ? 'solid' : 'bordered'}
          onClick={() => setModoSeleccion('buscar')}
          startContent={<LuSearch className="w-4 h-4" />}
          style={modoSeleccion === 'buscar' ? { backgroundColor: 'var(--primary-color)' } : {}}
          className={modoSeleccion === 'buscar' ? 'text-white' : ''}
        >
          Buscar Anteproyecto Existente
        </Button>
        <Button
          variant={modoSeleccion === 'cargar' ? 'solid' : 'bordered'}
          onClick={() => setModoSeleccion('cargar')}
          startContent={<LuUpload className="w-4 h-4" />}
          style={modoSeleccion === 'cargar' ? { backgroundColor: 'var(--primary-color)' } : {}}
          className={modoSeleccion === 'cargar' ? 'text-white' : ''}
        >
          Cargar Anteproyecto Externo
        </Button>
      </div>

      {/* Contenido según el modo seleccionado */}
      {modoSeleccion === 'buscar' ? (
        <div className="space-y-4">
          <div>
            <Input
              label="Buscar Anteproyecto"
              placeholder="Ingrese el nombre o código del anteproyecto​..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<LuSearch className="w-4 h-4 text-gray-400" />}
            />
          </div>
          
          {/* Lista de anteproyectos disponibles */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Anteproyectos Disponibles {filteredAnteproyectos.length > 0 && `(${filteredAnteproyectos.length})`}
            </h4>
            
            {isLoadingAnteproyectos ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border rounded-lg p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredAnteproyectos.length === 0 ? (
              <div className="text-center py-8">
                <LuFileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {searchTerm ? 'No se encontraron anteproyectos que coincidan con la búsqueda' : 'No hay anteproyectos disponibles'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAnteproyectos.map((anteproyecto) => {
                  const isSelected = formData.selectedAnteproyecto?.id === anteproyecto.id;
                  const clientName = clients?.find(c => c.id === anteproyecto.client_id)?.names || 'Cliente no especificado';
                  
                  return (
                    <div
                      key={anteproyecto.id}
                      className={`p-3 bg-white border rounded-lg transition-all ${
                        isSelected 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'hover:border-teal-300 cursor-pointer'
                      }`}
                      onClick={() => !isSelected && onInputChange('selectedAnteproyecto', {
                        id: anteproyecto.id,
                        nombre: anteproyecto.data?.nombre_proyecto,
                        codigo: anteproyecto.instance_code
                      })}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <LuFileText className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-gray-500'}`} />
                            <span className={`font-medium ${isSelected ? 'text-teal-900' : 'text-gray-900'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                              {anteproyecto.data?.nombre_proyecto || 'Proyecto sin nombre'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 ml-6">
                            <p className="text-sm text-gray-600 flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <span className="font-medium">Código:</span> {anteproyecto.instance_code}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <LuUser className="w-3 h-3" />
                              {clientName}
                            </p>
                            {anteproyecto.created_at && (
                              <p className="text-sm text-gray-600 flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <LuCalendar className="w-3 h-3" />
                                {new Date(anteproyecto.created_at).toLocaleDateString('es-ES')}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                anteproyecto.status === 'completado' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {anteproyecto.status === 'completado' ? 'Completado' : 'En proceso'}
                              </span>
                              {anteproyecto.progress_percentage !== undefined && (
                                <span className="text-xs text-gray-500">
                                  {anteproyecto.progress_percentage}% completado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={isSelected ? 'solid' : 'bordered'}
                          style={isSelected ? { backgroundColor: 'var(--primary-color)' } : {}}
                          className={isSelected ? 'text-white' : ''}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSelected) {
                              onInputChange('selectedAnteproyecto', {
                                id: anteproyecto.id,
                                nombre: anteproyecto.data?.nombre_proyecto,
                                codigo: anteproyecto.instance_code
                              });
                            }
                          }}
                        >
                          {isSelected ? 'Seleccionado' : 'Seleccionar'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Documentos Requeridos para Anteproyecto Externo
            </h4>
            <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Todos los siguientes documentos son obligatorios para procesar un anteproyecto externo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {documentosRequeridos.map((documento) => (
              <div key={documento.key}>
                <FileUpload
                  label={documento.label}
                  required={documento.required}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                  onChange={(files) => onInputChange(documento.key as keyof GestionAnteproyectoFormData, files)}
                  onUpload={onFileUpload}
                  documentKey={documento.documentKey}
                  anteproyectoId={gestionId}
                  uploadedFiles={uploadedDocuments.filter(doc => doc.key === documento.documentKey).map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                  onDownload={onDownloadDocument}
                  error={errors[documento.key]}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de selección */}
      {formData.selectedAnteproyecto && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Anteproyecto Seleccionado
          </h4>
          <div className="flex items-center gap-2">
            <LuFileText className="w-4 h-4 text-green-600" />
            <span className="text-green-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.selectedAnteproyecto.nombre || 'Anteproyecto seleccionado'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
