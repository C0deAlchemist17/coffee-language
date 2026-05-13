import React from 'react';
import { Shield, Check, X } from 'lucide-react';

const Roles: React.FC = () => {
  const roles = [
    {
      id: '1',
      name: 'مدير',
      nameEn: 'ADMIN',
      permissions: ['all'],
      users: 2,
    },
    {
      id: '3',
      name: 'كاشير',
      nameEn: 'CASHIER',
      permissions: ['pos', 'orders'],
      users: 5,
    },
    {
      id: '4',
      name: 'موظف',
      nameEn: 'EMPLOYEE',
      permissions: ['pos'],
      users: 4,
    },
  ];

  const allPermissions = [
    { key: 'dashboard', label: 'لوحة التحكم' },
    { key: 'pos', label: 'نقطة البيع' },
    { key: 'products', label: 'المنتجات' },
    { key: 'categories', label: 'الفئات' },
    { key: 'orders', label: 'الطلبات' },
    { key: 'customers', label: 'العملاء' },
    { key: 'inventory', label: 'المخزون' },
    { key: 'reports', label: 'التقارير' },
    { key: 'employees', label: 'الموظفين' },
    { key: 'settings', label: 'الإعدادات' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">الصلاحيات والأدوار</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-coffee-600 flex items-center justify-center">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{role.name}</h3>
                  <p className="text-sm text-gray-400">{role.nameEn}</p>
                </div>
              </div>
              <span className="badge badge-info">{role.users} مستخدم</span>
            </div>

            <div className="space-y-2">
              {allPermissions.map((perm) => {
                const hasPermission = role.permissions.includes('all') || role.permissions.includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      hasPermission ? 'bg-green-500/10' : 'bg-white/5'
                    }`}
                  >
                    <span className="text-sm text-gray-300">{perm.label}</span>
                    {hasPermission ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <X size={16} className="text-gray-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roles;
