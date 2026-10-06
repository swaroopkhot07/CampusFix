import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DATA_DIR = path.resolve(__dirname, '../data');
const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'campusfix-data')
  : SOURCE_DATA_DIR;

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');

// Mutex queues for write safety
let usersWriteQueue = Promise.resolve();
let issuesWriteQueue = Promise.resolve();

// Initial demo issues for CSMU
const INITIAL_SEED_ISSUES = [
  {
    id: 'CF-2026-001',
    title: 'Ceiling projector not displaying HDMI input in Lecture Hall 204',
    description: 'The ceiling-mounted Epson projector in Rajgad 204 powers on with a blue indicator, but displays "No Signal Input" whenever a faculty or student connects to the podium HDMI cable. 3rd year Engineering lectures are getting delayed.',
    category: 'Classroom / Lab',
    priority: 'Medium',
    priorityReason: 'Academic or utility disruption detected (keyword: "projector"). Scheduled for routine resolution.',
    building: 'Rajgad',
    floor: '2nd Floor',
    location: 'Lecture Hall 204 (Podium Area)',
    reporterId: 'USR-SEED-001',
    reporterName: 'Aarav Sharma',
    reporterEmail: 'aarav.sharma@csmu.ac.in',
    image: null,
    status: 'In Progress',
    createdAt: '2026-10-04T09:30:00.000Z',
    updatedAt: '2026-10-05T11:00:00.000Z',
    assignedDepartment: 'IT & Network Services',
    resolutionNotes: 'Technician inspected the cable; replacement 4K HDMI transmitter and splitter requested from stores.',
    activityLog: [
      { date: '2026-10-04T09:30:00.000Z', text: 'Issue submitted by Aarav Sharma (CF-2026-001)' },
      { date: '2026-10-05T11:00:00.000Z', text: 'Status changed to In Progress by Admin (Vikas Kumar)' },
    ],
  },
  {
    id: 'CF-2026-002',
    title: 'High-pressure pipeline water leakage flooding corridor',
    description: 'Continuous water leakage from the main overhead flush pipeline outside the 1st floor boys washroom. Water is accumulating rapidly across the corridor, creating a severe slipping hazard for students and staff.',
    category: 'Plumbing',
    priority: 'High',
    priorityReason: 'Major facility breakdown detected (keyword: "major water leakage"). Requires priority turnaround within 4-12 hours.',
    building: 'Pratapgad',
    floor: '1st Floor',
    location: 'West Wing Corridor, near Washroom Block B',
    reporterId: 'USR-SEED-002',
    reporterName: 'Ananya Patil',
    reporterEmail: 'ananya.patil@csmu.ac.in',
    image: null,
    status: 'Pending',
    createdAt: '2026-10-05T08:15:00.000Z',
    updatedAt: '2026-10-05T08:15:00.000Z',
    assignedDepartment: 'Plumbing & Water Management',
    resolutionNotes: '',
    activityLog: [
      { date: '2026-10-05T08:15:00.000Z', text: 'Issue submitted by Ananya Patil (CF-2026-002)' },
    ],
  },
  {
    id: 'CF-2026-003',
    title: 'Campus Wi-Fi access point offline during practical sessions',
    description: 'Students and research scholars on the 3rd floor of Sindhudurg cannot authenticate on "CSMU-Student-Secure". Access point 3B shows a blinking amber LED and disconnects after 30 seconds.',
    category: 'IT / Wi-Fi',
    priority: 'Medium',
    priorityReason: 'Academic or utility disruption detected (keyword: "wi-fi"). Scheduled for routine resolution.',
    building: 'Sindhudurg',
    floor: '3rd Floor',
    location: 'Advanced Computing Lab 305 & Surrounding Area',
    reporterId: 'USR-SEED-003',
    reporterName: 'Rohan Deshmukh',
    reporterEmail: 'rohan.deshmukh@csmu.ac.in',
    image: null,
    status: 'Resolved',
    createdAt: '2026-10-02T14:20:00.000Z',
    updatedAt: '2026-10-03T16:45:00.000Z',
    assignedDepartment: 'IT & Network Services',
    resolutionNotes: 'PoE port power cycle executed and Cisco access point firmware restarted. Ping latency verified below 5ms.',
    activityLog: [
      { date: '2026-10-02T14:20:00.000Z', text: 'Issue submitted by Rohan Deshmukh (CF-2026-003)' },
      { date: '2026-10-03T10:00:00.000Z', text: 'Status changed to In Progress' },
      { date: '2026-10-03T16:45:00.000Z', text: 'Status marked Resolved by Network Admin' },
    ],
  },
  {
    id: 'CF-2026-004',
    title: 'Exposed live wiring and electrical sparks near corridor switchboard',
    description: 'Corridor switchboard next to Room 102 has a cracked faceplate with exposed live copper wires. When flipping the master tube light switch, visible sparks and a burnt plastic odor were reported.',
    category: 'Safety',
    priority: 'Critical',
    priorityReason: 'Immediate safety risk detected (keyword: "spark"). Escalated for instant administration intervention.',
    building: 'Shivneri',
    floor: '1st Floor',
    location: 'Room 102 Outer Wall Switchboard',
    reporterId: 'USR-SEED-004',
    reporterName: 'Tanvi Kulkarni',
    reporterEmail: 'tanvi.kulkarni@csmu.ac.in',
    image: null,
    status: 'In Progress',
    createdAt: '2026-10-05T16:40:00.000Z',
    updatedAt: '2026-10-05T17:15:00.000Z',
    assignedDepartment: 'Electrical Maintenance Unit',
    resolutionNotes: 'Circuit breaker isolated immediately by campus duty electrician. New modular polycarbonate box being mounted.',
    activityLog: [
      { date: '2026-10-05T16:40:00.000Z', text: 'Issue submitted by Tanvi Kulkarni (CF-2026-004)' },
      { date: '2026-10-05T17:15:00.000Z', text: 'Emergency dispatch: Status changed to In Progress' },
    ],
  },
  {
    id: 'CF-2026-005',
    title: 'Broken badminton court net tensioner and damaged boundary posts',
    description: 'The steel tension cable on Badminton Court 2 has snapped at the post anchor. The post is leaning inwards and the net cannot be set to standard height for inter-college trials.',
    category: 'Sports',
    priority: 'Low',
    priorityReason: 'Non-urgent maintenance request (item: "badminton net"). Batched for standard housekeeping or carpentry.',
    building: 'Badminton Court',
    floor: 'Ground Floor',
    location: 'Indoor Sports Complex, Court 2',
    reporterId: 'USR-SEED-005',
    reporterName: 'Siddharth Gaikwad',
    reporterEmail: 'siddharth.gaikwad@csmu.ac.in',
    image: null,
    status: 'Pending',
    createdAt: '2026-10-04T17:30:00.000Z',
    updatedAt: '2026-10-04T17:30:00.000Z',
    assignedDepartment: 'Sports & Physical Education Dept',
    resolutionNotes: '',
    activityLog: [
      { date: '2026-10-04T17:30:00.000Z', text: 'Issue submitted by Siddharth Gaikwad (CF-2026-005)' },
    ],
  },
  {
    id: 'CF-2026-006',
    title: 'Damaged wooden lecture benches with exposed nails',
    description: 'Two double-bench seats in row 4 of the Law College classroom have splintered wooden armrests with rusted nails exposed. Multiple students have torn shirts and reported scrape hazards.',
    category: 'Infrastructure',
    priority: 'Low',
    priorityReason: 'Non-urgent maintenance request (item: "bench"). Batched for standard housekeeping or carpentry.',
    building: 'Pharmacy Block',
    floor: '2nd Floor',
    location: 'Law College Lecture Hall L-204, Row 4',
    reporterId: 'USR-SEED-006',
    reporterName: 'Pooja Jadhav',
    reporterEmail: 'pooja.jadhav@csmu.ac.in',
    image: null,
    status: 'Pending',
    createdAt: '2026-10-05T11:05:00.000Z',
    updatedAt: '2026-10-05T11:05:00.000Z',
    assignedDepartment: 'Estate & Maintenance Office',
    resolutionNotes: '',
    activityLog: [
      { date: '2026-10-05T11:05:00.000Z', text: 'Issue submitted by Pooja Jadhav (CF-2026-006)' },
    ],
  },
  {
    id: 'CF-2026-007',
    title: 'Central water cooler cooling failure and clogged drainage basin',
    description: 'The drinking water cooler near the main canteen is dispensing warm water despite high ambient temperature. The drain basin is clogged with tea cups and overflowing onto the pedestrian pathway.',
    category: 'Plumbing',
    priority: 'Medium',
    priorityReason: 'Academic or utility disruption detected (keyword: "water cooler"). Scheduled for routine resolution.',
    building: 'Drinking Water Areas',
    floor: 'Ground Floor',
    location: 'Common Canteen Central Drinking Water Station',
    reporterId: 'USR-SEED-007',
    reporterName: 'Kunal Shinde',
    reporterEmail: 'kunal.shinde@csmu.ac.in',
    image: null,
    status: 'In Progress',
    createdAt: '2026-10-05T13:40:00.000Z',
    updatedAt: '2026-10-05T14:30:00.000Z',
    assignedDepartment: 'Plumbing & Water Management',
    resolutionNotes: 'Drain unclogged. Compressor coolant level to be inspected tomorrow morning.',
    activityLog: [
      { date: '2026-10-05T13:40:00.000Z', text: 'Issue submitted by Kunal Shinde (CF-2026-007)' },
      { date: '2026-10-05T14:30:00.000Z', text: 'Status changed to In Progress' },
    ],
  },
  {
    id: 'CF-2026-008',
    title: 'Overflowing garbage bins and unsanitary food courtyard',
    description: 'Outdoor dustbins behind food court counters are overflowing with food waste and packaging. Stray dogs are scattering trash across the paved seating area.',
    category: 'Cleanliness',
    priority: 'Low',
    priorityReason: 'Non-urgent maintenance request (item: "garbage"). Batched for standard housekeeping or carpentry.',
    building: 'Common Canteen',
    floor: 'Ground Floor',
    location: 'Food Court Rear Dining Courtyard',
    reporterId: 'USR-SEED-008',
    reporterName: 'Meera Nair',
    reporterEmail: 'meera.nair@csmu.ac.in',
    image: null,
    status: 'Resolved',
    createdAt: '2026-10-03T15:20:00.000Z',
    updatedAt: '2026-10-03T18:00:00.000Z',
    assignedDepartment: 'Campus Housekeeping & Sanitation',
    resolutionNotes: 'Special sanitation drive completed. Added two 240L wheeled garbage bins with lids.',
    activityLog: [
      { date: '2026-10-03T15:20:00.000Z', text: 'Issue submitted by Meera Nair (CF-2026-008)' },
      { date: '2026-10-03T18:00:00.000Z', text: 'Status marked Resolved by Housekeeping Supervisor' },
    ],
  },
];

