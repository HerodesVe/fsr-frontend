import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllProyectos, 
  getProyectoById, 
  createProyecto,
  createInitialProyecto, 
  updateProyecto, 
  deleteProyecto,
  uploadSingleDocument,
  uploadDocuments 
} from '@/services/proyectos.service';
import toast from 'react-hot-toast';

export const useProyectos = () => {
  const queryClient = useQueryClient();

  const {
    data: proyectos,
    isLoading,
    error,
    refetch, // eslint-disable-line @typescript-eslint/no-unused-vars
  } = useQuery({
    queryKey: ['proyectos'],
    queryFn: getAllProyectos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: createProyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      toast.success('Proyecto creado exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el proyecto';
      toast.error(errorMessage);
    },
  });

  const createInitialMutation = useMutation({
    mutationFn: createInitialProyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      toast.success('Proyecto creado exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el proyecto';
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      toast.success('Proyecto actualizado exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar el proyecto';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      toast.success('Proyecto eliminado exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el proyecto';
      toast.error(errorMessage);
    },
  });

  const uploadSingleDocumentMutation = useMutation({
    mutationFn: ({ id, file, documentKey }: { id: string; file: File; documentKey: string }) => uploadSingleDocument(id, file, documentKey),
    onSuccess: (updatedProyecto, variables) => {
      // Actualizar la cache del proyecto específico con los datos actualizados
      queryClient.setQueryData(['proyecto', variables.id], updatedProyecto);
      
      // También invalidar las consultas para mantener consistencia
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      
      toast.success('Documento subido exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al subir documento';
      toast.error(errorMessage);
    },
  });

  const uploadDocumentsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => uploadDocuments(id, data),
    onSuccess: (updatedProyecto, variables) => {
      // Actualizar la cache del proyecto específico con los datos actualizados
      queryClient.setQueryData(['proyecto', variables.id], updatedProyecto);
      
      // También invalidar las consultas para mantener consistencia
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      
      toast.success('Documentos subidos exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al subir documentos';
      toast.error(errorMessage);
    },
  });

  return {
    proyectos,
    isLoading,
    error,
    refetch,
    createMutation,
    createInitialMutation,
    updateMutation,
    deleteMutation,
    uploadSingleDocumentMutation,
    uploadDocumentsMutation,
  };
};

export const useProyectoById = (id: string) => {
  return useQuery({
    queryKey: ['proyecto', id],
    queryFn: () => getProyectoById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};