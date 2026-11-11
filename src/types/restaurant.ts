export type Category = 
  | 'all'
  | 'starters'
  | 'soups'
  | 'sizzling'
  | 'poultry_beef'
  | 'seafood'
  | 'rice_noodles'
  | 'set_menus'
  | 'desserts_beverages';

export type SpiceLevel = 'Non-Spicy' | 'Mild' | 'Medium' | 'Szechuan Fiery';

export interface PortionOption {
  id: string;
  label: string;
  portionRatio: string; // e.g., '1:2' (serves 2) or '1:4' (serves 4)
  serves: string;
  price: number; // in BDT ৳
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  name: string;
  bengaliName?: string;
  category: Category;
  description: string;
  price: number; // standard base price in BDT
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  isSpicy?: boolean;
  defaultSpiceLevel: SpiceLevel;
  availableSpiceLevels: SpiceLevel[];
  portionOptions: PortionOption[];
  isBestSeller?: boolean;
  isChefSpecial?: boolean;
  ingredients: string[];
  preparationTimeMinutes: number;
  caloriesApprox?: number;
}

export interface CartItem {
  cartItemId: string; // unique cart item instance ID (item + portion + spice)
  menuItemId: string;
  restaurantId?: string;
  restaurantName?: string;
  name: string;
  bengaliName?: string;
  image: string;
  price: number; // calculated item price for the selected portion
  portion: PortionOption;
  spiceLevel: SpiceLevel;
  quantity: number;
  specialInstructions?: string;
}

export type SeatingZone = string;

export interface SeatingZoneInfo {
  id: SeatingZone;
  name: string;
  bengaliName?: string;
  tagline: string;
  capacity: string;
  description: string;
  minGuests: number;
  maxGuests: number;
}

export type OccasionType = 
  | 'Family Gathering' 
  | 'Birthday Celebration' 
  | 'Anniversary Dinner' 
  | 'Business Dining' 
  | 'Casual Meal' 
  | 'Royal Banquet Feast';

export interface TableBooking {
  id: string;
  bookingCode: string;
  restaurantId: string;
  restaurantName: string;
  guestName: string;
  phone: string;
  email: string;
  guestsCount: number;
  date: string;
  timeSlot: string;
  seatingZone: SeatingZone;
  seatingZoneName?: string;
  occasion: OccasionType;
  specialRequests?: string;
  createdAt: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
}

export type OrderStatus = 'received' | 'preparing' | 'wok_sizzling' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  orderCode: string;
  restaurantId?: string;
  restaurantName?: string;
  customerName: string;
  phone: string;
  email?: string;
  deliveryType: 'delivery' | 'takeaway';
  deliveryArea?: string;
  deliveryAddress?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  vat: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash_on_delivery' | 'bkash_nagad' | 'pos_card';
  createdAt: string;
  estimatedDeliveryMinutes: number;
}

export interface GalleryItem {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  title: string;
  bengaliTitle?: string;
  category: 'culinary' | 'ambiance' | 'sizzling' | 'dimsum' | 'banquet';
  categoryLabel: string;
  description: string;
  image: string;
  dishId?: string;
  tagline: string;
}

export interface Restaurant {
  id: string;
  name: string;
  bengaliName: string;
  tagline: string;
  bengaliTagline: string;
  cuisine: string;
  cuisineBn: string;
  area: string;
  areaBn: string;
  address: string;
  addressBn: string;
  landmark: string;
  phone: string;
  email: string;
  facebookUrl: string;
  openingHours: string;
  openingHoursBn: string;
  currency: string;
  heroImage: string;
  heroTitleBn: string;
  heroTitleEn: string;
  heroSubtitleBn: string;
  heroSubtitleEn: string;
  deliveryMinimum: number;
  freeDeliveryThreshold: number;
  vatRate: number;
  signatureDishName: string;
  signatureDishPrice: number;
  seatingZones: SeatingZoneInfo[];
  menuItems: MenuItem[];
  galleryItems: GalleryItem[];
}
