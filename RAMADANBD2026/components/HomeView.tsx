
import React, { useState, useEffect, useRef } from 'react';
import { toBengaliNumber, getDayTimes, DIVISIONS } from '../constants.tsx';
import { AppTab, IslamicQuote, Banner, AppTheme } from '../types.ts';
import { getDailyIslamicInspiration } from '../services/geminiService.ts';

interface HomeViewProps {
  onTabChange: (tab: AppTab) => void;
  donations: any[];
  banners: Banner[];
  onDonationClick?: (donation: any) => void;
  theme?: AppTheme;
}

type StatusState = 'COUNTDOWN' | 'ADHAN' | 'PRAYER_TIMES';

const HomeView: React.FC<HomeViewProps> = ({ onTabChange, donations, banners, onDonationClick, theme = AppTheme.EMERALD }) => {
  const [countdown, setCountdown] = useState({ hours: '০০', mins: '০০', secs: '০০' });
  const [iftarCountdown, setIftarCountdown] = useState<string>('০০:০০');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quote, setQuote] = useState<IslamicQuote | null>(null);
  const [tasbihCount, setTasbihCount] = useState(0);
  const [ramadanDay, setRamadanDay] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState(DIVISIONS[0].districts[0]);
  const [statusState, setStatusState] = useState<StatusState>('COUNTDOWN');
  const [nextPrayer, setNextPrayer] = useState({ label: '', time: '' });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getThemeConfig = () => {
    switch(theme) {
      case AppTheme.GOLDEN: return { primary: 'emerald-500', textAccent: 'text-amber-400', accentGlow: 'rgba(251, 191, 36, 0.4)', btnGradient: 'from-amber-500 to-orange-600' };
      case AppTheme.INDIGO: return { primary: 'blue-500', textAccent: 'text-blue-400', accentGlow: 'rgba(59, 130, 246, 0.4)', btnGradient: 'from-blue-500 to-indigo-600' };
      default: return { primary: 'emerald-500', textAccent: 'text-emerald-400', accentGlow: 'rgba(52, 211, 153, 0.4)', btnGradient: 'from-emerald-500 to-teal-600' };
    }
  };

  const t = getThemeConfig();

  useEffect(() => {
    const saved = localStorage.getItem('selected_district');
    if (saved) {
      setSelectedDistrict(JSON.parse(saved));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=10&addressdetails=1&accept-language=bn`;
            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();
            const addr = data.address || {};
            const city = addr.city || addr.state_district || addr.town || addr.suburb || addr.district || "";
            for (const div of DIVISIONS) {
              const match = div.districts.find(d => city.includes(d.name) || d.name.includes(city));
              if (match) {
                setSelectedDistrict(match);
                localStorage.setItem('selected_district', JSON.stringify(match));
                break;
              }
            }
          } catch (e) {}
        },
        () => {},
        { timeout: 8000 }
      );
    }
    getDailyIslamicInspiration().then(res => { if(res) setQuote(res); });
  }, []);

  const updateNextPrayer = (day: number, offset: number) => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const baseSehri = 295 - Math.floor(day / 6); 
    const baseMaghrib = 1092 + Math.floor(day / 4);
    const pTimes = [
      { label: 'ফজর নামাজ', mins: (baseSehri - 10) + offset },
      { label: 'জোহর নামাজ', mins: 725 + offset },
      { label: 'আসর নামাজ', mins: 985 + offset },
      { label: 'মাগরিব নামাজ', mins: baseMaghrib + offset },
      { label: 'এশা নামাজ', mins: (baseMaghrib + 75) + offset },
    ];
    const upcoming = pTimes.find(p => p.mins > currentMins) || pTimes[0];
    const formatTime = (min: number) => {
      const h = Math.floor(min / 60) % 12 || 12;
      const m = min % 60;
      return toBengaliNumber(`${h}:${m.toString().padStart(2, '0')}`);
    };
    setNextPrayer({ label: upcoming.label, time: formatTime(upcoming.mins) });
  };

  useEffect(() => {
    const updateTimes = () => {
      const ramadanStart = new Date("2026-02-18T00:00:00").getTime();
      const now = new Date();
      const nowTime = now.getTime();
      const diff = ramadanStart - nowTime;

      if (diff < 0) {
        const daysPassed = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24)) + 1;
        setRamadanDay(Math.min(daysPassed, 30));
      }

      const baseMaghribMin = 1092 + Math.floor(ramadanDay / 4) + selectedDistrict.offset;
      const maghribDate = new Date(now);
      maghribDate.setHours(Math.floor(baseMaghribMin / 60), baseMaghribMin % 60, 0, 0);
      const timeDiffMs = maghribDate.getTime() - nowTime;

      if (now.getHours() >= 0 && now.getHours() < 4 && statusState !== 'COUNTDOWN') {
        setStatusState('COUNTDOWN');
      }

      if (timeDiffMs <= 0) {
        const passedMins = Math.abs(timeDiffMs) / (1000 * 60);
        if (passedMins < 4) { 
          if (statusState !== 'ADHAN') {
            setStatusState('ADHAN');
            playAdhan();
          }
        } else {
          if (statusState !== 'PRAYER_TIMES') {
             setStatusState('PRAYER_TIMES');
             updateNextPrayer(ramadanDay, selectedDistrict.offset);
          }
        }
        setIftarCountdown('০০:০০');
      } else {
        if (statusState !== 'COUNTDOWN') setStatusState('COUNTDOWN');
        const totalSecs = Math.floor(timeDiffMs / 1000);
        const m = Math.floor(totalSecs / 60);
        const s = totalSecs % 60;
        setIftarCountdown(toBengaliNumber(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`));
      }

      if (diff > 0) {
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ 
          hours: toBengaliNumber(h.toString().padStart(2, '0')), 
          mins: toBengaliNumber(m.toString().padStart(2, '0')), 
          secs: toBengaliNumber(s.toString().padStart(2, '0')) 
        });
      }
    };
    const timer = setInterval(updateTimes, 1000);
    const sliderInterval = setInterval(() => { if (!isPaused && banners.length > 0) setCurrentSlide(s => (s + 1) % banners.length); }, 6000);
    return () => { clearInterval(timer); clearInterval(sliderInterval); };
  }, [ramadanDay, selectedDistrict, statusState, isPaused, banners.length]);

  const playAdhan = () => {
    try {
        if (!audioRef.current) {
          audioRef.current = new Audio('https://www.islamcan.com/audio/adhan/azan1.mp3');
        }
        audioRef.current.play().catch(() => {
            const triggerOnNextClick = () => {
                audioRef.current?.play().catch(()=>{});
                window.removeEventListener('click', triggerOnNextClick);
            };
            window.addEventListener('click', triggerOnNextClick);
        });
        audioRef.current.onended = () => {
          setStatusState('PRAYER_TIMES');
          updateNextPrayer(ramadanDay, selectedDistrict.offset);
        };
    } catch(e) {}
  };

  return (
    <div className="space-y-6 animate-fade-in pb-32 pt-2">
      {/* 1. DYNAMIC TOP STATUS BOX - ULTRA SLIM VERSION */}
      <div 
        onClick={() => onTabChange(AppTab.PRAYER)}
        className="relative overflow-hidden glass-card rounded-[28px] p-4 border-white/10 shadow-2xl group transition-all active:scale-[0.98] cursor-pointer min-h-[90px] flex flex-col justify-center"
      >
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none transition-transform duration-[20s] linear group-hover:scale-110" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542810634-7bc27a9cd030?q=80&w=800')", backgroundSize: 'cover', backgroundPosition: 'center top' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/80 to-transparent z-0"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white drop-shadow-lg">আজ {toBengaliNumber(ramadanDay)} রমজান</span>
              <span className={`bg-${t.primary}/20 ${t.textAccent} text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest border border-${t.primary}/20`}>Live</span>
            </div>
            <p className="text-[8px] font-bold text-slate-400 mt-0.5 flex items-center gap-1 uppercase tracking-tighter">
              <span className={`w-1 h-1 rounded-full bg-${t.primary} shadow-[0_0_6px_${t.accentGlow}] animate-pulse`}></span>
              {selectedDistrict.name}
            </p>
          </div>
          
          <div className="flex flex-col items-end text-right">
            {statusState === 'COUNTDOWN' && (
              <>
                <p className="text-[8px] font-black text-amber-500/80 uppercase tracking-[0.2em] mb-0.5">ইফতারে বাকি</p>
                <span className="text-4xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)] leading-none tabular-nums">
                  {iftarCountdown}
                </span>
              </>
            )}

            {statusState === 'ADHAN' && (
              <div className="flex items-center gap-2 animate-pulse">
                <span className="text-2xl">🕌</span>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">আজান চলছে...</p>
              </div>
            )}

            {statusState === 'PRAYER_TIMES' && (
              <div className="flex flex-col items-end animate-fade-in">
                <span className="text-4xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)] tabular-nums leading-none">
                  {nextPrayer.time}
                </span>
                <span className="text-[9px] font-black text-white uppercase tracking-widest mt-1">
                  {nextPrayer.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. PREMIUM COUNTDOWN CARD (UNCHANGED) */}
      <div className="relative group perspective-1000">
        <div className="relative glass-card rounded-[32px] p-6 border-white/10 overflow-hidden premium-glow">
          <div className="flex flex-col items-center relative z-10">
            <div className="bg-white/5 px-4 py-1 rounded-full border border-white/10 mb-5 backdrop-blur-md">
              <span className={`text-[10px] font-black ${t.textAccent} uppercase tracking-[0.3em]`}>সেহরি শেষ হতে বাকি</span>
            </div>
            <div className="flex items-center gap-4">
              <TimeBlock value={countdown.hours} label="ঘণ্টা" />
              <span className="text-3xl font-black text-white/10 animate-pulse mb-4">:</span>
              <TimeBlock value={countdown.mins} label="মিনিট" />
              <span className="text-3xl font-black text-white/10 animate-pulse mb-4">:</span>
              <TimeBlock value={countdown.secs} label="সেকেন্ড" color={t.textAccent} glow={t.accentGlow} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC BANNER SLIDER */}
      <div className="relative h-44 rounded-[32px] overflow-hidden shadow-2xl border border-white/5 group">
        {banners.map((b, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-1000 ${currentSlide === i ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
            <img src={b.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
          </div>
        ))}
        <div className="absolute bottom-6 right-6 flex gap-1.5 z-30">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all duration-500 ${currentSlide === i ? `w-8 bg-${t.primary} shadow-lg` : 'w-2 bg-white/20'}`} />
          ))}
        </div>
      </div>

      {/* 4. DONATION & TOOLS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-[28px] p-4 flex flex-col items-center justify-center text-center active-scale cursor-pointer shadow-xl group" onClick={() => setTasbihCount(prev => prev + 1)}>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">ডিজিটাল তাসবিহ</p>
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.btnGradient} flex items-center justify-center text-white font-black text-2xl mb-2 shadow-lg border-2 border-white/20`}>{toBengaliNumber(tasbihCount)}</div>
          <span className={`text-[8px] font-bold ${t.textAccent} uppercase tracking-widest animate-pulse`}>ট্যাপ করুন</span>
        </div>
        <div className="glass-card rounded-[28px] p-4 flex flex-col items-center justify-center text-center active-scale cursor-pointer shadow-xl group" onClick={() => onTabChange(AppTab.ASSISTANT)}>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">স্মার্ট সহকারী</p>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl mb-2 shadow-lg border-2 border-white/20">🤖</div>
          <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">প্রশ্ন করুন</span>
        </div>
      </div>

      {/* 5. DAILY INSPIRATION */}
      <div className="relative overflow-hidden glass-card rounded-[32px] p-6 border-amber-500/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">📖</div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">দিনের অনুপ্রেরণা</h3>
        </div>
        {quote ? (
          <div className="animate-fade-in relative z-10">
            <p className="text-base leading-relaxed text-slate-100 mb-3 font-semibold italic">"{quote.text}"</p>
            <p className="text-[9px] font-black text-amber-500/80 uppercase tracking-widest">— {quote.reference}</p>
          </div>
        ) : (
          <div className={`w-4 h-4 border-2 border-${t.primary}/20 border-t-${t.primary} rounded-full animate-spin mx-auto`}></div>
        )}
      </div>
    </div>
  );
};

const TimeBlock: React.FC<{ value: string, label: string, color?: string, glow?: string }> = ({ value, label, color = "text-white", glow = "transparent" }) => (
  <div className="flex flex-col items-center">
    <span className={`text-4xl font-black ${color} leading-none tracking-tighter`} style={{ textShadow: `0 0 15px ${glow}` }}>{value}</span>
    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-2">{label}</span>
  </div>
);

export default HomeView;
