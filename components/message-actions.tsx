import type { Message } from 'ai';
import { useSWRConfig } from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import type { Vote } from '@/lib/db/schema';
import { useState, useEffect } from 'react';
import { CheckIcon } from 'lucide-react';

import { CopyIcon, ThumbDownIcon, ThumbUpIcon, LoaderIcon } from './icons';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { toast } from 'sonner';

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDownvoting, setIsDownvoting] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'success'>('idle');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copyState === 'success') {
      timeout = setTimeout(() => {
        setCopyState('idle');
      }, 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [copyState]);

  if (isLoading) return null;
  if (message.role === 'user') return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit w-10 text-muted-foreground"
              variant="outline"
              onClick={async () => {
                const textFromParts = message.parts
                  ?.filter((part) => part.type === 'text')
                  .map((part) => part.text)
                  .join('\n')
                  .trim();

                if (!textFromParts) {
                  toast.error("There's no text to copy!");
                  return;
                }

                setCopyState('copying');
                await copyToClipboard(textFromParts);
                setCopyState('success');
              }}
            >
              {copyState === 'copying' ? (
                <span className="animate-spin"><LoaderIcon /></span>
              ) : copyState === 'success' ? (
                <CheckIcon className="text-green-600" />
              ) : (
                <CopyIcon />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="message-upvote"
              className={cn('py-1 px-2 h-fit w-10 text-muted-foreground !pointer-events-auto', {
                '!text-green-600': vote?.isUpvoted,
              })}
              disabled={vote?.isUpvoted || isUpvoting}
              variant="outline"
              onClick={async () => {
                try {
                  setIsUpvoting(true);
                  await fetch('/api/vote', {
                    method: 'PATCH',
                    body: JSON.stringify({
                      chatId,
                      messageId: message.id,
                      type: 'up',
                    }),
                  });

                  mutate<Array<Vote>>(
                    `/api/vote?chatId=${chatId}`,
                    (currentVotes) => {
                      if (!currentVotes) return [];

                      const votesWithoutCurrent = currentVotes.filter(
                        (vote) => vote.messageId !== message.id,
                      );

                      return [
                        ...votesWithoutCurrent,
                        {
                          chatId,
                          messageId: message.id,
                          isUpvoted: true,
                        },
                      ];
                    },
                    { revalidate: false },
                  );

                  // toast.success('Upvoted Response!');
                } catch (error) {
                  toast.error('Failed to upvote response.');
                } finally {
                  setIsUpvoting(false);
                }
              }}
            >
              {isUpvoting ? <span className="animate-spin"><LoaderIcon /></span> : <ThumbUpIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upvote Response</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="message-downvote"
              className={cn('py-1 px-2 h-fit w-10 text-muted-foreground !pointer-events-auto', {
                '!text-orange-600': vote && !vote.isUpvoted,
              })}
              variant="outline"
              disabled={vote && !vote.isUpvoted || isDownvoting}
              onClick={async () => {
                try {
                  setIsDownvoting(true);
                  await fetch('/api/vote', {
                    method: 'PATCH',
                    body: JSON.stringify({
                      chatId,
                      messageId: message.id,
                      type: 'down',
                    }),
                  });

                  mutate<Array<Vote>>(
                    `/api/vote?chatId=${chatId}`,
                    (currentVotes) => {
                      if (!currentVotes) return [];

                      const votesWithoutCurrent = currentVotes.filter(
                        (vote) => vote.messageId !== message.id,
                      );

                      return [
                        ...votesWithoutCurrent,
                        {
                          chatId,
                          messageId: message.id,
                          isUpvoted: false,
                        },
                      ];
                    },
                    { revalidate: false },
                  );

                  // toast.success('Downvoted Response!');
                } catch (error) {
                  toast.error('Failed to downvote response.');
                } finally {
                  setIsDownvoting(false);
                }
              }}
            >
              {isDownvoting ? <span className="animate-spin"><LoaderIcon /></span> : <ThumbDownIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Downvote Response</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);
