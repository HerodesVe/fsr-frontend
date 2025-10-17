import type { UploadedDocument } from '@/types/conformidad.types';

interface UploadedFilesListProps {
  documents: UploadedDocument[];
  onRemove: (fileId: string) => void;
}

export const UploadedFilesList = ({ documents, onRemove }: UploadedFilesListProps) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <svg
              className="h-5 w-5 text-green-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                {doc.name}
              </p>
              <p className="text-xs text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {(doc.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(doc.id)}
              className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Eliminar archivo"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

