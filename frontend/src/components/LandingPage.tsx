import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages: GalleryImage[] = [
    { id: 1, src: '/1.jpg' },
    { id: 2, src: '/2.jpg' },
    { id: 3, src: '/3.jpg' },
    { id: 4, src: '/4.jpg' },
    { id: 5, src: '/5.jpg' },
    { id: 6, src: '/6.jpg' },
    { id: 7, src: '/7.jpg' },
    { id: 8, src: '/8.jpg' }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Stars background */}
      <div className="fixed inset-0 bg-[url('/stars.png')] opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            COSMIC
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Compressed Optimized Space Mission Imagery Codec
          </p>
          <p className="text-lg text-gray-400 mb-12">
            Advanced image compression and optimization for space mission imagery
          </p>
          
          <div className="flex justify-center mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage; 