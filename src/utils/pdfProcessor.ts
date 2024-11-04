import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PageConfig } from '../types';

class PDFProcessor {
  async getPageCount(file: File): Promise<number> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      return pdfDoc.getPageCount();
    } catch (error) {
      throw new Error('Failed to read PDF file');
    }
  }

  async process(file: File, pageConfigs: PageConfig[]): Promise<Blob> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Embed fonts
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

      pages.forEach((page, index) => {
        const config = pageConfigs[index];
        if (!config) return;

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

        if (config.hasPageNumber && config.sequentialNumber !== undefined) {
          const pageText = String(config.sequentialNumber);
          const font = config.pageNumberBold ? helveticaBold : helvetica;
          const fontSize = config.pageNumberSize;
          const textWidth = font.widthOfTextAtSize(pageText, fontSize);
          
          const x = (width * (config.pageNumberPosition.x / 100)) - (textWidth / 2);
          const y = height * (config.pageNumberPosition.y / 100);

          page.drawText(pageText, {
            x,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        }

        if (config.hasFooter && config.footerText.trim()) {
          const text = config.footerText.trim();
          const font = config.footerBold ? helveticaBold : helvetica;
          const fontSize = config.footerSize;
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          
          const x = (width * (config.footerPosition.x / 100)) - (textWidth / 2);
          const y = height * (config.footerPosition.y / 100);

          page.drawText(text, {
            x,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        }
      });

      const modifiedPdfBytes = await pdfDoc.save();
      return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    } catch (error) {
      throw new Error('Failed to process PDF');
    }
  }
}

export const processPDF = new PDFProcessor();