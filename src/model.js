export const STORAGE_KEY = '@little-lemon/profile/v1';
export const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];
export const menu = [
  { id: '1', name: 'Greek Salad', description: 'Crisp lettuce, tomatoes, cucumber, olives and creamy feta.', price: 12.99, category: 'Starters', image: 'salad' },
  { id: '2', name: 'Bruschetta', description: 'Grilled sourdough, ripe tomatoes, fresh basil and olive oil.', price: 7.99, category: 'Starters', image: 'bruschetta' },
  { id: '3', name: 'Lemon Pasta', description: 'Linguine with lemon butter, parmesan and garden herbs.', price: 16.50, category: 'Mains', image: 'pasta' },
  { id: '4', name: 'Grilled Sea Bass', description: 'Tender sea bass with seasonal greens and fresh lemon.', price: 22.00, category: 'Mains', image: 'fish' },
  { id: '5', name: 'Lemon Cake', description: 'Our signature soft lemon cake with a bright citrus glaze.', price: 6.99, category: 'Desserts', image: 'cake' },
  { id: '6', name: 'Mint Lemonade', description: 'Freshly squeezed lemons, mint and a touch of sweetness.', price: 4.50, category: 'Drinks', image: 'lemonade' }
];
export function blankProfile() { return { firstName: '', lastName: '', email: '', phone: '', orderUpdates: true, newsletter: false }; }
export function isValidProfile(p) { return !!p && typeof p.firstName === 'string' && p.firstName.trim().length > 0 && typeof p.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()); }
export function normalizeProfile(p) { return { firstName: p.firstName.trim(), lastName: typeof p.lastName === 'string' ? p.lastName.trim() : '', email: p.email.trim().toLowerCase(), phone: typeof p.phone === 'string' ? p.phone.trim() : '', orderUpdates: typeof p.orderUpdates === 'boolean' ? p.orderUpdates : true, newsletter: p.newsletter === true }; }
export function filterMenu(query = '', category = 'All') { const q = query.trim().toLowerCase(); return menu.filter(item => (category === 'All' || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(q)); }
