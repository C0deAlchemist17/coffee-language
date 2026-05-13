import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Clock, Users, Calendar, Edit, Trash2, Plus, X, Save, AlertTriangle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { safeParseDate, parseAttendanceDates } from '../utils/dateUtils';
import { formatCurrency, formatDateTime } from '../utils/format';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: 'حاضر' | 'متأخر' | 'غائب';
  notes: string;
}

const Attendance: React.FC = () => {
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: 'حاضر' as 'حاضر' | 'متأخر' | 'غائب',
    notes: '',
  });

  const statuses = ['حاضر', 'متأخر', 'غائب'];

  useEffect(() => {
    try {
      const savedAttendance = localStorage.getItem('coffee_attendance');
      if (savedAttendance) {
        const parsed = JSON.parse(savedAttendance);
        setAttendance(parseAttendanceDates(parsed));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading attendance:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('coffee_attendance', JSON.stringify(attendance));
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  }, [attendance, isLoaded]);

  const handleCheckIn = () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = attendance.find(
      a => a.employeeId === user.id && new Date(a.date).toISOString().split('T')[0] === today
    );

    if (existingRecord) {
      addNotification({
        title: 'تم التسجيل مسبقاً',
        message: 'لقد قمت بتسجيل الحضور بالفعل اليوم',
        type: 'warning',
      });
      return;
    }

    const now = new Date();
    const hour = now.getHours();
    const status: 'حاضر' | 'متأخر' | 'غائب' = hour >= 9 ? 'متأخر' : 'حاضر';

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      employeeId: user.id,
      employeeName: user.name || 'Unknown',
      date: new Date(today),
      checkIn: now,
      checkOut: null,
      status,
      notes: '',
    };

    setAttendance([...attendance, newRecord]);
    addNotification({
      title: 'تم تسجيل الحضور',
      message: `تم تسجيل حضورك بنجاح - الحالة: ${status}`,
      type: 'success',
    });
  };

  const handleCheckOut = () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const recordIndex = attendance.findIndex(
      a => a.employeeId === user.id && new Date(a.date).toISOString().split('T')[0] === today
    );

    if (recordIndex === -1) {
      addNotification({
        title: 'خطأ',
        message: 'لم يتم تسجيل الحضور بعد',
        type: 'error',
      });
      return;
    }

    const updatedAttendance = [...attendance];
    updatedAttendance[recordIndex] = {
      ...updatedAttendance[recordIndex],
      checkOut: new Date(),
    };

    setAttendance(updatedAttendance);
    addNotification({
      title: 'تم تسجيل الخروج',
      message: 'تم تسجيل خروجك بنجاح',
      type: 'success',
    });
  };

  const handleOpenModal = (record?: AttendanceRecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        date: new Date(record.date).toISOString().split('T')[0],
        checkIn: record.checkIn ? new Date(record.checkIn).toISOString().slice(11, 16) : '',
        checkOut: record.checkOut ? new Date(record.checkOut).toISOString().slice(11, 16) : '',
        status: record.status,
        notes: record.notes,
      });
    } else {
      setEditingRecord(null);
      setFormData({
        employeeId: '',
        employeeName: '',
        date: new Date().toISOString().split('T')[0],
        checkIn: '',
        checkOut: '',
        status: 'حاضر',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.employeeName || !formData.date) {
      addNotification({
        title: 'خطأ في البيانات',
        message: 'يرجى ملء جميع الحقول المطلوبة',
        type: 'error',
      });
      return;
    }

    const checkInTime = formData.checkIn ? new Date(`${formData.date}T${formData.checkIn}`) : null;
    const checkOutTime = formData.checkOut ? new Date(`${formData.date}T${formData.checkOut}`) : null;

    if (editingRecord) {
      setAttendance(attendance.map(a => 
        a.id === editingRecord.id 
          ? { ...a, ...formData, checkIn: checkInTime, checkOut: checkOutTime, date: new Date(formData.date) }
          : a
      ));
      addNotification({
        title: 'تم التحديث',
        message: 'تم تحديث السجل بنجاح',
        type: 'success',
      });
    } else {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        employeeId: formData.employeeId || Date.now().toString(),
        employeeName: formData.employeeName,
        date: new Date(formData.date),
        checkIn: checkInTime,
        checkOut: checkOutTime,
        status: formData.status,
        notes: formData.notes,
      };
      setAttendance([...attendance, newRecord]);
      addNotification({
        title: 'تمت الإضافة',
        message: 'تمت إضافة السجل بنجاح',
        type: 'success',
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setAttendance(attendance.filter(a => a.id !== id));
    setShowDeleteConfirm(null);
    addNotification({
      title: 'تم الحذف',
      message: 'تم حذف السجل بنجاح',
      type: 'success',
    });
  };

  const calculateDuration = (checkIn: Date | null, checkOut: Date | null): number | null => {
    if (!checkIn || !checkOut) return null;
    const parsedCheckIn = safeParseDate(checkIn);
    const parsedCheckOut = safeParseDate(checkOut);
    if (!parsedCheckIn || !parsedCheckOut) return null;
    const diffMs = parsedCheckOut.getTime() - parsedCheckIn.getTime();
    return Math.round(diffMs / (1000 * 60 * 60) * 100) / 100;
  };

  const todayStats = {
    present: attendance.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      const parsedDate = safeParseDate(a.date);
      return parsedDate && parsedDate.toISOString().split('T')[0] === today && a.status === 'حاضر';
    }).length,
    late: attendance.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      const parsedDate = safeParseDate(a.date);
      return parsedDate && parsedDate.toISOString().split('T')[0] === today && a.status === 'متأخر';
    }).length,
    absent: attendance.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      const parsedDate = safeParseDate(a.date);
      return parsedDate && parsedDate.toISOString().split('T')[0] === today && a.status === 'غائب';
    }).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">سجل الحضور</h2>
        <div className="flex gap-2">
          {user && (
            <>
              <button 
                onClick={handleCheckIn}
                className="btn-success flex items-center gap-2"
              >
                <LogIn size={20} />
                <span>تسجيل دخول</span>
              </button>
              <button 
                onClick={handleCheckOut}
                className="btn-danger flex items-center gap-2"
              >
                <LogOut size={20} />
                <span>تسجيل خروج</span>
              </button>
            </>
          )}
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            <span>إضافة سجل</span>
          </button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-green-500/20 text-green-400">
              <User size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">حاضرون اليوم</p>
              <p className="text-2xl font-bold text-white">{todayStats.present}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-yellow-500/20 text-yellow-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">متأخرون اليوم</p>
              <p className="text-2xl font-bold text-white">{todayStats.late}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-red-500/20 text-red-400">
              <X size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">غائبون اليوم</p>
              <p className="text-2xl font-bold text-white">{todayStats.absent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="glass rounded-xl overflow-hidden">
        {attendance.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Clock size={48} className="mx-auto mb-4 opacity-50" />
            <p>لا توجد سجلات حضور بعد</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-right p-4 text-gray-400 font-medium">الموظف</th>
                <th className="text-right p-4 text-gray-400 font-medium">التاريخ</th>
                <th className="text-right p-4 text-gray-400 font-medium">تسجيل الدخول</th>
                <th className="text-right p-4 text-gray-400 font-medium">تسجيل الخروج</th>
                <th className="text-right p-4 text-gray-400 font-medium">المدة</th>
                <th className="text-right p-4 text-gray-400 font-medium">الحالة</th>
                <th className="text-right p-4 text-gray-400 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => {
                const duration = calculateDuration(record.checkIn, record.checkOut);
                return (
                  <tr key={record.id} className="table-row">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                        <span className="font-medium text-white">{record.employeeName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{formatDateTime(record.date)}</td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <LogIn size={16} className="text-green-400" />
                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {record.checkOut ? (
                        <div className="flex items-center gap-2">
                          <LogOut size={16} className="text-red-400" />
                          {new Date(record.checkOut).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-300">
                      {duration ? `${duration} ساعة` : '-'}
                    </td>
                    <td className="p-4">
                      <span className={`badge ${
                        record.status === 'حاضر' ? 'badge-success' : 
                        record.status === 'متأخر' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenModal(record)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(record.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                  {editingRecord ? 'تعديل سجل' : 'إضافة سجل جديد'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">اسم الموظف *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل اسم الموظف"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">التاريخ *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">وقت الدخول</label>
                  <input
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">وقت الخروج</label>
                  <input
                    type="time"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
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
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
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
                  <p className="text-gray-400">هل أنت متأكد من حذف هذا السجل؟</p>
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

export default Attendance;
