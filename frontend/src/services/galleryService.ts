import { GalleryItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const galleryService = {
  async getGalleryItems(): Promise<GalleryItem[]> {
    const response = await fetchApi<GalleryItem[]>('/gallery');
    return response.data;
  },

  async getGalleryItem(id: number): Promise<GalleryItem> {
    const response = await fetchApi<GalleryItem>(`/gallery/${id}`);
    return response.data;
  },

  async updateGalleryItem(id: number, data: Partial<GalleryItem>): Promise<GalleryItem> {
    const response = await fetchApi<GalleryItem>(`/gallery/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async uploadImage(file: File): Promise<GalleryItem> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/gallery/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload Error: ${response.statusText}`);
    }

    return response.json();
  }
}; 