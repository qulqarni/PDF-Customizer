import { PDFDocument, rgb } from 'pdf-lib';
import { PageConfig } from '../types';

export class PDFProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDFProcessingError';
  }
}

export async function getPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc.getPageCount();
  } catch (error) {
    throw new PDFProcessingError('Failed to read PDF file. Please ensure it is a valid PDF document.');
  }
}

export async function processPDF(file: File, pageConfigs: PageConfig[]): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    if (pages.length === 0) {
      throw new PDFProcessingError('The PDF file appears to be empty.');
    }

    for (let i = 0; i < pages.length; i++) {
      const config = pageConfigs[i];
      const page = pages[i];
      const { width, height } = page.getSize();

      if (config.hasBorder) {
        const margin = Math.min(Math.max(config.borderMargin, 0), Math.min(width, height) / 4);
        page.drawRectangle({
          x: margin,
          y: margin,
          width: width - (margin * 2),
          height: height - (margin * 2),
          borderWidth: 1,
          borderColor: rgb(0, 0, 0),
          opacity: 0.5,
        });
      }

      if (config.hasPageNumber) {
        const pageText = `${i + 1}`;
        page.drawText(pageText, {
          x: width / 2 - (pageText.length * 3),
          y: 30,
          size: 12,
          color: rgb(0, 0, 0),
        });
      }

      if (config.hasFooter && config.footerText.trim()) {
        page.drawText(config.footerText.trim(), {
          x: 50,
          y: 20,
          size: 10,
          color: rgb(0, 0, 0),
        });
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();
    return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  } catch (error) {
    if (error instanceof PDFProcessingError) {
      throw error;
    }
    throw new PDFProcessingError('An error occurred while processing the PDF. Please try again with a different file.');
  }
}