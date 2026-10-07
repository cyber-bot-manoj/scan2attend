import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Maximize2, 
  Minimize2,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Clock,
  MessageSquare,
  Zap,
  CheckCircle2,
  Key
} from 'lucide-react';

export default function GeminiChatbot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: `Namaste **${user?.name || 'MUIT Student'}**! 👋 I am your **MUIT Scan2Attend AI Assistant**.\n\nI can answer questions regarding our **Scan2Attend Smart Attendance System**, 50m GPS geofencing, 5-minute QR codes, face recognition, instant SMS alerts, and Maharishi University class schedules. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'MUIT Campus AI'
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const saveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    setShowKeyInput(false);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage.trim();
    if (!text || loading) return;

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      // Send request to backend Gemini endpoint (passes custom apiKey if provided)
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          apiKey: apiKey || undefined,
          userContext: {
            name: user?.name,
            role: user?.role,
            rollNo: user?.rollNo,
            classSection: user?.classSection
          }
        })
      });

      const data = await res.json();

      let replyText = '';
      let sourceInfo = 'MUIT Campus AI';

      if (data.success && data.reply) {
        replyText = data.reply;
        sourceInfo = data.source || 'Gemini 1.5 Flash (Free API)';
      } else {
        replyText = generateFallbackResponse(text, user);
        sourceInfo = 'Scan2Attend AI';
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'bot_msg_' + Date.now(),
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: sourceInfo
        }
      ]);
    } catch (err) {
      console.warn('API connection offline, using domain fallback AI:', err);
      const fallbackReply = generateFallbackResponse(text, user);
      
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_msg_' + Date.now(),
          sender: 'bot',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'MUIT Campus AI'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackResponse = (query, currentUser) => {
    const q = query.toLowerCase();
    const userName = currentUser?.name || 'MUIT Student';

    // Check for off-topic queries
    const offTopicKeywords = ['weather', 'recipe', 'movie', 'song', 'cricket', 'football', 'president', 'capital', 'python code', 'javascript code', 'write a essay', 'who is', 'tell me a joke', 'math problem'];
    const isOffTopic = offTopicKeywords.some(kw => q.includes(kw)) && !q.includes('attendance') && !q.includes('muit') && !q.includes('scan');

    if (isOffTopic) {
      return `I am the official **MUIT Scan2Attend Assistant**. I am programmed to ONLY answer questions regarding our **Scan2Attend Attendance System**, Maharishi University campus rules, geofencing, QR codes, dashboard portals, and account troubleshooting.\n\nPlease ask a question related to Scan2Attend or MUIT campus features.`;
    }

    if (q.includes('attendance') || q.includes('present') || q.includes('mark') || q.includes('absent')) {
      return `📊 **Scan2Attend Attendance Verification for ${userName}:**\n\n- **Verification Pipeline:**\n  1. Scan active teacher QR code\n  2. Must be within **50 meters** classroom geofence radius\n  3. Pass live camera face verification.\n- **Instant Alerts:** Attendance confirmation is immediately dispatched via SMS.`;
    } 
    
    if (q.includes('geofence') || q.includes('radius') || q.includes('location') || q.includes('meter') || q.includes('distance')) {
      return `📍 **50-Meter Geofence Security System:**\n\n- **Allowed Boundary:** Exactly **50 Meters** around the classroom teacher GPS coordinates.\n- **Out of Boundary:** Scanning from >50m away automatically flags attendance as **ABSENT** and sends an instant SMS warning!`;
    }

    if (q.includes('qr') || q.includes('timer') || q.includes('time') || q.includes('expire') || q.includes('code')) {
      return `⏱ **5-Minute Dynamic QR Code Timer:**\n\n- **Validity:** Teacher QR codes expire in **5 Minutes**.\n- **Security:** Prevents proxy attendance & link sharing across off-campus students.`;
    }

    if (q.includes('sms') || q.includes('notification') || q.includes('alert') || q.includes('mobile')) {
      return `📱 **Instant SMS Notification Engine:**\n\n- Powered by automated SMS Gateway.\n- Triggers SMS for:\n  • Present attendance confirmation\n  • Out-of-geofence attempts\n  • Low attendance warnings (<75% threshold).`;
    }

    if (q.includes('muit') || q.includes('timetable') || q.includes('schedule') || q.includes('class')) {
      return `🏫 **MUIT Lucknow Timetable & Courses:**\n\n- **Department:** Computer Science (B.C.A - Semester V, Section B)\n- **Subjects:** Computer Graphics (BCA501), Java Programming, Cyber Security, Web Tech & Operating Systems.`;
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste')) {
      return `👋 Namaste **${userName}**! How can I help you today with your MUIT Scan2Attend attendance, classroom geofence, or 5-minute QR codes?`;
    }

    return `✨ **MUIT Scan2Attend Assistant:**\n\nI can assist you with:\n- 50-meter GPS Geofencing Rules\n- 5-minute Dynamic QR Code Validity\n- Live Face Recognition\n- Instant SMS Alerts\n- MUIT Timetable & Portal Support\n\nHow can I help you with Scan2Attend today?`;
  };

  const quickPrompts = [
    { label: '📊 How to mark attendance?', query: 'How do I mark my attendance in Scan2Attend?' },
    { label: '📍 50m Geofence Rule', query: 'What is the 50-meter geofence rule?' },
    { label: '⏱ 5-Min QR Timer', query: 'How long is the QR code valid?' },
    { label: '📱 SMS Alert Engine', query: 'How do instant SMS notifications work?' },
    { label: '🏫 MUIT Timetable', query: 'What is the MUIT class schedule and timetable?' }
  ];

  return (
    <>
      {/* FLOATING ACTION BUTTON - MAHARISHI UNIVERSITY STYLE BOTTOM RIGHT */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#1E3A8A] via-[#2979FF] to-[#7C4DFF] text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 border-2 border-white/40"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-yellow-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-ping"></span>
            </div>
            <span className="text-xs font-black tracking-wide pr-1">MUIT Assistant</span>
            
            <span className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
              Ask MUIT Scan2Attend Assistant
            </span>
          </button>
        </div>
      )}

      {/* EXPANDABLE CHATBOT WINDOW */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-in-out flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden ${
            isExpanded 
              ? 'inset-4 sm:inset-10 w-auto h-auto' 
              : 'bottom-6 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* TOP HEADER - MAHARISHI UNIVERSITY STYLE */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#2979FF] p-4 text-white flex items-center justify-between shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 text-yellow-300 shadow-inner">
                <Bot className="w-5.5 h-5.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm tracking-wide text-white">MUIT Scan2Attend Assistant</h3>
                  <span className="bg-emerald-500/30 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-400/30">
                    Official
                  </span>
                </div>
                <p className="text-[10px] text-blue-200 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Maharishi University Campus Assistant
                </p>
              </div>
            </div>

            {/* HEADER ACTIONS */}
            <div className="flex items-center gap-1 z-10">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                title="Configure Gemini Free API Key"
                className="p-2 rounded-xl hover:bg-white/15 text-yellow-300 transition-all"
              >
                <Key className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Restore view" : "Expand view"}
                className="hidden sm:block p-2 rounded-xl hover:bg-white/15 text-white/90 transition-all"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-white/20 text-white transition-all ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* GEMINI API KEY CONFIG OVERLAY */}
          {showKeyInput && (
            <div className="bg-slate-900 text-white p-3 border-b border-slate-700 text-xs animate-fadeIn space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-yellow-300 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Gemini 1.5 Flash Free API Key
                </span>
                <button onClick={() => setShowKeyInput(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-300">
                Enter your Google AI Studio free API key to enable live Gemini Flash AI responses:
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={() => saveApiKey(apiKey)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* MESSAGES SCROLL AREA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF8F5]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2979FF] flex items-center justify-center text-yellow-300 shrink-0 shadow-xs mt-0.5 border border-white/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#2979FF] text-white rounded-br-none shadow-md font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs font-normal'
                    }`}
                  >
                    {msg.text.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                        {line.startsWith('📊') || line.startsWith('📍') || line.startsWith('⏱') || line.startsWith('📱') || line.startsWith('🏫') || line.startsWith('🔑') || line.startsWith('✨') ? (
                          <strong className="font-extrabold text-[#212121] block mb-0.5">{line}</strong>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                    <span>{msg.timestamp}</span>
                    {msg.source && (
                      <span className="text-[9px] bg-slate-200/70 text-slate-600 px-1.5 rounded-md font-semibold">
                        {msg.source}
                      </span>
                    )}
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
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2979FF] flex items-center justify-center text-yellow-300 shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                  <span className="w-2 h-2 bg-[#2979FF] rounded-full animate-ping"></span>
                  <span>MUIT Assistant is generating response...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* QUICK SUGGESTION PILLS */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt.query)}
                className="whitespace-nowrap px-2.5 py-1 bg-[#FAF8F5] hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-full text-[11px] font-semibold text-slate-600 transition-all shrink-0"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* FOOTER INPUT BOX */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask MUIT Assistant about attendance, geofence, QR..."
                className="flex-1 bg-[#FAF8F5] border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2979FF] focus:bg-white transition-all font-medium"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className={`p-2.5 rounded-2xl text-white font-bold transition-all shadow-md ${
                  inputMessage.trim() && !loading
                    ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2979FF] hover:opacity-90 scale-102 cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
