// Coffee Language - Complete Café Menu Data
// All prices in EGP

export interface MenuCategory {
  id: string;
  name: string;
  nameAr: string;
  color: string;
}

export interface MenuProduct {
  id: string;
  name: string;
  nameAr: string;
  categoryId: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  description: string;
  descriptionAr: string;
  image: string;
  isActive: boolean;
}

export const menuCategories: MenuCategory[] = [
  { id: 'espresso', name: 'Espresso Corner', nameAr: 'ركن الإسبرسو', color: '#8B4513' },
  { id: 'hot', name: 'Hot Drinks', nameAr: 'مشروبات ساخنة', color: '#B8860B' },
  { id: 'ice', name: 'Ice Coffee', nameAr: 'قهوة مثلجة', color: '#4682B4' },
  { id: 'milkshake', name: 'Milkshakes', nameAr: 'ميلك شيك', color: '#FF69B4' },
  { id: 'smoothie', name: 'Smoothies', nameAr: 'سموذي', color: '#32CD32' },
  { id: 'juice', name: 'Fresh Juice', nameAr: 'عصائر طازجة', color: '#FF6347' },
  { id: 'frappe', name: 'Frappé & Special', nameAr: 'فرابي ومشروبات خاصة', color: '#9370DB' },
  { id: 'soda', name: 'Soda & Extras', nameAr: 'صودا وإضافات', color: '#00CED1' },
  { id: 'addon', name: 'Add-ons', nameAr: 'إضافات', color: '#FFD700' },
  { id: 'turkish', name: 'Turkish Coffee', nameAr: 'قهوة تركية', color: '#654321' },
];

