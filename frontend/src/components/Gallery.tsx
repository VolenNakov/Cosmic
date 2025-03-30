import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../services/galleryService';
import { GalleryProps } from '../types';

export const Gallery: React.FC<GalleryProps> = ({ onImageClick }) => {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['galleryItems'],
    queryFn: galleryService.getGalleryItems,
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
      <div className="text-red-500 text-center">
        <p>Error loading gallery items. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items?.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onImageClick(item.id)}
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">Compression: {item.compression}%</p>
          </div>
        </div>
      ))}
    </div>
  );
}; 