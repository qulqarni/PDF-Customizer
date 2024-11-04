import React from 'react';
import { PageConfig } from '../types';
import { Square, Hash, Type, Bold } from 'lucide-react';

interface BatchConfigFormProps {
  config: Omit<PageConfig, 'pageNumber'>;
  onChange: (config: Omit<PageConfig, 'pageNumber'>) => void;
  selectedPages: number[];
  totalPages: number;
  onProcess: () => void;
  processing: boolean;
}

const BatchConfigForm: React.FC<BatchConfigFormProps> = ({
  config,
  onChange,
  selectedPages,
  totalPages,
  onProcess,
  processing
}) => {
  const handleChange = (field: keyof Omit<PageConfig, 'pageNumber'>, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Batch Settings</h3>
        <span className="text-sm text-gray-600">
          {selectedPages.length} of {totalPages} pages selected
        </span>
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
            {config.hasPageNumber && (
              <button
                onClick={() => handleChange('pageNumberBold', !config.pageNumberBold)}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  config.pageNumberBold ? 'bg-gray-200' : ''
                }`}
                title="Toggle Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
            )}
          </div>
          {config.hasPageNumber && (
            <div className="ml-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">X Position (%)</label>
                  <input
                    type="number"
                    value={config.pageNumberPosition.x}
                    onChange={(e) => handleChange('pageNumberPosition', { 
                      ...config.pageNumberPosition, 
                      x: Math.min(100, Math.max(0, Number(e.target.value))) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Y Position (%)</label>
                  <input
                    type="number"
                    value={config.pageNumberPosition.y}
                    onChange={(e) => handleChange('pageNumberPosition', { 
                      ...config.pageNumberPosition, 
                      y: Math.min(100, Math.max(0, Number(e.target.value))) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Font Size (pt)</label>
                  <input
                    type="number"
                    value={config.pageNumberSize}
                    onChange={(e) => handleChange('pageNumberSize', Math.max(6, Math.min(72, Number(e.target.value))))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="6"
                    max="72"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Page Number</label>
                  <input
                    type="number"
                    value={config.customPageNumber}
                    onChange={(e) => handleChange('customPageNumber', Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="1"
                  />
                </div>
              </div>
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
            {config.hasFooter && (
              <button
                onClick={() => handleChange('footerBold', !config.footerBold)}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  config.footerBold ? 'bg-gray-200' : ''
                }`}
                title="Toggle Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {config.hasFooter && (
            <div className="ml-6 space-y-4">
              <input
                type="text"
                value={config.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter footer text"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">X Position (%)</label>
                  <input
                    type="number"
                    value={config.footerPosition.x}
                    onChange={(e) => handleChange('footerPosition', { 
                      ...config.footerPosition, 
                      x: Math.min(100, Math.max(0, Number(e.target.value))) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Y Position (%)</label>
                  <input
                    type="number"
                    value={config.footerPosition.y}
                    onChange={(e) => handleChange('footerPosition', { 
                      ...config.footerPosition, 
                      y: Math.min(100, Math.max(0, Number(e.target.value))) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Font Size (pt)</label>
                <input
                  type="number"
                  value={config.footerSize}
                  onChange={(e) => handleChange('footerSize', Math.max(6, Math.min(72, Number(e.target.value))))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  min="6"
                  max="72"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedPages.length === 0 ? (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Select one or more pages from the preview to apply these settings.
          </p>
        </div>
      ) : (
        <button
          onClick={onProcess}
          disabled={processing}
          className={`w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-white
            ${processing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <span>{processing ? 'Processing...' : 'Process and Download'}</span>
        </button>
      )}
    </div>
  );
};

export default BatchConfigForm;