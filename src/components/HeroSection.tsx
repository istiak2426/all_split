import React from 'react';
import { Flame, Users, Calendar, ShieldCheck, ArrowRight, Crown, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface HeroSectionProps {
  currentRestaurant: Restaurant;
  onExploreMenu: () => void;
  onBookTable: () => void;
  onViewSets: () => void;
  onOpenRestaurantSelector: () => void;
  lang: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentRestaurant,
  onExploreMenu,
  onBookTable,
  onViewSets,
  onOpenRestaurantSelector,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const title = lang === 'bn' ? currentRestaurant.heroTitleBn : currentRestaurant.heroTitleEn;
  const subtitle = lang === 'bn' ? currentRestaurant.heroSubtitleBn : currentRestaurant.heroSubtitleEn;
  const address = lang === 'bn' ? currentRestaurant.addressBn : currentRestaurant.address;
  const cuisine = lang === 'bn' ? currentRestaurant.cuisineBn : currentRestaurant.cuisine;
  const area = lang === 'bn' ? currentRestaurant.areaBn : currentRestaurant.area;
  const openingHours = lang === 'bn' ? currentRestaurant.openingHoursBn : currentRestaurant.openingHours;

  return (
    <section className="relative overflow-hidden bg-zinc-950 border-b border-zinc-800">
      {/* Ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Split Grid Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Narrative & Action */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Unboxed metadata line with Restaurant lead badge */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/30">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{cuisine}</span>
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="flex items-center gap-1 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{area}</span>
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-400">{lang === 'bn' ? '১০০% হালাল ফুড' : '100% Halal Food'}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <a
                href={currentRestaurant.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline font-semibold"
              >
                <span>{t.officialFb}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              {title}
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all rounded-lg shadow-md cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <span>{t.heroOrderCta}</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>

              <button
                onClick={onBookTable}
                className="px-6 py-3.5 text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{t.heroBookCta}</span>
              </button>

              <button
                onClick={onOpenRestaurantSelector}
                className="px-4 py-3 text-xs font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/25 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অন্যান্য রেস্টুরেন্ট ব্রাউজ করুন' : 'Browse All Dhaka Leads'}</span>
              </button>
            </div>

            {/* Delivery address & phone */}
            <div className="pt-2 text-xs text-zinc-400 flex flex-wrap items-center gap-x-4 gap-y-1">
              <div className="flex items-center gap-1 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{address}</span>
              </div>
              <div className="text-zinc-500">|</div>
              <div>
                <span className="text-amber-400 font-medium">{lang === 'bn' ? 'হটলাইন: ' : 'Hotline: '}</span>
                <span className="text-zinc-300">{currentRestaurant.phone}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Image Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 group">
              <img
                src={currentRestaurant.heroImage}
                alt={currentRestaurant.name}
                className="w-full h-80 sm:h-96 lg:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? currentRestaurant.bengaliName : currentRestaurant.name}</span>
                  </span>
                  <span className="font-mono tabular-nums text-zinc-400">
                    {openingHours}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  {lang === 'bn' ? currentRestaurant.bengaliTagline : currentRestaurant.tagline}
                </p>
                <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">
                    {lang === 'bn' ? 'সিগনেচার খাবার:' : 'Specialty:'}{' '}
                    <strong className="text-amber-400 font-medium">{currentRestaurant.signatureDishName}</strong>
                  </span>
                  <a
                    href={currentRestaurant.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-semibold"
                  >
                    <span>{t.officialFb}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Column Feature Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-10 border-t border-zinc-800/80">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-sm text-zinc-100">{t.feat1Title}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t.feat1Desc}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-sm text-zinc-100">{t.feat2Title}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t.feat2Desc}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-sm text-zinc-100">{t.feat3Title}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t.feat3Desc}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-sm text-zinc-100">{t.feat4Title}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t.feat4Desc}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
