import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Users, Download } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">التقارير والتحليلات</h2>
        <button className="btn-primary flex items-center gap-2">
          <Download size={20} />
          <span>تصدير</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-green-500/20 text-green-400">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(45600)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-blue-500/20 text-blue-400">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">عدد الطلبات</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-purple-500/20 text-purple-400">
              <Package size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">المنتجات المباعة</p>
              <p className="text-2xl font-bold text-white">5,678</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-orange-500/20 text-orange-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">العملاء الجدد</p>
              <p className="text-2xl font-bold text-white">89</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">المبيعات الشهرية</h3>
          <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
              <p>رسم بياني للمبيعات</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">أكثر المنتجات مبيعاً</h3>
          <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
              <p>رسم بياني للمنتجات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'تقرير المبيعات', icon: DollarSign, color: 'bg-green-500/20 text-green-400' },
          { title: 'تقرير المنتجات', icon: Package, color: 'bg-purple-500/20 text-purple-400' },
          { title: 'تقرير العملاء', icon: Users, color: 'bg-orange-500/20 text-orange-400' },
          { title: 'تقرير الموظفين', icon: Users, color: 'bg-blue-500/20 text-blue-400' },
          { title: 'تقرير المخزون', icon: Package, color: 'bg-yellow-500/20 text-yellow-400' },
          { title: 'تقرير المصروفات', icon: DollarSign, color: 'bg-red-500/20 text-red-400' },
        ].map((report) => {
          const Icon = report.icon;
          return (
            <button key={report.title} className="card hover:bg-white/10 transition-colors text-right">
              <div className={`w-12 h-12 rounded-xl ${report.color} flex items-center justify-center mb-4`}>
                <Icon size={24} />
              </div>
              <h3 className="font-bold text-white">{report.title}</h3>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
