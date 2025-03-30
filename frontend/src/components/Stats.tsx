import React from 'react';
import { Database, Gauge, ArrowUpDown } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, iconColor }) => (
  <div className="bg-slate-800 rounded-lg p-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className={iconColor}>{icon}</div>
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-sm text-slate-400 mt-2">{subtitle}</p>
  </div>
);

interface PerformanceBarProps {
  label: string;
  value: number;
  color: string;
}

const PerformanceBar: React.FC<PerformanceBarProps> = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span className="text-slate-400">{value}% compressed</span>
    </div>
    <div className="h-2 bg-slate-700 rounded-full">
      <div 
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export const Stats: React.FC = () => {
  const performanceData = [
    { label: 'Image Data', value: 92, color: 'bg-blue-400' },
    { label: 'Spectral Analysis', value: 78, color: 'bg-purple-400' },
    { label: 'Telemetry Data', value: 88, color: 'bg-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Database className="w-6 h-6" />}
          title="Total Data Processed"
          value="2.7 TB"
          subtitle="+124 GB this week"
          iconColor="text-blue-400"
        />
        <StatCard
          icon={<Gauge className="w-6 h-6" />}
          title="Avg. Compression Ratio"
          value="85.2%"
          subtitle="+2.1% from last month"
          iconColor="text-emerald-400"
        />
        <StatCard
          icon={<ArrowUpDown className="w-6 h-6" />}
          title="Bandwidth Saved"
          value="1.9 TB"
          subtitle="Last 30 days"
          iconColor="text-purple-400"
        />
      </div>

      {/* Compression Performance */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-6">Compression Performance</h3>
        <div className="space-y-4">
          {performanceData.map((item) => (
            <PerformanceBar
              key={item.label}
              label={item.label}
              value={item.value}
              color={item.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 