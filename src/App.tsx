import React, { useState } from 'react';
import { FileText, Github } from 'lucide-react';
import PDFDropzone from './components/PDFDropzone';
import PDFViewer from './components/PDFViewer';
import BatchConfigForm from './components/BatchConfigForm';
import { PageConfig, ProcessingError } from './types';
import { processPDF } from './utils/pdfProcessor';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<ProcessingError | null>(null);
  const [batchConfig, setBatchConfig] = useState<Omit<PageConfig, 'pageNumber'>>({
    hasBorder: true,
    borderMargin: 40,
    hasPageNumber: true,
    pageNumberPosition: { x: 50, y: 5 },
    pageNumberBold: false,
    pageNumberSize: 12,
    hasFooter: false,
    footerText: '',
    footerPosition: { x: 50, y: 2 },
    footerBold: false,
    footerSize: 10
  });

  const handleFileAccepted = async (file: File) => {
    try {
      setPdfFile(file);
      const pageCount = await processPDF.getPageCount(file);
      
      setPageConfigs(Array.from({ length: pageCount }, (_, i) => ({
        pageNumber: i + 1,
        hasBorder: false,
        borderMargin: 40,
        hasPageNumber: false,
        pageNumberPosition: { x: 50, y: 5 },
        pageNumberBold: false,
        pageNumberSize: 12,
        hasFooter: false,
        footerText: '',
        footerPosition: { x: 50, y: 2 },
        footerBold: false,
        footerSize: 10
      })));
      
      setError(null);
      setSelectedPages([]);
    } catch (err) {
      setError({
        message: 'Failed to load PDF file. Please ensure it is a valid PDF document.',
        code: 'FILE_LOAD_ERROR'
      });
      setPdfFile(null);
      setPageConfigs([]);
    }
  };

  const handleBatchConfigChange = (newConfig: Omit<PageConfig, 'pageNumber'>) => {
    setBatchConfig(newConfig);
    if (selectedPages.length > 0) {
      setPageConfigs(configs => 
        configs.map((config, index) => 
          selectedPages.includes(index) ? { ...config, ...newConfig } : config
        )
      );
    }
  };

  const handlePageSelection = (pageIndex: number) => {
    setSelectedPages(prev => {
      let newSelection: number[];
      if (prev.includes(pageIndex)) {
        newSelection = prev.filter(p => p !== pageIndex);
      } else {
        newSelection = [...prev, pageIndex];
      }

      setPageConfigs(configs =>
        configs.map((config, index) => {
          if (newSelection.includes(index)) {
            const sequentialNumber = newSelection.indexOf(index) + 1;
            return {
              ...config,
              ...batchConfig,
              sequentialNumber
            };
          }
          return {
            ...config,
            hasBorder: false,
            borderMargin: 40,
            hasPageNumber: false,
            pageNumberPosition: { x: 50, y: 5 },
            pageNumberBold: false,
            pageNumberSize: 12,
            hasFooter: false,
            footerText: '',
            footerPosition: { x: 50, y: 2 },
            footerBold: false,
            footerSize: 10,
            sequentialNumber: undefined
          };
        })
      );

      return newSelection;
    });
  };

  const handleProcessPDF = async () => {
    if (!pdfFile) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const modifiedPdfBlob = await processPDF.process(pdfFile, pageConfigs);
      const url = URL.createObjectURL(modifiedPdfBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `modified_${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setError(null);
    } catch (err) {
      setError({
        message: 'Failed to process PDF. Please try again or use a different file.',
        code: 'PROCESSING_ERROR'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">PDF Customizer</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            A powerful tool to customize your PDF files. Add page numbers, borders, and footers with just a few clicks.
            Select multiple pages and apply batch modifications effortlessly.
          </p>
        </div>
        
        {!pdfFile ? (
          <PDFDropzone onFileAccepted={handleFileAccepted} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  File: {pdfFile.name}
                </p>
                <button
                  onClick={() => {
                    setPdfFile(null);
                    setPageConfigs([]);
                    setSelectedPages([]);
                  }}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Remove file
                </button>
              </div>

              <PDFViewer
                file={pdfFile}
                selectedPages={selectedPages}
                pageConfigs={pageConfigs}
                onPageSelect={handlePageSelection}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BatchConfigForm
                  config={batchConfig}
                  onChange={handleBatchConfigChange}
                  selectedPages={selectedPages}
                  totalPages={pageConfigs.length}
                  onProcess={handleProcessPDF}
                  processing={processing}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <ErrorMessage
            message={error.message}
            onDismiss={() => setError(null)}
          />
        )}

        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span>Created by</span>
            <a
              href="https://github.com/qulqarni"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              Soham Kulkarni
              <Github className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Customize your PDFs with ease. Add borders, page numbers, and footers in seconds.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;