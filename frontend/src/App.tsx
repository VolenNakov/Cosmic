import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Upload as UploadIcon, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Stats } from './components/Stats';
import { Upload } from './components/Upload';
import { Gallery } from './components/Gallery';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { Tab, TabItem } from './types';

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
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
        <main className="flex-1 overflow-auto p-8">
          {activeTab === 'stats' && <Stats />}
          {activeTab === 'upload' && <Upload onUploadComplete={handleUploadComplete} />}
          {activeTab === 'gallery' && <Gallery onImageClick={handleImageClick} />}
        </main>
        {selectedImageId && (
          <ImagePreviewModal
            imageId={selectedImageId}
            onClose={() => setSelectedImageId(null)}
          />
        )}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;