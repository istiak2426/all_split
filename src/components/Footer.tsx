import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, Crown, Utensils } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { ALL_RESTAURANTS } from '../data/restaurantData';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface FooterProps {
  currentRestaurant: Restaurant;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  onSelectTab: (tab: 'menu' | 'gallery' | 'booking' | 'sets') => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ 
  currentRestaurant, 
  onSelectRestaurant, 
  onSelectTab, 
  lang 
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        
        {/* Main 4-column active restaurant details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & FB Lead Link */}
          <div className="space-y-3">
            <span className="font-serif text-xl font-bold text-amber-400 block tracking-tight flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>{lang === 'bn' ? currentRestaurant.bengaliName : currentRestaurant.name}</span>
            </span>
            <p className="text-zinc-300 text-xs leading-relaxed">
              {lang === 'bn' ? currentRestaurant.bengaliTagline : currentRestaurant.tagline}
            </p>
            <div className="pt-2">
              <a
                href={currentRestaurant.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <span>{t.officialFb}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Locations & Landmarks */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {lang === 'bn' ? 'ঠিকানা ও অবস্থান' : 'Address & Location'}
            </h4>
            <div className="space-y-1.5 text-zinc-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{lang === 'bn' ? currentRestaurant.addressBn : currentRestaurant.address}</span>
              </p>
              <p className="text-zinc-500 pl-5">
                {currentRestaurant.landmark}
              </p>
            </div>

            <div className="pt-2">
              <h5 className="font-semibold text-zinc-300 text-[11px]">
                {lang === 'bn' ? 'খাবারের ধরন:' : 'Cuisine & Style:'}
              </h5>
              <p className="text-amber-400">
                {lang === 'bn' ? currentRestaurant.cuisineBn : currentRestaurant.cuisine}
              </p>
            </div>
          </div>

          {/* Col 3: Hours & Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {lang === 'bn' ? 'সময়সূচি ও বুকিং হটলাইন' : 'Hours & Reservations'}
            </h4>
            <div className="space-y-2 text-zinc-300">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">
                    {lang === 'bn' ? currentRestaurant.openingHoursBn : currentRestaurant.openingHours}
                  </div>
                  <div className="text-zinc-500">
                    {lang === 'bn' ? 'লাঞ্চ ও ডিনার সার্ভিস' : 'Lunch & Dinner Service'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">{currentRestaurant.phone}</div>
                  <div className="text-zinc-500">
                    {lang === 'bn' ? 'হোস্ট ডেস্ক ও হোম ডেলিভারি' : 'Host Desk & Delivery'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('menu')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navMenu}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('sets')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navSets}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('gallery')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navGallery}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('booking')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navBooking}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Directory Strip: All 9 Restaurant Leads */}
        <div className="pt-8 border-t border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>{lang === 'bn' ? 'ঢাকার সকল রেস্টুরেন্ট লিডস ডিরেক্টরি' : 'All Dhaka Restaurant Leads Directory'}</span>
            </h4>
            <span className="text-xs text-zinc-500">
              {lang === 'bn' ? 'ক্লিক করে যেকোনো রেস্টুরেন্টের মেনু দেখুন' : 'Click to view any restaurant menu'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ALL_RESTAURANTS.map((rest) => {
              const isCurrent = rest.id === currentRestaurant.id;
              const name = lang === 'bn' ? rest.bengaliName : rest.name;
              const cuisine = lang === 'bn' ? rest.cuisineBn : rest.cuisine;
              const area = lang === 'bn' ? rest.areaBn : rest.area;

              return (
                <div
                  key={rest.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-2 transition-all ${
                    isCurrent
                      ? 'bg-amber-950/30 border-amber-500/50 text-white'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <button
                    onClick={() => onSelectRestaurant && onSelectRestaurant(rest)}
                    className="text-left flex-1 truncate cursor-pointer group"
                  >
                    <div className="font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors truncate">
                      {name}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {cuisine} · {area}
                    </div>
                  </button>

                  <a
                    href={rest.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-blue-400 rounded hover:bg-zinc-800 transition-colors shrink-0"
                    title={`Visit ${rest.name} on Facebook`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <p>© {new Date().getFullYear()} {lang === 'bn' ? currentRestaurant.bengaliName : currentRestaurant.name}. {t.allRightsReserved}</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>{lang === 'bn' ? '১০০% হালাল খাবার' : '100% Halal Food'}</span>
            <span>·</span>
            <span>{lang === 'bn' ? 'অনলাইন হোম ডেলিভারি ও রিজার্ভেশন' : 'Online Food Delivery & Reservations'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
