
import React from 'react';
import { AnalysisResult } from '../types';
import { 
  TrendingUp, TrendingDown, Minus, 
  Activity, BarChart3, ShieldCheck, 
  Lightbulb, AlertCircle, Bookmark, Share2, Trash2
} from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
  onSave?: () => void;
  onDelete?: () => void;
  isSavedView?: boolean;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ 
  analysis, onSave, onDelete, isSavedView 
}) => {
  const getTrendColor = (trend: string) => {
    if (trend === 'Bullish') return 'text-emerald-400';
    if (trend === 'Bearish') return 'text-rose-400';
    return 'text-amber-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'Bullish') return <TrendingUp className="w-6 h-6" />;
    if (trend === 'Bearish') return <TrendingDown className="w-6 h-6" />;
    return <Minus className="w-6 h-6" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{analysis.title}</h2>
        <div className="flex gap-2">
          {!isSavedView && (
             <button 
              onClick={onSave}
              className="p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-colors"
              title="Guardar no Diário"
            >
              <Bookmark className="w-5 h-5" />
            </button>
          )}
          {isSavedView && (
            <button 
              onClick={onDelete}
              className="p-2 bg-rose-900/30 text-rose-400 rounded-lg hover:bg-rose-900/50 transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Snapshot */}
      <div className="rounded-2xl overflow-hidden border border-gray-800">
        <img src={analysis.image} alt="Chart" className="w-full h-auto object-contain max-h-[300px] bg-black" />
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Tendência</p>
          <div className={`flex items-center gap-2 font-bold ${getTrendColor(analysis.summary.trendDirection)}`}>
            {getTrendIcon(analysis.summary.trendDirection)}
            {analysis.summary.trendDirection}
          </div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Confiança</p>
          <div className="flex items-center gap-2 font-bold text-white">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            {analysis.summary.confidenceScore}%
          </div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Volatilidade</p>
          <div className="flex items-center gap-2 font-bold text-white">
            <Activity className="w-5 h-5 text-orange-400" />
            {analysis.summary.volatility}
          </div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Volume</p>
          <div className="flex items-center gap-2 font-bold text-white">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            {analysis.summary.volume}
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Signals & Patterns */}
        <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-400" />
            Sinais e Padrões
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Padrões Detectados</p>
              <ul className="flex flex-wrap gap-2">
                {analysis.details.patterns.map((p, i) => (
                  <li key={i} className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-gray-700">{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Indicadores</p>
              <div className="space-y-2">
                {analysis.details.indicators.map((ind, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-bold text-indigo-400">{ind.name}:</span>{' '}
                    <span className="text-gray-300">{ind.insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Action & Strategy */}
        <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Pontos de Ação
          </h3>
          <ul className="space-y-2">
            {analysis.details.actionPoints.map((ap, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-300">
                <span className="text-indigo-500">•</span>
                {ap}
              </li>
            ))}
          </ul>
          <div className="mt-4 p-4 bg-indigo-900/20 border border-indigo-900/30 rounded-xl">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Recomendação IA</p>
            <p className="text-sm leading-relaxed">{analysis.recommendation}</p>
          </div>
        </section>
      </div>
      
      {analysis.notes && (
        <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 italic text-sm text-gray-400">
          Nota: {analysis.notes}
        </div>
      )}
    </div>
  );
};
