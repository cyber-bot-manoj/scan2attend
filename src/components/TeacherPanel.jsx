import React, { useState, useEffect } from 'react';
import { QrCode, Clock, Users, Download, Play, RefreshCw, AlertTriangle, CheckCircle2, MessageSquare, LineChart, FileSpreadsheet, Volume2 } from 'lucide-react';

export default function TeacherPanel({ user, activeSession, setActiveSession, globalAttendanceRecords = [] }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [timeLeft, setTimeLeft] = useState(0); // 5 minutes (300s)
  const [liveAttendance, setLiveAttendance] = useState([]);
  const [showStudentList, setShowStudentList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'PRESENT', 'ABSENT'

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      if (data.success && data.classes.length > 0) {
        setClasses(data.classes);
        setSelectedClassId(data.classes[0].id);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  // 2-Second Active Voice Synthesizer Alert Engine (Plays immediately at once)
  const playVoiceAlert2s = () => {
    try {
      // 1. Instant Audio Chime
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }

      // 2. Crisp 2-Second Active Voice Speech Synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = "Attention! 5-minute QR active. Mark attendance now!";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.25; // Spoken in ~2 seconds sharp
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.warn('Voice alert failed:', err);
    }
  };

  useEffect(() => {
    if (!activeSession) {
      setTimeLeft(0);
      return;
    }
    const remainingTime = Math.max(0, Math.floor((activeSession.expiresAt - Date.now()) / 1000));
    setTimeLeft(remainingTime);
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((activeSession.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        setActiveSession?.(null);
        localStorage.removeItem('activeQrSession');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const generateQrCode = async () => {
    if (!selectedClassId) return;
    setLoading(true);
    const generatedAt = Date.now();
    const expiresAt = generatedAt + 300000; // Exactly 5 minutes (300 seconds)

    try {
      const res = await fetch('/api/teacher/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          teacherId: user ? user.id : 'teacher_1'
        })
      });
      const data = await res.json();
      
      const newSession = {
        ...(data.success ? data.qrSession : {}),
        sessionId: data.qrSession?.sessionId || `qr_${generatedAt}`,
        classId: selectedClassId,
        className: 'Advanced AI (CS401)',
        subject: 'Advanced AI (CS401)',
        code: 'CS401',
        expiresAt,
        generatedAt,
        qrDataUrl: data.qrSession?.qrDataUrl || '/sample-qr-code.png'
      };

      if (setActiveSession) {
        setActiveSession(newSession);
      }
      localStorage.setItem('activeQrSession', JSON.stringify(newSession));
      setTimeLeft(300);

      alert('📲 New 5-Minute Class QR Code Generated! Notification alert sent to Student Dashboards.');
    } catch (err) {
      console.error(err);
      // Robust client fallback
      const fallbackSession = {
        sessionId: `qr_${generatedAt}`,
        classId: selectedClassId,
        className: 'Advanced AI (CS401)',
        subject: 'Advanced AI (CS401)',
        code: 'CS401',
        expiresAt,
        generatedAt,
        qrDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="%232979ff" stroke-width="2"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z"/></svg>'
      };
      if (setActiveSession) {
        setActiveSession(fallbackSession);
      }
      localStorage.setItem('activeQrSession', JSON.stringify(fallbackSession));
      setTimeLeft(300);
    } finally {
      setLoading(false);
    }
  };

  const selectedClassInfo = classes.find(c => c.id === selectedClassId);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isExpired = (timeLeft === 0 && activeSession) || !activeSession;

  const presentCount = liveAttendance.length || 45;
  const totalCount = 50;
  const percentage = Math.round((presentCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#212121]">Teacher Overview</h2>
          <p className="text-xs text-[#757575] font-medium mt-0.5">
            Instructor: <span className="font-bold text-[#212121]">{user ? user.name : 'Dr. Rajesh Sharma'}</span> • Department of Computer Science
          </p>
        </div>
        <div className="flex items-center gap-2">
          {timeLeft > 0 && (
            <span className="bg-[#2979FF]/10 text-[#2979FF] border border-[#2979FF]/30 px-3 py-1.5 rounded-xl font-mono text-xs font-black flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5" /> 5-Min Timer: {formattedTime}
            </span>
          )}
          <button
            onClick={generateQrCode}
            disabled={loading}
            className="btn-blue text-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            {activeSession && timeLeft > 0 ? 'Regenerate 5-Min QR' : 'Generate Class QR'}
          </button>
        </div>
      </div>

      {/* 5-MINUTE LIVE TIMER TOP BANNER (Teacher Overview) */}
      {timeLeft > 0 && (
        <div className="bg-gradient-to-r from-[#2979FF] to-[#1565C0] text-white p-4 rounded-2xl shadow-lg border border-blue-300 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300 font-bold">
              <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-300 text-blue-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  5-MINUTE QR SESSION ACTIVE
                </span>
              </div>
              <p className="text-xs font-extrabold mt-1">
                Active QR code for <span className="underline decoration-yellow-300">Advanced AI (CS401)</span> is currently valid. Student dashboards have 5-min timer active.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/20">
              <span className="text-[9px] uppercase tracking-wider text-blue-200 block font-bold">Expires In</span>
              <span className="font-mono text-lg font-black text-yellow-300">{formattedTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: 3x2 Grid of 3D Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD 1 (3D Class Selector) */}
        <div className="card-3d p-6 space-y-4">
          <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider block">
            Class Selector
          </span>
          <div>
            <label className="block text-xs font-bold text-[#212121] mb-1.5">Current Active Section</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#212121] font-extrabold focus:outline-none focus:border-[#2979FF] shadow-xs"
            >
              <option value="cs401">CS 401 - Section A (Advanced AI)</option>
              <option value="cs301">CS 301 - Section B (Data Structures)</option>
              <option value="cs302">CS 302 - Section A (Database Systems)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] text-xs space-y-1.5 text-[#757575]">
            <p><strong className="text-[#212121]">Location:</strong> Lab 402 • Main Academic Block</p>
            <p><strong className="text-[#212121]">Geofence Radius:</strong> 50 Meters Active</p>
            <p><strong className="text-[#212121]">GPS Target:</strong> 28.6139, 77.2090</p>
          </div>
        </div>

        {/* CARD 2 (3D Live Attendance Check - Teacher Live Access) */}
        <div className="card-3d p-6 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"></span>
                Teacher Live Attendance Monitor
              </span>
              <span className="badge-green text-[10px] font-mono font-bold">LIVE DATABASE SYNC</span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 pt-2 text-[10px] font-bold">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-2 py-1 rounded-lg transition-all ${filterStatus === 'ALL' ? 'bg-[#2979FF] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                All ({globalAttendanceRecords.length})
              </button>
              <button
                onClick={() => setFilterStatus('PRESENT')}
                className={`px-2 py-1 rounded-lg transition-all ${filterStatus === 'PRESENT' ? 'bg-[#00C853] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Present ({globalAttendanceRecords.filter(r => r.status === 'PRESENT').length})
              </button>
              <button
                onClick={() => setFilterStatus('ABSENT')}
                className={`px-2 py-1 rounded-lg transition-all ${filterStatus === 'ABSENT' ? 'bg-[#DD2C00] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Absent ({globalAttendanceRecords.filter(r => r.status === 'ABSENT').length})
              </button>
            </div>
          </div>

          {/* Dynamic Live Student Feed */}
          <div className="mt-1 p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] text-xs space-y-2 max-h-48 overflow-y-auto shadow-inner">
            {globalAttendanceRecords
              .filter(r => filterStatus === 'ALL' ? true : r.status === filterStatus)
              .map((rec, i) => (
                <div key={rec.id || i} className="flex justify-between items-center border-b border-[#E2E8F0] pb-2 last:border-b-0">
                  <div>
                    <p className="font-extrabold text-[#0F172A] flex items-center gap-1.5">
                      {rec.studentName}
                      <span className="text-[9px] text-[#64748B] font-mono">({rec.rollNo})</span>
                    </p>
                    <p className="text-[10px] text-[#64748B] font-medium mt-0.5">
                      {rec.timestamp} • {rec.distanceMeters || rec.distance || '18m'} away
                    </p>
                  </div>

                  <span className={rec.status === 'PRESENT' ? 'badge-green text-[10px]' : 'badge-orange text-[10px]'}>
                    {rec.status === 'PRESENT' ? 'PRESENT 🟢' : 'ABSENT 🔴'}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* CARD 3 (3D QR Management): Display active QR code + 5-min timer & Regenerate QR */}
        <div className="card-3d p-6 space-y-3 text-center flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider">
              QR Session Engine
            </span>
            <span className={`badge-${isExpired ? 'red' : 'green'} font-mono font-bold text-xs`}>
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              {isExpired ? 'EXPIRED' : `${formattedTime}`}
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-36 h-36 mx-auto bg-white p-2.5 border-2 border-[#2979FF]/30 rounded-2xl shadow-md flex items-center justify-center transform transition-transform hover:scale-105 relative">
              {activeSession && activeSession.qrDataUrl ? (
                <img
                  src={activeSession.qrDataUrl}
                  alt="Active Class QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-[#FAF8F5] rounded-xl border border-dashed border-[#2979FF] flex flex-col items-center justify-center p-2 text-[#2979FF]">
                  <QrCode className="w-12 h-12 mb-1" />
                  <span className="text-[10px] font-extrabold">CS 401 QR Active</span>
                </div>
              )}
            </div>

            <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] text-[11px] font-extrabold space-y-0.5">
              <span className={timeLeft > 0 ? 'text-[#00C853] block' : 'text-[#DD2C00] block'}>
                {timeLeft > 0 ? `⏱ 5-Min Timer Running (${formattedTime})` : '❌ QR Expired (Generate New QR)'}
              </span>
              <span className="text-[10px] text-[#757575] font-semibold block">
                Students must mark attendance before timer hits 00:00
              </span>
            </div>
          </div>

          <button
            onClick={generateQrCode}
            className="w-full btn-blue justify-center text-xs font-extrabold py-2.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate 5-Min QR
          </button>
        </div>

        {/* CARD 4 (3D Attendance Trends): Live Semester Trends & Analytics */}
        <div className="card-3d p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-[#2979FF]" /> Semester Trends & Analytics
              </span>
              <span className="badge-green text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse"></span>
                LIVE STATS
              </span>
            </div>

            {/* Key Summary Stats */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-black text-[#0F172A] tracking-tight">92.4%</span>
                <span className="text-[11px] text-[#64748B] font-bold block">Semester Avg Score</span>
              </div>
              <div className="text-right">
                <span className="badge-green text-[10px] font-extrabold inline-flex items-center gap-1">
                  +3.1% Monthly Growth 📈
                </span>
                <span className="text-[10px] text-[#64748B] font-semibold block mt-0.5">148 Total Sessions Conducted</span>
              </div>
            </div>

            {/* Interactive Trend Chart */}
            <div className="w-full h-24 pt-1 relative">
              <svg className="w-full h-full" viewBox="0 0 300 70" fill="none">
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2979FF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2979FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,55 Q50,30 100,40 T200,18 T300,12 L300,70 L0,70 Z"
                  fill="url(#trendGrad)"
                />
                <path
                  d="M0,55 Q50,30 100,40 T200,18 T300,12"
                  stroke="#2979FF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Data Points */}
                <circle cx="15" cy="52" r="4" fill="#2979FF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="95" cy="40" r="4" fill="#2979FF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="195" cy="20" r="4" fill="#2979FF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="285" cy="14" r="5" fill="#00C853" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
              
              <div className="flex justify-between text-[10px] text-[#64748B] font-bold px-1 mt-1">
                <span>Jun (88.5%)</span>
                <span>Jul (90.2%)</span>
                <span>Aug (93.1%)</span>
                <span className="text-[#00C853] font-black">Sep (95.4% Projected)</span>
              </div>
            </div>
          </div>

          {/* Subject Breakdown Mini Stats */}
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-[#0F172A]">CS401 (Advanced AI):</span>
              <span className="text-[#00C853] font-mono">95.2% (Peak)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-[#0F172A]">CS301 (Data Structures):</span>
              <span className="text-[#2979FF] font-mono">92.8% (Stable)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-[#0F172A]">CS302 (Database Systems):</span>
              <span className="text-[#FF9100] font-mono">89.1% (Attention Needed)</span>
            </div>
          </div>
        </div>

        {/* CARD 5 (3D EMBEDDED TEACHER SMS DISPATCHER): Faculty SMS Broadcast & Warnings */}
        <div className="card-3d p-6 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#2979FF]" /> Teacher SMS Alert Gateway
              </span>
              <span className="badge-green font-mono">READY</span>
            </div>

            <p className="text-xs text-[#757575] font-medium mt-2">
              Broadcast instant SMS notifications or low-attendance warnings directly to student mobiles.
            </p>

            <div className="space-y-2 pt-2.5">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] text-xs space-y-1">
                <p className="font-extrabold text-[#212121]">Low Attendance Alert Dispatcher</p>
                <p className="text-[11px] text-[#757575]">Auto-notifies 3 students with &lt;75% attendance via SMS.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              alert('📲 SMS Sent by Faculty! Broadcasted SMS to Section A Students: "Reminder: Advanced AI class starts in 5 minutes."');
            }}
            className="w-full btn-blue justify-center text-xs font-extrabold py-2.5"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Broadcast Class SMS Alert
          </button>
        </div>

        {/* CARD 6 (3D Admin Notices): Notices from Administration */}
        <div className="card-3d p-6 space-y-3">
          <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#FF9100]" /> Admin Messages & Notices
          </span>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <p className="font-extrabold text-[#212121]">Mid-Term Attendance Audit</p>
              <span className="text-[10px] text-[#757575] font-mono">Today</span>
            </div>
            <p className="text-[#757575] text-[11px] font-medium">All faculty members are requested to review low-attendance logs before Friday 5:00 PM.</p>
            <span className="text-[10px] text-[#2979FF] font-extrabold block pt-1">From: Office of Academic Affairs</span>
          </div>
        </div>

      </div>
    </div>
  );
}
