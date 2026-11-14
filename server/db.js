const fs = require('fs');
const path = require('path');
const os = require('os');

const DB_FILE = path.join(__dirname, 'data.json');
const TMP_FILE = path.join(os.tmpdir(), 'scan2attend_data.json');

let memoryDB = null;

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
  if (memoryDB) {
    return memoryDB;
  }
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf8');
      memoryDB = JSON.parse(content);
      return memoryDB;
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      memoryDB = JSON.parse(content);
      return memoryDB;
    }
    memoryDB = initialData;
    return initialData;
  } catch (err) {
    console.error('Error reading DB, resetting to initial data:', err);
    memoryDB = initialData;
    return initialData;
  }
}

function writeDB(data) {
  memoryDB = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    try {
      fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2));
    } catch (tmpErr) {
      console.error('Error writing DB to disk/tmp:', tmpErr);
    }
  }
}

module.exports = { readDB, writeDB };
