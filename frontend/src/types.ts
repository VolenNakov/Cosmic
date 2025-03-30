import { LucideIcon } from 'lucide-react';

export type Tab = 'stats' | 'upload' | 'gallery';

export interface TabItem {
  id: Tab;
  label: string;
  icon: LucideIcon;
}

export interface GalleryItem {
  id: string;
  title: string;
  compression: number;
  imageUrl: string;
  uncertaintyMap: string;
  compressedImageUrl: string;
}

export interface ImagePreviewModalProps {
  imageId: string;
  onClose: () => void;
}

export interface UploadProps {
  onUploadComplete: () => void;
}

export interface GalleryProps {
  onImageClick: (imageId: string) => void;
} 