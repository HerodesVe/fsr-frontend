import { useState, useEffect } from 'react';
import { 
  getAllModificaciones, 
  getModificacionById,
  createModificacion,
  updateModificacion,
  deleteModificacion,
  uploadDocuments,
  downloadDocumentWithName
} from '@/services/modificaciones.service';
import type { Modificacion } from '@/types/modificacion.types';
import toast from 'react-hot-toast';

export const useModificaciones = () => {
  const [modificaciones, setModificaciones] = useState<Modificacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModificaciones = async () => {
    try {
      setIsLoading(true);
      const data = await getAllModificaciones();
      setModificaciones(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching modificaciones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModificaciones();
  }, []);

  return {
    modificaciones,
    isLoading,
    error,
    refetch: fetchModificaciones,
  };
};

export const useModificacion = (id?: string) => {
  const [modificacion, setModificacion] = useState<Modificacion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchModificacion = async (modificacionId: string) => {
    try {
      setIsLoading(true);
      const data = await getModificacionById(modificacionId);
      setModificacion(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching modificacion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchModificacion(id);
    }
  }, [id]);

  const createNew = async (data: any) => {
    try {
      setIsLoading(true);
      const newModificacion = await createModificacion(data);
      setModificacion(newModificacion);
      setError(null);
      return newModificacion;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating modificacion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (modificacionId: string, data: any) => {
    try {
      setIsLoading(true);
      const updatedModificacion = await updateModificacion(modificacionId, data);
      setModificacion(updatedModificacion);
      setError(null);
      return updatedModificacion;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating modificacion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (modificacionId: string) => {
    try {
      setIsLoading(true);
      await deleteModificacion(modificacionId);
      setModificacion(null);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting modificacion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocs = async (modificacionId: string, files: File[], keys: string[]) => {
    try {
      const result = await uploadDocuments(modificacionId, { files, keys });
      setError(null);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error('Error uploading documents:', err);
      throw err;
    }
  };

  const downloadDoc = async (modificacionId: string, documentId: string, fileName: string) => {
    try {
      toast.loading('Descargando documento...');
      await downloadDocumentWithName(modificacionId, documentId, fileName);
      toast.dismiss();
      toast.success('Documento descargado exitosamente');
    } catch (err) {
      setError(err as Error);
      console.error('Error downloading document:', err);
      toast.dismiss();
      toast.error('Error al descargar el documento');
      throw err;
    }
  };

  return {
    modificacion,
    isLoading,
    error,
    createNew,
    update,
    remove,
    uploadDocs,
    downloadDoc,
    refetch: id ? () => fetchModificacion(id) : undefined,
  };
};

