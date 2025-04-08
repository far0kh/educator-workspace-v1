import { useEffect, useRef, type RefObject } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
  (enabled: boolean) => void
] {
  const containerRef = useRef<T>(null) as RefObject<T>;
  const endRef = useRef<T>(null) as RefObject<T>;
  const isAutoScrollEnabled = useRef(true);
  const lastMessageCount = useRef(0);

  const debouncedScroll = useDebounceCallback(
    (end: T) => {
      if (isAutoScrollEnabled.current) {
        end.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    },
    100
  );

  const immediateScroll = (end: T) => {
    if (isAutoScrollEnabled.current) {
      end.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const setAutoScrollEnabled = (enabled: boolean) => {
    isAutoScrollEnabled.current = enabled;
    if (enabled && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver((mutations) => {
        // Check if the mutation is a significant content change
        const hasContentChange = mutations.some(mutation => {
          // Always scroll immediately on new message additions
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const addedNodes = Array.from(mutation.addedNodes);
            const isNewMessage = addedNodes.some(node => {
              if (!(node instanceof HTMLElement)) return false;
              return node.classList.contains('group/message') || // Message container
                node.classList.contains('message-content'); // Message content
            });

            if (isNewMessage) {
              immediateScroll(end);
              return false; // Don't trigger debounced scroll
            }
          }

          // For other changes, check if they're significant
          if (mutation.type === 'characterData' ||
            (mutation.type === 'attributes' &&
              mutation.attributeName === 'class' &&
              mutation.target instanceof HTMLElement &&
              !mutation.target.classList.contains('opacity-0'))) {
            return true;
          }

          return false;
        });

        if (hasContentChange) {
          debouncedScroll(end);
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class'] // Only observe class changes
      });

      return () => observer.disconnect();
    }
  }, [debouncedScroll]);

  // Add effect to track message count changes
  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const messageElements = container.getElementsByClassName('group/message');
      const currentMessageCount = messageElements.length;

      if (currentMessageCount > lastMessageCount.current) {
        immediateScroll(end);
      }

      lastMessageCount.current = currentMessageCount;
    }
  });

  return [containerRef, endRef, setAutoScrollEnabled];
}
