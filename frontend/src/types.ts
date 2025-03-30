import React from 'react';

export type Tab = 'stats' | 'upload' | 'gallery' | 'settings';

export interface GalleryItem {
  id: string;
  title: string;
  compression: number;
  imageUrl: string;
  uncertaintyMap: string;
  compressedImageUrl: string;
}

export interface TabItem {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ImagePreviewModalProps {
  imageId: string;
  onClose: () => void;
}

export interface GalleryProps {
  onImageClick: (imageId: string) => void;
}

export interface UploadProps {
  onUploadComplete?: () => void;
}

export interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  tabs: TabItem[];
} 