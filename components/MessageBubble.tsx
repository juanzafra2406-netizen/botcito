
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
    ? 'bg-[#CFFF65] text-black rounded-br-none'
    : isError
    ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-none'
    : 'bg-gray-100 text-black rounded-bl-none border border-gray-200';

  const alignmentClasses = isUser ? 'justify-end' : 'justify-start';
  const icon = isUser ? <UserIcon /> : isError ? <ErrorIcon /> : <AssistantIcon />;

  return (
    <div className={`flex items-start gap-3 ${alignmentClasses}`}>
      {!isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 mt-1">{icon}</div>}
      
      <div
        className={`w-auto max-w-xl xl:max-w-3xl px-4 py-3 rounded-2xl shadow-sm ${bubbleClasses}`}
      >
        <div className="prose prose-sm max-w-none text-current whitespace-pre-wrap leading-relaxed">
            {formatContent(message.content)}
        </div>
      </div>

       {isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#CFFF65] mt-1 shadow-sm">{icon}</div>}
    </div>
  );
};

export default MessageBubble;
