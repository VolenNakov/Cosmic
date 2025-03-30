export type Tab = 'stats' | 'upload' | 'gallery' | 'settings';

export interface GalleryItem {
  id: number;
  title: string;
  compression: number;
  imageUrl: string;
  uncertaintyMap?: string;
  compressedImageUrl?: string;
}

export interface TabItem {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
} 