import React from 'react';
import { X, Check, MapPin, Phone, ExternalLink, Utensils, Sparkles } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { ALL_RESTAURANTS } from '../data/restaurantData';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface RestaurantSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRestaurantId: string;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  lang: Language;
}

export const RestaurantSelectorModal: React.FC<RestaurantSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedRestaurantId,
  onSelectRestaurant,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg font-serif font-bold text-white tracking-tight">
                {t.leadsTitle}
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {t.leadsSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_RESTAURANTS.map((restaurant) => {
              const isSelected = restaurant.id === selectedRestaurantId;
              const displayName = lang === 'bn' ? restaurant.bengaliName : restaurant.name;
              const displayCuisine = lang === 'bn' ? restaurant.cuisineBn : restaurant.cuisine;
              const displayArea = lang === 'bn' ? restaurant.areaBn : restaurant.area;

              return (
                <div
                  key={restaurant.id}
                  className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Tag & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        <Utensils className="w-3 h-3" />
                        <span>{displayCuisine}</span>
                      </span>

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-800/40">
                          <Check className="w-3 h-3" />
                          <span>{t.currentLead}</span>
                        </span>
                      )}
                    </div>

                    {/* Name & Location */}
                    <div>
                      <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                        {displayName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                        <span className="truncate">{displayArea}</span>
                        <span className="text-zinc-600">·</span>
                        <span className="truncate">{restaurant.landmark}</span>
                      </div>
                    </div>

                    {/* Signature Dish teaser */}
                    <div className="text-xs bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80 space-y-1">
                      <div className="text-zinc-500 text-[10px] uppercase font-semibold">
                        {lang === 'bn' ? 'সিগনেচার খাবার:' : 'Signature Item:'}
                      </div>
                      <div className="flex items-center justify-between text-zinc-200 font-medium">
                        <span className="truncate">{restaurant.signatureDishName}</span>
                        <span className="font-mono text-amber-400 shrink-0 ml-2">
                          ৳{restaurant.signatureDishPrice}
                        </span>
                      </div>
                    </div>

                    {/* Phone & FB Lead Link */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-zinc-400 border-t border-zinc-800/60">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-zinc-500" />
                        <span>{restaurant.phone.split('/')[0]}</span>
                      </div>
                      <a
                        href={restaurant.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{t.officialFb}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 mt-3">
                    <button
                      onClick={() => {
                        onSelectRestaurant(restaurant);
                        onClose();
                      }}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'বর্তমান মেনু দেখা হচ্ছে' : 'Viewing This Menu'}</span>
                        </>
                      ) : (
                        <span>{lang === 'bn' ? 'এই রেস্টুরেন্ট নির্বাচন করুন' : 'Select This Restaurant'}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-900 border-t border-zinc-800 text-xs text-zinc-400">
          <span>
            {lang === 'bn' 
              ? `মোট ${ALL_RESTAURANTS.length}টি শীর্ষ রেস্টুরেন্ট লিড সংযুক্ত রয়েছে` 
              : `Total ${ALL_RESTAURANTS.length} verified Dhaka restaurant leads active`}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors cursor-pointer text-xs"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
