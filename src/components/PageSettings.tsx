import React from 'react';
import { PageConfig } from '../types';
import { Square, Hash, Type } from 'lucide-react';

interface PageSettingsProps {
  config: PageConfig;
  onChange: (config: PageConfig) => void;
}

const PageSettings: React.FC<PageSettingsProps> = ({ config, onChange }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Page {config.pageNumber}</h3>
      </div>

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
              onChange={(e) => onChange({ ...config, hasBorder: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
          {config.hasBorder && (
            <input
              type="number"
              value={config.borderMargin}
              onChange={(e) => onChange({ ...config, borderMargin: Number(e.target.value) })}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
              min="0"
              max="100"
            />
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-600">Page Number</label>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.hasPageNumber}
              onChange={(e) => onChange({ ...config, hasPageNumber: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-600">Footer</label>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.hasFooter}
              onChange={(e) => onChange({ ...config, hasFooter: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {config.hasFooter && (
          <input
            type="text"
            value={config.footerText}
            onChange={(e) => onChange({ ...config, footerText: e.target.value })}
            placeholder="Enter footer text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        )}
      </div>
    </div>
  );
};

export default PageSettings;