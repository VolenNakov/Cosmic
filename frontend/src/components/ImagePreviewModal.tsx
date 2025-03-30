import React from 'react';
import { X, ArrowUpDown } from 'lucide-react';
import { GalleryItem } from '../types';

interface ImagePreviewModalProps {
  selectedImage: GalleryItem;
  onClose: () => void;
  onNext: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  selectedImage,
  onClose,
  onNext,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg max-w-6xl w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Original Image</h4>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Uncertainty Map</h4>
              <img
                src={selectedImage.uncertaintyMap}
                alt="Uncertainty Map"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Compressed Image</h4>
              <img
                src={selectedImage.compressedImageUrl}
                alt="Compressed Image"
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-slate-400">
              Compression: {selectedImage.compression}%
            </div>
            <button
              onClick={onNext}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
            >
              <span>Next Image</span>
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 