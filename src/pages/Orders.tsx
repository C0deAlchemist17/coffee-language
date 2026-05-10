import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, ShoppingCart, Printer } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/format';
import { useNotificationStore } from '../store/notificationStore';
import ReceiptPrinter from '../components/ReceiptPrinter';

interface Order {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: string;
  createdAt: Date;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

const Orders: React.FC = () => {
  const { addNotification } = useNotificationStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const filteredOrders = orders.filter(order =>
    order.number.includes(searchTerm) || 
    order.customer.includes(searchTerm)
  );

  const handlePrintReceipt = (order: Order) => {
    setSelectedOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('coffee_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading orders:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (orders.length > 0) {
        localStorage.setItem('coffee_orders', JSON.stringify(orders));
      }
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }, [orders, isLoaded]);

  // Auto-refresh orders
  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('coffee_orders');
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          setOrders(parsed);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading orders:', error);
        setIsLoaded(true);
      }
    };

    loadOrders();

    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      COMPLETED: { text: 'مكتمل', className: 'badge-success' },
      IN_PROGRESS: { text: 'قيد التحضير', className: 'badge-warning' },
      READY: { text: 'جاهز', className: 'badge-info' },
      CANCELLED: { text: 'ملغي', className: 'badge-danger' },
    };
    return badges[status] || { text: status, className: 'badge-info' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">الطلبات</h2>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={20} />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن طلب..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
            <p>لا توجد طلبات بعد</p>
          </div>
        ) : (
        <table className="w-full min-w-[600px]">
          <thead className="bg-white/5">
            <tr>
              <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">رقم الطلب</th>
              <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">العميل</th>
              <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">المبلغ</th>
              <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">الحالة</th>
              <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">التاريخ</th>
              <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              return (
                <tr key={order.id} className="table-row">
                  <td className="p-4 font-medium text-white">#{order.number}</td>
                  <td className="p-4 text-gray-300">{order.customer}</td>
                  <td className="p-4 text-coffee-400 font-medium">{formatCurrency(order.total)}</td>
                  <td className="p-4">
                    <span className={`badge ${statusBadge.className}`}>{statusBadge.text}</span>
                  </td>
                  <td className="p-4 text-gray-300">{formatDateTime(order.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handlePrintReceipt(order)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-green-400"
                      >
                        <Printer size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>

      {/* Receipt Printer Modal */}
      <ReceiptPrinter
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onPrint={() => window.print()}
      />
    </div>
  );
};

export default Orders;
