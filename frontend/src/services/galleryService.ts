import { GalleryItem } from '../types';
import api from './api';

export const galleryService = {
  async getGalleryItems(): Promise<GalleryItem[]> {
    return api.get('/files');
  },

  async getGalleryItem(id: string): Promise<GalleryItem> {
    return api.get(`/files/${id}`);
  },

  async uploadImage(file: File): Promise<GalleryItem> {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<GalleryItem> {
    return api.patch(`/files/${id}`, data);
  },
}; 