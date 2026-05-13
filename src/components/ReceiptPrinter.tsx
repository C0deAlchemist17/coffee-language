import React, { useState } from 'react';
import { Printer, X, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: string;
  createdAt: Date;
  items: OrderItem[];
  cashier?: string;
  paymentMethod?: string;
}

interface ReceiptPrinterProps {
  order: Order | null;
  onClose: () => void;
  onPrint: () => Promise<void>;
}

const ReceiptPrinter: React.FC<ReceiptPrinterProps> = ({ order, onClose, onPrint }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  if (!order) return null;

  const currentDate = new Date(order.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTime = new Date(order.createdAt).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = async () => {
    setIsPrinting(true);
    setPrintError(null);
    try {
      await onPrint();
      setTimeout(() => {
        setIsPrinting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Print error:', error);
      setPrintError('فشلت عملية الطباعة');
      setIsPrinting(false);
    }
  };

  return (
    <AnimatePresence>
      {order && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Receipt Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">إيصال دفع</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* Café Info */}
            <div className="text-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Coffee Language</h2>
              <p className="text-sm text-gray-600">نظام نقاط البيع</p>
            </div>

            {/* Order Info */}
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الطلب:</span>
                <span className="font-medium">#{order.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">العميل:</span>
                <span className="font-medium">{order.customer}</span>
              </div>
              {order.cashier && (
                <div className="flex justify-between">
                  <span className="text-gray-600">الكاشير:</span>
                  <span className="font-medium">{order.cashier}</span>
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">طريقة الدفع:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">التاريخ:</span>
                <span className="font-medium">{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الوقت:</span>
                <span className="font-medium">{currentTime}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <h4 className="font-bold text-gray-800 mb-3">المنتجات</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-gray-800">{item.productName}</span>
                      <span className="text-sm text-gray-600 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium text-gray-800 ml-4">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الفرعي:</span>
                <span className="font-medium">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-gray-800">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">شكراً لزيارتكم</p>
              <p className="text-xs text-gray-500">Coffee Language POS</p>
            </div>

            {/* Error Message */}
            {printError && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {printError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={isPrinting}
                className="flex-1 btn-secondary"
              >
                إغلاق
              </button>
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {isPrinting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>جاري الطباعة...</span>
                  </>
                ) : (
                  <>
                    <Printer size={20} />
                    <span>طباعة</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReceiptPrinter;
