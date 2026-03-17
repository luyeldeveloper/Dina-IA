
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Scanner } from './components/Scanner';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { analyzeChart } from './services/geminiService';
import { AnalysisResult, TEMPLATES, AnalysisTemplate } from './types';
import { Loader2, Plus, History as HistoryIcon, Star, Filter, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AnalysisTemplate>(TEMPLATES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dina_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing history");
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('dina_history', JSON.stringify(history));
  }, [history]);

  const handleImageCapture = (base64: string) => {
    setCurrentImage(base64);
    setCurrentResult(null);
  };

  const runAnalysis = async () => {
    if (!currentImage) return;
    setIsAnalyzing(true);
    try {
      const resultData = await analyzeChart(currentImage, selectedTemplate.prompt);
      const fullResult: AnalysisResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        image: currentImage,
        template: selectedTemplate.name,
        ...resultData as any
      };
      setCurrentResult(fullResult);
    } catch (err) {
      console.error(err);
      alert("Falha na análise. Verifique a ligação e tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveToHistory = () => {
    if (currentResult) {
      setHistory(prev => [currentResult, ...prev]);
      setCurrentResult(null);
      setCurrentImage(null);
      setActiveTab('history');
    }
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'analyze' && (
        <div className="space-y-8">
          {!currentImage && !currentResult && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Comece a sua análise
                </h2>
                <p className="text-gray-400">Carregue ou fotografe um gráfico para análise instantânea.</p>
              </div>
              <Scanner onImageCapture={handleImageCapture} />
              
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  Estratégia de Análise (Template)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        selectedTemplate.id === t.id 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'
                      }`}
                    >
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-[10px] text-gray-500 line-clamp-1">{t.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentImage && !currentResult && (
            <div className="space-y-6">
              <div className="relative group rounded-2xl overflow-hidden border border-gray-800">
                <img src={currentImage} alt="Preview" className="w-full h-auto max-h-[400px] object-contain bg-black" />
                <button 
                  onClick={() => setCurrentImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur rounded-full text-white hover:bg-black/80"
                >
                  <Plus className="rotate-45" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  disabled={isAnalyzing}
                  onClick={runAnalysis}
                  className="flex-grow py-4 bg-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" />
                      A Analisar Gráfico...
                    </>
                  ) : (
                    'Gerar Relatório Técnico'
                  )}
                </button>
                <button
                  onClick={() => setCurrentImage(null)}
                  className="px-8 py-4 bg-gray-800 rounded-xl font-medium hover:bg-gray-700 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {currentResult && (
            <AnalysisDisplay 
              analysis={currentResult} 
              onSave={saveToHistory} 
            />
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <HistoryIcon className="w-6 h-6 text-indigo-400" />
              Diário de Trading
            </h2>
            <div className="flex gap-2">
               <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
              <div className="p-4 bg-gray-800 rounded-full w-fit mx-auto mb-4 text-gray-500">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-300">Sem análises guardadas</h3>
              <p className="text-gray-500 text-sm mt-1">As suas análises técnicas guardadas aparecerão aqui.</p>
              <button 
                onClick={() => setActiveTab('analyze')}
                className="mt-6 px-6 py-2 bg-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-500 transition-colors"
              >
                Nova Análise
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {history.map((item) => (
                <div key={item.id} className="pt-8 border-t border-gray-800 first:border-t-0 first:pt-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleString('pt-PT')}
                    </div>
                    <div className="px-2 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {item.template}
                    </div>
                  </div>
                  <AnalysisDisplay 
                    analysis={item} 
                    isSavedView 
                    onDelete={() => deleteFromHistory(item.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
