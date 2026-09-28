import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  QrCode, 
  Camera, 
  Smartphone, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  ExternalLink,
  ArrowRight,
  Send,
  Zap,
  Radio,
  Award,
  Globe
} from 'lucide-react';

export default function Footer({ setActiveTab, user }) {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmailInput('');
    }, 2500);
  };

  return (
    <footer className="relative z-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 border-t border-slate-800/80 mt-auto overflow-hidden">
      
      {/* Sleek Top Glowing Gradient Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-purple-500 animate-pulse"></div>

      {/* Ambient Radial Mesh Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10 space-y-10">
        
        {/* TOP CALLOUT BANNER: CAMPUS ALERT NEWSLETTER & LIVE SYSTEM HEALTH */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          <div className="space-y-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                All Campus Services Operational
              </span>
            </div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Scan2Attend Unified Attendance Platform
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Real-time GPS Geofencing (50m) • Dynamic 5-Min QR • AI Face Liveness • Instant Parent SMS
            </p>
          </div>

          {/* Email Subscription Box */}
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email for instant alerts..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              {subscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Subscribed!
                </>
              ) : (
                <>
                  <span>Subscribe</span> <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* MAIN NAVIGATION & INFORMATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-800/80 items-start">
          
          {/* Brand & Campus Overview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl border border-indigo-500/30 shadow-lg">
                <img src="/scan2attend-logo.svg" alt="Scan2Attend Logo" className="h-9 w-9 object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Scan2Attend
                  <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                    v2.5 PRO
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 font-semibold">
                  Maharishi University of Information Technology
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4 font-normal">
              Next-generation campus smart attendance verification engine. Built with cryptographic audit streams, dynamic QR generation, Haversine GPS range calculators, and multi-factor biometric authentication.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono">
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> SHA-256 Encrypted
              </span>
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" /> 50m Geofence Active
              </span>
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-purple-400" /> Parent SMS Gateway
              </span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            
            {/* Column 1: System Portals */}
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> System Portals
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab?.('STUDENT')}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                  <span>Student Dashboard</span>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab?.('TEACHER')}>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                  <span>Faculty Dashboard</span>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab?.('ADMIN')}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>Admin Control Panel</span>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab?.('LOGIN')}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>Portal Authentication</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Security & Tech */}
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Security Stack
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>GPS Geofence (50m)</span>
                </li>
                <li className="flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dynamic 5-Min QR</span>
                </li>
                <li className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>AI Face Liveness</span>
                </li>
                <li className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Instant SMS Gateway</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Support */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Campus Contact
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">manojs082007@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>+91 8840034446</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">Room B-302, MSOET MUIT Lucknow</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          
          <div className="flex items-center gap-2 text-center sm:text-left">
            <img src="/scan2attend-logo.svg" alt="Scan2Attend" className="h-5 w-5 object-contain" />
            <span>© 2026 <strong className="text-white font-bold">Scan2Attend</strong>. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-blue-400 transition-colors">Security Audit</a>
            <span>•</span>
            <a href="#support" onClick={(e) => e.preventDefault()} className="hover:text-blue-400 transition-colors">Campus Helpdesk</a>
          </div>

        </div>

      </div>
    </footer>
  );
}
