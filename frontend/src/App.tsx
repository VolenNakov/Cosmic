import { useState } from 'react';
import { Upload as UploadIcon, Settings as SettingsIcon, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Stats } from './components/Stats';
import { Upload } from './components/Upload';
import { Gallery } from './components/Gallery';
import { Settings } from './components/Settings';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { Tab, GalleryItem, TabItem } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [nextImage, setNextImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    { 
      id: 1, 
      title: 'Mars Surface Analysis', 
      compression: 85, 
      imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80',
      uncertaintyMap: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80',
      compressedImageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80'
    },
    { 
      id: 2, 
      title: 'Europa Ice Formations', 
      compression: 82, 
      imageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&q=80',
      uncertaintyMap: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&q=80',
      compressedImageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&q=80'
    },
    { 
      id: 3, 
      title: 'Titan Atmosphere Data', 
      compression: 88, 
      imageUrl: 'https://images.unsplash.com/photo-1614314107768-6018061b5b72?auto=format&fit=crop&q=80',
      uncertaintyMap: 'https://images.unsplash.com/photo-1614314107768-6018061b5b72?auto=format&fit=crop&q=80',
      compressedImageUrl: 'https://images.unsplash.com/photo-1614314107768-6018061b5b72?auto=format&fit=crop&q=80'
    },
    { 
      id: 4, 
      title: 'Enceladus Geysers', 
      compression: 91, 
      imageUrl: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&q=80',
      uncertaintyMap: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&q=80',
      compressedImageUrl: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&q=80'
    },
    { 
      id: 5, 
      title: 'Io Volcanic Activity', 
      compression: 87, 
      imageUrl: 'https://images.unsplash.com/photo-1614642240262-a452c2c11724?auto=format&fit=crop&q=80',
      uncertaintyMap: 'https://images.unsplash.com/photo-1614642240262-a452c2c11724?auto=format&fit=crop&q=80',
      compressedImageUrl: 'https://images.unsplash.com/photo-1614642240262-a452c2c11724?auto=format&fit=crop&q=80'
    },
    { 
      id: 6, 
      title: 'Saturn Ring Structure', 
      compression: 89, 
      imageUrl: 'https://images.unsplash.com/photo-1614642179275-669e2643c486?auto=format&fit=crop&q=80',
      uncertaintyMap: 'https://images.unsplash.com/photo-1614642179275-669e2643c486?auto=format&fit=crop&q=80',
      compressedImageUrl: 'https://images.unsplash.com/photo-1614642179275-669e2643c486?auto=format&fit=crop&q=80'
    },
  ];

  const tabs: TabItem[] = [
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'upload', label: 'Upload Data', icon: UploadIcon },
    { id: 'gallery', label: 'Data Gallery', icon: ImageIcon },
    { id: 'settings', label: 'Compression Settings', icon: SettingsIcon },
  ];

  const handleImageClick = (item: GalleryItem) => {
    const currentIndex = galleryItems.findIndex(i => i.id === item.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setSelectedImage(item);
    setNextImage(galleryItems[nextIndex]);
  };

  const handleNextImage = () => {
    if (nextImage) {
      const currentIndex = galleryItems.findIndex(i => i.id === nextImage.id);
      const nextIndex = (currentIndex + 1) % galleryItems.length;
      setSelectedImage(nextImage);
      setNextImage(galleryItems[nextIndex]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <Stats />;
      case 'upload':
        return <Upload />;
      case 'gallery':
        return <Gallery items={galleryItems} onImageClick={handleImageClick} />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      <div className="flex-1">
        <header className="bg-slate-800/50 border-b border-slate-700">
          <div className="px-8 py-4">
            <h2 className="text-xl font-semibold">{tabs.find(t => t.id === activeTab)?.label}</h2>
          </div>
        </header>

        <main className="p-8">
          {renderContent()}
        </main>
      </div>

      {selectedImage && (
        <ImagePreviewModal
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNext={handleNextImage}
        />
      )}
    </div>
  );
}

export default App;