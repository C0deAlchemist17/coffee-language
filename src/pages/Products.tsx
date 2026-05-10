import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package, X, Save, AlertTriangle, Coffee, CupSoda, Snowflake, Leaf, Sparkles, GlassWater, Beer } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { menuCategories, menuProducts, seedMenuData } from '../data/menuData';
import InlineEdit from '../components/InlineEdit';

interface Product {
  id: string;
  name: string;
  nameAr: string;
  categoryId: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  description: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  nameAr: string;
  color: string;
}

const Products: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    categoryId: '',
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 10,
    description: '',
    isActive: true,
  });

  useEffect(() => {
    try {
      // Seed menu data if empty
      seedMenuData();
      
      const savedProducts = localStorage.getItem('coffee_products');
      const savedCategories = localStorage.getItem('coffee_categories');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        setProducts(parsed);
      }
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        setCategories(parsed);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (products.length > 0) {
        localStorage.setItem('coffee_products', JSON.stringify(products));
      }
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('coffee_categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }, [categories, isLoaded]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nameAr.includes(searchTerm) || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.nameAr || 'غير محدد';
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        nameAr: product.nameAr,
        categoryId: product.categoryId,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        minStock: product.minStock,
        description: product.description,
        isActive: product.isActive,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        nameAr: '',
        categoryId: categories[0]?.id || '',
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 10,
        description: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nameAr || !formData.categoryId) {
      addNotification({
        title: 'خطأ في البيانات',
        message: 'يرجى ملء جميع الحقول المطلوبة',
        type: 'error',
      });
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, name: formData.name || formData.nameAr }
          : p
      ));
      addNotification({
        title: 'تم التحديث',
        message: 'تم تحديث المنتج بنجاح',
        type: 'success',
      });
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        name: formData.name || formData.nameAr,
      };
      setProducts([...products, newProduct]);
      addNotification({
        title: 'تمت الإضافة',
        message: 'تمت إضافة المنتج بنجاح',
        type: 'success',
      });
    }
    setShowModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    addNotification({
      title: 'تم الحذف',
      message: 'تم حذف المنتج بنجاح',
      type: 'success',
    });
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, price: newPrice } : p
    );
    setProducts(updatedProducts);
    addNotification({
      title: 'تم التحديث',
      message: 'تم تحديث السعر بنجاح',
      type: 'success',
    });
  };

  const updateProductCost = (id: string, newCost: number) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, cost: newCost } : p
    );
    setProducts(updatedProducts);
    addNotification({
      title: 'تم التحديث',
      message: 'تم تحديث التكلفة بنجاح',
      type: 'success',
    });
  };

  const updateProductStock = (id: string, newStock: number) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, stock: newStock } : p
    );
    setProducts(updatedProducts);
    addNotification({
      title: 'تم التحديث',
      message: 'تم تحديث المخزون بنجاح',
      type: 'success',
    });
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">المنتجات</h2>
        <div className="glass rounded-xl p-8 text-center">
          <Package size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400">لا تملك صلاحية إدارة المنتجات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">المنتجات</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>إضافة منتج</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="input-field w-full pr-12"
            />
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select-field w-full"
          >
            <option value="all">كل الفئات</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass rounded-xl overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">لا توجد منتجات</p>
          </div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead className="bg-white/5">
              <tr>
                <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">المنتج</th>
                <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">الفئة</th>
                <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">السعر</th>
                <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">التكلفة</th>
                <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">المخزون</th>
                <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">الحالة</th>
                <th className="text-right p-4 text-gray-400 font-medium whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="table-row">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-coffee-600 flex items-center justify-center">
                        <Package size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.nameAr}</p>
                        <p className="text-sm text-gray-400">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{getCategoryName(product.categoryId)}</td>
                  <td className="p-4">
                    <InlineEdit
                      value={product.price}
                      onChange={(newPrice) => updateProductPrice(product.id, Number(newPrice))}
                      type="number"
                      className="text-coffee-400 font-medium"
                      disabled={!isAdmin}
                    />
                  </td>
                  <td className="p-4">
                    <InlineEdit
                      value={product.cost}
                      onChange={(newCost) => updateProductCost(product.id, Number(newCost))}
                      type="number"
                      className="text-gray-300"
                      disabled={!isAdmin}
                    />
                  </td>
                  <td className="p-4">
                    <InlineEdit
                      value={product.stock}
                      onChange={(newStock) => updateProductStock(product.id, Number(newStock))}
                      type="number"
                      className={`badge ${product.stock < product.minStock ? 'badge-danger' : 'badge-success'}`}
                      disabled={!isAdmin}
                    />
                  </td>
                  <td className="p-4">
                    <span className={`badge ${product.isActive ? 'badge-success' : 'badge-warning'}`}>
                      {product.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(product.id)}
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
              className="glass rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
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
                    placeholder="أدخل اسم المنتج"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الفئة *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="select-field w-full"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">السعر</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="input-field w-full"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">التكلفة</label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                      className="input-field w-full"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">المخزون</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="input-field w-full"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">الحد الأدنى</label>
                    <input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                      className="input-field w-full"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الوصف</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field w-full"
                    rows={2}
                    placeholder="وصف المنتج..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="isActive" className="text-gray-300">منشط</label>
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
                  <p className="text-gray-400">هل أنت متأكد من حذف هذا المنتج؟</p>
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
                  onClick={() => handleDeleteProduct(showDeleteConfirm)} 
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

export default Products;
