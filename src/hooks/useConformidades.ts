import { useState, useEffect } from 'react';
import { 
  getAllConformidades, 
  getConformidadById,
  createConformidad,
  updateConformidad,
  deleteConformidad,
  uploadDocuments,
  downloadDocumentWithName
} from '@/services/conformidades.service';
import type { Conformidad, CreateConformidadRequest, UpdateConformidadRequest } from '@/types/conformidad.types';
import toast from 'react-hot-toast';

export const useConformidades = () => {
  const [conformidades, setConformidades] = useState<Conformidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConformidades = async () => {
    try {
      setIsLoading(true);
      const data = await getAllConformidades();
      setConformidades(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching conformidades:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConformidades();
  }, []);

  return {
    conformidades,
    isLoading,
    error,
    refetch: fetchConformidades,
  };
};

export const useConformidad = (id?: string) => {
  const [conformidad, setConformidad] = useState<Conformidad | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConformidad = async (conformidadId: string) => {
    try {
      setIsLoading(true);
      const data = await getConformidadById(conformidadId);
      setConformidad(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching conformidad:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConformidad(id);
    }
  }, [id]);

  const createNew = async (data: CreateConformidadRequest) => {
    try {
      setIsLoading(true);
      const newConformidad = await createConformidad(data);
      setConformidad(newConformidad);
      setError(null);
      return newConformidad;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating conformidad:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (conformidadId: string, data: UpdateConformidadRequest) => {
    try {
      setIsLoading(true);
      const updatedConformidad = await updateConformidad(conformidadId, data);
      setConformidad(updatedConformidad);
      setError(null);
      return updatedConformidad;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating conformidad:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (conformidadId: string) => {
    try {
      setIsLoading(true);
      await deleteConformidad(conformidadId);
      setConformidad(null);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting conformidad:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocs = async (conformidadId: string, files: File[], keys: string[]) => {
    try {
      const result = await uploadDocuments(conformidadId, { files, keys });
      setError(null);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error('Error uploading documents:', err);
      throw err;
    }
  };

  const downloadDoc = async (conformidadId: string, documentId: string, fileName: string) => {
    try {
      toast.info('Descargando documento...');
      await downloadDocumentWithName(conformidadId, documentId, fileName);
      toast.success('Documento descargado exitosamente');
    } catch (err) {
      setError(err as Error);
      console.error('Error downloading document:', err);
      toast.error('Error al descargar el documento');
      throw err;
    }
  };

  return {
    conformidad,
    isLoading,
    error,
    createNew,
    update,
    remove,
    uploadDocs,
    downloadDoc,
    refetch: id ? () => fetchConformidad(id) : undefined,
  };
};



