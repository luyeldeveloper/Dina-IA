
import React from 'react';
import { TrendingUp, History, Settings, Info, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Dina IA</h1>
              <p className="text-xs text-gray-400">Technical Analysis</p>
            </div>
          </div>
          <nav className="flex items-center space-x-1">
             <button 
              onClick={() => setActiveTab('analyze')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'analyze' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              Analisar
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              Diário
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Privacidade & Segurança
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A Dina IA não solicita credenciais bancárias nem acesso direto aos seus brokers. 
                As suas imagens são processadas de forma segura e apenas para fins de análise técnica.
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-bold uppercase tracking-wider text-yellow-500">Aviso Legal</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                Análise técnica informativa. Não é aconselhamento financeiro nem substitui gestão profissional. 
                Decisões de investimento são responsabilidade do utilizador. IA algorítmica não garante lucros.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            &copy; 2026 Dina IA / Luyeye A. Bianda. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
