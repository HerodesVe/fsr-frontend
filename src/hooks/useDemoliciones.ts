import { useState, useEffect } from 'react';
import { 
  getAllDemoliciones, 
  getDemolicionById,
  createDemolicion,
  updateDemolicion,
  deleteDemolicion,
  uploadDocuments
} from '@/services/demoliciones.service';
import type { Demolicion, CreateDemolicionRequest, UpdateDemolicionRequest } from '@/types/demolicion.types';

export const useDemoliciones = () => {
  const [demoliciones, setDemoliciones] = useState<Demolicion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDemoliciones = async () => {
    try {
      setIsLoading(true);
      const data = await getAllDemoliciones();
      setDemoliciones(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching demoliciones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoliciones();
  }, []);

  return {
    demoliciones,
    isLoading,
    error,
    refetch: fetchDemoliciones,
  };
};

export const useDemolicion = (id?: string) => {
  const [demolicion, setDemolicion] = useState<Demolicion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDemolicion = async (demolicionId: string) => {
    try {
      setIsLoading(true);
      const data = await getDemolicionById(demolicionId);
      setDemolicion(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching demolicion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDemolicion(id);
    }
  }, [id]);

  const createNew = async (data: CreateDemolicionRequest) => {
    try {
      setIsLoading(true);
      const newDemolicion = await createDemolicion(data);
      setDemolicion(newDemolicion);
      setError(null);
      return newDemolicion;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating demolicion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (demolicionId: string, data: UpdateDemolicionRequest) => {
    try {
      setIsLoading(true);
      const updatedDemolicion = await updateDemolicion(demolicionId, data);
      setDemolicion(updatedDemolicion);
      setError(null);
      return updatedDemolicion;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating demolicion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (demolicionId: string) => {
    try {
      setIsLoading(true);
      await deleteDemolicion(demolicionId);
      setDemolicion(null);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting demolicion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocs = async (demolicionId: string, files: File[], keys: string[]) => {
    try {
      setIsLoading(true);
      const result = await uploadDocuments(demolicionId, { files, keys });
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

  return {
    demolicion,
    isLoading,
    error,
    createNew,
    update,
    remove,
    uploadDocs,
    refetch: id ? () => fetchDemolicion(id) : undefined,
  };
};



