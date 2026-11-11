import React from 'react';
import { ShoppingBag, Calendar, Languages } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  currentRestaurant: Restaurant;
  onOpenRestaurantSelector: () => void;
  activeTab: 'menu' | 'gallery' | 'booking' | 'sets';
  onSelectTab: (tab: 'menu' | 'gallery' | 'booking' | 'sets') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenBookings: () => void;
  activeBookingsCount: number;
  lang: Language;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRestaurant,
  onOpenRestaurantSelector,
  activeTab,
  onSelectTab,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenBookings,
  activeBookingsCount,
  lang,
  onToggleLang,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 h-20">
        
        {/* Zone 1: Single text element Brand Wordmark + Restaurant Switcher Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('menu')}
            className="text-left group cursor-pointer shrink-0"
          >
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-400 group-hover:text-amber-300 transition-colors whitespace-nowrap">
                {lang === 'bn' ? currentRestaurant.bengaliName : currentRestaurant.name}
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:block truncate max-w-[220px]">
                {lang === 'bn' ? currentRestaurant.areaBn : currentRestaurant.area}
              </span>
            </div>
          </button>

          {/* Quick Restaurant Switcher Button */}
          <button
            onClick={onOpenRestaurantSelector}
            className="px-2.5 py-1 text-[11px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 hover:border-amber-400 rounded-md transition-all cursor-pointer whitespace-nowrap hidden sm:flex items-center gap-1"
            title="Browse all 8+ Dhaka Restaurant Leads"
          >
            <span>{t.switchRestaurant}</span>
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium">
          <button
            onClick={() => onSelectTab('menu')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'menu'
                ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            {t.navMenu}
          </button>
          
          <button
            onClick={() => onSelectTab('sets')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'sets'
                ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            {t.navSets}
          </button>

          <button
            onClick={() => onSelectTab('gallery')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'gallery'
                ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            {t.navGallery}
          </button>

          <button
            onClick={() => onSelectTab('booking')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'booking'
                ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            {t.navBooking}
          </button>

          {activeBookingsCount > 0 && (
            <button
              onClick={onOpenBookings}
              className="text-zinc-400 hover:text-amber-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.navReservations} ({activeBookingsCount})</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action & Language Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            title="Switch Language / ভাষা পরিবর্তন"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
            aria-label={`${t.navBag} with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 text-zinc-950" />
            <span>{t.navBag}</span>
            {cartCount > 0 && (
              <>
                <span className="text-zinc-900 font-bold">·</span>
                <span className="font-mono tabular-nums text-xs font-bold bg-amber-500/80 px-1.5 py-0.5 rounded">
                  {cartCount}
                </span>
                <span className="hidden sm:inline font-mono tabular-nums text-xs">
                  {currentRestaurant.currency}{cartTotal}
                </span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Mobile sub-bar for section switching */}
      <div className="md:hidden flex items-center justify-around border-t border-zinc-800/80 bg-zinc-900/95 px-2 py-2 text-xs font-medium">
        <button
          onClick={onOpenRestaurantSelector}
          className="px-2 py-1.5 rounded bg-amber-400/10 text-amber-400 font-semibold border border-amber-400/20 whitespace-nowrap"
        >
          {lang === 'bn' ? 'রেস্টুরেন্ট' : 'Leads'}
        </button>
        <button
          onClick={() => onSelectTab('menu')}
          className={`px-2.5 py-1.5 rounded ${
            activeTab === 'menu' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          {t.navMenu}
        </button>
        <button
          onClick={() => onSelectTab('sets')}
          className={`px-2.5 py-1.5 rounded ${
            activeTab === 'sets' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          {t.navSets}
        </button>
        <button
          onClick={() => onSelectTab('gallery')}
          className={`px-2.5 py-1.5 rounded ${
            activeTab === 'gallery' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          {t.navGallery}
        </button>
        <button
          onClick={() => onSelectTab('booking')}
          className={`px-2.5 py-1.5 rounded ${
            activeTab === 'booking' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          {t.navBooking}
        </button>
        {activeBookingsCount > 0 && (
          <button
            onClick={onOpenBookings}
            className="text-amber-400 px-2 py-1 flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" />
            <span>({activeBookingsCount})</span>
          </button>
        )}
      </div>
    </header>
  );
};
