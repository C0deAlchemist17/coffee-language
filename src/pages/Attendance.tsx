import React from 'react';
import { Clock, LogOut, LogIn, User } from 'lucide-react';
import { formatDateTime } from '../utils/format';

const Attendance: React.FC = () => {
  const attendance: Array<{id: string; employee: string; checkIn: Date | null; checkOut: Date | null; duration: number | null}> = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">سجل الحضور</h2>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-right p-4 text-gray-400 font-medium">الموظف</th>
              <th className="text-right p-4 text-gray-400 font-medium">تسجيل الدخول</th>
              <th className="text-right p-4 text-gray-400 font-medium">تسجيل الخروج</th>
              <th className="text-right p-4 text-gray-400 font-medium">المدة</th>
              <th className="text-right p-4 text-gray-400 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id} className="table-row">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center">
                      <User size={18} className="text-white" />
                    </div>
                    <span className="font-medium text-white">{record.employee}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <LogIn size={16} className="text-green-400" />
                    {record.checkIn ? formatDateTime(record.checkIn) : '-'}
                  </div>
                </td>
                <td className="p-4 text-gray-300">
                  {record.checkOut ? (
                    <div className="flex items-center gap-2">
                      <LogOut size={16} className="text-red-400" />
                      {formatDateTime(record.checkOut)}
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="p-4 text-gray-300">
                  {record.duration ? `${record.duration} ساعات` : '-'}
                </td>
                <td className="p-4">
                  <span className={`badge ${record.checkOut ? 'badge-success' : 'badge-warning'}`}>
                    {record.checkOut ? 'منتهي' : 'نشط'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
