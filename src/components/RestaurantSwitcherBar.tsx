import React from 'react';
import { Utensils, MapPin, ExternalLink, ChevronRight, Grid } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { ALL_RESTAURANTS } from '../data/restaurantData';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface RestaurantSwitcherBarProps {
  currentRestaurant: Restaurant;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onOpenSelectorModal: () => void;
  lang: Language;
}

export const RestaurantSwitcherBar: React.FC<RestaurantSwitcherBarProps> = ({
  currentRestaurant,
  onSelectRestaurant,
  onOpenSelectorModal,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Active lead summary & FB link */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400 font-medium">
              {lang === 'bn' ? 'অ্যাক্টিভ রেস্টুরেন্ট:' : 'Active Restaurant:'}
            </span>
            <span className="font-bold text-amber-400">
              {lang === 'bn' ? currentRestaurant.bengaliName : currentRestaurant.name}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 border-l border-zinc-700 pl-3">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{lang === 'bn' ? currentRestaurant.areaBn : currentRestaurant.area}</span>
          </div>

          <a
            href={currentRestaurant.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium hover:underline ml-1"
            title="Official Facebook Page"
          >
            <span>{t.officialFb}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Right: Quick Switch pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] text-zinc-500 font-medium shrink-0 mr-1 hidden lg:inline">
            {lang === 'bn' ? 'দ্রুত পরিবর্তন:' : 'Quick Switch:'}
          </span>

          {ALL_RESTAURANTS.slice(0, 5).map((rest) => {
            const isSelected = rest.id === currentRestaurant.id;
            return (
              <button
                key={rest.id}
                onClick={() => onSelectRestaurant(rest)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {lang === 'bn' ? rest.bengaliName.split(' ')[0] : rest.name.split(' ')[0]}
              </button>
            );
          })}

          <button
            onClick={onOpenSelectorModal}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 hover:bg-amber-400/20 transition-colors cursor-pointer shrink-0 ml-1"
          >
            <Grid className="w-3 h-3" />
            <span>{lang === 'bn' ? `সকল ${ALL_RESTAURANTS.length}টি লিড` : `All ${ALL_RESTAURANTS.length} Leads`}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
