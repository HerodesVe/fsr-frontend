import { useState, useEffect } from 'react';
import { 
  getAllRegularizaciones, 
  getRegularizacionById,
  createRegularizacion,
  updateRegularizacion,
  deleteRegularizacion,
  uploadDocuments,
  downloadDocumentWithName
} from '@/services/regularizaciones.service';
import type { Regularizacion, CreateRegularizacionRequest, UpdateRegularizacionRequest } from '@/types/regularizacion.types';

export const useRegularizaciones = () => {
  const [regularizaciones, setRegularizaciones] = useState<Regularizacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRegularizaciones = async () => {
    try {
      setIsLoading(true);
      const data = await getAllRegularizaciones();
      setRegularizaciones(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching regularizaciones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegularizaciones();
  }, []);

  return {
    regularizaciones,
    isLoading,
    error,
    refetch: fetchRegularizaciones,
  };
};

export const useRegularizacion = (id?: string) => {
  const [regularizacion, setRegularizacion] = useState<Regularizacion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRegularizacion = async (regularizacionId: string) => {
    try {
      setIsLoading(true);
      const data = await getRegularizacionById(regularizacionId);
      setRegularizacion(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching regularizacion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRegularizacion(id);
    }
  }, [id]);

  const createNew = async (data: CreateRegularizacionRequest) => {
    try {
      setIsLoading(true);
      const newRegularizacion = await createRegularizacion(data);
      setRegularizacion(newRegularizacion);
      setError(null);
      return newRegularizacion;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating regularizacion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (regularizacionId: string, data: UpdateRegularizacionRequest) => {
    try {
      setIsLoading(true);
      const updatedRegularizacion = await updateRegularizacion(regularizacionId, data);
      setRegularizacion(updatedRegularizacion);
      setError(null);
      return updatedRegularizacion;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating regularizacion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (regularizacionId: string) => {
    try {
      setIsLoading(true);
      await deleteRegularizacion(regularizacionId);
      setRegularizacion(null);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting regularizacion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocs = async (regularizacionId: string, files: File[], keys: string[]) => {
    try {
      setIsLoading(true);
      const result = await uploadDocuments(regularizacionId, { files, keys });
      setError(null);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error('Error uploading documents:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDoc = async (regularizacionId: string, documentId: string, fileName: string) => {
    try {
      await downloadDocumentWithName(regularizacionId, documentId, fileName);
    } catch (err) {
      setError(err as Error);
      console.error('Error downloading document:', err);
      throw err;
    }
  };

  return {
    regularizacion,
    isLoading,
    error,
    createNew,
    update,
    remove,
    uploadDocs,
    downloadDoc,
    refetch: id ? () => fetchRegularizacion(id) : undefined,
  };
};



