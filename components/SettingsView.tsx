
import React, { useState } from 'react';
import { toBengaliNumber } from '../constants';

interface SettingsViewProps {
  onClose: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onClose }) => {
  const [alwaysOn, setAlwaysOn] = useState(true);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Semi-transparent Backdrop with strong blur to show home page behind */}
      <div 
        className="absolute inset-0 bg-[#020617]/40 backdrop-blur-md animate-fade-in transition-all" 
        onClick={onClose}
      />
      
      {/* Side Drawer Container - Sliding from Right */}
      <div className="relative w-[85%] max-w-[360px] h-full bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col animate-slide-in-right overflow-hidden">
        
        {/* Header Area */}
        <div className="px-6 pt-12 pb-4 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            সেটিংস <span className="text-emerald-400">⚙️</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12 space-y-8">
          {/* Premium Upgrade Banner */}
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#064e3b] to-[#065f46] p-6 shadow-lg shadow-emerald-950/40">
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white leading-tight mb-4">
                আপগ্রেড<br/>প্রিমিয়াম
              </h3>
              <button className="bg-white text-emerald-900 px-6 py-2 rounded-full font-bold text-xs hover:scale-105 active:scale-95 transition-transform shadow-lg">
                এখনই কিনুন
              </button>
            </div>
            
            <div className="absolute top-2 -right-2 w-32 h-32 opacity-80 pointer-events-none">
               <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-200/30">
                  <path d="M70 20C70 20 45 25 45 50C45 75 70 80 70 80C55 80 35 70 35 50C35 30 55 20 70 20Z" fill="currentColor" />
               </svg>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 text-[9px] font-black text-white/90 text-center whitespace-nowrap -rotate-12">
                 Ramadan<br/>Mubarak
                 <div className="flex gap-0.5 justify-center mt-0.5 scale-75">
                   <span className="text-amber-400">✦</span>
                   <span className="text-amber-400">✦</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Features Section */}
          <section>
            <h4 className="text-slate-500 text-[11px] font-bold mb-4 uppercase tracking-wider">বৈশিষ্ট্য</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <div className="text-xl opacity-60">🕒</div>
                  <span className="text-slate-300 font-medium text-sm">সর্বদা প্রদর্শিত</span>
                </div>
                <button 
                  onClick={() => setAlwaysOn(!alwaysOn)}
                  className={`w-10 h-5 rounded-full transition-all duration-300 relative ${alwaysOn ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${alwaysOn ? 'left-5.5' : 'left-0.5'}`}></div>
                </button>
              </div>

              <SettingItem icon="📖" label="বুকমার্কে যান" />
              <SettingItem icon="🌐" label="ভাষা" />
            </div>
          </section>

          {/* Privacy Section */}
          <section>
            <h4 className="text-slate-500 text-[11px] font-bold mb-4 uppercase tracking-wider">গোপনীয়তা</h4>
            <div className="space-y-1">
              <SettingItem icon="⭐" label="আমাদের রেট" />
              <SettingItem icon="📤" label="ভাগ" />
              <SettingItem icon="📝" label="প্রতিক্রিয়া" />
              <SettingItem icon="🛡️" label="গোপনীয়তা নীতি" />
            </div>
          </section>

          {/* Suggested Apps Section */}
          <section>
            <h4 className="text-slate-500 text-[11px] font-bold mb-4 uppercase tracking-wider">প্রস্তাবিত অ্যাপস</h4>
            <div className="space-y-3">
              <AppPromoCard 
                name="Al Quran Kareem" 
                developer="E-ALIM TECHNOLOGY LIMITED" 
                icon="📗" 
                ad 
              />
              <AppPromoCard 
                name="Prayer Times" 
                developer="E-ALIM TECHNOLOGY LIMITED" 
                icon="🕋" 
                ad 
              />
            </div>
          </section>

          {/* Footer Version */}
          <div className="text-center pt-8 pb-4 opacity-30">
            <p className="text-[10px] font-mono tracking-widest text-slate-500">
              VERSION {toBengaliNumber("11.7")}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const SettingItem: React.FC<{ icon: string, label: string }> = ({ icon, label }) => (
  <div className="flex items-center justify-between py-3 cursor-pointer group active:opacity-60">
    <div className="flex items-center gap-4">
      <div className="text-xl grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
        {icon}
      </div>
      <span className="text-slate-300 group-hover:text-white font-medium text-sm transition-colors">{label}</span>
    </div>
  </div>
);

const AppPromoCard: React.FC<{ name: string, developer: string, icon: string, ad?: boolean }> = ({ name, developer, icon, ad }) => (
  <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/5 transition-all active:scale-[0.98]">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shadow-inner">
        {icon}
      </div>
      <div>
        <h5 className="text-white font-bold text-xs leading-none mb-1">{name}</h5>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] text-slate-500 font-bold uppercase truncate max-w-[100px]">{developer}</span>
          {ad && (
            <span className="bg-amber-500/10 text-amber-500 text-[7px] px-1 rounded border border-amber-500/20 font-black">AD</span>
          )}
        </div>
      </div>
    </div>
    <button className="bg-slate-700 hover:bg-emerald-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full transition-all">
      পান
    </button>
  </div>
);

export default SettingsView;
