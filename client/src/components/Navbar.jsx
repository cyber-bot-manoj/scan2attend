import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  LogOut,
  X,
  Check,
  Smartphone,
  MapPin,
  Camera,
  Globe,
  Sliders,
  Volume2,
  Clock,
  FileSpreadsheet,
  UserCheck,
  ShieldAlert,
  SwitchCamera,
  Navigation
} from 'lucide-react';

const getUserPhoto = (currentUser) => {
  if (!currentUser) return null;
  if (currentUser.role === 'TEACHER') return '/faculty_dhananjay_yadav.jpg';

  const email = (currentUser.email || '').trim().toLowerCase();
  const name = (currentUser.name || '').trim().toLowerCase();

  // 1. Maneesh Singh
  if (email === 'maneeshsingh99648@gmail.com' || name.includes('maneesh singh')) {
    return '/maneesh_singh_profile.jpg';
  }
  // 2. Manoj Sharma
  if (email === 'manojs082007@gmail.com' || email === 'ssindia10677@gmail.com' || name.includes('manoj sharma')) {
    return '/manoj_sharma_profile.jpg';
  }
  // 3. User with custom photo
  if (currentUser.photo && currentUser.photo !== '/manoj_sharma_profile.jpg') {
    return currentUser.photo;
  }
  if (currentUser.faceProfile && !currentUser.faceProfile.startsWith('data:image/svg') && currentUser.faceProfile !== '/manoj_sharma_profile.jpg') {
    return currentUser.faceProfile;
  }
  return null;
};

