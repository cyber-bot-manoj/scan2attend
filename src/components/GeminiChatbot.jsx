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
  CheckCircle2
} from 'lucide-react';

export default function GeminiChatbot({ user, isSettingsOpen = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: `Hello **${user?.name || 'Student'}**! 👋 I am your **AI Campus Assistant**.\n\nI can assist you with your attendance records, 50m geofence rules, 5-minute QR codes, SMS alert dispatches, and class schedules. Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'AI Assistant'
    }
  ]);

  const chatEndRef = useRef(null);

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
  }, [messages, isOpen]);

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
      // Send request to backend Gemini endpoint
      const res = await fetch('/api/gemini/chat', {
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
        })
      });

      const data = await res.json();

      let replyText = '';
      let sourceInfo = 'AI Chatbot';

      if (data.success && data.reply) {
        replyText = data.reply;
        sourceInfo = 'AI Assistant';
      } else {
        replyText = generateFallbackResponse(text, user);
        sourceInfo = 'Smart Campus AI';
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
      console.warn('API error, executing fallback AI response:', err);
      const fallbackReply = generateFallbackResponse(text, user);
      
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_msg_' + Date.now(),
          sender: 'bot',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'AI Assistant'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackResponse = (query, currentUser) => {
    const q = query.toLowerCase();
    const userName = currentUser?.name || 'Student';

    if (q.includes('attendance') || q.includes('present') || q.includes('mark') || q.includes('absent')) {
      return `📊 **Attendance Information for ${userName}:**\n\n- **Status:** Active Present sessions logged.\n- **Rules:** Attendance requires 3 checks:\n  1. Scanning active teacher QR code\n  2. Being within **50 meters** classroom geofence\n  3. Passing live camera face verification.\n- **SMS Dispatch:** Delivered immediately to registered phone.`;
    } 
    
    if (q.includes('geofence') || q.includes('radius') || q.includes('location') || q.includes('meter') || q.includes('distance')) {
      return `📍 **Geofence Security System:**\n\n- **Allowed Radius:** Exactly **50 Meters** around the teacher's classroom GPS coordinates.\n- **Out-of-Range Handling:** If you scan from >50 meters away, the system automatically flags attendance as **ABSENT** and dispatches an immediate SMS alert to your phone!`;
    }

    if (q.includes('qr') || q.includes('timer') || q.includes('time') || q.includes('expire') || q.includes('code')) {
      return `⏱ **Dynamic QR Session Timer:**\n\n- **Validity:** Teacher QR codes expire in **5 Minutes**.\n- **Purpose:** Prevents proxy attendance and link sharing across off-campus students.`;
    }

    if (q.includes('sms') || q.includes('notification') || q.includes('alert') || q.includes('mobile')) {
      return `📱 **Instant SMS Notification Engine:**\n\n- Powered by automated SMS Gateway.\n- Triggers SMS for:\n  • Present attendance verification\n  • Out-of-geofence attempts\n  • Low attendance warnings (<75% threshold).`;
    }

    if (q.includes('teacher') || q.includes('admin') || q.includes('role')) {
      return `🎓 **Role Overview:**\n\n- **Student:** Scans QR code within 50m & passes face check.\n- **Teacher:** Launches 5-min QR session & monitors live student feed.\n- **Admin:** Configures GPS coordinates, geofence radius & manages user profiles.`;
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste')) {
      return `👋 Hello **${userName}**! How can I help you today with your attendance, classroom geofencing, or QR sessions?`;
    }

    return `✨ **AI Campus Assistant:**\n\nThank you for asking! I am trained on **Scan2Attend** smart attendance features including:\n- 50-meter GPS Geofencing\n- 5-minute dynamic QR expiration\n- Live camera face verification\n- Instant SMS alerts & parent dispatches\n\nHow else can I assist you today?`;
  };

  const quickPrompts = [
    { label: '📊 Attendance Rules', query: 'What are the attendance rules and geofence distance?' },
    { label: '📍 How 50m Geofencing works', query: 'Explain how 50m geofencing works' },
    { label: '⏱ QR Code validity timer', query: 'How long is QR code valid?' },
    { label: '📱 SMS Alerts dispatches', query: 'How do SMS notification alerts work?' }
  ];

  if (isSettingsOpen || hideForModal) return null;

  return (
    <>
      {/* FLOATING ACTION BUTTON - LOWER CORNER OF DASHBOARD */}
      {!isOpen && (
        <div id="gemini-chatbot-root" className="gemini-chatbot-container fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-bounce-short">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#2979FF] via-[#7C4DFF] to-[#FF4081] text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 border-2 border-white/40"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-yellow-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-ping"></span>
            </div>
            <span className="text-xs font-black tracking-wide pr-1">AI Chatbot</span>
            
            {/* Tooltip on hover */}
            <span className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
              Ask AI Chatbot Assistant
            </span>
          </button>
        </div>
      )}

      {/* EXPANDABLE CHATBOT WINDOW */}
      {isOpen && (
        <div 
          className={`gemini-chatbot-container fixed z-40 transition-all duration-300 ease-in-out flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden ${
            isExpanded 
              ? 'inset-4 sm:inset-10 w-auto h-auto' 
              : 'bottom-6 right-4 sm:right-6 w-[92vw] sm:w-[400px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* TOP HEADER */}
          <div className="bg-gradient-to-r from-[#2979FF] via-[#673AB7] to-[#EC4899] p-4 text-white flex items-center justify-between shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-yellow-300 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm tracking-wide">AI Chatbot</h3>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-xs border border-white/20">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-white/80 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Smart Campus Attendance Bot
                </p>
              </div>
            </div>

            {/* HEADER ACTIONS (Without API Key Icon) */}
            <div className="flex items-center gap-1 z-10">
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

          {/* MESSAGES SCROLL AREA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF8F5]">
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
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#2979FF] to-[#7C4DFF] flex items-center justify-center text-yellow-300 shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                  <span className="w-2 h-2 bg-[#2979FF] rounded-full animate-ping"></span>
                  <span>AI Chatbot is generating response...</span>
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
                className="whitespace-nowrap px-2.5 py-1 bg-[#FAF8F5] hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-full text-[11px] font-semibold text-slate-600 transition-all shrink-0"
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
                placeholder="Ask AI Chatbot about attendance, geofence..."
                className="flex-1 bg-[#FAF8F5] border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2979FF] focus:bg-white transition-all font-medium"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className={`p-2.5 rounded-2xl text-white font-bold transition-all shadow-md ${
                  inputMessage.trim() && !loading
                    ? 'bg-gradient-to-r from-[#2979FF] to-[#7C4DFF] hover:opacity-90 scale-102 cursor-pointer'
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
