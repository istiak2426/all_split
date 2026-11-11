import React from 'react';
import { X, Calendar, Trash2, Phone, CheckCircle } from 'lucide-react';
import { TableBooking } from '../types/restaurant';
import { SEATING_ZONES, RESTAURANT_INFO } from '../data/restaurantData';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface BookingsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: TableBooking[];
  onCancelBooking: (bookingId: string) => void;
  onOpenNewBooking: () => void;
  lang: Language;
}

export const BookingsListModal: React.FC<BookingsListModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onOpenNewBooking,
  lang,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-white">
              {lang === 'bn' ? `আমার টেবিল বুকিং তালিকা (${bookings.length}টি)` : `My Table Reservations (${bookings.length})`}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {bookings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-300">
                {lang === 'bn' ? 'আপনার কোনো সক্রিয় টেবিল বুকিং নেই।' : 'You have no active table reservations at Dhaka Castle Restaurant.'}
              </p>
              <p className="text-xs text-zinc-500">
                {lang === 'bn' ? 'পরিবার বা বন্ধুদের নিয়ে ৪২ জনসন রোডে রাজকীয় ডাইনিং করতে চান?' : 'Planning a royal feast or a family dinner at 42 Johnson Road?'}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewBooking();
                }}
                className="mt-3 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {t.heroBookCta}
              </button>
            </div>
          ) : (
            bookings.map((booking) => {
              const zoneInfo = SEATING_ZONES.find((z) => z.id === booking.seatingZone);
              return (
                <div
                  key={booking.id}
                  className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-amber-400">
                          {booking.bookingCode}
                        </span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {t.guaranteedStatus}
                        </span>
                      </div>
                      <div className="text-xs text-white font-semibold mt-0.5">
                        {booking.restaurantName || RESTAURANT_INFO.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-medium">
                        {booking.seatingZoneName || zoneInfo?.name || 'Reserved Hall'}
                      </div>
                    </div>

                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer p-1"
                      title="Cancel reservation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'বাতিল করুন' : 'Cancel'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
                    <div>
                      <span className="text-zinc-500 block">{lang === 'bn' ? 'তারিখ' : 'Date'}</span>
                      <span className="text-zinc-200 font-semibold">{booking.date}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">{lang === 'bn' ? 'সময়' : 'Time'}</span>
                      <span className="text-zinc-200 font-semibold">{booking.timeSlot}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">{lang === 'bn' ? 'অতিথি' : 'Guests'}</span>
                      <span className="text-zinc-200 font-semibold">{booking.guestsCount} {lang === 'bn' ? 'জন' : 'Persons'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">{lang === 'bn' ? 'উপলক্ষ' : 'Occasion'}</span>
                      <span className="text-zinc-200 font-semibold">{booking.occasion}</span>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 flex items-center justify-between">
                    <div>
                      <span className="text-zinc-500">{lang === 'bn' ? 'সংরক্ষিত নাম: ' : 'Reserved for: '}</span>
                      <span className="text-zinc-200">{booking.guestName}</span> ({booking.phone})
                    </div>
                    <a
                      href={`tel:${RESTAURANT_INFO.phone}`}
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{lang === 'bn' ? 'হটলাইন ডেস্ক' : 'Host Desk'}</span>
                    </a>
                  </div>

                  {booking.specialRequests && (
                    <div className="text-[11px] text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800 italic">
                      {lang === 'bn' ? 'বিশেষ অনুরোধ:' : 'Special requests:'} "{booking.specialRequests}"
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {bookings.length > 0 && (
          <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {lang === 'bn' ? `সময় পরিবর্তনের জন্য কল করুন: ${RESTAURANT_INFO.phone}` : `Need to reschedule? Call ${RESTAURANT_INFO.phone}`}
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenNewBooking();
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              {t.bookAnotherBtn}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
