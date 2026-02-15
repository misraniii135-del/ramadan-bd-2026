
import React, { useState } from 'react';
import { AppTab } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Header from './components/Header.tsx';
import HomeView from './components/HomeView.tsx';
import PrayerTimes from './components/PrayerTimes.tsx';
import DonationView from './components/DonationView.tsx';
import AssistantView from './components/AssistantView.tsx';
import SettingsView from './components/SettingsView.tsx';
import DonationDetailView from './components/DonationDetailView.tsx';
import { INITIAL_DONATIONS } from './constants.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [showSettings, setShowSettings] = useState(false);
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

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
        return <HomeView onTabChange={setActiveTab} donations={donations} onDonationClick={openDonationDetails} />;
      case AppTab.PRAYER: 
        return <PrayerTimes onBackToHome={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.DONATION: 
        return <DonationView onBackToHome={() => setActiveTab(AppTab.HOME)} onDonate={handleNewDonation} />;
      case AppTab.ASSISTANT: 
        return <AssistantView onBackToHome={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.DONATION_DETAILS: 
        return <DonationDetailView donation={selectedDonation} onBack={() => setActiveTab(AppTab.HOME)} />;
      default: 
        return <HomeView onTabChange={setActiveTab} donations={donations} onDonationClick={openDonationDetails} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden selection:bg-emerald-500/30 flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <Header onSettingsClick={() => setShowSettings(true)} activeTab={activeTab} forceHide={hideGlobalHeader} />

      <main className={`relative z-10 flex-1 max-w-md mx-auto w-full px-5 transition-all duration-500 ${
        hideGlobalHeader ? 'pt-2' : 'pt-20'
      }`}>
        <div className="animate-fade-in h-full">
          {renderContent()}
        </div>
      </main>

      {showSettings && <SettingsView onClose={() => setShowSettings(false)} />}
      
      {activeTab !== AppTab.DONATION_DETAILS && <Navbar activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
};

export default App;
