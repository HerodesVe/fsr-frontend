import type { StepProps } from '@/types/conformidad.types';

export default function StepModalidad({
  formData,
  errors,
  onInputChange
}: Omit<StepProps, 'conformidadId' | 'uploadedDocuments' | 'onFileUpload'>) {

  const modalidades = [
    {
      value: 'sin_variaciones',
      title: 'Sin Variaciones',
      description: 'Para construcciones finalizadas que son idénticas a los planos de la licencia de obra aprobada.',
      icon: '✓'
    },
    {
      value: 'con_variaciones',
      title: 'Con Variaciones',
      description: 'Cuando la construcción presenta modificaciones respecto a los planos originales de la licencia.',
      icon: '✏️'
    },
    {
      value: 'casco_habitable',
      title: 'En Casco Habitable',
      description: 'Para edificaciones que cumplen con las condiciones mínimas de habitabilidad, aunque no estén 100% terminadas.',
      icon: '🏠'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccionar Modalidad del Trámite
        </h2>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Seleccione la modalidad que corresponde al estado actual de la construcción.
        </p>
      </div>

      {errors?.modalidad && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {errors.modalidad}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modalidades.map((modalidad) => (
          <div
            key={modalidad.value}
            onClick={() => onInputChange('modalidad', modalidad.value)}
            className={`group cursor-pointer bg-white p-6 rounded-xl border-2 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
              formData.modalidad === modalidad.value
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-teal-300'
            }`}
          >
            <div className="flex-shrink-0 bg-teal-100 text-teal-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-2xl">{modalidad.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {modalidad.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {modalidad.description}
            </p>
            <div className={`flex items-center font-medium text-sm ${
              formData.modalidad === modalidad.value ? 'text-teal-700' : 'text-teal-600'
            }`}>
              <span>
                {formData.modalidad === modalidad.value ? 'Seleccionado' : 'Seleccionar'}
              </span>
              {formData.modalidad === modalidad.value ? (
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {formData.modalidad && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                Modalidad seleccionada: {modalidades.find(m => m.value === formData.modalidad)?.title}
              </h4>
              <p className="text-sm text-blue-700 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Los siguientes pasos se ajustarán según la modalidad seleccionada.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
