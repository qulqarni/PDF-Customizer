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
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleChange = (field: keyof Omit<PageConfig, 'pageNumber'>, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center lg:block">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-medium text-lg lg:text-base">Batch Settings</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <span className="text-sm text-gray-600 mt-1 lg:mt-0 block">
          {selectedPages.length} of {totalPages} pages selected
        </span>
      </div>
      
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Border</label>
          </div>
          <div className="flex items-center gap-3 flex-1">
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
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Margin:</label>
                <input
                  type="number"
                  value={config.borderMargin}
                  onChange={(e) => handleChange('borderMargin', Number(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Page Number</label>
            </div>
            <div className="flex items-center gap-3 flex-1">
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
                  className={`p-2 rounded-md border transition-colors ${
                    config.pageNumberBold 
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Toggle Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {config.hasPageNumber && (
            <div className="ml-0 sm:ml-6 space-y-4 p-3 bg-white border rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">X Position (%)</label>
                  <input
                    type="number"
                    value={config.pageNumberPosition.x}
                    onChange={(e) => handleChange('pageNumberPosition', { 
                      ...config.pageNumberPosition, 
                      x: Math.min(100, Math.max(0, Number(e.target.value))) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Y Position (%)</label>
                  <input
                    type="number"
                    value={config.pageNumberPosition.y}
                    onChange={(e) => handleChange('pageNumberPosition', { 
                      ...config.pageNumberPosition, 
                      y: Math.min(100, Math.max(0, Number(e.target.value))) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size (pt)</label>
                  <input
                    type="number"
                    value={config.pageNumberSize}
                    onChange={(e) => handleChange('pageNumberSize', Math.max(6, Math.min(72, Number(e.target.value))))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="6"
                    max="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Starting Number</label>
                  <input
                    type="number"
                    value={config.customPageNumber}
                    onChange={(e) => handleChange('customPageNumber', Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Footer</label>
            </div>
            <div className="flex items-center gap-3 flex-1">
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
                  className={`p-2 rounded-md border transition-colors ${
                    config.footerBold 
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Toggle Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {config.hasFooter && (
            <div className="ml-0 sm:ml-6 space-y-4 p-3 bg-white border rounded-lg">
              <input
                type="text"
                value={config.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter footer text"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">X Position (%)</label>
                  <input
                    type="number"
                    value={config.footerPosition.x}
                    onChange={(e) => handleChange('footerPosition', { 
                      ...config.footerPosition, 
                      x: Math.min(100, Math.max(0, Number(e.target.value))) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Y Position (%)</label>
                  <input
                    type="number"
                    value={config.footerPosition.y}
                    onChange={(e) => handleChange('footerPosition', { 
                      ...config.footerPosition, 
                      y: Math.min(100, Math.max(0, Number(e.target.value))) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Size (pt)</label>
                <input
                  type="number"
                  value={config.footerSize}
                  onChange={(e) => handleChange('footerSize', Math.max(6, Math.min(72, Number(e.target.value))))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="6"
                  max="72"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedPages.length === 0 ? (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            Select one or more pages from the preview to apply these settings.
          </p>
        </div>
      ) : (
        <button
          onClick={onProcess}
          disabled={processing}
          className={`w-full mt-6 flex items-center justify-center space-x-2 px-6 py-4 rounded-lg text-white font-medium text-lg transition-colors
            ${processing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
        >
          <span>{processing ? 'Processing...' : 'Process and Download'}</span>
        </button>
      )}
    </div>
  );
};

export default BatchConfigForm;