import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import StudentPanel from './components/StudentPanel';
import TeacherPanel from './components/TeacherPanel';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import GeminiChatbot from './components/GeminiChatbot';
import Footer from './components/Footer';

export default function App() {
  // Start with no logged-in user so Login Page displays first as requested
  const [user, setUser] = useState(null);

  // Shared active QR session state for real-time notification & 5-min timer
  const [activeSession, setActiveSession] = useState(() => {
    try {
      const savedSession = JSON.parse(localStorage.getItem('activeQrSession'));
      return savedSession?.expiresAt > Date.now() ? savedSession : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (activeSession?.expiresAt > Date.now()) {
      localStorage.setItem('activeQrSession', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('activeQrSession');
    }
  }, [activeSession]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== 'activeQrSession') return;
      try {
        const nextSession = event.newValue ? JSON.parse(event.newValue) : null;
        setActiveSession(nextSession?.expiresAt > Date.now() ? nextSession : null);
      } catch {
        setActiveSession(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Global live attendance records state shared across panels (accessible by Teacher and Admin)
  const [globalAttendanceRecords, setGlobalAttendanceRecords] = useState([
    {
      id: 'att_demo_1',
      studentName: 'Manoj Sharma',
      rollNo: 'CS202601',
      subject: 'Advanced AI (CS401)',
      classId: 'cs401',
      timestamp: new Date(Date.now() - 300000).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      distanceMeters: 18,
      status: 'PRESENT',
      livenessScore: '99.4%',
      hash: 'AUDIT-2026-REC-469063'
    },
    {
      id: 'att_demo_2',
      studentName: 'Priya Sharma',
      rollNo: 'CS202602',
      subject: 'Advanced AI (CS401)',
      classId: 'cs401',
      timestamp: new Date(Date.now() - 900000).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      distanceMeters: 12,
      status: 'PRESENT',
      livenessScore: '98.8%',
      hash: 'AUDIT-2026-REC-112934'
    },
    {
      id: 'att_demo_3',
      studentName: 'Rohan Mehta',
      rollNo: 'CS202603',
      subject: 'Advanced AI (CS401)',
      classId: 'cs401',
      timestamp: new Date(Date.now() - 1500000).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      distanceMeters: 68,
      status: 'ABSENT',
      livenessScore: 'Failed Geofence (68m)',
      hash: 'AUDIT-2026-REC-992381'
    }
  ]);

  const addGlobalAttendance = (record) => {
    setGlobalAttendanceRecords(prev => [record, ...prev]);
  };

  // activeTab state: 'LOGIN', 'STUDENT', 'TEACHER', 'ADMIN'
  const [activeTab, setActiveTab] = useState('LOGIN');

  // Enforce strict role-based tab synchronization so user only sees their authorized portal
  useEffect(() => {
    if (user && user.role) {
      setActiveTab(user.role);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] relative overflow-hidden bg-watermark-pattern">
      {/* 3D Modern Top Navbar */}
      <Navbar 
        user={user} 
        setUser={setUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(!user || activeTab === 'LOGIN') && (
          <LoginModal setUser={setUser} setActiveTab={setActiveTab} />
        )}

        {user && activeTab === 'STUDENT' && (
          <StudentPanel 
            user={user} 
            activeSession={activeSession} 
            setActiveSession={setActiveSession}
            setActiveTab={setActiveTab}
            onNewAttendance={addGlobalAttendance}
          />
        )}

        {user && activeTab === 'TEACHER' && (
          <TeacherPanel 
            user={user} 
            activeSession={activeSession} 
            setActiveSession={setActiveSession}
            globalAttendanceRecords={globalAttendanceRecords}
          />
        )}

        {user && activeTab === 'ADMIN' && (
          <AdminPanel 
            user={user} 
            globalAttendanceRecords={globalAttendanceRecords}
          />
        )}
      </main>

      {/* GEMINI AI LIVE CHATBOT (Located at lower right corner of Dashboard after login) */}
      {user && activeTab !== 'LOGIN' && (
        <GeminiChatbot user={user} />
      )}

      {/* Modern High-End Footer for Scan2Attend */}
      {user && activeTab !== 'LOGIN' && (
        <Footer setActiveTab={setActiveTab} user={user} />
      )}
    </div>
  );
}
