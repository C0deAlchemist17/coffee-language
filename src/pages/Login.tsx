import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Coffee, Lock, User } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import { User as UserType } from '../types';

const VALID_USERS: Array<UserType & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'المدير العام',
    email: 'admin@coffeelanguage.com',
    phone: '0501234567',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    username: 'cashier',
    password: 'cashier123',
    name: 'أحمد محمد',
    email: 'cashier@coffeelanguage.com',
    phone: '0501111111',
    role: 'CASHIER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    username: 'employee',
    password: 'employee123',
    name: 'محمد علي',
    email: 'employee@coffeelanguage.com',
    phone: '0502222222',
    role: 'EMPLOYEE',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = VALID_USERS.find(
        (u) => u.username === username && u.password === password && u.isActive
      );

      if (!user) {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        addNotification({
          title: 'خطأ في تسجيل الدخول',
          message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
          type: 'error',
        });
        return;
      }

      const { password: _, ...userWithoutPassword } = user;
      login(userWithoutPassword);
      addNotification({
        title: 'تم تسجيل الدخول بنجاح',
        message: `مرحباً بك يا ${user.name}`,
        type: 'success',
      });
      navigate('/');
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-coffee-950 to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-coffee-600 mb-4">
              <Coffee size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white font-cair">لغة القهوة</h1>
            <p className="text-gray-400 mt-2">نظام إدارة المقاهي</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field w-full pr-12"
                  placeholder="أدخل اسم المستخدم"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full pr-12"
                  placeholder="أدخل كلمة المرور"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
