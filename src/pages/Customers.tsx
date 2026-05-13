import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin, X, Save, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  totalSpent: number;
  address: string;
  createdAt: Date;
}

const Customers: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const isAdmin = user?.role === 'ADMIN';
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    try {
      const savedCustomers = localStorage.getItem('coffee_customers');
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading customers:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (customers.length > 0) {
        localStorage.setItem('coffee_customers', JSON.stringify(customers));
      }
    } catch (error) {
      console.error('Error saving customers:', error);
    }
  }, [customers, isLoaded]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.includes(searchTerm) || customer.phone.includes(searchTerm)
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      addNotification({
        title: 'خطأ في البيانات',
        message: 'يرجى ملء جميع الحقول المطلوبة',
        type: 'error',
      });
      return;
    }

    if (editingCustomer) {
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id 
          ? { ...c, ...formData }
          : c
      ));
      addNotification({
        title: 'تم التحديث',
        message: 'تم تحديث العميل بنجاح',
        type: 'success',
      });
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...formData,
        points: 0,
        totalSpent: 0,
        createdAt: new Date(),
      };
      setCustomers([...customers, newCustomer]);
      addNotification({
        title: 'تمت الإضافة',
        message: 'تمت إضافة العميل بنجاح',
        type: 'success',
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    setShowDeleteConfirm(null);
    
    // Force immediate save to localStorage
    try {
      const updatedCustomers = customers.filter(c => c.id !== id);
      localStorage.setItem('coffee_customers', JSON.stringify(updatedCustomers));
      addNotification({
        title: 'تم الحذف',
        message: 'تم حذف العميل بنجاح',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      addNotification({
        title: 'خطأ',
        message: 'حدث خطأ أثناء حذف العميل',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">العملاء</h2>
        {isAdmin && (
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            <span>إضافة عميل</span>
          </button>
        )}
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن عميل..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-coffee-600 flex items-center justify-center">
                <Users size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{customer.name}</h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone size={14} />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">النقاط</span>
                <span className="text-gold-400 font-bold">{customer.points}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">إجمالي المشتريات</span>
                <span className="text-coffee-400 font-bold">{formatCurrency(customer.totalSpent)}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(customer)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  <span>تعديل</span>
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(customer.id)}
                  className="btn-danger flex items-center justify-center gap-2 px-4"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingCustomer ? 'تعديل عميل' : 'إضافة عميل جديد'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الاسم *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل اسم العميل"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الهاتف *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل العنوان"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  إلغاء
                </button>
                <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save size={20} />
                  <span>حفظ</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
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
                  <h3 className="text-xl font-bold text-white">تأكيد الحذف</h3>
                  <p className="text-gray-400">هل أنت متأكد من حذف هذا العميل؟</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(null)} 
                  className="btn-secondary flex-1"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => handleDelete(showDeleteConfirm)} 
                  className="btn-danger flex-1"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;
