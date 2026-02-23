import React from 'react';
import type { Message } from '../types';
import { UserIcon, AssistantIcon, ErrorIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

const formatContent = (content: string) => {
  // 1. Escapar HTML peligroso primero
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Negritas **texto**
  let formatted = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 3. Links markdown [texto](url) → <a> clicable
  formatted = formatted.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800 break-all">$1</a>'
  );

  // 4. URLs sueltas (no dentro de markdown) → <a> clicable
  formatted = formatted.replace(
    /(?<!\]\()(?<!")(?<!')https?:\/\/[^\s<>"']+/g,
    '<a href="$&" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800 break-all">$&</a>'
  );

  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
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
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 mt-1">
          {icon}
        </div>
      )}

      <div className={`w-auto max-w-xl xl:max-w-3xl px-4 py-3 rounded-2xl shadow-sm ${bubbleClasses}`}>
        <div className="prose prose-sm max-w-none text-current whitespace-pre-wrap leading-relaxed">
          {formatContent(message.content)}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#CFFF65] mt-1 shadow-sm">
          {icon}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
