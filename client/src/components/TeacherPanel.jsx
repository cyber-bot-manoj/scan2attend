import React, { useState, useEffect } from 'react';
import { QrCode, Clock, Users, Download, Play, RefreshCw, AlertTriangle, CheckCircle2, MessageSquare, LineChart, FileSpreadsheet } from 'lucide-react';

export default function TeacherPanel({ user, activeSession, setActiveSession }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [timeLeft, setTimeLeft] = useState(0); // 5 minutes
  const [liveAttendance, setLiveAttendance] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!activeSession) {
      setTimeLeft(0);
      return;
    }
    setTimeLeft(Math.max(0, Math.floor((activeSession.expiresAt - Date.now()) / 1000)));
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((activeSession.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        setActiveSession?.(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const generateQrCode = async () => {
    if (!selectedClassId) return;
    setLoading(true);
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
      if (data.success) {
        if (setActiveSession) {
          setActiveSession({
            ...data.qrSession,
            expiresAt: Date.now() + 300000,
            generatedAt: Date.now(),
            className: 'Advanced AI (CS401)'
          });
        }
        setTimeLeft(300);
        alert('📲 New 5-Minute Class QR Code Generated! Notification alert sent to Student Dashboards.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedClassInfo = classes.find(c => c.id === selectedClassId);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft === 0 && activeSession;

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
        <button
          onClick={generateQrCode}
          disabled={loading}
          className="btn-blue text-xs"
        >
          <Play className="w-4 h-4 fill-current" />
          {activeSession ? 'Regenerate QR Code' : 'Generate Class QR'}
        </button>
      </div>

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

        {/* CARD 2 (3D Live Attendance Check): Circular Gauge showing "Present / Total" (45/50) + "View Student List" */}
        <div className="card-3d p-6 space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider">
              Live Attendance Check
            </span>
            <button
              onClick={() => setShowStudentList(!showStudentList)}
              className="text-xs font-extrabold text-[#2979FF] hover:underline"
            >
              View Student List
            </button>
          </div>

          {/* 3D Circular Gauge */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="relative w-28 h-28 flex items-center justify-center drop-shadow-md">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="10" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#00C853"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 45 / 50)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-[#212121]">45/50</span>
                <span className="block text-[10px] text-[#00C853] font-extrabold">90% Present</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00C853] shadow-xs"></span>
                <span className="text-[#212121] font-bold">Present: <strong>45</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF9100] shadow-xs"></span>
                <span className="text-[#212121] font-bold">Absent/Late: <strong>5</strong></span>
              </div>
            </div>
          </div>

          {showStudentList && (
            <div className="mt-2 p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] text-xs space-y-1.5 max-h-40 overflow-y-auto shadow-inner">
              <div className="flex justify-between font-extrabold border-b border-[#E2E8F0] pb-1">
                <span>Student Name</span>
                <span>Status</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium">
                <span>Manoj Sharma (CS202601)</span>
                <span className="badge-green">Present (18m)</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium">
                <span>Priya Sharma (CS202602)</span>
                <span className="badge-green">Present (12m)</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium">
                <span>Rohan Mehta (CS202603)</span>
                <span className="badge-orange">Late (4m)</span>
              </div>
            </div>
          )}
        </div>

        {/* CARD 3 (3D QR Management): Display active QR code + 5-min timer & Regenerate QR */}
        <div className="card-3d p-6 space-y-3 text-center flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider">
              QR Session Engine
            </span>
            <span className={`badge-${isExpired ? 'red' : 'green'} font-mono`}>
              <Clock className="w-3 h-3 inline mr-1" />
              {isExpired ? 'EXPIRED' : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-32 h-32 mx-auto bg-white p-2.5 border border-[#E2E8F0] rounded-2xl shadow-md flex items-center justify-center transform transition-transform hover:scale-105">
              {activeSession && activeSession.qrDataUrl ? (
                <img
                  src={activeSession.qrDataUrl}
                  alt="Active Class QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-[#FAF8F5] rounded-xl border border-dashed border-[#2979FF] flex flex-col items-center justify-center p-2 text-[#2979FF]">
                  <QrCode className="w-10 h-10 mb-1" />
                  <span className="text-[10px] font-extrabold">CS 401 QR Active</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-[#757575] font-semibold">Projected for Class Attendance Check</p>
          </div>

          <button
            onClick={generateQrCode}
            className="w-full btn-blue justify-center text-xs font-extrabold py-2.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate Live QR
          </button>
        </div>

        {/* CARD 4 (3D Attendance Trends): Line chart showing attendance trends */}
        <div className="card-3d p-6 space-y-3">
          <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
            <LineChart className="w-4 h-4 text-[#2979FF]" /> Semester Trends & Analytics
          </span>

          <div className="w-full h-32 pt-2">
            <svg className="w-full h-full" viewBox="0 0 300 80" fill="none">
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2979FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2979FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,60 Q50,20 100,35 T200,15 T300,20 L300,80 L0,80 Z"
                fill="url(#trendGrad)"
              />
              <path
                d="M0,60 Q50,20 100,35 T200,15 T300,20"
                stroke="#2979FF"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-[11px] text-[#757575] text-center font-bold">Semester average attendance: <strong className="text-[#00C853]">92.4%</strong></p>
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
