import type { Attachment } from 'ai';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { LoaderIcon } from './icons';

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;
  const fileName = name?.split('/').pop();

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2">
      <div className="w-16 h-16 aspect-video rounded-md relative flex flex-col items-center justify-center">
        {contentType ? (
          contentType.startsWith('image') ? (
            // NOTE: it is recommended to use next/image for images
            // eslint-disable-next-line @next/next/no-img-element
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  key={url}
                  src={url}
                  alt={fileName ?? 'An image attachment'}
                  className="rounded-md size-full object-cover"
                />
              </TooltipTrigger>
              <TooltipContent>{fileName ?? 'An image attachment'}</TooltipContent>
            </Tooltip>
          ) : contentType.startsWith('application/pdf') ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  key={url}
                  src="/pdf-icon.svg"
                  alt={fileName ?? 'A pdf attachment'}
                  className="rounded-md size-full object-cover"
                />
              </TooltipTrigger>
              <TooltipContent>{fileName ?? 'A pdf attachment'}</TooltipContent>
            </Tooltip>
          ) : (
            <div className="" />
          )
        ) : (
          <div className="" />
        )}

        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="animate-spin absolute text-zinc-500"
          >
            <LoaderIcon />
          </div>
        )}
      </div>
      <div className="text-xs text-zinc-500 text-center max-w-16 truncate">{fileName}</div>
    </div>
  );
};
