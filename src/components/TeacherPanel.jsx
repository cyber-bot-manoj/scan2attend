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
  BookOpen, 
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
  BellRing,
  Plus,
  Search,
  FileText,
  Eye,
  Paperclip,
  AlertCircle,
  Filter
} from 'lucide-react';
import { 
  getStoredAssignments, 
  addTeacherAssignment, 
  BCA_STUDENTS_ROSTER 
} from './muitAssignmentsData';

export default function TeacherPanel({ user, activeSession, setActiveSession, globalAttendanceRecords = [] }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('bca501');
  const [timeLeft, setTimeLeft] = useState(0); // 5 minutes (300s)
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'PRESENT', 'ABSENT'
  const [loading, setLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAllFeedModal, setShowAllFeedModal] = useState(false);

  // Teacher Coursework & Assignments State
  const [assignments, setAssignments] = useState(getStoredAssignments);
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState('ALL');
  const [selectedAssignmentSubmissions, setSelectedAssignmentSubmissions] = useState(null);
  const [submissionFilterTab, setSubmissionFilterTab] = useState('ALL'); // 'ALL', 'SUBMITTED', 'PENDING'
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [showTeacherUploadModal, setShowTeacherUploadModal] = useState(false);
  const [previewStudentSubmission, setPreviewStudentSubmission] = useState(null);
  const [assignmentUploadToast, setAssignmentUploadToast] = useState(null);
  const [remindedStudents, setRemindedStudents] = useState({});
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [performanceTab, setPerformanceTab] = useState('TIMELINE'); // 'TIMELINE', 'SUBJECTS', 'COHORT'

  // Teacher Upload Form state
  const [newAssignmentForm, setNewAssignmentForm] = useState({
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    title: '',
    fileName: '',
    questions: '',
    dueDate: '2026-11-25'
  });

  // Listen for student submissions or teacher uploads in real time
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setAssignments(e.detail);
        setSelectedAssignmentSubmissions(prev => {
          if (!prev) return null;
          return e.detail.find(a => a.sNo === prev.sNo) || prev;
        });
      } else {
        const fresh = getStoredAssignments();
        setAssignments(fresh);
        setSelectedAssignmentSubmissions(prev => {
          if (!prev) return null;
          return fresh.find(a => a.sNo === prev.sNo) || prev;
        });
      }
    };
    window.addEventListener('scan2attend_assignments_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('scan2attend_assignments_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

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

  // Generate 5-Minute Class QR Code (Real 2D Matrix Scannable QR)
  const generateQrCode = async () => {
    if (!selectedClassId) return;
    setLoading(true);
    const generatedAt = Date.now();
    const expiresAt = generatedAt + 300000; // Exactly 5 minutes (300s)
    const classNameMap = {
      bca501: 'Computer Graphics (BCA501)',
      bca502: 'Cryptography & Network Security (BCA502)',
      bca503: 'Web Technology (BCA503)',
      bca504: 'Minor Project (BCA504)',
      bca511: 'Computer Graphics Lab (BCA511)',
      bca512: 'Web Technology Lab (BCA512)',
      ace511: 'Industrial Internship (ACE511)'
    };
    const className = classNameMap[selectedClassId] || 'Computer Graphics (BCA501)';

    const payloadObj = {
      classId: selectedClassId,
      className,
      subject: className,
      latitude: 26.9302879,
      longitude: 80.9278433,
      radiusMeters: 50,
      campus: 'MUIT Lucknow',
      sessionId: `qr_${generatedAt}`,
      expiresAt: expiresAt,
      secretHash: `SEC_${generatedAt}_${selectedClassId.toUpperCase()}`
    };

    const qrJsonString = JSON.stringify(payloadObj);
    const scannableQrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrJsonString)}&size=400&margin=1`;

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
        sessionId: data.qrSession?.sessionId || payloadObj.sessionId,
        classId: selectedClassId,
        className,
        subject: className,
        code: selectedClassId.toUpperCase(),
        expiresAt,
        generatedAt,
        qrPayloadString: qrJsonString,
        qrDataUrl: scannableQrUrl
      };

      if (setActiveSession) {
        setActiveSession(newSession);
      }
      localStorage.setItem('activeQrSession', JSON.stringify(newSession));
      setTimeLeft(300);
      setShowQrModal(true);
    } catch (err) {
      console.error('API call fallback, generating real scannable QR locally:', err);
      const fallbackSession = {
        sessionId: payloadObj.sessionId,
        classId: selectedClassId,
        className,
        subject: className,
        code: selectedClassId.toUpperCase(),
        expiresAt,
        generatedAt,
        qrPayloadString: qrJsonString,
        qrDataUrl: scannableQrUrl
      };
      if (setActiveSession) {
        setActiveSession(fallbackSession);
      }
      localStorage.setItem('activeQrSession', JSON.stringify(fallbackSession));
      setTimeLeft(300);
      setShowQrModal(true);
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
    { id: 'att_demo_01', studentName: 'MANOJ SHARMA', rollNo: '2401031601137', timestamp: '12:59:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '97.5%' },
    { id: 'att_demo_02', studentName: 'ANSH GUPTA', rollNo: '2401031601046', timestamp: '12:58:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '97.6%' },
    { id: 'att_demo_03', studentName: 'AYUSH SRIVASTAVA', rollNo: '2401031601077', timestamp: '12:57:15 AM', distanceMeters: 69, status: 'ABSENT', livenessScore: 'Geofence Exceeded (69m)' },
    { id: 'att_demo_04', studentName: 'AYUSHI GUPTA', rollNo: '2401031601079', timestamp: '12:56:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '97.8%' },
    { id: 'att_demo_05', studentName: 'BADRINATH GUPTA', rollNo: '2401031601080', timestamp: '12:55:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '97.9%' },
    { id: 'att_demo_06', studentName: 'BHAVISHYA PRATAP SINGH', rollNo: '2401031601081', timestamp: '12:54:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.0%' },
    { id: 'att_demo_07', studentName: 'CHAMAN', rollNo: '2401031601082', timestamp: '12:53:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.1%' },
    { id: 'att_demo_08', studentName: 'CHANDRA PRAKASH SAH', rollNo: '2401031601083', timestamp: '12:52:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.2%' },
    { id: 'att_demo_09', studentName: 'CHANDRANSH SINGH', rollNo: '2401031601085', timestamp: '12:51:15 AM', distanceMeters: 81, status: 'ABSENT', livenessScore: 'Geofence Exceeded (81m)' },
    { id: 'att_demo_10', studentName: 'DARKHSHA KHATOON', rollNo: '2401031601086', timestamp: '12:50:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.4%' },
    { id: 'att_demo_11', studentName: 'DEEPAK', rollNo: '2401031601087', timestamp: '12:49:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.5%' },
    { id: 'att_demo_12', studentName: 'DHAIRYA DIXIT', rollNo: '2401031601091', timestamp: '12:48:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.6%' },
    { id: 'att_demo_13', studentName: 'DIVANCI SAXENA', rollNo: '2401031601264', timestamp: '12:47:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.7%' },
    { id: 'att_demo_14', studentName: 'DIVYANSH SRIVASTAVA', rollNo: '2401031601094', timestamp: '12:46:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '98.8%' },
    { id: 'att_demo_15', studentName: 'DIVYANSHU PATEL', rollNo: '2401031601095', timestamp: '12:45:15 AM', distanceMeters: 63, status: 'ABSENT', livenessScore: 'Geofence Exceeded (63m)' },
    { id: 'att_demo_16', studentName: 'EKANSHI SHARAN SRIVASTAVA', rollNo: '2401031601098', timestamp: '12:44:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.0%' },
    { id: 'att_demo_17', studentName: 'EKATA', rollNo: '2401031601099', timestamp: '12:43:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.1%' },
    { id: 'att_demo_18', studentName: 'GARIMA SINGH', rollNo: '2401031601101', timestamp: '12:42:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.2%' },
    { id: 'att_demo_19', studentName: 'GAURAV RAWAT', rollNo: '2401031601102', timestamp: '12:41:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.3%' },
    { id: 'att_demo_20', studentName: 'GAURAV SHARMA', rollNo: '2401031601103', timestamp: '12:40:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.4%' },
    { id: 'att_demo_21', studentName: 'HARSH TRIVEDI', rollNo: '2401031601105', timestamp: '12:39:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.5%' },
    { id: 'att_demo_22', studentName: 'HARSHIT PANDEY', rollNo: '2401031601283', timestamp: '12:38:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.6%' },
    { id: 'att_demo_23', studentName: 'HARSHIT SHUKLA', rollNo: '2401031601107', timestamp: '12:37:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.7%' },
    { id: 'att_demo_24', studentName: 'HEMANT KUMAR PANDEY', rollNo: '2401031601108', timestamp: '12:36:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.8%' },
    { id: 'att_demo_25', studentName: 'HIMANSHU KUMAR', rollNo: '2401031601110', timestamp: '12:35:15 AM', distanceMeters: 73, status: 'ABSENT', livenessScore: 'Geofence Exceeded (73m)' },
    { id: 'att_demo_26', studentName: 'HIMANSHU SRIVASTAVA', rollNo: '2401031601262', timestamp: '12:34:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '97.6%' },
    { id: 'att_demo_27', studentName: 'INDRAJEET SAHANI', rollNo: '2401031601260', timestamp: '12:33:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '97.7%' },
    { id: 'att_demo_28', studentName: 'ISHIKA GAUR', rollNo: '2401031601111', timestamp: '12:32:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '97.8%' },
    { id: 'att_demo_29', studentName: 'ISHITA DIXIT', rollNo: '2401031601112', timestamp: '12:31:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '97.9%' },
    { id: 'att_demo_30', studentName: 'ISHITA GUPTA', rollNo: '2401031601113', timestamp: '12:30:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.0%' },
    { id: 'att_demo_31', studentName: 'ISHU AMAN', rollNo: '2401031601263', timestamp: '12:29:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.1%' },
    { id: 'att_demo_32', studentName: 'JAVED HUSAIN', rollNo: '2401031601115', timestamp: '12:28:15 AM', distanceMeters: 62, status: 'ABSENT', livenessScore: 'Geofence Exceeded (62m)' },
    { id: 'att_demo_33', studentName: 'JAY SHUKLA', rollNo: '2401031601116', timestamp: '12:27:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.3%' },
    { id: 'att_demo_34', studentName: 'KARISHMA SINGH', rollNo: '2401031601119', timestamp: '12:26:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '98.4%' },
    { id: 'att_demo_35', studentName: 'KASHIF ANSARI', rollNo: '2401031601120', timestamp: '12:25:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.5%' },
    { id: 'att_demo_36', studentName: 'KASHISH CHAURASIA', rollNo: '2401031601121', timestamp: '12:24:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.6%' },
    { id: 'att_demo_37', studentName: 'KAUSHAL KUMAR BHARTI', rollNo: '2401031601122', timestamp: '12:23:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.7%' },
    { id: 'att_demo_38', studentName: 'KAVYANSHI SRIVASTAVA', rollNo: '2401031601123', timestamp: '12:22:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.8%' },
    { id: 'att_demo_39', studentName: 'KHAN MOHD JUNED NOOR MOHAMMED', rollNo: '2401031601125', timestamp: '12:21:15 AM', distanceMeters: 81, status: 'ABSENT', livenessScore: 'Geofence Exceeded (81m)' },
    { id: 'att_demo_40', studentName: 'KHUSHI KANNOUJIYA', rollNo: '2401031601127', timestamp: '12:20:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.0%' },
    { id: 'att_demo_41', studentName: 'KOMAL SINGH', rollNo: '2401031601129', timestamp: '12:19:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '99.1%' },
    { id: 'att_demo_42', studentName: 'KULDEEP MAURYA', rollNo: '2401031601130', timestamp: '12:18:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.2%' },
    { id: 'att_demo_43', studentName: 'KUNAL PATEL', rollNo: '2401031601293', timestamp: '12:17:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.3%' },
    { id: 'att_demo_44', studentName: 'MANDAVI SINGH', rollNo: '2401031601134', timestamp: '12:16:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.4%' },
    { id: 'att_demo_45', studentName: 'MANEESH SINGH', rollNo: '2401031601135', timestamp: '12:15:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.5%' },
    { id: 'att_demo_46', studentName: 'MANSI YADAV', rollNo: '2401031601138', timestamp: '12:14:15 AM', distanceMeters: 70, status: 'ABSENT', livenessScore: 'Geofence Exceeded (70m)' },
    { id: 'att_demo_47', studentName: 'MEDHA PANDEY', rollNo: '2401031601139', timestamp: '12:13:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '99.7%' },
    { id: 'att_demo_48', studentName: 'MOHAMMAD ABDULLA', rollNo: '2401031601140', timestamp: '12:12:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '99.8%' },
    { id: 'att_demo_49', studentName: 'MOHAN SINGH', rollNo: '2401031601287', timestamp: '12:11:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '97.5%' },
    { id: 'att_demo_50', studentName: 'MOHD TAUSIF KHAN', rollNo: '2401031601142', timestamp: '12:10:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '97.6%' },
    { id: 'att_demo_51', studentName: 'MONU', rollNo: '2401031601144', timestamp: '12:09:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '97.7%' },
    { id: 'att_demo_52', studentName: 'MUJAHID HUSAIN', rollNo: '2401031601145', timestamp: '12:08:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '97.8%' },
    { id: 'att_demo_53', studentName: 'NANDINI KESHARWANI', rollNo: '2401031601147', timestamp: '12:07:15 AM', distanceMeters: 59, status: 'ABSENT', livenessScore: 'Geofence Exceeded (59m)' },
    { id: 'att_demo_54', studentName: 'NILESH KUMAR SINGH', rollNo: '2401031601151', timestamp: '12:06:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '98.0%' },
    { id: 'att_demo_55', studentName: 'NISHANT MISHRA', rollNo: '2401031601152', timestamp: '12:05:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '98.1%' },
    { id: 'att_demo_56', studentName: 'NITESH KUMAR CHAUHAN', rollNo: '2401031601153', timestamp: '12:04:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.2%' },
    { id: 'att_demo_57', studentName: 'NITIN RAJPOOT', rollNo: '2401031601288', timestamp: '12:03:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.3%' },
    { id: 'att_demo_58', studentName: 'RAVI JAISWAL', rollNo: '2401031601176', timestamp: '12:02:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.4%' },
    { id: 'att_demo_59', studentName: 'RITIK VERMA', rollNo: '2401031601182', timestamp: '12:01:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '98.5%' },
    { id: 'att_demo_60', studentName: 'SHANTANU MISHRA', rollNo: '2401031601203', timestamp: '12:00:15 AM', distanceMeters: 78, status: 'ABSENT', livenessScore: 'Geofence Exceeded (78m)' },
    { id: 'att_demo_61', studentName: 'SHIVANSHI TRIPATHI', rollNo: '2401031601214', timestamp: '11:59:15 AM', distanceMeters: 10, status: 'PRESENT', livenessScore: '98.7%' },
    { id: 'att_demo_62', studentName: 'SHREESH MISHRA', rollNo: '2401031601216', timestamp: '11:58:15 AM', distanceMeters: 13, status: 'PRESENT', livenessScore: '98.8%' },
    { id: 'att_demo_63', studentName: 'YASH SRIVASTAVA', rollNo: '2401031601316', timestamp: '11:57:15 AM', distanceMeters: 16, status: 'PRESENT', livenessScore: '98.9%' },
    { id: 'att_demo_64', studentName: 'YASHIKA UPADHYAY', rollNo: '2401031601251', timestamp: '11:56:15 AM', distanceMeters: 19, status: 'PRESENT', livenessScore: '99.0%' },
    { id: 'att_demo_65', studentName: 'Kuldeep Maurya', rollNo: '2401031601130', timestamp: '11:55:15 AM', distanceMeters: 22, status: 'PRESENT', livenessScore: '99.1%' }
  ];

  
  const classNameMap = {
    bca501: 'Computer Graphics (BCA501)',
    bca502: 'Cryptography & Network Security (BCA502)',
    bca503: 'Web Technology (BCA503)',
    bca504: 'Minor Project (BCA504)',
    bca511: 'Computer Graphics Lab (BCA511)',
    bca512: 'Web Technology Lab (BCA512)',
    ace511: 'Industrial Internship (ACE511)'
  };
  const activeSelectedSubjectName = classNameMap[selectedClassId] || 'Computer Graphics (BCA501)';

  const presentCount = attendanceList.filter(r => r.status === 'PRESENT').length;
  const totalEnrolled = 65;
  const attendancePercentage = Math.round((presentCount / totalEnrolled) * 100);

  const handlePublishTeacherAssignment = (e) => {
    e.preventDefault();
    if (!newAssignmentForm.title.trim()) {
      alert('Please enter assignment topic or title');
      return;
    }
    const cleanTitle = newAssignmentForm.title.trim();
    const fileName = newAssignmentForm.fileName.trim() || 
      `${newAssignmentForm.code}_${cleanTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    
    const questionsList = newAssignmentForm.questions
      .split('\n')
      .map(q => q.trim())
      .filter(Boolean);

    const created = addTeacherAssignment({
      code: newAssignmentForm.code,
      subject: newAssignmentForm.subject,
      title: cleanTitle,
      fileName: fileName,
      fileType: fileName.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf',
      questions: questionsList.length > 0 ? questionsList : [
        `1. Comprehensive problem set for ${cleanTitle} as per university curriculum.`,
        `2. Show complete step-by-step mathematical reasoning and pseudo-code algorithm.`,
        `3. Submit properly formatted solution PDF before deadline ${newAssignmentForm.dueDate}.`
      ],
      dueDate: newAssignmentForm.dueDate,
      uploadedByTeacher: user?.name || 'Prof. Dhananjay Kr. Yadav'
    });

    setAssignments(getStoredAssignments());
    setShowTeacherUploadModal(false);
    setNewAssignmentForm({
      code: 'BCA501',
      subject: 'COMPUTER GRAPHICS',
      title: '',
      fileName: '',
      questions: '',
      dueDate: '2026-11-25'
    });

    setAssignmentUploadToast(`🎉 Assignment #${created.sNo} published successfully! Visible on Student Dashboard.`);
    setTimeout(() => setAssignmentUploadToast(null), 5000);
  };

  const handleSendStudentReminder = (rollNo, studentName) => {
    setRemindedStudents(prev => ({ ...prev, [rollNo]: true }));
    setAssignmentUploadToast(`🔔 Reminder sent to ${studentName} (${rollNo})!`);
    setTimeout(() => setAssignmentUploadToast(null), 3500);
  };

  const handleExportSubmissionsCsv = (asn) => {
    if (!asn) return;
    const subs = asn.submissions || [];
    const csvHeader = "Roll No,Student Name,Status,Submission Date & Time,Submitted File Name\n";
    const rows = BCA_STUDENTS_ROSTER.map(st => {
      const sub = subs.find(s => s.rollNo === st.rollNo || s.studentName === st.studentName);
      if (sub) {
        return `"${st.rollNo}","${st.studentName}","SUBMITTED","${sub.submittedAt}","${sub.fileName}"`;
      }
      return `"${st.rollNo}","${st.studentName}","PENDING","—","—"`;
    }).join("\n");
    const blob = new Blob([csvHeader + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Submissions_${asn.code}_Assign_${asn.sNo}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  // Academic Performance Over Time (Semester V Progression Dataset)
  const academicTimelineData = [
    { month: 'Jul 2026', milestone: 'Semester Commencement & Diagnostic Test', score: 81.2, attendance: 88.5, topScore: 92, submittedPct: 82, note: 'Initial baseline set for BCA V-B' },
    { month: 'Aug 2026', milestone: 'Class Test 1 (CT-1) & Assignment Phase 1', score: 85.8, attendance: 91.0, topScore: 96, submittedPct: 87, note: 'Algorithm concepts and theory introduced' },
    { month: 'Sep 2026', milestone: 'Mid-Term Examinations & Minor Project Synopsis', score: 89.4, attendance: 93.8, topScore: 98, submittedPct: 92, note: 'Strong performance across graphics and web tech' },
    { month: 'Oct 2026', milestone: 'Class Test 2 (CT-2) & Lab Practical Viva', score: 92.1, attendance: 94.5, topScore: 99, submittedPct: 95, note: 'Practical coding exercises completed' },
    { month: 'Nov 2026 (Live)', milestone: 'Pre-University Preparations & Final Assignments', score: 94.6, attendance: 95.2, topScore: 100, submittedPct: 96, note: 'Peak readiness for university semester exams' }
  ];

  const subjectPerformanceData = [
    { code: 'BCA501', name: 'Computer Graphics', teacher: 'Mr. Dhananjay Kr. Yadav', avgScore: 95.2, passRate: 98.5, topGrade: 'A+', trend: '+7.4%', gradeDist: { aPlus: 38, a: 18, b: 7, c: 2 } },
    { code: 'BCA502', name: 'Cryptography & Network Security', teacher: 'Dr. Gouri Shukla', avgScore: 88.6, passRate: 95.4, topGrade: 'A', trend: '+4.2%', gradeDist: { aPlus: 24, a: 26, b: 12, c: 3 } },
    { code: 'BCA503', name: 'Web Technology', teacher: 'Mr. Rishi Mohan Awasthi', avgScore: 92.8, passRate: 96.9, topGrade: 'A+', trend: '+6.1%', gradeDist: { aPlus: 32, a: 22, b: 9, c: 2 } },
    { code: 'BCA504', name: 'Minor Project', teacher: 'Dr. Peeyush Pathak', avgScore: 96.0, passRate: 100, topGrade: 'A+', trend: '+5.0%', gradeDist: { aPlus: 45, a: 16, b: 4, c: 0 } },
    { code: 'BCA511', name: 'Computer Graphics Lab', teacher: 'Dr. Gouri Shukla', avgScore: 94.5, passRate: 100, topGrade: 'A+', trend: '+3.5%', gradeDist: { aPlus: 40, a: 20, b: 5, c: 0 } },
    { code: 'BCA512', name: 'Web Technology Lab', teacher: 'Mr. Rishi Mohan Awasthi', avgScore: 93.2, passRate: 98.5, topGrade: 'A+', trend: '+4.8%', gradeDist: { aPlus: 35, a: 22, b: 7, c: 1 } }
  ];

  const handleExportAcademicReportCsv = () => {
    const csvHeader = "Month,Milestone,Academic Score (%),Attendance (%),Top Score (%),Assignment Completion (%),Analytical Notes\n";
    const rows = academicTimelineData.map(d => 
      `"${d.month}","${d.milestone}","${d.score}%","${d.attendance}%","${d.topScore}%","${d.submittedPct}%","${d.note}"`
    ).join("\n");
    const blob = new Blob([csvHeader + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Academic_Performance_Over_Time_BCA_V_2026.csv`;
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
                {user && user.email !== 'teacher@school.edu' ? (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 border-2 border-purple-400/60 flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-purple-500/20">
                    {user.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'FAC'}
                  </div>
                ) : (
                  <img 
                    src="/faculty_dhananjay_yadav.jpg" 
                    alt="Faculty Profile" 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg ring-2 ring-amber-500/20"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {user ? user.name : 'Mr. Dhananjay Kr. Yadav'}
                  </h1>
                </div>
                <p className="text-xs text-slate-300 font-medium flex items-center gap-2 flex-wrap mt-0.5">
                  <span>{(user?.department ? `Department of ${user.department}` : 'Department of Computer Science')}</span>
                  <span>•</span>
                  <span>ID: <strong className="font-mono text-indigo-200 font-bold">{user?.facultyId || user?.employeeId || 'FAC-8049'}</strong></span>
                  {user?.designation && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[10px] font-bold">
                      {user.designation}
                    </span>
                  )}
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
                Students in <span className="underline decoration-yellow-300 font-mono">Room B-302</span> have active geofence & QR verification countdown.
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
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Select Active Class Section</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-blue-500 shadow-inner transition-all"
              >
                <option value="bca501">BCA 501 - Computer Graphics (Mr. Dhananjay Kr. Yadav)</option>
                <option value="bca502">BCA 502 - Cryptography and Network Security (Dr. Gouri Shukla)</option>
                <option value="bca503">BCA 503 - Web Technology (Mr. Rishi Mohan Awasthi)</option>
                <option value="bca504">BCA 504 - Minor Project (Dr. Peeyush Pathak)</option>
                <option value="bca511">BCA 511 - Computer Graphics Lab (Dr. Gouri Shukla)</option>
                <option value="bca512">BCA 512 - Web Technology Lab (Mr. Rishi Mohan Awasthi)</option>
                <option value="ace511">ACE 511 - Industrial Internship (Mr. Imtiyaz Haq)</option>
              </select>
            </div>

            {/* Interactive Geofence Radar Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3 relative overflow-hidden border border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400 animate-bounce" />
                  <span className="text-xs font-extrabold text-white">Room B-302 • Academic Block</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">
                  50m Radius
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono pt-1 border-t border-slate-800">
                <div>Latitude: <strong className="text-white block font-sans text-xs">26.9303° N</strong></div>
                <div>Longitude: <strong className="text-white block font-sans text-xs">80.9278° E</strong></div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Anti-Proxy Location Spoofing Shield Active</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('📍 Geofence coordinates calibrated to MUIT Lucknow - Room B-302 (26.9303, 80.9278) with 50m radius.')}
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

            {/* Real-time Feed Scroll Box (Fixed Height Equal to Side Cards) */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {attendanceList
                .filter(r => filterStatus === 'ALL' ? true : r.status === filterStatus)
                .slice(0, 6)
                .map((rec, i) => (
                  <div key={rec.id || i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 hover:bg-white transition-colors">
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        {rec.studentName}
                        <span className="text-[10px] text-slate-500 font-mono font-normal">({rec.rollNo})</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        <strong className="text-blue-600 font-sans">{activeSelectedSubjectName}</strong> • {rec.timestamp} • {rec.distanceMeters || 14}m away
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

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => setShowAllFeedModal(true)}
              className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black transition-all border border-blue-200 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Show More / View All 65 Students
            </button>
            <div className="text-[11px] text-slate-500 text-center font-semibold">
              Total Class Strength: <strong className="text-slate-900">{totalEnrolled} Students</strong>
            </div>
          </div>
        </div>

        {/* CARD 3: 3D QR MANAGEMENT & SCANNER ENGINE */}
        <div className="card-3d p-6 space-y-4 text-center flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-left">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-indigo-600" /> QR Session Engine
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

        {/* CARD 4: ACADEMIC PERFORMANCE */}
        <div className="card-3d p-6 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex justify-between items-center h-6">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-blue-600" /> Academic Performance
              </span>

              <button
                onClick={() => setShowPerformanceModal(true)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Open Academic Performance Report"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Metric Snapshot */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">94.6%</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block">Class Academic Index (Jul - Nov 2026)</span>
              </div>
              <div className="text-right">
                <span className="text-blue-700 text-xs font-black block">95.2% Attendance</span>
                <span className="text-[10px] text-slate-400 font-mono block">r = +0.89 Correlation</span>
              </div>
            </div>

            {/* SVG Dual-Line Progression Trend Chart */}
            <div className="w-full h-36 pt-2 relative">
              <svg className="w-full h-full" viewBox="0 0 300 80" fill="none">
                <defs>
                  <linearGradient id="academicScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* 75% Cutoff Reference Line */}
                <line x1="0" y1="52" x2="300" y2="52" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1" />
                <text x="228" y="49" fill="#94a3b8" fontSize="7.5" fontWeight="bold">75% Benchmark</text>

                {/* Score Area Fill */}
                <path
                  d="M10,62 Q75,50 140,36 T220,24 T290,14 L290,80 L10,80 Z"
                  fill="url(#academicScoreGrad)"
                />
                {/* Academic Score Line (Blue) */}
                <path
                  d="M10,62 Q75,50 140,36 T220,24 T290,14"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Attendance Line (Emerald) */}
                <path
                  d="M10,54 Q75,44 140,32 T220,26 T290,12"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="10" cy="62" r="3.5" fill="#2563eb" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="80" cy="50" r="3.5" fill="#2563eb" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="150" cy="36" r="3.5" fill="#2563eb" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="220" cy="24" r="3.5" fill="#2563eb" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="290" cy="14" r="4.5" fill="#10b981" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
              
              <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1 mt-1">
                <span>Jul (81%)</span>
                <span>Aug (86%)</span>
                <span>Sep (89%)</span>
                <span>Oct (92%)</span>
                <span className="text-emerald-600 font-black">Nov (95%)</span>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <button
            onClick={() => setShowPerformanceModal(true)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 mt-1"
          >
            <TrendingUp className="w-3.5 h-3.5" /> Academic Performance Report
          </button>
        </div>

        {/* CARD 5: ASSIGNMENT MANAGEMENT & STUDENT SUBMISSIONS TRACKER */}
        <div className="card-3d p-6 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex justify-between items-center h-6">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Upload Assignment
              </span>
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 text-[10px] font-bold h-7">
              {['ALL', 'BCA501', 'BCA502', 'BCA503', 'BCA504', 'BCA511', 'BCA512'].map((code) => (
                <button
                  key={code}
                  onClick={() => setTeacherSubjectFilter(code)}
                  className={`px-2 py-0.5 rounded-md transition-all shrink-0 ${
                    teacherSubjectFilter === code
                      ? 'bg-indigo-600 text-white font-black shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Assignment List with Real-Time Submissions Counter */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {assignments
                .filter(asn => teacherSubjectFilter === 'ALL' || asn.code === teacherSubjectFilter)
                .map((asn) => {
                  const subCount = asn.submissions ? asn.submissions.length : 0;
                  const totalStudents = BCA_STUDENTS_ROSTER.length; // 65
                  const pct = Math.round((subCount / totalStudents) * 100);

                  return (
                    <div
                      key={asn.sNo}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-indigo-400 hover:bg-white transition-all space-y-1.5 group"
                    >
                      {/* Top: S.No + Code + Subject + Faculty New Badge */}
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono font-bold bg-slate-200 text-slate-800 px-1 py-0.2 rounded text-[9px]">
                            #{asn.sNo}
                          </span>
                          <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded border border-indigo-200 text-[9px]">
                            {asn.code}
                          </span>
                          {asn.isNewFacultyUpload && (
                            <span className="font-black text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded border border-purple-300 text-[8px] animate-pulse">
                              FACULTY NEW
                            </span>
                          )}
                          <span className="font-extrabold text-slate-900 truncate max-w-[150px]" title={asn.subject}>
                            {asn.subject}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">
                          Due: {asn.dueDate || 'Nov 20'}
                        </span>
                      </div>

                      {/* File info */}
                      <div className="text-[11px] font-bold text-slate-700 truncate flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{asn.fileName}</span>
                      </div>

                      {/* Submission tracker row */}
                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200/70 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 text-[9px]">Submissions:</span>
                          <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[9px]">
                            ✓ {subCount}/{totalStudents} ({pct}%)
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedAssignmentSubmissions(asn)}
                          className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] shrink-0 shadow-2xs flex items-center gap-1 transition-all"
                          title="View submitted student list & files"
                        >
                          <Users className="w-2.5 h-2.5" /> View Submissions
                        </button>
                      </div>
                    </div>
                  );
                })}

              {assignments.filter(asn => teacherSubjectFilter === 'ALL' || asn.code === teacherSubjectFilter).length === 0 && (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No assignments found for this subject filter.
                </div>
              )}
            </div>

            {/* Success toast notification */}
            {assignmentUploadToast && (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {assignmentUploadToast}
              </div>
            )}
          </div>

          {/* Bottom Button */}
          <button
            onClick={() => setShowTeacherUploadModal(true)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 mt-1"
          >
            <Plus className="w-3.5 h-3.5" /> Upload New Assignment
          </button>
        </div>

        {/* CARD 6: 3D ACADEMIC NOTICES & ALERTS */}
        <div className="card-3d p-6 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-amber-500" /> Academic Notices
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

      
      {/* SHOW MORE FULL MODAL — ALL 65 STUDENTS LIVE FEED */}
      {showAllFeedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-3xl w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Complete Class Roster — All 65 Students
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  <span className="text-blue-600 font-sans">{activeSelectedSubjectName}</span> • Room B-302 • Section B
                </p>
              </div>
              <button
                onClick={() => setShowAllFeedModal(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Pills inside Modal */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-extrabold">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`py-2 rounded-lg transition-all ${filterStatus === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All ({attendanceList.length})
              </button>
              <button
                onClick={() => setFilterStatus('PRESENT')}
                className={`py-2 rounded-lg transition-all ${filterStatus === 'PRESENT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Present ({presentCount})
              </button>
              <button
                onClick={() => setFilterStatus('ABSENT')}
                className={`py-2 rounded-lg transition-all ${filterStatus === 'ABSENT' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Absent ({attendanceList.length - presentCount})
              </button>
            </div>

            {/* Scrollable List of All 65 Students */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {attendanceList
                .filter(r => filterStatus === 'ALL' ? true : r.status === filterStatus)
                .map((rec, i) => (
                  <div key={rec.id || i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-blue-50/50 transition-colors">
                    <div>
                      <p className="font-black text-slate-900 text-xs flex items-center gap-2">
                        {i + 1}. {rec.studentName}
                        <span className="text-[11px] text-blue-600 font-mono font-bold">({rec.rollNo})</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        <strong className="text-slate-700 font-sans">{activeSelectedSubjectName}</strong> • {rec.timestamp} • {rec.distanceMeters || 14}m away
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                      rec.status === 'PRESENT' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {rec.status === 'PRESENT' ? 'PRESENT 🟢' : 'ABSENT 🔴'}
                    </span>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
              <span>Total Enrolled: <strong className="text-slate-900 font-mono text-sm">{totalEnrolled} Students</strong></span>
              <button
                onClick={() => setShowAllFeedModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl font-black text-xs transition-colors shadow-md"
              >
                Close Roster
              </button>
            </div>

          </div>
        </div>
      )}

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
              <h2 className="text-2xl font-black text-white">{activeSession?.className || 'Computer Graphics (BCA501)'} • Room B-302</h2>
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

      {/* MODAL 1: TEACHER UPLOAD NEW ASSIGNMENT MODAL */}
      {showTeacherUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 shadow-inner">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Upload & Publish Assignment
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Upload new coursework assignment for BCA 5th Semester students
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTeacherUploadModal(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Form */}
            <form onSubmit={handlePublishTeacherAssignment} className="space-y-3.5 flex-1 overflow-y-auto pr-1">
              
              {/* Subject Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Subject & Code:
                </label>
                <select
                  value={newAssignmentForm.code}
                  onChange={(e) => {
                    const code = e.target.value;
                    const subjectNames = {
                      BCA501: 'COMPUTER GRAPHICS',
                      BCA502: 'CRYPTOGRAPHY AND NETWORK SECURITY',
                      BCA503: 'WEB TECHNOLOGY',
                      BCA504: 'MINOR PROJECT',
                      BCA511: 'COMPUTER GRAPHICS LAB',
                      BCA512: 'WEB TECHNOLOGY LAB'
                    };
                    setNewAssignmentForm(prev => ({
                      ...prev,
                      code,
                      subject: subjectNames[code] || prev.subject
                    }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="BCA501">BCA501 - COMPUTER GRAPHICS</option>
                  <option value="BCA502">BCA502 - CRYPTOGRAPHY AND NETWORK SECURITY</option>
                  <option value="BCA503">BCA503 - WEB TECHNOLOGY</option>
                  <option value="BCA504">BCA504 - MINOR PROJECT</option>
                  <option value="BCA511">BCA511 - COMPUTER GRAPHICS LAB</option>
                  <option value="BCA512">BCA512 - WEB TECHNOLOGY LAB</option>
                </select>
              </div>

              {/* Assignment Topic / Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assignment Title / Topic: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 4: 3D Geometric Transformations & Projections"
                  value={newAssignmentForm.title}
                  onChange={(e) => setNewAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Assignment File / Document Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assignment Document File (.pdf / .docx):
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="e.g. BCA501_Assignment_4_3D_Transformations.pdf"
                    value={newAssignmentForm.fileName}
                    onChange={(e) => setNewAssignmentForm(prev => ({ ...prev, fileName: e.target.value }))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                  <label className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer border border-slate-300 flex items-center gap-1.5 shrink-0">
                    <Paperclip className="w-3.5 h-3.5" /> Browse
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewAssignmentForm(prev => ({ ...prev, fileName: file.name }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Submission Deadline / Due Date:
                </label>
                <input
                  type="date"
                  value={newAssignmentForm.dueDate}
                  onChange={(e) => setNewAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Assignment Questions / Problem Statement */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assignment Questions / Problem Statement (1 per line):
                </label>
                <textarea
                  rows="4"
                  placeholder="Question 1: Derive 3D rotation matrix about arbitrary axis.&#10;Question 2: Differentiate between parallel and perspective projection.&#10;Question 3: Implement Z-buffer hidden surface removal algorithm."
                  value={newAssignmentForm.questions}
                  onChange={(e) => setNewAssignmentForm(prev => ({ ...prev, questions: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowTeacherUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Publish to Student Dashboard
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGNMENT SUBMISSIONS INSPECTOR MODAL */}
      {selectedAssignmentSubmissions && (() => {
        const asn = selectedAssignmentSubmissions;
        const subs = asn.submissions || [];
        const totalStudents = BCA_STUDENTS_ROSTER.length; // 65
        const submittedRolls = new Set(subs.map(s => s.rollNo));
        const submittedStudents = subs;
        const pendingStudents = BCA_STUDENTS_ROSTER.filter(st => !submittedRolls.has(st.rollNo));
        const pct = Math.round((submittedStudents.length / totalStudents) * 100);

        // Filter list based on tab and search
        const q = submissionSearch.trim().toLowerCase();
        let displayList = [];
        if (submissionFilterTab === 'SUBMITTED') {
          displayList = submittedStudents.map(s => ({ ...s, isSubmitted: true }));
        } else if (submissionFilterTab === 'PENDING') {
          displayList = pendingStudents.map(st => ({ ...st, isSubmitted: false }));
        } else {
          // ALL
          displayList = [
            ...submittedStudents.map(s => ({ ...s, isSubmitted: true })),
            ...pendingStudents.map(st => ({ ...st, isSubmitted: false }))
          ];
        }

        if (q) {
          displayList = displayList.filter(item => 
            (item.studentName && item.studentName.toLowerCase().includes(q)) ||
            (item.rollNo && item.rollNo.includes(q)) ||
            (item.fileName && item.fileName.toLowerCase().includes(q))
          );
        }

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="max-w-4xl w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-200 shadow-inner">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-xs">
                        {asn.code}
                      </span>
                      <h3 className="text-base font-black text-slate-900 truncate max-w-lg">
                        Assignment #{asn.sNo}: {asn.subject}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700">{asn.fileName}</span>
                      <span>• Due Date: {asn.dueDate || '2026-11-20'}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAssignmentSubmissions(null)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Enrolled</span>
                  <span className="text-xl font-black text-slate-900 font-mono">{totalStudents}</span>
                  <span className="text-[10px] text-slate-500 block font-medium">BCA 5th Semester</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">Total Submitted</span>
                  <span className="text-xl font-black text-emerald-700 font-mono">{submittedStudents.length}</span>
                  <span className="text-[10px] text-emerald-600 block font-bold">{pct}% Submission Rate</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-600 block tracking-wider">Pending Upload</span>
                  <span className="text-xl font-black text-amber-700 font-mono">{pendingStudents.length}</span>
                  <span className="text-[10px] text-amber-600 block font-medium">{100 - pct}% Awaiting upload</span>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSubmissionFilterTab('ALL')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      submissionFilterTab === 'ALL'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({totalStudents})
                  </button>
                  <button
                    onClick={() => setSubmissionFilterTab('SUBMITTED')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      submissionFilterTab === 'SUBMITTED'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Submitted ({submittedStudents.length})
                  </button>
                  <button
                    onClick={() => setSubmissionFilterTab('PENDING')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      submissionFilterTab === 'PENDING'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Pending ({pendingStudents.length})
                  </button>
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student or roll no..."
                    value={submissionSearch}
                    onChange={(e) => setSubmissionSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Submissions Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs flex-1">
                <div className="max-h-[42vh] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-900 text-white font-bold text-[11px] tracking-wide uppercase">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-12">#</th>
                        <th className="py-2.5 px-3 w-32">Roll Number</th>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Submission Details</th>
                        <th className="py-2.5 px-3 text-center w-36">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {displayList.map((st, idx) => (
                        <tr key={st.rollNo || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-500 text-xs">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900 text-xs">
                            {st.rollNo}
                          </td>
                          <td className="py-2 px-3 font-extrabold text-slate-900 text-xs">
                            {st.studentName}
                          </td>
                          <td className="py-2 px-3">
                            {st.isSubmitted ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="w-3 h-3 text-emerald-600" /> SUBMITTED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-500" /> PENDING
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-xs">
                            {st.isSubmitted ? (
                              <div>
                                <span className="font-bold text-slate-800 block truncate max-w-[220px]" title={st.fileName}>
                                  📄 {st.fileName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {st.submittedAt}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono text-xs italic">— Not uploaded yet —</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {st.isSubmitted ? (
                              <button
                                onClick={() => setPreviewStudentSubmission({
                                  ...st,
                                  assignment: asn
                                })}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-2xs flex items-center justify-center gap-1 mx-auto transition-all"
                              >
                                <Eye className="w-3 h-3" /> View Solution
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSendStudentReminder(st.rollNo, st.studentName)}
                                disabled={remindedStudents[st.rollNo]}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] shadow-2xs flex items-center justify-center gap-1 mx-auto transition-all ${
                                  remindedStudents[st.rollNo]
                                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                                }`}
                              >
                                <Send className="w-3 h-3" /> {remindedStudents[st.rollNo] ? 'Reminded' : 'Send Reminder'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}

                      {displayList.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                            No students found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
                <button
                  onClick={() => handleExportSubmissionsCsv(asn)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" /> Export Submissions CSV Report
                </button>

                <button
                  onClick={() => setSelectedAssignmentSubmissions(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md"
                >
                  Close Inspector
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL 3: STUDENT SOLUTION DOCUMENT PREVIEW MODAL */}
      {previewStudentSubmission && (
        <div className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 shadow-inner">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Student Submitted Solution
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {previewStudentSubmission.studentName} • Roll No: {previewStudentSubmission.rollNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewStudentSubmission(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Details Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 font-semibold">Subject & Code:</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {previewStudentSubmission.assignment?.code} - {previewStudentSubmission.assignment?.subject}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 font-semibold">Submitted File:</span>
                <span className="font-mono font-bold text-slate-900">{previewStudentSubmission.fileName}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 font-semibold">Submitted At:</span>
                <span className="font-mono text-emerald-700 font-bold">{previewStudentSubmission.submittedAt}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 font-semibold">Verification Hash:</span>
                <span className="font-mono text-slate-400 text-[10px]">SHA256:7a8b9c0d1e2f3a4b</span>
              </div>
            </div>

            {/* Solution Sheet Preview Body */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-white border border-slate-200 rounded-2xl text-xs">
              <div className="border-b border-slate-200 pb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assignment Topic</span>
                <p className="font-black text-slate-900 text-sm">{previewStudentSubmission.assignment?.topic || previewStudentSubmission.assignment?.subject}</p>
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Student Solution & Answers</span>
                {(previewStudentSubmission.assignment?.questions || [
                  'Question 1: Explain the fundamental principles and provide complete derivation.',
                  'Question 2: Provide implementation code and complexity analysis.'
                ]).map((q, qIdx) => (
                  <div key={qIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                    <p className="font-bold text-slate-900 text-xs">
                      Q{qIdx + 1}. {q}
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 font-serif text-[11px] leading-relaxed">
                      <p className="font-sans font-semibold text-emerald-800 text-[10px] mb-1">
                        ✓ Verified Solution by {previewStudentSubmission.studentName}:
                      </p>
                      <p>
                        The problem has been completely solved according to university prescribed standards. All relevant diagrams, mathematical formulation, and algorithmic steps have been documented in the submitted PDF solution document.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Footer */}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => {
                  const content = `MAHARISHI UNIVERSITY OF INFORMATION TECHNOLOGY\n` +
                    `Student Coursework Submission: ${previewStudentSubmission.assignment?.subject}\n` +
                    `Student Name: ${previewStudentSubmission.studentName}\n` +
                    `Roll Number: ${previewStudentSubmission.rollNo}\n` +
                    `Submission Date: ${previewStudentSubmission.submittedAt}\n` +
                    `File: ${previewStudentSubmission.fileName}\n\n` +
                    `Status: Verified Authentic Academic Submission.`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = previewStudentSubmission.fileName || 'Solution.pdf';
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" /> Download Student Solution
              </button>

              <button
                onClick={() => setPreviewStudentSubmission(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 4: DETAILED ACADEMIC PERFORMANCE OVER TIME MODAL */}
      {showPerformanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-4xl w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200 shadow-inner">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Academic Performance
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowPerformanceModal(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Summary Performance Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-center">
                <span className="text-[10px] uppercase font-bold text-blue-600 block tracking-wider">Current Score</span>
                <span className="text-xl font-black text-blue-900 font-mono">94.6%</span>
                <span className="text-[10px] text-blue-600 block font-bold">↑ +13.4% from Baseline</span>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">Attendance Alignment</span>
                <span className="text-xl font-black text-emerald-700 font-mono">95.2%</span>
                <span className="text-[10px] text-emerald-600 block font-medium">r = +0.89 Correlation</span>
              </div>
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 text-center">
                <span className="text-[10px] uppercase font-bold text-purple-600 block tracking-wider">Coursework Rate</span>
                <span className="text-xl font-black text-purple-700 font-mono">94.0%</span>
                <span className="text-[10px] text-purple-600 block font-medium">58 Total Assignments</span>
              </div>
              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200 text-center">
                <span className="text-[10px] uppercase font-bold text-indigo-600 block tracking-wider">Pass Readiness</span>
                <span className="text-xl font-black text-indigo-700 font-mono">98.5%</span>
                <span className="text-[10px] text-indigo-600 block font-bold">Est. Distinction Rank #1</span>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setPerformanceTab('TIMELINE')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  performanceTab === 'TIMELINE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📅 Timeline Progression (Jul - Nov)
              </button>
              <button
                onClick={() => setPerformanceTab('SUBJECTS')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  performanceTab === 'SUBJECTS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📚 Subject-by-Subject Breakdown
              </button>
              <button
                onClick={() => setPerformanceTab('COHORT')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  performanceTab === 'COHORT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎓 Student Cohort & Diagnostic Insights
              </button>
            </div>

            {/* Tab 1: Timeline Progression Table */}
            {performanceTab === 'TIMELINE' && (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-900 text-white font-bold text-[11px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Month</th>
                        <th className="py-2.5 px-3">Academic Milestone / Assessment</th>
                        <th className="py-2.5 px-3 text-center">Class Avg</th>
                        <th className="py-2.5 px-3 text-center">Attendance</th>
                        <th className="py-2.5 px-3 text-center">Assignments</th>
                        <th className="py-2.5 px-3">Diagnostic Faculty Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {academicTimelineData.map((d, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 font-bold text-slate-900 font-mono">
                            {d.month}
                          </td>
                          <td className="py-2 px-3 font-extrabold text-indigo-900">
                            {d.milestone}
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-blue-600 font-mono">
                            {d.score}%
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-emerald-600 font-mono">
                            {d.attendance}%
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-purple-600 font-mono">
                            {d.submittedPct}%
                          </td>
                          <td className="py-2 px-3 text-slate-500 text-[11px]">
                            {d.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs space-y-1.5">
                  <p className="font-bold text-blue-900">
                    💡 Explanatory Analysis of Growth Over Time:
                  </p>
                  <p className="text-blue-800 text-[11px] leading-relaxed">
                    Student performance steadily accelerated from <strong>81.2% in July</strong> to <strong>94.6% in November</strong>. The introduction of real-time geofence attendance verification eliminated proxy attendance, resulting in improved daily classroom concentration. Continuous internal assessment (CIA) marks reflect deeper conceptual clarity in Computer Graphics, Cryptography, and Web Technologies.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Subject-by-Subject Breakdown */}
            {performanceTab === 'SUBJECTS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1">
                {subjectPerformanceData.map((sub) => (
                  <div key={sub.code} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 text-[10px]">
                            {sub.code}
                          </span>
                          <span className="font-black text-slate-900 text-xs">{sub.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Faculty: {sub.teacher}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {sub.trend}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/80">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Average Score</span>
                        <span className="font-mono font-black text-slate-900 text-sm">{sub.avgScore}%</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block font-medium">Pass Readiness</span>
                        <span className="font-mono font-black text-emerald-700 text-sm">{sub.passRate}%</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Predominant Grade</span>
                        <span className="font-mono font-black text-indigo-700 text-sm">{sub.topGrade}</span>
                      </div>
                    </div>

                    {/* Grade Distribution Bar */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Grade Distribution (65 Students)</span>
                      <div className="w-full h-2 rounded-full overflow-hidden bg-slate-200 flex">
                        <div style={{ width: `${(sub.gradeDist.aPlus / 65) * 100}%` }} className="bg-emerald-500" title={`A+: ${sub.gradeDist.aPlus}`}></div>
                        <div style={{ width: `${(sub.gradeDist.a / 65) * 100}%` }} className="bg-blue-500" title={`A: ${sub.gradeDist.a}`}></div>
                        <div style={{ width: `${(sub.gradeDist.b / 65) * 100}%` }} className="bg-amber-400" title={`B: ${sub.gradeDist.b}`}></div>
                        <div style={{ width: `${(sub.gradeDist.c / 65) * 100}%` }} className="bg-red-400" title={`C: ${sub.gradeDist.c}`}></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>A+ ({sub.gradeDist.aPlus})</span>
                        <span>A ({sub.gradeDist.a})</span>
                        <span>B ({sub.gradeDist.b})</span>
                        <span>C ({sub.gradeDist.c})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Cohort & Diagnostic Insights */}
            {performanceTab === 'COHORT' && (
              <div className="space-y-3.5 flex-1 overflow-y-auto pr-1 text-xs">
                {/* 4 Tiers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold text-emerald-600 block uppercase">Distinction Tier (&gt;85%)</span>
                    <span className="text-lg font-black text-emerald-800 font-mono">42 Students</span>
                    <span className="text-[10px] text-emerald-600 block font-semibold">64.6% of class</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                    <span className="text-[10px] font-bold text-blue-600 block uppercase">First Class Tier (70-84%)</span>
                    <span className="text-lg font-black text-blue-800 font-mono">18 Students</span>
                    <span className="text-[10px] text-blue-600 block font-semibold">27.7% of class</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-600 block uppercase">Second Class Tier (60-69%)</span>
                    <span className="text-lg font-black text-amber-800 font-mono">4 Students</span>
                    <span className="text-[10px] text-amber-600 block font-semibold">6.2% of class</span>
                  </div>
                  <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-center">
                    <span className="text-[10px] font-bold text-red-600 block uppercase">Support Needed (&lt;60%)</span>
                    <span className="text-lg font-black text-red-800 font-mono">1 Student</span>
                    <span className="text-[10px] text-red-600 block font-semibold">1.5% of class</span>
                  </div>
                </div>

                {/* Explanatory Deep Dive */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    🎓 Key Academic Performance Explanations & Faculty Insights:
                  </h4>
                  <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside leading-relaxed">
                    <li><strong>Attendance Correlation (+0.89):</strong> Students with &gt;90% verified attendance demonstrated an average internal test score of 91.5%, compared to 68.2% for those below the 75% attendance threshold.</li>
                    <li><strong>Coursework & Practical Impact:</strong> Timely completion of the 58 MUIT official assignments accounted for a direct 18% improvement in problem-solving speed during Class Test 2 (CT-2).</li>
                    <li><strong>Department Standing:</strong> BCA Section V-B maintains the #1 academic ranking across the Faculty of Computer Science and Engineering for the Autumn 2026 term.</li>
                    <li><strong>Action Plan for At-Risk Students:</strong> Special weekend revision tutorials scheduled for cryptography modular arithmetic and hidden surface algorithms.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
              <button
                onClick={handleExportAcademicReportCsv}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" /> Export Academic Analytics CSV
              </button>

              <button
                onClick={() => setShowPerformanceModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
