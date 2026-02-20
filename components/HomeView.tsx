
import React, { useState, useEffect, useRef } from 'react';
import { toBengaliNumber, BANNER_DATA, DONATION_DATA } from '../constants.tsx';
import { AppTab } from '../types.ts';

interface HomeViewProps {
  onTabChange: (tab: AppTab) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onTabChange }) => {
  const [countdown, setCountdown] = useState({ days: '০০', hours: '০০', mins: '০০', secs: '০০' });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [donationIndex, setDonationIndex] = useState(0);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
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
    const donationInterval = setInterval(() => setDonationIndex(prev => (prev + 1) % DONATION_DATA.length), 4000);

    return () => { 
      clearInterval(timer); 
      clearInterval(sliderInterval); 
      clearInterval(donationInterval);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleBannerSwipeEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) setCurrentSlide(s => (s + 1) % BANNER_DATA.length);
      else setCurrentSlide(s => (s - 1 + BANNER_DATA.length) % BANNER_DATA.length);
    }
  };

  const handleDonationSwipeEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) setDonationIndex(prev => (prev + 1) % DONATION_DATA.length);
      else setDonationIndex(prev => (prev - 1 + DONATION_DATA.length) % DONATION_DATA.length);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-24 pt-0">
      <div 
        className="relative h-28 rounded-[24px] overflow-hidden border border-white/5 shadow-lg group touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleBannerSwipeEnd}
      >
        {BANNER_DATA.map((b, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-700 ${currentSlide === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
            <img src={b.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>
        ))}
        <div className="absolute bottom-3 right-4 flex gap-1 z-20">
          {BANNER_DATA.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'w-1.5 bg-white/30'}`} />
          ))}
        </div>
        <div className="absolute bottom-3 left-4 pointer-events-none">
           <p className="text-white font-black text-[10px] uppercase tracking-widest drop-shadow-md">ইবাদতের সেরা মাস</p>
        </div>
      </div>

      <div className="glass-card rounded-[24px] p-3.5 border-white/5 shadow-xl relative overflow-hidden">
        <p className="text-center text-emerald-500/60 text-[8px] font-black uppercase tracking-[0.2em] mb-2.5">রমজানের বাকি</p>
        <div className="grid grid-cols-4 gap-1">
          <CountdownBlock value={countdown.days} label="দিন" />
          <CountdownBlock value={countdown.hours} label="ঘণ্টা" />
          <CountdownBlock value={countdown.mins} label="মিনিট" />
          <CountdownBlock value={countdown.secs} label="সেকেন্ড" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          <h3 className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em]">সাম্প্রতিক অনুদান</h3>
        </div>
        <div 
          className="relative h-14 overflow-hidden perspective-1000 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDonationSwipeEnd}
        >
          {DONATION_DATA.map((donation, idx) => {
            const isCurrent = donationIndex === idx;
            const isPrev = donationIndex === (idx === 0 ? DONATION_DATA.length - 1 : idx - 1);
            let animationClass = "translate-x-[150%] opacity-0 scale-50"; 
            if (isCurrent) animationClass = "translate-x-0 opacity-100 scale-100 z-10";
            if (isPrev) animationClass = "-translate-x-[150%] opacity-0 scale-50 z-0";
            return (
              <div key={idx} className={`absolute inset-0 transition-all duration-[800ms] flex items-center justify-between glass-card px-4 py-1.5 rounded-2xl border-white/5 ${animationClass}`}>
                <div className="flex items-center gap-3">
                  <img src={donation.image} className="w-8 h-8 rounded-full border border-emerald-500/30 object-cover" alt="" />
                  <div className="overflow-hidden">
                    <h4 className="text-white font-bold text-xs leading-none truncate w-32">{donation.name}</h4>
                    <p className="text-slate-500 text-[8px] italic truncate w-32">"{donation.message}"</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-black text-sm block leading-none">৳{toBengaliNumber(donation.amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button className="glass-card p-3 rounded-[20px] text-center border-white/5 group active:scale-95 transition-all">
          <div className="text-lg mb-0.5 group-hover:scale-110 transition-transform">🌙</div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">রোজা রাখার দোয়া</p>
        </button>
        <button className="glass-card p-3 rounded-[20px] text-center border-white/5 group active:scale-95 transition-all">
          <div className="text-lg mb-0.5 group-hover:scale-110 transition-transform">🍽️</div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ইফতারের দোয়া</p>
        </button>
      </div>

      <div className="text-center opacity-10 py-0.5">
        <p className="text-[6px] font-black uppercase tracking-[0.5em] text-slate-500">Premium Ramadan Experience</p>
      </div>
    </div>
  );
};

const CountdownBlock: React.FC<{ value: string, label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-black text-white leading-none mb-0.5">{value}</span>
    <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default HomeView;
