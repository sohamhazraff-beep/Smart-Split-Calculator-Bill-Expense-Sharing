export const AVATAR_COLORS = [
  '#4f46e5', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#14b8a6', // Teal
  '#f97316'  // Orange
];

export const getRandomAvatarColor = (index = 0) => {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

export const DEMO_PRESETS = [
  {
    id: 'dinner',
    title: 'Dinner at Bistro 9',
    category: 'Dining',
    subtotal: 135.50,
    currency: 'USD',
    discount: { type: 'percent', value: 10 },
    tax: { type: 'percent', value: 8.5 },
    tip: { type: 'percent', value: 18 },
    splitMode: 'equal',
    payerMode: 'single',
    participants: [
      { id: 'p1', name: 'Alex M.', avatarColor: '#4f46e5', customAmount: 42, percentage: 25, shares: 1, included: true },
      { id: 'p2', name: 'Sarah K.', avatarColor: '#06b6d4', customAmount: 33, percentage: 25, shares: 1, included: true },
      { id: 'p3', name: 'Jordan T.', avatarColor: '#10b981', customAmount: 38, percentage: 25, shares: 1, included: true },
      { id: 'p4', name: 'Elena R.', avatarColor: '#f59e0b', customAmount: 22.5, percentage: 25, shares: 1, included: true }
    ],
    singlePayerId: 'p1'
  },
  {
    id: 'roadtrip',
    title: 'Weekend Mountain Trip',
    category: 'Travel',
    subtotal: 260.00,
    currency: 'USD',
    discount: { type: 'fixed', value: 20 },
    tax: { type: 'percent', value: 7 },
    tip: { type: 'fixed', value: 15 },
    splitMode: 'custom',
    payerMode: 'multiple',
    participants: [
      { id: 'p1', name: 'Liam', avatarColor: '#4f46e5', customAmount: 95, percentage: 35, shares: 2, paidAmount: 180, included: true },
      { id: 'p2', name: 'Emma', avatarColor: '#ec4899', customAmount: 65, percentage: 25, shares: 1.5, paidAmount: 100, included: true },
      { id: 'p3', name: 'Noah', avatarColor: '#8b5cf6', customAmount: 50, percentage: 20, shares: 1, paidAmount: 0, included: true },
      { id: 'p4', name: 'Chloe', avatarColor: '#14b8a6', customAmount: 50, percentage: 20, shares: 1, paidAmount: 0, included: true }
    ],
    singlePayerId: 'p1'
  }
];

export const CATEGORIES = [
  'Dining',
  'Groceries',
  'Travel & Gas',
  'Drinks & Party',
  'Entertainment',
  'Utilities & Rent',
  'Shopping',
  'Other'
];
