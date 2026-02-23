
import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      <div className="relative min-h-screen w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>
        <main className="relative z-10 flex flex-col h-screen">
          <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 p-4 shadow-lg">
            <h1 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              🤖 Asistente de Procesos Operativos
            </h1>
          </header>
          <ChatInterface />
        </main>
      </div>
    </div>
  );
};

export default App;
