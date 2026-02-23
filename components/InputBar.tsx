
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
    <div className="bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 sticky bottom-0">
      <div className="max-w-4xl mx-auto flex items-center space-x-4">
        <textarea
          value={input}
          onChange={onInputChange}
          onKeyPress={handleKeyPress}
          placeholder={isLoading ? "Esperando respuesta..." : "Escribe tu pregunta aquí..."}
          className="flex-grow bg-gray-50 text-black rounded-xl p-4 resize-none focus:ring-2 focus:ring-[#CFFF65] focus:outline-none transition duration-200 disabled:opacity-50 border border-gray-100"
          rows={1}
          disabled={isLoading}
          style={{ maxHeight: '100px' }}
        />
        <button
          onClick={onSendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-[#CFFF65] text-black rounded-full p-4 hover:bg-[#b8e65a] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#CFFF65] shadow-lg shadow-[#CFFF65]/20"
          aria-label="Enviar mensaje"
        >
          <SendIcon />
        </button>
      </div>
       <p className="text-[10px] text-center text-gray-400 mt-2 uppercase tracking-widest font-bold">
        Presiona <kbd className="font-sans px-1.5 py-0.5 border border-gray-200 rounded-md">Shift</kbd> + <kbd className="font-sans px-1.5 py-0.5 border border-gray-200 rounded-md">Enter</kbd> para una nueva línea.
      </p>
    </div>
  );
};

export default InputBar;
