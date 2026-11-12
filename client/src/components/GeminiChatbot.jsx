import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  X, 
  Bot, 
  User, 
  Maximize2, 
  Minimize2,
  Sparkles
} from 'lucide-react';

export default function GeminiChatbot({ user, isSettingsOpen = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: `Hey **${user?.name || 'Dost'}**! 👋 Attendance, 50m geofence rules, 5-minute QR scan, ya timetable se related koi bhi sawal ho — bejhijhak pucho! Main hamesha tumhari help ke liye yahan hoon. 🚀✨`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Hide completely when any modal is open
  const [hideForModal, setHideForModal] = useState(false);
  useEffect(() => {
    const checkModal = () => {
      setHideForModal(document.body.classList.contains('modal-backdrop-active'));
    };
    checkModal();
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage(''); // Clear immediately so user can type next question without delay
    setLoading(true);

    try {
      let data = null;

      // Primary fast endpoint: direct port 5000 if on localhost, else relative /api
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const primaryUrl = isLocal ? 'http://localhost:5000/api/gemini/chat' : '/api/gemini/chat';
      const fallbackUrl = primaryUrl === '/api/gemini/chat' ? 'http://localhost:5000/api/gemini/chat' : '/api/gemini/chat';

      try {
        const res = await fetch(primaryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            userContext: {
              name: user?.name,
              role: user?.role,
              rollNo: user?.rollNo,
              classSection: user?.classSection
            }
          }),
          signal: AbortSignal.timeout(7000)
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (err1) {
        console.warn('Primary chatbot fetch failed, trying secondary...', err1);
      }

      if (!data || !data.success) {
        try {
          const res2 = await fetch(fallbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              userContext: {
                name: user?.name,
                role: user?.role,
                rollNo: user?.rollNo,
                classSection: user?.classSection
              }
            }),
            signal: AbortSignal.timeout(7000)
          });
          if (res2.ok) {
            data = await res2.json();
          }
        } catch (err2) {
          console.warn('Secondary chatbot fetch failed:', err2);
        }
      }

      let replyText = (data && data.success && data.reply)
        ? data.reply
        : generateFallbackResponse(text, user);

      setMessages(prev => [
        ...prev,
        {
          id: 'bot_msg_' + Date.now(),
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('Chatbot error:', err);
      const fallbackReply = generateFallbackResponse(text, user);
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_msg_' + Date.now(),
          sender: 'bot',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
      // Auto-refocus input so the user can immediately type the next message
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const generateFallbackResponse = (query, currentUser) => {
    const q = (query || '').toLowerCase();
    const userName = currentUser?.name || 'Dost';

    if (q.includes('attendance') || q.includes('present') || q.includes('mark') || q.includes('absent')) {
      return `📊 **Attendance lagane ke 3 simple steps:**\n\n1. Teacher ka active QR code scan karo (5 min valid)\n2. Classroom ke 50m radius ke andar raho\n3. Camera se live face verify pass karo.\nBas attendance lag jayegi aur confirmation SMS mil jayega! ✨`;
    } 
    
    if (q.includes('geofence') || q.includes('radius') || q.includes('location') || q.includes('meter') || q.includes('distance')) {
      return `📍 **50-Meter Geofence Rule:**\nClassroom se maximum 50 meters ke andar hi attendance lagti hai. 50m se bahar hone par out-of-range flag aur absent lag jata hai.`;
    }

    if (q.includes('qr') || q.includes('timer') || q.includes('time') || q.includes('expire') || q.includes('code')) {
      return `⏱ **5-Minute QR Code:**\nTeacher ka QR code sirf 5 minute tak active rehta hai taaki koi proxy na ho sake. Jaise hi QR generate ho, turant scan karein! 👍`;
    }

    if (q.includes('sms') || q.includes('notification') || q.includes('alert') || q.includes('mobile')) {
      return `📱 **Instant SMS Dispatches:**\nAttendance confirm hone par ya low attendance hone par student aur parents ko instant SMS alert send hota hai.`;
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste')) {
      return `👋 Hello **${userName}**! Aaj attendance, 50m geofence ya class timetable se related kya help chahiye? 😊`;
    }

    return `✨ Main aapki help ke liye taiyaar hoon! Scan2Attend ke 50m geofence, 5-minute QR validity, ya face verification ke baare me kuch bhi pucho.`;
  };

  const quickPrompts = [
    { label: '📊 Attendance Rules', query: 'Attendance kaise lagaye?' },
    { label: '📍 50m Geofence', query: '50m geofencing rule kya hai?' },
    { label: '⏱ QR Validity', query: 'QR code kitne time valid rehta hai?' },
    { label: '📱 SMS Alerts', query: 'SMS alerts kab aate hain?' }
  ];

  if (isSettingsOpen || hideForModal) return null;

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      {!isOpen && (
        <div id="gemini-chatbot-root" className="gemini-chatbot-container fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-bounce-short">
          <button
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 150);
            }}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#2979FF] via-[#7C4DFF] to-[#FF4081] text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 border-2 border-white/40 cursor-pointer"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-yellow-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-ping"></span>
            </div>
            <span className="text-xs font-black tracking-wide pr-1">AI Chatbot</span>
          </button>
        </div>
      )}

      {/* FULL RESPONSIVE CHAT WINDOW (FULLSCREEN ON MOBILE, FLOATING ON DESKTOP) */}
      {isOpen && (
        <div 
          className={`gemini-chatbot-container fixed z-50 transition-all duration-300 ease-in-out flex flex-col bg-white shadow-2xl overflow-hidden ${
            isExpanded 
              ? 'inset-2 sm:inset-6 rounded-2xl sm:rounded-3xl sm:border sm:border-slate-200' 
              : 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[620px] sm:max-h-[88vh] sm:rounded-3xl sm:border sm:border-slate-200'
          }`}
        >
          {/* TOP HEADER */}
          <div className="bg-gradient-to-r from-[#2979FF] via-[#673AB7] to-[#EC4899] p-4 text-white flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-yellow-300 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-wide">AI Assistant</h3>
                <p className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>

            {/* HEADER ACTIONS */}
            <div className="flex items-center gap-1 z-10">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Restore view" : "Expand view"}
                className="hidden sm:block p-2 rounded-xl hover:bg-white/15 text-white/90 transition-all cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-xl hover:bg-white/20 text-white transition-all cursor-pointer active:scale-95"
                title="Close chat"
              >
                <X className="w-6 h-6 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* MESSAGES SCROLL AREA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF8F5] overscroll-contain">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#2979FF] to-[#7C4DFF] flex items-center justify-center text-yellow-300 shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#2979FF] text-white rounded-br-none shadow-md font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs font-normal'
                    }`}
                  >
                    {msg.text.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                        {line.startsWith('📊') || line.startsWith('📍') || line.startsWith('⏱') || line.startsWith('📱') || line.startsWith('✨') ? (
                          <strong className="font-extrabold text-[#212121] block mb-0.5">{line}</strong>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                )}
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#2979FF] to-[#7C4DFF] flex items-center justify-center text-yellow-300 shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                  <span className="w-2 h-2 bg-[#2979FF] rounded-full animate-ping"></span>
                  <span>AI reply generate kar raha hai...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* QUICK SUGGESTION PILLS */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt.query)}
                className="whitespace-nowrap px-3 py-1.5 bg-[#FAF8F5] hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-full text-[11px] font-semibold text-slate-600 transition-all shrink-0 cursor-pointer active:scale-95"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* FOOTER INPUT BOX */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message type karein..."
                className="flex-1 bg-[#FAF8F5] border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#2979FF] focus:bg-white transition-all font-medium"
                autoComplete="off"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                aria-label="Send message"
                className={`p-3 rounded-2xl text-white font-bold transition-all shadow-md shrink-0 ${
                  inputMessage.trim() && !loading
                    ? 'bg-gradient-to-r from-[#2979FF] to-[#7C4DFF] hover:opacity-90 active:scale-95 cursor-pointer'
                    : 'bg-slate-300 opacity-60 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
