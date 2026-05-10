export const ARABIC_NUMBERS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export const ORDER_TYPES = {
  DINE_IN: 'جلسة في المطعم',
  TAKEAWAY: 'توصيل',
  DELIVERY: 'طلب من الخارج',
} as const;

export const ORDER_STATUS = {
  PENDING: 'في الانتظار',
  IN_PROGRESS: 'قيد التحضير',
  READY: 'جاهز',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
  REFUNDED: 'مسترد',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'نقد',
  VISA: 'فيزا',
  WALLET: 'محفظة',
  MIXED: 'مختلط',
} as const;

export const ROLES = ['ADMIN', 'MANAGER', 'CASHIER', 'KITCHEN', 'EMPLOYEE'];

export const ITEM_STATUS = {
  PENDING: 'في الانتظار',
  PREPARING: 'قيد التحضير',
  READY: 'جاهز',
  SERVED: 'مقدم',
  CANCELLED: 'ملغي',
} as const;

export const MOVEMENT_TYPES = {
  PURCHASE: 'شراء',
  SALE: 'بيع',
  RETURN: 'إرجاع',
  WASTE: 'هدر',
  ADJUSTMENT: 'تعديل',
  TRANSFER: 'نقل',
} as const;

export const EXPENSE_CATEGORIES = [
  'إيجار',
  'رواتب',
  'مرافق',
  'صيانة',
  'تسويق',
  'أخرى',
];

export const REPORT_PERIODS = [
  'اليوم',
  'الأسبوع',
  'الشهر',
  'السنة',
];

export const DEFAULT_TAX_RATE = 0.15;
