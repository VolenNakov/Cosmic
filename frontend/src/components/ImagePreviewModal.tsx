import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ChevronRight } from 'lucide-react';
import { ImagePreviewModalProps } from '../types';

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  imageId,
  onClose,
}) => {
  const { data: image, isLoading, error } = useQuery({
    queryKey: ['gallery', imageId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/files/${imageId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch image details');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div className="text-red-400">Failed to load image details</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{image?.filename}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden mb-4">
            <img
              src={image?.url}
              alt={image?.filename}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-gray-400">
              Size: {image?.size || 'N/A'}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 