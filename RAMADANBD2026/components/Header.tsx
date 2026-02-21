
import React from 'react';
import { toBengaliNumber } from '../constants';
import { AppTab } from '../types';

interface HeaderProps {
  onSettingsClick: () => void;
  activeTab: AppTab;
  forceHide?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, activeTab, forceHide }) => {
  const today = new Date();
  const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const dateStr = `${toBengaliNumber(today.getDate())} ${monthNames[today.getMonth()]}`;

  if (forceHide) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] flex justify-center px-4 pt-1 safe-area-inset-top">
      <div className="glass-card w-full max-w-md border border-white/10 rounded-[20px] px-5 py-2 flex items-center justify-between shadow-xl shadow-emerald-950/40 transition-all duration-500">
        
        <div className="flex items-center gap-3">
          {/* Classic Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 p-[1px] border border-white/10 shadow-inner">
            <div className="w-full h-full rounded-xl bg-[#020617] flex items-center justify-center overflow-hidden">
              <span className="text-lg">🕌</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[14px] font-black text-emerald-400 leading-none uppercase tracking-wider mb-0.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">রমজান ২০২৬</h2>
            <p className="text-[9px] text-slate-500 font-bold tracking-tight opacity-80">{dateStr}</p>
          </div>
        </div>
        
        <button 
          onClick={onSettingsClick}
          aria-label="Settings"
          className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 active:scale-90 transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
