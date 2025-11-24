import React, { useState, useEffect } from 'react';
import { Plus, PieChart, List, Sparkles, Save, Check } from 'lucide-react';
import { Transaction } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import { TransactionTable } from './components/TransactionTable';
import { TransactionForm } from './components/TransactionForm';
import { Dashboard } from './components/Dashboard';
import { AiAdvisor } from './components/AiAdvisor';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<'table' | 'dashboard'>('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem('smartfinance_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        setTransactions(INITIAL_TRANSACTIONS);
      }
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  }, []);

  // Auto-save keeps data in sync, but manual save provides reassurance
  useEffect(() => {
    localStorage.setItem('smartfinance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleManualSave = () => {
    localStorage.setItem('smartfinance_transactions', JSON.stringify(transactions));
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              ₽
            </div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">Бухгалтерия</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="bg-slate-100 p-1 rounded-lg flex mr-2">
              <button
                onClick={() => setView('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List size={16} />
                <span className="hidden sm:inline">Таблица</span>
              </button>
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <PieChart size={16} />
                <span className="hidden sm:inline">Дашборд</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleManualSave}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-all shadow-sm active:scale-95"
              title="Сохранить изменения"
            >
              <Save size={18} />
              <span className="hidden sm:inline">Сохранить</span>
            </button>

            {/* AI Button */}
            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg transition-all shadow-md shadow-indigo-200"
            >
              <Sparkles size={18} />
              <span className="hidden sm:inline">AI Анализ</span>
            </button>

            {/* Add Button */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-md"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'table' ? (
          <TransactionTable 
            transactions={transactions} 
            onDelete={handleDeleteTransaction} 
          />
        ) : (
          <Dashboard transactions={transactions} />
        )}
      </main>

      {/* Save Notification Toast */}
      {showSaveNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="bg-emerald-500 rounded-full p-1 text-white">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="font-medium">Изменения сохранены</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onAdd={handleAddTransaction} 
      />

      <AiAdvisor 
        isOpen={isAiOpen} 
        onClose={() => setIsAiOpen(false)} 
        transactions={transactions} 
      />
    </div>
  );
};

export default App;