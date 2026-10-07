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
    { id: 'att_demo_01', studentName: 'MANOJ SHARMA', rollNo: '2401031601137', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:59:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '97.5%', hash: 'AUDIT-2026-REC-469000' },
    { id: 'att_demo_02', studentName: 'ANSH GUPTA', rollNo: '2401031601046', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:58:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '97.6%', hash: 'AUDIT-2026-REC-469137' },
    { id: 'att_demo_03', studentName: 'AYUSH SRIVASTAVA', rollNo: '2401031601077', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:57:15 AM', distanceMeters: 69, status: 'ABSENT', livenessScore: 'Geofence Exceeded (69m)', hash: 'AUDIT-2026-REC-469274' },
    { id: 'att_demo_04', studentName: 'AYUSHI GUPTA', rollNo: '2401031601079', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:56:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '97.8%', hash: 'AUDIT-2026-REC-469411' },
    { id: 'att_demo_05', studentName: 'BADRINATH GUPTA', rollNo: '2401031601080', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:55:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '97.9%', hash: 'AUDIT-2026-REC-469548' },
    { id: 'att_demo_06', studentName: 'BHAVISHYA PRATAP SINGH', rollNo: '2401031601081', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:54:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.0%', hash: 'AUDIT-2026-REC-469685' },
    { id: 'att_demo_07', studentName: 'CHAMAN', rollNo: '2401031601082', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:53:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.1%', hash: 'AUDIT-2026-REC-469822' },
    { id: 'att_demo_08', studentName: 'CHANDRA PRAKASH SAH', rollNo: '2401031601083', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:52:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.2%', hash: 'AUDIT-2026-REC-469959' },
    { id: 'att_demo_09', studentName: 'CHANDRANSH SINGH', rollNo: '2401031601085', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:51:15 AM', distanceMeters: 81, status: 'ABSENT', livenessScore: 'Geofence Exceeded (81m)', hash: 'AUDIT-2026-REC-470096' },
    { id: 'att_demo_10', studentName: 'DARKHSHA KHATOON', rollNo: '2401031601086', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:50:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.4%', hash: 'AUDIT-2026-REC-470233' },
    { id: 'att_demo_11', studentName: 'DEEPAK', rollNo: '2401031601087', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:49:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.5%', hash: 'AUDIT-2026-REC-470370' },
    { id: 'att_demo_12', studentName: 'DHAIRYA DIXIT', rollNo: '2401031601091', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:48:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.6%', hash: 'AUDIT-2026-REC-470507' },
    { id: 'att_demo_13', studentName: 'DIVANCI SAXENA', rollNo: '2401031601264', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:47:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.7%', hash: 'AUDIT-2026-REC-470644' },
    { id: 'att_demo_14', studentName: 'DIVYANSH SRIVASTAVA', rollNo: '2401031601094', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:46:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '98.8%', hash: 'AUDIT-2026-REC-470781' },
    { id: 'att_demo_15', studentName: 'DIVYANSHU PATEL', rollNo: '2401031601095', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:45:15 AM', distanceMeters: 63, status: 'ABSENT', livenessScore: 'Geofence Exceeded (63m)', hash: 'AUDIT-2026-REC-470918' },
    { id: 'att_demo_16', studentName: 'EKANSHI SHARAN SRIVASTAVA', rollNo: '2401031601098', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:44:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.0%', hash: 'AUDIT-2026-REC-471055' },
    { id: 'att_demo_17', studentName: 'EKATA', rollNo: '2401031601099', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:43:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.1%', hash: 'AUDIT-2026-REC-471192' },
    { id: 'att_demo_18', studentName: 'GARIMA SINGH', rollNo: '2401031601101', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:42:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.2%', hash: 'AUDIT-2026-REC-471329' },
    { id: 'att_demo_19', studentName: 'GAURAV RAWAT', rollNo: '2401031601102', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:41:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.3%', hash: 'AUDIT-2026-REC-471466' },
    { id: 'att_demo_20', studentName: 'GAURAV SHARMA', rollNo: '2401031601103', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:40:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.4%', hash: 'AUDIT-2026-REC-471603' },
    { id: 'att_demo_21', studentName: 'HARSH TRIVEDI', rollNo: '2401031601105', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:39:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.5%', hash: 'AUDIT-2026-REC-471740' },
    { id: 'att_demo_22', studentName: 'HARSHIT PANDEY', rollNo: '2401031601283', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:38:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.6%', hash: 'AUDIT-2026-REC-471877' },
    { id: 'att_demo_23', studentName: 'HARSHIT SHUKLA', rollNo: '2401031601107', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:37:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.7%', hash: 'AUDIT-2026-REC-472014' },
    { id: 'att_demo_24', studentName: 'HEMANT KUMAR PANDEY', rollNo: '2401031601108', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:36:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.8%', hash: 'AUDIT-2026-REC-472151' },
    { id: 'att_demo_25', studentName: 'HIMANSHU KUMAR', rollNo: '2401031601110', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:35:15 AM', distanceMeters: 73, status: 'ABSENT', livenessScore: 'Geofence Exceeded (73m)', hash: 'AUDIT-2026-REC-472288' },
    { id: 'att_demo_26', studentName: 'HIMANSHU SRIVASTAVA', rollNo: '2401031601262', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:34:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '97.6%', hash: 'AUDIT-2026-REC-472425' },
    { id: 'att_demo_27', studentName: 'INDRAJEET SAHANI', rollNo: '2401031601260', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:33:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '97.7%', hash: 'AUDIT-2026-REC-472562' },
    { id: 'att_demo_28', studentName: 'ISHIKA GAUR', rollNo: '2401031601111', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:32:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '97.8%', hash: 'AUDIT-2026-REC-472699' },
    { id: 'att_demo_29', studentName: 'ISHITA DIXIT', rollNo: '2401031601112', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:31:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '97.9%', hash: 'AUDIT-2026-REC-472836' },
    { id: 'att_demo_30', studentName: 'ISHITA GUPTA', rollNo: '2401031601113', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:30:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.0%', hash: 'AUDIT-2026-REC-472973' },
    { id: 'att_demo_31', studentName: 'ISHU AMAN', rollNo: '2401031601263', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:29:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.1%', hash: 'AUDIT-2026-REC-473110' },
    { id: 'att_demo_32', studentName: 'JAVED HUSAIN', rollNo: '2401031601115', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:28:15 AM', distanceMeters: 62, status: 'ABSENT', livenessScore: 'Geofence Exceeded (62m)', hash: 'AUDIT-2026-REC-473247' },
    { id: 'att_demo_33', studentName: 'JAY SHUKLA', rollNo: '2401031601116', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:27:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.3%', hash: 'AUDIT-2026-REC-473384' },
    { id: 'att_demo_34', studentName: 'KARISHMA SINGH', rollNo: '2401031601119', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:26:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '98.4%', hash: 'AUDIT-2026-REC-473521' },
    { id: 'att_demo_35', studentName: 'KASHIF ANSARI', rollNo: '2401031601120', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:25:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.5%', hash: 'AUDIT-2026-REC-473658' },
    { id: 'att_demo_36', studentName: 'KASHISH CHAURASIA', rollNo: '2401031601121', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:24:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.6%', hash: 'AUDIT-2026-REC-473795' },
    { id: 'att_demo_37', studentName: 'KAUSHAL KUMAR BHARTI', rollNo: '2401031601122', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:23:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.7%', hash: 'AUDIT-2026-REC-473932' },
    { id: 'att_demo_38', studentName: 'KAVYANSHI SRIVASTAVA', rollNo: '2401031601123', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:22:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.8%', hash: 'AUDIT-2026-REC-474069' },
    { id: 'att_demo_39', studentName: 'KHAN MOHD JUNED NOOR MOHAMMED', rollNo: '2401031601125', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:21:15 AM', distanceMeters: 81, status: 'ABSENT', livenessScore: 'Geofence Exceeded (81m)', hash: 'AUDIT-2026-REC-474206' },
    { id: 'att_demo_40', studentName: 'KHUSHI KANNOUJIYA', rollNo: '2401031601127', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:20:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.0%', hash: 'AUDIT-2026-REC-474343' },
    { id: 'att_demo_41', studentName: 'KOMAL SINGH', rollNo: '2401031601129', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:19:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.1%', hash: 'AUDIT-2026-REC-474480' },
    { id: 'att_demo_42', studentName: 'KULDEEP MAURYA', rollNo: '2401031601130', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:18:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.2%', hash: 'AUDIT-2026-REC-474617' },
    { id: 'att_demo_43', studentName: 'KUNAL PATEL', rollNo: '2401031601293', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:17:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.3%', hash: 'AUDIT-2026-REC-474754' },
    { id: 'att_demo_44', studentName: 'MANDAVI SINGH', rollNo: '2401031601134', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:16:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.4%', hash: 'AUDIT-2026-REC-474891' },
    { id: 'att_demo_45', studentName: 'MANEESH SINGH', rollNo: '2401031601135', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:15:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.5%', hash: 'AUDIT-2026-REC-475028' },
    { id: 'att_demo_46', studentName: 'MANSI YADAV', rollNo: '2401031601138', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:14:15 AM', distanceMeters: 70, status: 'ABSENT', livenessScore: 'Geofence Exceeded (70m)', hash: 'AUDIT-2026-REC-475165' },
    { id: 'att_demo_47', studentName: 'MEDHA PANDEY', rollNo: '2401031601139', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:13:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.7%', hash: 'AUDIT-2026-REC-475302' },
    { id: 'att_demo_48', studentName: 'MOHAMMAD ABDULLA', rollNo: '2401031601140', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:12:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.8%', hash: 'AUDIT-2026-REC-475439' },
    { id: 'att_demo_49', studentName: 'MOHAN SINGH', rollNo: '2401031601287', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:11:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '97.5%', hash: 'AUDIT-2026-REC-475576' },
    { id: 'att_demo_50', studentName: 'MOHD TAUSIF KHAN', rollNo: '2401031601142', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:10:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '97.6%', hash: 'AUDIT-2026-REC-475713' },
    { id: 'att_demo_51', studentName: 'MONU', rollNo: '2401031601144', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:09:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '97.7%', hash: 'AUDIT-2026-REC-475850' },
    { id: 'att_demo_52', studentName: 'MUJAHID HUSAIN', rollNo: '2401031601145', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:08:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '97.8%', hash: 'AUDIT-2026-REC-475987' },
    { id: 'att_demo_53', studentName: 'NANDINI KESHARWANI', rollNo: '2401031601147', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:07:15 AM', distanceMeters: 59, status: 'ABSENT', livenessScore: 'Geofence Exceeded (59m)', hash: 'AUDIT-2026-REC-476124' },
    { id: 'att_demo_54', studentName: 'NILESH KUMAR SINGH', rollNo: '2401031601151', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:06:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '98.0%', hash: 'AUDIT-2026-REC-476261' },
    { id: 'att_demo_55', studentName: 'NISHANT MISHRA', rollNo: '2401031601152', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:05:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.1%', hash: 'AUDIT-2026-REC-476398' },
    { id: 'att_demo_56', studentName: 'NITESH KUMAR CHAUHAN', rollNo: '2401031601153', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:04:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.2%', hash: 'AUDIT-2026-REC-476535' },
    { id: 'att_demo_57', studentName: 'NITIN RAJPOOT', rollNo: '2401031601288', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:03:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.3%', hash: 'AUDIT-2026-REC-476672' },
    { id: 'att_demo_58', studentName: 'RAVI JAISWAL', rollNo: '2401031601176', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:02:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.4%', hash: 'AUDIT-2026-REC-476809' },
    { id: 'att_demo_59', studentName: 'RITIK VERMA', rollNo: '2401031601182', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:01:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '98.5%', hash: 'AUDIT-2026-REC-476946' },
    { id: 'att_demo_60', studentName: 'SHANTANU MISHRA', rollNo: '2401031601203', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 12:00:15 AM', distanceMeters: 78, status: 'ABSENT', livenessScore: 'Geofence Exceeded (78m)', hash: 'AUDIT-2026-REC-477083' },
    { id: 'att_demo_61', studentName: 'SHIVANSHI TRIPATHI', rollNo: '2401031601214', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 11:59:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.7%', hash: 'AUDIT-2026-REC-477220' },
    { id: 'att_demo_62', studentName: 'SHREESH MISHRA', rollNo: '2401031601216', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 11:58:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.8%', hash: 'AUDIT-2026-REC-477357' },
    { id: 'att_demo_63', studentName: 'YASH SRIVASTAVA', rollNo: '2401031601316', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 11:57:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.9%', hash: 'AUDIT-2026-REC-477494' },
    { id: 'att_demo_64', studentName: 'YASHIKA UPADHYAY', rollNo: '2401031601251', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 11:56:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.0%', hash: 'AUDIT-2026-REC-477631' },
    { id: 'att_demo_65', studentName: 'Kuldeep Maurya', rollNo: '2401031601130', subject: 'Computer Graphics (BCA501)', classId: 'bca501', timestamp: 'Sep 02, 2026, 11:55:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.1%', hash: 'AUDIT-2026-REC-477768' }
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
    <div className="min-h-screen flex flex-col bg-[#DCE2E9] relative overflow-hidden bg-watermark-pattern">
      {/* 3D Modern Top Navbar */}
      <Navbar 
        user={user} 
        setUser={setUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        globalAttendanceRecords={globalAttendanceRecords}
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

      {/* MAHARISHI UNIVERSITY STYLE AI CAMPUS CHATBOT (Located at bottom right of all views) */}
      <GeminiChatbot user={user} />

      {/* Modern High-End Footer for Scan2Attend */}
      {user && activeTab !== 'LOGIN' && (
        <Footer setActiveTab={setActiveTab} user={user} />
      )}
    </div>
  );
}
