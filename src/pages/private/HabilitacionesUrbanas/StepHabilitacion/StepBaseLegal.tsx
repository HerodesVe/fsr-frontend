import { useState } from 'react';
import { LuPlus, LuX } from 'react-icons/lu';
import { Button, Textarea, FileUpload } from '@/components/ui';
import type { HabilitacionUrbanaFormData, NormaAplicada, UploadedDocument } from '@/types/habilitacionUrbana.types';

interface StepBaseLegalProps {
  formData: HabilitacionUrbanaFormData;
  habilitacionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof HabilitacionUrbanaFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<any>;
}

export default function StepBaseLegal({
  formData,
  habilitacionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
}: StepBaseLegalProps) {
  const [normas, setNormas] = useState<NormaAplicada[]>(
    formData.normas_aplicadas || [
      {
        id: '1',
        descripcion: '',
        archivo_norma: []
      }
    ]
  );

  const handleAddNorma = () => {
    const newNorma: NormaAplicada = {
      id: Date.now().toString(),
      descripcion: '',
      archivo_norma: []
    };
    const updatedNormas = [...normas, newNorma];
    setNormas(updatedNormas);
    onInputChange('normas_aplicadas', updatedNormas);
  };

  const handleRemoveNorma = (id: string) => {
    const updatedNormas = normas.filter(norma => norma.id !== id);
    setNormas(updatedNormas);
    onInputChange('normas_aplicadas', updatedNormas);
  };

  const handleNormaChange = (id: string, field: keyof NormaAplicada, value: any) => {
    const updatedNormas = normas.map(norma =>
      norma.id === id ? { ...norma, [field]: value } : norma
    );
    setNormas(updatedNormas);
    onInputChange('normas_aplicadas', updatedNormas);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Base Legal y Normativa Aplicada
        </h3>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Registre las normas, ordenanzas y oficios aplicables al proyecto
        </p>
        
        <div className="space-y-6">
          {normas.map((norma, index) => (
            <div key={norma.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
              {normas.length > 1 && (
                <button
                  onClick={() => handleRemoveNorma(norma.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  type="button"
                >
                  <LuX className="w-5 h-5" />
                </button>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Legal / Normativa / Oficio {index + 1}
                  </label>
                  <Textarea
                    placeholder="Ej: Ordenanza 509-MML, Oficio vinculante..."
                    value={norma.descripcion}
                    onChange={(e) => handleNormaChange(norma.id, 'descripcion', e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo de Norma
                  </label>
                  <FileUpload
                    placeholder="Cargar documento de norma"
                    value={norma.archivo_norma || []}
                    onChange={(files) => handleNormaChange(norma.id, 'archivo_norma', files)}
                    accept=".pdf,.doc,.docx"
                    multiple
                    onUpload={onFileUpload}
                    documentKey={`norma_${norma.id}`}
                    anteproyectoId={habilitacionId}
                    uploadedFiles={uploadedDocuments.map(doc => ({
                      key: doc.key || '',
                      name: doc.name,
                      file_id: doc.id
                    }))}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-start">
            <Button
              variant="bordered"
              onClick={handleAddNorma}
              startContent={<LuPlus className="w-4 h-4" />}
            >
              Añadir Norma
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
