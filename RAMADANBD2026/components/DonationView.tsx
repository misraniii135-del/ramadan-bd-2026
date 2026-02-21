
import React, { useState, useRef } from 'react';
import { toBengaliNumber } from '../constants';

const DONATION_CAUSES = [
  { id: 'masjid', label: 'মসজিদ', icon: '🕌' },
  { id: 'orphan', label: 'এতিম', icon: '🧒' },
  { id: 'iftar', label: 'ইফতার', icon: '🍲' },
  { id: 'winter', label: 'শীতবস্ত্র', icon: '🧣' },
  { id: 'quran', label: 'কুরআন', icon: '📖' },
  { id: 'sadaqah', label: 'সদকাহ', icon: '🤲' },
];

const PAYMENT_METHODS = [
  { id: 'bkash', name: 'বিকাশ', color: '#D12053' },
  { id: 'nagad', name: 'নগদ', color: '#F7941E' },
  { id: 'rocket', name: 'রকেট', color: '#8C3494' },
];

interface DonationViewProps {
  onBackToHome?: () => void;
  onDonate?: (donation: any) => void;
}

const DonationView: React.FC<DonationViewProps> = ({ onBackToHome, onDonate }) => {
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setErrors(prev => ({ ...prev, image: false }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCauseToggle = (id: string) => {
    setSelectedCause(prev => prev === id ? null : id);
    setErrors(prev => ({ ...prev, cause: false }));
  };

  const handlePaymentToggle = (id: string) => {
    setSelectedPayment(prev => prev === id ? null : id);
    setErrors(prev => ({ ...prev, payment: false }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    const amtNum = parseInt(amount);

    if (!name.trim()) newErrors.name = true;
    if (!amount || isNaN(amtNum) || amtNum < 10 || amtNum > 10000) newErrors.amount = true;
    if (!selectedCause) newErrors.cause = true;
    if (!selectedPayment) newErrors.payment = true;
    if (!image) newErrors.image = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const causeObj = DONATION_CAUSES.find(c => c.id === selectedCause);
    
    const newDonation = {
      name: name,
      amount: amount,
      image: image,
      message: `${causeObj?.label} তহবিলে দান`
    };

    setIsSuccess(true);
    setTimeout(() => {
      onDonate?.(newDonation);
      onBackToHome?.();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-4xl animate-bounce shadow-2xl shadow-emerald-500/40">✅</div>
        <h2 className="text-2xl font-black text-white">আলহামদুলিল্লাহ!</h2>
        <p className="text-slate-400 text-sm px-10">আপনার অনুদানটি সফলভাবে গৃহীত হয়েছে। আল্লাহ আপনার দান কবুল করুন।</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-3 pb-24 px-1 pt-2 max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
      
      {/* Header Box */}
      <div className="relative flex items-center justify-center mb-1 px-2 h-10">
        <button onClick={onBackToHome} className="absolute left-2 w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-all text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="glass-card bg-emerald-500/5 border border-emerald-500/20 px-5 py-1 rounded-full shadow-lg">
          <h2 className="text-sm font-black text-white tracking-widest uppercase">অনুদান ফরম</h2>
        </div>
      </div>

      <div className="glass-card rounded-[32px] p-5 border-white/5 shadow-2xl space-y-5">
        
        {/* 1. Emotional Header & Cause Toggle */}
        <div className="space-y-4 relative">
          <div className="flex flex-col items-center text-center px-2">
             <div className="bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 mb-4 shadow-inner">
                <p className={`text-[10px] font-black leading-relaxed ${errors.cause ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                   "আপনার সামান্য দানে হাসবে কোনো দুঃখী মুখ,<br/>পরকালে মিলবে অফুরন্ত সুখ"
                </p>
             </div>
             <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {DONATION_CAUSES.map((cause) => {
              const isActive = selectedCause === cause.id;
              return (
                <button
                  key={cause.id}
                  onClick={() => handleCauseToggle(cause.id)}
                  className={`flex flex-col items-center py-2.5 px-1 rounded-2xl transition-all border-2 ${
                    isActive ? 'bg-emerald-500/20 border-emerald-500 shadow-xl scale-105' : (errors.cause ? 'bg-red-500/5 border-red-500/20 text-slate-700' : 'bg-white/5 border-white/5 text-slate-600')
                  }`}
                >
                  <span className={`text-xl mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>{cause.icon}</span>
                  <span className={`text-[9px] font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>{cause.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Inputs Group */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className={`text-[8px] font-bold uppercase tracking-widest ml-1 ${errors.name ? 'text-red-500' : 'text-slate-500'}`}>
              আপনার নাম {errors.name && ' (প্রয়োজন)'}
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if(e.target.value) setErrors(prev => ({...prev, name: false})); }}
              placeholder="নাম লিখুন"
              className={`w-full bg-slate-900/40 border rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none transition-all ${
                errors.name ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/5 focus:border-emerald-500/30'
              }`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className={`text-[8px] font-bold uppercase tracking-widest ${errors.amount ? 'text-red-500' : 'text-slate-500'}`}>
                টাকার পরিমাণ {errors.amount && ' (১০ - ১০,০০০)'}
              </label>
            </div>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg ${errors.amount ? 'text-red-500' : 'text-emerald-400'}`}>৳</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setErrors(prev => ({...prev, amount: false})); }}
                placeholder="১০ - ১০,০০০"
                className={`w-full bg-slate-900/40 border rounded-xl py-3 pl-10 pr-4 text-xl font-black text-white focus:outline-none transition-all ${
                  errors.amount ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/5 focus:border-emerald-500/30'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 3. Payment Toggle */}
        <div className="space-y-2">
          <label className={`text-[8px] font-bold uppercase tracking-widest block text-center ${errors.payment ? 'text-red-500' : 'text-slate-500'}`}>
            পেমেন্ট মেথড {errors.payment && '(প্রয়োজন)'}
          </label>
          <div className="flex gap-2">
            {PAYMENT_METHODS.map((method) => {
              const isActive = selectedPayment === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => handlePaymentToggle(method.id)}
                  className={`flex-1 py-3 rounded-2xl border-2 text-[10px] font-black transition-all ${
                    isActive ? 'text-white border-current bg-white/5' : (errors.payment ? 'border-red-500/20 text-slate-700' : 'border-white/5 text-slate-600')
                  }`}
                  style={{ color: isActive ? method.color : undefined, borderColor: isActive ? method.color : undefined }}
                >
                  {method.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Skinny Selfie Upload Section */}
        <div className="space-y-2">
           <div 
             onClick={() => fileInputRef.current?.click()}
             className={`w-full h-14 rounded-2xl border-2 border-dashed flex items-center px-4 cursor-pointer transition-all overflow-hidden relative group ${
               errors.image ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/10' : (image ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10')
             }`}
           >
             {image ? (
               <div className="flex items-center gap-3 w-full">
                 <img src={image} alt="Selfie" className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/20" />
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-emerald-400">ছবি তোলা হয়েছে ✅</p>
                 </div>
                 <span className="text-[7px] text-slate-500 font-bold uppercase">পরিবর্তন করুন</span>
               </div>
             ) : (
               <div className="flex items-center gap-3 w-full">
                 <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform text-emerald-500 border border-emerald-500/20">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
                 <div className="flex-1">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${errors.image ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                      {errors.image ? 'সেলফি তোলা হয়নি ❌' : 'আপনার সেলফি তুলুন 🤳'}
                    </p>
                 </div>
                 <div className="text-slate-700">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                 </div>
               </div>
             )}
           </div>
           <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" capture="user" className="hidden" />
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 py-4 rounded-[24px] font-black text-white shadow-xl shadow-emerald-950/40 active:scale-95 transition-all mt-1 uppercase tracking-widest text-xs border border-white/5"
        >
          অনুদান নিশ্চিত করুন
        </button>
      </div>
    </div>
  );
};

export default DonationView;
