import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Users, Download, RefreshCw, AlertTriangle, X } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportData {
  orders: any[];
  expenses: any[];
  customers: any[];
}

const Reports: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const isAdmin = user?.role === 'ADMIN';
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    productsSold: 0,
    newCustomers: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const loadReportData = useCallback(() => {
    try {
      // Load orders
      const savedOrders = localStorage.getItem('coffee_orders');
      const orders: any[] = savedOrders ? JSON.parse(savedOrders) : [];
      
      // Load expenses
      const savedExpenses = localStorage.getItem('coffee_expenses');
      const expenses: any[] = savedExpenses ? JSON.parse(savedExpenses) : [];
      
      // Load customers
      const savedCustomers = localStorage.getItem('coffee_customers');
      const customers: any[] = savedCustomers ? JSON.parse(savedCustomers) : [];
      
      // Calculate total sales from orders
      const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Calculate total products sold
      const productsSold = orders.reduce((sum, order) => {
        if (order.items && Array.isArray(order.items)) {
          return sum + order.items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0);
        }
        return sum;
      }, 0);
      
      setStats({
        totalSales,
        orderCount: orders.length,
        productsSold,
        newCustomers: customers.length,
      });
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading report data:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadReportData();
    
    // Listen for storage changes (when other tabs/pages update data)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (
        e.key === 'coffee_orders' || 
        e.key === 'coffee_expenses' || 
        e.key === 'coffee_customers'
      )) {
        loadReportData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadReportData]);

  // Listen for custom reset event from other components
  useEffect(() => {
    const handleReportsReset = () => {
      loadReportData();
    };
    
    window.addEventListener('reports-reset', handleReportsReset);
    return () => window.removeEventListener('reports-reset', handleReportsReset);
  }, [loadReportData]);

  const handleResetReports = async () => {
    if (!isAdmin) {
      addNotification({
        title: 'خطأ في الصلاحيات',
        message: 'ليس لديك صلاحية لإعادة تعيين التقارير',
        type: 'error',
      });
      return;
    }

    setIsResetting(true);
    
    try {
      // Clear all report-related localStorage data
      localStorage.removeItem('coffee_orders');
      localStorage.removeItem('coffee_expenses');
      localStorage.removeItem('coffee_attendance');
      
      // Reset stats to zero
      setStats({
        totalSales: 0,
        orderCount: 0,
        productsSold: 0,
        newCustomers: 0,
      });
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('reports-reset'));
      window.dispatchEvent(new Event('dashboard-refresh'));
      
      addNotification({
        title: 'تم تصفير التقارير بنجاح',
        message: 'تم تصفير جميع البيانات بنجاح',
        type: 'success',
      });
      setShowResetConfirm(false);
    } catch (error) {
      console.error('Error resetting reports:', error);
      addNotification({
        title: 'خطأ',
        message: 'حدث خطأ أثناء تصفير التقارير',
        type: 'error',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">التقارير والتحليلات</h2>
        <div className="flex gap-2">
          {isAdmin && (
            <button 
              onClick={() => setShowResetConfirm(true)}
              disabled={isResetting}
              className="btn-danger flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <RefreshCw size={20} />
              )}
              <span>إعادة تعيين</span>
            </button>
          )}
          <button className="btn-primary flex items-center gap-2">
            <Download size={20} />
            <span>تصدير</span>
          </button>
        </div>
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
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSales)}</p>
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
              <p className="text-2xl font-bold text-white">{stats.orderCount.toLocaleString('ar-EG')}</p>
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
              <p className="text-2xl font-bold text-white">{stats.productsSold.toLocaleString('ar-EG')}</p>
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
              <p className="text-2xl font-bold text-white">{stats.newCustomers.toLocaleString('ar-EG')}</p>
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
              {stats.orderCount === 0 && (
                <p className="text-sm text-gray-500 mt-2">لا توجد بيانات</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">أكثر المنتجات مبيعاً</h3>
          <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
              <p>رسم بياني للمنتجات</p>
              {stats.productsSold === 0 && (
                <p className="text-sm text-gray-500 mt-2">لا توجد بيانات</p>
              )}
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

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">تأكيد تصفير التقارير</h3>
                  <p className="text-gray-400">هل أنت متأكد من تصفير جميع التقارير؟</p>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                <p className="text-yellow-400 text-sm">
                  سيتم حذف: الطلبات، المصروفات، سجلات الحضور
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  لن يتم حذف: المنتجات، العملاء، الموردين، الموظفين
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowResetConfirm(false)} 
                  className="btn-secondary flex-1"
                  disabled={isResetting}
                >
                  إلغاء
                </button>
                <button 
                  onClick={handleResetReports} 
                  disabled={isResetting}
                  className="btn-danger flex-1 flex items-center justify-center gap-2"
                >
                  {isResetting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  تصفير
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
