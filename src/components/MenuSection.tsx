import React, { useState, useMemo } from 'react';
import { Search, Flame, Star, Plus, X, Utensils, ExternalLink, Grid } from 'lucide-react';
import { MenuItem, Category, PortionOption, SpiceLevel, Restaurant } from '../types/restaurant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface MenuSectionProps {
  currentRestaurant: Restaurant;
  onSelectDish: (dish: MenuItem) => void;
  onQuickAdd: (dish: MenuItem, portion: PortionOption, spice: SpiceLevel) => void;
  initialCategory?: Category;
  onOpenRestaurantSelector?: () => void;
  lang: Language;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  currentRestaurant,
  onSelectDish,
  onQuickAdd,
  initialCategory = 'all',
  onOpenRestaurantSelector,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'bestsellers' | 'chef' | 'spicy'>('all');

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: t.cat_all },
    { id: 'starters', label: t.cat_starters },
    { id: 'soups', label: t.cat_soups },
    { id: 'sizzling', label: t.cat_sizzling },
    { id: 'poultry_beef', label: t.cat_poultry_beef },
    { id: 'seafood', label: t.cat_seafood },
    { id: 'rice_noodles', label: t.cat_rice_noodles },
    { id: 'set_menus', label: t.cat_set_menus },
    { id: 'desserts_beverages', label: t.cat_desserts_beverages },
  ];

  // Filtered menu items from active restaurant
  const filteredDishes = useMemo(() => {
    return currentRestaurant.menuItems.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (filterType === 'bestsellers' && !item.isBestSeller) return false;
      if (filterType === 'chef' && !item.isChefSpecial) return false;
      if (filterType === 'spicy' && !item.isSpicy) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesBengali = item.bengaliName?.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIngredients = item.ingredients.some((ing) =>
          ing.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesBengali && !matchesDesc && !matchesIngredients) {
          return false;
        }
      }
      return true;
    });
  }, [currentRestaurant, activeCategory, filterType, searchQuery]);

  return (
    <section id="menu-section" className="py-12 lg:py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Active Restaurant Lead Highlight Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Utensils className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  {lang === 'bn' ? currentRestaurant.cuisineBn : currentRestaurant.cuisine}
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-xs text-zinc-400">
                  {lang === 'bn' ? currentRestaurant.areaBn : currentRestaurant.area}
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-white">
                {lang === 'bn' ? currentRestaurant.bengaliName : currentRestaurant.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={currentRestaurant.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-950/40 border border-blue-800/40 text-blue-400 hover:text-blue-300 hover:bg-blue-900/50 transition-colors"
            >
              <span>{t.officialFb}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {onOpenRestaurantSelector && (
              <button
                onClick={onOpenRestaurantSelector}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-amber-400 hover:text-amber-300 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>{t.switchRestaurant}</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              {t.menuBadge}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {lang === 'bn' ? `${currentRestaurant.bengaliName}র মেনু` : `${currentRestaurant.name} Menu`}
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              {lang === 'bn' ? currentRestaurant.bengaliTagline : currentRestaurant.tagline}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder={t.menuSearchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sub-Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">{t.filterBy}</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.filterAll}
            </button>
            <span className="text-zinc-700">·</span>
            <button
              onClick={() => setFilterType('bestsellers')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filterType === 'bestsellers'
                  ? 'bg-zinc-800 text-amber-400 font-medium'
                  : 'text-zinc-400 hover:text-amber-400'
              }`}
            >
              {t.filterBestseller}
            </button>
            <span className="text-zinc-700">·</span>
            <button
              onClick={() => setFilterType('chef')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filterType === 'chef'
                  ? 'bg-zinc-800 text-amber-400 font-medium'
                  : 'text-zinc-400 hover:text-amber-400'
              }`}
            >
              {t.filterChef}
            </button>
            <span className="text-zinc-700">·</span>
            <button
              onClick={() => setFilterType('spicy')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filterType === 'spicy'
                  ? 'bg-zinc-800 text-red-400 font-medium'
                  : 'text-zinc-400 hover:text-red-400'
              }`}
            >
              {t.filterSpicy}
            </button>
          </div>

          <div className="font-mono tabular-nums text-zinc-500">
            {lang === 'bn' ? `মোট ${filteredDishes.length}টি পদ` : `Showing ${filteredDishes.length} dishes`}
          </div>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="py-16 text-center bg-zinc-900/40 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 text-base">
              {lang === 'bn' ? 'এই ক্যাটাগরিতে কোনো খাবার পাওয়া যায়নি।' : 'No dishes found matching your search.'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setFilterType('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-amber-400 hover:underline cursor-pointer"
            >
              {lang === 'bn' ? 'সব ফিল্টার রিসেট করুন' : 'Reset all filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredDishes.map((dish) => {
              const defaultPortion = dish.portionOptions[0];
              const primaryTitle = lang === 'bn' && dish.bengaliName ? dish.bengaliName : dish.name;
              const secondaryTitle = lang === 'bn' && dish.bengaliName ? dish.name : dish.bengaliName;

              return (
                <div
                  key={dish.id}
                  className="group bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Dish Image */}
                    <div 
                      onClick={() => onSelectDish(dish)}
                      className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-950 cursor-pointer"
                    >
                      <img
                        src={dish.image}
                        alt={primaryTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {dish.isBestSeller && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-zinc-950 shadow-sm">
                            ★ {lang === 'bn' ? 'বেস্টসেলার' : 'Bestseller'}
                          </span>
                        )}
                        {dish.isChefSpecial && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900/90 text-amber-300 border border-amber-400/30">
                            {lang === 'bn' ? 'শেফস স্পেশাল' : 'Chef Special'}
                          </span>
                        )}
                      </div>

                      {/* Spice Indicator */}
                      {dish.isSpicy && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-950/80 text-red-300 border border-red-800/50 backdrop-blur-sm">
                          <Flame className="w-3 h-3 text-red-400" />
                          <span>{dish.defaultSpiceLevel}</span>
                        </div>
                      )}

                      {/* Rating & reviews */}
                      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-white">{dish.rating}</span>
                        <span className="text-zinc-400 text-[11px]">({dish.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Dish Content */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <div 
                        onClick={() => onSelectDish(dish)}
                        className="cursor-pointer"
                      >
                        <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                          {primaryTitle}
                        </h3>
                        {secondaryTitle && (
                          <div className="text-xs text-zinc-400 mt-0.5 truncate">
                            {secondaryTitle}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>

                      {/* Portion hint */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                        <span>
                          {lang === 'bn' ? 'সাইজ:' : 'Size:'}{' '}
                          <strong className="text-zinc-200">{defaultPortion.label}</strong>
                        </span>
                        <span>
                          {defaultPortion.serves}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Pricing & Action */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-zinc-800/60 mt-3 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                        {t.startsFrom}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-lg font-bold text-amber-400 font-mono tabular-nums">
                          {currentRestaurant.currency}{defaultPortion.price}
                        </span>
                        {dish.originalPrice && (
                          <span className="text-xs text-zinc-500 line-through font-mono tabular-nums">
                            {currentRestaurant.currency}{dish.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectDish(dish)}
                        className="px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                      >
                        {t.customise}
                      </button>

                      <button
                        onClick={() => onQuickAdd(dish, defaultPortion, dish.defaultSpiceLevel)}
                        className="p-2 sm:px-3 sm:py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
                        aria-label={`Quick add ${primaryTitle}`}
                      >
                        <Plus className="w-4 h-4 text-zinc-950" />
                        <span className="hidden sm:inline">{t.addToBag}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
