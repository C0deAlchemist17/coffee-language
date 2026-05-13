import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'اسم المنتج مطلوب'),
  nameAr: z.string().min(1, 'الاسم العربي مطلوب'),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, 'الفئة مطلوبة'),
  price: z.number().min(0, 'السعر يجب أن يكون أكبر من أو يساوي صفر'),
  cost: z.number().min(0, 'التكلفة يجب أن تكون أكبر من أو تساوي صفر'),
  stock: z.number().min(0, 'الكمية يجب أن تكون أكبر من أو تساوي صفر'),
  minStock: z.number().min(0, 'الحد الأدنى يجب أن يكون أكبر من أو يساوي صفر'),
  description: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'اسم الفئة مطلوب'),
  nameAr: z.string().min(1, 'الاسم العربي مطلوب'),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const customerSchema = z.object({
  name: z.string().min(1, 'اسم العميل مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  address: z.string().optional(),
});

export const supplierSchema = z.object({
  name: z.string().min(1, 'اسم المورد مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  address: z.string().optional(),
});

export const tableSchema = z.object({
  number: z.number().min(1, 'رقم الطاولة مطلوب'),
  name: z.string().min(1, 'اسم الطاولة مطلوب'),
  capacity: z.number().min(1, 'السعة يجب أن تكون أكبر من صفر'),
});

export const expenseSchema = z.object({
  category: z.string().min(1, 'الفئة مطلوبة'),
  description: z.string().min(1, 'الوصف مطلوب'),
  amount: z.number().min(0, 'المبلغ يجب أن يكون أكبر من أو يساوي صفر'),
  date: z.date(),
  notes: z.string().optional(),
});

export const userSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  name: z.string().min(1, 'الاسم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'CASHIER', 'EMPLOYEE']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type SupplierInput = z.infer<typeof supplierSchema>;
export type TableInput = z.infer<typeof tableSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
export type UserInput = z.infer<typeof userSchema>;
