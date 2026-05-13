import React, { useState, useEffect } from 'react';
import { Search, FileText, Printer, Download, Eye, Plus, Edit, Trash2, X, Save, AlertTriangle, Check, ChevronDown } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/format';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Invoice {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: 'PAID' | 'PENDING' | 'CANCELLED' | 'UNPAID';
  createdAt: Date;
  items: InvoiceItem[];
  notes: string;
  cashier?: string;
}

const Invoices: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    customer: '',
    status: 'UNPAID' as 'PAID' | 'UNPAID' | 'PENDING' | 'CANCELLED',
    items: [{ productId: '', productName: '', quantity: 1, price: 0 }] as InvoiceItem[],
    notes: '',
  });

  const statuses = [
    { value: 'PAID', label: 'مدفوعة', className: 'badge-success' },
    { value: 'UNPAID', label: 'غير مدفوعة', className: 'badge-danger' },
    { value: 'PENDING', label: 'معلقة', className: 'badge-warning' },
    { value: 'CANCELLED', label: 'ملغية', className: 'badge-info' },
  ];

  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem('coffee_invoices');
      if (savedInvoices) {
        const parsed = JSON.parse(savedInvoices);
        setInvoices(parsed.map((inv: any) => ({
          ...inv,
          createdAt: new Date(inv.createdAt),
        })));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('coffee_invoices', JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoices:', error);
    }
  }, [invoices, isLoaded]);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj || { label: status, className: 'badge-info' };
  };

  const handleOpenModal = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        customer: invoice.customer,
        status: invoice.status || 'UNPAID',
        items: invoice.items,
        notes: invoice.notes,
      });
    } else {
      setEditingInvoice(null);
      setFormData({
        customer: '',
        status: 'UNPAID',
        items: [{ productId: '', productName: '', quantity: 1, price: 0 }],
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setShowViewModal(true);
  };

  const handleStatusChange = (invoiceId: string, newStatus: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: newStatus as Invoice['status'] }
        : inv
    ));
    setEditingStatus(null);
    addNotification({
      title: 'تم التحديث',
      message: 'تم تحديث حالة الفاتورة بنجاح',
      type: 'success',
    });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', productName: '', quantity: 1, price: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSave = () => {
    if (!formData.customer || formData.items.length === 0) {
      addNotification({
        title: 'خطأ في البيانات',
        message: 'يرجى ملء جميع الحقول المطلوبة',
        type: 'error',
      });
      return;
    }

    const total = calculateTotal();

    if (editingInvoice) {
      setInvoices(invoices.map(i => 
        i.id === editingInvoice.id 
          ? { ...i, ...formData, total }
          : i
      ));
      addNotification({
        title: 'تم التحديث',
        message: 'تم تحديث الفاتورة بنجاح',
        type: 'success',
      });
    } else {
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        number: `INV-${String(invoices.length + 1).padStart(4, '0')}`,
        customer: formData.customer,
        total,
        status: formData.status,
        createdAt: new Date(),
        items: formData.items,
        notes: formData.notes,
        cashier: user?.name || 'Unknown',
      };
      setInvoices([...invoices, newInvoice]);
      addNotification({
        title: 'تمت الإضافة',
        message: 'تمت إضافة الفاتورة بنجاح',
        type: 'success',
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id));
    setShowDeleteConfirm(null);
    addNotification({
      title: 'تم الحذف',
      message: 'تم حذف الفاتورة بنجاح',
      type: 'success',
    });
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>فاتورة ${invoice.number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 24px; margin-bottom: 5px; }
            .header p { font-size: 12px; color: #666; }
            .info { margin-bottom: 20px; }
            .info p { margin-bottom: 5px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 12px; }
            th { background: #f5f5f5; }
            .total { font-size: 18px; font-weight: bold; text-align: left; }
            .status { padding: 5px 10px; border-radius: 4px; font-size: 12px; }
            .status.paid { background: #d4edda; color: #155724; }
            .status.pending { background: #fff3cd; color: #856404; }
            .status.cancelled { background: #f8d7da; color: #721c24; }
            .status.unpaid { background: #f8d7da; color: #721c24; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>☕ Coffee Language</h1>
            <p>فاتورة ضريبية مبسطة</p>
          </div>
          <div class="info">
            <p><strong>رقم الفاتورة:</strong> ${invoice.number}</p>
            <p><strong>العميل:</strong> ${invoice.customer}</p>
            <p><strong>التاريخ:</strong> ${formatDateTime(invoice.createdAt)}</p>
            <p><strong>الكاشير:</strong> ${invoice.cashier || 'غير محدد'}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.price)}</td>
                  <td>${formatCurrency(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p class="total">الإجمالي: ${formatCurrency(invoice.total)}</p>
          <p style="margin-top: 10px;">
            <span class="status ${invoice.status.toLowerCase()}">${getStatusBadge(invoice.status).label}</span>
          </p>
          ${invoice.notes ? `<p style="margin-top: 20px; font-size: 12px; color: #666;">ملاحظات: ${invoice.notes}</p>` : ''}
          <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">شكراً لتعاملكم مع Coffee Language</p>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">الفواتير</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <FileText size={20} />
          <span>إنشاء فاتورة</span>
        </button>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن فاتورة..."
            className="input-field w-full pr-12"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>لا توجد فواتير بعد</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-right p-4 text-gray-400 font-medium">رقم الفاتورة</th>
                <th className="text-right p-4 text-gray-400 font-medium">العميل</th>
                <th className="text-right p-4 text-gray-400 font-medium">المبلغ</th>
                <th className="text-right p-4 text-gray-400 font-medium">الحالة</th>
                <th className="text-right p-4 text-gray-400 font-medium">التاريخ</th>
                <th className="text-right p-4 text-gray-400 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const statusBadge = getStatusBadge(invoice.status);
                return (
                  <tr key={invoice.id} className="table-row">
                    <td className="p-4 font-medium text-white">{invoice.number}</td>
                    <td className="p-4 text-gray-300">{invoice.customer}</td>
                    <td className="p-4 text-coffee-400 font-medium">{formatCurrency(invoice.total)}</td>
                    <td className="p-4">
                      <div className="relative">
                        {editingStatus === invoice.id ? (
                          <select
                            value={invoice.status}
                            onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                            onBlur={() => setEditingStatus(null)}
                            autoFocus
                            className="input-field py-1 px-2 text-sm"
                          >
                            {statuses.map(s => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditingStatus(invoice.id)}
                            className={`badge ${statusBadge.className} cursor-pointer hover:opacity-80`}
                          >
                            {statusBadge.label}
                            <ChevronDown size={12} className="mr-1 inline" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{formatDateTime(invoice.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                          title="عرض الفاتورة"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handlePrintInvoice(invoice)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-green-400"
                          title="طباعة الفاتورة"
                        >
                          <Printer size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(invoice)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-yellow-400"
                          title="تعديل الفاتورة"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(invoice.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                          title="حذف الفاتورة"
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

      {/* View Invoice Modal */}
      <AnimatePresence>
        {showViewModal && viewingInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">تفاصيل الفاتورة</h3>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">رقم الفاتورة</p>
                    <p className="text-white font-medium">{viewingInvoice.number}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">التاريخ</p>
                    <p className="text-white font-medium">{formatDateTime(viewingInvoice.createdAt)}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">العميل</p>
                    <p className="text-white font-medium">{viewingInvoice.customer}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">الكاشير</p>
                    <p className="text-white font-medium">{viewingInvoice.cashier || 'غير محدد'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">المنتجات</p>
                  <div className="bg-white/5 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="text-right p-3 text-gray-400 text-sm">المنتج</th>
                          <th className="text-right p-3 text-gray-400 text-sm">الكمية</th>
                          <th className="text-right p-3 text-gray-400 text-sm">السعر</th>
                          <th className="text-right p-3 text-gray-400 text-sm">الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingInvoice.items.map((item, idx) => (
                          <tr key={idx} className="border-t border-white/5">
                            <td className="p-3 text-white">{item.productName}</td>
                            <td className="p-3 text-white text-center">{item.quantity}</td>
                            <td className="p-3 text-white">{formatCurrency(item.price)}</td>
                            <td className="p-3 text-white">{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">الإجمالي:</span>
                  <span className="text-2xl font-bold text-white">{formatCurrency(viewingInvoice.total)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-gray-400">الحالة:</span>
                  <span className={`badge ${getStatusBadge(viewingInvoice.status).className}`}>
                    {getStatusBadge(viewingInvoice.status).label}
                  </span>
                </div>

                {viewingInvoice.notes && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">ملاحظات</p>
                    <p className="text-white bg-white/5 p-3 rounded-lg">{viewingInvoice.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowViewModal(false)} className="btn-secondary flex-1">
                  إغلاق
                </button>
                <button 
                  onClick={() => handlePrintInvoice(viewingInvoice)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Printer size={20} />
                  <span>طباعة</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingInvoice ? 'تعديل فاتورة' : 'إنشاء فاتورة جديدة'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">اسم العميل *</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="input-field w-full"
                    placeholder="أدخل اسم العميل"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">حالة الفاتورة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="input-field w-full"
                  >
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-400">المنتجات</label>
                    <button 
                      onClick={handleAddItem}
                      className="btn-sm btn-primary flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>إضافة منتج</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                          className="input-field flex-1"
                          placeholder="اسم المنتج"
                        />
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="input-field w-20"
                          placeholder="الكمية"
                        />
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          className="input-field w-24"
                          placeholder="السعر"
                        />
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">الإجمالي:</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(calculateTotal())}</span>
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
                  <p className="text-gray-400">هل أنت متأكد من حذف هذه الفاتورة؟</p>
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

export default Invoices;
