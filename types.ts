
export interface AnalysisResult {
  id: string;
  timestamp: number;
  image: string;
  title: string;
  template: string;
  summary: {
    confidenceScore: number;
    trendDirection: 'Bullish' | 'Bearish' | 'Neutral';
    volatility: 'Low' | 'Medium' | 'High';
    volume: string;
  };
  details: {
    patterns: string[];
    signals: string[];
    indicators: {
      name: string;
      insight: string;
    }[];
    actionPoints: string[];
  };
  recommendation: string;
  notes?: string;
  isFavorite?: boolean;
}

export interface AnalysisTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export const TEMPLATES: AnalysisTemplate[] = [
  {
    id: 'standard',
    name: 'Padrão Profissional',
    description: 'Análise técnica equilibrada cobrindo tendência, volume e padrões.',
    prompt: 'Forneça uma análise técnica detalhada deste gráfico. Identifique tendências de curto e longo prazo, volume relativo, padrões de velas significativos e sinais de indicadores visíveis como RSI ou Médias Móveis. Responda em Português de Portugal.'
  },
  {
    id: 'daytrading',
    name: 'Day Trading Scalping',
    description: 'Focado em sinais de curto prazo e breakouts imediatos.',
    prompt: 'Atue como um day trader agressivo. Identifique níveis de suporte/resistência imediatos, momentum atual e padrões de continuação ou reversão para o próximo candle. Responda em Português de Portugal.'
  },
  {
    id: 'swing',
    name: 'Investimento (Swing)',
    description: 'Focado em estrutura de mercado e tendências macro.',
    prompt: 'Analise a estrutura de mercado macro. Identifique fases de acumulação/distribuição e possíveis alvos de preço a médio prazo. Responda em Português de Portugal.'
  }
];
