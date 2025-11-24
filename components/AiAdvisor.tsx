import React, { useState } from 'react';
import { analyzeBudgetWithGemini } from '../services/geminiService';
import { Transaction } from '../types';
import { Sparkles, X, Loader2, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ isOpen, onClose, transactions }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (transactions.length < 3) {
        setAnalysis("Пожалуйста, добавьте хотя бы 3 транзакции для корректного анализа.");
        return;
    }
    setLoading(true);
    const result = await analyzeBudgetWithGemini(transactions);
    setAnalysis(result);
    setLoading(false);
  };

  // Auto-trigger analysis when opened if not already done
  React.useEffect(() => {
    if (isOpen && !analysis && !loading) {
      handleAnalyze();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" 
            onClick={onClose}
        />
        
        {/* Modal Content */}
        <div className="bg-white w-full max-w-2xl h-[80vh] sm:h-auto sm:max-h-[85vh] sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="flex items-center gap-2">
                    <Bot className="text-indigo-200" />
                    <h2 className="font-bold text-lg">AI Финансовый Советник</h2>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-4">
                        <Loader2 size={40} className="animate-spin text-indigo-600" />
                        <p className="animate-pulse font-medium">Анализирую ваши расходы...</p>
                    </div>
                ) : (
                    <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-indigo-700">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
                <button 
                    onClick={handleAnalyze} 
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-all"
                >
                    <Sparkles size={16} />
                    <span>Обновить анализ</span>
                </button>
            </div>
        </div>
    </div>
  );
};