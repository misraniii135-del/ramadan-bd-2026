
import React, { useState, useEffect } from 'react';
import { AppTab, Banner, AppTheme } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Header from './components/Header.tsx';
import HomeView from './components/HomeView.tsx';
import PrayerTimes from './components/PrayerTimes.tsx';
import DonationView from './components/DonationView.tsx';
import AssistantView from './components/AssistantView.tsx';
import SettingsView from './components/SettingsView.tsx';
import DonationDetailView from './components/DonationDetailView.tsx';
import { INITIAL_DONATIONS, BANNER_DATA } from './constants.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('app_theme') as AppTheme) || AppTheme.EMERALD;
  });
  
  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('app_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });
  const [banners] = useState<Banner[]>(BANNER_DATA);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('app_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('app_theme', currentTheme);
  }, [currentTheme]);

  const hideGlobalHeader = activeTab === AppTab.PRAYER || 
                           activeTab === AppTab.DONATION || 
                           activeTab === AppTab.ASSISTANT || 
                           activeTab === AppTab.DONATION_DETAILS;

  const handleNewDonation = (newDonation: any) => {
    setDonations([newDonation, ...donations]);
  };

  const openDonationDetails = (donation: any) => {
    setSelectedDonation(donation);
    setActiveTab(AppTab.DONATION_DETAILS);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME: 
        return <HomeView onTabChange={setActiveTab} donations={donations} banners={banners} onDonationClick={openDonationDetails} theme={currentTheme} />;
      case AppTab.PRAYER: 
        return <PrayerTimes onBackToHome={() => setActiveTab(AppTab.HOME)} theme={currentTheme} />;
      case AppTab.DONATION: 
        return <DonationView onBackToHome={() => setActiveTab(AppTab.HOME)} onDonate={handleNewDonation} theme={currentTheme} />;
      case AppTab.ASSISTANT: 
        return <AssistantView onBackToHome={() => setActiveTab(AppTab.HOME)} theme={currentTheme} />;
      case AppTab.DONATION_DETAILS: 
        return <DonationDetailView donation={selectedDonation} onBack={() => setActiveTab(AppTab.HOME)} theme={currentTheme} />;
      default: 
        return <HomeView onTabChange={setActiveTab} donations={donations} banners={banners} onDonationClick={openDonationDetails} theme={currentTheme} />;
    }
  };

  // Dynamic Background Colors based on Theme
  const getThemeBg = () => {
    switch(currentTheme) {
      case AppTheme.GOLDEN: return 'bg-[#0c0a09]'; // Stone/Coffee Black
      case AppTheme.INDIGO: return 'bg-[#020817]'; // Deep Blue
      default: return 'bg-[#020617]'; // Default Emerald Black
    }
  };

  const getGlowColors = () => {
    switch(currentTheme) {
      case AppTheme.GOLDEN: return { primary: 'bg-amber-600/10', secondary: 'bg-orange-600/10' };
      case AppTheme.INDIGO: return { primary: 'bg-blue-600/10', secondary: 'bg-indigo-600/10' };
      default: return { primary: 'bg-emerald-600/10', secondary: 'bg-blue-600/10' };
    }
  };

  const glows = getGlowColors();

  return (
    <div className={`min-h-screen ${getThemeBg()} text-slate-200 overflow-x-hidden transition-colors duration-700 flex flex-col`}>
      {/* Dynamic Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] right-[-10%] w-[80%] h-[80%] ${glows.primary} blur-[120px] rounded-full animate-pulse transition-all duration-1000`}></div>
        <div className={`absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] ${glows.secondary} blur-[120px] rounded-full transition-all duration-1000`}></div>
        {/* Subtle Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      </div>

      <Header onSettingsClick={() => setShowSettings(true)} activeTab={activeTab} forceHide={hideGlobalHeader} theme={currentTheme} />

      <main className={`relative z-10 flex-1 max-w-md mx-auto w-full px-5 transition-all duration-500 ${
        hideGlobalHeader ? 'pt-2' : 'pt-20'
      }`}>
        <div className="animate-fade-in h-full">
          {renderContent()}
        </div>
      </main>

      {showSettings && <SettingsView onClose={() => setShowSettings(false)} currentTheme={currentTheme} onThemeChange={setCurrentTheme} />}
      
      {activeTab !== AppTab.DONATION_DETAILS && <Navbar activeTab={activeTab} onTabChange={setActiveTab} theme={currentTheme} />}
    </div>
  );
};

export default App;
