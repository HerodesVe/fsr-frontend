import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAllGestionAnexos,
  getGestionAnexoById,
  createGestionAnexo,
  updateGestionAnexo,
  deleteGestionAnexo,
  uploadDocuments,
  downloadDocumentWithName,
} from '@/services/gestionAnexo.service';
import type { GestionAnexoItem } from '@/types/gestionAnexo.types';

// Hook para obtener todas las gestiones del anexo H
export const useGestionAnexos = () => {
  const { data: gestionAnexos, isLoading, error } = useQuery<GestionAnexoItem[]>({
    queryKey: ['gestionAnexos'],
    queryFn: getAllGestionAnexos,
  });

  return {
    gestionAnexos: gestionAnexos || [],
    isLoading,
    error,
  };
};

// Hook para gestionar una gestión individual del anexo H
export const useGestionAnexo = (id?: string) => {
  const queryClient = useQueryClient();

  // Obtener gestión por ID
  const { data: gestionAnexo, isLoading, error } = useQuery<GestionAnexoItem>({
    queryKey: ['gestionAnexo', id],
    queryFn: () => getGestionAnexoById(id!),
    enabled: !!id,
  });

  // Crear nueva gestión
  const createMutation = useMutation({
    mutationFn: createGestionAnexo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gestionAnexos'] });
      toast.success('Gestión del Anexo H creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(`Error al crear la gestión: ${error.message}`);
    },
  });

  // Actualizar gestión existente
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateGestionAnexo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gestionAnexos'] });
      queryClient.invalidateQueries({ queryKey: ['gestionAnexo', id] });
      toast.success('Gestión del Anexo H actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar la gestión: ${error.message}`);
    },
  });

  // Eliminar gestión
  const deleteMutation = useMutation({
    mutationFn: deleteGestionAnexo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gestionAnexos'] });
      toast.success('Gestión del Anexo H eliminada exitosamente');
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
      queryClient.invalidateQueries({ queryKey: ['gestionAnexo', id] });
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
    gestionAnexo,
    isLoading,
    error,
    createNew: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    uploadDocs: uploadDocsMutation.mutateAsync,
    downloadDoc,
  };
};

