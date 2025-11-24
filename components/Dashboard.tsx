import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const key = t.categoryGroup; // Group by high-level category (Fixed, Variable, etc)
        data[key] = (data[key] || 0) + t.amount;
      });
    
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const dailyFlow = useMemo(() => {
    const data: Record<string, { date: string; income: number; expense: number }> = {};
    
    // Sort transactions by date
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach(t => {
      const dateKey = new Date(t.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      if (!data[dateKey]) {
        data[dateKey] = { date: dateKey, income: 0, expense: 0 };
      }
      if (t.type === TransactionType.INCOME) {
        data[dateKey].income += t.amount;
      } else {
        data[dateKey].expense += t.amount;
      }
    });

    return Object.values(data);
  }, [transactions]);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Доходы</p>
          <p className="text-2xl font-bold text-emerald-600">+{totals.income.toLocaleString('ru-RU')} ₽</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Расходы</p>
          <p className="text-2xl font-bold text-rose-600">-{totals.expense.toLocaleString('ru-RU')} ₽</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Остаток</p>
          <p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
            {totals.balance.toLocaleString('ru-RU')} ₽
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart - Category Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Структура расходов</h3>
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString('ru-RU')} ₽`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">Нет данных о расходах</div>
          )}
        </div>

        {/* Bar Chart - Daily Flow */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Динамика по дням</h3>
          {dailyFlow.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyFlow} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="income" name="Доход" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Расход" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-slate-400">Нет транзакций</div>
          )}
        </div>
      </div>
    </div>
  );
};