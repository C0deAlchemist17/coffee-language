import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123', // In production, this should be hashed
      name: 'مدير النظام',
      email: 'admin@coffeelanguage.com',
      phone: '0500000000',
      role: 'ADMIN',
      isActive: true,
    },
  });

  // Create categories
  const coffeeCategory = await prisma.category.create({
    data: {
      name: 'Coffee',
      nameAr: 'قهوة',
      description: 'مشروبات القهوة المختلفة',
      color: '#8B4513',
      icon: 'coffee',
      sortOrder: 1,
    },
  });

  const teaCategory = await prisma.category.create({
    data: {
      name: 'Tea',
      nameAr: 'شاي',
      description: 'مشروبات الشاي المختلفة',
      color: '#228B22',
      icon: 'coffee',
      sortOrder: 2,
    },
  });

  const dessertsCategory = await prisma.category.create({
    data: {
      name: 'Desserts',
      nameAr: 'حلويات',
      description: 'الحلويات والكيك',
      color: '#FF6B6B',
      icon: 'cake',
      sortOrder: 3,
    },
  });

  const bakeryCategory = await prisma.category.create({
    data: {
      name: 'Bakery',
      nameAr: 'مخبوزات',
      description: 'المخبوزات الطازجة',
      color: '#D4A574',
      icon: 'bread',
      sortOrder: 4,
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Espresso',
        nameAr: 'إسبريسو',
        barcode: '001',
        description: 'قهوة إسبريسو قوية',
        categoryId: coffeeCategory.id,
        price: 15,
        cost: 5,
        stock: 100,
        minStock: 10,
        isActive: true,
      },
      {
        name: 'Cappuccino',
        nameAr: 'كابتشينو',
        barcode: '002',
        description: 'كابتشينو إيطالي',
        categoryId: coffeeCategory.id,
        price: 18,
        cost: 6,
        stock: 80,
        minStock: 10,
        isActive: true,
      },
      {
        name: 'Latte',
        nameAr: 'لاتيه',
        barcode: '003',
        description: 'لاتيه مع الحليب',
        categoryId: coffeeCategory.id,
        price: 20,
        cost: 7,
        stock: 60,
        minStock: 10,
        isActive: true,
      },
      {
        name: 'Americano',
        nameAr: 'أمريكانو',
        barcode: '004',
        description: 'قهوة أمريكانو',
        categoryId: coffeeCategory.id,
        price: 14,
        cost: 5,
        stock: 90,
        minStock: 10,
        isActive: true,
      },
      {
        name: 'Mocha',
        nameAr: 'موكا',
        barcode: '005',
        description: 'موكا بالشوكولاتة',
        categoryId: coffeeCategory.id,
        price: 22,
        cost: 8,
        stock: 50,
        minStock: 10,
        isActive: true,
      },
      {
        name: 'Green Tea',
        nameAr: 'شاي أخضر',
        barcode: '006',
        description: 'شاي أخضر ياباني',
        categoryId: teaCategory.id,
        price: 12,
        cost: 4,
        stock: 100,
        minStock: 20,
        isActive: true,
      },
      {
        name: 'Red Tea',
        nameAr: 'شاي أحمر',
        barcode: '007',
        description: 'شاي أحمر جنوب أفريقي',
        categoryId: teaCategory.id,
        price: 12,
        cost: 4,
        stock: 100,
        minStock: 20,
        isActive: true,
      },
      {
        name: 'Cheesecake',
        nameAr: 'تشيز كيك',
        barcode: '008',
        description: 'تشيز كيك كلاسيك',
        categoryId: dessertsCategory.id,
        price: 25,
        cost: 10,
        stock: 30,
        minStock: 5,
        isActive: true,
      },
      {
        name: 'Tiramisu',
        nameAr: 'تيراميسو',
        barcode: '009',
        description: 'تيراميسو إيطالي',
        categoryId: dessertsCategory.id,
        price: 28,
        cost: 12,
        stock: 25,
        minStock: 5,
        isActive: true,
      },
      {
        name: 'Croissant',
        nameAr: 'كرواسون',
        barcode: '010',
        description: 'كرواسون زبدة',
        categoryId: bakeryCategory.id,
        price: 15,
        cost: 6,
        stock: 40,
        minStock: 10,
        isActive: true,
      },
      {
        name: 'Donut',
        nameAr: 'دونات',
        barcode: '011',
        description: 'دونات glazed',
        categoryId: bakeryCategory.id,
        price: 12,
        cost: 5,
        stock: 50,
        minStock: 10,
        isActive: true,
      },
      {
        name: 'Muffin',
        nameAr: 'مافن',
        barcode: '012',
        description: 'مافن شوكولاتة',
        categoryId: bakeryCategory.id,
        price: 14,
        cost: 6,
        stock: 35,
        minStock: 10,
        isActive: true,
      },
    ],
  });

  // Create tables
  for (let i = 1; i <= 10; i++) {
    await prisma.table.create({
      data: {
        number: i,
        name: `طاولة ${i}`,
        capacity: i % 3 === 0 ? 6 : 4,
        isActive: true,
      },
    });
  }

  // Create customers
  await prisma.customer.createMany({
    data: [
      {
        name: 'أحمد محمد',
        phone: '0501234567',
        email: 'ahmed@email.com',
        points: 150,
        totalSpent: 1250,
      },
      {
        name: 'سارة علي',
        phone: '0559876543',
        email: 'sara@email.com',
        points: 230,
        totalSpent: 2100,
      },
      {
        name: 'خالد يوسف',
        phone: '0541122334',
        email: 'khaled@email.com',
        points: 85,
        totalSpent: 850,
      },
    ],
  });

  // Create suppliers
  await prisma.supplier.createMany({
    data: [
      {
        name: 'موردي القهوة',
        phone: '0112345678',
        email: 'coffee@supplier.com',
        address: 'الرياض',
      },
      {
        name: 'شركة الألبان',
        phone: '0123456789',
        email: 'dairy@company.com',
        address: 'جدة',
      },
    ],
  });

  // Create settings
  await prisma.settings.createMany({
    data: [
      { key: 'store_name', value: 'Coffee Language', description: 'اسم المتجر' },
      { key: 'tax_rate', value: '15', description: 'نسبة الضريبة' },
      { key: 'currency', value: 'EGP', description: 'العملة' },
      { key: 'receipt_header', value: 'Coffee Language - فاتورة', description: 'رأس الفاتورة' },
      { key: 'receipt_footer', value: 'شكراً لزيارتكم', description: 'ذيل الفاتورة' },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
