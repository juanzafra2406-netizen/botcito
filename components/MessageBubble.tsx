
import React from 'react';
import type { Message } from '../types';
import { UserIcon, AssistantIcon, ErrorIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

const formatContent = (content: string) => {
    // Basic formatting for bold text (**) and emojis
    const boldFormatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div dangerouslySetInnerHTML={{ __html: boldFormatted }} />;
};


const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-br-none'
    : isError
    ? 'bg-red-500/20 text-red-300 border border-red-500/50 rounded-bl-none'
    : 'bg-gray-700 text-gray-200 rounded-bl-none';

  const alignmentClasses = isUser ? 'justify-end' : 'justify-start';
  const icon = isUser ? <UserIcon /> : isError ? <ErrorIcon /> : <AssistantIcon />;

  return (
    <div className={`flex items-start gap-3 ${alignmentClasses}`}>
      {!isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 mt-1">{icon}</div>}
      
      <div
        className={`w-auto max-w-xl xl:max-w-3xl px-4 py-3 rounded-xl shadow-md ${bubbleClasses}`}
      >
        <div className="prose prose-invert prose-sm max-w-none text-white whitespace-pre-wrap leading-relaxed">
            {formatContent(message.content)}
        </div>
      </div>

       {isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-800 mt-1">{icon}</div>}
    </div>
  );
};

export default MessageBubble;
