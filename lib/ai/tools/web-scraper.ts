import { tool } from 'ai';
import { z } from 'zod';

export const webScraper = tool({
  description: 'Scrape content and metadata from a given URL',
  parameters: z.object({
    url: z.string(),
  }),
  execute: async ({ url }) => {
    try {
      const response = await fetch(url);
      const html = await response.text();

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'No title';

      // Extract Open Graph metadata
      const ogTitle = extractMetaContent(html, 'og:title') || title;
      const ogDescription = extractMetaContent(html, 'og:description');
      const ogImage = extractMetaContent(html, 'og:image');
      const ogSiteName = extractMetaContent(html, 'og:site_name');

      // Extract favicon and handle relative URLs
      const faviconMatch = html.match(/<link[^>]*rel="(?:shortcut )?icon"[^>]*href="([^"]+)"[^>]*>/i);
      let favicon = faviconMatch ? faviconMatch[1] : null;

      // If no favicon found, try to get it from the root
      if (!favicon) {
        try {
          const baseUrl = new URL(url);
          favicon = `${baseUrl.protocol}//${baseUrl.hostname}/favicon.ico`;
        } catch (e) {
          favicon = null;
        }
      } else if (!favicon.startsWith('http')) {
        // Handle relative favicon URLs
        try {
          const baseUrl = new URL(url);
          favicon = new URL(favicon, baseUrl.origin).toString();
        } catch (e) {
          favicon = null;
        }
      }

      // Clean up the HTML for text content
      const cleanHtml = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

      // Extract text content from body
      const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : cleanHtml;

      // Clean up the text content
      const textContent = bodyContent
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&[^;]+;/g, ' ')
        .trim();

      console.log(ogImage, favicon);

      return {
        title: ogTitle,
        description: ogDescription || textContent.substring(0, 200) + '...',
        image: ogImage,
        siteName: ogSiteName,
        favicon: favicon,
        url: url
      };
    } catch (error) {
      return {
        error: 'Failed to scrape the URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});

function extractMetaContent(html: string, property: string): string | null {
  const regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
} 