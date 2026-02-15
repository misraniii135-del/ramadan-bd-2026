
import React from 'react';

export const RAMADAN_START_DATE = "2026-02-18T00:00:00";

export const BENGALI_NUMERALS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export const toBengaliNumber = (num: number | string): string => {
  return num.toString().split('').map(char => BENGALI_NUMERALS[char] || char).join('');
};

export const INITIAL_DONATIONS = [
  { name: "আরিফ হোসেন", amount: "৫০০", image: "https://ui-avatars.com/api/?name=Arif+Hossen&background=059669&color=fff", message: "মসজিদ ফান্ডে দান" },
  { name: "ফাতেমা জোহরা", amount: "১০০০", image: "https://ui-avatars.com/api/?name=Fatema+Zohra&background=0891b2&color=fff", message: "এতিম সহায়তা" },
  { name: "তানজিল আহমেদ", amount: "২০০", image: "https://ui-avatars.com/api/?name=Tanjil+Ahmed&background=4f46e5&color=fff", message: "ইফতার বিতরণ" }
];

export const BANNER_DATA = [
  { image: "https://images.unsplash.com/photo-1542810634-7bc27a9cd030?q=80&w=800", link: "#" },
  { image: "https://images.unsplash.com/photo-1597933534024-1736d5d60da1?q=80&w=800", link: "#" }
];

export const NAVIGATION_ITEMS = [
  { id: 'home', label: 'হোম', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { id: 'prayer', label: 'সময়সূচী', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { id: 'donation', label: 'অনুদান', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
  { id: 'assistant', label: 'সহকারী', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> }
];
