
import React from 'react';
import { AppTab } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center px-0">
      <nav className="glass-card w-full max-w-md border-t border-x border-white/10 rounded-t-[28px] px-6 pt-2 pb-3 flex justify-between items-center shadow-2xl shadow-emerald-950/60 relative overflow-hidden safe-area-inset-bottom">
        
        {/* Animated Background Indicator */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           <div className="absolute top-0 h-0.5 w-10 bg-emerald-500 rounded-full transition-all duration-500 opacity-50" style={{
             left: `${(NAVIGATION_ITEMS.findIndex(i => i.id === activeTab) * 25) + 12.5}%`,
             transform: 'translateX(-50%)'
           }}></div>
        </div>
        
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as AppTab)}
              className="relative z-10 flex-1 flex flex-col items-center justify-center transition-all duration-300 outline-none active:scale-90"
            >
              <div className={`transition-all duration-300 flex flex-col items-center ${
                isActive ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                <div className={`mb-1 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-95'}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, {
                    className: "w-5 h-5"
                  })}
                </div>
                {/* Labels now always visible as requested */}
                <span className={`text-[8px] font-black tracking-widest uppercase transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
              </div>
              
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-400 active-tab-indicator"></div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