/**
 * Initializes the database directory and seeded files
 */
export async function initDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  // On Vercel, copy bundled seed files to writable /tmp if they don't exist yet
  if (process.env.VERCEL && DATA_DIR !== SOURCE_DATA_DIR) {
    try {
      await fs.access(USERS_FILE);
    } catch {
      try {
        const sourceUsers = await fs.readFile(path.join(SOURCE_DATA_DIR, 'users.json'), 'utf-8');
        await fs.writeFile(USERS_FILE, sourceUsers, 'utf-8');
      } catch (e) {
        // Fall back to seeding
      }
    }

    try {
      await fs.access(ISSUES_FILE);
    } catch {
      try {
        const sourceIssues = await fs.readFile(path.join(SOURCE_DATA_DIR, 'issues.json'), 'utf-8');
        await fs.writeFile(ISSUES_FILE, sourceIssues, 'utf-8');
      } catch (e) {
        // Fall back to seeding
      }
    }
  }

  // 1. Initialize users.json
  let users = [];
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    users = JSON.parse(raw);
    if (!Array.isArray(users)) users = [];
  } catch (err) {
    users = [];
  }

  // Ensure predetermined administrator account exists
  // Name: Vikas Kumar, Role: admin, Username: hodvikaskumar, Email: hodvikaskumar@csmu.ac.in, Password: CSMU@HOD
  const adminExists = users.some(
    u => u.role === 'admin' || u.username === 'hodvikaskumar' || u.email === 'hodvikaskumar@csmu.ac.in'
  );

  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('CSMU@HOD', salt);

    const adminUser = {
      id: 'USR-ADMIN-001',
      role: 'admin',
      name: 'Vikas Kumar',
      username: 'hodvikaskumar',
      email: 'hodvikaskumar@csmu.ac.in',
      passwordHash,
      department: 'Estate & Facilities Administration',
      createdAt: new Date().toISOString(),
    };

    users.push(adminUser);
    await writeUsers(users);
    console.log('[DB] Seeded administrator account: Vikas Kumar (hodvikaskumar@csmu.ac.in)');
  } else {
    // If admin exists, verify passwordHash is properly set
    const existingAdmin = users.find(u => u.username === 'hodvikaskumar' || u.email === 'hodvikaskumar@csmu.ac.in');
    if (existingAdmin && !existingAdmin.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      existingAdmin.passwordHash = await bcrypt.hash('CSMU@HOD', salt);
      await writeUsers(users);
    }
  }

  // 2. Initialize issues.json
  let issues = [];
  try {
    const raw = await fs.readFile(ISSUES_FILE, 'utf-8');
    issues = JSON.parse(raw);
    if (!Array.isArray(issues)) issues = [];
  } catch (err) {
    issues = [];
  }

  if (issues.length === 0) {
    issues = [...INITIAL_SEED_ISSUES];
    await writeIssues(issues);
    console.log(`[DB] Seeded ${issues.length} initial issues into issues.json`);
  }
}

