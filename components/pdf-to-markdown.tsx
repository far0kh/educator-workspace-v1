import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Markdown } from './markdown';

interface PdfToMarkdownProps {
  convertedData?: {
    markdownPages: string[];
    totalPages: number;
    pageCount: number;
    metadata: {
      info: any;
      version: string;
    };
    error?: string;
    details?: string;
  };
}

export function PdfToMarkdown({ convertedData }: PdfToMarkdownProps) {
  if (!convertedData) {
    return <div className="animate-pulse">Converting PDF to Markdown...</div>;
  }

  if (convertedData.error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error Converting PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{convertedData.error}</p>
          {convertedData.details && (
            <p className="text-sm text-muted-foreground">{convertedData.details}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl break-words">
      <CardHeader>
        <CardTitle>PDF to Markdown Conversion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Pages: {convertedData.pageCount} of {convertedData.totalPages}</p>
            {convertedData.metadata.info?.Title && (
              <p>Title: {convertedData.metadata.info.Title}</p>
            )}
            {convertedData.metadata.info?.Author && (
              <p>Author: {convertedData.metadata.info.Author}</p>
            )}
          </div>
          {convertedData.markdownPages.map((page, index) => (
            <div
              key={index}
              className={cn(
                'rounded-lg p-4 bg-muted text-muted-foreground',
                index > 0 ? 'mt-4' : ''
              )}
              dir="auto"
            >
              {/* <h2 className="text-lg font-semibold border-b-2 border-b-amber-400 pb-1 mb-4">Page {index + 1}</h2> */}
              <div className="prose-sm text-base dark:prose-invert max-w-none" dir="auto">
                <Markdown>{page}</Markdown>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 