import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Dog, DogFormData, DogFilters } from '@/types';
import { apiService } from '@/services/api';
import { firebaseService } from '@/services/firebase';

export const useDogs = (filters?: DogFilters) => {
  const queryClient = useQueryClient();

  const {
    data: dogs = [],
    isLoading,
    error,
    refetch
  } = useQuery(
    ['dogs', filters],
    () => apiService.getDogs(filters),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const createDogMutation = useMutation(
    (dogData: DogFormData) => apiService.createDog(dogData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['dogs']);
      },
    }
  );

  const updateDogMutation = useMutation(
    ({ dogId, dogData }: { dogId: string; dogData: DogFormData }) =>
      apiService.updateDog(dogId, dogData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['dogs']);
      },
    }
  );

  const deleteDogMutation = useMutation(
    (dogId: string) => apiService.deleteDog(dogId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['dogs']);
      },
    }
  );

  return {
    dogs,
    isLoading,
    error,
    refetch,
    createDog: createDogMutation.mutate,
    updateDog: updateDogMutation.mutate,
    deleteDog: deleteDogMutation.mutate,
    isCreating: createDogMutation.isLoading,
    isUpdating: updateDogMutation.isLoading,
    isDeleting: deleteDogMutation.isLoading,
  };
};

export const useDog = (dogId: string) => {
  const {
    data: dog,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['dog', dogId],
    () => apiService.getDog(dogId),
    {
      enabled: !!dogId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  return {
    dog,
    isLoading,
    error,
    refetch,
  };
};

export const useDogPhoto = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadPhoto = useCallback(async (dogId: string, file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const photoUrl = await firebaseService.uploadDogPhoto(dogId, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return photoUrl;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  const deletePhoto = useCallback(async (dogId: string, photoUrl: string): Promise<void> => {
    try {
      await firebaseService.deleteDogPhoto(dogId, photoUrl);
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    uploadPhoto,
    deletePhoto,
    isUploading,
    uploadProgress,
  };
};

export const useDogRealTimeData = (dogId: string) => {
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!dogId) return;

    const unsubscribe = firebaseService.subscribeToDogData(dogId, (data) => {
      setSensorData(data);
      setIsConnected(true);
    });

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [dogId]);

  return {
    sensorData,
    isConnected,
  };
};
