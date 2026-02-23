import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
  const [isKeyConfigured, setIsKeyConfigured] = useState<boolean>(false);
  const [manualKey, setManualKey] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const keyToUse = manualKey.trim();
    
    if (keyToUse.length < 10) {
      alert("Por favor, ingresa una API Key válida para desbloquear el asistente.");
      return;
    }

    setIsUnlocking(true);
    
    try {
      localStorage.setItem('GEMINI_API_KEY', keyToUse);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsKeyConfigured(true);
    } catch (error) {
      console.error("Error unlocking:", error);
      alert("Error al validar la llave.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setManualKey('');
    setIsKeyConfigured(false);
  };

  const handleAIStudioConnect = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setIsKeyConfigured(true);
      } catch (error) {
        console.error("Error with AI Studio selector:", error);
      }
    } else {
      alert("El selector de AI Studio no está disponible. Por favor ingresa la clave manualmente.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gray-50"></div>
      </div>

      <main className="relative z-10 flex flex-col h-screen">
        {!isKeyConfigured ? (
          <div className="flex-grow flex items-center justify-center p-6">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center space-y-6">
                {/* Logo */}
                <div className="flex justify-center">
                  <img
                    src="/plinng2-01 (1).png"
                    alt="Logo"
                    className="h-16 object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-black tracking-tighter text-black">
                    SISTEMA <span className="bg-[#CFFF65] px-2">BLOQUEADO</span>
                  </h1>
                  <p className="text-gray-500 text-sm uppercase tracking-widest font-medium">
                    Ingresa tu llave de acceso para inicializar
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl space-y-6">
                <form onSubmit={handleUnlock} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Gemini API Key</label>
                    <input
                      type="password"
                      value={manualKey}
                      onChange={(e) => setManualKey(e.target.value)}
                      placeholder="AIza..."
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#CFFF65] focus:border-transparent outline-none transition-all text-black font-mono text-sm placeholder-gray-300"
                      required
                      autoComplete="off"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isUnlocking}
                    className="w-full py-4 px-6 bg-[#CFFF65] hover:bg-[#b8e65a] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(207,255,101,0.4)] flex items-center justify-center gap-2 group"
                  >
                    {isUnlocking ? (
                      <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
                    ) : (
                      <>
                        DESBLOQUEAR ASISTENTE
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-100"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">O vincular cuenta</span>
                  <div className="flex-grow border-t border-gray-100"></div>
                </div>

                <button
                  onClick={handleAIStudioConnect}
                  className="w-full py-3 px-6 border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-black font-medium rounded-2xl transition-all text-sm"
                >
                  Usar Google AI Studio
                </button>
              </div>

              <p className="text-center text-[10px] text-gray-400 uppercase tracking-tighter">
                Esta llave activa el pensamiento crítico y procesamiento de datos del modelo.
              </p>
            </div>
          </div>
        ) : (
          <>
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between px-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Sistema Activo</span>
              </div>
              {/* Logo en el header */}
              <img
                src="/plinng2-01 (1).png"
                alt="Logo"
                className="h-8 object-contain"
              />
              <button 
                onClick={handleLogout}
                className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Cerrar Sesión
              </button>
            </header>
            <ChatInterface />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
