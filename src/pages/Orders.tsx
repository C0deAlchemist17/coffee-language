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
  cashier?: string;
  paymentMethod?: string;
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

  const handlePrintReceipt = async (order: Order) => {
    setSelectedOrder(order);
  };

  const handlePrint = async () => {
    if (!selectedOrder) return;
    
    try {
      // Generate receipt HTML
      const receiptHtml = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>Receipt #${selectedOrder.number}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              width: 80mm;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h2 {
              margin: 0;
              font-size: 18px;
            }
            .info {
              margin-bottom: 15px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .items {
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 10px 0;
              margin-bottom: 15px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .total {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Coffee Language</h2>
            <p>نظام نقاط البيع</p>
          </div>
          <div class="info">
            <div class="info-row"><span>رقم الطلب:</span><span>#${selectedOrder.number}</span></div>
            <div class="info-row"><span>العميل:</span><span>${selectedOrder.customer}</span></div>
            ${selectedOrder.cashier ? `<div class="info-row"><span>الكاشير:</span><span>${selectedOrder.cashier}</span></div>` : ''}
            ${selectedOrder.paymentMethod ? `<div class="info-row"><span>طريقة الدفع:</span><span>${selectedOrder.paymentMethod}</span></div>` : ''}
            <div class="info-row"><span>التاريخ:</span><span>${new Date(selectedOrder.createdAt).toLocaleDateString('ar-EG')}</span></div>
            <div class="info-row"><span>الوقت:</span><span>${new Date(selectedOrder.createdAt).toLocaleTimeString('ar-EG')}</span></div>
          </div>
          <div class="items">
            ${selectedOrder.items.map(item => `
              <div class="item">
                <span>${item.productName} x${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            الإجمالي: ${formatCurrency(selectedOrder.total)}
          </div>
          <div class="footer">
            <p>شكراً لزيارتكم</p>
            <p>Coffee Language POS</p>
          </div>
        </body>
        </html>
      `;

      // Use Electron IPC if available, otherwise use window.print
      if (window.electronAPI && window.electronAPI.printReceipt) {
        await window.electronAPI.printReceipt(receiptHtml, {});
      } else {
        // Fallback for browser
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(receiptHtml);
          printWindow.document.close();
          printWindow.print();
        }
      }
      
      addNotification({
        title: 'تمت الطباعة',
        message: 'تم طباعة الإيصال بنجاح',
        type: 'success',
      });
    } catch (error) {
      console.error('Print error:', error);
      addNotification({
        title: 'فشل الطباعة',
        message: 'حدث خطأ أثناء طباعة الإيصال',
        type: 'error',
      });
      throw error;
    }
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
        onPrint={handlePrint}
      />
    </div>
  );
};

export default Orders;
