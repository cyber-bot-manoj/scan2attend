import React, { useState, useEffect } from 'react';
import { Smartphone, Send, Bell, ShieldAlert, CheckCircle2, Clock, Filter } from 'lucide-react';

export default function SmsEnginePanel() {
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [broadcastRecipient, setBroadcastRecipient] = useState('Aarav Kumar');
  const [broadcastMobile, setBroadcastMobile] = useState('+91 9876543212');
  const [broadcastType, setBroadcastType] = useState('CLASS_REMINDER');
  const [broadcastMessage, setBroadcastMessage] = useState('Reminder: Data Structures class starts in 2 minutes in Lab 402.');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSmsLogs();
  }, []);

  const fetchSmsLogs = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setLogs(data.smsLogs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendCustomSms = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: broadcastRecipient,
          mobile: broadcastMobile,
          type: broadcastType,
          message: broadcastMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchSmsLogs();
        alert('SMS Broadcast Sent Successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const filteredLogs = filterType === 'ALL' ? logs : logs.filter(l => l.type === filterType);

  return (
    <div className="space-y-8">
      {/* SMS Engine Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-indigo-400" />
            Automated SMS & Notification Gateway
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time delivery engine for Class Reminders, Attendance Receipts & Risk Warnings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SMS Gateway Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Send Broadcast Form */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-400" />
            Dispatch Manual / Alert SMS
          </h3>

          <form onSubmit={sendCustomSms} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Notification Type</label>
              <select
                value={broadcastType}
                onChange={(e) => {
                  setBroadcastType(e.target.value);
                  if (e.target.value === 'CLASS_REMINDER') {
                    setBroadcastMessage('Reminder: Data Structures class starts in 2 minutes in Lab 402.');
                  } else if (e.target.value === 'LOW_ATTENDANCE_WARNING') {
                    setBroadcastMessage('Low Attendance Warning: Your attendance is below 75%. Please attend upcoming classes.');
                  } else if (e.target.value === 'HIGH_RISK_ALERT') {
                    setBroadcastMessage('Critical Attendance Alert: Your attendance has dropped to high-risk zone (<60%).');
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              >
                <option value="CLASS_REMINDER">2 Min Before Class Reminder</option>
                <option value="ATTENDANCE_CONFIRMATION">Attendance Marked Receipt</option>
                <option value="LOW_ATTENDANCE_WARNING">Low Attendance Warning (&lt;75%)</option>
                <option value="HIGH_RISK_ALERT">High Risk Critical Alert (&lt;60%)</option>
                <option value="IMPORTANT_UPDATE">Important Broadcast Update</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Student / Recipient Name</label>
              <input
                type="text"
                value={broadcastRecipient}
                onChange={(e) => setBroadcastRecipient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Mobile Phone Number</label>
              <input
                type="text"
                value={broadcastMobile}
                onChange={(e) => setBroadcastMobile(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">SMS Content Body</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows="3"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                required
              ></textarea>
            </div>

            <button type="submit" disabled={sending} className="w-full btn-primary justify-center py-2.5 text-xs">
              {sending ? 'Transmitting SMS...' : 'Dispatch SMS Alert Now'}
            </button>
          </form>
        </div>

        {/* SMS Transmission Log */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              Live SMS Transmission Logs ({filteredLogs.length})
            </h3>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value="ALL">All Message Types</option>
                <option value="CLASS_REMINDER">Class Reminders</option>
                <option value="ATTENDANCE_CONFIRMATION">Attendance Confirmation</option>
                <option value="LOW_ATTENDANCE_WARNING">Low Attendance Warnings</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.type === 'CLASS_REMINDER' ? 'bg-amber-500/20 text-amber-300' :
                        log.type === 'ATTENDANCE_CONFIRMATION' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {log.type}
                      </span>
                      <strong className="text-xs text-white">{log.recipientName} ({log.mobile})</strong>
                    </div>
                    <p className="text-xs text-gray-300 font-sans">{log.message}</p>
                  </div>

                  <div className="text-right text-[11px] text-gray-400 space-y-1">
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      DELIVERED
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="w-3 h-3 text-gray-500" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs">
                No SMS transmission logs recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
