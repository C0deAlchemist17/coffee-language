import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Layers, X, Save, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

interface Category {
  id: string;
  name: string;
  nameAr: string;
  color: string;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Coffee', nameAr: 'قهوة', color: '#8B4513' },
  { id: '2', name: 'Tea', nameAr: 'شاي', color: '#228B22' },
  { id: '3', name: 'Desserts', nameAr: 'حلويات', color: '#FF6B6B' },
  { id: '4', name: 'Bakery', nameAr: 'مخبوزات', color: '#D4A574' },
];

const colorOptions = [
  '#8B4513', '#228B22', '#FF6B6B', '#D4A574', '#4169E1', '#9932CC', 
  '#FF8C00', '#20B2AA', '#FF1493', '#32CD32', '#1E90FF', '#FF6347'
];

const Categories: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    color: '#8B4513',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('coffee_categories');
      if (saved) {
        setCategories(JSON.parse(saved));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading categories:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('coffee_categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }, [categories, isLoaded]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        nameAr: category.nameAr,
        color: category.color,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        nameAr: '',
        color: '#8B4513',
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nameAr) {
      addNotification({
        title: 'خطأ في البيانات',
        message: 'يرجى إدخال اسم الفئة',
        type: 'error',
      });
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, ...formData, name: formData.name || formData.nameAr }
          : c
      ));
      addNotification({
        title: 'تم التحديث',
        message: 'تم تحديث الفئة بنجاح',
        type: 'success',
      });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        name: formData.name || formData.nameAr,
      };
      setCategories([...categories, newCategory]);
      addNotification({
        title: 'تمت الإضافة',
        message: 'تمت إضافة الفئة بنجاح',
        type: 'success',
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setShowDeleteConfirm(null);
    addNotification({
      title: 'تم الحذف',
      message: 'تم حذف الفئة بنجاح',
      type: 'success',
    });
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">الفئات</h2>
        <div className="glass rounded-xl p-8 text-center">
          <Layers size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400">لا تملك صلاحية إدارة الفئات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">الفئات</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>إضافة فئة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <Layers size={24} style={{ color: category.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{category.nameAr}</h3>
                  <p className="text-sm text-gray-400">{category.name}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleOpenModal(category)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                <span>تعديل</span>
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(category.id)}
                className="btn-danger px-4"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
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
                  {editingCategory ? 'تعديل فئة' : 'إضافة فئة جديدة'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الاسم بالعربية *</label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل اسم الفئة"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">اللون</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-lg transition-transform ${
                          formData.color === color ? 'ring-2 ring-white scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
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
                  <p className="text-gray-400">هل أنت متأكد من حذف هذه الفئة؟</p>
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

export default Categories;
