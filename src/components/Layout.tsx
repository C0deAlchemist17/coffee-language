import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import NotificationPanel from './NotificationPanel';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Layers, 
  Receipt, 
  Table, 
  Users, 
  Truck, 
  Warehouse, 
  DollarSign, 
  UserCog, 
  Clock,
  Shield,
  BarChart3,
  FileText,
  Settings,
  Database,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/pos', label: 'نقطة البيع', icon: ShoppingCart },
  { path: '/products', label: 'المنتجات', icon: Package },
  { path: '/categories', label: 'الفئات', icon: Layers },
  { path: '/orders', label: 'الطلبات', icon: Receipt },
  { path: '/tables', label: 'الطاولات', icon: Table },
  { path: '/customers', label: 'العملاء', icon: Users },
  { path: '/suppliers', label: 'الموردين', icon: Truck },
  { path: '/inventory', label: 'المخزون', icon: Warehouse },
  { path: '/expenses', label: 'المصروفات', icon: DollarSign },
  { path: '/employees', label: 'الموظفين', icon: UserCog },
  { path: '/attendance', label: 'الحضور', icon: Clock },
  { path: '/roles', label: 'الصلاحيات', icon: Shield },
  { path: '/reports', label: 'التقارير', icon: BarChart3 },
  { path: '/invoices', label: 'الفواتير', icon: FileText },
  { path: '/settings', label: 'الإعدادات', icon: Settings },
  { path: '/backup', label: 'النسخ الاحتياطي', icon: Database },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { notifications, markAllAsRead } = useNotificationStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-72 glass-dark border-l border-white/10 flex flex-col"
          >
            <div className="p-6 border-b border-white/10">
              <h1 className="text-2xl font-bold text-coffee-400 font-cairo">
                لغة القهوة
              </h1>
              <p className="text-sm text-gray-400 mt-1">نظام إدارة المقاهي</p>
            </div>

            <nav className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`sidebar-item w-full ${
                      isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10">
              <div className="glass rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400">المستخدم الحالي</p>
                <p className="font-medium text-white">{user?.name}</p>
                <p className="text-xs text-coffee-400">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="sidebar-item sidebar-item-inactive w-full text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-dark border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-xl font-bold text-white font-cairo">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'لوحة التحكم'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                if (notificationsOpen) markAllAsRead();
              }}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <Outlet />
        </main>
      </div>

      {/* Notifications Panel */}
      <NotificationPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
};

export default Layout;
