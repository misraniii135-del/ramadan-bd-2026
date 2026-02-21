
import React, { useState } from 'react';
import { toBengaliNumber } from '../constants.tsx';
import { AppTheme } from '../types.ts';

interface SettingsViewProps {
  onClose: () => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onClose, currentTheme, onThemeChange }) => {
  const [alwaysOn, setAlwaysOn] = useState(true);

  const themes = [
    { id: AppTheme.EMERALD, label: 'Emerald Grace', color: 'bg-emerald-500', glow: 'shadow-emerald-500/40' },
    { id: AppTheme.GOLDEN, label: 'Midnight Gold', color: 'bg-amber-500', glow: 'shadow-amber-500/40' },
    { id: AppTheme.INDIGO, label: 'Indigo Peace', color: 'bg-blue-500', glow: 'shadow-blue-500/40' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative w-[85%] max-w-[360px] h-full bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col animate-slide-in-right overflow-hidden">
        
        <div className="px-6 pt-12 pb-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 active:scale-90"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">সেটিংস <span className="text-emerald-400">⚙️</span></h2>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12 space-y-8">
          
          {/* THEME SELECTION SECTION */}
          <section>
            <h4 className="text-slate-500 text-[11px] font-black mb-4 uppercase tracking-[0.2em]">অ্যাপ থিম পরিবর্তন</h4>
            <div className="grid grid-cols-1 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onThemeChange(t.id)}
                  className={`relative flex items-center justify-between p-4 rounded-[22px] border transition-all duration-300 ${
                    currentTheme === t.id 
                    ? 'bg-white/5 border-white/20 shadow-xl' 
                    : 'bg-transparent border-white/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full ${t.color} ${t.glow} shadow-lg border-2 border-white/20`}></div>
                    <span className={`text-sm font-bold ${currentTheme === t.id ? 'text-white' : 'text-slate-400'}`}>{t.label}</span>
                  </div>
                  {currentTheme === t.id && (
                    <div className={`w-2 h-2 rounded-full ${t.color} animate-pulse`}></div>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-slate-500 text-[11px] font-bold mb-4 uppercase tracking-wider">বৈশিষ্ট্য</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <div className="text-xl opacity-60">🕒</div>
                  <span className="text-slate-300 font-medium text-sm">সর্বদা প্রদর্শিত</span>
                </div>
                <button onClick={() => setAlwaysOn(!alwaysOn)} className={`w-10 h-5 rounded-full relative transition-all ${alwaysOn ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${alwaysOn ? 'left-5.5' : 'left-0.5'}`}></div>
                </button>
              </div>
              <SettingItem icon="📖" label="বুকমার্কে যান" />
              <SettingItem icon="🔔" label="নোটিফিকেশন" />
            </div>
          </section>

          <section>
            <h4 className="text-slate-500 text-[11px] font-bold mb-4 uppercase tracking-wider">গোপনীয়তা</h4>
            <div className="space-y-1">
              <SettingItem icon="⭐" label="আমাদের রেট" />
              <SettingItem icon="🛡️" label="গোপনীয়তা নীতি" />
            </div>
          </section>

          <div className="text-center pt-8 pb-4 opacity-30">
            <p className="text-[10px] font-mono tracking-widest text-slate-500">VERSION {toBengaliNumber("12.0")}</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

const SettingItem: React.FC<{ icon: string, label: string }> = ({ icon, label }) => (
  <div className="flex items-center justify-between py-3 cursor-pointer group active:opacity-60">
    <div className="flex items-center gap-4">
      <div className="text-xl grayscale opacity-60 transition-all">{icon}</div>
      <span className="text-slate-300 font-medium text-sm transition-colors">{label}</span>
    </div>
  </div>
);

export default SettingsView;