/**
 * Thread-safe write for users.json
 */
async function writeUsers(data) {
  usersWriteQueue = usersWriteQueue.then(async () => {
    const tmpFile = `${USERS_FILE}.tmp`;
    await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tmpFile, USERS_FILE);
  });
  return usersWriteQueue;
}

/**
 * Thread-safe write for issues.json
 */
async function writeIssues(data) {
  issuesWriteQueue = issuesWriteQueue.then(async () => {
    const tmpFile = `${ISSUES_FILE}.tmp`;
    await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tmpFile, ISSUES_FILE);
  });
  return issuesWriteQueue;
}

// ==================== USER OPERATIONS ====================

export async function getUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export async function findUserById(id) {
  const users = await getUsers();
  return users.find(u => u.id === id) || null;
}

export async function findUserByEmail(email) {
  if (!email) return null;
  const users = await getUsers();
  const normalized = email.trim().toLowerCase();
  return users.find(u => u.email && u.email.trim().toLowerCase() === normalized) || null;
}

export async function findUserByEnrollment(enrollmentNumber) {
  if (!enrollmentNumber) return null;
  const users = await getUsers();
  const normalized = enrollmentNumber.trim().toLowerCase();
  return users.find(u => u.enrollmentNumber && u.enrollmentNumber.trim().toLowerCase() === normalized) || null;
}

