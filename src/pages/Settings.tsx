import React from 'react';
import { Settings as SettingsIcon, Printer, Database, Bell, Globe, Palette, Shield } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">الإعدادات</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Printer className="text-coffee-400" size={24} />
            <h3 className="text-lg font-bold text-white">إعدادات الطابعة</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">الطابعة الافتراضية</label>
              <select className="input-field w-full">
                <option>طابعة حرارية 1</option>
                <option>طابعة حرارية 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">حجم الورق</label>
              <select className="input-field w-full">
                <option>80mm</option>
                <option>58mm</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-coffee-400" size={24} />
            <h3 className="text-lg font-bold text-white">إعدادات قاعدة البيانات</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">مسار قاعدة البيانات</label>
              <input type="text" className="input-field w-full" value="C:/CoffeeLanguage/database.db" readOnly />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">النسخ الاحتياطي التلقائي</label>
              <select className="input-field w-full">
                <option>يومي</option>
                <option>أسبوعي</option>
                <option>شهري</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-coffee-400" size={24} />
            <h3 className="text-lg font-bold text-white">الإشعارات</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">إشعارات المخزون المنخفض</span>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">إشعارات الطلبات الجديدة</span>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">إشعارات نهاية الوردية</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-coffee-400" size={24} />
            <h3 className="text-lg font-bold text-white">اللغة والمنطقة</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">اللغة</label>
              <select className="input-field w-full">
                <option>العربية</option>
                <option>English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">العملة</label>
              <select className="input-field w-full" defaultValue="EGP">
                <option value="EGP">جنيه مصري (EGP)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-coffee-400" size={24} />
            <h3 className="text-lg font-bold text-white">المظهر</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">السمة</label>
              <select className="input-field w-full">
                <option>داكن</option>
                <option>فاتح</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-coffee-400" size={24} />
            <h3 className="text-lg font-bold text-white">الأمان</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">تغيير كلمة المرور</label>
              <input type="password" className="input-field w-full" placeholder="كلمة المرور الحالية" />
              <input type="password" className="input-field w-full mt-2" placeholder="كلمة المرور الجديدة" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
