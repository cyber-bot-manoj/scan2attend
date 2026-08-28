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

export default function Navbar({ user, setUser, activeTab, setActiveTab }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings State
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [geofenceRadius, setGeofenceRadius] = useState(50);
  const [livenessMode, setLivenessMode] = useState('STRICT');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowSettings(false);
    }, 1200);
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* TOP LEFT: Professional App Logo ('A+') & System Title */}
            <div className="flex items-center gap-3">
              <img src="/scan2attend-logo.svg" alt="Scan2Attend" className="h-11 w-11 object-contain transition-transform hover:scale-105" />
              <div>
                <h1 className="text-base font-black text-[#212121] tracking-tight">
                  Scan2Attend
                </h1>
              </div>
            </div>

            {/* CENTER TOP: Clean Portal Switcher Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#E2E8F0] shadow-inner">
              <button
                onClick={() => setActiveTab('STUDENT')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeTab === 'STUDENT'
                    ? 'bg-white text-[#2979FF] shadow-sm border border-[#E2E8F0] scale-102'
                    : 'text-[#757575] hover:text-[#212121] hover:bg-white/50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                My Dashboard
              </button>

              <button
                onClick={() => setActiveTab('TEACHER')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeTab === 'TEACHER'
                    ? 'bg-white text-[#2979FF] shadow-sm border border-[#E2E8F0] scale-102'
                    : 'text-[#757575] hover:text-[#212121] hover:bg-white/50'
                }`}
              >
                <Users className="w-4 h-4" />
                Faculty Dashboard
              </button>

              <button
                onClick={() => setActiveTab('ADMIN')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeTab === 'ADMIN'
                    ? 'bg-white text-[#2979FF] shadow-sm border border-[#E2E8F0] scale-102'
                    : 'text-[#757575] hover:text-[#212121] hover:bg-white/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </button>
            </nav>

            {/* TOP RIGHT: Search Bar, Notifications, Settings, User Profile */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative hidden lg:block">
                <Search className="w-4 h-4 text-[#757575] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search classes, roll no..."
                  className="w-48 pl-9 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E2E8F0] rounded-xl text-xs text-[#212121] focus:outline-none focus:border-[#2979FF] focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Settings Gear Icon (Opens System Settings Modal instead of Admin Panel) */}
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
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E2E8F0] transition-all"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2979FF] shadow-xs flex-shrink-0 bg-[#2979FF]/10 flex items-center justify-center text-white font-bold text-xs">
                    <img 
                      src={user?.role === 'TEACHER' ? '/faculty_rajesh_sharma.jpg' : '/manoj_sharma_profile.jpg'} 
                      alt="Profile" 
                      className="w-full h-full object-cover object-[center_top]"
                      onError={(e) => { 
                        if (user?.role === 'TEACHER') {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
                        } else {
                          e.currentTarget.style.display = 'none'; 
                        }
                      }}
                    />
                    <span className="text-[#2979FF] font-black">{user ? user.name.charAt(0) : 'A'}</span>
                  </div>
                  <div className="hidden xl:block text-left">
                    <span className="block text-xs font-extrabold text-[#212121] leading-tight">
                      {user ? user.name : 'Manoj Sharma'}
                    </span>
                    <span className="block text-[10px] font-bold text-[#00C853]">
                      {user ? user.role : 'STUDENT'}
                    </span>
                  </div>
                </button>

                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-[#E2E8F0]">
                        <p className="font-bold text-[#212121]">{user ? user.name : 'Manoj Sharma'}</p>
                        <p className="text-[10px] text-[#757575]">{user ? user.email : 'student@school.edu'}</p>
                      </div>
                      <button
                        onClick={() => { setActiveTab('STUDENT'); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-[#212121] hover:bg-[#FAF8F5] font-semibold"
                      >
                        Student Portal
                      </button>
                      <button
                        onClick={() => { setActiveTab('TEACHER'); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-[#212121] hover:bg-[#FAF8F5] font-semibold"
                      >
                        Faculty Portal
                      </button>
                      <button
                        onClick={() => { setActiveTab('ADMIN'); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-[#212121] hover:bg-[#FAF8F5] font-semibold"
                      >
                        Admin System
                      </button>
                      <div className="border-t border-[#E2E8F0] mt-1 pt-1">
                        <button
                          onClick={() => { setActiveTab('LOGIN'); setShowProfileMenu(false); }}
                          className="w-full text-left px-4 py-2 text-[#DD2C00] hover:bg-red-50 font-bold flex items-center justify-between"
                        >
                          <span>Switch Account</span>
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
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
    </>
  );
}
