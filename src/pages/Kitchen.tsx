import React from 'react';
import { Clock, CheckCircle, XCircle, ChefHat } from 'lucide-react';
import { formatCurrency, formatTime } from '../utils/format';

const Kitchen: React.FC = () => {
  const orders: Array<{id: string; number: string; table: string; items: Array<{name: string; quantity: number; notes: string}>; status: string; createdAt: Date}> = [];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string; icon: any }> = {
      PENDING: { text: 'في الانتظار', className: 'badge-warning', icon: Clock },
      PREPARING: { text: 'قيد التحضير', className: 'badge-info', icon: ChefHat },
      READY: { text: 'جاهز', className: 'badge-success', icon: CheckCircle },
    };
    return badges[status] || { text: status, className: 'badge-info', icon: Clock };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">شاشة المطبخ</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => {
          const statusBadge = getStatusBadge(order.status);
          const StatusIcon = statusBadge.icon;
          return (
            <div key={order.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">#{order.number}</h3>
                  <p className="text-gray-400">{order.table}</p>
                </div>
                <span className={`badge ${statusBadge.className} flex items-center gap-2`}>
                  <StatusIcon size={16} />
                  {statusBadge.text}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">{item.name}</span>
                      <span className="text-coffee-400 font-bold">x{item.quantity}</span>
                    </div>
                    {item.notes && <p className="text-sm text-gray-400">{item.notes}</p>}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="btn-success flex-1 flex items-center justify-center gap-2">
                  <CheckCircle size={18} />
                  <span>تم</span>
                </button>
                <button className="btn-danger flex items-center justify-center gap-2 px-4">
                  <XCircle size={18} />
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3 text-center">{formatTime(order.createdAt)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kitchen;
