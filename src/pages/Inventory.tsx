import React from 'react';
import { Search, TrendingUp, TrendingDown, AlertTriangle, Package } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const Inventory: React.FC = () => {
  const inventory: Array<{id: string; product: string; quantity: number; unit: string; minLevel: number; status: string}> = [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">المخزون</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-blue-500/20 text-blue-400">
              <Package size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-white">89</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-green-500/20 text-green-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">مخزون كافٍ</p>
              <p className="text-2xl font-bold text-white">75</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-yellow-500/20 text-yellow-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">مخزون منخفض</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-red-500/20 text-red-400">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">نفذ من المخزون</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ابحث في المخزون..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-right p-4 text-gray-400 font-medium">المنتج</th>
              <th className="text-right p-4 text-gray-400 font-medium">الكمية</th>
              <th className="text-right p-4 text-gray-400 font-medium">الوحدة</th>
              <th className="text-right p-4 text-gray-400 font-medium">الحد الأدنى</th>
              <th className="text-right p-4 text-gray-400 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="table-row">
                <td className="p-4 font-medium text-white">{item.product}</td>
                <td className="p-4 text-gray-300">{item.quantity}</td>
                <td className="p-4 text-gray-300">{item.unit}</td>
                <td className="p-4 text-gray-300">{item.minLevel}</td>
                <td className="p-4">
                  <span
                    className={`badge ${
                      item.status === 'LOW' ? 'badge-warning' : 'badge-success'
                    }`}
                  >
                    {item.status === 'LOW' ? 'منخفض' : 'كافٍ'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
