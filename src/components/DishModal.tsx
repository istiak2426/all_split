import React, { useState } from 'react';
import { X, Plus, Minus, Check, Clock, Users, Star } from 'lucide-react';
import { MenuItem, PortionOption, SpiceLevel } from '../types/restaurant';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface DishModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    portion: PortionOption,
    spiceLevel: SpiceLevel,
    quantity: number,
    specialInstructions: string
  ) => void;
  lang: Language;
}

export const DishModal: React.FC<DishModalProps> = ({
  dish,
  onClose,
  onAddToCart,
  lang,
}) => {
  if (!dish) return null;
  const t = TRANSLATIONS[lang];

  const [selectedPortion, setSelectedPortion] = useState<PortionOption>(
    dish.portionOptions[0]
  );
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel>(
    dish.defaultSpiceLevel
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  const totalPrice = selectedPortion.price * quantity;

  const handleAdd = () => {
    onAddToCart(dish, selectedPortion, selectedSpice, quantity, specialInstructions);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const spiceLabels: Record<SpiceLevel, { bn: string; en: string }> = {
    'Non-Spicy': { bn: 'ঝাল ছাড়া', en: 'Non-Spicy' },
    'Mild': { bn: 'মৃদু ঝাল', en: 'Mild' },
    'Medium': { bn: 'মাঝারি ঝাল', en: 'Medium' },
    'Szechuan Fiery': { bn: 'সিচুয়ান অতিরিক্ত ঝাল', en: 'Szechuan Fiery' },
  };

  const primaryTitle = lang === 'bn' && dish.bengaliName ? dish.bengaliName : dish.name;
  const secondaryTitle = lang === 'bn' && dish.bengaliName ? dish.name : dish.bengaliName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Dish Image */}
          <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-1.5 font-medium bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-zinc-800">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {dish.preparationTimeMinutes} {t.modalPreparationTime}
              </span>
              <span className="flex items-center gap-1 font-medium bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-zinc-800">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-mono tabular-nums">{dish.rating}</span>
                <span className="text-zinc-500 font-mono tabular-nums">({dish.reviewsCount})</span>
              </span>
            </div>
          </div>

          {/* Dish Header Info */}
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <span className="capitalize">{dish.category.replace('_', ' & ')}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{lang === 'bn' ? '১০০% হালাল' : '100% Halal'}</span>
              {dish.isChefSpecial && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="text-amber-300">{lang === 'bn' ? 'শেফস স্পেশাল' : 'Chef’s Signature'}</span>
                </>
              )}
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-2xl font-bold text-white">
                {primaryTitle}
              </h2>
            </div>
            {secondaryTitle && (
              <p className="text-sm text-zinc-400 font-normal mt-0.5">
                {secondaryTitle}
              </p>
            )}

            <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Key Ingredients */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div className="pt-2 border-t border-zinc-900">
              <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                {t.modalIngredients}
              </h4>
              <div className="flex flex-wrap gap-1.5 text-xs text-zinc-300">
                {dish.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portion Selector */}
          <div className="pt-2 border-t border-zinc-900 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                {t.modalSelectPortion}
              </h4>
              <span className="text-xs text-zinc-500">{t.modalPortionSubtitle}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dish.portionOptions.map((opt) => {
                const isSelected = selectedPortion.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedPortion(opt)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-white">
                        {opt.label}
                      </div>
                      <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Users className="w-3 h-3 text-zinc-500" />
                        <span>{opt.serves}</span>
                      </div>
                    </div>
                    <div className="font-mono tabular-nums text-base font-bold text-amber-400">
                      {RESTAURANT_INFO.currency}{opt.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spice Level Selector */}
          {dish.availableSpiceLevels && dish.availableSpiceLevels.length > 1 && (
            <div className="pt-2 border-t border-zinc-900 space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                {t.modalSelectSpice}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dish.availableSpiceLevels.map((lvl) => {
                  const isSelected = selectedSpice === lvl;
                  const label = spiceLabels[lvl]?.[lang] || lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedSpice(lvl)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400 text-zinc-950 font-bold'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions Note */}
          <div className="pt-2 border-t border-zinc-900 space-y-2">
            <label
              htmlFor="specialNotes"
              className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider"
            >
              {t.modalNotesLabel}
            </label>
            <input
              id="specialNotes"
              type="text"
              placeholder={t.modalNotesPlaceholder}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

        </div>

        {/* Modal Sticky Bottom Controls */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-4">
          
          {/* Quantity stepper */}
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white disabled:opacity-30 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-mono tabular-nums text-sm font-bold text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-bold transition-all shadow-md cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-zinc-950'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.addedToBag}</span>
              </>
            ) : (
              <>
                <span>{t.addToBag}</span>
                <span className="font-mono tabular-nums font-bold">
                  {RESTAURANT_INFO.currency}{totalPrice}
                </span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
