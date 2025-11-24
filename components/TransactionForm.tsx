import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction, TransactionType, ExpenseCategoryGroup } from '../types';
import { EXPENSE_CATEGORIES, ACCOUNTS, INCOME_SOURCES } from '../constants';
import { v4 as uuidv4 } from 'uuid'; // We'll simulate uuid with a simple function since no external lib in prompt

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Transaction) => void;
}

const simpleId = () => Math.random().toString(36).substring(2, 9);

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onAdd }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryGroup, setCategoryGroup] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [account, setAccount] = useState<string>(ACCOUNTS[0]);
  const [comment, setComment] = useState<string>('');

  // Reset subcategory when group changes
  useEffect(() => {
    setSubcategory('');
  }, [categoryGroup]);

  // Set initial categories based on type
  useEffect(() => {
    if (type === TransactionType.INCOME) {
      setCategoryGroup('Источники дохода');
      setSubcategory(INCOME_SOURCES[0]);
    } else {
      setCategoryGroup(ExpenseCategoryGroup.VARIABLE);
      setSubcategory(EXPENSE_CATEGORIES[ExpenseCategoryGroup.VARIABLE][0]);
    }
  }, [type]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !subcategory) return;

    const newTransaction: Transaction = {
      id: simpleId(),
      date,
      type,
      categoryGroup,
      subcategory,
      amount: parseFloat(amount),
      account,
      comment,
      createdAt: Date.now(),
    };

    onAdd(newTransaction);
    
    // Reset vital fields
    setAmount('');
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Новая запись</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                type === TransactionType.EXPENSE 
                  ? 'bg-white text-rose-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Расход
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                type === TransactionType.INCOME 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Доход
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Дата</label>
               <input 
                 type="date" 
                 required
                 value={date} 
                 onChange={(e) => setDate(e.target.value)}
                 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Сумма (₽)</label>
               <input 
                 type="number" 
                 required
                 min="0"
                 step="0.01"
                 placeholder="0.00"
                 value={amount} 
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
               />
            </div>
          </div>

          {type === TransactionType.EXPENSE && (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Группа категории</label>
              <select 
                value={categoryGroup} 
                onChange={(e) => setCategoryGroup(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
              >
                {Object.values(ExpenseCategoryGroup).map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {type === TransactionType.EXPENSE ? 'Подкатегория' : 'Источник'}
            </label>
            <select 
              value={subcategory} 
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
            >
              {type === TransactionType.INCOME ? (
                INCOME_SOURCES.map(src => <option key={src} value={src}>{src}</option>)
              ) : (
                categoryGroup && EXPENSE_CATEGORIES[categoryGroup as ExpenseCategoryGroup]?.map(sub => (
                   <option key={sub} value={sub}>{sub}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Счет / Кошелек</label>
             <select 
              value={account} 
              onChange={(e) => setAccount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
            >
              {ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Комментарий</label>
            <input 
              type="text" 
              placeholder="Например: Такси до работы"
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors mt-2"
          >
            Добавить
          </button>
        </form>
      </div>
    </div>
  );
};