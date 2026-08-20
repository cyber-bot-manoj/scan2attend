const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

const initialData = {
  users: [
    {
      id: 'admin_1',
      name: 'System Admin',
      email: 'admin@school.edu',
      password: 'admin',
      role: 'ADMIN',
      mobile: '+91 9876543210'
    },
    {
      id: 'teacher_1',
      name: 'Dr. Rajesh Sharma',
      email: 'teacher@school.edu',
      password: 'teacher',
      role: 'TEACHER',
      department: 'Computer Science',
      mobile: '+91 9876543211'
    },
    {
      id: 'student_1',
      name: 'Aarav Kumar',
      rollNo: 'CS202601',
      email: 'student@school.edu',
      password: 'student',
      role: 'STUDENT',
      classSection: 'CSE - 3rd Year (Sec A)',
      mobile: '+91 9876543212',
      faceProfile: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>'
    },
    {
      id: 'student_2',
      name: 'Priya Singh',
      rollNo: 'CS202602',
      email: 'priya@school.edu',
      password: 'student',
      role: 'STUDENT',
      classSection: 'CSE - 3rd Year (Sec A)',
      mobile: '+91 9876543213',
      faceProfile: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ec4899" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>'
    },
    {
      id: 'student_3',
      name: 'Rohan Mehta',
      rollNo: 'CS202603',
      email: 'rohan@school.edu',
      password: 'student',
      role: 'STUDENT',
      classSection: 'CSE - 3rd Year (Sec A)',
      mobile: '+91 9876543214',
      faceProfile: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>'
    }
  ],
  classes: [
    {
      id: 'class_101',
      subject: 'Data Structures & Algorithms',
      code: 'CS301',
      section: 'Sec A',
      room: 'Lab 402',
      teacherId: 'teacher_1',
      // Default Geofence (Latitude, Longitude) for Classroom 402
      latitude: 28.6139, 
      longitude: 77.2090,
      radiusMeters: 50
    },
    {
      id: 'class_102',
      subject: 'Database Management Systems',
      code: 'CS302',
      section: 'Sec A',
      room: 'Hall 105',
      teacherId: 'teacher_1',
      latitude: 28.6140,
      longitude: 77.2092,
      radiusMeters: 50
    }
  ],
  qrSessions: [],
  attendance: [],
  smsLogs: [
    {
      id: 'sms_init_1',
      recipientName: 'Aarav Kumar',
      mobile: '+91 9876543212',
      type: 'CLASS_REMINDER',
      message: 'Reminder: Data Structures class starts in 2 minutes in Lab 402.',
      status: 'DELIVERED',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]
};

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB, resetting to initial data:', err);
    return initialData;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

module.exports = { readDB, writeDB };
