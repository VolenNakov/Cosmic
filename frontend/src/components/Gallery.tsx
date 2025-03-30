import React from 'react';
import { GalleryItem } from '../types';

interface GalleryProps {
  items: GalleryItem[];
  onImageClick: (item: GalleryItem) => void;
}

interface GalleryItemCardProps {
  item: GalleryItem;
  onClick: () => void;
}

const GalleryItemCard: React.FC<GalleryItemCardProps> = ({ item, onClick }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer"
  >
    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-800">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-sm text-slate-300">Compression: {item.compression}%</p>
        </div>
      </div>
    </div>
  </div>
);

export const Gallery: React.FC<GalleryProps> = ({ items, onImageClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <GalleryItemCard
          key={item.id}
          item={item}
          onClick={() => onImageClick(item)}
        />
      ))}
    </div>
  );
}; 