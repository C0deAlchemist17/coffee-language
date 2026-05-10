import React from 'react';
import { Plus, Search, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';

const Expenses: React.FC = () => {
  const expenses: Array<{id: string; category: string; description: string; amount: number; date: Date}> = [];

  const total = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">المصروفات</h2>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>إضافة مصروف</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-red-500/20 text-red-400">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-green-500/20 text-green-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">هذا الشهر</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-blue-500/20 text-blue-400">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">عدد المصروفات</p>
              <p className="text-2xl font-bold text-white">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ابحث عن مصروف..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-right p-4 text-gray-400 font-medium">الفئة</th>
              <th className="text-right p-4 text-gray-400 font-medium">الوصف</th>
              <th className="text-right p-4 text-gray-400 font-medium">المبلغ</th>
              <th className="text-right p-4 text-gray-400 font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="table-row">
                <td className="p-4">
                  <span className="badge badge-info">{expense.category}</span>
                </td>
                <td className="p-4 text-gray-300">{expense.description}</td>
                <td className="p-4 text-red-400 font-medium">{formatCurrency(expense.amount)}</td>
                <td className="p-4 text-gray-300">{formatDate(expense.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
