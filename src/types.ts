export interface Position {
  x: number;
  y: number;
}

export interface PageConfig {
  pageNumber: number;
  hasBorder: boolean;
  borderMargin: number;
  hasPageNumber: boolean;
  pageNumberPosition: Position;
  pageNumberBold: boolean;
  pageNumberSize: number;
  hasFooter: boolean;
  footerText: string;
  footerPosition: Position;
  footerBold: boolean;
  footerSize: number;
  sequentialNumber?: number; // The sequential number based on selection order
}

export interface ProcessingError {
  message: string;
  code: string;
}