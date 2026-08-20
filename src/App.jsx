import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentPanel from './components/StudentPanel';
import TeacherPanel from './components/TeacherPanel';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';

export default function App() {
  const [user, setUser] = useState({
    id: 'student_1',
    name: 'Aarav Kumar',
    rollNo: 'CS202601',
    email: 'aarav.kumar@university.edu',
    role: 'STUDENT',
    mobile: '+91 9876543212'
  });

  // Shared active QR session state for real-time notification & 5-min timer
  const [activeSession, setActiveSession] = useState({
    sessionId: 'session_demo_cs401',
    className: 'Advanced AI (CS401)',
    room: 'Lab 402',
    expiresAt: Date.now() + 300000, // 5 minutes from now
    qrDataUrl: ''
  });

  // activeTab state: 'STUDENT', 'TEACHER', 'ADMIN', 'LOGIN'
  const [activeTab, setActiveTab] = useState('STUDENT');

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
        {activeTab === 'STUDENT' && (
          <StudentPanel 
            user={user} 
            activeSession={activeSession} 
            setActiveSession={setActiveSession}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'TEACHER' && (
          <TeacherPanel 
            user={user} 
            activeSession={activeSession} 
            setActiveSession={setActiveSession}
          />
        )}

        {activeTab === 'ADMIN' && (
          <AdminPanel user={user} />
        )}

        {activeTab === 'LOGIN' && (
          <LoginModal setUser={setUser} setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Modern Footer matching branding specifications */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-[#E2E8F0] py-4 text-center text-xs text-[#757575] font-semibold mt-auto z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 Unified Campus Attendance System. All rights reserved.</span>
          <div className="flex gap-4 text-[11px] font-bold text-[#2979FF]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
