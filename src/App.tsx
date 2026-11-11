/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { DishModal } from './components/DishModal';
import { GallerySection } from './components/GallerySection';
import { TableBookingSection } from './components/TableBookingSection';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { BookingsListModal } from './components/BookingsListModal';
import { RestaurantSelectorModal } from './components/RestaurantSelectorModal';
import { RestaurantSwitcherBar } from './components/RestaurantSwitcherBar';
import { Footer } from './components/Footer';
import { MenuItem, PortionOption, SpiceLevel, CartItem, Order, TableBooking, Restaurant } from './types/restaurant';
import { ALL_RESTAURANTS, DEFAULT_RESTAURANT } from './data/restaurantData';
import { Language, TRANSLATIONS } from './i18n/translations';
import { Check, X } from 'lucide-react';

const LOCAL_STORAGE_CART_KEY = 'dhakacastle_cart_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'dhakacastle_orders_v1';
const LOCAL_STORAGE_BOOKINGS_KEY = 'dhakacastle_bookings_v1';
const LOCAL_STORAGE_LANG_KEY = 'dhakacastle_lang_v1';
const LOCAL_STORAGE_REST_KEY = 'dhaka_active_restaurant_v1';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
      return (saved === 'en' || saved === 'bn') ? saved : 'bn'; // Bangla-first user friendly default
    } catch {
      return 'bn';
    }
  });

  // Current active restaurant lead
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant>(() => {
    try {
      const savedId = localStorage.getItem(LOCAL_STORAGE_REST_KEY);
      if (savedId) {
        const found = ALL_RESTAURANTS.find((r) => r.id === savedId);
        if (found) return found;
      }
      return DEFAULT_RESTAURANT;
    } catch {
      return DEFAULT_RESTAURANT;
    }
  });

  const [activeTab, setActiveTab] = useState<'menu' | 'gallery' | 'booking' | 'sets'>('menu');
  const [showTopBanner, setShowTopBanner] = useState<boolean>(true);
  const [isRestaurantSelectorOpen, setIsRestaurantSelectorOpen] = useState<boolean>(false);

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User orders persisted
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User table bookings persisted
  const [bookings, setBookings] = useState<TableBooking[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedDishModal, setSelectedDishModal] = useState<MenuItem | null>(null);
  const [activeOrderTracker, setActiveOrderTracker] = useState<Order | null>(null);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save language preference
  const toggleLanguage = () => {
    const newLang = lang === 'bn' ? 'en' : 'bn';
    setLang(newLang);
    try {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, newLang);
    } catch (e) {
      console.error(e);
    }
  };

  // Switch active restaurant
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    try {
      localStorage.setItem(LOCAL_STORAGE_REST_KEY, restaurant.id);
    } catch (e) {
      console.error(e);
    }
    const toast = lang === 'bn'
      ? `${restaurant.bengaliName} নির্বাচিত হয়েছে`
      : `Switched to ${restaurant.name}`;
    showToast(toast);
  };

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage', e);
    }
  }, [bookings]);

  // Derived cart numbers
  const cartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const cartTotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Add to cart handler
  const handleAddToCart = (
    dish: MenuItem,
    portion: PortionOption,
    spiceLevel: SpiceLevel,
    quantity: number,
    specialInstructions: string
  ) => {
    const cartItemId = `${dish.id}-${portion.id}-${spiceLevel}-${(specialInstructions || '').trim()}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      const newItem: CartItem = {
        cartItemId,
        menuItemId: dish.id,
        restaurantId: currentRestaurant.id,
        restaurantName: currentRestaurant.name,
        name: dish.name,
        bengaliName: dish.bengaliName,
        image: dish.image,
        price: portion.price,
        portion,
        spiceLevel,
        quantity,
        specialInstructions,
      };
      return [...prev, newItem];
    });

    const displayName = lang === 'bn' && dish.bengaliName ? dish.bengaliName : dish.name;
    const toast = lang === 'bn'
      ? `${quantity}টি ${displayName} ব্যাগে যোগ করা হয়েছে`
      : `Added ${quantity}x ${dish.name} (${portion.label}) to your bag`;
    showToast(toast);
  };

  // Quick add from menu card
  const handleQuickAdd = (
    dish: MenuItem,
    portion: PortionOption,
    spiceLevel: SpiceLevel
  ) => {
    handleAddToCart(dish, portion, spiceLevel, 1, '');
  };

  // Update quantity in drawer
  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((it) => (it.cartItemId === cartItemId ? { ...it, quantity: newQty } : it))
    );
  };

  // Remove item
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.cartItemId !== cartItemId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Table booking confirmed
  const handleBookingConfirmed = (newBooking: TableBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    const toast = lang === 'bn'
      ? `টেবিল বুকিং সফল! রেফারেন্স কোড: ${newBooking.bookingCode}`
      : `Table reserved! Code: ${newBooking.bookingCode}`;
    showToast(toast);
  };

  // Order completed
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderTracker(newOrder);
    const toast = lang === 'bn'
      ? `অর্ডার সফল হয়েছে! ট্র্যাকিং কোড: ${newOrder.orderCode}`
      : `Order placed! Tracking ID: ${newOrder.orderCode}`;
    showToast(toast);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showToast(lang === 'bn' ? 'বুকিং বাতিল করা হয়েছে' : 'Reservation cancelled');
  };

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-white font-sans">
      
      {/* Promotional Top Bar */}
      {showTopBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 text-xs font-semibold px-4 py-2 flex items-center justify-between z-50">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-center truncate">
            <span>
              {lang === 'bn'
                ? `⚡ ${currentRestaurant.bengaliName} স্পেশাল অফার: ২,০০০ টাকার অর্ডারে ঢাকা শহরজুড়ে ফ্রি হোম ডেলিভারি · প্রোমো কোড: DHAKA10`
                : `⚡ ${currentRestaurant.name} Special Offer: Free Delivery citywide on orders over ৳2000 · Promo Code: DHAKA10`}
            </span>
          </div>
          <button
            onClick={() => setShowTopBanner(false)}
            className="p-1 hover:text-black transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentRestaurant={currentRestaurant}
        onOpenRestaurantSelector={() => setIsRestaurantSelectorOpen(true)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
        activeBookingsCount={bookings.length}
        lang={lang}
        onToggleLang={toggleLanguage}
      />

      {/* Restaurant Switcher Lead Strip */}
      <RestaurantSwitcherBar
        currentRestaurant={currentRestaurant}
        onSelectRestaurant={handleSelectRestaurant}
        onOpenSelectorModal={() => setIsRestaurantSelectorOpen(true)}
        lang={lang}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          currentRestaurant={currentRestaurant}
          onOpenRestaurantSelector={() => setIsRestaurantSelectorOpen(true)}
          lang={lang}
          onExploreMenu={() => {
            setActiveTab('menu');
            document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onBookTable={() => {
            setActiveTab('booking');
            document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onViewSets={() => {
            setActiveTab('sets');
            document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Tab-driven View */}
        {activeTab === 'menu' && (
          <>
            <MenuSection
              currentRestaurant={currentRestaurant}
              onOpenRestaurantSelector={() => setIsRestaurantSelectorOpen(true)}
              initialCategory="all"
              onSelectDish={(dish) => setSelectedDishModal(dish)}
              onQuickAdd={handleQuickAdd}
              lang={lang}
            />
            <GallerySection
              currentRestaurant={currentRestaurant}
              onOrderDish={(dish) => setSelectedDishModal(dish)}
              onBookTable={() => {
                setActiveTab('booking');
                document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              lang={lang}
            />
            <TableBookingSection
              currentRestaurant={currentRestaurant}
              onBookingConfirmed={handleBookingConfirmed}
              onViewBookings={() => setIsBookingsModalOpen(true)}
              lang={lang}
            />
          </>
        )}

        {activeTab === 'sets' && (
          <>
            <MenuSection
              currentRestaurant={currentRestaurant}
              onOpenRestaurantSelector={() => setIsRestaurantSelectorOpen(true)}
              initialCategory="set_menus"
              onSelectDish={(dish) => setSelectedDishModal(dish)}
              onQuickAdd={handleQuickAdd}
              lang={lang}
            />
            <TableBookingSection
              currentRestaurant={currentRestaurant}
              onBookingConfirmed={handleBookingConfirmed}
              onViewBookings={() => setIsBookingsModalOpen(true)}
              lang={lang}
            />
          </>
        )}

        {activeTab === 'gallery' && (
          <>
            <GallerySection
              currentRestaurant={currentRestaurant}
              onOrderDish={(dish) => setSelectedDishModal(dish)}
              onBookTable={() => {
                setActiveTab('booking');
                document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              lang={lang}
            />
            <MenuSection
              currentRestaurant={currentRestaurant}
              onOpenRestaurantSelector={() => setIsRestaurantSelectorOpen(true)}
              initialCategory="all"
              onSelectDish={(dish) => setSelectedDishModal(dish)}
              onQuickAdd={handleQuickAdd}
              lang={lang}
            />
          </>
        )}

        {activeTab === 'booking' && (
          <>
            <TableBookingSection
              currentRestaurant={currentRestaurant}
              onBookingConfirmed={handleBookingConfirmed}
              onViewBookings={() => setIsBookingsModalOpen(true)}
              lang={lang}
            />
            <GallerySection
              currentRestaurant={currentRestaurant}
              onOrderDish={(dish) => setSelectedDishModal(dish)}
              onBookTable={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              lang={lang}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        currentRestaurant={currentRestaurant}
        onSelectRestaurant={handleSelectRestaurant}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
      />

      {/* Restaurant Leads Selector Modal */}
      <RestaurantSelectorModal
        isOpen={isRestaurantSelectorOpen}
        onClose={() => setIsRestaurantSelectorOpen(false)}
        selectedRestaurantId={currentRestaurant.id}
        onSelectRestaurant={handleSelectRestaurant}
        lang={lang}
      />

      {/* Dish Customizer Modal */}
      {selectedDishModal && (
        <DishModal
          dish={selectedDishModal}
          onClose={() => setSelectedDishModal(null)}
          onAddToCart={handleAddToCart}
          lang={lang}
        />
      )}

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        currentRestaurant={currentRestaurant}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderCompleted={handleOrderCompleted}
        lang={lang}
      />

      {/* Order Tracker Modal */}
      {activeOrderTracker && (
        <OrderTrackerModal
          order={activeOrderTracker}
          onClose={() => setActiveOrderTracker(null)}
          lang={lang}
        />
      )}

      {/* Bookings List Modal */}
      <BookingsListModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onOpenNewBooking={() => {
          setIsBookingsModalOpen(false);
          setActiveTab('booking');
        }}
        lang={lang}
      />

      {/* Floating Active Order Shortcut */}
      {orders.length > 0 && !activeOrderTracker && (
        <div className="fixed bottom-6 left-6 z-40">
          <button
            onClick={() => setActiveOrderTracker(orders[0])}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-zinc-900/90 hover:bg-zinc-800 backdrop-blur-md border border-amber-400/40 text-xs font-semibold text-white rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              {lang === 'bn' ? `অর্ডার ট্র্যাক করুন (${orders[0].orderCode})` : `Track Order (${orders[0].orderCode})`}
            </span>
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-zinc-900 border border-zinc-700 text-xs font-medium text-white rounded-xl shadow-2xl">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-amber-400 hover:underline font-bold ml-2 cursor-pointer whitespace-nowrap"
            >
              {lang === 'bn' ? 'ব্যাগ দেখুন' : 'View Bag'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
