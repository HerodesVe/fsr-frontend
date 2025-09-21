import React, { useCallback, useState } from 'react';
import { LuUpload, LuFile, LuX, LuTriangle, LuLoader, LuCheck } from 'react-icons/lu';

export interface FileUploadProps {
  label?: string;
  placeholder?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  error?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // en MB
  required?: boolean;
  disabled?: boolean;
  className?: string;
  // Props para subida inmediata
  onUpload?: (file: File, documentKey: string) => Promise<any>;
  documentKey?: string; // Clave del documento para la API
  anteproyectoId?: string; // ID del anteproyecto
  // Props para documentos ya subidos
  uploadedFiles?: Array<{ key: string; name: string; file_id: string; }>;
}


export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  placeholder = "Seleccione archivo",
  value = [],
  onChange,
  error,
  multiple = false,
  accept,
  maxSize = 10, // 10MB por defecto
  required = false,
  disabled = false,
  className = "",
  onUpload,
  documentKey,
  anteproyectoId,
  uploadedFiles = [],
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `El archivo ${file.name} excede el tamaño máximo de ${maxSize}MB`;
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    if (!onUpload || !documentKey || !anteproyectoId) {
      return;
    }

    const fileId = `${file.name}-${file.size}-${file.lastModified}`;
    setUploadingFiles(prev => new Set([...prev, fileId]));

    try {
      await onUpload(file, documentKey);
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    } catch (error) {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      throw error;
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let hasError = false;

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        hasError = true;
        return;
      }
      validFiles.push(file);
    });

    if (!hasError && validFiles.length > 0) {
      // Actualizar el estado local inmediatamente
      const newFiles = multiple ? [...value, ...validFiles] : validFiles.slice(0, 1);
      onChange?.(newFiles);

      // Subir archivos inmediatamente si se proporciona onUpload
      if (onUpload && documentKey && anteproyectoId) {
        for (const file of validFiles) {
          try {
            await uploadFile(file);
          } catch (error) {
            console.error('Error al subir archivo:', error);
            // Opcional: mostrar error en UI
          }
        }
      }
    }
  }, [value, onChange, multiple, maxSize, onUpload, documentKey, anteproyectoId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles, disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(true);
    }
  }, [disabled]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(true);
    }
  }, [disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const removeFile = (index: number) => {
    if (disabled) return;
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          dragActive
            ? 'border-teal-400 bg-teal-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="text-center">
          <LuUpload className={`mx-auto h-8 w-8 mb-3 ${
            dragActive ? 'text-teal-500' : error ? 'text-red-400' : 'text-gray-400'
          }`} />
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              {dragActive ? 'Suelta los archivos aquí' : placeholder}
            </p>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              {multiple ? 'o arrastra y suelta múltiples archivos' : 'o arrastra y suelta un archivo'}
            </p>
            {maxSize && (
              <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                Tamaño máximo: {maxSize}MB
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lista de archivos (subidos + seleccionados) */}
      {(uploadedFiles.length > 0 || value.length > 0) && (
        <div className="mt-3 space-y-2">
          {/* Archivos ya subidos */}
          {uploadedFiles
            .filter(uploadedFile => uploadedFile.key === documentKey)
            .map((uploadedFile, index) => (
              <div
                key={`uploaded-${uploadedFile.file_id}-${index}`}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <LuCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Documento subido • ID: {uploadedFile.file_id}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          {/* Archivos seleccionados localmente */}
          {value.map((file, index) => {
            const fileId = `${file.name}-${file.size}-${file.lastModified}`;
            const isUploading = uploadingFiles.has(fileId);
            
            return (
              <div
                key={`local-${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {isUploading ? (
                    <LuLoader className="h-5 w-5 text-teal-500 flex-shrink-0 animate-spin" />
                  ) : onUpload ? (
                    <LuCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <LuFile className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {formatFileSize(file.size)}
                      {isUploading && <span className="ml-2 text-teal-600">Subiendo...</span>}
                      {!isUploading && onUpload && <span className="ml-2 text-green-600">Subido</span>}
                    </p>
                  </div>
                </div>
                
                {!disabled && !isUploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Eliminar archivo"
                  >
                    <LuX className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center space-x-1 text-red-600">
          <LuTriangle className="h-4 w-4" />
          <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
