import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/format';
import { useNotificationStore } from '../store/notificationStore';
import { Search, Plus, Minus, Trash2, CreditCard, Wallet, DollarSign, Printer, Clock, User, Table as TableIcon, X, ShoppingCart, Package } from 'lucide-react';
import ReceiptPrinter from '../components/ReceiptPrinter';

interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  categoryId: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  nameAr: string;
}

const POS: React.FC = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, getSubtotal, getTotal, orderType, setOrderType, notes, setNotes, discount, setDiscount } = useCartStore();
  const { addNotification } = useNotificationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([{ id: 'all', name: 'All', nameAr: 'الكل' }]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showReceiptPrinter, setShowReceiptPrinter] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('coffee_products');
      const savedCategories = localStorage.getItem('coffee_categories');
      
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts.filter((p: Product) => p.isActive !== false));
      }
      
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories([{ id: 'all', name: 'All', nameAr: 'الكل' }, ...parsedCategories]);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading POS data:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const savedProducts = localStorage.getItem('coffee_products');
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts.filter((p: Product) => p.isActive !== false));
      }
    } catch (error) {
      console.error('Error reloading POS products:', error);
    }
  }, [isLoaded]);

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === 'all' || product.categoryId === selectedCategory) &&
      ((product.nameAr && product.nameAr.includes(searchTerm)) || 
       (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      product: product as any,
      quantity: 1,
      price: product.price,
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      addNotification({
        title: 'السلة فارغة',
        message: 'يرجى إضافة منتجات إلى السلة أولاً',
        type: 'error',
      });
      return;
    }

    // Create order
    const order = {
      id: Date.now().toString(),
      number: `#${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      customer: 'عميل نقدي',
      total: getTotal(),
      status: 'COMPLETED',
      createdAt: new Date(),
      items: items.map(item => ({
        productId: item.productId,
        productName: item.product.nameAr || item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // Save order to localStorage
    try {
      // Save order
      const savedOrders = localStorage.getItem('coffee_orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.push(order);
      localStorage.setItem('coffee_orders', JSON.stringify(orders));
      
      // Update inventory - reduce stock
      const savedProducts = localStorage.getItem('coffee_products');
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        const updatedProducts = products.map((p: any) => {
          const orderItem = items.find(item => item.productId === p.id);
          if (orderItem) {
            return {
              ...p,
              stock: Math.max(0, (p.stock || 0) - orderItem.quantity)
            };
          }
          return p;
        });
        localStorage.setItem('coffee_products', JSON.stringify(updatedProducts));
      }
      
      addNotification({
        title: 'تم إنشاء الطلب',
        message: `تم إنشاء الطلب ${order.number} بنجاح`,
        type: 'success',
      });
      
      clearCart();
    } catch (error) {
      console.error('Error saving order:', error);
      addNotification({
        title: 'خطأ',
        message: 'حدث خطأ أثناء حفظ الطلب',
        type: 'error',
      });
    }
  };

  const handlePrint = () => {
    if (items.length === 0) {
      addNotification({
        title: 'السلة فارغة',
        message: 'يرجى إضافة منتجات إلى السلة أولاً',
        type: 'error',
      });
      return;
    }

    // Create order for printing
    const order = {
      id: Date.now().toString(),
      number: `#${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      customer: 'عميل نقدي',
      total: getTotal(),
      status: 'PENDING',
      createdAt: new Date(),
      items: items.map(item => ({
        productId: item.productId,
        productName: item.product.nameAr || item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    setCurrentOrder(order);
    setShowReceiptPrinter(true);
  };

  const handlePrintReceipt = async () => {
    // Simulate print - in real implementation, this would use window.print() or electron API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="h-full flex gap-6 overflow-hidden">
      {/* Products Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search and Filter */}
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="input-field w-full pr-12"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-coffee-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category.nameAr}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-thin grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <motion.button
              key={product.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddToCart(product)}
              className="glass rounded-xl p-4 text-right hover:bg-white/10 transition-colors"
            >
              <div className="w-full h-32 bg-white/5 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl">☕</span>
              </div>
              <h3 className="font-bold text-white text-lg">{product.nameAr}</h3>
              <p className="text-coffee-400 font-bold mt-2">{formatCurrency(product.price)}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 max-w-sm glass rounded-xl flex flex-col flex-shrink-0">
        {/* Order Type */}
        <div className="p-4 border-b border-white/10">
          <div className="flex gap-2">
            {[
              { type: 'DINE_IN' as const, label: 'جلسة', icon: TableIcon },
              { type: 'TAKEAWAY' as const, label: 'توصيل', icon: Clock },
              { type: 'DELIVERY' as const, label: 'خارجي', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => setOrderType(item.type)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                    orderType === item.type
                      ? 'bg-coffee-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <ShoppingCart className="mx-auto mb-4 opacity-50" size={48} />
              <p>السلة فارغة</p>
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.variantId}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{item.product.nameAr}</h4>
                    <p className="text-sm text-coffee-400">{formatCurrency(item.price)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.variantId)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-bold text-white">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Notes */}
        <div className="p-4 border-t border-white/10">
          <textarea
            value={notes || ''}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ملاحظات الطلب..."
            className="input-field w-full h-20 resize-none"
          />
        </div>

        {/* Summary */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>المجموع الفرعي</span>
            <span>{formatCurrency(getSubtotal())}</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span>الخصم</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="input-field w-24 text-center"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between text-xl font-bold text-white">
            <span>الإجمالي</span>
            <span>{formatCurrency(getTotal())}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-2">
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إتمام الطلب
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              disabled={items.length === 0}
              className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={18} />
              <span>طباعة</span>
            </button>
            <button
              onClick={clearCart}
              disabled={items.length === 0}
              className="btn-danger flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
              <span>إلغاء</span>
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Printer Modal */}
      {showReceiptPrinter && currentOrder && (
        <ReceiptPrinter
          order={currentOrder}
          onClose={() => setShowReceiptPrinter(false)}
          onPrint={handlePrintReceipt}
        />
      )}
    </div>
  );
};

export default POS;
