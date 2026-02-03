import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAllGestionProyectos,
  getGestionProyectoById,
  createGestionProyecto,
  updateGestionProyecto,
  deleteGestionProyecto,
  uploadGestionProyectoDocuments,
  downloadGestionProyectoDocumentWithName,
  type CreateGestionProyectoPayload,
  type UpdateGestionProyectoPayload,
} from '@/services/gestionProyectos.service';
import type { GestionProyecto } from '@/types/gestionProyecto.types';

// Hook para obtener todas las gestiones de proyectos
export const useGestionProyectos = () => {
  const { data: gestionProyectos, isLoading, error, refetch } = useQuery<GestionProyecto[]>({
    queryKey: ['gestionProyectos'],
    queryFn: getAllGestionProyectos,
  });

  return {
    gestionProyectos: gestionProyectos || [],
    isLoading,
    error,
    refetch,
  };
};

// Hook para gestionar una gestión individual de proyecto
export const useGestionProyecto = (id?: string) => {
  const queryClient = useQueryClient();

  // Obtener gestión por ID
  const { data: gestionProyecto, isLoading, error, refetch } = useQuery<GestionProyecto>({
    queryKey: ['gestionProyecto', id],
    queryFn: () => getGestionProyectoById(id!),
    enabled: !!id && id !== 'new',
  });

  // Crear nueva gestión (Endpoint 1: Crear Expediente)
  const createMutation = useMutation({
    mutationFn: (payload: CreateGestionProyectoPayload) => createGestionProyecto(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['gestionProyectos'] });
      toast.success('Gestión de Proyecto creada exitosamente');
      return data;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message;
      toast.error(`Error al crear la gestión: ${message}`);
    },
  });

  // Actualizar gestión existente (Endpoint 3: PATCH)
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGestionProyectoPayload }) => 
      updateGestionProyecto(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gestionProyectos'] });
      queryClient.invalidateQueries({ queryKey: ['gestionProyecto', variables.id] });
      // No mostrar toast en cada actualización para evitar spam
      return data;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message;
      toast.error(`Error al actualizar la gestión: ${message}`);
    },
  });

  // Eliminar gestión
  const deleteMutation = useMutation({
    mutationFn: deleteGestionProyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gestionProyectos'] });
      toast.success('Gestión de Proyecto eliminada exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message;
      toast.error(`Error al eliminar la gestión: ${message}`);
    },
  });

  // Subir documentos (Endpoint 4: Multi-part)
  const uploadDocsMutation = useMutation({
    mutationFn: ({ gestionId, files, documentKeys }: { gestionId: string; files: File[]; documentKeys: string[] }) =>
      uploadGestionProyectoDocuments(gestionId, files, documentKeys),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gestionProyecto', variables.gestionId] });
      toast.success('Documento subido exitosamente');
      return data;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message;
      toast.error(`Error al subir el documento: ${message}`);
    },
  });

  // Descargar documento
  const downloadDoc = async (gestionId: string, documentId: string, fileName: string) => {
    try {
      await downloadGestionProyectoDocumentWithName(gestionId, documentId, fileName);
      toast.success('Documento descargado exitosamente');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Error al descargar el documento: ${message}`);
      throw error;
    }
  };

  // Función helper para actualizar una revisión específica
  const updateRevision = async (
    gestionId: string,
    especialidad: 'arquitectura' | 'estructuras' | 'electricas' | 'sanitarias',
    revisionData: any
  ) => {
    const payload: UpdateGestionProyectoPayload = {
      data: {
        especialidades: {
          [especialidad]: {
            revisiones: [revisionData],
          },
        },
      },
    };
    return updateMutation.mutateAsync({ id: gestionId, payload });
  };

  // Función helper para agregar una nueva revisión
  const addRevision = async (
    gestionId: string,
    especialidad: 'arquitectura' | 'estructuras' | 'electricas' | 'sanitarias',
    revisionData: any,
    revisionActualIndex: number
  ) => {
    const payload: UpdateGestionProyectoPayload = {
      data: {
        especialidades: {
          [especialidad]: {
            estado: 'en_progreso',
            revision_actual_index: revisionActualIndex,
            revisiones: [revisionData],
          },
        },
      },
    };
    return updateMutation.mutateAsync({ id: gestionId, payload });
  };

  return {
    gestionProyecto,
    isLoading,
    error,
    refetch,
    // Mutaciones
    createNew: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    uploadDocs: uploadDocsMutation.mutateAsync,
    downloadDoc,
    // Helpers
    updateRevision,
    addRevision,
    // Estados de carga
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploading: uploadDocsMutation.isPending,
  };
};
