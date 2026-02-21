
import React, { useState, useRef, useEffect } from 'react';
import { toBengaliNumber, DIVISIONS, getDayTimes } from '../constants.tsx';
import html2canvas from 'html2canvas';

interface PrayerTimesProps {
  onBackToHome?: () => void;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ onBackToHome }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [expandedDiv, setExpandedDiv] = useState<string | null>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const saved = localStorage.getItem('selected_district');
    if (saved) {
      setSelectedDistrict(JSON.parse(saved));
    }
  }, []);

  const handleDistrictSelect = (dist: any) => {
    setSelectedDistrict(dist);
    localStorage.setItem('selected_district', JSON.stringify(dist));
  };

  const handleGoBack = () => {
    setSelectedDistrict(null);
    setTimeout(() => { setExpandedDiv(null); }, 1000);
  };

  const downloadCard = async (id: number) => {
    const element = cardRefs.current[id];
    if (!element) return;
    const downloadBtn = element.querySelector('.download-btn') as HTMLElement;
    if (downloadBtn) downloadBtn.style.display = 'none';
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#020617', scale: 3, logging: false, useCORS: true });
      const link = document.createElement('a');
      link.download = `Ramadan_Day_${id}_${selectedDistrict.name}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) { console.error('Download failed', err); }
    finally { if (downloadBtn) downloadBtn.style.display = 'flex'; }
  };

  if (selectedDistrict) {
    return (
      <div className="animate-fade-in pb-32">
        <div className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-2xl py-3 flex items-center gap-4 px-1 border-b border-white/5">
          <button onClick={handleGoBack} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-all shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h2 className="text-lg font-black text-white leading-tight">{selectedDistrict.name}</h2>
            <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-[0.2em]">রমজান ক্যালেন্ডার ২০২৬</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {[...Array(30)].map((_, i) => {
            const dayNum = i + 1;
            const times = getDayTimes(dayNum, selectedDistrict.offset);
            const ramadanDate = 18 + dayNum;
            const isToday = new Date().getDate() === ramadanDate && new Date().getMonth() === 1;
            return (
              <div key={dayNum} ref={el => { cardRefs.current[dayNum] = el; }} className={`glass-card p-5 rounded-[32px] border-white/5 relative overflow-hidden transition-all duration-500 shadow-xl ${isToday ? 'ring-2 ring-emerald-500 bg-emerald-500/5 scale-[1.01] shadow-emerald-500/20' : ''}`}>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg ${isToday ? 'bg-emerald-500 text-white' : 'bg-white/10 text-emerald-400'}`}>
                      <span className="text-lg leading-none">{toBengaliNumber(dayNum)}</span>
                      <span className="text-[7px] uppercase mt-0.5 tracking-widest">রমজান</span>
                    </div>
                    <div>
                      <h4 className="text-white font-black text-md">{toBengaliNumber(ramadanDate)} ফেব্রুয়ারি, ২০২৬</h4>
                    </div>
                  </div>
                  <button onClick={() => downloadCard(dayNum)} className="download-btn w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all active:scale-90 border border-emerald-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
                    <p className="text-[8px] text-slate-500 font-black uppercase mb-1.5 tracking-widest">সেহরির শেষ</p>
                    <span className="text-xl font-black text-white">{times.sehri}</span>
                  </div>
                  <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/10 backdrop-blur-sm">
                    <p className="text-[8px] text-emerald-500/70 font-black uppercase mb-1.5 tracking-widest">ইফতারের সময়</p>
                    <span className="text-xl font-black text-emerald-400">{times.maghrib}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pt-4 pb-32 px-1">
      <div className="relative flex items-center justify-center mb-10 px-2 h-14">
        <button 
          onClick={onBackToHome}
          className="absolute left-2 w-11 h-11 rounded-[18px] bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-all shadow-lg text-slate-400 hover:text-white z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        <div className="relative w-[70%] max-w-[280px] text-center flex flex-col items-center group">
           <div className="absolute inset-0 bg-emerald-500/20 blur-2xl opacity-40 rounded-full group-hover:opacity-60 transition-opacity"></div>
           <div className="relative glass-card bg-emerald-500/5 border border-emerald-500/20 px-4 py-2.5 rounded-[22px] shadow-2xl flex flex-col items-center w-full">
              <h2 className="text-xl font-black text-white tracking-[0.1em] drop-shadow-lg">সময়সূচী</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></div>
                 <p className="text-[7px] text-emerald-400/80 font-black uppercase tracking-[0.4em]">Ramadan 2026</p>
                 <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="text-center mb-8 px-4">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] opacity-80">বাংলাদেশের জেলা ভিত্তিক ক্যালেন্ডার</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DIVISIONS.map((div) => {
          const isExpanded = expandedDiv === div.name;
          return (
            <div key={div.name} className={`transition-all duration-500 ease-in-out ${isExpanded ? 'col-span-2' : 'col-span-1'}`}>
              <button 
                onClick={() => setExpandedDiv(isExpanded ? null : div.name)}
                className={`w-full glass-card p-3.5 rounded-[24px] flex items-center gap-3 transition-all duration-500 border-white/5 shadow-lg active:scale-95 ${isExpanded ? 'bg-emerald-500/10 ring-2 ring-emerald-500/30 border-emerald-500/20' : 'hover:bg-white/5'}`}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${div.color} flex-shrink-0 flex items-center justify-center text-white shadow-lg transition-all duration-500 ${isExpanded ? 'scale-110 shadow-emerald-500/40' : 'scale-100 opacity-90'}`}>
                  <span className="text-xl leading-none">{div.icon}</span>
                </div>
                <div className="text-left overflow-hidden">
                  <h4 className="text-[15px] font-black text-white leading-tight mb-0.5 truncate">{div.name}</h4>
                  <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest opacity-60">{toBengaliNumber(div.districts.length)} জেলা</p>
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-2 gap-2 p-3 bg-black/40 rounded-[28px] border border-white/10 backdrop-blur-md">
                  {div.districts.map((dist, idx) => (
                    <button 
                      key={dist.name} 
                      style={{ animationDelay: `${idx * 40}ms` }} 
                      onClick={() => handleDistrictSelect(dist)} 
                      className="glass-card bg-white/5 p-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 active:bg-emerald-500/20 active:scale-95 transition-all text-slate-400 hover:text-white animate-emerge"
                    >
                      {dist.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerTimes;
