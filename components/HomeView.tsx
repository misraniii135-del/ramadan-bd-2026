
import React, { useState, useEffect, useRef } from 'react';
import { toBengaliNumber, BANNER_DATA } from '../constants.tsx';
import { AppTab, IslamicQuote } from '../types.ts';
import { getDailyIslamicInspiration } from '../services/geminiService.ts';

interface HomeViewProps {
  onTabChange: (tab: AppTab) => void;
  donations: any[];
  onDonationClick?: (donation: any) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onTabChange, donations, onDonationClick }) => {
  const [countdown, setCountdown] = useState({ days: '০০', hours: '০০', mins: '০০', secs: '০০' });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [donationIndex, setDonationIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quote, setQuote] = useState<IslamicQuote | null>(null);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    // Fetch daily inspiration using Gemini
    getDailyIslamicInspiration().then(setQuote);

    const updateCountdown = () => {
      const ramadanStart = new Date("2026-02-18T00:00:00").getTime();
      const now = new Date().getTime();
      const diff = ramadanStart - now;

      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({
          days: toBengaliNumber(d.toString().padStart(2, '0')),
          hours: toBengaliNumber(h.toString().padStart(2, '0')),
          mins: toBengaliNumber(m.toString().padStart(2, '0')),
          secs: toBengaliNumber(s.toString().padStart(2, '0'))
        });
      }
    };

    const timer = setInterval(updateCountdown, 1000);
    const sliderInterval = setInterval(() => setCurrentSlide(s => (s + 1) % BANNER_DATA.length), 6000);
    
    let donationInterval: any;
    if (!isPaused && donations.length > 0) {
      donationInterval = setInterval(() => setDonationIndex(prev => (prev + 1) % donations.length), 4000);
    }

    return () => { 
      clearInterval(timer); 
      clearInterval(sliderInterval); 
      if (donationInterval) clearInterval(donationInterval);
    };
  }, [donations.length, isPaused]);

  const handleDonationSwipeEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) setDonationIndex(prev => (prev + 1) % donations.length);
      else setDonationIndex(prev => (prev - 1 + donations.length) % donations.length);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-28 pt-0">
      {/* Banner Area */}
      <div className="relative h-32 rounded-[28px] overflow-hidden border border-white/5 shadow-xl">
        {BANNER_DATA.map((b, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-1000 ${currentSlide === i ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
            <img src={b.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          </div>
        ))}
        <div className="absolute bottom-4 right-5 flex gap-1.5 z-20">
          {BANNER_DATA.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-6 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'w-1.5 bg-white/20'}`} />
          ))}
        </div>
        <div className="absolute bottom-4 left-5 pointer-events-none">
           <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] drop-shadow-lg">Ramadan Kareem</p>
        </div>
      </div>

      {/* Countdown Area */}
      <div className="glass-card rounded-[28px] p-4 border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
        <p className="text-center text-emerald-500/60 text-[9px] font-black uppercase tracking-[0.3em] mb-3">রমজানের বাকি</p>
        <div className="grid grid-cols-4 gap-2">
          <CountdownBlock value={countdown.days} label="দিন" />
          <CountdownBlock value={countdown.hours} label="ঘণ্টা" />
          <CountdownBlock value={countdown.mins} label="মিনিট" />
          <CountdownBlock value={countdown.secs} label="সেকেন্ড" />
        </div>
      </div>

      {/* 1. Recent Donations List - PLACED ABOVE INSPIRATION */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <h3 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">সাম্প্রতিক অনুদান</h3>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">
            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">LIVE</span>
          </div>
        </div>
        <div 
          className="relative h-20 overflow-hidden perspective-1000 touch-pan-y"
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; setIsPaused(true); }}
          onTouchEnd={() => { handleDonationSwipeEnd(); setTimeout(() => setIsPaused(false), 5000); }}
        >
          {donations.length > 0 ? donations.map((donation, idx) => {
            const isCurrent = donationIndex === idx;
            const isPrev = donationIndex === (idx === 0 ? donations.length - 1 : idx - 1);
            let animationClass = "translate-x-[120%] opacity-0 scale-75"; 
            if (isCurrent) animationClass = "translate-x-0 opacity-100 scale-100 z-10";
            if (isPrev) animationClass = "-translate-x-[120%] opacity-0 scale-75 z-0";
            
            return (
              <div 
                key={idx} 
                onClick={() => onDonationClick?.(donation)}
                className={`absolute inset-0 transition-all duration-[700ms] cubic-bezier(0.4, 0, 0.2, 1) flex items-center justify-between glass-card px-4 py-3 rounded-2xl border-white/5 shadow-xl cursor-pointer active:bg-emerald-500/10 ${animationClass}`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 overflow-hidden flex-shrink-0 shadow-lg p-0.5">
                    <img src={donation.image} className="w-full h-full object-cover rounded-full" alt="" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-white font-bold text-sm leading-none truncate w-40">{donation.name}</h4>
                    <p className="text-slate-500 text-[9px] italic truncate w-40 mt-1.5 opacity-80">"{donation.message}"</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end">
                  <span className="text-emerald-400 font-black text-sm block leading-none">৳{toBengaliNumber(donation.amount)}</span>
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="text-[6px] text-slate-500 uppercase font-bold tracking-tighter">দেখুন</span>
                    <svg className="w-2 h-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="glass-card w-full h-full rounded-2xl flex items-center justify-center border-white/5 italic text-slate-500 text-xs">
              কোনো অনুদান পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>

      {/* 2. Verse of the Day (Gemini Powered) - PLACED BELOW DONATIONS */}
      <div className="glass-card rounded-[28px] p-5 border-emerald-500/10 shadow-lg relative overflow-hidden bg-emerald-500/5 group hover:border-emerald-500/20 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-125 transition-transform">
           <span className="text-4xl">🕌</span>
        </div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-lg">📖</span>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">আজকের অনুপ্রেরণা</h3>
        </div>
        {quote ? (
          <div className="animate-fade-in">
            <p className="text-[13px] font-medium leading-relaxed text-slate-200 mb-2 italic">"{quote.text}"</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">— {quote.reference}</p>
          </div>
        ) : (
          <div className="h-10 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onTabChange(AppTab.PRAYER)}
          className="glass-card p-4 rounded-[24px] text-center border-white/5 group active:scale-95 transition-all bg-gradient-to-br from-white/[0.03] to-transparent"
        >
          <div className="text-2xl mb-1.5 transition-transform group-hover:scale-110 group-hover:-rotate-6">📅</div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">সময়সূচী</p>
        </button>
        <button 
          onClick={() => onTabChange(AppTab.ASSISTANT)}
          className="glass-card p-4 rounded-[24px] text-center border-white/5 group active:scale-95 transition-all bg-gradient-to-br from-white/[0.03] to-transparent"
        >
          <div className="text-2xl mb-1.5 transition-transform group-hover:scale-110 group-hover:rotate-6">🤖</div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">এআই সহকারী</p>
        </button>
      </div>
    </div>
  );
};

const CountdownBlock: React.FC<{ value: string, label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-black text-white leading-none mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{value}</span>
    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</span>
  </div>
);

export default HomeView;