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
    { id: 'att_demo_01', studentName: 'Manoj Sharma', rollNo: 'CS202601', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:19:46 AM', distanceMeters: 14, status: 'PRESENT', livenessScore: '99.4%', hash: 'AUDIT-2026-REC-469063' },
    { id: 'att_demo_02', studentName: 'Priya Singh', rollNo: 'CS202602', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:18:10 AM', distanceMeters: 12, status: 'PRESENT', livenessScore: '98.8%', hash: 'AUDIT-2026-REC-112934' },
    { id: 'att_demo_03', studentName: 'Rohan Mehta', rollNo: 'CS202603', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:17:55 AM', distanceMeters: 68, status: 'ABSENT', livenessScore: 'Failed Geofence (68m)', hash: 'AUDIT-2026-REC-992381' },
    { id: 'att_demo_04', studentName: 'Ananya Sharma', rollNo: 'CS202604', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:17:02 AM', distanceMeters: 9, status: 'PRESENT', livenessScore: '99.7%', hash: 'AUDIT-2026-REC-584920' },
    { id: 'att_demo_05', studentName: 'Vikramaditya Verma', rollNo: 'CS202605', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:16:30 AM', distanceMeters: 15, status: 'PRESENT', livenessScore: '99.1%', hash: 'AUDIT-2026-REC-392019' },
    { id: 'att_demo_06', studentName: 'Sneha Gupta', rollNo: 'CS202606', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:15:45 AM', distanceMeters: 11, status: 'PRESENT', livenessScore: '98.5%', hash: 'AUDIT-2026-REC-884012' },
    { id: 'att_demo_07', studentName: 'Ishaan Patel', rollNo: 'CS202607', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:15:10 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.3%', hash: 'AUDIT-2026-REC-739201' },
    { id: 'att_demo_08', studentName: 'Kavya Deshmukh', rollNo: 'CS202608', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:14:35 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '97.9%', hash: 'AUDIT-2026-REC-483920' },
    { id: 'att_demo_09', studentName: 'Aditya Reddy', rollNo: 'CS202609', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:14:00 AM', distanceMeters: 74, status: 'ABSENT', livenessScore: 'Failed Geofence (74m)', hash: 'AUDIT-2026-REC-294018' },
    { id: 'att_demo_10', studentName: 'Diya Roy', rollNo: 'CS202610', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:13:20 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.6%', hash: 'AUDIT-2026-REC-673029' },
    { id: 'att_demo_11', studentName: 'Rahul Nair', rollNo: 'CS202611', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:12:50 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.7%', hash: 'AUDIT-2026-REC-940281' },
    { id: 'att_demo_12', studentName: 'Tanvi Joshi', rollNo: 'CS202612', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:12:15 AM', distanceMeters: 8, status: 'PRESENT', livenessScore: '99.8%', hash: 'AUDIT-2026-REC-184029' },
    { id: 'att_demo_13', studentName: 'Amit Kumar', rollNo: 'CS202613', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:11:40 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.0%', hash: 'AUDIT-2026-REC-592018' },
    { id: 'att_demo_14', studentName: 'Neha Agarwal', rollNo: 'CS202614', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:11:05 AM', distanceMeters: 14, status: 'PRESENT', livenessScore: '98.9%', hash: 'AUDIT-2026-REC-830291' },
    { id: 'att_demo_15', studentName: 'Harsh Vardhan', rollNo: 'CS202615', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:10:30 AM', distanceMeters: 82, status: 'ABSENT', livenessScore: 'Failed Geofence (82m)', hash: 'AUDIT-2026-REC-492018' },
    { id: 'att_demo_16', studentName: 'Pooja Mishra', rollNo: 'CS202616', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:10:00 AM', distanceMeters: 17, status: 'PRESENT', livenessScore: '99.2%', hash: 'AUDIT-2026-REC-382019' },
    { id: 'att_demo_17', studentName: 'Siddharth Rao', rollNo: 'CS202617', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:09:20 AM', distanceMeters: 12, status: 'PRESENT', livenessScore: '99.5%', hash: 'AUDIT-2026-REC-749201' },
    { id: 'att_demo_18', studentName: 'Shreya Pandey', rollNo: 'CS202618', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:08:50 AM', distanceMeters: 15, status: 'PRESENT', livenessScore: '98.4%', hash: 'AUDIT-2026-REC-194028' },
    { id: 'att_demo_19', studentName: 'Arjun Kapoor', rollNo: 'CS202619', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:08:15 AM', distanceMeters: 21, status: 'PRESENT', livenessScore: '99.1%', hash: 'AUDIT-2026-REC-683029' },
    { id: 'att_demo_20', studentName: 'Riya Sen', rollNo: 'CS202620', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:07:40 AM', distanceMeters: 11, status: 'PRESENT', livenessScore: '99.6%', hash: 'AUDIT-2026-REC-492810' },
    { id: 'att_demo_21', studentName: 'Yash Malhotra', rollNo: 'CS202621', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:07:05 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.2%', hash: 'AUDIT-2026-REC-839201' },
    { id: 'att_demo_22', studentName: 'Anjali Yadav', rollNo: 'CS202622', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:06:30 AM', distanceMeters: 9, status: 'PRESENT', livenessScore: '99.9%', hash: 'AUDIT-2026-REC-284019' },
    { id: 'att_demo_23', studentName: 'Karan Sharma', rollNo: 'CS202623', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:05:55 AM', distanceMeters: 18, status: 'PRESENT', livenessScore: '98.6%', hash: 'AUDIT-2026-REC-739281' },
    { id: 'att_demo_24', studentName: 'Meera Rajput', rollNo: 'CS202624', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:05:20 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.3%', hash: 'AUDIT-2026-REC-592810' },
    { id: 'att_demo_25', studentName: 'Abhinav Saxena', rollNo: 'CS202625', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:04:45 AM', distanceMeters: 55, status: 'ABSENT', livenessScore: 'Failed Geofence (55m)', hash: 'AUDIT-2026-REC-184920' },
    { id: 'att_demo_26', studentName: 'Swati Tripathi', rollNo: 'CS202626', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:04:10 AM', distanceMeters: 14, status: 'PRESENT', livenessScore: '99.0%', hash: 'AUDIT-2026-REC-839102' },
    { id: 'att_demo_27', studentName: 'Vivek Choudhary', rollNo: 'CS202627', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:03:35 AM', distanceMeters: 12, status: 'PRESENT', livenessScore: '99.4%', hash: 'AUDIT-2026-REC-492019' },
    { id: 'att_demo_28', studentName: 'Divya Thakur', rollNo: 'CS202628', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:03:00 AM', distanceMeters: 17, status: 'PRESENT', livenessScore: '98.7%', hash: 'AUDIT-2026-REC-284910' },
    { id: 'att_demo_29', studentName: 'Gaurav Bhatia', rollNo: 'CS202629', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:02:25 AM', distanceMeters: 20, status: 'PRESENT', livenessScore: '99.1%', hash: 'AUDIT-2026-REC-739182' },
    { id: 'att_demo_30', studentName: 'Simran Kaur', rollNo: 'CS202630', subject: 'Advanced AI (CS401)', classId: 'cs401', timestamp: 'Sep 02, 2026, 12:01:50 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.8%', hash: 'AUDIT-2026-REC-392810' }
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
