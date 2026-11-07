import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import StudentPanel from './components/StudentPanel';
import TeacherPanel from './components/TeacherPanel';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';

export default function App() {
  // Start with no logged-in user so Sign In / Sign Up modal displays first
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

  // activeTab state: 'LOGIN', 'STUDENT', 'TEACHER', 'ADMIN'
  const [activeTab, setActiveTab] = useState('LOGIN');

  // Enforce role synchronization
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
          />
        )}

        {user && activeTab === 'TEACHER' && (
          <TeacherPanel 
            user={user} 
            activeSession={activeSession} 
            setActiveSession={setActiveSession}
          />
        )}

        {user && activeTab === 'ADMIN' && (
          <AdminPanel user={user} />
        )}
      </main>

      {/* Modern High-End Footer for Scan2Attend */}
      {user && activeTab !== 'LOGIN' && (
        <Footer setActiveTab={setActiveTab} user={user} />
      )}
    </div>
  );
}
