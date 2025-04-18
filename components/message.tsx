'use client';

import type { UIMessage } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';
import type { Vote } from '@/lib/db/schema';
import { DocumentToolCall, DocumentToolResult } from './document';
import { PencilEditIcon, SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageEditor } from './message-editor';
import { DocumentPreview } from './document-preview';
import { MessageReasoning } from './message-reasoning';
import { UseChatHelpers } from '@ai-sdk/react';
import { WebScraper } from './web-scraper';
import { PdfToMarkdown } from './pdf-to-markdown';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { MultipleChoiceQuestion } from './multiple-choice-question';

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  isEditing,
  onEditStart,
  onEditEnd,
  append,
  isLastMessage,
}: {
  chatId: string;
  message: UIMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
  isEditing: boolean;
  onEditStart: (messageId: string) => void;
  onEditEnd: () => void;
  append: UseChatHelpers['append'];
  isLastMessage: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [lastPartIndex, setLastPartIndex] = useState<number>(-1);
  const [selectedAnswers, setSelectedAnswers] = useState<number[] | undefined>(undefined);

  useEffect(() => {
    // Skip rendering content after the closed-ended questions
    const closedEndedQuestionIndex = message.parts.findIndex((part) =>
      part.type === 'tool-invocation' &&
      part.toolInvocation.toolName === 'closedEndedQuestion'
    );
    setLastPartIndex(closedEndedQuestionIndex);
  }, [message]);

  const handleEditClick = () => {
    onEditStart(message.id);
    setMode('edit');
  };

  const handleCancelEdit = () => {
    setMode('view');
    onEditEnd();
  };

  const handleSaveEdit = async () => {
    setMode('view');
    onEditEnd();
  };

  const handleAnswer = (indexes: number[]) => {
    setSelectedAnswers(indexes);
    // Append the selected answers as a user message
    const multipleChoicePart = message.parts?.find(part =>
      part.type === 'tool-invocation' &&
      part.toolInvocation.toolName === 'closedEndedQuestion'
    );

    if (multipleChoicePart && multipleChoicePart.type === 'tool-invocation') {
      const content = indexes.map((index) =>
        multipleChoicePart.toolInvocation.args.answerOptions[index] || ''
      ).join(', ');

      append({
        role: 'user',
        content,
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        dir="auto"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full" dir="auto">
            {message.experimental_attachments && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}

            {message.parts?.map((part, index) => {
              if (lastPartIndex !== -1 && index > lastPartIndex) return null;

              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === 'reasoning') {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === 'text') {
                if (mode === 'view') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start" dir={`${message.role === 'user' ? 'ltr' : 'auto'}`}>
                      {message.role === 'user' && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={handleEditClick}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn('flex flex-col gap-4 w-full', {
                          'bg-primary text-primary-foreground px-3 py-2 rounded-xl break-all': message.role === 'user',
                        })}
                        dir="auto"
                      >
                        <Markdown>{part.text}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === 'edit') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        message={message}
                        setMode={handleSaveEdit}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  );
                }
              }

              if (type === 'tool-invocation') {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === 'call') {
                  const { args } = toolInvocation;

                  return (
                    <div
                      key={toolCallId}
                      className={cx({
                        skeleton: ['getWeather', 'webScraper', 'pdfToMarkdown'].includes(toolName),
                      })}
                    >
                      {toolName === 'getWeather' ? (
                        <Weather />
                      ) : toolName === 'webScraper' ? (
                        <WebScraper />
                      ) : toolName === 'pdfToMarkdown' ? (
                        <PdfToMarkdown />
                      ) : toolName === 'createDocument' ? (
                        <DocumentPreview isReadonly={isReadonly} args={args} />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolCall
                          type="update"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolCall
                          type="request-suggestions"
                          args={args}
                          isReadonly={isReadonly}
                        />
                        // ) : toolName === 'closedEndedQuestion' ? (
                        //   <>
                        //     {/* <pre>{JSON.stringify(args, null, 2)}</pre> */}

                        //     <MultipleChoiceQuestion
                        //       question={args.question}
                        //       answerOptions={args.answerOptions}
                        //       singleChoice={args.singleChoice}
                        //       instruction={args.instruction}
                        //       onAnswer={handleAnswer}
                        //       selectedAnswers={selectedAnswers}
                        //       disabled={selectedAnswers !== undefined}
                        //     />
                        //   </>
                      ) : null}
                    </div>
                  );
                }

                if (state === 'result') {
                  const { args, result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === 'getWeather' ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === 'webScraper' ? (
                        <WebScraper scrapedData={result} />
                      ) : toolName === 'pdfToMarkdown' ? (
                        <PdfToMarkdown convertedData={result} />
                      ) : toolName === 'createDocument' ? (
                        <DocumentPreview
                          isReadonly={isReadonly}
                          result={result}
                        />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolResult
                          type="update"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolResult
                          type="request-suggestions"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'closedEndedQuestion' ? (
                        <>
                          {/* <pre>{JSON.stringify(result, null, 2)}</pre> */}

                          {isLastMessage && <MultipleChoiceQuestion
                            question={args.question}
                            answerOptions={args.answerOptions}
                            singleChoice={args.singleChoice}
                            instruction={args.instruction}
                            onAnswer={handleAnswer}
                            selectedAnswers={selectedAnswers}
                            disabled={selectedAnswers !== undefined}
                          />}
                        </>
                      ) : (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      )}
                    </div>
                  );
                }
              }
            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message"
      dir="auto"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
