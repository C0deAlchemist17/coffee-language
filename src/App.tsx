import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
// Remove Prisma initialization from renderer - it's Node-only
// import { initializeDatabase } from './utils/prisma';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Tables from './pages/Tables';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Roles from './pages/Roles';
import Reports from './pages/Reports';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import Backup from './pages/Backup';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('App component mounting...');
    
    const initializeApp = async () => {
      try {
        console.log('Starting app initialization...');
        
        // CRITICAL: Don't initialize Prisma in renderer process
        // Prisma is Node-only and will crash in browser
        // Database initialization should happen in main process via IPC
        
        // Set up Electron-specific features
        if (window.electronAPI) {
          console.log('Electron API detected, setting up features...');
          
          try {
            // Handle app updates
            window.electronAPI.onAppUpdateAvailable(() => {
              console.log('Update available');
            });

            window.electronAPI.onAppUpdateDownloaded(() => {
              console.log('Update downloaded');
            });

            // Get app info
            const appInfo = await window.electronAPI.getSystemInfo();
            console.log('App Info:', appInfo);
          } catch (electronError) {
            console.warn('Electron features setup failed:', electronError);
          }
        } else {
          console.log('Running in browser mode (no Electron API)');
        }
        
        console.log('App initialization completed successfully');
      } catch (error) {
        console.error('App initialization error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Add global error handler
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setError(event.error?.message || 'Unknown error occurred');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(event.reason?.message || 'Promise rejection occurred');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    initializeApp();
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center" dir="rtl">
        <div className="text-center text-white p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">خطأ في التطبيق</h2>
          <p className="text-lg mb-4">Application Error</p>
          <div className="bg-white/20 p-4 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            إعادة المحاولة / Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center" dir="rtl">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-light">Coffee Language POS</h2>
          <p className="text-sm opacity-75 mt-2">جاري التحميل...</p>
          <p className="text-xs opacity-50 mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Layout />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="pos" element={<POS />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="tables" element={<Tables />} />
            <Route path="customers" element={<Customers />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="roles" element={<Roles />} />
            <Route path="reports" element={<Reports />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="settings" element={<Settings />} />
            <Route path="backup" element={<Backup />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
