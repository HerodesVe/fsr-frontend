import { useState } from 'react';
import { LuChevronDown, LuChevronUp, LuCheck, LuX, LuMinus } from 'react-icons/lu';
import { DateInput, FileUpload, Button } from '@/components/ui';
import type { ProcesoRecursoData, ResultadoRecurso, UploadedDocument } from '@/types/gestionAnteproyecto.types';

interface ProcesoRecursoProps {
  tipo: 'reconsideracion' | 'apelacion';
  data: ProcesoRecursoData;
  gestionId: string;
  revisionIndex: number;
  uploadedDocuments: UploadedDocument[];
  disabled?: boolean;
  onToggle: (habilitado: boolean) => void;
  onChange: (field: keyof ProcesoRecursoData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function ProcesoRecurso({
  tipo,
  data,
  gestionId,
  revisionIndex,
  uploadedDocuments,
  disabled = false,
  onToggle,
  onChange,
  onFileUpload,
  onDownloadDocument
}: ProcesoRecursoProps) {
  const [isExpanded, setIsExpanded] = useState(data.habilitado);

  const titulo = tipo === 'reconsideracion' 
    ? 'Proceso de Reconsideración' 
    : 'Proceso de Apelación';

  const descripcion = tipo === 'reconsideracion'
    ? 'Si considera que la observación es incorrecta, puede solicitar una reconsideración. Plazo: 15 días hábiles.'
    : 'Si la reconsideración fue rechazada, puede presentar un recurso de apelación ante la instancia superior. Plazo: 15 días hábiles.';

  const documentKeyPrefix = `seguimiento_respuesta.revision_${revisionIndex}.${tipo}`;

  const handleToggle = () => {
    const newValue = !data.habilitado;
    onToggle(newValue);
    setIsExpanded(newValue);
  };

  const handleResultadoChange = (resultado: ResultadoRecurso) => {
    onChange('resultado', resultado);
  };

  const getResultadoButtonStyle = (resultado: ResultadoRecurso, isSelected: boolean) => {
    if (!isSelected) {
      switch (resultado) {
        case 'fundado':
          return 'text-green-600 border-green-600 hover:bg-green-50';
        case 'infundado':
          return 'text-red-600 border-red-600 hover:bg-red-50';
        case 'fundado_en_parte':
          return 'text-yellow-600 border-yellow-600 hover:bg-yellow-50';
        default:
          return '';
      }
    }
    return 'text-white';
  };

  const getResultadoButtonBgColor = (resultado: ResultadoRecurso) => {
    switch (resultado) {
      case 'fundado':
        return '#10b981';
      case 'infundado':
        return '#ef4444';
      case 'fundado_en_parte':
        return '#f59e0b';
      default:
        return '';
    }
  };

  const getResultadoIcon = (resultado: ResultadoRecurso) => {
    switch (resultado) {
      case 'fundado':
        return <LuCheck className="w-4 h-4" />;
      case 'infundado':
        return <LuX className="w-4 h-4" />;
      case 'fundado_en_parte':
        return <LuMinus className="w-4 h-4" />;
      default:
        return null;
    }
  };



  return (
    <div className={`border rounded-lg ${disabled ? 'opacity-60' : ''} ${
      data.habilitado ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'
    }`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            {titulo} (Opcional)
          </h5>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="bordered"
              onClick={handleToggle}
              disabled={disabled}
            >
              {data.habilitado ? 'Deshabilitar' : 'Habilitar'}
            </Button>
            {data.habilitado && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-200 rounded"
                disabled={disabled}
              >
                {isExpanded ? (
                  <LuChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <LuChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
          </div>
        </div>
        
        <p className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          {descripcion}
        </p>
      </div>

      {/* Contenido expandido */}
      {data.habilitado && isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 space-y-4">
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <DateInput
              label="Fecha de Presentación"
              value={data.fecha_presentacion || ''}
              onChange={(value) => onChange('fecha_presentacion', value)}
              disabled={disabled}
            />

            <div>
              <FileUpload
                label={`Documento de ${tipo === 'reconsideracion' ? 'Reconsideración' : 'Apelación'}`}
                accept=".pdf,.doc,.docx"
                onChange={(files) => onChange('documento_recurso', files)}
                onUpload={onFileUpload}
                documentKey={`${documentKeyPrefix}.documento_recurso`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments
                  .filter(doc => doc.key === `${documentKeyPrefix}.documento_recurso`)
                  .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
              />
            </div>

            <div>
              <FileUpload
                label={`Resolución de ${tipo === 'reconsideracion' ? 'Reconsideración' : 'Apelación'}`}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(files) => onChange('resolucion_recurso', files)}
                onUpload={onFileUpload}
                documentKey={`${documentKeyPrefix}.resolucion_recurso`}
                anteproyectoId={gestionId}
                uploadedFiles={uploadedDocuments
                  .filter(doc => doc.key === `${documentKeyPrefix}.resolucion_recurso`)
                  .map(doc => ({ key: doc.key || doc.id, name: doc.name, file_id: doc.id }))}
                onDownload={onDownloadDocument}
              />
            </div>
          </div>

          {/* Resultado del Recurso */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Resultado del {tipo === 'reconsideracion' ? 'Recurso de Reconsideración' : 'Recurso de Apelación'}
            </label>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={data.resultado === 'fundado' ? 'solid' : 'bordered'}
                onClick={() => handleResultadoChange('fundado')}
                startContent={getResultadoIcon('fundado')}
                style={data.resultado === 'fundado' ? { backgroundColor: getResultadoButtonBgColor('fundado') } : {}}
                className={getResultadoButtonStyle('fundado', data.resultado === 'fundado')}
                disabled={disabled}
                size="sm"
              >
                Fundado
              </Button>
              <Button
                variant={data.resultado === 'infundado' ? 'solid' : 'bordered'}
                onClick={() => handleResultadoChange('infundado')}
                startContent={getResultadoIcon('infundado')}
                style={data.resultado === 'infundado' ? { backgroundColor: getResultadoButtonBgColor('infundado') } : {}}
                className={getResultadoButtonStyle('infundado', data.resultado === 'infundado')}
                disabled={disabled}
                size="sm"
              >
                Infundado
              </Button>
              <Button
                variant={data.resultado === 'fundado_en_parte' ? 'solid' : 'bordered'}
                onClick={() => handleResultadoChange('fundado_en_parte')}
                startContent={getResultadoIcon('fundado_en_parte')}
                style={data.resultado === 'fundado_en_parte' ? { backgroundColor: getResultadoButtonBgColor('fundado_en_parte') } : {}}
                className={getResultadoButtonStyle('fundado_en_parte', data.resultado === 'fundado_en_parte')}
                disabled={disabled}
                size="sm"
              >
                Fundado en Parte
              </Button>
            </div>

            {/* Mensaje informativo según resultado */}
            {data.resultado && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                data.resultado === 'fundado' 
                  ? 'bg-green-100 text-green-800' 
                  : data.resultado === 'infundado'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {data.resultado === 'fundado' && (
                  <p>
                    <strong>Fundado:</strong> Se aceptan los argumentos presentados. 
                    {tipo === 'reconsideracion' 
                      ? ' El proceso puede continuar hacia la aprobación o requerir documentos finales.'
                      : ' El proceso puede continuar hacia la aprobación final.'}
                  </p>
                )}
                {data.resultado === 'infundado' && (
                  <p>
                    <strong>Infundado:</strong> Se rechaza el recurso. 
                    Es obligatorio realizar la subsanación de observaciones para continuar con la siguiente revisión.
                  </p>
                )}
                {data.resultado === 'fundado_en_parte' && (
                  <p>
                    <strong>Fundado en Parte:</strong> Se acepta parcialmente el recurso. 
                    Es obligatorio realizar la subsanación de las observaciones no reconsideradas.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
