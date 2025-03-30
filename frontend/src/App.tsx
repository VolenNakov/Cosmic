import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { Satellite } from 'lucide-react';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <Satellite className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">COSMIC</h1>
              <p className="text-xs text-slate-400">Data Compression</p>
            </div>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;