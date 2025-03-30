import React from 'react';

interface SettingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const SettingSlider: React.FC<SettingSliderProps> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-300">{label}</span>
    <div className="w-48 h-2 bg-slate-700 rounded-full">
      <div 
        className="w-3/4 h-full bg-blue-500 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export const Settings: React.FC = () => {
  const settings = [
    { label: 'Image Quality', value: 75 },
    { label: 'Compression Ratio', value: 85 },
    { label: 'Priority Level', value: 60 },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Compression Settings</h2>
      <div className="space-y-6">
        {settings.map((setting) => (
          <SettingSlider
            key={setting.label}
            label={setting.label}
            value={setting.value}
            onChange={(value) => console.log(`Setting ${setting.label} changed to ${value}`)}
          />
        ))}
      </div>
    </div>
  );
}; 