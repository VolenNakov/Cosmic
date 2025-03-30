import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { galleryService } from '../services/galleryService';
import { ImagePreviewModalProps } from '../types';

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  imageId,
  onClose,
}) => {
  const { data: image, isLoading, error } = useQuery({
    queryKey: ['galleryItem', imageId],
    queryFn: () => galleryService.getGalleryItem(imageId),
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Error</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-red-500">Failed to load image details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{image.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Original Image</h3>
              <img
                src={image.imageUrl}
                alt="Original"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Compressed Image</h3>
              <img
                src={image.compressedImageUrl}
                alt="Compressed"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Uncertainty Map</h3>
              <img
                src={image.uncertaintyMap}
                alt="Uncertainty"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  <span className="font-medium">Compression:</span>{' '}
                  {image.compression}%
                </p>
                <p>
                  <span className="font-medium">Image ID:</span> {image.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 