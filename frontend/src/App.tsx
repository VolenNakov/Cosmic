import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Upload as UploadIcon, Settings as SettingsIcon, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Stats } from './components/Stats';
import { Upload } from './components/Upload';
import { Gallery } from './components/Gallery';
import { Settings } from './components/Settings';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { Tab, TabItem } from './types';
import { galleryService } from './services/galleryService';

// Create a client
const queryClient = new QueryClient();

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('gallery');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleImageClick = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  const handleUploadComplete = () => {
    setActiveTab('gallery');
  };

  const tabs: TabItem[] = [
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'upload', label: 'Upload', icon: UploadIcon },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'settings', label: 'Compression Settings', icon: SettingsIcon },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
        <main className="flex-1 overflow-auto p-8">
          {activeTab === 'stats' && <Stats />}
          {activeTab === 'upload' && <Upload onUploadComplete={handleUploadComplete} />}
          {activeTab === 'gallery' && <Gallery onImageClick={handleImageClick} />}
          {activeTab === 'settings' && <Settings />}
        </main>
        {selectedImageId && (
          <ImagePreviewModal
            imageId={selectedImageId}
            onClose={() => setSelectedImageId(null)}
          />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default App;