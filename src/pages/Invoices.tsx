import React from 'react';
import { Search, FileText, Printer, Download, Eye } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/format';

const Invoices: React.FC = () => {
  const invoices: Array<{id: string; number: string; customer: string; total: number; status: string; createdAt: Date}> = [];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      PAID: { text: 'مدفوع', className: 'badge-success' },
      PENDING: { text: 'معلق', className: 'badge-warning' },
      CANCELLED: { text: 'ملغي', className: 'badge-danger' },
    };
    return badges[status] || { text: status, className: 'badge-info' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">الفواتير</h2>
        <button className="btn-primary flex items-center gap-2">
          <FileText size={20} />
          <span>إنشاء فاتورة</span>
        </button>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ابحث عن فاتورة..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-right p-4 text-gray-400 font-medium">رقم الفاتورة</th>
              <th className="text-right p-4 text-gray-400 font-medium">العميل</th>
              <th className="text-right p-4 text-gray-400 font-medium">المبلغ</th>
              <th className="text-right p-4 text-gray-400 font-medium">الحالة</th>
              <th className="text-right p-4 text-gray-400 font-medium">التاريخ</th>
              <th className="text-right p-4 text-gray-400 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const statusBadge = getStatusBadge(invoice.status);
              return (
                <tr key={invoice.id} className="table-row">
                  <td className="p-4 font-medium text-white">{invoice.number}</td>
                  <td className="p-4 text-gray-300">{invoice.customer}</td>
                  <td className="p-4 text-coffee-400 font-medium">{formatCurrency(invoice.total)}</td>
                  <td className="p-4">
                    <span className={`badge ${statusBadge.className}`}>{statusBadge.text}</span>
                  </td>
                  <td className="p-4 text-gray-300">{formatDateTime(invoice.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-green-400">
                        <Printer size={18} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-purple-400">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
