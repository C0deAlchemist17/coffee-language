import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { safeParseDate, parseOrderDates } from '../utils/dateUtils';

interface DashboardStats {
  dailySales: number;
  orderCount: number;
  productCount: number;
  customerCount: number;
}

interface OrderData {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: string;
  createdAt: Date;
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const isAdmin = user?.role === 'ADMIN';
  
  const [stats, setStats] = useState<DashboardStats>({
    dailySales: 0,
    orderCount: 0,
    productCount: 0,
    customerCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [topProducts, setTopProducts] = useState<Array<{name: string; sales: number; revenue: number}>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleResetSales = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع المبيعات؟')) {
      // Clear orders
      localStorage.removeItem('coffee_orders');
      setRecentOrders([]);
      setStats(prev => ({ ...prev, dailySales: 0, orderCount: 0 }));
      addNotification({
        title: 'تم إعادة التعيين',
        message: 'تم إعادة تعيين المبيعات بنجاح',
        type: 'success',
      });
    }
  };

  const handleResetReports = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع التقارير؟')) {
      // Clear all report-related data
      localStorage.removeItem('coffee_orders');
      setRecentOrders([]);
      setTopProducts([]);
      setStats({
        dailySales: 0,
        orderCount: 0,
        productCount: 0,
        customerCount: 0,
      });
      addNotification({
        title: 'تم إعادة التعيين',
        message: 'تم إعادة تعيين التقارير بنجاح',
        type: 'success',
      });
    }
  };

  const loadDashboardData = () => {
    try {
      // Load orders and parse dates
      const savedOrders = localStorage.getItem('coffee_orders');
      const orders: any[] = savedOrders ? parseOrderDates(JSON.parse(savedOrders)) : [];
      
      // Load products
      const savedProducts = localStorage.getItem('coffee_products');
      const products = savedProducts ? JSON.parse(savedProducts) : [];
      
      // Load customers
      const savedCustomers = localStorage.getItem('coffee_customers');
      const customers = savedCustomers ? JSON.parse(savedCustomers) : [];

      // Calculate today's sales
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = orders.filter((o) => {
        const createdAt = safeParseDate(o.createdAt);
        return createdAt && createdAt >= today;
      });
      const dailySales = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      // Get recent orders (last 5)
      const sortedOrders = [...orders].sort((a, b) => {
        const dateA = safeParseDate(a.createdAt);
        const dateB = safeParseDate(b.createdAt);
        const timeA = dateA ? dateA.getTime() : 0;
        const timeB = dateB ? dateB.getTime() : 0;
        return timeB - timeA;
      }).slice(0, 5);

      // Calculate top products
      const productSales: Record<string, { sales: number; revenue: number }> = {};
      orders.forEach((order: any) => {
        if (order.items) {
          order.items.forEach((item: any) => {
            if (!productSales[item.productName]) {
              productSales[item.productName] = { sales: 0, revenue: 0 };
            }
            productSales[item.productName].sales += item.quantity || 1;
            productSales[item.productName].revenue += (item.price * (item.quantity || 1));
          });
        }
      });
      
      const topProductsData = Object.entries(productSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setStats({
        dailySales,
        orderCount: orders.length,
        productCount: products.length,
        customerCount: customers.length,
      });
      setRecentOrders(sortedOrders);
      setTopProducts(topProductsData);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setIsLoaded(true);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Listen for storage events (when other tabs update data)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (
        e.key === 'coffee_orders' || 
        e.key === 'coffee_products' || 
        e.key === 'coffee_customers'
      )) {
        loadDashboardData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom refresh events from other components
  useEffect(() => {
    const handleDashboardRefresh = () => {
      loadDashboardData();
    };
    
    window.addEventListener('dashboard-refresh', handleDashboardRefresh);
    window.addEventListener('reports-reset', handleDashboardRefresh);
    return () => {
      window.removeEventListener('dashboard-refresh', handleDashboardRefresh);
      window.removeEventListener('reports-reset', handleDashboardRefresh);
    };
  }, []);

  // Poll for updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const statsData = [
    {
      title: 'المبيعات اليومية',
      value: formatCurrency(stats.dailySales),
      change: '+0%',
      positive: true,
      icon: DollarSign,
      color: 'bg-green-500/20 text-green-400',
    },
    {
      title: 'عدد الطلبات',
      value: stats.orderCount.toString(),
      change: '+0%',
      positive: true,
      icon: ShoppingCart,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      title: 'المنتجات',
      value: stats.productCount.toString(),
      change: '+0%',
      positive: true,
      icon: Package,
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      title: 'العملاء',
      value: stats.customerCount.toString(),
      change: '+0%',
      positive: true,
      icon: Users,
      color: 'bg-orange-500/20 text-orange-400',
    },
  ];

  const formatOrderTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Admin Reset Buttons */}
      {isAdmin && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleResetSales}
            className="btn-warning flex items-center gap-2"
          >
            <RotateCcw size={20} />
            <span>إعادة تعيين المبيعات</span>
          </button>
          <button
            onClick={handleResetReports}
            className="btn-danger flex items-center gap-2"
          >
            <Trash2 size={20} />
            <span>إعادة تعيين التقارير</span>
          </button>
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {stat.positive ? (
                      <TrendingUp size={16} className="text-green-400" />
                    ) : (
                      <TrendingDown size={16} className="text-red-400" />
                    )}
                    <span className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">أحدث الطلبات</h3>
            <ShoppingCart className="text-coffee-400" size={24} />
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-400 text-center py-8">لا توجد طلبات بعد</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center">
                      <Clock size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{order.number}</p>
                      <p className="text-sm text-gray-400">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-gray-400">{formatOrderTime(order.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">أكثر المنتجات مبيعاً</h3>
            <Package className="text-coffee-400" size={24} />
          </div>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">لا توجد مبيعات بعد</p>
            ) : (
              topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-sm text-gray-400">{product.sales} بيع</p>
                    </div>
                  </div>
                  <p className="font-medium text-white">{formatCurrency(product.revenue)}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
