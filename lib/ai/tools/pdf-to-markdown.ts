import { tool } from 'ai';
import { z } from 'zod';
import { PDFExtract } from 'pdf.js-extract';

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
    // Note: Do not edit this line
    pdfUrl: z.string(),
  }),
  execute: async ({ pdfUrl }) => {
    try {
      // Fetch the PDF file
      const response = await fetch(pdfUrl);

      // Check content length
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const fileSizeMB = parseInt(contentLength, 10) / (1024 * 1024);
        if (fileSizeMB > PDF_MAX_FILE_SIZE_MB) {
          return {
            error: 'PDF file too large',
            details: `File size (${fileSizeMB.toFixed(2)}MB) exceeds the maximum allowed size of ${PDF_MAX_FILE_SIZE_MB}MB`
          };
        }
      }

      const pdfBuffer = await response.arrayBuffer();

      // Extract text from PDF
      const data = await pdfExtract.extractBuffer(Buffer.from(pdfBuffer));

      // Check page count
      if (data.pages.length > PDF_MAX_PAGE_COUNT) {
        return {
          error: 'PDF has too many pages',
          details: `Page count (${data.pages.length}) exceeds the maximum allowed pages of ${PDF_MAX_PAGE_COUNT}`
        };
      }

      let markdown = '';

      // Process each page
      for (const page of data.pages) {
        markdown += `\n\n## Page ${page.pageInfo.num}\n\n`;

        // Sort text items by y position (top to bottom)
        const sortedItems = page.content.sort((a: PDFItem, b: PDFItem) => a.y - b.y);

        let currentY = 0;
        let currentLine = '';

        for (const item of sortedItems) {
          // If this item is significantly lower than the previous one, start a new line
          if (item.y - currentY > 5) {
            if (currentLine) {
              markdown += processLine(currentLine.trim()) + '\n\n';
              currentLine = '';
            }
            currentY = item.y;
          }

          currentLine += item.str + ' ';
        }

        // Process the last line
        if (currentLine) {
          markdown += processLine(currentLine.trim()) + '\n\n';
        }
      }

      return {
        content: markdown.trim(),
        pageCount: data.pages.length,
        metadata: {
          info: data.meta || {},
          version: 'unknown', // pdf.js-extract doesn't provide version info
        }
      };
    } catch (error) {
      return {
        error: 'Failed to convert PDF to Markdown',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});

function processLine(line: string): string {
  if (!line) return '';

  // Convert to heading if it's in all caps and not too long
  if (line.toUpperCase() === line && line.length < 50) {
    return `# ${line}`;
  }

  // Handle bullet points
  if (line.startsWith('•') || line.startsWith('-')) {
    return `- ${line.slice(1).trim()}`;
  }

  // Handle numbered lists
  if (line.match(/^\d+\.\s+/)) {
    return `1. ${line.replace(/^\d+\.\s+/, '')}`;
  }

  return line;
} 