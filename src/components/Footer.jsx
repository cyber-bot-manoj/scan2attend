import React from 'react';
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
  Heart
} from 'lucide-react';

export default function Footer({ setActiveTab, user }) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative z-10 pt-12 pb-6 mt-auto">
      {/* Subtle Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-indigo-600/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-blue-600/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP BRANDING & STATUS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80 items-start">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                <img src="/scan2attend-logo.svg" alt="Scan2Attend Logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-tight">Scan2Attend</h2>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4 font-normal">
              Next-generation unified campus attendance ecosystem. Empowering educational institutions with real-time GPS Geofencing, dynamic QR code verification, AI face liveness detection, and instant SMS alerts.
            </p>
          </div>

          {/* Quick Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            
            {/* Column 1: Navigation Portals (Non-clickable static text) */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> System Portals
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                  <span>Student Portal</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                  <span>Teacher Dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>Admin Control Panel</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>Portal Authentication</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Key Features */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Core Security
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
                  <span>Instant SMS Engine</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Support */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Campus Contact
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
                  <span className="leading-tight">Tech Block, Unified Campus</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
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
            <a href="#support" onClick={(e) => e.preventDefault()} className="hover:text-blue-400 transition-colors">Help Center</a>
          </div>

        </div>

      </div>
    </footer>
  );
}
