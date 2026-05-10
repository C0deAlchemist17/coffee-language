import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Circle, X, Save, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

const Tables: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  
  const [tables, setTables] = useState<Table[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    number: 1,
    name: '',
    capacity: 4,
    status: 'AVAILABLE' as 'AVAILABLE' | 'OCCUPIED' | 'RESERVED',
  });

  useEffect(() => {
    try {
      const savedTables = localStorage.getItem('coffee_tables');
      if (savedTables) {
        setTables(JSON.parse(savedTables));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading tables:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (tables.length > 0) {
        localStorage.setItem('coffee_tables', JSON.stringify(tables));
      }
    } catch (error) {
      console.error('Error saving tables:', error);
    }
  }, [tables, isLoaded]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: 'bg-green-500',
      OCCUPIED: 'bg-red-500',
      RESERVED: 'bg-yellow-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      AVAILABLE: 'متاحة',
      OCCUPIED: 'مشغولة',
      RESERVED: 'محجوزة',
    };
    return texts[status] || status;
  };

  const handleOpenModal = (table?: Table) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        number: table.number,
        name: table.name,
        capacity: table.capacity,
        status: table.status,
      });
    } else {
      setEditingTable(null);
      const nextNumber = tables.length > 0 ? Math.max(...tables.map(t => t.number)) + 1 : 1;
      setFormData({
        number: nextNumber,
        name: `طاولة ${nextNumber}`,
        capacity: 4,
        status: 'AVAILABLE',
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || formData.number <= 0) {
      addNotification({
        title: 'خطأ في البيانات',
        message: 'يرجى ملء جميع الحقول المطلوبة',
        type: 'error',
      });
      return;
    }

    if (editingTable) {
      setTables(tables.map(t => 
        t.id === editingTable.id 
          ? { ...t, ...formData }
          : t
      ));
      addNotification({
        title: 'تم التحديث',
        message: 'تم تحديث الطاولة بنجاح',
        type: 'success',
      });
    } else {
      const newTable: Table = {
        id: Date.now().toString(),
        ...formData,
      };
      setTables([...tables, newTable]);
      addNotification({
        title: 'تمت الإضافة',
        message: 'تمت إضافة الطاولة بنجاح',
        type: 'success',
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setTables(tables.filter(t => t.id !== id));
    setShowDeleteConfirm(null);
    addNotification({
      title: 'تم الحذف',
      message: 'تم حذف الطاولة بنجاح',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">الطاولات</h2>
        {isAdmin && (
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            <span>إضافة طاولة</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {tables.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Circle size={48} className="mx-auto mb-4 opacity-50" />
            <p>لا توجد طاولات بعد</p>
            {isAdmin && (
              <button 
                onClick={() => handleOpenModal()}
                className="btn-primary mt-4"
              >
                إضافة طاولة
              </button>
            )}
          </div>
        ) : (
          tables.map((table) => (
            <div key={table.id} className="card text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Circle className="w-full h-full" fill={getStatusColor(table.status)} />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                  {table.number}
                </span>
              </div>
              <h3 className="font-bold text-white mb-2">{table.name}</h3>
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-3">
                <Users size={16} />
                <span>{table.capacity} أشخاص</span>
              </div>
              <span className={`badge ${getStatusColor(table.status)}/20 text-white`}>
                {getStatusText(table.status)}
              </span>
              {isAdmin && (
                <div className="flex gap-2 mt-4 justify-center">
                  <button 
                    onClick={() => handleOpenModal(table)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(table.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
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
                  {editingTable ? 'تعديل طاولة' : 'إضافة طاولة جديدة'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">رقم الطاولة *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 1 })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">اسم الطاولة *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل اسم الطاولة"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">السعة (أشخاص) *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="input-field w-full"
                  >
                    <option value="AVAILABLE">متاحة</option>
                    <option value="OCCUPIED">مشغولة</option>
                    <option value="RESERVED">محجوزة</option>
                  </select>
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
                  <p className="text-gray-400">هل أنت متأكد من حذف هذه الطاولة؟</p>
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

export default Tables;