export default function Navbar({ 
  user, 
  setUser, 
  activeTab, 
  setActiveTab, 
  globalAttendanceRecords = [],
  showSettings: externalShowSettings,
  setShowSettings: externalSetShowSettings
}) {
  const [internalShowSettings, setInternalShowSettings] = useState(false);
  const showSettings = externalShowSettings !== undefined ? externalShowSettings : internalShowSettings;
  const setShowSettings = externalSetShowSettings || setInternalShowSettings;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // showSettings managed via props/state

  // Sync modal state to body class so overlays & chatbot know a modal is open
  React.useEffect(() => {
    if (showSettings) {
      document.body.classList.add('modal-backdrop-active');
    } else {
      document.body.classList.remove('modal-backdrop-active');
    }
    return () => {
      document.body.classList.remove('modal-backdrop-active');
    };
  }, [showSettings]);

  // Global Search Engine across ALL 65 Students of BCA V-B
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultModal, setSelectedResultModal] = useState(null);

  // Live filter across all 65 student records passed from App state
  const searchResults = searchQuery.trim() === '' ? [] : globalAttendanceRecords.filter(s => 
    (s.studentName && s.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.rollNo && s.rollNo.includes(searchQuery)) ||
    (s.subject && s.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Settings State with LocalStorage persistence
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(() => {
    return localStorage.getItem('s2a_sms_alerts') !== 'false';
  });
  const [geofenceRadius, setGeofenceRadius] = useState(() => {
    return Number(localStorage.getItem('s2a_geofence_radius')) || 50;
  });
  const [livenessMode, setLivenessMode] = useState(() => {
    return localStorage.getItem('s2a_liveness_mode') || 'STRICT';
  });
  const [appLanguage, setAppLanguage] = useState(() => {
    return localStorage.getItem('s2a_app_language') || 'English (US)';
  });

  // Student specific settings
  const [cameraMode, setCameraMode] = useState(() => {
    return localStorage.getItem('s2a_camera_mode') || 'user';
  });
  const [attendanceReminders, setAttendanceReminders] = useState(() => {
    return localStorage.getItem('s2a_reminders') !== 'false';
  });
  const [soundOnScan, setSoundOnScan] = useState(() => {
    return localStorage.getItem('s2a_sound_on_scan') !== 'false';
  });
  const [highAccuracyGps, setHighAccuracyGps] = useState(() => {
    return localStorage.getItem('s2a_high_accuracy_gps') !== 'false';
  });

  // Teacher specific settings
  const [qrDuration, setQrDuration] = useState(() => {
    return Number(localStorage.getItem('s2a_qr_duration')) || 5;
  });
  const [autoExportCsv, setAutoExportCsv] = useState(() => {
    return localStorage.getItem('s2a_auto_export_csv') !== 'false';
  });
  const [scanChimeAlert, setScanChimeAlert] = useState(() => {
    return localStorage.getItem('s2a_scan_chime') !== 'false';
  });
  const [proxySmsAlert, setProxySmsAlert] = useState(() => {
    return localStorage.getItem('s2a_proxy_sms') !== 'false';
  });

  // Admin specific settings
  const [riskThreshold, setRiskThreshold] = useState(() => {
    return Number(localStorage.getItem('s2a_risk_threshold')) || 75;
  });
  const [auditRetention, setAuditRetention] = useState(() => {
    return localStorage.getItem('s2a_audit_retention') || '90_DAYS';
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    localStorage.setItem('s2a_sms_alerts', smsAlertsEnabled);
    localStorage.setItem('s2a_geofence_radius', geofenceRadius);
    localStorage.setItem('s2a_liveness_mode', livenessMode);
    localStorage.setItem('s2a_app_language', appLanguage);
    localStorage.setItem('s2a_camera_mode', cameraMode);
    localStorage.setItem('s2a_reminders', attendanceReminders);
    localStorage.setItem('s2a_sound_on_scan', soundOnScan);
    localStorage.setItem('s2a_high_accuracy_gps', highAccuracyGps);
    localStorage.setItem('s2a_qr_duration', qrDuration);
    localStorage.setItem('s2a_auto_export_csv', autoExportCsv);
    localStorage.setItem('s2a_scan_chime', scanChimeAlert);
    localStorage.setItem('s2a_proxy_sms', proxySmsAlert);
    localStorage.setItem('s2a_risk_threshold', riskThreshold);
    localStorage.setItem('s2a_audit_retention', auditRetention);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowSettings(false);
    }, 1200);
  };

  // Reusable Search Input Component for Desktop & Mobile sub-bar
  const renderSearchBar = (isMobile = false) => {
    if (activeTab === 'STUDENT') return null;

    return (
      <div className={`relative ${isMobile ? 'flex-1 max-w-[210px]' : 'hidden md:block'}`}>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search student..."
            className={`${isMobile ? 'w-full pl-8 pr-7 py-1 text-[11px]' : 'w-56 pl-8 pr-7 py-1.5 text-xs'} bg-slate-100 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium`}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() !== '' && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />
            <div className={`absolute right-0 top-9 w-72 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-xs animate-fadeIn max-h-72 overflow-y-auto`}>
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Search Results ({searchResults.length})</span>
                <span>BCA V-B</span>
              </div>

              {searchResults.length > 0 ? (
                searchResults.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedResultModal(st);
                      setShowSearchResults(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-b-0"
                  >
                    <div>
                      <p className="font-extrabold text-slate-900 leading-tight">{st.studentName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Roll: {st.rollNo} • {st.subject}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                      st.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {st.status}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400 font-medium">
                  No student matching "{searchQuery}"
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* TOP LEFT: Scan2Attend branding */}
            <div className="flex items-center gap-3">
              <img src="/scan2attend-logo.svg" alt="Scan2Attend" className="h-10 w-10 sm:h-11 sm:w-11 object-contain transition-transform hover:scale-105" />
              <div>
                <h1 className="text-base font-black text-[#212121] tracking-tight">
                  Scan2Attend
                </h1>
              </div>
            </div>

            {/* CENTER TOP: Role-Based Single Dashboard View (Desktop) */}
            {user && activeTab !== 'LOGIN' && (
              <nav className="hidden md:flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#E2E8F0] shadow-inner">
                {user.role === 'STUDENT' && (
                  <button
                    onClick={() => setActiveTab('STUDENT')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black bg-white text-[#2979FF] shadow-xs border border-[#E2E8F0]"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Student Dashboard
                  </button>
                )}

                {user.role === 'TEACHER' && (
                  <button
                    onClick={() => setActiveTab('TEACHER')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black bg-white text-[#2979FF] shadow-xs border border-[#E2E8F0]"
                  >
                    <Users className="w-4 h-4" />
                    Faculty Dashboard
                  </button>
                )}

                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => setActiveTab('ADMIN')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black bg-white text-[#2979FF] shadow-xs border border-[#E2E8F0]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </button>
                )}
              </nav>
            )}

            {/* TOP RIGHT: Search Bar (Desktop), Settings, User Profile */}
            <div className="flex items-center gap-2.5">
              {user && activeTab !== 'LOGIN' ? (
                <>
                  {/* Desktop Search Bar */}
                  {renderSearchBar(false)}

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E2E8F0] transition-all"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2979FF] shadow-xs flex-shrink-0 bg-[#2979FF]/10 flex items-center justify-center text-white font-bold text-xs relative">
                        {getUserPhoto(user) ? (
                          <img 
                            src={getUserPhoto(user)} 
                            alt="Profile" 
                            className="w-full h-full object-cover object-[center_top]"
                            onError={(e) => { 
                              e.currentTarget.style.display = 'none'; 
                            }}
                          />
                        ) : null}
                        <span className="text-[#2979FF] font-black">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                      </div>
                      <div className="hidden xl:block text-left">
                        <span className="block text-xs font-extrabold text-[#212121] leading-tight">
                          {user.name}
                        </span>
                        <span className="block text-[10px] font-bold text-[#00C853]">
                          {user.role}
                        </span>
                      </div>
                    </button>

                    {showProfileMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-2 z-50 text-xs">
                          <div className="px-4 py-2 border-b border-[#E2E8F0]">
                            <p className="font-bold text-[#212121]">{user.name}</p>
                            <p className="text-[10px] text-[#757575]">{user.email}</p>
                          </div>
                          {user.role === 'STUDENT' && (
                            <button
                              onClick={() => { setActiveTab('STUDENT'); setShowProfileMenu(false); }}
                              className="w-full text-left px-4 py-2 text-[#212121] hover:bg-[#FAF8F5] font-semibold"
                            >
                              Student Portal
                            </button>
                          )}
                          {user.role === 'TEACHER' && (
                            <button
                              onClick={() => { setActiveTab('TEACHER'); setShowProfileMenu(false); }}
                              className="w-full text-left px-4 py-2 text-[#212121] hover:bg-[#FAF8F5] font-semibold"
                            >
                              Faculty Portal
                            </button>
                          )}
                          {user.role === 'ADMIN' && (
                            <button
                              onClick={() => { setActiveTab('ADMIN'); setShowProfileMenu(false); }}
                              className="w-full text-left px-4 py-2 text-[#212121] hover:bg-[#FAF8F5] font-semibold"
                            >
                              Admin System
                            </button>
                          )}
                          {/* Settings Option inside Circular Profile Menu */}
                          <button
                            onClick={() => { 
                              setShowSettings(true); 
                              setShowProfileMenu(false); 
                            }}
                            className="w-full text-left px-4 py-2 text-[#212121] hover:bg-[#FAF8F5] font-semibold flex items-center justify-between transition-colors border-t border-[#E2E8F0]/60 mt-1 pt-2"
                          >
                            <span className="flex items-center gap-2">
                              <Settings className="w-3.5 h-3.5 text-[#2979FF]" />
                              <span>Settings & Preferences</span>
                            </span>
                          </button>

                          <div className="border-t border-[#E2E8F0] mt-1 pt-1">
                            <button
                              onClick={() => { 
                                setUser(null); 
                                setActiveTab('LOGIN'); 
                                setShowProfileMenu(false); 
                              }}
                              className="w-full text-left px-4 py-2 text-[#DD2C00] hover:bg-red-50 font-bold flex items-center justify-between"
                            >
                              <span>Sign Out</span>
                              <LogOut className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>

          </div>
        </div>

        {/* MOBILE SUB-BAR (md:hidden): Left: Faculty/Admin Tab Button, Right: Search Bar */}
        {user && activeTab !== 'LOGIN' && (
          <nav className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-2 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {user.role === 'STUDENT' && (
                <button
                  onClick={() => setActiveTab('STUDENT')}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-black bg-[#2979FF] text-white shadow-xs"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  Student Dashboard
                </button>
              )}
              {user.role === 'TEACHER' && (
                <button
                  onClick={() => setActiveTab('TEACHER')}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-black bg-[#2979FF] text-white shadow-xs"
                >
                  <Users className="h-3.5 w-3.5" />
                  Faculty Dashboard
                </button>
              )}
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => setActiveTab('ADMIN')}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-black bg-[#2979FF] text-white shadow-xs"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin Panel
                </button>
              )}
            </div>

            {/* Search Bar on Mobile Phone right next to Faculty/Admin Dashboard button */}
            {renderSearchBar(true)}
          </nav>
        )}
      </header>

      {/* SYSTEM PREFERENCES & SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="card-3d bg-white max-w-lg w-full p-6 space-y-5 shadow-2xl rounded-3xl border border-[#E2E8F0] max-h-[88vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xs ${
                  user?.role === 'TEACHER' 
                    ? 'bg-purple-100 text-purple-700' 
                    : user?.role === 'ADMIN' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user?.role === 'TEACHER' ? (
                    <UserCheck className="w-5 h-5" />
                  ) : user?.role === 'ADMIN' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <GraduationCap className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#212121] flex items-center gap-2">
                    {user?.role === 'TEACHER' 
                      ? 'Faculty Settings & Tools' 
                      : user?.role === 'ADMIN' 
                      ? 'Administrator Global Controls' 
                      : 'Student Settings & Preferences'}
                  </h3>
                  <p className="text-[11px] text-[#757575] font-medium">
                    {user?.role === 'TEACHER'
                      ? 'Manage QR timer, auto-export & scan chimes'
                      : user?.role === 'ADMIN'
                      ? 'Configure geofence radius, liveness strictness & SMS'
                      : 'Manage camera selection, reminders & sound alerts'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Settings Options List */}
            <div className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1">
              
              {/* ======================================================== */}
              {/* ROLE-BASED FEATURES: STUDENT */}
              {/* ======================================================== */}
              {user?.role === 'STUDENT' && (
                <>
                  {/* Student Option 1: Camera Selection (Front vs Back) */}
                  <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center gap-2">
                      <SwitchCamera className="w-4 h-4 text-[#2979FF]" />
                      <span className="font-extrabold text-[#212121]">Face Verification Camera</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setCameraMode('user')}
                        className={`py-2 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-1.5 ${
                          cameraMode === 'user'
                            ? 'bg-[#2979FF] text-white border-[#2979FF] shadow-sm'
                            : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Front (Selfie)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraMode('environment')}
                        className={`py-2 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-1.5 ${
                          cameraMode === 'environment'
                            ? 'bg-[#2979FF] text-white border-[#2979FF] shadow-sm'
                            : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                        }`}
                      >
                        <SwitchCamera className="w-3.5 h-3.5" />
                        Back (Rear Camera)
                      </button>
                    </div>
                  </div>

                  {/* Student Option 2: Class Attendance Reminders */}
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-2xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-[#2979FF]" />
                      <div>
                        <span className="font-extrabold text-[#212121] block">Class Lecture Reminders</span>
                        <span className="text-[10px] text-[#757575]">Push notification 10 minutes before lecture</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttendanceReminders(!attendanceReminders)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                        attendanceReminders ? 'bg-[#00C853] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>

                  {/* Student Option 3: Audio Beep on Attendance Marked */}
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-2xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-2.5">
                      <Volume2 className="w-4 h-4 text-[#2979FF]" />
                      <div>
                        <span className="font-extrabold text-[#212121] block">Audio Scan Confirmation</span>
                        <span className="text-[10px] text-[#757575]">Play audio chime upon successful scan</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundOnScan(!soundOnScan)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                        soundOnScan ? 'bg-[#00C853] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>

                  {/* Student Option 4: High Accuracy GPS Positioning */}
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-2xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-2.5">
                      <Navigation className="w-4 h-4 text-[#2979FF]" />
                      <div>
                        <span className="font-extrabold text-[#212121] block">High Accuracy GPS</span>
                        <span className="text-[10px] text-[#757575]">Use fine hardware geolocation for campus geofence</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHighAccuracyGps(!highAccuracyGps)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                        highAccuracyGps ? 'bg-[#00C853] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>
                </>
              )}

              {/* ======================================================== */}
              {/* ROLE-BASED FEATURES: TEACHER / FACULTY */}
              {/* ======================================================== */}
              {user?.role === 'TEACHER' && (
                <>
                  {/* Teacher Option 1: Dynamic QR Expiry Timer */}
                  <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-200/70 space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="font-extrabold text-[#212121]">Dynamic QR Expiry Timer</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      {[3, 5, 10].map(mins => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setQrDuration(mins)}
                          className={`py-2 rounded-xl font-bold text-xs transition-all border ${
                            qrDuration === mins
                              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                              : 'bg-white text-slate-600 border-purple-200 hover:bg-purple-50'
                          }`}
                        >
                          {mins} Mins {mins === 5 && '(Default)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Teacher Option 2: Auto-Export CSV at End */}
                  <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-2xl border border-purple-200/70">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-extrabold text-[#212121] block">Auto-Export CSV on Session End</span>
                        <span className="text-[10px] text-[#757575]">Download CSV report automatically after timer</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoExportCsv(!autoExportCsv)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                        autoExportCsv ? 'bg-[#00C853] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>

                  {/* Teacher Option 3: Sound Chime on Student Scan */}
                  <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-2xl border border-purple-200/70">
                    <div className="flex items-center gap-2.5">
                      <Volume2 className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-extrabold text-[#212121] block">Live Student Scan Chime</span>
                        <span className="text-[10px] text-[#757575]">Audio ding whenever a student verifies</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScanChimeAlert(!scanChimeAlert)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                        scanChimeAlert ? 'bg-[#00C853] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>

                  {/* Teacher Option 4: Instant Proxy Geofence Warning SMS */}
                  <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-2xl border border-purple-200/70">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-extrabold text-[#212121] block">Instant Proxy Warning Alert</span>
                        <span className="text-[10px] text-[#757575]">Flag & alert students violating distance (&gt;50m)</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProxySmsAlert(!proxySmsAlert)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                        proxySmsAlert ? 'bg-[#00C853] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>
                </>
              )}

              {/* ======================================================== */}
              {/* ROLE-BASED FEATURES: ADMIN */}
              {/* ======================================================== */}
              {user?.role === 'ADMIN' && (
                <>
                  {/* Admin Option 1: Geofence Safety Radius */}
                  <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span className="font-extrabold text-[#212121]">Geofence Radius Constraint</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      {[25, 50, 100].map(radius => (
                        <button
                          key={radius}
                          type="button"
                          onClick={() => setGeofenceRadius(radius)}
                          className={`py-2 rounded-xl font-bold text-xs transition-all border ${
                            geofenceRadius === radius
                              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                              : 'bg-white text-slate-600 border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          {radius}m {radius === 50 && '(Default)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Admin Option 2: Face Liveness Strictness */}
                  <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-2">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-600" />
                      <span className="font-extrabold text-[#212121]">Face Liveness Verification</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setLivenessMode('STRICT')}
                        className={`py-2 rounded-xl font-bold text-xs transition-all border ${
                          livenessMode === 'STRICT'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-600 border-amber-200'
                        }`}
                      >
                        Strict (Live Camera)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLivenessMode('FAST')}
                        className={`py-2 rounded-xl font-bold text-xs transition-all border ${
                          livenessMode === 'FAST'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white text-slate-600 border-amber-200'
                        }`}
                      >
                        Fast (Snapshot)
                      </button>
                    </div>
                  </div>

                  {/* Admin Option 3: Low Attendance Risk Threshold */}
                  <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span className="font-extrabold text-[#212121]">Low Attendance Alert Limit</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      {[75, 80, 85].map(limit => (
                        <button
                          key={limit}
                          type="button"
                          onClick={() => setRiskThreshold(limit)}
                          className={`py-2 rounded-xl font-bold text-xs transition-all border ${
                            riskThreshold === limit
                              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                              : 'bg-white text-slate-600 border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          {limit}% {limit === 75 && '(Mandatory)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Admin Option 4: Audit Logs Retention */}
                  <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-2xl border border-amber-200/70">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <div>
                        <span className="font-extrabold text-[#212121] block">Audit Logs Retention</span>
                        <span className="text-[10px] text-[#757575]">Keep crypto hashes & GPS verification history</span>
                      </div>
                    </div>
                    <select 
                      value={auditRetention}
                      onChange={(e) => setAuditRetention(e.target.value)}
                      className="bg-white border border-amber-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="30_DAYS">30 Days</option>
                      <option value="90_DAYS">90 Days</option>
                      <option value="1_YEAR">1 Year</option>
                    </select>
                  </div>
                </>
              )}

              {/* ======================================================== */}
              {/* COMMON OPTIONS: ALL ROLES */}
              {/* ======================================================== */}
              <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-2xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#2979FF]" />
                  <div>
                    <span className="font-extrabold text-[#212121] block">Instant SMS Notifications</span>
                    <span className="text-[10px] text-[#757575]">Dispatch Twilio SMS on present / risk warnings</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsAlertsEnabled(!smsAlertsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                    smsAlertsEnabled ? 'bg-[#00C853] justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                </button>
              </div>

              {/* Common Option: Language */}
              <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-2xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#2979FF]" />
                  <span className="font-extrabold text-[#212121]">App Interface Language</span>
                </div>
                <select 
                  value={appLanguage}
                  onChange={(e) => setAppLanguage(e.target.value)}
                  className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs font-bold text-[#212121] focus:outline-none"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8F0] shrink-0">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="flex-1 btn-secondary justify-center py-2.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex-1 btn-blue justify-center py-2.5 text-xs font-extrabold"
              >
                {savedSuccess ? (
                  <span className="flex items-center gap-1.5 justify-center text-white">
                    <Check className="w-4 h-4" /> Preferences Saved!
                  </span>
                ) : (
                  'Save Preferences'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Search Result Detail Modal for All 65 Students */}
      {selectedResultModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999]">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Student Profile & Attendance Record</h3>
              </div>
              <button
                onClick={() => setSelectedResultModal(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-black text-slate-900">{selectedResultModal.studentName}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                    selectedResultModal.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'
                  }`}>
                    {selectedResultModal.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-200">
                  <div>Roll No: <strong className="text-slate-900 block font-mono">{selectedResultModal.rollNo}</strong></div>
                  <div>Distance: <strong className="text-slate-900 block font-mono">{selectedResultModal.distanceMeters || '14'}m Away</strong></div>
                  <div className="col-span-2">Subject: <strong className="text-slate-900 block font-mono">{selectedResultModal.subject}</strong></div>
                  <div className="col-span-2">Class Section: <strong className="text-slate-900 block">B.C.A • Semester V-B • Room B-302</strong></div>
                  <div className="col-span-2">Audit Verification Hash: <strong className="text-slate-900 block font-mono text-[10px] text-blue-600">{selectedResultModal.hash || 'AUDIT-2026-REC-771829'}</strong></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedResultModal(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Close Record View
            </button>
          </div>
        </div>
      )}
    </>
  );
}
