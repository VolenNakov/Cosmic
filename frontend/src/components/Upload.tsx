import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const Upload: React.FC = () => {
  return (
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
  );
}; 