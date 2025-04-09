import { UIMessage } from 'ai';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { Overview } from './overview';
import { memo, useState } from 'react';
import { Vote } from '@/lib/db/schema';
import equal from 'fast-deep-equal';
import { UseChatHelpers } from '@ai-sdk/react';
import { cn } from '@/lib/utils';

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers['status'];
  votes: Array<Vote> | undefined;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
  isArtifactVisible: boolean;
  append: UseChatHelpers['append'];
}

function PureMessages({
  chatId,
  status,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
  append,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef, setAutoScrollEnabled] = useScrollToBottom<HTMLDivElement>();
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const handleEditStart = (messageId: string) => {
    setEditingMessageId(messageId);
    setAutoScrollEnabled(false);
  };

  const handleEditEnd = () => {
    setEditingMessageId(null);
    setAutoScrollEnabled(true);
  };

  return (
    <div
      ref={messagesContainerRef}
      className={cn('flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4',
        {
          'justify-center': messages.length === 0,
        },
      )}
    >
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === 'streaming' && messages.length - 1 === index}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === message.id)
              : undefined
          }
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isEditing={editingMessageId === message.id}
          onEditStart={handleEditStart}
          onEditEnd={handleEditEnd}
          append={append}
        />
      ))}

      {status === 'submitted' &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
});
