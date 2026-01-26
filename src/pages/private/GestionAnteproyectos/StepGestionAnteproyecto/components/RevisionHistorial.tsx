import { useState } from 'react';
import { LuChevronDown, LuChevronUp, LuCheck, LuClock, LuTriangle,  } from 'react-icons/lu';
import type { RevisionData } from '@/types/gestionAnteproyecto.types';

interface RevisionHistorialProps {
  revisiones: RevisionData[];
  onSelectRevision?: (index: number) => void;
}

export default function RevisionHistorial({ revisiones, onSelectRevision }: RevisionHistorialProps) {
  const [expandedRevision, setExpandedRevision] = useState<string | null>(null);

  const getEstadoIcon = (estado: RevisionData['estado']) => {
    switch (estado) {
      case 'completada':
        return <LuCheck className="w-4 h-4 text-green-600" />;
      case 'improcedente':
        return <LuTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <LuClock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getEstadoColor = (estado: RevisionData['estado']) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-50 border-green-200';
      case 'improcedente':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getResultadoActaLabel = (resultado: RevisionData['resultado_acta']) => {
    switch (resultado) {
      case 'conforme':
        return { label: 'Conforme', color: 'text-green-700 bg-green-100' };
      case 'no_conforme':
        return { label: 'No Conforme', color: 'text-red-700 bg-red-100' };
      default:
        return { label: 'Pendiente', color: 'text-gray-700 bg-gray-100' };
    }
  };

  const getResultadoRecursoLabel = (resultado: string | null | undefined) => {
    switch (resultado) {
      case 'fundado':
        return { label: 'Fundado', color: 'text-green-700 bg-green-100' };
      case 'infundado':
        return { label: 'Infundado', color: 'text-red-700 bg-red-100' };
      case 'fundado_en_parte':
        return { label: 'Fundado en Parte', color: 'text-yellow-700 bg-yellow-100' };
      default:
        return { label: 'Pendiente', color: 'text-gray-700 bg-gray-100' };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (revisiones.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
        Historial de Revisiones ({revisiones.length}/4)
      </h4>
      
      <div className="space-y-2">
        {revisiones.map((revision, index) => {
          const isExpanded = expandedRevision === revision.id;
          const resultadoActa = getResultadoActaLabel(revision.resultado_acta);
          
          return (
            <div
              key={revision.id}
              className={`border rounded-lg overflow-hidden ${getEstadoColor(revision.estado)}`}
            >
              {/* Header de la revisión */}
              <button
                onClick={() => setExpandedRevision(isExpanded ? null : revision.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-opacity-80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getEstadoIcon(revision.estado)}
                  <div className="text-left">
                    <span className="font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Revisión {revision.numero_revision}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      - {formatDate(revision.fecha_creacion)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${resultadoActa.color}`}>
                    {resultadoActa.label}
                  </span>
                  {isExpanded ? (
                    <LuChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <LuChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Contenido expandido */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200 bg-white bg-opacity-50">
                  <div className="pt-3 space-y-3">
                    {/* Notificación */}
                    {revision.notificacion?.tiene_notificacion && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Notificación:</span>
                        <span className="ml-2 text-gray-600">
                          {formatDate(revision.notificacion.fecha_notificacion)}
                        </span>
                        {revision.notificacion.subsanacion_completada && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                            Subsanada
                          </span>
                        )}
                      </div>
                    )}

                    {/* Fecha de respuesta del Acta */}
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Fecha Acta:</span>
                      <span className="ml-2 text-gray-600">
                        {formatDate(revision.fecha_respuesta)}
                      </span>
                    </div>

                    {/* Subsanación */}
                    {revision.resultado_acta === 'no_conforme' && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Subsanación:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                          revision.subsanacion_completada 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {revision.subsanacion_completada ? 'Completada' : 'Pendiente'}
                        </span>
                      </div>
                    )}

                    {/* Reconsideración */}
                    {revision.reconsideracion?.habilitado && (
                      <div className="text-sm border-t pt-2 mt-2">
                        <span className="font-medium text-gray-700">Reconsideración:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                          getResultadoRecursoLabel(revision.reconsideracion.resultado).color
                        }`}>
                          {getResultadoRecursoLabel(revision.reconsideracion.resultado).label}
                        </span>
                      </div>
                    )}

                    {/* Apelación */}
                    {revision.apelacion?.habilitado && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Apelación:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                          getResultadoRecursoLabel(revision.apelacion.resultado).color
                        }`}>
                          {getResultadoRecursoLabel(revision.apelacion.resultado).label}
                        </span>
                      </div>
                    )}

                    {/* Botón para ver detalles */}
                    {onSelectRevision && revision.estado !== 'en_progreso' && (
                      <button
                        onClick={() => onSelectRevision(index)}
                        className="mt-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Ver detalles completos →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
