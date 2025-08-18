import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp } from 'lucide-react';

interface PDFDropzoneProps {
  onFileAccepted: (file: File) => void;
}

const PDFDropzone: React.FC<PDFDropzoneProps> = ({ onFileAccepted }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 sm:p-12 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
    >
      <input {...getInputProps()} />
      <FileUp className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4" />
      <p className="text-base sm:text-lg text-gray-700 font-medium mb-2">
        {isDragActive
          ? 'Drop the PDF here'
          : 'Drag and drop a PDF file here, or click to select'}
      </p>
      <p className="text-sm text-gray-500">Maximum file size: 100MB</p>
    </div>
  );
};

export default PDFDropzone;