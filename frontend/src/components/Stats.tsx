import React from 'react';
import { BarChart3, Image, Upload } from 'lucide-react';

export const Stats: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Image className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Images</p>
              <p className="text-2xl font-semibold text-white">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Upload className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Uploads Today</p>
              <p className="text-2xl font-semibold text-white">45</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg. Compression</p>
              <p className="text-2xl font-semibold text-white">85%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="flex-1">
                <p className="text-white">Image uploaded and processed</p>
                <p className="text-sm text-gray-400">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 