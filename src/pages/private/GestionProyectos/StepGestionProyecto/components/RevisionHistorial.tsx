import { useState } from 'react';
import { LuChevronDown, LuChevronUp, LuCheck, LuX, LuClock, LuFileText, LuInfo } from 'react-icons/lu';
import type { RevisionEspecialidadData } from '@/types/gestionProyecto.types';

interface RevisionHistorialProps {
  revisiones: RevisionEspecialidadData[];
  especialidadNombre: string;
  onRevisionClick?: (index: number) => void;
}

export default function RevisionHistorial({
  revisiones,
  especialidadNombre,
  onRevisionClick
}: RevisionHistorialProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getEstadoIcon = (estado: RevisionEspecialidadData['estado']) => {
    switch (estado) {
      case 'completada':
        return <LuCheck className="w-4 h-4 text-green-600" />;
      case 'improcedente':
        return <LuX className="w-4 h-4 text-red-600" />;
      default:
        return <LuClock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getEstadoColor = (estado: RevisionEspecialidadData['estado']) => {
    switch (estado) {
      case 'completada':
        return 'border-l-green-500 bg-green-50';
      case 'improcedente':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-yellow-500 bg-yellow-50';
    }
  };

  const getResultadoActaLabel = (resultado: 'conforme' | 'no_conforme' | null | undefined) => {
    if (!resultado) return 'Pendiente';
    return resultado === 'conforme' ? 'Conforme' : 'No Conforme';
  };

  const getResultadoRecursoLabel = (resultado: string | null | undefined) => {
    if (!resultado) return '-';
    switch (resultado) {
      case 'fundado': return 'Fundado';
      case 'infundado': return 'Infundado';
      case 'fundado_en_parte': return 'Fundado en Parte';
      default: return resultado;
    }
  };

  if (revisiones.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <LuFileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
          No hay revisiones anteriores para {especialidadNombre}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h6 className="text-sm font-medium text-gray-600 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
        Historial de Revisiones - {especialidadNombre}
      </h6>
      
      {revisiones.map((revision, index) => (
        <div 
          key={revision.id}
          className={`border-l-4 rounded-r-lg overflow-hidden ${getEstadoColor(revision.estado)}`}
        >
          {/* Header colapsable */}
          <div 
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-opacity-70 transition-colors"
            onClick={() => toggleItem(index)}
          >
            <div className="flex items-center gap-3">
              {getEstadoIcon(revision.estado)}
              <div>
                <span className="font-medium text-gray-900 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Revisión #{revision.numero_revision}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  (Global #{revision.numero_revision_global})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                revision.resultado_acta === 'conforme' 
                  ? 'bg-green-100 text-green-800' 
                  : revision.resultado_acta === 'no_conforme'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {getResultadoActaLabel(revision.resultado_acta)}
              </span>
              {expandedItems.has(index) ? (
                <LuChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <LuChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>

          {/* Contenido expandido */}
          {expandedItems.has(index) && (
            <div className="border-t border-gray-200 p-3 bg-white bg-opacity-50 text-sm space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <span className="text-gray-500 text-xs">Fecha Creación:</span>
                  <p className="text-gray-900">{revision.fecha_creacion}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Fecha Respuesta:</span>
                  <p className="text-gray-900">{revision.fecha_respuesta || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Notificación:</span>
                  <p className="text-gray-900">
                    {revision.notificacion?.tiene_notificacion ? 'Sí' : 'No'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Subsanación:</span>
                  <p className="text-gray-900">
                    {revision.subsanacion_completada ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <LuCheck className="w-3 h-3" /> Completada
                      </span>
                    ) : revision.resultado_acta === 'no_conforme' ? (
                      <span className="text-yellow-600 flex items-center gap-1">
                        <LuInfo className="w-3 h-3" /> Pendiente
                      </span>
                    ) : '-'}
                  </p>
                </div>
              </div>

              {/* Recursos */}
              {(revision.reconsideracion?.habilitado || revision.apelacion?.habilitado) && (
                <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-2">
                  {revision.reconsideracion?.habilitado && (
                    <div>
                      <span className="text-gray-500 text-xs">Reconsideración:</span>
                      <p className={`${
                        revision.reconsideracion.resultado === 'fundado' ? 'text-green-600' :
                        revision.reconsideracion.resultado === 'infundado' ? 'text-red-600' :
                        revision.reconsideracion.resultado === 'fundado_en_parte' ? 'text-yellow-600' :
                        'text-gray-900'
                      }`}>
                        {getResultadoRecursoLabel(revision.reconsideracion.resultado)}
                      </p>
                    </div>
                  )}
                  {revision.apelacion?.habilitado && (
                    <div>
                      <span className="text-gray-500 text-xs">Apelación:</span>
                      <p className={`${
                        revision.apelacion.resultado === 'fundado' ? 'text-green-600' :
                        revision.apelacion.resultado === 'infundado' ? 'text-red-600' :
                        revision.apelacion.resultado === 'fundado_en_parte' ? 'text-yellow-600' :
                        'text-gray-900'
                      }`}>
                        {getResultadoRecursoLabel(revision.apelacion.resultado)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Botón para ver detalle */}
              {onRevisionClick && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRevisionClick(index);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Ver detalle completo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
