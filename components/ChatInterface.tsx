
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { getOperationalAnswer } from '../services/geminiService';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-assistant-message',
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente de procesos operativos. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getOperationalAnswer(trimmedInput);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'error',
        content: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="flex flex-col flex-grow h-[calc(100vh-65px)]">
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
              <div className="bg-gray-700 rounded-lg p-3 max-w-lg animate-pulse">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <InputBar
        input={input}
        onInputChange={(e) => setInput(e.target.value)}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;
