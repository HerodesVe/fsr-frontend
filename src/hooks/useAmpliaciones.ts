import { useState, useEffect } from 'react';
import { 
  getAllAmpliaciones, 
  getAmpliacionById,
  createAmpliacion,
  updateAmpliacion,
  deleteAmpliacion,
  uploadDocuments,
  downloadDocumentWithName
} from '@/services/ampliaciones.service';
import type { Ampliacion } from '@/types/ampliacion.types';
import toast from 'react-hot-toast';

export const useAmpliaciones = () => {
  const [ampliaciones, setAmpliaciones] = useState<Ampliacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAmpliaciones = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAmpliaciones();
      setAmpliaciones(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching ampliaciones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAmpliaciones();
  }, []);

  return {
    ampliaciones,
    isLoading,
    error,
    refetch: fetchAmpliaciones,
  };
};

export const useAmpliacion = (id?: string) => {
  const [ampliacion, setAmpliacion] = useState<Ampliacion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAmpliacion = async (ampliacionId: string) => {
    try {
      setIsLoading(true);
      const data = await getAmpliacionById(ampliacionId);
      setAmpliacion(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching ampliacion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAmpliacion(id);
    }
  }, [id]);

  const createNew = async (data: any) => {
    try {
      setIsLoading(true);
      const newAmpliacion = await createAmpliacion(data);
      setAmpliacion(newAmpliacion);
      setError(null);
      return newAmpliacion;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating ampliacion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (ampliacionId: string, data: any) => {
    try {
      setIsLoading(true);
      const updatedAmpliacion = await updateAmpliacion(ampliacionId, data);
      setAmpliacion(updatedAmpliacion);
      setError(null);
      return updatedAmpliacion;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating ampliacion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (ampliacionId: string) => {
    try {
      setIsLoading(true);
      await deleteAmpliacion(ampliacionId);
      setAmpliacion(null);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting ampliacion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocs = async (ampliacionId: string, files: File[], keys: string[]) => {
    try {
      const result = await uploadDocuments(ampliacionId, { files, keys });
      setError(null);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error('Error uploading documents:', err);
      throw err;
    }
  };

  const downloadDoc = async (ampliacionId: string, documentId: string, fileName: string) => {
    try {
      toast.loading('Descargando documento...');
      await downloadDocumentWithName(ampliacionId, documentId, fileName);
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
    ampliacion,
    isLoading,
    error,
    createNew,
    update,
    remove,
    uploadDocs,
    downloadDoc,
    refetch: id ? () => fetchAmpliacion(id) : undefined,
  };
};

