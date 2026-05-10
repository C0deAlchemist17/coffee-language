export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN' | 'EMPLOYEE';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  barcode?: string;
  description?: string;
  categoryId: string;
  category: Category;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  image?: string;
  isActive: boolean;
  hasVariants: boolean;
  variants?: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  name: string;
  nameAr: string;
  barcode?: string;
  description?: string;
  categoryId: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  image?: string;
  isActive?: boolean;
  hasVariants?: boolean;
}

export interface CategoryInput {
  name: string;
  nameAr: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  points: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: number;
  userId: string;
  user: User;
  customerId?: string;
  customer?: Customer;
  tableId?: string;
  table?: Table;
  type: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paid: number;
  change: number;
  notes?: string;
  isHold: boolean;
  items: OrderItem[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  productVariantId?: string;
  productVariant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  method: 'CASH' | 'VISA' | 'WALLET' | 'MIXED';
  amount: number;
  reference?: string;
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Shift {
  id: string;
  userId: string;
  user: User;
  openingBalance: number;
  closingBalance?: number;
  openingTime: Date;
  closingTime?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface Attendance {
  id: string;
  userId: string;
  user: User;
  checkIn: Date;
  checkOut?: Date;
  duration?: number;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}
