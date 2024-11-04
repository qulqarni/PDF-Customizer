import React from 'react';
import { PageConfig } from '../types';
import PositionSelector from './PositionSelector';
import { Square, Hash, Type } from 'lucide-react';

interface PageConfigFormProps {
  config: PageConfig;
  onChange: (config: PageConfig) => void;
}

const PageConfigForm: React.FC<PageConfigFormProps> = ({ config, onChange }) => {
  const handleChange = (field: keyof PageConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="font-medium">Page {config.pageNumber} Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-600">Border</label>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.hasBorder}
              onChange={(e) => handleChange('hasBorder', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
          {config.hasBorder && (
            <input
              type="number"
              value={config.borderMargin}
              onChange={(e) => handleChange('borderMargin', Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
              min="0"
              max="100"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-600" />
              <label className="text-sm text-gray-600">Page Number</label>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasPageNumber}
                onChange={(e) => handleChange('hasPageNumber', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          {config.hasPageNumber && (
            <div className="ml-6 mt-2">
              <PositionSelector
                value={config.pageNumberPosition}
                onChange={(pos) => handleChange('pageNumberPosition', pos)}
                label="Position"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-gray-600" />
              <label className="text-sm text-gray-600">Footer</label>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasFooter}
                onChange={(e) => handleChange('hasFooter', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          {config.hasFooter && (
            <div className="ml-6 space-y-2">
              <input
                type="text"
                value={config.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter footer text"
              />
              <PositionSelector
                value={config.footerPosition}
                onChange={(pos) => handleChange('footerPosition', pos)}
                label="Position"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageConfigForm;