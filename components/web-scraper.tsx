import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface WebScraperProps {
  scrapedData?: {
    title: string;
    description: string;
    image?: string;
    siteName?: string;
    favicon?: string;
    content: string;
    url: string;
    error?: string;
    details?: string;
  };
}

export function WebScraper({ scrapedData }: WebScraperProps) {
  if (!scrapedData) {
    return <div className="animate-pulse">Scraping content...</div>;
  }

  if (scrapedData.error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error Scraping URL</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{scrapedData.error}</p>
          {scrapedData.details && (
            <p className="text-sm text-muted-foreground">{scrapedData.details}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <a
        href={scrapedData.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-muted/50 transition-colors"
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {scrapedData.favicon && (
              <div className="relative w-6 h-6">
                <Image
                  src={scrapedData.favicon}
                  alt={scrapedData.title}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {scrapedData.siteName || new URL(scrapedData.url).hostname}
            </span>
          </div>
          <h3 className="font-semibold mb-1 line-clamp-2" dir="auto">{scrapedData.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2" dir="auto">
            {scrapedData.description}
          </p>
        </div>
        {scrapedData.image && (
          <div className="relative w-full h-48">
            <Image
              src={scrapedData.image}
              alt={scrapedData.title}
              fill
              className="object-contain rounded-t-lg"
            />
          </div>
        )}
        <CardContent className="hidden">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {scrapedData.content}
          </p>
        </CardContent>
      </a>
    </Card>
  );
} 