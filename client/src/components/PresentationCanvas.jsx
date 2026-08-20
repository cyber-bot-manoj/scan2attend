import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, LayoutGrid, Monitor, Shield, Sparkles, CheckCircle2, Clock, AlertTriangle, MapPin, Bell, BarChart2, Zap, Play, RefreshCw, LineChart, MessageSquare, Activity, Users, FileText, Settings, Download } from 'lucide-react';
import StudentPanel from './StudentPanel';
import TeacherPanel from './TeacherPanel';
import AdminPanel from './AdminPanel';

export default function PresentationCanvas({ user, setUser, onSelectTab }) {
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, 0.8, 1.2
  const [activeFocus, setActiveFocus] = useState('ALL'); // 'ALL', 'STUDENT', 'TEACHER', 'ADMIN'

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="space-y-6">
      {/* Canvas Top Control Header */}
      <div className="app-card p-4 flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2979FF] text-white flex items-center justify-center font-black text-lg shadow-sm">
            3X
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#212121] leading-tight">
              Unified Campus Canvas Presentation
            </h2>
            <p className="text-xs text-[#757575] font-medium">
              Side-by-Side 3-Screen Tablet Canvas • Minimalist Premium Card System
            </p>
          </div>
        </div>

        {/* Focus & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Focus Switcher */}
          <div className="flex items-center bg-[#FAF8F5] p-1 rounded-lg border border-[#E0E0E0] text-xs font-semibold">
            <button
              onClick={() => setActiveFocus('ALL')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFocus === 'ALL'
                  ? 'bg-white text-[#2979FF] shadow-xs font-bold border border-[#E0E0E0]'
                  : 'text-[#757575] hover:text-[#212121]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 inline mr-1" />
              All 3 Screens
            </button>
            <button
              onClick={() => setActiveFocus('STUDENT')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFocus === 'STUDENT'
                  ? 'bg-white text-[#2979FF] shadow-xs font-bold border border-[#E0E0E0]'
                  : 'text-[#757575] hover:text-[#212121]'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setActiveFocus('TEACHER')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFocus === 'TEACHER'
                  ? 'bg-white text-[#2979FF] shadow-xs font-bold border border-[#E0E0E0]'
                  : 'text-[#757575] hover:text-[#212121]'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => setActiveFocus('ADMIN')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFocus === 'ADMIN'
                  ? 'bg-white text-[#2979FF] shadow-xs font-bold border border-[#E0E0E0]'
                  : 'text-[#757575] hover:text-[#212121]'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-[#FAF8F5] p-1 rounded-lg border border-[#E0E0E0] text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white rounded text-[#757575] hover:text-[#212121] transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-bold text-[#212121] text-xs">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white rounded text-[#757575] hover:text-[#212121] transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-white rounded text-[#757575] hover:text-[#212121] transition-all ml-1 border-l border-[#E0E0E0]"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* DIGITAL CANVAS CONTAINER */}
      <div className="w-full overflow-x-auto pb-8 pt-2">
        <div
          className="transition-transform duration-300 origin-top flex flex-col xl:flex-row gap-8 items-start justify-center min-w-[1100px] xl:min-w-0"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* SCREEN 1: Student Dashboard Tablet Frame */}
          {(activeFocus === 'ALL' || activeFocus === 'STUDENT') && (
            <div className="flex-1 w-full min-w-[360px] max-w-[560px] mx-auto space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-extrabold text-[#212121] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2979FF]"></span>
                  Screen 1: Student Dashboard
                </span>
                <button
                  onClick={() => onSelectTab && onSelectTab('STUDENT')}
                  className="text-xs font-bold text-[#2979FF] hover:underline"
                >
                  Expand Full View &rarr;
                </button>
              </div>

              {/* Realistic Tablet Frame Mockup */}
              <div className="tablet-frame">
                {/* Tablet Top Notch & Camera */}
                <div className="flex justify-between items-center px-4 pb-2 text-[10px] text-gray-400 font-mono">
                  <span>9:41 AM</span>
                  <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto"></div>
                  <div className="flex items-center gap-1">
                    <span>100%</span>
                    <span className="w-2.5 h-1.5 bg-[#00C853] rounded-xs inline-block"></span>
                  </div>
                </div>

                {/* Tablet Inner Screen Content */}
                <div className="tablet-inner-screen p-4 max-h-[780px] overflow-y-auto space-y-4">
                  <StudentPanel user={user} />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: Teacher Dashboard Tablet Frame */}
          {(activeFocus === 'ALL' || activeFocus === 'TEACHER') && (
            <div className="flex-1 w-full min-w-[360px] max-w-[560px] mx-auto space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-extrabold text-[#212121] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00C853]"></span>
                  Screen 2: Teacher Dashboard
                </span>
                <button
                  onClick={() => onSelectTab && onSelectTab('TEACHER')}
                  className="text-xs font-bold text-[#2979FF] hover:underline"
                >
                  Expand Full View &rarr;
                </button>
              </div>

              {/* Realistic Tablet Frame Mockup */}
              <div className="tablet-frame">
                {/* Tablet Top Notch & Camera */}
                <div className="flex justify-between items-center px-4 pb-2 text-[10px] text-gray-400 font-mono">
                  <span>9:41 AM</span>
                  <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto"></div>
                  <div className="flex items-center gap-1">
                    <span>100%</span>
                    <span className="w-2.5 h-1.5 bg-[#00C853] rounded-xs inline-block"></span>
                  </div>
                </div>

                {/* Tablet Inner Screen Content */}
                <div className="tablet-inner-screen p-4 max-h-[780px] overflow-y-auto space-y-4">
                  <TeacherPanel user={user} />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Admin Panel Tablet Frame */}
          {(activeFocus === 'ALL' || activeFocus === 'ADMIN') && (
            <div className="flex-1 w-full min-w-[360px] max-w-[560px] mx-auto space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-extrabold text-[#212121] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9100]"></span>
                  Screen 3: Admin Panel
                </span>
                <button
                  onClick={() => onSelectTab && onSelectTab('ADMIN')}
                  className="text-xs font-bold text-[#2979FF] hover:underline"
                >
                  Expand Full View &rarr;
                </button>
              </div>

              {/* Realistic Tablet Frame Mockup */}
              <div className="tablet-frame">
                {/* Tablet Top Notch & Camera */}
                <div className="flex justify-between items-center px-4 pb-2 text-[10px] text-gray-400 font-mono">
                  <span>9:41 AM</span>
                  <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto"></div>
                  <div className="flex items-center gap-1">
                    <span>100%</span>
                    <span className="w-2.5 h-1.5 bg-[#00C853] rounded-xs inline-block"></span>
                  </div>
                </div>

                {/* Tablet Inner Screen Content */}
                <div className="tablet-inner-screen p-4 max-h-[780px] overflow-y-auto space-y-4">
                  <AdminPanel />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
