import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserCog, Mail, Phone, Shield, X, Save, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Employee {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
  shift: string;
  status: string;
  createdAt: Date;
}

const Employees: React.FC = () => {
  const { addNotification } = useNotificationStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'CASHIER',
    salary: '',
    shift: '',
  });

  const roles = ['ADMIN', 'CASHIER', 'EMPLOYEE'];
  const shifts = ['صباحي', 'مسائي', 'ليلي', 'مزدوج'];

  const getRoleText = (role: string) => {
    const roleMap: Record<string, string> = {
      ADMIN: 'مدير',
      CASHIER: 'كاشير',
      EMPLOYEE: 'موظف',
    };
    return roleMap[role] || role;
  };

  useEffect(() => {
    try {
      const savedEmployees = localStorage.getItem('coffee_employees');
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading employees:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('coffee_employees', JSON.stringify(employees));
    } catch (error) {
      console.error('Error saving employees:', error);
    }
  }, [employees, isLoaded]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.includes(searchTerm) || 
    employee.username.includes(searchTerm)
  );

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        username: employee.username,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        salary: employee.salary.toString(),
        shift: employee.shift,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        role: 'CASHIER',
        salary: '',
        shift: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.username || !formData.phone) {
      addNotification({
        title: 'خطأ في البيانات',
        message: 'يرجى ملء جميع الحقول المطلوبة',
        type: 'error',
      });
      return;
    }

    if (editingEmployee) {
      setEmployees(employees.map(e => 
        e.id === editingEmployee.id 
          ? { ...e, ...formData, salary: parseFloat(formData.salary) }
          : e
      ));
      addNotification({
        title: 'تم التحديث',
        message: 'تم تحديث الموظف بنجاح',
        type: 'success',
      });
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        salary: parseFloat(formData.salary),
        status: 'نشط',
        createdAt: new Date(),
      };
      setEmployees([...employees, newEmployee]);
      addNotification({
        title: 'تمت الإضافة',
        message: 'تمت إضافة الموظف بنجاح',
        type: 'success',
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
    setShowDeleteConfirm(null);
    addNotification({
      title: 'تم الحذف',
      message: 'تم حذف الموظف بنجاح',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">الموظفين</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>إضافة موظف</span>
        </button>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن موظف..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-coffee-600 flex items-center justify-center">
                <UserCog size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{employee.name}</h3>
                <p className="text-sm text-gray-400">@{employee.username}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone size={16} />
                <span className="text-sm">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Shield size={16} />
                <span className="text-sm">{getRoleText(employee.role)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-sm">الراتب:</span>
                <span className="text-sm font-medium text-green-400">{employee.salary} ج.م</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-sm">الوردية:</span>
                <span className="text-sm">{employee.shift || '-'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleOpenModal(employee)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                <span>تعديل</span>
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(employee.id)}
                className="btn-danger flex items-center justify-center gap-2 px-4"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="glass rounded-xl p-12 text-center text-gray-400">
          <UserCog size={48} className="mx-auto mb-4 opacity-50" />
          <p>لا يوجد موظفين بعد</p>
        </div>
      )}

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
                  {editingEmployee ? 'تعديل موظف' : 'إضافة موظف جديد'}
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
                    placeholder="أدخل اسم الموظف"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">اسم المستخدم *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل اسم المستخدم"
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
                  <label className="block text-sm text-gray-400 mb-2">الدور</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input-field w-full"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{getRoleText(role)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الراتب</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل الراتب"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الوردية</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="">اختر الوردية</option>
                    {shifts.map(shift => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
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
                  <p className="text-gray-400">هل أنت متأكد من حذف هذا الموظف؟</p>
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

export default Employees;
