import { tool } from 'ai';
import { z } from 'zod';
import pdfParse from 'pdf-parse';

// Get limitations from environment variables
const PDF_MAX_FILE_SIZE_MB = parseInt(process.env.PDF_MAX_FILE_SIZE_MB || '5', 10);
const PDF_MAX_PAGE_COUNT = parseInt(process.env.PDF_MAX_PAGE_COUNT || '50', 10);

interface PDFItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
}

export const pdfToText = tool({
  description: `Convert PDF content to Markdown text. Limitations: Max file size ${PDF_MAX_FILE_SIZE_MB}MB, Max pages ${PDF_MAX_PAGE_COUNT}`,
  parameters: z.object({
    pdfUrl: z.string(),
  }),
  execute: async ({ pdfUrl }) => {
    try {
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        return {
          error: `Failed to fetch PDF: ${response.status} ${response.statusText}`,
        };
      }

      const contentType = response.headers.get('content-type');
      if (contentType !== 'application/pdf') {
        return {
          error: 'Invalid content type. Expected application/pdf.',
          details: `Received: ${contentType}`,
        };
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const fileSizeMB = parseInt(contentLength, 10) / (1024 * 1024);
        if (fileSizeMB > PDF_MAX_FILE_SIZE_MB) {
          return {
            error: 'PDF file too large',
            details: `File size (${fileSizeMB.toFixed(2)}MB) exceeds the maximum allowed size of ${PDF_MAX_FILE_SIZE_MB}MB`,
          };
        }
      }

      const pdfBuffer = await response.arrayBuffer();
      const pdfData = await pdfParse(Buffer.from(pdfBuffer));
      const text = pdfData.text;

      if (!text) {
        return {
          error: 'Failed to extract text from PDF',
          details: 'PDF parsing error',
        };
      }

      return {
        content: text,
      };
    } catch (error) {
      console.error('Error converting PDF to Text:', error);
      return {
        error: 'Failed to convert PDF to Text',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
