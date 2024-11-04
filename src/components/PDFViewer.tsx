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
    <div className="space-y-4">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="flex flex-col items-center"
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={`page_${index + 1}`}
            className={`relative mb-4 cursor-pointer transition-transform hover:scale-[1.01] ${
              selectedPages.includes(index) ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => onPageSelect(index)}
          >
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                Page {index + 1}
              </span>
            </div>
            
            <Page
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="shadow-lg"
              width={600}
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
                    <span className={`bg-blue-500 bg-opacity-25 px-2 py-1 rounded
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
                    <span className={`bg-blue-500 bg-opacity-25 px-2 py-1 rounded
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