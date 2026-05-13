import React, { useState, useEffect } from 'react';
import { Plus, Search, DollarSign, TrendingUp, Trash2, Edit, X, Save, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';
import { useNotificationStore } from '../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  employee: string;
  date: Date;
  notes: string;
}

const Expenses: React.FC = () => {
  const { addNotification } = useNotificationStore();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    employee: '',
    notes: '',
  });

  const categories = ['رواتب', 'إيجار', 'مرافق', 'تجهيزات', 'صيانة', 'أخرى'];

  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem('coffee_expenses');
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('coffee_expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }, [expenses, isLoaded]);

  const filteredExpenses = expenses.filter(expense =>
    expense.title.includes(searchTerm) || 
    expense.category.includes(searchTerm)
  );

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonth = expenses
    .filter(e => {
      const now = new Date();
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        employee: expense.employee,
        notes: expense.notes,
      });
    } else {
      setEditingExpense(null);
      setFormData({
        title: '',
        amount: '',
        category: '',
        employee: '',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.amount || !formData.category) {
      addNotification({
        title: 'خطأ في البيانات',
        message: 'يرجى ملء جميع الحقول المطلوبة',
        type: 'error',
      });
      return;
    }

    if (editingExpense) {
      setExpenses(expenses.map(e => 
        e.id === editingExpense.id 
          ? { ...e, ...formData, amount: parseFloat(formData.amount) }
          : e
      ));
      addNotification({
        title: 'تم التحديث',
        message: 'تم تحديث المصروف بنجاح',
        type: 'success',
      });
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        employee: formData.employee,
        date: new Date(),
        notes: formData.notes,
      };
      setExpenses([...expenses, newExpense]);
      addNotification({
        title: 'تمت الإضافة',
        message: 'تمت إضافة المصروف بنجاح',
        type: 'success',
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    setShowDeleteConfirm(null);
    addNotification({
      title: 'تم الحذف',
      message: 'تم حذف المصروف بنجاح',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">المصروفات</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>إضافة مصروف</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-red-500/20 text-red-400">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-green-500/20 text-green-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">هذا الشهر</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(thisMonth)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-blue-500/20 text-blue-400">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">عدد المصروفات</p>
              <p className="text-2xl font-bold text-white">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن مصروف..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
            <p>لا توجد مصروفات بعد</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-right p-4 text-gray-400 font-medium">العنوان</th>
                <th className="text-right p-4 text-gray-400 font-medium">الفئة</th>
                <th className="text-right p-4 text-gray-400 font-medium">المبلغ</th>
                <th className="text-right p-4 text-gray-400 font-medium">الموظف</th>
                <th className="text-right p-4 text-gray-400 font-medium">التاريخ</th>
                <th className="text-right p-4 text-gray-400 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="table-row">
                  <td className="p-4 font-medium text-white">{expense.title}</td>
                  <td className="p-4">
                    <span className="badge badge-info">{expense.category}</span>
                  </td>
                  <td className="p-4 text-red-400 font-medium">{formatCurrency(expense.amount)}</td>
                  <td className="p-4 text-gray-300">{expense.employee || '-'}</td>
                  <td className="p-4 text-gray-300">{formatDate(expense.date)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(expense)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(expense.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  {editingExpense ? 'تعديل مصروف' : 'إضافة مصروف جديد'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">العنوان *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل عنوان المصروف"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">المبلغ *</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل المبلغ"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الفئة *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الموظف</label>
                  <input
                    type="text"
                    value={formData.employee}
                    onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل اسم الموظف"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">ملاحظات</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field w-full h-24"
                    placeholder="أدخل ملاحظات"
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
                  <p className="text-gray-400">هل أنت متأكد من حذف هذا المصروف؟</p>
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

export default Expenses;
