import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Markdown } from './markdown';

interface PdfToMarkdownProps {
  convertedData?: {
    content: string;
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
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>PDF to Markdown Conversion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Pages: {convertedData.pageCount}</p>
            {convertedData.metadata.info?.Title && (
              <p>Title: {convertedData.metadata.info.Title}</p>
            )}
            {convertedData.metadata.info?.Author && (
              <p>Author: {convertedData.metadata.info.Author}</p>
            )}
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <Markdown>{convertedData.content}</Markdown>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 