export async function findAdminByUsernameOrEmail(identifier) {
  if (!identifier) return null;
  const users = await getUsers();
  const normalized = identifier.trim().toLowerCase();
  return users.find(
    u => u.role === 'admin' && (
      (u.username && u.username.trim().toLowerCase() === normalized) ||
      (u.email && u.email.trim().toLowerCase() === normalized)
    )
  ) || null;
}

export async function createStudentUser(userData) {
  const users = await getUsers();

  const newUser = {
    id: `USR-STU-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    role: 'student',
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    enrollmentNumber: userData.enrollmentNumber.trim().toUpperCase(),
    passwordHash: userData.passwordHash,
    department: userData.department ? userData.department.trim() : 'General Studies',
    year: userData.year ? userData.year.trim() : '1st Year',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

// ==================== ISSUE OPERATIONS ====================

export async function getIssues() {
  try {
    const raw = await fs.readFile(ISSUES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export async function getIssueById(id) {
  const issues = await getIssues();
  return issues.find(i => i.id === id) || null;
}

export async function getIssuesByReporterId(reporterId) {
  const issues = await getIssues();
  return issues.filter(i => i.reporterId === reporterId);
}

export async function createIssue(issueData) {
  const issues = await getIssues();

  // Generate next sequential ID e.g. CF-2026-009
  const currentYear = new Date().getFullYear();
  const maxSeq = issues.reduce((acc, curr) => {
    if (curr.id && curr.id.startsWith('CF-')) {
      const parts = curr.id.split('-');
      if (parts.length === 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num)) return Math.max(acc, num);
      }
    }
    return acc;
  }, 0);

  const nextSeq = maxSeq + 1;
  const newId = `CF-${currentYear}-${String(nextSeq).padStart(3, '0')}`;

  const now = new Date().toISOString();

  const newIssue = {
    id: newId,
    title: issueData.title.trim(),
    description: issueData.description.trim(),
    category: issueData.category,
    priority: issueData.priority,
    priorityReason: issueData.priorityReason || '',
    building: issueData.building,
    floor: issueData.floor || 'Ground Floor',
    location: issueData.location ? issueData.location.trim() : '',
    reporterId: issueData.reporterId,
    reporterName: issueData.reporterName,
    reporterEmail: issueData.reporterEmail,
    image: issueData.image || null,
    status: 'Pending',
    assignedDepartment: issueData.assignedDepartment || 'Estate & Maintenance Office',
    resolutionNotes: '',
    createdAt: now,
    updatedAt: now,
    activityLog: [
      {
        date: now,
        text: `Issue registered by ${issueData.reporterName} (${newId}) with priority ${issueData.priority}.`,
      },
    ],
  };

  // Prepend to list
  issues.unshift(newIssue);
  await writeIssues(issues);
  return newIssue;
}

export async function updateIssue(id, updateData) {
  const issues = await getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return null;

  const current = issues[index];
  const now = new Date().toISOString();

  const newStatus = updateData.status || current.status;
  const statusChanged = newStatus !== current.status;

  const logEntries = [...(current.activityLog || [])];
  if (statusChanged) {
    logEntries.unshift({
      date: now,
      text: `Status changed from ${current.status} to ${newStatus}${updateData.resolutionNotes ? ` (Notes: "${updateData.resolutionNotes}")` : ''}`,
    });
  }

  const updated = {
    ...current,
    ...updateData,
    status: newStatus,
    updatedAt: now,
    activityLog: logEntries,
  };

  issues[index] = updated;
  await writeIssues(issues);
  return updated;
}

export async function deleteIssue(id) {
  const issues = await getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return false;

  issues.splice(index, 1);
  await writeIssues(issues);
  return true;
}
