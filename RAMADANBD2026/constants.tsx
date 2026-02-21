
import React from 'react';

export const RAMADAN_START_DATE = "2026-02-18T00:00:00";

export const BENGALI_NUMERALS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export const toBengaliNumber = (num: number | string): string => {
  return num.toString().split('').map(char => BENGALI_NUMERALS[char] || char).join('');
};

export const BANNER_DATA = [
  { 
    image: "https://images.unsplash.com/photo-1542810634-7bc27a9cd030?q=80&w=800", 
    link: "https://www.youtube.com/watch?v=xvFZjo5PgG0", 
    isYoutube: true 
  },
  { 
    image: "https://images.unsplash.com/photo-1597933534024-1736d5d60da1?q=80&w=800", 
    link: "#",
    isYoutube: false 
  },
  {
    image: "https://images.unsplash.com/photo-1519811541454-754663f02613?q=80&w=800",
    link: "https://www.youtube.com/watch?v=68-45pQ0p8U",
    isYoutube: true
  }
];

export const INITIAL_DONATIONS = [
  { name: "আরিফ হোসেন", amount: "৫০০", image: "https://ui-avatars.com/api/?name=Arif+Hossen&background=059669&color=fff", message: "মসজিদ ফান্ডে দান" },
  { name: "ফাতেমা জোহরা", amount: "১০০০", image: "https://ui-avatars.com/api/?name=Fatema+Zohra&background=0891b2&color=fff", message: "এতিম সহায়তা" },
  { name: "তানজিল আহমেদ", amount: "২০০", image: "https://ui-avatars.com/api/?name=Tanjil+Ahmed&background=4f46e5&color=fff", message: "イফতার বিতরণ" }
];

export const DIVISIONS = [
  { name: 'ঢাকা', offset: 0, icon: '🕌', color: 'from-emerald-400 to-teal-600', districts: [{ name: 'ঢাকা', offset: 0 }, { name: 'গাজীপুর', offset: 0 }, { name: 'নারায়ণগঞ্জ', offset: 0 }, { name: 'মানিকগঞ্জ', offset: 1 }, { name: 'নরসিংদী', offset: -1 }, { name: 'ফরিদপুর', offset: 2 }, { name: 'গোপালগঞ্জ', offset: 3 }, { name: 'টাঙ্গাইল', offset: 1 }] },
  { name: 'চট্টগ্রাম', offset: -5, icon: '⚓', color: 'from-blue-400 to-indigo-600', districts: [{ name: 'চট্টগ্রাম', offset: -5 }, { name: 'কক্সবাজার', offset: -6 }, { name: 'কুমিল্লা', offset: -3 }, { name: 'নোয়াখালী', offset: -4 }, { name: 'ফেনী', offset: -4 }, { name: 'চাঁদপুর', offset: -2 }] },
  { name: 'রাজশাহী', offset: 6, icon: '🥭', color: 'from-orange-400 to-red-600', districts: [{ name: 'রাজশাহী', offset: 6 }, { name: 'বগুড়া', offset: 4 }, { name: 'পাবনা', offset: 5 }, { name: 'নাটোর', offset: 5 }, { name: 'সিরাজগঞ্জ', offset: 3 }] },
  { name: 'খুলনা', offset: 5, icon: '🐅', color: 'from-teal-400 to-cyan-600', districts: [{ name: 'খুলনা', offset: 5 }, { name: 'যশোর', offset: 6 }, { name: 'সাতক্ষীরা', offset: 7 }, { name: 'বাগেরহাট', offset: 5 }, { name: 'কুষ্টিয়া', offset: 5 }, { name: 'ঝিনাইদহ', offset: 5 }] },
  { name: 'সিলেট', offset: -6, icon: '☕', color: 'from-purple-400 to-pink-600', districts: [{ name: 'সিলেট', offset: -6 }, { name: 'সুনামগঞ্জ', offset: -5 }, { name: 'হবিগঞ্জ', offset: -4 }] },
  { name: 'বরিশাল', offset: 2, icon: '⛴️', color: 'from-cyan-400 to-blue-600', districts: [{ name: 'বরিশাল', offset: 2 }, { name: 'পটুয়াখালী', offset: 2 }, { name: 'ভোলা', offset: 1 }] },
  { name: 'রংপুর', offset: 6, icon: '🏛️', color: 'from-red-400 to-orange-600', districts: [{ name: 'রংপুর', offset: 6 }, { name: 'দিনাজপুর', offset: 8 }, { name: 'পঞ্চগড়', offset: 9 }] },
  { name: 'ময়মনসিংহ', offset: 0, icon: '🌲', color: 'from-indigo-400 to-purple-600', districts: [{ name: 'ময়মনসিংহ', offset: 0 }, { name: 'শেরপুর', offset: 1 }, { name: 'জামালপুর', offset: 1 }] }
];

export const getDayTimes = (dayNum: number, offset: number) => {
  const baseSehri = 295 - Math.floor(dayNum / 6); 
  const baseMaghrib = 1092 + Math.floor(dayNum / 4);
  
  const baseFajr = baseSehri - 10;
  const baseDhuhr = 725;
  const baseAsr = 985;
  const baseIsha = baseMaghrib + 75;

  const format = (min: number) => {
    const h = Math.floor(min / 60) % 12 || 12;
    const m = min % 60;
    return toBengaliNumber(`${h}:${m.toString().padStart(2, '0')}`);
  };

  return { 
    sehri: format(baseSehri + offset), 
    maghrib: format(baseMaghrib + offset),
    fajr: format(baseFajr + offset),
    dhuhr: format(baseDhuhr + offset),
    asr: format(baseAsr + offset),
    isha: format(baseIsha + offset)
  };
};

export const NAVIGATION_ITEMS = [
  { id: 'home', label: 'হোম', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { id: 'prayer', label: 'সময়সূচী', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { id: 'donation', label: 'অনুদান', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
  { id: 'assistant', label: 'সহকারী', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> }
];
