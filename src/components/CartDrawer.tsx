import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Bike, AlertCircle } from 'lucide-react';
import { CartItem, Order, Restaurant } from '../types/restaurant';
import { DHAKA_AREAS } from '../data/restaurantData';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface CartDrawerProps {
  currentRestaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderCompleted: (order: Order) => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  currentRestaurant,
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCompleted,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'takeaway'>('delivery');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('gulshan');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bkash_nagad' | 'pos_card'>('cash_on_delivery');
  
  // Promo code
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentArea = DHAKA_AREAS.find((a) => a.id === selectedAreaId) || DHAKA_AREAS[0];

  // Price calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isFreeDelivery = subtotal >= currentRestaurant.freeDeliveryThreshold;
  const deliveryFee = deliveryType === 'takeaway' ? 0 : (isFreeDelivery ? 0 : currentArea.deliveryFee);
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const vat = Math.round(taxableAmount * currentRestaurant.vatRate);
  const grandTotal = taxableAmount + vat + deliveryFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMessage(null);
    if (!couponCode.trim()) return;

    if (couponCode.trim().toUpperCase() === 'CASTLE10' || couponCode.trim().toUpperCase() === 'CHINAGARDEN10') {
      setAppliedDiscount(0.10);
      setCouponMessage(lang === 'bn' ? '১০% ঢাকা ক্যাসল ভিআইপি ডিসকাউন্ট যোগ হয়েছে!' : '10% Dhaka Castle VIP discount applied!');
    } else if (couponCode.trim().toUpperCase() === 'DHAKA20') {
      setAppliedDiscount(0.20);
      setCouponMessage(lang === 'bn' ? '২০% পুরান ঢাকা ঐতিহ্যবাহী ডিসকাউন্ট যোগ হয়েছে!' : '20% Old Dhaka Heritage discount applied!');
    } else {
      setCouponMessage(lang === 'bn' ? 'ভুল ভাউচার কোড।' : 'Invalid promo voucher code.');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (cartItems.length === 0) {
      setCheckoutError(lang === 'bn' ? 'আপনার খাবারের ব্যাগ খালি। অনুগ্রহ করে খাবার পছন্দ করুন।' : 'Your bag is empty. Please add delicious dishes first!');
      return;
    }

    if (!customerName.trim()) {
      setCheckoutError(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setCheckoutError(lang === 'bn' ? 'অনুগ্রহ করে একটি সঠিক মোবাইল নম্বর লিখুন।' : 'Please provide a valid Dhaka contact phone number.');
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      setCheckoutError(lang === 'bn' ? 'অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা লিখুন।' : 'Please specify your delivery address and road/house number.');
      return;
    }

    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const prefix = currentRestaurant.id.slice(0, 3).toUpperCase();
    const orderCode = `${prefix}-ORD-${orderNumber}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderCode,
      restaurantId: currentRestaurant.id,
      restaurantName: currentRestaurant.name,
      customerName: customerName.trim(),
      phone: phone.trim(),
      deliveryType,
      deliveryArea: deliveryType === 'delivery' ? currentArea.name : `${currentRestaurant.name} Takeaway Desk`,
      deliveryAddress: deliveryType === 'delivery' ? address.trim() : `Pickup at ${currentRestaurant.name} (${currentRestaurant.address})`,
      items: [...cartItems],
      subtotal,
      deliveryFee,
      vat,
      discount: discountAmount,
      total: grandTotal,
      status: 'received',
      paymentMethod,
      createdAt: new Date().toISOString(),
      estimatedDeliveryMinutes: deliveryType === 'takeaway' ? 20 : currentArea.estimatedMins,
    };

    onOrderCompleted(newOrder);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="relative w-full max-w-lg bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-lg font-bold text-white">
              {t.cartTitle}
            </h2>
            <span className="font-mono tabular-nums text-xs text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} {t.cartItemsCount}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {checkoutError && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm text-zinc-400">{t.cartEmptyTitle}</p>
              <p className="text-xs text-zinc-500">
                {t.cartEmptyDesc}
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
              >
                {t.navMenu}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const displayName = lang === 'bn' && item.bengaliName ? item.bengaliName : item.name;
                return (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white">
                          {displayName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                          <span className="text-amber-400">{item.portion.label}</span>
                          <span aria-hidden="true" className="text-zinc-600">·</span>
                          <span>{item.portion.serves}</span>
                          <span aria-hidden="true" className="text-zinc-600">·</span>
                          <span className="text-zinc-300">{item.spiceLevel}</span>
                        </div>
                        {item.specialInstructions && (
                          <p className="text-[11px] text-zinc-400 italic mt-1">
                            {lang === 'bn' ? 'অনুরোধ:' : 'Note:'} "{item.specialInstructions}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                      <div className="font-mono tabular-nums text-sm font-bold text-amber-400">
                        {currentRestaurant.currency}{item.price * item.quantity}
                      </div>

                      <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-md p-0.5">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono tabular-nums text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {cartItems.length > 0 && (
            <>
              {/* Delivery Type Selector */}
              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                  {t.orderMethod}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'border-amber-400 bg-amber-400 text-zinc-950'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>{t.deliveryMode}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('takeaway')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      deliveryType === 'takeaway'
                        ? 'border-amber-400 bg-amber-400 text-zinc-950'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t.takeawayMode}</span>
                  </button>
                </div>
              </div>

              {/* Delivery Area Selection (if delivery) */}
              {deliveryType === 'delivery' && (
                <div className="space-y-2">
                  <label
                    htmlFor="deliveryAreaSelect"
                    className="text-xs font-semibold uppercase tracking-wider text-amber-400 block"
                  >
                    {t.selectArea}
                  </label>
                  <select
                    id="deliveryAreaSelect"
                    value={selectedAreaId}
                    onChange={(e) => setSelectedAreaId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {DHAKA_AREAS.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name} — {lang === 'bn' ? 'চার্জ:' : 'Fee:'} {currentRestaurant.currency}{area.deliveryFee} (~{area.estimatedMins} {lang === 'bn' ? 'মি.' : 'mins'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="space-y-3 pt-2 border-t border-zinc-900">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                  {t.deliveryDetails}
                </label>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />

                  <input
                    type="tel"
                    required
                    placeholder={lang === 'bn' ? 'মোবাইল নম্বর (যেমন: 01711-xxxxxx) *' : 'Dhaka Phone Number (e.g. 01711-xxxxxx) *'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />

                  {deliveryType === 'delivery' && (
                    <textarea
                      rows={2}
                      required
                      placeholder={t.addressPlaceholder}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                  {t.paymentOption}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`py-2 px-1 text-[11px] font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-amber-400 bg-amber-400 text-zinc-950 font-bold'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    {t.cod}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash_nagad')}
                    className={`py-2 px-1 text-[11px] font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'bkash_nagad'
                        ? 'border-amber-400 bg-amber-400 text-zinc-950 font-bold'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    {t.bkashNagad}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pos_card')}
                    className={`py-2 px-1 text-[11px] font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'pos_card'
                        ? 'border-amber-400 bg-amber-400 text-zinc-950 font-bold'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    {t.cardDelivery}
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-zinc-900 space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.couponPlaceholder}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 uppercase placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {t.couponApply}
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-[11px] text-amber-400">{couponMessage}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-zinc-900 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>{t.subtotal}</span>
                  <span className="font-mono tabular-nums text-zinc-200">
                    {currentRestaurant.currency}{subtotal}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{lang === 'bn' ? 'ডিসকাউন্ট' : 'Discount'}</span>
                    <span className="font-mono tabular-nums">
                      -{currentRestaurant.currency}{discountAmount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>{t.vatLabel}</span>
                  <span className="font-mono tabular-nums text-zinc-200">
                    {currentRestaurant.currency}{vat}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>{t.deliveryCharge}</span>
                  <span className="font-mono tabular-nums text-zinc-200">
                    {deliveryType === 'takeaway' ? (
                      <span className="text-zinc-500">{t.takeawayFree}</span>
                    ) : isFreeDelivery ? (
                      <span className="text-emerald-400">{t.freeDeliveryBadge}</span>
                    ) : (
                      `${currentRestaurant.currency}${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>{t.grandTotal}</span>
                  <span className="font-mono tabular-nums text-amber-400">
                    {currentRestaurant.currency}{grandTotal}
                  </span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Drawer Bottom Action */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-between cursor-pointer"
            >
              <span>{t.placeOrderBtn}</span>
              <span className="font-mono tabular-nums">
                {currentRestaurant.currency}{grandTotal} →
              </span>
            </button>
            <div className="text-center text-[10px] text-zinc-500 mt-2">
              {t.hotPackagingNote}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
