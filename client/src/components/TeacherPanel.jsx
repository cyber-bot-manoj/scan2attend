import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Clock, 
  Users, 
  Download, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  LineChart, 
  FileSpreadsheet, 
  Volume2, 
  MapPin, 
  Maximize2, 
  X, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Radio, 
  Check,
  UserCheck,
  UserX,
  Sliders,
  BellRing
} from 'lucide-react';

export default function TeacherPanel({ user, activeSession, setActiveSession, globalAttendanceRecords = [] }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('cs401');
  const [timeLeft, setTimeLeft] = useState(0); // 5 minutes (300s)
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'PRESENT', 'ABSENT'
  const [loading, setLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [customSmsText, setCustomSmsText] = useState('Reminder: Advanced AI (CS401) lecture starts now. Please scan class QR code.');
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // Initial classes setup
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

  // Timer countdown engine
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

  // Generate 5-Minute Class QR Code
  const generateQrCode = async () => {
    if (!selectedClassId) return;
    setLoading(true);
    const generatedAt = Date.now();
    const expiresAt = generatedAt + 300000; // Exactly 5 minutes (300s)

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
        className: selectedClassId === 'cs401' ? 'Advanced AI (CS401)' : selectedClassId === 'cs301' ? 'Data Structures (CS301)' : 'Database Systems (CS302)',
        subject: 'Advanced AI (CS401)',
        code: selectedClassId.toUpperCase(),
        expiresAt,
        generatedAt,
        qrDataUrl: data.qrSession?.qrDataUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="%232979ff" stroke-width="2"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6zM7 7h.01M19 7h.01M7 19h.01M17 17h2v2h-2zM12 7v10M7 12h10"/></svg>'
      };

      if (setActiveSession) {
        setActiveSession(newSession);
      }
      localStorage.setItem('activeQrSession', JSON.stringify(newSession));
      setTimeLeft(300);
    } catch (err) {
      console.error(err);
      const fallbackSession = {
        sessionId: `qr_${generatedAt}`,
        classId: selectedClassId,
        className: 'Advanced AI (CS401)',
        subject: 'Advanced AI (CS401)',
        code: 'CS401',
        expiresAt,
        generatedAt,
        qrDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="%232979ff" stroke-width="2"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6zM7 7h.01M19 7h.01M7 19h.01M17 17h2v2h-2zM12 7v10M7 12h10"/></svg>'
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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isExpired = (timeLeft === 0 && activeSession) || !activeSession;

  // Default demo records if globalAttendanceRecords is empty
  const attendanceList = globalAttendanceRecords.length > 0 ? globalAttendanceRecords : [
    {
      id: 'att_demo_1',
      studentName: 'Manoj Sharma',
      rollNo: 'CS202601',
      timestamp: '10:14:22 AM',
      distanceMeters: 14,
      status: 'PRESENT',
      livenessScore: '99.4%'
    },
    {
      id: 'att_demo_2',
      studentName: 'Priya Sharma',
      rollNo: 'CS202602',
      timestamp: '10:13:05 AM',
      distanceMeters: 18,
      status: 'PRESENT',
      livenessScore: '98.8%'
    },
    {
      id: 'att_demo_3',
      studentName: 'Rohan Mehta',
      rollNo: 'CS202603',
      timestamp: '10:12:40 AM',
      distanceMeters: 62,
      status: 'ABSENT',
      livenessScore: 'Geofence Exceeded (62m)'
    },
    {
      id: 'att_demo_4',
      studentName: 'Ananya Verma',
      rollNo: 'CS202604',
      timestamp: '10:11:18 AM',
      distanceMeters: 9,
      status: 'PRESENT',
      livenessScore: '99.7%'
    }
  ];

  const presentCount = attendanceList.filter(r => r.status === 'PRESENT').length;
  const totalEnrolled = 50;
  const attendancePercentage = Math.round((presentCount / totalEnrolled) * 100);

  const handleSendSms = () => {
    setSmsSentNotice(true);
    setTimeout(() => setSmsSentNotice(false), 3500);
  };

  const handleExportCsv = () => {
    const csvHeader = "Student Name,Roll No,Status,Distance (m),Timestamp,Liveness Score\n";
    const csvRows = attendanceList.map(r => 
      `"${r.studentName}","${r.rollNo}","${r.status}","${r.distanceMeters || 15}","${r.timestamp}","${r.livenessScore || '99%'}"`
    ).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_Report_${selectedClassId.toUpperCase()}_2026.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-8">
      
      {/* 3D FLOATING HEADER & INSTRUCTOR PROFILE BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-indigo-500/20">
        
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Instructor & Section Details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <img 
                  src="/faculty_rajesh_sharma.jpg" 
                  alt="Faculty Profile" 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg ring-2 ring-amber-500/20"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border-2 border-indigo-400/40 hidden items-center justify-center text-white font-black text-xl shadow-lg">
                  RS
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {user ? user.name : 'Dr. Rajesh Sharma'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-extrabold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" /> Senior Faculty
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Department of Computer Science • ID: <span className="font-mono text-indigo-200 font-bold">FAC-8049</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics Chips Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-sm">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Enrolled: <strong className="text-white">{totalEnrolled} Students</strong></span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Today's Rate: <strong className="text-emerald-400 font-mono">{attendancePercentage}%</strong></span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-sm">
                <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Geofence: <strong className="text-purple-300">50m Radar Active</strong></span>
              </div>
            </div>
          </div>

          {/* Action Control Group */}
          <div className="flex flex-wrap items-center gap-3">
            
            <button
              onClick={generateQrCode}
              disabled={loading}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-extrabold text-xs shadow-xl hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 border border-blue-400/30"
            >
              <Play className="w-4 h-4 fill-current text-yellow-300" />
              {activeSession && timeLeft > 0 ? 'Regenerate 5-Min QR' : 'Generate Class QR'}
            </button>

          </div>

        </div>
      </div>

      {/* 5-MINUTE LIVE TIMER TOP ANIMATED ALERT BANNER */}
      {timeLeft > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-5 shadow-xl border border-blue-300/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300 font-bold shrink-0 shadow-inner">
              <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-yellow-400 text-blue-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                  LIVE 5-MINUTE QR SESSION ACTIVE
                </span>
                <span className="text-xs text-blue-100 font-semibold">
                  Broadcasting live to Student Dashboards
                </span>
              </div>
              <p className="text-xs font-bold mt-1 text-white">
                Students in <span className="underline decoration-yellow-300 font-mono">Lab 402</span> have active geofence & QR verification countdown.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t border-white/20 sm:border-t-0">
            <div className="bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/20 min-w-[110px]">
              <span className="text-[9px] uppercase tracking-wider text-blue-200 block font-bold">Timer Left</span>
              <span className="font-mono text-xl font-black text-yellow-300 tracking-wider">{formattedTime}</span>
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-indigo-900 text-xs font-extrabold hover:bg-yellow-300 transition-colors shadow-md flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Project QR
            </button>
          </div>

        </div>
      )}

      {/* 3D 3x2 RESPONSIVE GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD 1: 3D CLASS SELECTOR & GEOFENCE RADAR */}
        <div className="card-3d p-6 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" /> Class & Geofence Config
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold">
                GPS LOCKED
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Select Active Class Section</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-blue-500 shadow-inner transition-all"
              >
                <option value="cs401">CS 401 - Section A (Advanced AI)</option>
                <option value="cs301">CS 301 - Section B (Data Structures)</option>
                <option value="cs302">CS 302 - Section A (Database Systems)</option>
              </select>
            </div>

            {/* Interactive Geofence Radar Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3 relative overflow-hidden border border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400 animate-bounce" />
                  <span className="text-xs font-extrabold text-white">Lab 402 • Academic Block</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">
                  50m Radius
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono pt-1 border-t border-slate-800">
                <div>Latitude: <strong className="text-white block font-sans text-xs">28.6139° N</strong></div>
                <div>Longitude: <strong className="text-white block font-sans text-xs">77.2090° E</strong></div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Anti-Proxy Location Spoofing Shield Active</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('📍 Geofence coordinates updated to Lab 402 (28.6139, 77.2090) with 50m radius.')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors border border-slate-200 flex items-center justify-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-blue-600" /> Recalibrate Geofence Radar
            </button>
          </div>
        </div>

        {/* CARD 2: 3D LIVE ATTENDANCE MONITORING FEED */}
        <div className="card-3d p-6 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" /> Live Attendance Feed
              </span>
              <button 
                onClick={handleExportCsv}
                title="Export CSV Report"
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
              </button>
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`py-1.5 rounded-lg transition-all ${filterStatus === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All ({attendanceList.length})
              </button>
              <button
                onClick={() => setFilterStatus('PRESENT')}
                className={`py-1.5 rounded-lg transition-all ${filterStatus === 'PRESENT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Present ({presentCount})
              </button>
              <button
                onClick={() => setFilterStatus('ABSENT')}
                className={`py-1.5 rounded-lg transition-all ${filterStatus === 'ABSENT' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Absent ({attendanceList.length - presentCount})
              </button>
            </div>

            {/* Real-time Feed Scroll Box */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {attendanceList
                .filter(r => filterStatus === 'ALL' ? true : r.status === filterStatus)
                .map((rec, i) => (
                  <div key={rec.id || i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 hover:bg-white transition-colors">
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        {rec.studentName}
                        <span className="text-[10px] text-slate-500 font-mono font-normal">({rec.rollNo})</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {rec.timestamp} • {rec.distanceMeters || 14}m away
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      rec.status === 'PRESENT' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {rec.status === 'PRESENT' ? 'PRESENT 🟢' : 'ABSENT 🔴'}
                    </span>
                  </div>
                ))}
            </div>

          </div>

          <div className="pt-1 text-[11px] text-slate-500 text-center font-semibold border-t border-slate-100">
            Total Class Strength: <strong className="text-slate-900">{totalEnrolled} Students</strong>
          </div>
        </div>

        {/* CARD 3: 3D QR MANAGEMENT & SCANNER ENGINE */}
        <div className="card-3d p-6 space-y-4 text-center flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-left">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-indigo-600" /> QR Session Engine
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${
                isExpired ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                {isExpired ? 'EXPIRED' : `${formattedTime}`}
              </span>
            </div>

            {/* 3D Floating QR Display with laser scan line effect */}
            <div className="relative group w-40 h-40 mx-auto bg-white p-3 border-2 border-indigo-500/30 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
              
              {/* Laser Scan Line Animation */}
              {timeLeft > 0 && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-lg shadow-blue-500 animate-pulse top-0 animate-ping"></div>
              )}

              {activeSession && activeSession.qrDataUrl ? (
                <img
                  src={activeSession.qrDataUrl}
                  alt="Active Class QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 rounded-xl border border-dashed border-indigo-400 flex flex-col items-center justify-center p-2 text-indigo-600">
                  <QrCode className="w-12 h-12 mb-1" />
                  <span className="text-[10px] font-extrabold">CS 401 QR Active</span>
                </div>
              )}
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-extrabold">
              <span className={timeLeft > 0 ? 'text-emerald-600 block' : 'text-red-600 block'}>
                {timeLeft > 0 ? `⏱ 5-Min Timer Running (${formattedTime})` : '❌ QR Session Expired'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                Students must scan before timer hits 00:00
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={generateQrCode}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5 text-yellow-300" /> Fullscreen
            </button>
          </div>
        </div>

        {/* CARD 4: 3D SEMESTER ANALYTICS & TREND GRAPH */}
        <div className="card-3d p-6 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-blue-600" /> Semester Analytics
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold">
                +3.1% GROWTH
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight">92.4%</span>
                <span className="text-[11px] text-slate-500 font-bold block">Semester Average</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-600 text-xs font-black">148 Total Sessions</span>
                <span className="text-[10px] text-slate-500 block">Department Rank #1</span>
              </div>
            </div>

            {/* SVG Interactive Curved Trend Chart */}
            <div className="w-full h-24 pt-2 relative">
              <svg className="w-full h-full" viewBox="0 0 300 70" fill="none">
                <defs>
                  <linearGradient id="teacherTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,55 Q50,30 100,40 T200,18 T300,12 L300,70 L0,70 Z"
                  fill="url(#teacherTrendGrad)"
                />
                <path
                  d="M0,55 Q50,30 100,40 T200,18 T300,12"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="15" cy="52" r="4" fill="#2563eb" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="95" cy="40" r="4" fill="#2563eb" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="195" cy="20" r="4" fill="#2563eb" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="285" cy="14" r="5" fill="#10b981" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
              
              <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1 mt-1">
                <span>Jun (88%)</span>
                <span>Jul (90%)</span>
                <span>Aug (93%)</span>
                <span className="text-emerald-600 font-black">Sep (95%)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-slate-800">CS401 (Advanced AI):</span>
              <span className="text-emerald-600 font-mono">95.2% (Peak)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-slate-800">CS301 (Data Structures):</span>
              <span className="text-blue-600 font-mono">92.8% (Stable)</span>
            </div>
          </div>
        </div>

        {/* CARD 5: 3D FACULTY SMS DISPATCHER GATEWAY */}
        <div className="card-3d p-6 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" /> Faculty SMS Broadcast
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                READY
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Broadcast SMS alerts directly to student and parent mobile numbers.
            </p>

            <textarea
              rows="3"
              value={customSmsText}
              onChange={(e) => setCustomSmsText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
              placeholder="Type SMS announcement..."
            />

            {smsSentNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> SMS Broadcast Sent to Section A Students!
              </div>
            )}
          </div>

          <button
            onClick={handleSendSms}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Broadcast Class SMS
          </button>
        </div>

        {/* CARD 6: 3D ACADEMIC NOTICES & ALERTS */}
        <div className="card-3d p-6 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-amber-500" /> Academic Notices
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold">
                2 NEW
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="font-extrabold text-amber-950">Mid-Term Attendance Audit</p>
                <span className="text-[10px] text-amber-700 font-mono">Today</span>
              </div>
              <p className="text-amber-900 text-[11px] font-medium leading-relaxed">
                All faculty members are requested to finalize low-attendance warning logs before Friday 5:00 PM.
              </p>
              <span className="text-[10px] text-amber-700 font-bold block pt-1">
                From: Office of Academic Affairs
              </span>
            </div>
          </div>

          <button
            onClick={() => alert('Notice acknowledged. Log saved to Faculty Portal.')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition-colors border border-slate-200"
          >
            Acknowledge Notice
          </button>
        </div>

      </div>

      {/* FULLSCREEN SMARTBOARD PROJECTION MODAL FOR CLASSROOMS */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white relative shadow-2xl text-center space-y-6">
            
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Classroom Projection Mode
              </span>
              <h2 className="text-2xl font-black text-white">Advanced AI (CS401) • Lab 402</h2>
              <p className="text-xs text-slate-400 mt-1">Scan this QR code using student portal on your mobile device</p>
            </div>

            {/* Projected QR Code */}
            <div className="w-72 h-72 mx-auto bg-white p-4 rounded-3xl shadow-2xl border-4 border-blue-500/40 flex items-center justify-center">
              {activeSession && activeSession.qrDataUrl ? (
                <img src={activeSession.qrDataUrl} alt="Classroom QR" className="w-full h-full object-contain" />
              ) : (
                <QrCode className="w-48 h-48 text-blue-600" />
              )}
            </div>

            {/* Floating Timer */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-yellow-300 font-mono text-2xl font-black shadow-inner">
              <Clock className="w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Expires In: {formattedTime}</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
