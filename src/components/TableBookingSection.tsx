import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, ShieldCheck, AlertCircle, MapPin } from 'lucide-react';
import { SeatingZone, OccasionType, TableBooking, Restaurant } from '../types/restaurant';
import { TIME_SLOTS } from '../data/restaurantData';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface TableBookingSectionProps {
  currentRestaurant: Restaurant;
  onBookingConfirmed: (booking: TableBooking) => void;
  onViewBookings: () => void;
  lang: Language;
}

export const TableBookingSection: React.FC<TableBookingSectionProps> = ({
  currentRestaurant,
  onBookingConfirmed,
  onViewBookings,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const today = new Date();
  const formatDateStr = (date: Date) => date.toISOString().split('T')[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const [selectedZone, setSelectedZone] = useState<SeatingZone>(() => 
    currentRestaurant.seatingZones[0]?.id || 'general'
  );

  useEffect(() => {
    if (currentRestaurant.seatingZones.length > 0) {
      setSelectedZone(currentRestaurant.seatingZones[0].id);
    }
  }, [currentRestaurant.id]);

  const [selectedDate, setSelectedDate] = useState<string>(formatDateStr(today));
  const [selectedMealPeriod, setSelectedMealPeriod] = useState<'lunch' | 'dinner'>('dinner');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('07:30 PM');
  const [guestsCount, setGuestsCount] = useState<number>(4);
  const [occasion, setOccasion] = useState<OccasionType>('Family Gathering');
  const [guestName, setGuestName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<TableBooking | null>(null);

  const currentZoneData = currentRestaurant.seatingZones.find((z) => z.id === selectedZone) 
    || currentRestaurant.seatingZones[0] 
    || { id: 'general', name: 'Main Dining Area', tagline: 'Comfortable seating', capacity: '2-8', description: '', minGuests: 1, maxGuests: 10 };

  const handleSelectZone = (zoneId: SeatingZone) => {
    setSelectedZone(zoneId);
    const z = currentRestaurant.seatingZones.find((item) => item.id === zoneId);
    if (z) {
      if (guestsCount < z.minGuests) {
        setGuestsCount(z.minGuests);
      } else if (guestsCount > z.maxGuests) {
        setGuestsCount(z.maxGuests);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!guestName.trim()) {
      setFormError(lang === 'bn' ? 'অনুগ্রহ করে বুকিংয়ের জন্য আপনার পূর্ণ নাম লিখুন।' : 'Please enter your full name for the reservation.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setFormError(lang === 'bn' ? 'অনুগ্রহ করে একটি সঠিক মোবাইল নম্বর লিখুন।' : 'Please provide a valid contact phone number.');
      return;
    }

    if (guestsCount < currentZoneData.minGuests) {
      setFormError(lang === 'bn'
        ? `${currentZoneData.name}-এর জন্য কমপক্ষে ${currentZoneData.minGuests} জন অতিথি প্রয়োজন।`
        : `${currentZoneData.name} requires at least ${currentZoneData.minGuests} guests.`);
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = currentRestaurant.id.slice(0, 3).toUpperCase();
    const bookingCode = `${prefix}-B${randomSuffix}`;

    const newBooking: TableBooking = {
      id: `booking-${Date.now()}`,
      bookingCode,
      restaurantId: currentRestaurant.id,
      restaurantName: currentRestaurant.name,
      guestName: guestName.trim(),
      phone: phone.trim(),
      email: email.trim() || `${phone.replace(/\D/g, '')}@guest.${currentRestaurant.id}.bd`,
      guestsCount,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      seatingZone: selectedZone,
      seatingZoneName: currentZoneData.name,
      occasion,
      specialRequests: specialRequests.trim(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    onBookingConfirmed(newBooking);
    setConfirmedBooking(newBooking);
  };

  const handleNewBooking = () => {
    setConfirmedBooking(null);
    setGuestName('');
    setPhone('');
    setEmail('');
    setSpecialRequests('');
    setGuestsCount(4);
  };

  const occasionsList: { id: OccasionType; labelBn: string; labelEn: string }[] = [
    { id: 'Family Gathering', labelBn: 'পারিবারিক দাওয়াত ও খাওয়া-দাওয়া', labelEn: 'Family Gathering' },
    { id: 'Birthday Celebration', labelBn: 'জন্মদিন পালন (Birthday Party)', labelEn: 'Birthday Celebration' },
    { id: 'Anniversary Dinner', labelBn: 'বিবাহবার্ষিকী ডিনার (Anniversary)', labelEn: 'Anniversary Dinner' },
    { id: 'Business Dining', labelBn: 'অফিসিয়াল / করপোরেট মিটিং', labelEn: 'Corporate / Business Dining' },
    { id: 'Casual Meal', labelBn: 'সাধারণ বন্ধু বা পরিবারের সাথে আড্ডা', labelEn: 'Casual Lunch / Dinner' },
    { id: 'Royal Banquet Feast', labelBn: 'রাজকীয় ব্যাঙ্কুয়েট ফিস্ট (Royal Feast)', labelEn: 'Royal Banquet Feast' },
  ];

  return (
    <section id="booking-section" className="py-12 lg:py-16 bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            {t.bookingBadge}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t.bookingTitle}
          </h2>
          <p className="text-sm text-zinc-400">
            {t.bookingSubtitle}
          </p>
        </div>

        {confirmedBooking ? (
          /* Confirmation Success Card */
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                {t.bookingSuccessTitle}
              </h3>
              <p className="text-sm text-zinc-300">
                {t.bookingSuccessSubtitle}
              </p>
            </div>

            {/* Ticket Slip */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    {t.bookingReference}
                  </div>
                  <div className="font-mono text-xl font-bold text-amber-400">
                    {confirmedBooking.bookingCode}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Status
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase">
                    {t.guaranteedStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">{t.primaryGuest}</span>
                  <span className="text-zinc-200 font-semibold">{confirmedBooking.guestName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">মোবাইল</span>
                  <span className="text-zinc-200 font-mono">{confirmedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">তারিখ ও সময়</span>
                  <span className="text-zinc-200 font-semibold">
                    {confirmedBooking.date} · {confirmedBooking.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">{t.partySize}</span>
                  <span className="text-zinc-200 font-semibold">
                    {confirmedBooking.guestsCount} জন ({confirmedBooking.occasion})
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 block">{t.reservedArea}</span>
                  <span className="text-amber-300 font-medium">
                    {confirmedBooking.seatingZoneName || currentRestaurant.seatingZones.find((z) => z.id === confirmedBooking.seatingZone)?.name}
                  </span>
                </div>
                {confirmedBooking.specialRequests && (
                  <div className="col-span-2">
                    <span className="text-zinc-500 block">বিশেষ অনুরোধ</span>
                    <span className="text-zinc-300 italic">"{confirmedBooking.specialRequests}"</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-zinc-400 flex items-center gap-2 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.arriveNote}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleNewBooking}
                className="w-full sm:w-1/2 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer text-center"
              >
                {t.bookAnotherBtn}
              </button>
              <button
                onClick={onViewBookings}
                className="w-full sm:w-1/2 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-lg text-xs transition-colors cursor-pointer text-center shadow-sm"
              >
                {t.viewBookingsBtn}
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Reservation Form */
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8"
          >
            {formError && (
              <div className="p-3.5 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Step 1: Seating Zone Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>{t.step1Area}</span>
                </label>
                <span className="text-xs text-zinc-500">
                  {currentZoneData.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentRestaurant.seatingZones.map((zone) => {
                  const isSelected = selectedZone === zone.id;
                  return (
                    <div
                      key={zone.id}
                      onClick={() => handleSelectZone(zone.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 text-white ring-1 ring-amber-400/40'
                          : 'border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-white">
                          {zone.name}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-zinc-400">
                          {zone.capacity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {zone.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Meal Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-800/80">
              
              {/* Date selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                  {t.step2Date}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDate(formatDateStr(today))}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedDate === formatDateStr(today)
                        ? 'border-amber-400 bg-amber-400 text-zinc-950 font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {lang === 'bn' ? 'আজকে' : 'Today'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(formatDateStr(tomorrow))}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedDate === formatDateStr(tomorrow)
                        ? 'border-amber-400 bg-amber-400 text-zinc-950 font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {lang === 'bn' ? 'আগামীকাল' : 'Tomorrow'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(formatDateStr(dayAfter))}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedDate === formatDateStr(dayAfter)
                        ? 'border-amber-400 bg-amber-400 text-zinc-950 font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {lang === 'bn' ? 'পরশু' : 'Day After'}
                  </button>
                </div>
                
                {/* Specific date input */}
                <input
                  type="date"
                  min={formatDateStr(today)}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Time slot period & chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                    {t.step3Time}
                  </label>
                  <div className="flex items-center gap-1 p-0.5 bg-zinc-950 rounded-md border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedMealPeriod('lunch')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        selectedMealPeriod === 'lunch'
                          ? 'bg-amber-400 text-zinc-950 font-bold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {lang === 'bn' ? 'দুপুর' : 'Lunch'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMealPeriod('dinner')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        selectedMealPeriod === 'dinner'
                          ? 'bg-amber-400 text-zinc-950 font-bold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {lang === 'bn' ? 'রাত' : 'Dinner'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS[selectedMealPeriod].map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 text-xs font-mono tabular-nums rounded-lg border text-center transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400 text-zinc-950 font-bold'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Step 3: Guests Count & Occasion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-800/80">
              
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                  {t.step4Guests}
                </label>
                <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5">
                  <button
                    type="button"
                    onClick={() => setGuestsCount(Math.max(currentZoneData.minGuests, guestsCount - 1))}
                    disabled={guestsCount <= currentZoneData.minGuests}
                    className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 rounded text-zinc-200 flex items-center justify-center font-bold text-base cursor-pointer"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-mono tabular-nums text-lg font-bold text-white">
                    {guestsCount} {lang === 'bn' ? 'জন অতিথি' : (guestsCount === 1 ? 'Guest' : 'Guests')}
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuestsCount(Math.min(currentZoneData.maxGuests, guestsCount + 1))}
                    disabled={guestsCount >= currentZoneData.maxGuests}
                    className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 rounded text-zinc-200 flex items-center justify-center font-bold text-base cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <div className="text-[11px] text-zinc-500">
                  {currentZoneData.name} ({currentZoneData.minGuests} – {currentZoneData.maxGuests} {lang === 'bn' ? 'জন' : 'guests'})
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="occasionSelect"
                  className="text-xs font-semibold uppercase tracking-wider text-amber-400 block"
                >
                  {t.step5Occasion}
                </label>
                <select
                  id="occasionSelect"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value as OccasionType)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {occasionsList.map((occ) => (
                    <option key={occ.id} value={occ.id}>
                      {lang === 'bn' ? occ.labelBn : occ.labelEn}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Step 4: Contact Details */}
            <div className="space-y-3 pt-2 border-t border-zinc-800/80">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                {t.step6Contact}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="guestName" className="block text-xs text-zinc-400 mb-1">
                    {t.guestNameLabel}
                  </label>
                  <input
                    id="guestName"
                    type="text"
                    required
                    placeholder={lang === 'bn' ? 'যেমন: ইশতিয়াক শান্ত' : 'e.g. Istiak Shanto'}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label htmlFor="guestPhone" className="block text-xs text-zinc-400 mb-1">
                    {t.guestPhoneLabel}
                  </label>
                  <input
                    id="guestPhone"
                    type="tel"
                    required
                    placeholder="01711-xxxxxx or 018..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-xs text-zinc-400 mb-1">
                  {t.specialRequestsLabel}
                </label>
                <input
                  id="specialRequests"
                  type="text"
                  placeholder={lang === 'bn' ? 'যেমন: বাচ্চাদের চেয়ার, জন্মদিনের মোমবাতি ব্যবস্থা, জানালার পাশের টেবিল...' : 'e.g. High chair for toddler, celebration flower table setup, window side preferred'}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4 text-zinc-950" />
                <span>{t.submitBookingBtn}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
