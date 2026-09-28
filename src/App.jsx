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
    { id: 'att_demo_01', studentName: 'MANOJ SHARMA', rollNo: '2401031601137', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:19:46 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '97.5%', hash: 'AUDIT-2026-REC-469000' },
    { id: 'att_demo_02', studentName: 'ANSH GUPTA', rollNo: '2401031601046', subject: 'Cryptography & Network Security (BCA502)', classId: 'bca502', timestamp: 'Sep 02, 2026, 12:18:45 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '97.6%', hash: 'AUDIT-2026-REC-469137' },
    { id: 'att_demo_03', studentName: 'AYUSH SRIVASTAVA', rollNo: '2401031601077', subject: 'Web Technology (BCA503)', classId: 'bca503', timestamp: 'Sep 02, 2026, 12:17:44 AM', distanceMeters: 69, status: 'ABSENT', livenessScore: 'Failed Geofence (69m)', hash: 'AUDIT-2026-REC-469274' },
    { id: 'att_demo_04', studentName: 'AYUSHI GUPTA', rollNo: '2401031601079', subject: 'Computer Graphics Lab (BCA511)', classId: 'bca511', timestamp: 'Sep 02, 2026, 12:16:43 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '97.8%', hash: 'AUDIT-2026-REC-469411' },
    { id: 'att_demo_05', studentName: 'BADRINATH GUPTA', rollNo: '2401031601080', subject: 'Web Technology Lab (BCA512)', classId: 'bca512', timestamp: 'Sep 02, 2026, 12:15:42 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '97.9%', hash: 'AUDIT-2026-REC-469548' },
    { id: 'att_demo_06', studentName: 'BHAVISHYA PRATAP SINGH', rollNo: '2401031601081', subject: 'Minor Project (BCA504)', classId: 'bca504', timestamp: 'Sep 02, 2026, 12:14:41 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.0%', hash: 'AUDIT-2026-REC-469685' },
    { id: 'att_demo_07', studentName: 'CHAMAN', rollNo: '2401031601082', subject: 'Industrial Internship (ACE511)', classId: 'ace511', timestamp: 'Sep 02, 2026, 12:13:40 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.1%', hash: 'AUDIT-2026-REC-469822' },
    { id: 'att_demo_08', studentName: 'CHANDRA PRAKASH SAH', rollNo: '2401031601083', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:12:39 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.2%', hash: 'AUDIT-2026-REC-469959' },
    { id: 'att_demo_09', studentName: 'CHANDRANSH SINGH', rollNo: '2401031601085', subject: 'Cryptography & Network Security (BCA502)', classId: 'bca502', timestamp: 'Sep 02, 2026, 12:11:38 AM', distanceMeters: 81, status: 'ABSENT', livenessScore: 'Failed Geofence (81m)', hash: 'AUDIT-2026-REC-470096' },
    { id: 'att_demo_10', studentName: 'DARKHSHA KHATOON', rollNo: '2401031601086', subject: 'Web Technology (BCA503)', classId: 'bca503', timestamp: 'Sep 02, 2026, 12:10:37 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.4%', hash: 'AUDIT-2026-REC-470233' },
    { id: 'att_demo_11', studentName: 'DEEPAK', rollNo: '2401031601087', subject: 'Computer Graphics Lab (BCA511)', classId: 'bca511', timestamp: 'Sep 02, 2026, 12:09:36 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.5%', hash: 'AUDIT-2026-REC-470370' },
    { id: 'att_demo_12', studentName: 'DHAIRYA DIXIT', rollNo: '2401031601091', subject: 'Web Technology Lab (BCA512)', classId: 'bca512', timestamp: 'Sep 02, 2026, 12:08:35 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.6%', hash: 'AUDIT-2026-REC-470507' },
    { id: 'att_demo_13', studentName: 'DIVANCI SAXENA', rollNo: '2401031601264', subject: 'Minor Project (BCA504)', classId: 'bca504', timestamp: 'Sep 02, 2026, 12:07:34 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.7%', hash: 'AUDIT-2026-REC-470644' },
    { id: 'att_demo_14', studentName: 'DIVYANSH SRIVASTAVA', rollNo: '2401031601094', subject: 'Industrial Internship (ACE511)', classId: 'ace511', timestamp: 'Sep 02, 2026, 12:06:33 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '98.8%', hash: 'AUDIT-2026-REC-470781' },
    { id: 'att_demo_15', studentName: 'DIVYANSHU PATEL', rollNo: '2401031601095', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:05:32 AM', distanceMeters: 63, status: 'ABSENT', livenessScore: 'Failed Geofence (63m)', hash: 'AUDIT-2026-REC-470918' },
    { id: 'att_demo_16', studentName: 'EKANSHI SHARAN SRIVASTAVA', rollNo: '2401031601098', subject: 'Cryptography & Network Security (BCA502)', classId: 'bca502', timestamp: 'Sep 02, 2026, 12:04:31 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.0%', hash: 'AUDIT-2026-REC-471055' },
    { id: 'att_demo_17', studentName: 'EKATA', rollNo: '2401031601099', subject: 'Web Technology (BCA503)', classId: 'bca503', timestamp: 'Sep 02, 2026, 12:03:30 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.1%', hash: 'AUDIT-2026-REC-471192' },
    { id: 'att_demo_18', studentName: 'GARIMA SINGH', rollNo: '2401031601101', subject: 'Computer Graphics Lab (BCA511)', classId: 'bca511', timestamp: 'Sep 02, 2026, 12:02:29 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.2%', hash: 'AUDIT-2026-REC-471329' },
    { id: 'att_demo_19', studentName: 'GAURAV RAWAT', rollNo: '2401031601102', subject: 'Web Technology Lab (BCA512)', classId: 'bca512', timestamp: 'Sep 02, 2026, 12:01:28 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.3%', hash: 'AUDIT-2026-REC-471466' },
    { id: 'att_demo_20', studentName: 'GAURAV SHARMA', rollNo: '2401031601103', subject: 'Minor Project (BCA504)', classId: 'bca504', timestamp: 'Sep 02, 2026, 12:19:27 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.4%', hash: 'AUDIT-2026-REC-471603' },
    { id: 'att_demo_21', studentName: 'HARSH TRIVEDI', rollNo: '2401031601105', subject: 'Industrial Internship (ACE511)', classId: 'ace511', timestamp: 'Sep 02, 2026, 12:18:26 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.5%', hash: 'AUDIT-2026-REC-471740' },
    { id: 'att_demo_22', studentName: 'HARSHIT PANDEY', rollNo: '2401031601283', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:17:25 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.6%', hash: 'AUDIT-2026-REC-471877' },
    { id: 'att_demo_23', studentName: 'HARSHIT SHUKLA', rollNo: '2401031601107', subject: 'Cryptography & Network Security (BCA502)', classId: 'bca502', timestamp: 'Sep 02, 2026, 12:16:24 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.7%', hash: 'AUDIT-2026-REC-472014' },
    { id: 'att_demo_24', studentName: 'HEMANT KUMAR PANDEY', rollNo: '2401031601108', subject: 'Web Technology (BCA503)', classId: 'bca503', timestamp: 'Sep 02, 2026, 12:15:23 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.8%', hash: 'AUDIT-2026-REC-472151' },
    { id: 'att_demo_25', studentName: 'HIMANSHU KUMAR', rollNo: '2401031601110', subject: 'Computer Graphics Lab (BCA511)', classId: 'bca511', timestamp: 'Sep 02, 2026, 12:14:22 AM', distanceMeters: 73, status: 'ABSENT', livenessScore: 'Failed Geofence (73m)', hash: 'AUDIT-2026-REC-472288' },
    { id: 'att_demo_26', studentName: 'HIMANSHU SRIVASTAVA', rollNo: '2401031601262', subject: 'Web Technology Lab (BCA512)', classId: 'bca512', timestamp: 'Sep 02, 2026, 12:13:21 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '97.6%', hash: 'AUDIT-2026-REC-472425' },
    { id: 'att_demo_27', studentName: 'INDRAJEET SAHANI', rollNo: '2401031601260', subject: 'Minor Project (BCA504)', classId: 'bca504', timestamp: 'Sep 02, 2026, 12:12:20 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '97.7%', hash: 'AUDIT-2026-REC-472562' },
    { id: 'att_demo_28', studentName: 'ISHIKA GAUR', rollNo: '2401031601111', subject: 'Industrial Internship (ACE511)', classId: 'ace511', timestamp: 'Sep 02, 2026, 12:11:19 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '97.8%', hash: 'AUDIT-2026-REC-472699' },
    { id: 'att_demo_29', studentName: 'ISHITA DIXIT', rollNo: '2401031601112', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:10:18 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '97.9%', hash: 'AUDIT-2026-REC-472836' },
    { id: 'att_demo_30', studentName: 'ISHITA GUPTA', rollNo: '2401031601113', subject: 'Cryptography & Network Security (BCA502)', classId: 'bca502', timestamp: 'Sep 02, 2026, 12:09:17 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.0%', hash: 'AUDIT-2026-REC-472973' }
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
