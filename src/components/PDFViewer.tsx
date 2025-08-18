import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PageConfig } from '../types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  selectedPages: number[];
  pageConfigs: PageConfig[];
  onPageSelect: (pageIndex: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  selectedPages,
  pageConfigs,
  onPageSelect,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setError(error);
  };

  const getPositionStyle = (position: { x: number, y: number }) => {
    return {
      left: `${position.x}%`,
      bottom: `${position.y}%`,
      transform: 'translateX(-50%)'
    };
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">Error loading PDF: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="flex flex-col items-center space-y-4"
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={`page_${index + 1}`}
            className={`relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${
              selectedPages.includes(index) 
                ? 'ring-4 ring-blue-500 shadow-lg transform scale-[1.02]' 
                : 'hover:shadow-md hover:scale-[1.01] shadow-sm'
            }`}
            onClick={() => onPageSelect(index)}
          >
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-gray-900 bg-opacity-80 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                Page {index + 1}
              </span>
            </div>
            
            {selectedPages.includes(index) && (
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            
            <Page
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="rounded-lg"
              width={Math.min(600, window.innerWidth - 32)}
            />

            {pageConfigs[index] && (
              <div className="absolute inset-0 pointer-events-none">
                {pageConfigs[index].hasBorder && (
                  <div
                    className="absolute border-2 border-blue-500 border-opacity-50"
                    style={{
                      top: `${pageConfigs[index].borderMargin}px`,
                      left: `${pageConfigs[index].borderMargin}px`,
                      right: `${pageConfigs[index].borderMargin}px`,
                      bottom: `${pageConfigs[index].borderMargin}px`,
                    }}
                  />
                )}
                
                {pageConfigs[index].hasPageNumber && pageConfigs[index].sequentialNumber !== undefined && (
                  <div
                    className="absolute"
                    style={{
                      ...getPositionStyle(pageConfigs[index].pageNumberPosition),
                      fontSize: `${pageConfigs[index].pageNumberSize}px`
                    }}
                  >
                    <span className={`bg-blue-500 bg-opacity-30 px-2 py-1 rounded-md shadow-sm
                      ${pageConfigs[index].pageNumberBold ? 'font-bold' : ''}`}
                    >
                      {pageConfigs[index].sequentialNumber}
                    </span>
                  </div>
                )}

                {pageConfigs[index].hasFooter && pageConfigs[index].footerText && (
                  <div
                    className="absolute"
                    style={{
                      ...getPositionStyle(pageConfigs[index].footerPosition),
                      fontSize: `${pageConfigs[index].footerSize}px`
                    }}
                  >
                    <span className={`bg-blue-500 bg-opacity-30 px-2 py-1 rounded-md shadow-sm
                      ${pageConfigs[index].footerBold ? 'font-bold' : ''}`}
                    >
                      {pageConfigs[index].footerText}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;