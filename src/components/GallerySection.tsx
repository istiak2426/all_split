import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { GalleryItem, MenuItem, Restaurant } from '../types/restaurant';
import { GALLERY_ITEMS, ALL_RESTAURANTS } from '../data/restaurantData';
import { GalleryLightbox } from './GalleryLightbox';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface GallerySectionProps {
  currentRestaurant: Restaurant;
  onOrderDish: (dish: MenuItem) => void;
  onBookTable: () => void;
  lang: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  currentRestaurant,
  onOrderDish,
  onBookTable,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: lang === 'bn' ? 'সকল প্রদর্শনী' : 'All Showcase' },
    { id: 'sizzling', label: lang === 'bn' ? 'সিজলিং ও গ্রিল' : 'Sizzling & Grills' },
    { id: 'ambiance', label: lang === 'bn' ? 'রেস্টুরেন্ট অন্দরমহল' : 'Ambiance' },
    { id: 'culinary', label: lang === 'bn' ? 'সিগনেচার খাবার' : 'Signature Dishes' },
  ];

  // Gallery items for active restaurant or all
  const itemsPool = currentRestaurant.galleryItems.length > 0 
    ? currentRestaurant.galleryItems 
    : ALL_RESTAURANTS.flatMap(r => r.galleryItems);

  const filteredItems = itemsPool.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="gallery-section" className="py-12 lg:py-16 bg-zinc-950 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              {t.galleryBadge}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t.galleryTitle}
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              {t.gallerySubtitle}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-zinc-950 font-bold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const displayTitle = lang === 'bn' && item.bengaliTitle ? item.bengaliTitle : item.title;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/90 cursor-pointer transition-all duration-300 hover:border-amber-400/50 hover:shadow-xl hover:-translate-y-1 flex flex-col"
              >
                <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-zinc-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                  
                  {/* Overlay hover icon indicator */}
                  <div className="absolute top-3 right-3 p-2 bg-zinc-950/70 backdrop-blur-sm rounded-lg border border-zinc-800 text-zinc-300 group-hover:text-amber-400 group-hover:border-amber-400/50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-3 left-3.5 right-3.5 text-xs">
                    <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase block">
                      {item.categoryLabel}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5">
                      {displayTitle}
                    </h3>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">{t.inspectClick}</span>
                    <span className="text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
                      {t.viewDetails}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <GalleryLightbox
          currentRestaurant={currentRestaurant}
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onOrderDish={onOrderDish}
          onBookTable={onBookTable}
          lang={lang}
        />
      )}
    </section>
  );
};
