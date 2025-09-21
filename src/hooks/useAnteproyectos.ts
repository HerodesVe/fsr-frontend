import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllAnteproyectos, 
  getAnteproyectoById, 
  createAnteproyecto,
  createInitialAnteproyecto, 
  updateAnteproyecto, 
  deleteAnteproyecto,
  uploadSingleDocument,
  uploadDocuments 
} from '@/services/anteproyectos.service';
import toast from 'react-hot-toast';

export const useAnteproyectos = () => {
  const queryClient = useQueryClient();

  const {
    data: anteproyectos,
    isLoading,
    error,
    refetch, // eslint-disable-line @typescript-eslint/no-unused-vars
  } = useQuery({
    queryKey: ['anteproyectos'],
    queryFn: getAllAnteproyectos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: createAnteproyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anteproyectos'] });
      toast.success('Anteproyecto creado exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el anteproyecto';
      toast.error(errorMessage);
    },
  });

  const createInitialMutation = useMutation({
    mutationFn: createInitialAnteproyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anteproyectos'] });
      toast.success('Anteproyecto creado exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el anteproyecto';
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAnteproyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anteproyectos'] });
      toast.success('Anteproyecto actualizado exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar el anteproyecto';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnteproyecto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anteproyectos'] });
      toast.success('Anteproyecto eliminado exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el anteproyecto';
      toast.error(errorMessage);
    },
  });


  const uploadSingleDocumentMutation = useMutation({
    mutationFn: ({ id, file, documentKey }: { id: string; file: File; documentKey: string }) => uploadSingleDocument(id, file, documentKey),
    onSuccess: (updatedAnteproyecto, variables) => {
      // Actualizar la cache del anteproyecto específico con los datos actualizados
      queryClient.setQueryData(['anteproyecto', variables.id], updatedAnteproyecto);
      
      // También invalidar las consultas para mantener consistencia
      queryClient.invalidateQueries({ queryKey: ['anteproyectos'] });
      
      toast.success('Documento subido exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al subir documento';
      toast.error(errorMessage);
    },
  });

  const uploadDocumentsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => uploadDocuments(id, data),
    onSuccess: (updatedAnteproyecto, variables) => {
      // Actualizar la cache del anteproyecto específico con los datos actualizados
      queryClient.setQueryData(['anteproyecto', variables.id], updatedAnteproyecto);
      
      // También invalidar las consultas para mantener consistencia
      queryClient.invalidateQueries({ queryKey: ['anteproyectos'] });
      
      toast.success('Documentos subidos exitosamente');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Error al subir documentos';
      toast.error(errorMessage);
    },
  });

  return {
    anteproyectos,
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

export const useAnteproyectoById = (id: string) => {
  return useQuery({
    queryKey: ['anteproyecto', id],
    queryFn: () => getAnteproyectoById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