export const menuProducts: MenuProduct[] = [
  // Espresso Corner - ركن الإسبرسو
  { id: 'esp-001', name: 'Espresso Single', nameAr: 'إسبرسو單', categoryId: 'espresso', price: 25, cost: 5, stock: 100, minStock: 20, description: 'Single shot espresso', descriptionAr: 'جرعة إسبرسو واحدة', image: '/images/menu/espresso-single.jpg', isActive: true },
  { id: 'esp-002', name: 'Espresso Double', nameAr: 'إسبرسو مزدوج', categoryId: 'espresso', price: 35, cost: 8, stock: 100, minStock: 20, description: 'Double shot espresso', descriptionAr: 'جرعتا إسبرسو', image: '/images/menu/espresso-double.jpg', isActive: true },
  { id: 'esp-003', name: 'Americano', nameAr: 'أمريكانو', categoryId: 'espresso', price: 40, cost: 10, stock: 100, minStock: 20, description: 'Espresso with hot water', descriptionAr: 'إسبرسو مع ماء ساخن', image: '/images/menu/americano.jpg', isActive: true },
  { id: 'esp-004', name: 'Cappuccino', nameAr: 'كابتشينو', categoryId: 'espresso', price: 50, cost: 12, stock: 100, minStock: 20, description: 'Espresso with steamed milk foam', descriptionAr: 'إسبرسو مع رغوة حليب', image: '/images/menu/cappuccino.jpg', isActive: true },
  { id: 'esp-005', name: 'Latte', nameAr: 'لاتيه', categoryId: 'espresso', price: 55, cost: 14, stock: 100, minStock: 20, description: 'Espresso with steamed milk', descriptionAr: 'إسبرسو مع حليب ساخن', image: '/images/menu/latte.jpg', isActive: true },
  { id: 'esp-006', name: 'Mocha', nameAr: 'موكا', categoryId: 'espresso', price: 60, cost: 15, stock: 100, minStock: 20, description: 'Espresso with chocolate and milk', descriptionAr: 'إسبرسو مع شوكولاتة وحليب', image: '/images/menu/mocha.jpg', isActive: true },
  { id: 'esp-007', name: 'Flat White', nameAr: 'فلات وايت', categoryId: 'espresso', price: 55, cost: 14, stock: 100, minStock: 20, description: 'Espresso with microfoam milk', descriptionAr: 'إسبرسو مع حليب رغوي', image: '/images/menu/flat-white.jpg', isActive: true },
  { id: 'esp-008', name: 'Macchiato', nameAr: 'ماكياتو', categoryId: 'espresso', price: 45, cost: 11, stock: 100, minStock: 20, description: 'Espresso with a dash of milk', descriptionAr: 'إسبرسو مع قليل من الحليب', image: '/images/menu/macchiato.jpg', isActive: true },

  // Hot Drinks - مشروبات ساخنة
  { id: 'hot-001', name: 'Turkish Coffee Small', nameAr: 'قهوة تركية صغيرة', categoryId: 'hot', price: 20, cost: 4, stock: 100, minStock: 20, description: 'Small Turkish coffee', descriptionAr: 'قهوة تركية صغيرة', image: '/images/menu/turkish-small.jpg', isActive: true },
  { id: 'hot-002', name: 'Turkish Coffee Medium', nameAr: 'قهوة تركية متوسطة', categoryId: 'hot', price: 30, cost: 6, stock: 100, minStock: 20, description: 'Medium Turkish coffee', descriptionAr: 'قهوة تركية متوسطة', image: '/images/menu/turkish-medium.jpg', isActive: true },
  { id: 'hot-003', name: 'Turkish Coffee Large', nameAr: 'قهوة تركية كبيرة', categoryId: 'hot', price: 40, cost: 8, stock: 100, minStock: 20, description: 'Large Turkish coffee', descriptionAr: 'قهوة تركية كبيرة', image: '/images/menu/turkish-large.jpg', isActive: true },
  { id: 'hot-004', name: 'Arabic Coffee', nameAr: 'قهوة عربية', categoryId: 'hot', price: 35, cost: 7, stock: 100, minStock: 20, description: 'Traditional Arabic coffee', descriptionAr: 'قهوة عربية تقليدية', image: '/images/menu/arabic-coffee.jpg', isActive: true },
  { id: 'hot-005', name: 'Hot Chocolate', nameAr: 'شوكولاتة ساخنة', categoryId: 'hot', price: 45, cost: 10, stock: 100, minStock: 20, description: 'Rich hot chocolate', descriptionAr: 'شوكولاتة ساخنة غنية', image: '/images/menu/hot-chocolate.jpg', isActive: true },
  { id: 'hot-006', name: 'Matcha Latte', nameAr: 'ماتشا لاتيه', categoryId: 'hot', price: 65, cost: 18, stock: 100, minStock: 15, description: 'Matcha green tea latte', descriptionAr: 'لاتيه شاي матча الأخضر', image: '/images/menu/matcha-latte.jpg', isActive: true },
  { id: 'hot-007', name: 'Chai Latte', nameAr: 'شاي لاتيه', categoryId: 'hot', price: 45, cost: 10, stock: 100, minStock: 20, description: 'Spiced chai tea latte', descriptionAr: 'لاتيه شاي بالتوابل', image: '/images/menu/chai-latte.jpg', isActive: true },
  { id: 'hot-008', name: 'Honey Vanilla Latte', nameAr: 'لاتيه عسل وفانيليا', categoryId: 'hot', price: 60, cost: 15, stock: 100, minStock: 15, description: 'Latte with honey and vanilla', descriptionAr: 'لاتيه مع عسل وفانيليا', image: '/images/menu/honey-vanilla-latte.jpg', isActive: true },

  // Ice Coffee - قهوة مثلجة
  { id: 'ice-001', name: 'Iced Americano', nameAr: 'أمريكانو مثلج', categoryId: 'ice', price: 45, cost: 12, stock: 100, minStock: 20, description: 'Iced espresso with water', descriptionAr: 'إسبرسو مثلج مع ماء', image: '/images/menu/iced-americano.jpg', isActive: true },
  { id: 'ice-002', name: 'Iced Latte', nameAr: 'لاتيه مثلج', categoryId: 'ice', price: 55, cost: 15, stock: 100, minStock: 20, description: 'Iced espresso with milk', descriptionAr: 'إسبرسو مثلج مع حليب', image: '/images/menu/iced-latte.jpg', isActive: true },
  { id: 'ice-003', name: 'Iced Mocha', nameAr: 'موكا مثلج', categoryId: 'ice', price: 65, cost: 18, stock: 100, minStock: 20, description: 'Iced chocolate coffee', descriptionAr: 'قهوة شوكولاتة مثلجة', image: '/images/menu/iced-mocha.jpg', isActive: true },
  { id: 'ice-004', name: 'Iced Caramel Macchiato', nameAr: 'ماكياتو كراميل مثلج', categoryId: 'ice', price: 65, cost: 18, stock: 100, minStock: 15, description: 'Iced vanilla espresso with caramel', descriptionAr: 'إسبرسو فانيليا مثلج مع كراميل', image: '/images/menu/iced-caramel-macchiato.jpg', isActive: true },
  { id: 'ice-005', name: 'Iced Vanilla Latte', nameAr: 'لاتيه فانيليا مثلج', categoryId: 'ice', price: 60, cost: 16, stock: 100, minStock: 15, description: 'Iced latte with vanilla', descriptionAr: 'لاتيه مثلج مع فانيليا', image: '/images/menu/iced-vanilla-latte.jpg', isActive: true },
  { id: 'ice-006', name: 'Iced Hazelnut Latte', nameAr: 'لاتيه فول سوداني مثلج', categoryId: 'ice', price: 60, cost: 16, stock: 100, minStock: 15, description: 'Iced latte with hazelnut', descriptionAr: 'لاتيه مثلج مع فول سوداني', image: '/images/menu/iced-hazelnut-latte.jpg', isActive: true },
  { id: 'ice-007', name: 'Cold Brew', nameAr: 'كولد بريد', categoryId: 'ice', price: 55, cost: 14, stock: 100, minStock: 15, description: 'Slow brewed cold coffee', descriptionAr: 'قهوة باردة بطيئة التحضير', image: '/images/menu/cold-brew.jpg', isActive: true },
  { id: 'ice-008', name: 'Nitro Cold Brew', nameAr: 'نيترو كولد بريد', categoryId: 'ice', price: 65, cost: 18, stock: 100, minStock: 10, description: 'Nitrogen infused cold brew', descriptionAr: 'كولد بريد محقون بالنيتروجين', image: '/images/menu/nitro-cold-brew.jpg', isActive: true },

  // Milkshakes - ميلك شيك
  { id: 'milk-001', name: 'Chocolate Milkshake', nameAr: 'ميلك شيك شوكولاتة', categoryId: 'milkshake', price: 65, cost: 18, stock: 100, minStock: 15, description: 'Rich chocolate milkshake', descriptionAr: 'ميلك شيك شوكولاتة غني', image: '/images/menu/chocolate-milkshake.jpg', isActive: true },
  { id: 'milk-002', name: 'Vanilla Milkshake', nameAr: 'ميلك شيك فانيليا', categoryId: 'milkshake', price: 60, cost: 16, stock: 100, minStock: 15, description: 'Classic vanilla milkshake', descriptionAr: 'ميلك شيك فانيليا كلاسيكي', image: '/images/menu/vanilla-milkshake.jpg', isActive: true },
  { id: 'milk-003', name: 'Strawberry Milkshake', nameAr: 'ميلك شيك فراولة', categoryId: 'milkshake', price: 65, cost: 18, stock: 100, minStock: 15, description: 'Fresh strawberry milkshake', descriptionAr: 'ميلك شيك فراولة طازجة', image: '/images/menu/strawberry-milkshake.jpg', isActive: true },
  { id: 'milk-004', name: 'Oreo Milkshake', nameAr: 'ميلك شيك أوreo', categoryId: 'milkshake', price: 75, cost: 22, stock: 100, minStock: 15, description: 'Oreo cookie milkshake', descriptionAr: 'ميلك شيك بسكويت أوreo', image: '/images/menu/oreo-milkshake.jpg', isActive: true },
  { id: 'milk-005', name: 'Peanut Butter Milkshake', nameAr: 'ميلك شيك زبدة فول سوداني', categoryId: 'milkshake', price: 75, cost: 22, stock: 100, minStock: 10, description: 'Peanut butter milkshake', descriptionAr: 'ميلك شيك بزبدة الفول السوداني', image: '/images/menu/peanut-butter-milkshake.jpg', isActive: true },
  { id: 'milk-006', name: 'Caramel Milkshake', nameAr: 'ميلك شيك كراميل', categoryId: 'milkshake', price: 70, cost: 20, stock: 100, minStock: 15, description: 'Caramel milkshake', descriptionAr: 'ميلك شيك كراميل', image: '/images/menu/caramel-milkshake.jpg', isActive: true },
  { id: 'milk-007', name: 'Banana Milkshake', nameAr: 'ميلك شيك موز', categoryId: 'milkshake', price: 60, cost: 16, stock: 100, minStock: 15, description: 'Banana milkshake', descriptionAr: 'ميلك شيك موز', image: '/images/menu/banana-milkshake.jpg', isActive: true },
  { id: 'milk-008', name: 'Lotus Biscoff Milkshake', nameAr: 'ميلك شيك لوتس بيسكوف', categoryId: 'milkshake', price: 80, cost: 25, stock: 100, minStock: 10, description: 'Lotus Biscoff milkshake', descriptionAr: 'ميلك شيك بسكويت لوتس', image: '/images/menu/lotus-milkshake.jpg', isActive: true },

  // Smoothies - smoothies
  { id: 'sm-001', name: 'Green Detox Smoothie', nameAr: 'سموذي detox أخضر', categoryId: 'smoothie', price: 75, cost: 22, stock: 100, minStock: 10, description: 'Green vegetables and fruits smoothie', descriptionAr: 'سموذي الخضروات والفواكه الخضراء', image: '/images/menu/green-detox.jpg', isActive: true },
  { id: 'sm-002', name: 'Berry Blast Smoothie', nameAr: 'سموذي التوت', categoryId: 'smoothie', price: 70, cost: 20, stock: 100, minStock: 10, description: 'Mixed berries smoothie', descriptionAr: 'سموذي التوت المشكلة', image: '/images/menu/berry-blast.jpg', isActive: true },
  { id: 'sm-003', name: 'Mango Smoothie', nameAr: 'سموذي مانجو', categoryId: 'smoothie', price: 65, cost: 18, stock: 100, minStock: 15, description: 'Fresh mango smoothie', descriptionAr: 'سموذي مانجو طازج', image: '/images/menu/mango-smoothie.jpg', isActive: true },
  { id: 'sm-004', name: 'Avocado Smoothie', nameAr: 'سموذي أفوكادو', categoryId: 'smoothie', price: 75, cost: 22, stock: 100, minStock: 10, description: 'Creamy avocado smoothie', descriptionAr: 'سموذي أفوكادو كريمي', image: '/images/menu/avocado-smoothie.jpg', isActive: true },
  { id: 'sm-005', name: 'Pina Colada Smoothie', nameAr: 'سموذي بينا كولادا', categoryId: 'smoothie', price: 70, cost: 20, stock: 100, minStock: 10, description: 'Pineapple coconut smoothie', descriptionAr: 'سموذي أناناس وجوز الهند', image: '/images/menu/pina-colada.jpg', isActive: true },
  { id: 'sm-006', name: 'Protein Power Smoothie', nameAr: 'سموذي بروتين', categoryId: 'smoothie', price: 85, cost: 28, stock: 100, minStock: 10, description: 'High protein smoothie', descriptionAr: 'سموذي بروتين عالي', image: '/images/menu/protein-smoothie.jpg', isActive: true },

  // Fresh Juice - عصائر طازجة
  { id: 'juice-001', name: 'Orange Juice', nameAr: 'عصير برتقال', categoryId: 'juice', price: 40, cost: 10, stock: 100, minStock: 20, description: 'Fresh squeezed orange', descriptionAr: 'برتقال طازج معصور', image: '/images/menu/orange-juice.jpg', isActive: true },
  { id: 'juice-002', name: 'Lemonade', nameAr: 'عصير ليمون', categoryId: 'juice', price: 35, cost: 8, stock: 100, minStock: 20, description: 'Fresh lemonade', descriptionAr: 'ليمون طازج', image: '/images/menu/lemonade.jpg', isActive: true },
  { id: 'juice-003', name: 'Mango Juice', nameAr: 'عصير مانجو', categoryId: 'juice', price: 50, cost: 14, stock: 100, minStock: 15, description: 'Fresh mango juice', descriptionAr: 'مانجو طازج', image: '/images/menu/mango-juice.jpg', isActive: true },
  { id: 'juice-004', name: 'Watermelon Juice', nameAr: 'عصير بطيخ', categoryId: 'juice', price: 45, cost: 12, stock: 100, minStock: 15, description: 'Fresh watermelon', descriptionAr: 'بطيخ طازج', image: '/images/menu/watermelon-juice.jpg', isActive: true },
  { id: 'juice-005', name: 'Apple Juice', nameAr: 'عصير تفاح', categoryId: 'juice', price: 45, cost: 12, stock: 100, minStock: 15, description: 'Fresh apple juice', descriptionAr: 'تفاح طازج', image: '/images/menu/apple-juice.jpg', isActive: true },
  { id: 'juice-006', name: 'Carrot Juice', nameAr: 'عصير جزر', categoryId: 'juice', price: 45, cost: 10, stock: 100, minStock: 15, description: 'Fresh carrot juice', descriptionAr: 'جزر طازج', image: '/images/menu/carrot-juice.jpg', isActive: true },
  { id: 'juice-007', name: 'Mixed Fruit Juice', nameAr: 'عصير فواكه مشكلة', categoryId: 'juice', price: 55, cost: 16, stock: 100, minStock: 15, description: 'Mix of seasonal fruits', descriptionAr: 'خليط من الفواكه الموسمية', image: '/images/menu/mixed-fruit.jpg', isActive: true },
  { id: 'juice-008', name: 'Detox Juice', nameAr: 'عصير detox', categoryId: 'juice', price: 60, cost: 18, stock: 100, minStock: 10, description: 'Green detox juice', descriptionAr: 'عصير detox أخضر', image: '/images/menu/detox-juice.jpg', isActive: true },

  // Frappé & Special - فرابي ومشروبات خاصة
  { id: 'frap-001', name: 'Coffee Frappé', nameAr: 'فرابي قهوة', categoryId: 'frappe', price: 65, cost: 18, stock: 100, minStock: 15, description: 'Iced blended coffee', descriptionAr: 'قهوة مثلجة مخفوقة', image: '/images/menu/coffee-frappe.jpg', isActive: true },
  { id: 'frap-002', name: 'Caramel Frappé', nameAr: 'فرابي كراميل', categoryId: 'frappe', price: 70, cost: 20, stock: 100, minStock: 15, description: 'Caramel blended coffee', descriptionAr: 'قهوة كراميل مخفوقة', image: '/images/menu/caramel-frappe.jpg', isActive: true },
  { id: 'frap-003', name: 'Mocha Frappé', nameAr: 'فرابي موكا', categoryId: 'frappe', price: 70, cost: 20, stock: 100, minStock: 15, description: 'Chocolate coffee frappe', descriptionAr: 'قهوة شوكولاتة مخفوقة', image: '/images/menu/mocha-frappe.jpg', isActive: true },
  { id: 'frap-004', name: 'Vanilla Frappé', nameAr: 'فرابي فانيليا', categoryId: 'frappe', price: 65, cost: 18, stock: 100, minStock: 15, description: 'Vanilla blended coffee', descriptionAr: 'قهوة فانيليا مخفوقة', image: '/images/menu/vanilla-frappe.jpg', isActive: true },
  { id: 'frap-005', name: 'Oreo Frappé', nameAr: 'فرابي أوreo', categoryId: 'frappe', price: 80, cost: 25, stock: 100, minStock: 10, description: 'Oreo cookie frappe', descriptionAr: 'قهوة أوreo مخفوقة', image: '/images/menu/oreo-frappe.jpg', isActive: true },
  { id: 'frap-006', name: 'Java Chip Frappé', nameAr: 'فرابي جافا تشيب', categoryId: 'frappe', price: 75, cost: 22, stock: 100, minStock: 10, description: 'Chocolate chip coffee frappe', descriptionAr: 'قهوة شوكولاتة رقاقة مخفوقة', image: '/images/menu/java-chip-frappe.jpg', isActive: true },
  { id: 'frap-007', name: 'White Chocolate Frappé', nameAr: 'فرابي شوكولاتة بيضاء', categoryId: 'frappe', price: 75, cost: 22, stock: 100, minStock: 10, description: 'White chocolate frappe', descriptionAr: 'قهوة شوكولاتة بيضاء مخفوقة', image: '/images/menu/white-chocolate-frappe.jpg', isActive: true },
  { id: 'frap-008', name: 'Special House Blend', nameAr: 'مشروب البيت الخاص', categoryId: 'frappe', price: 90, cost: 30, stock: 50, minStock: 5, description: 'Special house signature drink', descriptionAr: 'مشروب التوقيع الخاص بالمنزل', image: '/images/menu/house-special.jpg', isActive: true },

  // Soda & Extras - صودا وإضافات
  { id: 'soda-001', name: 'Cola', nameAr: 'كولا', categoryId: 'soda', price: 20, cost: 5, stock: 100, minStock: 30, description: 'Coca Cola', descriptionAr: 'كوكا كولا', image: '/images/menu/cola.jpg', isActive: true },
  { id: 'soda-002', name: 'Diet Cola', nameAr: 'كولا دايت', categoryId: 'soda', price: 20, cost: 5, stock: 100, minStock: 20, description: 'Diet Coke', descriptionAr: 'كوكا كولا دايت', image: '/images/menu/diet-cola.jpg', isActive: true },
  { id: 'soda-003', name: 'Sprite', nameAr: 'سبرايت', categoryId: 'soda', price: 20, cost: 5, stock: 100, minStock: 30, description: 'Sprite', descriptionAr: 'سبرايت', image: '/images/menu/sprite.jpg', isActive: true },
  { id: 'soda-004', name: 'Fanta', nameAr: 'فانتا', categoryId: 'soda', price: 20, cost: 5, stock: 100, minStock: 30, description: 'Fanta', descriptionAr: 'فانتا', image: '/images/menu/fanta.jpg', isActive: true },
  { id: 'soda-005', name: 'Soda Water', nameAr: 'صودا', categoryId: 'soda', price: 15, cost: 3, stock: 100, minStock: 30, description: 'Plain soda water', descriptionAr: 'ماء صودا عادي', image: '/images/menu/soda-water.jpg', isActive: true },
  { id: 'soda-006', name: 'Tonic Water', nameAr: 'تونيك', categoryId: 'soda', price: 25, cost: 6, stock: 100, minStock: 20, description: 'Tonic water', descriptionAr: 'ماء تونيك', image: '/images/menu/tonic.jpg', isActive: true },
  { id: 'soda-007', name: 'Ginger Ale', nameAr: 'جنجر إيل', categoryId: 'soda', price: 25, cost: 6, stock: 100, minStock: 20, description: 'Ginger ale', descriptionAr: 'مشروب الزنجبيل', image: '/images/menu/ginger-ale.jpg', isActive: true },
  { id: 'soda-008', name: 'Energy Drink', nameAr: 'مشروب طاقة', categoryId: 'soda', price: 35, cost: 10, stock: 100, minStock: 20, description: 'Energy drink', descriptionAr: 'مشروب الطاقة', image: '/images/menu/energy-drink.jpg', isActive: true },

  // Add-ons - إضافات
  { id: 'add-001', name: 'Extra Shot', nameAr: 'جرعة إضافية', categoryId: 'addon', price: 10, cost: 2, stock: 200, minStock: 50, description: 'Extra espresso shot', descriptionAr: 'جرعة إسبرسو إضافية', image: '/images/menu/extra-shot.jpg', isActive: true },
  { id: 'add-002', name: 'Whipped Cream', nameAr: 'كريمة مخفوقة', categoryId: 'addon', price: 10, cost: 2, stock: 200, minStock: 50, description: 'Extra whipped cream', descriptionAr: 'كريمة مخفوقة إضافية', image: '/images/menu/whipped-cream.jpg', isActive: true },
  { id: 'add-003', name: 'Vanilla Syrup', nameAr: 'شراب فانيليا', categoryId: 'addon', price: 8, cost: 2, stock: 200, minStock: 50, description: 'Vanilla syrup pump', descriptionAr: 'ضخ شراب فانيليا', image: '/images/menu/vanilla-syrup.jpg', isActive: true },
  { id: 'add-004', name: 'Caramel Syrup', nameAr: 'شراب كراميل', categoryId: 'addon', price: 8, cost: 2, stock: 200, minStock: 50, description: 'Caramel syrup pump', descriptionAr: 'ضخ شراب كراميل', image: '/images/menu/caramel-syrup.jpg', isActive: true },
  { id: 'add-005', name: 'Hazelnut Syrup', nameAr: 'شراب فول سوداني', categoryId: 'addon', price: 8, cost: 2, stock: 200, minStock: 50, description: 'Hazelnut syrup pump', descriptionAr: 'ضخ شراب فول سوداني', image: '/images/menu/hazelnut-syrup.jpg', isActive: true },
  { id: 'add-006', name: 'Chocolate Sauce', nameAr: 'صوص شوكولاتة', categoryId: 'addon', price: 8, cost: 2, stock: 200, minStock: 50, description: 'Chocolate sauce drizzle', descriptionAr: 'إضافة صوص شوكولاتة', image: '/images/menu/chocolate-sauce.jpg', isActive: true },
  { id: 'add-007', name: 'Oat Milk', nameAr: 'حليب الشوفان', categoryId: 'addon', price: 12, cost: 4, stock: 100, minStock: 20, description: 'Oat milk alternative', descriptionAr: 'بديل حليب الشوفان', image: '/images/menu/oat-milk.jpg', isActive: true },
  { id: 'add-008', name: 'Almond Milk', nameAr: 'حليب اللوز', categoryId: 'addon', price: 12, cost: 4, stock: 100, minStock: 20, description: 'Almond milk alternative', descriptionAr: 'بديل حليب اللوز', image: '/images/menu/almond-milk.jpg', isActive: true },
  { id: 'add-009', name: 'Coconut Milk', nameAr: 'حليب جوز الهند', categoryId: 'addon', price: 12, cost: 4, stock: 100, minStock: 20, description: 'Coconut milk alternative', descriptionAr: 'بديل حليب جوز الهند', image: '/images/menu/coconut-milk.jpg', isActive: true },
  { id: 'add-010', name: 'Ice Cream Scoop', nameAr: 'كرة آيس كريم', categoryId: 'addon', price: 15, cost: 5, stock: 100, minStock: 20, description: 'Extra ice cream scoop', descriptionAr: 'كرة آيس كريم إضافية', image: '/images/menu/ice-cream-scoop.jpg', isActive: true },

  // Turkish Coffee - قهوة تركية
  { id: 'turk-001', name: 'Turkish Coffee - Dank', nameAr: 'قهوة تركية دانك', categoryId: 'turkish', price: 30, cost: 6, stock: 100, minStock: 20, description: 'Strong Turkish coffee', descriptionAr: 'قهوة تركية قوية', image: '/images/menu/turkish-dank.jpg', isActive: true },
  { id: 'turk-002', name: 'Turkish Coffee - Medium', nameAr: 'قهوة تركية وسط', categoryId: 'turkish', price: 25, cost: 5, stock: 100, minStock: 20, description: 'Medium strength Turkish coffee', descriptionAr: 'قهوة تركية متوسطة القوة', image: '/images/menu/turkish-medium.jpg', isActive: true },
  { id: 'turk-003', name: 'Turkish Coffee - Light', nameAr: 'قهوة تركية خفيفة', categoryId: 'turkish', price: 20, cost: 4, stock: 100, minStock: 20, description: 'Light Turkish coffee', descriptionAr: 'قهوة تركية خفيفة', image: '/images/menu/turkish-light.jpg', isActive: true },
  { id: 'turk-004', name: 'Turkish Coffee with Cardamom', nameAr: 'قهوة تركية بالهيل', categoryId: 'turkish', price: 35, cost: 8, stock: 100, minStock: 15, description: 'Turkish coffee with cardamom', descriptionAr: 'قهوة تركية مع الهيل', image: '/images/menu/turkish-cardamom.jpg', isActive: true },
  { id: 'turk-005', name: 'Turkish Coffee with Milk', nameAr: 'قهوة تركية بالحليب', categoryId: 'turkish', price: 35, cost: 8, stock: 100, minStock: 15, description: 'Turkish coffee with milk', descriptionAr: 'قهوة تركية مع الحليب', image: '/images/menu/turkish-with-milk.jpg', isActive: true },
  { id: 'turk-006', name: 'Sahlep', nameAr: 'سحلب', categoryId: 'turkish', price: 40, cost: 10, stock: 100, minStock: 15, description: 'Turkish hot milk drink', descriptionAr: 'مشروب حليب تركي ساخن', image: '/images/menu/sahlep.jpg', isActive: true },
  { id: 'turk-007', name: 'Salep', nameAr: 'سليق', categoryId: 'turkish', price: 40, cost: 10, stock: 100, minStock: 15, description: 'Oat milk Turkish drink', descriptionAr: 'مشروب شوفان تركي', image: '/images/menu/salep.jpg', isActive: true },
];

// Function to seed the database
export const seedMenuData = () => {
  // Save categories
  const savedCategories = localStorage.getItem('coffee_categories');
  if (!savedCategories) {
    localStorage.setItem('coffee_categories', JSON.stringify(menuCategories));
  }

  // Save products (avoid duplicates)
  const savedProducts = localStorage.getItem('coffee_products');
  if (!savedProducts) {
    localStorage.setItem('coffee_products', JSON.stringify(menuProducts));
  } else {
    const existingProducts = JSON.parse(savedProducts);
    const existingIds = new Set(existingProducts.map((p: MenuProduct) => p.id));
    const newProducts = menuProducts.filter((p: MenuProduct) => !existingIds.has(p.id));
    if (newProducts.length > 0) {
      localStorage.setItem('coffee_products', JSON.stringify([...existingProducts, ...newProducts]));
    }
  }
};
