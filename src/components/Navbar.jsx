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
  Sliders
} from 'lucide-react';

export default function Navbar({ user, setUser, activeTab, setActiveTab, globalAttendanceRecords = [] }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings State
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [geofenceRadius, setGeofenceRadius] = useState(50);
  const [livenessMode, setLivenessMode] = useState('STRICT');
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleSaveSettings = () => {
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

                  {/* Settings Gear Icon */}
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="p-2 rounded-xl text-[#757575] hover:text-[#212121] hover:bg-[#FAF8F5] transition-colors"
                    title="System Settings & Preferences"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E2E8F0] transition-all"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2979FF] shadow-xs flex-shrink-0 bg-[#2979FF]/10 flex items-center justify-center text-white font-bold text-xs">
                        <img 
                          src={user.role === 'TEACHER' ? '/faculty_dhananjay_yadav.jpg' : '/manoj_sharma_profile.jpg'} 
                          alt="Profile" 
                          className="w-full h-full object-cover object-[center_top]"
                          onError={(e) => { 
                            if (user.role === 'TEACHER') {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
                            } else {
                              e.currentTarget.style.display = 'none'; 
                            }
                          }}
                        />
                        <span className="text-[#2979FF] font-black">{user.name.charAt(0)}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="card-3d bg-white max-w-md w-full p-6 space-y-6 shadow-2xl rounded-2xl border border-[#E2E8F0]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2979FF]/10 text-[#2979FF] flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#212121]">System Settings & Preferences</h3>
                  <p className="text-[11px] text-[#757575] font-medium">Configure app behavior, geofence & alerts</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settings Options List */}
            <div className="space-y-4 text-xs">
              
              {/* Option 1: SMS Alert Notifications */}
              <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-[#2979FF]" />
                  <div>
                    <span className="font-extrabold text-[#212121] block">Instant SMS Notifications</span>
                    <span className="text-[10px] text-[#757575]">Dispatch Twilio SMS on present / risk warnings</span>
                  </div>
                </div>
                <button
                  onClick={() => setSmsAlertsEnabled(!smsAlertsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                    smsAlertsEnabled ? 'bg-[#00C853] justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                </button>
              </div>

              {/* Option 2: Geofence Safety Perimeter Radius */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2979FF]" />
                  <span className="font-extrabold text-[#212121]">Geofence Radius Constraint</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[25, 50, 100].map(radius => (
                    <button
                      key={radius}
                      onClick={() => setGeofenceRadius(radius)}
                      className={`py-2 rounded-lg font-extrabold text-xs transition-all border ${
                        geofenceRadius === radius
                          ? 'bg-[#2979FF] text-white border-[#2979FF] shadow-md'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-gray-50'
                      }`}
                    >
                      {radius} Meters {radius === 50 && '(Default)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Camera Liveness Strictness */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#2979FF]" />
                  <span className="font-extrabold text-[#212121]">Face Liveness Verification Level</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setLivenessMode('STRICT')}
                    className={`py-2 rounded-lg font-extrabold text-xs transition-all border ${
                      livenessMode === 'STRICT'
                        ? 'bg-[#00C853] text-white border-[#00C853] shadow-md'
                        : 'bg-white text-[#64748B] border-[#E2E8F0]'
                    }`}
                  >
                    Strict (Live Camera)
                  </button>
                  <button
                    onClick={() => setLivenessMode('FAST')}
                    className={`py-2 rounded-lg font-extrabold text-xs transition-all border ${
                      livenessMode === 'FAST'
                        ? 'bg-[#2979FF] text-white border-[#2979FF] shadow-md'
                        : 'bg-white text-[#64748B] border-[#E2E8F0]'
                    }`}
                  >
                    Fast (Snapshot)
                  </button>
                </div>
              </div>

              {/* Option 4: System Language */}
              <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#2979FF]" />
                  <span className="font-extrabold text-[#212121]">App Interface Language</span>
                </div>
                <select className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs font-bold text-[#212121]">
                  <option>English (US)</option>
                  <option>Hindi (हिन्दी)</option>
                  <option>Hinglish</option>
                </select>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 btn-secondary justify-center py-2.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 btn-blue justify-center py-2.5 text-xs font-extrabold"
              >
                {savedSuccess ? (
                  <span className="flex items-center gap-1">
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
