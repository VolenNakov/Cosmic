import { GalleryItem } from '../types';
import api from './api';

export const galleryService = {
  async getGalleryItems(): Promise<GalleryItem[]> {
    return api.get('/gallery');
  },

  async getGalleryItem(id: string): Promise<GalleryItem> {
    return api.get(`/gallery/${id}`);
  },

  async uploadImage(file: File): Promise<GalleryItem> {
    const formData = new FormData();
    formData.append('image', file);

    return api.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<GalleryItem> {
    return api.patch(`/gallery/${id}`, data);
  },
}; 