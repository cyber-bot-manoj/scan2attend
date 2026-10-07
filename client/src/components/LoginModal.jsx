import React, { useState } from 'react';
import { LogIn, Key, Mail, UserCheck, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react';

export default function LoginModal({ setUser, setActiveTab }) {
  const [email, setEmail] = useState('teacher@school.edu');
  const [password, setPassword] = useState('teacher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        if (data.user.role === 'TEACHER') setActiveTab('TEACHER');
        else if (data.user.role === 'STUDENT') setActiveTab('STUDENT');
        else setActiveTab('ADMIN');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error with server');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAcc = (role) => {
    if (role === 'TEACHER') {
      setEmail('teacher@school.edu');
      setPassword('teacher');
    } else if (role === 'STUDENT') {
      setEmail('student@school.edu');
      setPassword('student');
    } else {
      setEmail('admin@school.edu');
      setPassword('admin');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 shadow-lg shadow-indigo-500/30 flex items-center justify-center border border-white/20">
            <img src="/scan2attend-logo.svg" alt="Scan2Attend Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1">
              Scan<span className="text-indigo-400">2</span>Attend
            </h1>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">Smart Attendance System</span>
          </div>
        </div>

        <div className="relative group w-full mb-4 p-2 rounded-2xl border-2 border-indigo-500/50 shadow-2xl bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#1E293B] overflow-hidden">
          <img 
            src="/campus_attendance_hero.png" 
            alt="Scan2Attend Campus System" 
            className="w-full h-48 sm:h-56 object-contain object-center rounded-xl transform transition-transform duration-500 group-hover:scale-102"
          />
        </div>
        <h2 className="text-xl font-bold text-white">System Portal Login</h2>
        <p className="text-xs text-gray-400 mt-1">Select role or enter your credentials</p>
      </div>

      {/* Quick Role Selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          type="button"
          onClick={() => fillQuickAcc('TEACHER')}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
            email === 'teacher@school.edu'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
              : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-5 h-5 text-indigo-400" />
          Faculty
        </button>

        <button
          type="button"
          onClick={() => fillQuickAcc('STUDENT')}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
            email === 'student@school.edu'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
              : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          Student
        </button>

        <button
          type="button"
          onClick={() => fillQuickAcc('ADMIN')}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
            email === 'admin@school.edu'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
              : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          Admin
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
          <div className="relative">
            <Key className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary justify-center py-3 text-sm mt-2"
        >
          {loading ? 'Authenticating...' : email.includes('teacher') ? 'Enter Faculty Portal' : email.includes('student') ? 'Enter Student Portal' : 'Enter Admin Portal'}
        </button>
      </form>
    </div>
  );
}
