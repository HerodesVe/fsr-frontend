import { StepCargo } from '@/components/utils/Steps';
import type { GestionAnexoFormData, UploadedDocument } from '@/types/gestionAnexo.types';

interface StepCierreProps {
  formData: GestionAnexoFormData;
  errors: Record<string, string>;
  gestionId: string;
  uploadedDocuments: UploadedDocument[];
  onInputChange: (field: keyof GestionAnexoFormData, value: any) => void;
  onFileUpload: (file: File, documentKey: string) => Promise<UploadedDocument>;
  onDownloadDocument?: (documentId: string, fileName: string) => Promise<void>;
}

export default function StepCierre({
  formData,
  errors,
  gestionId,
  uploadedDocuments,
  onInputChange,
  onFileUpload,
  onDownloadDocument,
}: StepCierreProps) {
  return (
    <StepCargo
      formData={formData}
      projectId={gestionId}
      uploadedDocuments={uploadedDocuments}
      errors={errors}
      onInputChange={(field: string, value: any) => onInputChange(field as keyof GestionAnexoFormData, value)}
      onFileUpload={onFileUpload}
      onDownloadDocument={onDownloadDocument}
      title="Cierre y Entrega"
      description="Complete la información de entrega final al administrado"
      cargoDocumentKey="cierre_servicio.cargo_entrega_administrado"
    />
  );
}
