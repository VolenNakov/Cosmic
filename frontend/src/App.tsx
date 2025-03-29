import React, { useState } from 'react';
import { Upload, Settings, Image, Satellite, ArrowUpDown, BarChart3, Database, Gauge, X } from 'lucide-react';

type Tab = 'stats' | 'upload' | 'gallery' | 'settings';

interface GalleryItem {
  id: number;
  title: string;
  compression: number;
  imageUrl: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [nextImage, setNextImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    { id: 1, title: 'Mars Surface Analysis', compression: 85, imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80' },
    { id: 2, title: 'Europa Ice Formations', compression: 82, imageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&q=80' },
    { id: 3, title: 'Titan Atmosphere Data', compression: 88, imageUrl: 'https://images.unsplash.com/photo-1614314107768-6018061b5b72?auto=format&fit=crop&q=80' },
    { id: 4, title: 'Enceladus Geysers', compression: 91, imageUrl: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&q=80' },
    { id: 5, title: 'Io Volcanic Activity', compression: 87, imageUrl: 'https://images.unsplash.com/photo-1614642240262-a452c2c11724?auto=format&fit=crop&q=80' },
    { id: 6, title: 'Saturn Ring Structure', compression: 89, imageUrl: 'https://images.unsplash.com/photo-1614642179275-669e2643c486?auto=format&fit=crop&q=80' },
  ];

  const tabs = [
    { id: 'stats' as Tab, label: 'Statistics', icon: BarChart3 },
    { id: 'upload' as Tab, label: 'Upload Data', icon: Upload },
    { id: 'gallery' as Tab, label: 'Data Gallery', icon: Image },
    { id: 'settings' as Tab, label: 'Compression Settings', icon: Settings },
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

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo Section */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <Satellite className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-sm font-bold">DeepSpace Compress AI</h1>
              <p className="text-xs text-slate-400">Data Compression</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-slate-800/50 border-b border-slate-700">
          <div className="px-8 py-4">
            <h2 className="text-xl font-semibold">{tabs.find(t => t.id === activeTab)?.label}</h2>
          </div>
        </header>

        <main className="p-8">
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Database className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-medium">Total Data Processed</h3>
                  </div>
                  <p className="text-3xl font-bold">2.7 TB</p>
                  <p className="text-sm text-slate-400 mt-2">+124 GB this week</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Gauge className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-lg font-medium">Avg. Compression Ratio</h3>
                  </div>
                  <p className="text-3xl font-bold">85.2%</p>
                  <p className="text-sm text-slate-400 mt-2">+2.1% from last month</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <ArrowUpDown className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-medium">Bandwidth Saved</h3>
                  </div>
                  <p className="text-3xl font-bold">1.9 TB</p>
                  <p className="text-sm text-slate-400 mt-2">Last 30 days</p>
                </div>
              </div>

              {/* Compression Performance */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-6">Compression Performance</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Image Data', value: 92, color: 'bg-blue-400' },
                    { label: 'Spectral Analysis', value: 78, color: 'bg-purple-400' },
                    { label: 'Telemetry Data', value: 88, color: 'bg-emerald-400' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-slate-400">{item.value}% compressed</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full">
                        <div 
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 hover:border-blue-400 transition-colors">
                  <ArrowUpDown className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Probe Data</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Drag and drop your data files here or click to browse
                  </p>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                    Select Files
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => handleImageClick(item)}
                  >
                    <div className="aspect-video bg-slate-900 rounded-md mb-4 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400">Compression Ratio: {item.compression}%</p>
                  </div>
                ))}
              </div>

              {/* Image Detail View */}
              {selectedImage && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                  <button 
                    className="absolute top-4 right-4 text-white/60 hover:text-white"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <div className="flex items-center w-full">
                    {/* Main Image */}
                    <div className="flex-1 p-8">
                      <div className="max-w-4xl mx-auto">
                        <img 
                          src={selectedImage.imageUrl} 
                          alt={selectedImage.title}
                          className="w-full h-auto rounded-lg shadow-2xl"
                        />
                        <div className="mt-4">
                          <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                          <p className="text-slate-400">Compression Ratio: {selectedImage.compression}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Next Image Preview */}
                    {nextImage && (
                      <div 
                        className="w-1/4 p-4 cursor-pointer transform hover:translate-x-2 transition-transform"
                        onClick={handleNextImage}
                      >
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <img 
                            src={nextImage.imageUrl} 
                            alt={nextImage.title}
                            className="w-full h-auto rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                          />
                          <p className="text-sm text-slate-400 mt-2">Next: {nextImage.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Compression Settings</h2>
              <div className="space-y-6">
                {['Image Quality', 'Compression Ratio', 'Priority Level'].map((setting) => (
                  <div key={setting} className="flex items-center justify-between">
                    <span className="text-slate-300">{setting}</span>
                    <div className="w-48 h-2 bg-slate-700 rounded-full">
                      <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;