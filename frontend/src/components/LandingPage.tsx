import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

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
          
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Launch Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Advanced Compression</h3>
            <p className="text-gray-400">State-of-the-art image compression algorithms optimized for space imagery</p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Real-time Processing</h3>
            <p className="text-gray-400">Process and optimize images in real-time with minimal quality loss</p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">Space-Optimized</h3>
            <p className="text-gray-400">Specially designed for handling space mission imagery and data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 