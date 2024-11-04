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
      className={`w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <FileUp className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? 'Drop the PDF here'
          : 'Drag and drop a PDF file here, or click to select'}
      </p>
      <p className="text-xs text-gray-500 mt-1">Maximum file size: 100MB</p>
    </div>
  );
};

export default PDFDropzone;