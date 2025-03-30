import React from 'react';
import { BarChart3, Image, Upload, Settings } from 'lucide-react';

export const Stats: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <Image className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Images</p>
              <p className="text-2xl font-semibold">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-full">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Uploaded Today</p>
              <p className="text-2xl font-semibold">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-full">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Compression</p>
              <p className="text-2xl font-semibold">75%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-50 rounded-full">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Processing Time</p>
              <p className="text-2xl font-semibold">2.3s</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Compression Distribution</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[30, 45, 60, 75, 90].map((value) => (
            <div key={value} className="flex-1">
              <div
                className="bg-blue-500 rounded-t"
                style={{ height: `${value}%` }}
              />
              <p className="text-center text-sm text-gray-600 mt-2">{value}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 