import React from 'react';
import { PageConfig } from '../types';

interface PDFPreviewProps {
  config: PageConfig;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ config }) => {
  const getPageNumberPosition = (position: string) => {
    switch (position) {
      case 'left': return 'left-4';
      case 'right': return 'right-4';
      default: return 'left-1/2 -translate-x-1/2';
    }
  };

  const getFooterPosition = (position: string) => {
    switch (position) {
      case 'left': return 'left-4';
      case 'right': return 'right-4';
      default: return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div className="w-full aspect-[1/1.414] bg-white rounded-lg shadow-lg relative">
      {/* Border Preview */}
      {config.hasBorder && (
        <div
          className="absolute border-2 border-gray-300"
          style={{
            top: `${config.borderMargin}px`,
            left: `${config.borderMargin}px`,
            right: `${config.borderMargin}px`,
            bottom: `${config.borderMargin}px`,
          }}
        />
      )}

      {/* Page Number Preview */}
      {config.hasPageNumber && (
        <div className={`absolute bottom-8 ${getPageNumberPosition(config.pageNumberPosition)}`}>
          <span className="text-sm text-gray-600">{config.pageNumber}</span>
        </div>
      )}

      {/* Footer Preview */}
      {config.hasFooter && config.footerText && (
        <div className={`absolute bottom-4 ${getFooterPosition(config.footerPosition)}`}>
          <span className="text-sm text-gray-600">{config.footerText}</span>
        </div>
      )}
    </div>
  );
};

export default PDFPreview;