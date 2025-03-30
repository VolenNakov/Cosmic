import React, { useState } from 'react';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [compressionLevel, setCompressionLevel] = useState(75);
  const [quality, setQuality] = useState(85);
  const [autoOptimize, setAutoOptimize] = useState(true);

  const handleSave = () => {
    // TODO: Implement settings save functionality
    console.log('Saving settings:', { compressionLevel, quality, autoOptimize });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Compression Settings</h2>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compression Level
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12 text-right">
              {compressionLevel}%
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Quality
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12 text-right">
              {quality}%
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoOptimize"
            checked={autoOptimize}
            onChange={(e) => setAutoOptimize(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="autoOptimize"
            className="ml-2 block text-sm text-gray-700"
          >
            Auto-optimize compression based on image content
          </label>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Current Settings</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Compression Level: {compressionLevel}%</p>
          <p>Image Quality: {quality}%</p>
          <p>Auto-optimize: {autoOptimize ? 'Enabled' : 'Disabled'}</p>
        </div>
      </div>
    </div>
  );
}; 