import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload as UploadIcon } from 'lucide-react';
import { galleryService } from '../services/galleryService';

interface UploadProps {
  onUploadComplete?: () => void;
}

export const Upload: React.FC<UploadProps> = ({ onUploadComplete }) => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => galleryService.uploadImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      onUploadComplete?.();
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadMutation.mutate(acceptedFiles[0]);
    }
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : uploadMutation.isError ? (
          <div className="text-red-500">
            <p>Error uploading image. Please try again.</p>
            <p className="text-sm mt-1">{uploadMutation.error.message}</p>
          </div>
        ) : uploadMutation.isSuccess ? (
          <div className="text-green-500">
            <p>Upload successful!</p>
            <p className="text-sm mt-1">Your image has been processed.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag and drop an image here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: PNG, JPG, JPEG, GIF
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 