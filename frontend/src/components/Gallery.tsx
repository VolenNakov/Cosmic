import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Image as ImageIcon } from 'lucide-react';
import { GalleryProps, FileItem } from '../types';

export const Gallery: React.FC<GalleryProps> = ({ onImageClick }) => {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const response = await fetch('/api/v1/files/list');
      if (!response.ok) {
        throw new Error('Failed to fetch gallery items');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        Failed to load gallery items
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item: FileItem) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors cursor-pointer"
            onClick={() => onImageClick(item.id)}
          >
            <div className="aspect-video bg-gray-700 relative">
              <img
                src={item.url}
                alt={item.filename}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium truncate">{item.filename}</h3>
              <p className="text-sm text-gray-400 mt-1">
                Click to view details
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 