
import React from 'react';
import { toBengaliNumber } from '../constants';
import html2canvas from 'html2canvas';

interface DonationDetailViewProps {
  donation: any;
  onBack: () => void;
}

const DonationDetailView: React.FC<DonationDetailViewProps> = ({ donation, onBack }) => {
  if (!donation) return null;

  const cardRef = React.useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { 
      backgroundColor: '#020617', 
      scale: 3, 
      logging: false, 
      useCORS: true 
    });
    const link = document.createElement('a');
    link.download = `Thank_You_${donation.name}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const shareCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { 
        backgroundColor: '#020617', 
        scale: 2, 
        useCORS: true 
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `Donation_Card_${donation.name}.png`, { type: 'image/png' });
        
        if (navigator.share) {
          try {
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'রমজান ২০২৬ অনুদান কার্ড',
                text: `${donation.name} এর পক্ষ থেকে একটি অনুদান। জাযাকাল্লাহু খাইরান!`,
              });
            } else {
              await navigator.share({
                title: 'রমজান ২০২৬ অনুদান কার্ড',
                text: `${donation.name} এর পক্ষ থেকে একটি অনুদান। জাযাকাল্লাহু খাইরান!`,
                url: window.location.href,
              });
            }
          } catch (error) {
            console.log('Sharing interrupted');
          }
        } else {
          alert('আপনার ব্রাউজার সরাসরি শেয়ার সাপোর্ট করছে না। অনুগ্রহ করে কার্ডটি ডাউনলোড করে শেয়ার করুন।');
        }
      });
    } catch (err) {
      console.error('Sharing failed', err);
    }
  };

  return (
    <div className="animate-fade-in pb-20 pt-2 h-full flex flex-col">
      {/* Back Header */}
      <div className="flex items-center gap-4 mb-4 px-1">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-all shadow-lg text-slate-400">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
           <h2 className="text-lg font-black text-white leading-tight">অনুদান সারসংক্ষেপ</h2>
           <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Digital Recognition Card</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-1">
        <div 
          ref={cardRef}
          className="glass-card w-full rounded-[44px] p-7 border-emerald-500/20 shadow-[0_30px_70px_-15px_rgba(16,185,129,0.4)] relative overflow-hidden flex flex-col items-center text-center space-y-5"
        >
          {/* Decorative background elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/15 blur-[70px] rounded-full"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-500/15 blur-[70px] rounded-full"></div>
          
          {/* Subtle pattern replacement */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

          {/* User Image - Moved Upwards */}
          <div className="relative group -mt-4">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500 via-teal-300 to-emerald-600 relative z-10 shadow-2xl overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#020617] bg-slate-900">
                <img 
                  src={donation.image} 
                  className="w-full h-full object-cover" 
                  alt={donation.name} 
                  crossOrigin="anonymous" 
                />
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-md z-20 border-[3px] border-[#020617] shadow-xl animate-bounce">
              ❤️
            </div>
          </div>

          {/* Gratitude Message & Highlighted Name */}
          <div className="space-y-2 relative z-10 w-full">
            <div className="flex items-center justify-center gap-2 mb-0.5">
               <div className="h-[1px] w-6 bg-emerald-500/20"></div>
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em]">সম্মানিত দাতা</span>
               <div className="h-[1px] w-6 bg-emerald-500/20"></div>
            </div>
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-emerald-100 drop-shadow-sm tracking-tight px-2 leading-tight">
              {donation.name}
            </h3>
            <div className="bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20 inline-flex items-center gap-2 mt-1">
               <span className="text-emerald-400 font-black text-xl">৳ {toBengaliNumber(donation.amount)}</span>
            </div>
          </div>

          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

          <div className="space-y-3 px-2 relative z-10">
            <p className="text-2xl font-black text-white leading-tight drop-shadow-md">
              "জাযাকাল্লাহু খাইরান!"
            </p>
            <p className="text-slate-400 text-[12px] leading-relaxed font-medium italic opacity-90">
              আপনার এই মহৎ দান কোনো এক অসহায় মানুষের মুখে হাসি ফোটাবে ইনশাআল্লাহ।
            </p>
          </div>

          {/* Details Bar - Optimized for better fit and larger text */}
          <div className="w-full bg-emerald-500/5 rounded-[24px] p-4 border border-emerald-500/10 flex justify-between items-center mt-1 shadow-inner overflow-hidden">
             <div className="text-left flex-1 min-w-0 pr-2">
                <p className="text-[7px] font-black uppercase tracking-widest text-emerald-500/60 mb-0.5">প্রকল্প</p>
                <p className="text-[13px] font-black text-white truncate leading-tight">{donation.message}</p>
             </div>
             <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
             <div className="text-right flex-1 min-w-0 pl-2">
                <p className="text-[7px] font-black uppercase tracking-widest text-emerald-500/60 mb-0.5">তারিখ</p>
                <p className="text-[13px] font-black text-white truncate leading-tight">{toBengaliNumber(new Date().getDate())} ফেব্রুয়ারি, ২০২৬</p>
             </div>
          </div>

          {/* Small Footer Logo */}
          <div className="flex items-center gap-2 opacity-30">
             <span className="text-base">🕌</span>
             <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white">রমজান ২০২৬ ডিজিটাল</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-4 mt-8">
           <button 
             onClick={downloadCard}
             className="bg-white/5 border border-white/10 py-4 rounded-[26px] flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest text-slate-300 active:scale-95 transition-all shadow-xl backdrop-blur-sm"
           >
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              ডাউনলোড
           </button>
           <button 
             onClick={shareCard}
             className="bg-gradient-to-r from-emerald-600 to-teal-500 py-4 rounded-[26px] flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest text-white active:scale-95 transition-all shadow-xl shadow-emerald-900/30 border border-emerald-400/20"
           >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              শেয়ার করুন
           </button>
        </div>
        
        <button 
          onClick={onBack}
          className="mt-6 text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-emerald-400 transition-colors"
        >
          ← হোম পেজে ফিরে যান
        </button>
      </div>
    </div>
  );
};

export default DonationDetailView;
