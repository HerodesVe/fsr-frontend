import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAllGestionAnteproyectos,
  getGestionAnteproyectoById,
  createGestionAnteproyecto,
  updateGestionAnteproyecto,
  deleteGestionAnteproyecto,
  uploadDocuments,
  downloadDocumentWithName,
} from '@/services/gestionAnteproyectos.service';
import type { GestionAnteproyecto } from '@/types/gestionAnteproyecto.types';

// Hook para obtener todas las gestiones de anteproyectos
export const useGestionAnteproyectos = () => {
  const { data: gestionAnteproyectos, isLoading, error } = useQuery<GestionAnteproyecto[]>({
    queryKey: ['gestionAnteproyectos'],
    queryFn: getAllGestionAnteproyectos,
  });

  return {
    gestionAnteproyectos: gestionAnteproyectos || [],
    isLoading,
    error,
  };
};

// Hook para gestionar una gestión individual de anteproyecto
export const useGestionAnteproyecto = (id?: string) => {
  const queryClient = useQueryClient();

  // Obtener gestión por ID
  const { data: gestionAnteproyecto, isLoading, error } = useQuery<GestionAnteproyecto>({
    queryKey: ['gestionAnteproyecto', id],
    queryFn: () => getGestionAnteproyectoById(id!),
    enabled: !!id,
  });

  // Crear nueva gestión
  const createMutation = useMutation({
    mutationFn: createGestionAnteproyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gestionAnteproyectos'] });
      toast.success('Gestión de Anteproyecto creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(`Error al crear la gestión: ${error.message}`);
    },
  });

  // Actualizar gestión existente
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateGestionAnteproyecto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gestionAnteproyectos'] });
      queryClient.invalidateQueries({ queryKey: ['gestionAnteproyecto', id] });
      toast.success('Gestión de Anteproyecto actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar la gestión: ${error.message}`);
    },
  });

  // Eliminar gestión
  const deleteMutation = useMutation({
    mutationFn: deleteGestionAnteproyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gestionAnteproyectos'] });
      toast.success('Gestión de Anteproyecto eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar la gestión: ${error.message}`);
    },
  });

  // Subir documentos
  const uploadDocsMutation = useMutation({
    mutationFn: ({ gestionId, files, documentKeys }: { gestionId: string; files: File[]; documentKeys: string[] }) =>
      uploadDocuments(gestionId, files, documentKeys),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['gestionAnteproyecto', id] });
      toast.success('Documento subido exitosamente');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Error al subir el documento: ${error.message}`);
    },
  });

  // Descargar documento
  const downloadDoc = async (gestionId: string, documentId: string, fileName: string) => {
    try {
      await downloadDocumentWithName(gestionId, documentId, fileName);
      toast.success('Documento descargado exitosamente');
    } catch (error: any) {
      toast.error(`Error al descargar el documento: ${error.message}`);
      throw error;
    }
  };

  return {
    gestionAnteproyecto,
    isLoading,
    error,
    createNew: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    uploadDocs: uploadDocsMutation.mutateAsync,
    downloadDoc,
  };
};

