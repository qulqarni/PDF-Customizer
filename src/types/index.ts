export type Position = 'left' | 'center' | 'right';

export interface PageConfig {
  pageNumber: number;
  hasBorder: boolean;
  borderMargin: number;
  hasPageNumber: boolean;
  pageNumberPosition: Position;
  hasFooter: boolean;
  footerText: string;
  footerPosition: Position;
}

export interface ProcessingError {
  message: string;
  code: string;
}