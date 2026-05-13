export function safeParseDate(value: unknown): Date | null {
  if (!value) return null;
  
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  if (typeof value === 'number') {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  return null;
}

export function isValidDate(value: unknown): boolean {
  return safeParseDate(value) !== null;
}

export function safeGetTime(value: unknown): number {
  const date = safeParseDate(value);
  return date ? date.getTime() : 0;
}

export function parseAttendanceDates(records: any[]): any[] {
  return records.map(record => ({
    ...record,
    date: safeParseDate(record.date) || new Date(),
    checkIn: safeParseDate(record.checkIn),
    checkOut: safeParseDate(record.checkOut),
  }));
}

export function parseOrderDates(orders: any[]): any[] {
  return orders.map(order => ({
    ...order,
    createdAt: safeParseDate(order.createdAt) || new Date(),
    updatedAt: safeParseDate(order.updatedAt),
  }));
}

export function parseExpenseDates(expenses: any[]): any[] {
  return expenses.map(expense => ({
    ...expense,
    date: safeParseDate(expense.date) || new Date(),
  }));
}

export function parseInvoiceDates(invoices: any[]): any[] {
  return invoices.map(invoice => ({
    ...invoice,
    date: safeParseDate(invoice.date) || new Date(),
    dueDate: safeParseDate(invoice.dueDate),
  }));
}
