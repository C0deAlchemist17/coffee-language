import React from 'react';
import { Plus, Search, Edit, Trash2, UserCog, Mail, Phone, Shield } from 'lucide-react';

const Employees: React.FC = () => {
  const employees: Array<{id: string; name: string; username: string; email: string; phone: string; role: string; status: string}> = [];

  const getRoleText = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: 'مدير',
      MANAGER: 'مدير',
      CASHIER: 'كاشير',
      KITCHEN: 'مطبخ',
      EMPLOYEE: 'موظف',
    };
    return roles[role] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">الموظفين</h2>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>إضافة موظف</span>
        </button>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ابحث عن موظف..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
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
            </div>

            <div className="flex gap-2">
              <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                <Edit size={18} />
                <span>تعديل</span>
              </button>
              <button className="btn-danger flex items-center justify-center gap-2 px-4">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
