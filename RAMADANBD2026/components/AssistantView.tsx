
import React, { useState, useRef, useEffect } from 'react';
import { askIslamicAssistant } from '../services/geminiService';

interface Message {
  text: string;
  isAi: boolean;
  isAdmin?: boolean;
  time: string;
}

interface AssistantViewProps {
  onBackToHome?: () => void;
}

const AssistantView: React.FC<AssistantViewProps> = ({ onBackToHome }) => {
  const [activeMode, setActiveMode] = useState<'ai' | 'admin'>('ai');
  const [messages, setMessages] = useState<Message[]>([
    { text: "আসসালামু আলাইকুম! আমি আপনার ইসলামি সহকারী। রমজান বা ইসলাম বিষয়ে আপনার যেকোনো প্রশ্ন করতে পারেন।", isAi: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [adminMessages, setAdminMessages] = useState<Message[]>([
    { text: "সরাসরি এডমিন সাপোর্ট। অ্যাপ সংক্রান্ত কোনো সমস্যা বা পরামর্শ থাকলে এখানে লিখুন।", isAi: true, isAdmin: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, adminMessages, activeMode]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (activeMode === 'ai') {
      setMessages(prev => [...prev, { text: userMsg, isAi: false, time }]);
      setInput("");
      setLoading(true);

      try {
        const aiRes = await askIslamicAssistant(userMsg);
        setMessages(prev => [...prev, { text: aiRes, isAi: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } catch (err) {
        setMessages(prev => [...prev, { text: "দুঃখিত, বর্তমানে এআই সিস্টেমে কিছু সমস্যা হচ্ছে।", isAi: true, time: "" }]);
      } finally {
        setLoading(false);
      }
    } else {
      // Manual Admin Message Simulation
      setAdminMessages(prev => [...prev, { text: userMsg, isAi: false, isAdmin: true, time }]);
      setInput("");
      setLoading(true);
      
      // Simulate Admin Receipt
      setTimeout(() => {
        setAdminMessages(prev => [...prev, { 
          text: "জাযাকাল্লাহ! আপনার বার্তাটি আমাদের সার্ভারে জমা হয়েছে। শীঘ্রই আমাদের একজন প্রতিনিধি আপনার সাথে যোগাযোগ করবেন ইনশাআল্লাহ।", 
          isAi: true, 
          isAdmin: true, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setLoading(false);
      }, 1500);
    }
  };

  const currentMessages = activeMode === 'ai' ? messages : adminMessages;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-fade-in pt-4">
      
      {/* PERFECTLY CENTERED Stylized Header Box */}
      <div className="relative flex items-center justify-center mb-2 px-2 h-14 flex-shrink-0">
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
           <div className="relative glass-card bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-[22px] shadow-2xl flex flex-col items-center w-full">
              <h2 className="text-xl font-black text-white tracking-[0.1em] drop-shadow-lg leading-tight">সহকারী</h2>
              <p className="text-[7px] text-emerald-400/80 font-black uppercase tracking-[0.4em] mb-1">Islamic Digital Help</p>
           </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-4 flex-shrink-0">
        <div className="bg-white/5 p-1 rounded-2xl flex border border-white/5 shadow-inner">
          <button 
            onClick={() => setActiveMode('ai')}
            className={`px-6 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeMode === 'ai' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            এআই সহকারী
          </button>
          <button 
            onClick={() => setActiveMode('admin')}
            className={`px-6 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeMode === 'admin' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            অ্যাডমিন চ্যাট
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 px-1 pb-10 pt-2">
        {currentMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'} items-end gap-2`}>
            {msg.isAi && (
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 shadow-lg border ${msg.isAdmin ? 'bg-blue-500/20 border-blue-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
                {msg.isAdmin ? '👤' : '🤖'}
              </div>
            )}
            <div className={`max-w-[85%] relative group`}>
              <div className={`p-4 rounded-[24px] shadow-xl border ${
                msg.isAi 
                  ? 'bg-white/5 text-slate-200 rounded-bl-none border-white/5' 
                  : `rounded-br-none border-white/10 text-white ${msg.isAdmin ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-emerald-600 to-teal-700'}`
              }`}>
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 block opacity-40 ${msg.isAi ? 'text-left' : 'text-right'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-center gap-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] border ${activeMode === 'admin' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
              {activeMode === 'admin' ? '👤' : '🤖'}
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-[20px] rounded-bl-none">
              <div className="flex gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${activeMode === 'admin' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${activeMode === 'admin' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${activeMode === 'admin' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area - Adjusted for Bottom Placement closer to Nav */}
      <div className="mt-auto py-2 px-1 flex-shrink-0 pb-1">
        <div className={`relative glass-card bg-white/5 border rounded-[28px] p-1.5 flex items-center gap-2 shadow-2xl transition-all ${activeMode === 'admin' ? 'focus-within:border-blue-500/30' : 'focus-within:border-emerald-500/30'} border-white/10`}>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={activeMode === 'ai' ? "এআইকে প্রশ্ন করুন..." : "অ্যাডমিনকে মেসেজ দিন..."}
            className="flex-1 bg-transparent border-none rounded-none px-4 py-2.5 text-sm focus:outline-none placeholder:text-slate-600 text-white font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-2xl transition-all shadow-lg active:scale-90 disabled:opacity-30 disabled:grayscale ${
              loading 
                ? 'bg-slate-700' 
                : (activeMode === 'admin' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-900/40')
            }`}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantView;
