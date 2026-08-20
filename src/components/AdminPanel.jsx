import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Users, MapPin, FileText, Settings, BarChart2, CheckCircle2, Download, Plus, RefreshCw } from 'lucide-react';

export default function AdminPanel() {
  const [data, setData] = useState({
    students: [],
    teachers: [],
    classes: [],
    attendance: [],
    smsLogs: []
  });

  const [selectedClassId, setSelectedClassId] = useState('');
  const [geoLat, setGeoLat] = useState('28.6139');
  const [geoLng, setGeoLng] = useState('77.2090');
  const [geoRadius, setGeoRadius] = useState('50');
  const [geoMessage, setGeoMessage] = useState('');
  const [qrExpiryDuration, setQrExpiryDuration] = useState(5); // Minutes

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const resData = await res.json();
      if (resData.success) {
        setData(resData);
        if (resData.classes.length > 0 && !selectedClassId) {
          setSelectedClassId(resData.classes[0].id);
          setGeoLat(resData.classes[0].latitude);
          setGeoLng(resData.classes[0].longitude);
          setGeoRadius(resData.classes[0].radiusMeters);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateGeofence = async (e) => {
    e.preventDefault();
    setGeoMessage('');
    try {
      const res = await fetch('/api/admin/update-geofence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          latitude: geoLat,
          longitude: geoLng,
          radiusMeters: geoRadius
        })
      });
      const resData = await res.json();
      if (resData.success) {
        setGeoMessage('Geofence updated!');
        fetchAdminDashboard();
      }
    } catch (err) {
      setGeoMessage('Failed to update geofence');
    }
  };

  const exportComprehensiveReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,Student Name,Roll No,Subject,Timestamp,Distance (m),Status\n';
    data.attendance.forEach(row => {
      csvContent += `${row.id},${row.studentName},${row.rollNo},${row.subject},${new Date(row.timestamp).toLocaleString()},${row.location?.distanceMeters || 0},${row.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Campus_Attendance_Master_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#212121]">System Administration Panel</h2>
          <p className="text-xs text-[#757575] font-medium mt-0.5">
            Campus Command & Control Engine • Uptime: <span className="font-bold text-[#00C853]">99.9%</span>
          </p>
        </div>
        <button
          onClick={exportComprehensiveReport}
          className="btn-blue text-xs"
        >
          <Download className="w-4 h-4" />
          Generate Comprehensive Report
        </button>
      </div>

      {/* SCREEN 3: 3x2 Grid of 3D Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD 1 (3D System Health): Metrics for system uptime, active users, live geofences */}
        <div className="card-3d p-6 space-y-4">
          <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#00C853]" /> System Health & Status
          </span>

          <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[10px] text-[#757575] font-bold block">Uptime</span>
              <p className="text-base font-black text-[#00C853]">99.9%</p>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[10px] text-[#757575] font-bold block">Students</span>
              <p className="text-base font-black text-[#2979FF]">2,450</p>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[10px] text-[#757575] font-bold block">Teachers</span>
              <p className="text-base font-black text-[#212121]">48</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] text-xs flex justify-between items-center font-bold">
            <span className="text-[#212121]">Active Campus Geofences</span>
            <span className="badge-green">24 Live Zones</span>
          </div>
        </div>

        {/* CARD 2 (3D Attendance Overview): Large bar chart showing daily attendance by department */}
        <div className="card-3d p-6 space-y-3">
          <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#2979FF]" /> Daily Attendance by Department
          </span>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-extrabold text-[#212121] mb-1">
                <span>Computer Science (CS)</span>
                <span className="text-[#00C853]">94%</span>
              </div>
              <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E2E8F0]">
                <div className="h-full bg-gradient-to-r from-[#00C853] to-[#00E676] rounded-full shadow-xs" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-extrabold text-[#212121] mb-1">
                <span>Electrical Engineering (EE)</span>
                <span className="text-[#00C853]">88%</span>
              </div>
              <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E2E8F0]">
                <div className="h-full bg-gradient-to-r from-[#00C853] to-[#76FF03] rounded-full shadow-xs" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-extrabold text-[#212121] mb-1">
                <span>Mechanical Eng (ME)</span>
                <span className="text-[#FF9100]">85%</span>
              </div>
              <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E2E8F0]">
                <div className="h-full bg-gradient-to-r from-[#00C853] to-[#FF9100] rounded-full shadow-xs" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3 (3D Manage Geofences): Map view of campus with classroom geofence perimeters */}
        <div className="card-3d p-6 space-y-3">
          <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF9100]" /> Manage Campus Geofences
          </span>

          {geoMessage && (
            <div className="p-2 rounded-lg bg-[#00C853]/10 text-[#00C853] text-[11px] font-bold">
              {geoMessage}
            </div>
          )}

          <div className="w-full h-24 bg-gradient-to-b from-[#FAF8F5] to-[#F1F5F9] rounded-xl border border-[#E2E8F0] p-2 flex items-center justify-center relative overflow-hidden text-[10px] text-[#757575] shadow-inner">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#2979FF] bg-[#2979FF]/10 flex items-center justify-center shadow-xs">
              <span className="font-extrabold text-[#2979FF]">50m Fence</span>
            </div>
            <span className="absolute bottom-1.5 right-2 font-mono text-[9px] font-bold text-[#212121]">Lab 402 Perimeter Active</span>
          </div>

          <form onSubmit={handleUpdateGeofence} className="space-y-2 text-xs">
            <div>
              <label className="block text-[11px] font-extrabold text-[#212121] mb-0.5">Classroom Selection</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E2E8F0] rounded-lg p-2 font-bold focus:outline-none focus:border-[#2979FF]"
              >
                <option value="cs401">CS 401 - Advanced AI (Lab 402)</option>
                <option value="cs301">CS 301 - Data Structures (Room 305)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="any"
                value={geoLat}
                onChange={(e) => setGeoLat(e.target.value)}
                placeholder="Latitude"
                className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-lg p-2 font-medium"
              />
              <input
                type="number"
                step="any"
                value={geoLng}
                onChange={(e) => setGeoLng(e.target.value)}
                placeholder="Longitude"
                className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-lg p-2 font-medium"
              />
            </div>

            <button type="submit" className="w-full btn-blue text-[11px] py-2 justify-center font-extrabold">
              Update Campus Geofence Area
            </button>
          </form>
        </div>

        {/* CARD 4 (3D User Management): Directory & Recent User Modifications Table */}
        <div className="card-3d p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#2979FF]" /> User Management
            </span>
            <div className="flex gap-2">
              <button className="text-[11px] font-extrabold text-[#2979FF] hover:underline">Students</button>
              <span className="text-[#E2E8F0]">|</span>
              <button className="text-[11px] font-extrabold text-[#2979FF] hover:underline">Teachers</button>
            </div>
          </div>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[10px] text-[#757575] uppercase tracking-wider font-extrabold">
                  <th className="py-1.5">User</th>
                  <th className="py-1.5">Role</th>
                  <th className="py-1.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[11px]">
                <tr>
                  <td className="py-2 font-bold text-[#212121]">Aarav Kumar</td>
                  <td className="py-2 text-[#757575] font-medium">Student</td>
                  <td className="py-2 text-right"><span className="badge-green">Active</span></td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-[#212121]">Dr. Rajesh Sharma</td>
                  <td className="py-2 text-[#757575] font-medium">Faculty</td>
                  <td className="py-2 text-right"><span className="badge-green">Verified</span></td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-[#212121]">Priya Sharma</td>
                  <td className="py-2 text-[#757575] font-medium">Student</td>
                  <td className="py-2 text-right"><span className="badge-green">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CARD 5 (3D EMBEDDED CAMPUS SMS GATEWAY CARD): System-Wide SMS Gateway & Broadcast Center */}
        <div className="card-3d p-6 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#00C853]" /> Campus SMS Gateway
              </span>
              <span className="badge-green font-mono">2,498 SMS SENT</span>
            </div>

            <p className="text-xs text-[#757575] font-medium mt-2">
              System-wide SMS dispatcher for university announcements, attendance risk alerts, and emergency updates.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                alert('📣 Campus Broadcast Dispatched! Sent SMS to all registered students: "Reminder: Mid-term attendance audit closes on Friday."');
              }}
              className="w-full btn-blue justify-center text-xs py-2.5 font-extrabold"
            >
              Broadcast Campus SMS Update
            </button>
            <button
              onClick={exportComprehensiveReport}
              className="w-full btn-secondary justify-center text-xs py-2.5 font-extrabold"
            >
              <Download className="w-4 h-4" /> Export CSV Reports & Audit Logs
            </button>
          </div>
        </div>

        {/* CARD 6 (3D Global System Settings): Controls for system-wide alert limits & QR expiry */}
        <div className="card-3d p-6 space-y-3">
          <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-[#757575]" /> Global System Settings
          </span>

          <div className="space-y-3 pt-1 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-[#212121]">QR Expiry Duration</label>
                <span className="font-extrabold text-[#2979FF]">{qrExpiryDuration} Minutes</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={qrExpiryDuration}
                onChange={(e) => setQrExpiryDuration(e.target.value)}
                className="w-full accent-[#2979FF]"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#E2E8F0]">
              <div>
                <p className="font-bold text-[#212121]">Low Attendance Threshold</p>
                <p className="text-[10px] text-[#757575]">SMS alert triggered automatically</p>
              </div>
              <span className="badge-orange font-extrabold">75% Limit</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#E2E8F0]">
              <div>
                <p className="font-bold text-[#212121]">Academic Term</p>
                <p className="text-[10px] text-[#757575]">Fall Semester 2024</p>
              </div>
              <span className="text-[11px] font-extrabold text-[#212121]">Aug - Dec 2024</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
