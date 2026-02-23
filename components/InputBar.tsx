
import React from 'react';
import { SendIcon } from './Icons';

interface InputBarProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({
  input,
  onInputChange,
  onSendMessage,
  isLoading,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-md border-t border-gray-700/50 p-4 sticky bottom-0">
      <div className="max-w-4xl mx-auto flex items-center space-x-4">
        <textarea
          value={input}
          onChange={onInputChange}
          onKeyPress={handleKeyPress}
          placeholder={isLoading ? "Esperando respuesta..." : "Escribe tu pregunta aquí..."}
          className="flex-grow bg-gray-700 text-gray-200 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 disabled:opacity-50"
          rows={1}
          disabled={isLoading}
          style={{ maxHeight: '100px' }}
        />
        <button
          onClick={onSendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          aria-label="Enviar mensaje"
        >
          <SendIcon />
        </button>
      </div>
       <p className="text-xs text-center text-gray-500 mt-2">
        Presiona <kbd className="font-sans px-1.5 py-0.5 border border-gray-600 rounded-md">Shift</kbd> + <kbd className="font-sans px-1.5 py-0.5 border border-gray-600 rounded-md">Enter</kbd> para una nueva línea.
      </p>
    </div>
  );
};

export default InputBar;
