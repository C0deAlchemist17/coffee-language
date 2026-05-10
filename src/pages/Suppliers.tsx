import React from 'react';
import { Plus, Search, Edit, Trash2, Truck, Phone, Mail, MapPin } from 'lucide-react';

const Suppliers: React.FC = () => {
  const suppliers: Array<{id: string; name: string; phone: string; email: string; address: string}> = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">الموردين</h2>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>إضافة مورد</span>
        </button>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ابحث عن مورد..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-coffee-600 flex items-center justify-center">
                <Truck size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{supplier.name}</h3>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Phone size={16} />
                <span className="text-sm">{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span className="text-sm">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} />
                <span className="text-sm">{supplier.address}</span>
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

export default Suppliers;
