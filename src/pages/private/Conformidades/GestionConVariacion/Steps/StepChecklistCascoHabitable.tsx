import { useCallback } from 'react';
import { LuCheck, LuX, LuBuilding, LuInfo } from 'react-icons/lu';
import type { ConformidadConVariacionFormData, ChecklistCascoHabitable } from '@/types/conformidad.types';

interface StepChecklistCascoHabitableProps {
  formData: ConformidadConVariacionFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof ConformidadConVariacionFormData, value: any) => void;
}

// Items del checklist organizados por categoría
const CHECKLIST_ITEMS = {
  bienes_comunes: {
    titulo: 'Bienes y Servicios Comunes',
    descripcion: 'Verificación de áreas y servicios comunes de la edificación',
    items: [
      { key: 'estructuras_terminadas', label: 'Estructuras terminadas y en buen estado' },
      { key: 'fachadas_terminadas', label: 'Fachadas terminadas (tarrajeo, pintura, acabados)' },
      { key: 'instalaciones_operativas', label: 'Instalaciones eléctricas y sanitarias operativas en áreas comunes' },
      { key: 'ascensores_operativos', label: 'Ascensores instalados y operativos (si aplica)' },
      { key: 'areas_comunes_terminadas', label: 'Áreas comunes terminadas (hall, pasillos, escaleras)' },
      { key: 'estacionamientos_habilitados', label: 'Estacionamientos habilitados y señalizados' },
    ],
  },
  propiedad_exclusiva: {
    titulo: 'Áreas de Propiedad Exclusiva',
    descripcion: 'Verificación de condiciones mínimas en unidades inmobiliarias',
    items: [
      { key: 'muros_revocados', label: 'Muros revocados (tarrajeo interior)' },
      { key: 'falsos_pisos_terminados', label: 'Falsos pisos terminados' },
      { key: 'vidrios_instalados', label: 'Vidrios instalados en ventanas y mamparas' },
      { key: 'bano_terminado', label: 'Al menos un baño completamente terminado y operativo' },
      { key: 'instalaciones_electricas_operativas', label: 'Instalaciones eléctricas operativas (puntos de luz y tomacorrientes)' },
      { key: 'instalaciones_sanitarias_operativas', label: 'Instalaciones sanitarias operativas (agua y desagüe)' },
    ],
  },
};

export default function StepChecklistCascoHabitable({
  formData,
  errors,
  onInputChange
}: StepChecklistCascoHabitableProps) {
  
  const checklist = formData.checklist_casco_habitable;

  // Actualizar item del checklist
  const handleChecklistChange = useCallback((key: keyof ChecklistCascoHabitable, value: boolean) => {
    onInputChange('checklist_casco_habitable', {
      ...checklist,
      [key]: value,
    });
  }, [checklist, onInputChange]);

  // Calcular progreso
  const totalItems = Object.values(CHECKLIST_ITEMS).reduce(
    (acc, cat) => acc + cat.items.length, 0
  );
  const completedItems = Object.values(checklist).filter(Boolean).length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Paso 5: Checklist Casco Habitable
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Verifique las condiciones técnicas para la conformidad de obra a nivel de casco habitable.
        </p>
      </div>

      {/* Alerta informativa */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuInfo className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              SOLICITUD DE CONFORMIDAD DE OBRA A NIVEL DE CASCO HABITABLE
            </h4>
            <p className="text-sm text-amber-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              (*) SOLO EN EDIFICACIONES DE VIVIENDA MULTIFAMILIAR
            </p>
            <p className="text-sm text-amber-700 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Complete la verificación de cada ítem indicando si cumple o no cumple con las condiciones requeridas.
            </p>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Progreso del Checklist
          </span>
          <span className="text-sm font-medium text-teal-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {completedItems} de {totalItems} ({progressPercentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Secciones del Checklist */}
      {Object.entries(CHECKLIST_ITEMS).map(([categoryKey, category]) => (
        <div key={categoryKey} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          {/* Header de categoría */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <LuBuilding className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {category.titulo}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {category.descripcion}
                </p>
              </div>
            </div>
          </div>

          {/* Items del checklist */}
          <div className="divide-y divide-gray-100">
            {category.items.map((item) => {
              const isChecked = checklist[item.key as keyof ChecklistCascoHabitable];
              
              return (
                <div 
                  key={item.key}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    isChecked ? 'bg-green-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isChecked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isChecked ? <LuCheck size={18} /> : <LuX size={18} />}
                    </div>
                    <span className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Botones Cumple / No Cumple */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleChecklistChange(item.key as keyof ChecklistCascoHabitable, true)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isChecked
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Cumple
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChecklistChange(item.key as keyof ChecklistCascoHabitable, false)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        !isChecked && checklist[item.key as keyof ChecklistCascoHabitable] !== undefined
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      No Cumple
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Resumen */}
      <div className={`p-4 rounded-lg border-2 ${
        progressPercentage === 100 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center gap-3">
          {progressPercentage === 100 ? (
            <>
              <LuCheck className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Checklist Completado
                </h4>
                <p className="text-sm text-green-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Todos los ítems han sido verificados. Puede continuar al siguiente paso.
                </p>
              </div>
            </>
          ) : (
            <>
              <LuInfo className="w-6 h-6 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Checklist Incompleto
                </h4>
                <p className="text-sm text-yellow-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Faltan {totalItems - completedItems} ítems por verificar.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
