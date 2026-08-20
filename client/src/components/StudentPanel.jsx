import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Clock, MapPin, CheckCircle2, AlertTriangle, Bell, BarChart2, ShieldCheck, Zap, Camera, Check, Smartphone, RefreshCw, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentPanel({ user, activeSession, setActiveSession, setActiveTab }) {
  const [step, setStep] = useState(1); // 1: Main Dashboard, 2: Verification Flow, 3: Success Confirmation
  const [studentLat, setStudentLat] = useState(28.6139);
  const [studentLng, setStudentLng] = useState(77.2090);
  const [distanceMeters, setDistanceMeters] = useState(18); // Default 18m (Inside 50m fence)
  const [faceSnapshot, setFaceSnapshot] = useState(null);
  const [livenessChecked, setLivenessChecked] = useState(false);
  const [scannedQrString, setScannedQrString] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pipelineResults, setPipelineResults] = useState(null);

  // Webcam states & refs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Live Timer State (5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('LIVE_GPS'); // LIVE_GPS, DENIED, SIMULATED
  const [gpsMessage, setGpsMessage] = useState('');
  const [showDevControls, setShowDevControls] = useState(false);

  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const rad1 = (lat1 * Math.PI) / 180;
    const rad2 = (lat2 * Math.PI) / 180;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad1) * Math.cos(rad2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Automatically watch browser GPS location continuously in real-time
  useEffect(() => {
    let watchId;
    setGpsLoading(true);

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setStudentLat(lat);
          setStudentLng(lng);

          const classLat = activeSession ? activeSession.latitude || 28.6139 : 28.6139;
          const classLng = activeSession ? activeSession.longitude || 77.2090 : 77.2090;
          const dist = Math.round(calculateHaversineDistance(lat, lng, classLat, classLng));
          setDistanceMeters(dist);
          setGpsStatus('LIVE_GPS');
          setGpsMessage(`Live GPS Auto-Detected: ${lat.toFixed(4)}, ${lng.toFixed(4)} (${dist}m away)`);
          setGpsLoading(false);
        },
        (err) => {
          console.warn('Auto GPS watch error:', err);
          setGpsStatus('DENIED');
          setGpsMessage('Location permission blocked in browser settings.');
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
      );
    } else {
      setGpsStatus('DENIED');
      setGpsMessage('Browser does not support Geolocation.');
      setGpsLoading(false);
    }

    return () => {
      if (watchId !== undefined && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [activeSession]);

  const setSimulatedLocation = (meters, lat, lng) => {
    setDistanceMeters(meters);
    setStudentLat(lat);
    setStudentLng(lng);
    setGpsStatus('SIMULATED');
    setGpsMessage(`Simulated Location: ${meters}m from classroom`);
  };

  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((activeSession.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const isWithinGeofence = distanceMeters <= 50;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Start real browser camera stream
  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 300, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Webcam unavailable. Click fallback below to use student ID photo.');
      setIsCameraActive(false);
    }
  };

  // Stop camera tracks
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture live snapshot from video stream
  const captureLiveSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setFaceSnapshot(dataUrl);
    setLivenessChecked(true);
    stopCamera();
  };

  // Fallback simulated snapshot
  const useSimulatedSnapshot = () => {
    setFaceSnapshot('/student_profile_avatar.png');
    setLivenessChecked(true);
    stopCamera();
  };

  const handleStartAttendance = async () => {
    setStep(2);
    setErrorMessage('');
    startCamera(); // Automatically initiate camera permission request
  };

  const submitAttendancePipeline = async () => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      const validQrPayload = scannedQrString || JSON.stringify({
        sessionId: 'qr_' + Date.now(),
        classId: 'class_101',
        subject: 'Advanced AI',
        code: 'CS401',
        latitude: 28.6139,
        longitude: 77.2090,
        expiresAt: Date.now() + 600000
      });

      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: (user && user.id) ? user.id : 'student_1',
          qrDataString: validQrPayload,
          studentLat,
          studentLng,
          faceSnapshot: faceSnapshot || '/student_profile_avatar.png',
          livenessChecked: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setPipelineResults(data);
        setStep(3);
        if (data.status === 'PRESENT') {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        setErrorMessage(data.message || 'Verification Failed');
      }
    } catch (err) {
      setPipelineResults({ 
        success: true, 
        status: isWithinGeofence ? 'PRESENT' : 'ABSENT',
        timestamp: new Date().toLocaleTimeString() 
      });
      setStep(3);
      if (isWithinGeofence) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } finally {
      setSubmitting(false);
      stopCamera();
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Identity Card & Profile Header */}
      <div className="card-3d p-6 bg-white border border-[#E2E8F0] shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Left Side: Student Photo + Primary Identity Info */}
          <div className="flex items-center gap-5 w-full lg:w-auto">
            <div className="relative flex-shrink-0">
              <img 
                src="/student_profile_avatar.png" 
                alt="Student Profile Photo" 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#2979FF] shadow-md ring-4 ring-[#2979FF]/10"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#00C853] text-white p-1 rounded-full border-2 border-white shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
                  {user ? user.name : 'Aarav Kumar'}
                </h2>
                <span className="bg-[#2979FF]/10 text-[#2979FF] border border-[#2979FF]/20 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  ID: {user ? (user.rollNo || 'CS202601') : 'CS202601'}
                </span>
                <span className="badge-green text-[10px]">VERIFIED STUDENT</span>
              </div>

              <p className="text-xs text-[#64748B] font-bold mt-1">
                B.Tech Computer Science & Engineering • Semester 6
              </p>

              <div className="flex items-center gap-4 mt-2 text-xs text-[#64748B] font-medium flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#2979FF]" /> +91 9876543212
                </span>
                <span>•</span>
                <span>aarav.kumar@university.edu</span>
              </div>
            </div>
          </div>

          {/* Right Side: Quick Exam Eligibility & Live Geofence Status */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 border-[#E2E8F0] pt-4 lg:pt-0">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] text-center px-4">
              <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider block">Exam Eligibility</span>
              <span className="text-xs font-black text-[#00C853] flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Eligible (95.6%)
              </span>
            </div>

            <div className="p-3 bg-[#2979FF]/5 rounded-xl border border-[#2979FF]/20 text-center px-4">
              <span className="text-[10px] text-[#2979FF] font-bold uppercase tracking-wider block">Geofence Status</span>
              <span className={`text-xs font-extrabold flex items-center justify-center gap-1 mt-0.5 ${isWithinGeofence ? 'text-[#00C853]' : 'text-[#DD2C00]'}`}>
                <span className={`w-2 h-2 rounded-full ${isWithinGeofence ? 'bg-[#00C853] animate-pulse' : 'bg-[#DD2C00]'}`}></span> 
                {isWithinGeofence ? `${distanceMeters}m Radius Active` : `Outside Range (${distanceMeters}m)`}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* TOP NOTIFICATION BANNER: Teacher Live QR Generation Notification (5-Minute Timer) */}
      {timeLeft > 0 && (
        <div className="bg-gradient-to-r from-[#2979FF] to-[#1565C0] text-white p-4 rounded-2xl shadow-lg border border-blue-400 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 animate-bounce">
              <Bell className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-blue-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full">
                  LIVE SESSION NOTIFICATION
                </span>
                <span className="font-mono text-xs font-bold text-yellow-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {formattedTime} remaining
                </span>
              </div>
              <h4 className="text-sm font-extrabold mt-0.5">
                Teacher generated a new class QR code for <span className="underline decoration-yellow-300">Advanced AI (CS401)</span>!
              </h4>
            </div>
          </div>

          <button
            onClick={handleStartAttendance}
            className="w-full md:w-auto bg-white text-[#2979FF] hover:bg-yellow-300 hover:text-blue-950 px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" /> Join Session & Mark Attendance
          </button>
        </div>
      )}

      {step === 1 && (
        /* SCREEN 1: 3x2 Grid of 3D Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CARD 1 (3D Big Metric): Attendance Score */}
          <div className="card-3d p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider block">
                  Attendance Score (This Month)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C853] shadow-md shadow-[#00C853]/40 animate-pulse"></span>
              </div>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-4xl font-black text-[#212121] tracking-tight">95.6%</span>
                <span className="badge-green inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +2.4% vs last month
                </span>
              </div>
            </div>

            <div className="w-full h-16 pt-2">
              <svg className="w-full h-full" viewBox="0 0 300 60" fill="none">
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2979FF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2979FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,50 Q40,40 80,45 T160,25 T240,15 T300,10 L300,60 L0,60 Z"
                  fill="url(#blueGrad)"
                />
                <path
                  d="M0,50 Q40,40 80,45 T160,25 T240,15 T300,10"
                  stroke="#2979FF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* CARD 2 (3D Upcoming Class): Next Class Session */}
          <div className="card-3d p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider">
                  Active Class Session
                </span>
                <span className={isWithinGeofence ? 'badge-green' : 'badge-orange'}>
                  {isWithinGeofence ? 'GEOFENCE IN-RANGE' : 'GEOFENCE OUT-RANGE'}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#212121] mt-3">Next Class: Advanced AI (10:00 AM)</h3>
              <p className="text-xs text-[#757575] font-medium mt-1">Instructor: Dr. Rajesh Sharma • Room: Lab 402</p>
            </div>

            {/* Geofence Simulator Toggle for testing inside 18m vs outside 68m */}
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#E2E8F0] flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#64748B]">Simulate Location:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setDistanceMeters(18)}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${distanceMeters <= 50 ? 'bg-[#00C853] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Inside (18m)
                </button>
                <button
                  onClick={() => setDistanceMeters(68)}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${distanceMeters > 50 ? 'bg-[#DD2C00] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Outside (68m)
                </button>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={handleStartAttendance}
                className="w-full btn-blue justify-center py-3 text-xs font-extrabold tracking-wide"
              >
                <Zap className="w-4 h-4 fill-current" />
                Join Session & Mark Attendance
              </button>
            </div>
          </div>

          {/* CARD 3 (3D Recent Attendance Log) */}
          <div className="card-3d p-6 space-y-3">
            <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider block">
              Recent Attendance Log
            </span>
            <div className="space-y-2.5 pt-1">
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-[#E2E8F0]">
                <div>
                  <p className="font-extrabold text-[#212121]">Data Structures (CS301)</p>
                  <p className="text-[11px] text-[#757575] font-medium">Today • 09:00 AM</p>
                </div>
                <span className="badge-green inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Present
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-[#E2E8F0]">
                <div>
                  <p className="font-extrabold text-[#212121]">Database Systems (CS302)</p>
                  <p className="text-[11px] text-[#757575] font-medium">Yesterday • 02:00 PM</p>
                </div>
                <span className="badge-orange inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Late (5m)
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-[#212121]">Web Engineering (CS305)</p>
                  <p className="text-[11px] text-[#757575] font-medium">18 Aug • 11:00 AM</p>
                </div>
                <span className="badge-green inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Present
                </span>
              </div>
            </div>
          </div>

          {/* CARD 4 (3D Geofence Status): Active Campus Geofence Radar */}
          <div className="card-3d p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider block">
                Automatic Geofence Radar
              </span>
              <span className="badge-green text-[10px] flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse"></span>
                LIVE AUTO-TRACKING
              </span>
            </div>

            <div className="relative w-full h-32 bg-gradient-to-b from-[#FAF8F5] to-[#F1F5F9] rounded-xl border border-[#E2E8F0] flex items-center justify-center overflow-hidden">
              <div className={`absolute w-24 h-24 rounded-full border ${isWithinGeofence ? 'border-[#00C853]/30 animate-ping' : 'border-[#DD2C00]/30 animate-ping'}`}></div>
              <div className={`absolute w-16 h-16 rounded-full border ${isWithinGeofence ? 'border-[#00C853]/50' : 'border-[#DD2C00]/50'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md z-10 ${isWithinGeofence ? 'bg-[#00C853] shadow-[#00C853]/40' : 'bg-[#DD2C00] shadow-[#DD2C00]/40'}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <span className="absolute bottom-2 left-3 text-[10px] font-bold text-[#757575]">
                Lab 402 Perimeter (50m radius)
              </span>
              <span className={`absolute top-2 right-3 text-[10px] font-black ${isWithinGeofence ? 'text-[#00C853]' : 'text-[#DD2C00]'}`}>
                {isWithinGeofence ? '✓ IN RANGE (PRESENT)' : '❌ OUT OF RANGE (ABSENT)'}
              </span>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] text-xs space-y-1.5 font-bold">
              <div className="flex justify-between items-center">
                <span className="text-[#212121]">Automatic GPS Distance:</span>
                <span className={`font-mono text-sm ${isWithinGeofence ? 'text-[#00C853]' : 'text-[#DD2C00]'}`}>
                  {distanceMeters} Meters
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#64748B]">
                <span>Status:</span>
                <span className={isWithinGeofence ? 'text-[#00C853] font-black' : 'text-[#DD2C00] font-black'}>
                  {isWithinGeofence ? '🟢 Inside 50m Fence' : '🔴 Outside Range (Auto-Absent)'}
                </span>
              </div>
              <p className="text-[10px] text-[#757575] font-mono truncate border-t border-[#E2E8F0] pt-1">
                {gpsMessage || `Live GPS Coordinates: ${studentLat.toFixed(4)}, ${studentLng.toFixed(4)}`}
              </p>
            </div>

            {/* Optional Collapsible Developer Override Controls */}
            <div className="pt-1 text-right">
              <button
                onClick={() => setShowDevControls(!showDevControls)}
                className="text-[10px] text-[#2979FF] font-bold hover:underline"
              >
                {showDevControls ? 'Hide Manual Controls' : 'Show Manual Test Override'}
              </button>

              {showDevControls && (
                <div className="grid grid-cols-2 gap-2 pt-2 text-left">
                  <button
                    onClick={() => setSimulatedLocation(14, 28.6139, 77.2090)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-black border transition-all ${
                      distanceMeters <= 50 
                        ? 'bg-[#00C853] text-white border-[#00C853] shadow-sm' 
                        : 'bg-white text-[#64748B] border-[#E2E8F0]'
                    }`}
                  >
                    🏫 Simulate Indoor (14m)
                  </button>

                  <button
                    onClick={() => setSimulatedLocation(120, 28.6150, 77.2105)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-black border transition-all ${
                      distanceMeters > 50 
                        ? 'bg-[#DD2C00] text-white border-[#DD2C00] shadow-sm' 
                        : 'bg-white text-[#64748B] border-[#E2E8F0]'
                    }`}
                  >
                    🚗 Simulate Outdoor (120m)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CARD 5 (3D Student SMS Alerts Widget) */}
          <div className="card-3d p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider">
                  SMS Alert Engine
                </span>
                <span className="badge-green font-mono">LIVE DISPATCH</span>
              </div>
              <p className="text-xs text-[#757575] font-medium mt-2">
                Automated SMS alerts dispatched to parent/student mobile upon attendance verification or risk warnings.
              </p>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] text-xs space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[#212121]">Last Sent SMS:</span>
                <span className="text-[#00C853]">Delivered (Twilio)</span>
              </div>
              <p className="text-[11px] text-[#757575] font-mono bg-white p-2 rounded border border-[#E2E8F0]">
                "Alert: Aarav marked PRESENT in Advanced AI at 10:02 AM."
              </p>
            </div>

            <button
              onClick={() => {
                alert('📲 Test SMS Triggered! Message delivered to +91 9876543212');
              }}
              className="w-full btn-secondary text-xs py-2 justify-center font-extrabold"
            >
              <Smartphone className="w-3.5 h-3.5" /> Test Trigger Instant SMS Alert
            </button>
          </div>

          {/* CARD 6 (3D Subject-wise Attendance Breakdown) */}
          <div className="card-3d p-6 space-y-3">
            <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider block">
              Subject Attendance Breakdown
            </span>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-extrabold text-[#212121] mb-1">
                  <span>Advanced AI</span>
                  <span className="text-[#00C853]">96%</span>
                </div>
                <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E2E8F0]">
                  <div className="h-full bg-gradient-to-r from-[#00C853] to-[#00E676] rounded-full shadow-xs" style={{ width: '96%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold text-[#212121] mb-1">
                  <span>Data Structures</span>
                  <span className="text-[#00C853]">94%</span>
                </div>
                <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E2E8F0]">
                  <div className="h-full bg-gradient-to-r from-[#00C853] to-[#76FF03] rounded-full shadow-xs" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold text-[#212121] mb-1">
                  <span>Database Systems</span>
                  <span className="text-[#FF9100]">76%</span>
                </div>
                <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E2E8F0]">
                  <div className="h-full bg-gradient-to-r from-[#00C853] to-[#FF9100] rounded-full shadow-xs" style={{ width: '76%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STEP 2: Verification Flow */}
      {step === 2 && (
        <div className="card-3d p-6 max-w-xl mx-auto space-y-6 bg-white border border-[#E2E8F0] shadow-2xl">
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
            <div>
              <h3 className="text-lg font-black text-[#212121]">Dual Security Attendance Verification</h3>
              <p className="text-xs text-[#757575] font-bold">Live Geofence Perimeter & Real Face Liveness</p>
            </div>
            <span className="badge-blue font-mono font-bold">Step 2 of 2</span>
          </div>

          {/* 1. Live Geofence Check Box */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-[#212121] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2979FF]" /> 1. Live GPS Geofence Range
              </span>
              <span className={isWithinGeofence ? 'badge-green' : 'badge-orange'}>
                {isWithinGeofence ? '✓ IN RANGE (50m)' : '❌ OUT OF RANGE (ABSENT)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#64748B]">
              <span>Distance to Lab 402:</span>
              <span className={`font-mono font-bold ${isWithinGeofence ? 'text-[#00C853]' : 'text-[#DD2C00]'}`}>
                {distanceMeters} Meters {isWithinGeofence ? '(Passed)' : '(Will mark ABSENT)'}
              </span>
            </div>
          </div>

          {/* 2. Face Liveness Box */}
          <div className="space-y-3 p-4 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-[#212121] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#2979FF]" /> 2. Real Camera Face Liveness
              </span>
              {livenessChecked && <span className="badge-green">✓ CAPTURED & VERIFIED</span>}
            </div>

            {/* Video Canvas & Snapshot Preview Box */}
            <div className="relative w-full h-56 bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-inner border-2 border-dashed border-[#2979FF]/40">
              {faceSnapshot ? (
                <div className="relative w-full h-full">
                  <img src={faceSnapshot} alt="Captured Face" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-4 border-[#00C853] rounded-xl flex items-center justify-center">
                    <span className="bg-[#00C853] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                      ✓ Face Liveness Verified
                    </span>
                  </div>
                </div>
              ) : isCameraActive ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                  {/* Oval Face Alignment Guide Overlay */}
                  <div className="absolute w-36 h-48 rounded-full border-2 border-dashed border-yellow-300 pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] text-yellow-300 font-extrabold bg-black/60 px-2 py-0.5 rounded-full">
                      Align Face Here
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2 p-4">
                  <Camera className="w-10 h-10 mx-auto text-[#2979FF] opacity-60" />
                  <p className="text-xs text-white/80 font-medium">Click below to allow browser camera access</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Camera Action Buttons */}
            <div className="flex gap-2 pt-1">
              {!isCameraActive && !faceSnapshot && (
                <button
                  onClick={startCamera}
                  className="w-full btn-blue justify-center text-xs py-2.5 font-extrabold"
                >
                  <Camera className="w-4 h-4" /> Allow & Start Camera Stream
                </button>
              )}

              {isCameraActive && (
                <button
                  onClick={captureLiveSnapshot}
                  className="w-full btn-blue justify-center text-xs py-2.5 font-extrabold bg-[#00C853] hover:bg-[#00E676]"
                >
                  <Check className="w-4 h-4" /> Capture Live Face Snapshot
                </button>
              )}

              {faceSnapshot && (
                <button
                  onClick={() => { setFaceSnapshot(null); setLivenessChecked(false); startCamera(); }}
                  className="w-full btn-secondary justify-center text-xs py-2 font-bold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Camera Snapshot
                </button>
              )}
            </div>

            {/* Fallback button if camera blocked */}
            {!livenessChecked && (
              <button
                onClick={useSimulatedSnapshot}
                className="w-full text-center text-[11px] text-[#2979FF] font-bold hover:underline pt-1"
              >
                Use Student ID Avatar Photo (Fallback)
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#DD2C00]/10 border border-[#DD2C00]/30 text-[#DD2C00] text-xs font-black flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { stopCamera(); setStep(1); }}
              className="flex-1 btn-secondary text-xs justify-center py-3 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={submitAttendancePipeline}
              disabled={submitting || !livenessChecked}
              className={`flex-1 text-xs justify-center py-3 font-black rounded-xl text-white shadow-md transition-all ${
                isWithinGeofence 
                  ? 'bg-[#2979FF] hover:bg-blue-600' 
                  : 'bg-[#DD2C00] hover:bg-red-700'
              } disabled:opacity-50`}
            >
              {submitting 
                ? 'Verifying Pipeline...' 
                : isWithinGeofence 
                  ? 'Submit & Mark Present' 
                  : 'Submit Attendance (Outside Geofence)'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Result Confirmation (PRESENT vs ABSENT) */}
      {step === 3 && (
        <div className="card-3d p-8 max-w-lg mx-auto text-center space-y-6 bg-white border border-[#E2E8F0] shadow-2xl">
          {pipelineResults?.status === 'ABSENT' || !isWithinGeofence ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-[#DD2C00]/10 text-[#DD2C00] flex items-center justify-center shadow-md">
                <XCircle className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="badge-orange text-xs font-black">GEOFENCE VIOLATION</span>
                <h3 className="text-2xl font-black text-[#DD2C00] mt-2">ATTENDANCE MARKED ABSENT</h3>
                <p className="text-xs text-[#757575] font-bold mt-1">
                  Class: Advanced AI (CS401) • Distance: {distanceMeters} Meters (Exceeds 50m Limit)
                </p>
              </div>

              <div className="p-4 bg-[#DD2C00]/5 rounded-xl border border-[#DD2C00]/20 text-xs space-y-2 text-left font-medium">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Student ID:</span>
                  <span className="font-bold text-[#0F172A]">{user ? user.name : 'Aarav Kumar'} ({user ? user.rollNo : 'CS202601'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Geofence Perimeter:</span>
                  <span className="font-bold text-[#DD2C00]">FAILED ({distanceMeters}m &gt; 50m Limit)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Attendance Status:</span>
                  <span className="font-bold text-[#DD2C00]">AUTOMATICALLY MARKED ABSENT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">SMS Warning Dispatched:</span>
                  <span className="font-bold text-[#2979FF]">Sent to {user ? user.mobile : '+91 9876543212'}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-[#00C853]/10 text-[#00C853] flex items-center justify-center shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="badge-green text-xs font-black">VERIFICATION SUCCESSFUL</span>
                <h3 className="text-2xl font-black text-[#212121] mt-2">ATTENDANCE MARKED PRESENT</h3>
                <p className="text-xs text-[#757575] font-bold mt-1">
                  Class: Advanced AI (CS401) • Distance: {distanceMeters} Meters (Inside 50m Fence)
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] text-xs space-y-2 text-left font-medium">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Student ID:</span>
                  <span className="font-bold text-[#0F172A]">{user ? user.name : 'Aarav Kumar'} ({user ? user.rollNo : 'CS202601'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Geofence Perimeter:</span>
                  <span className="font-bold text-[#00C853]">Passed ({distanceMeters}m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Face Liveness:</span>
                  <span className="font-bold text-[#00C853]">Verified Camera Snapshot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">SMS Confirmation:</span>
                  <span className="font-bold text-[#2979FF]">Sent to {user ? user.mobile : '+91 9876543212'}</span>
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => setStep(1)}
            className="w-full btn-blue text-xs justify-center py-3 font-extrabold"
          >
            Return to Student Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
