import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { UploadProps } from '../types';

export const Upload: React.FC<UploadProps> = ({ onUploadComplete }) => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('File uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      onUploadComplete();
    },
    onError: () => {
      toast.error('Failed to upload file');
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        uploadMutation.mutate(file);
      });
    },
    [uploadMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Upload Image</h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
          }`}
      >
        <input {...getInputProps()} />
        <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-400 mb-2">
          {isDragActive
            ? 'Drop the file here'
            : 'Drag and drop an image here, or click to select'}
        </p>
        <p className="text-sm text-gray-500">
          Supported formats: PNG, JPG, JPEG, GIF
        </p>
      </div>

      {uploadMutation.isPending && (
        <div className="text-center text-gray-400">
          Uploading...
        </div>
      )}
    </div>
  );
}; 