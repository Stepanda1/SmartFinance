import React from 'react';
import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onDelete }) => {
  
  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }); // 01.10 format
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Тип</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">Подкатегория</th>
              <th className="px-4 py-3 text-right">Сумма</th>
              <th className="px-4 py-3">Счет</th>
              <th className="px-4 py-3">Комментарий</th>
              <th className="px-4 py-3 text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  Записей пока нет. Нажмите "Добавить", чтобы создать первую.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium whitespace-nowrap">{formatDate(t.date)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {t.type === TransactionType.INCOME ? <ArrowUpCircle size={12} /> : <ArrowDownCircle size={12} />}
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.categoryGroup.replace(/\(.*\)/, '').trim()}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-medium">{t.subcategory}</td>
                  <td className={`px-4 py-3 text-sm text-right font-bold whitespace-nowrap ${
                    t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-900'
                  }`}>
                    {t.amount.toLocaleString('ru-RU')} ₽
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{t.account}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 italic">{t.comment || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Удалить"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};