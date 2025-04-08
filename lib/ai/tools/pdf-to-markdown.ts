import { tool } from 'ai';
import { z } from 'zod';
import { PDFExtract } from 'pdf.js-extract';
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const pdfExtract = new PDFExtract();

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

export const pdfToMarkdown = tool({
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
      const data = await pdfExtract.extractBuffer(Buffer.from(pdfBuffer));

      if (!data || !data.pages) {
        return {
          error: 'Failed to extract data from PDF',
          details: 'PDF parsing error',
        };
      }

      if (data.pages.length > PDF_MAX_PAGE_COUNT) {
        return {
          error: 'PDF has too many pages',
          details: `Page count (${data.pages.length}) exceeds the maximum allowed pages of ${PDF_MAX_PAGE_COUNT}`,
        };
      }

      let markdown = '';

      for (const page of data.pages) {
        markdown += `\n\n## Page ${page.pageInfo.num}\n\n`;

        const sortedItems = page.content.sort((a: PDFItem, b: PDFItem) => a.y - b.y);

        let currentY = 0;
        let currentLine = '';

        for (const item of sortedItems) {
          if (item.y - currentY > 5) {
            if (currentLine) {
              markdown += processLine(currentLine.trim()) + '\n\n';
              currentLine = '';
            }
            currentY = item.y;
          }

          currentLine += item.str + ' ';
        }

        if (currentLine) {
          markdown += processLine(currentLine.trim()) + '\n\n';
        }
      }

      return {
        content: markdown.trim(),
        pageCount: data.pages.length,
        metadata: {
          info: data.meta || {},
          version: 'unknown',
        },
      };
    } catch (error) {
      console.error('Error converting PDF to Markdown:', error);
      return {
        error: 'Failed to convert PDF to Markdown',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

function processLine(line: string): string {
  if (!line) return '';

  if (line.toUpperCase() === line && line.length < 50) {
    return `# ${line}`;
  }

  if (line.startsWith('•') || line.startsWith('-')) {
    return `- ${line.slice(1).trim()}`;
  }

  if (line.match(/^\d+\.\s+/)) {
    return `1. ${line.replace(/^\d+\.\s+/, '')}`;
  }

  return line;
}
