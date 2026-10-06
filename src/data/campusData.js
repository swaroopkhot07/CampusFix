/**
 * Campus Data for Chhatrapati Shivaji Maharaj University (CSMU), Panvel
 */

export const ACADEMIC_BUILDINGS = [
  {
    id: 'rajgad',
    name: 'Rajgad',
    description: 'Main Academic Wing - Engineering & Science',
    hasFloors: true,
  },
  {
    id: 'pratapgad',
    name: 'Pratapgad',
    description: 'Academic Block - Commerce & Management',
    hasFloors: true,
  },
  {
    id: 'sindhudurg',
    name: 'Sindhudurg',
    description: 'Academic Block - Computer Applications & IT',
    hasFloors: true,
  },
  {
    id: 'shivneri',
    name: 'Shivneri',
    description: 'Academic Wing - Humanities & Architecture',
    hasFloors: true,
  },
  {
    id: 'pharmacy-block',
    name: 'Pharmacy Block',
    description: 'Pharmacy Block & Faculty of Law (Law College)',
    hasFloors: true,
  },
];

export const FLOORS = [
  'Ground Floor',
  '1st Floor',
  '2nd Floor',
  '3rd Floor',
  '4th Floor',
];

export const OTHER_LOCATIONS = [
  { id: 'library', name: 'Library', hasFloors: true },
  { id: 'main-gate', name: 'Main Gate', hasFloors: false },
  { id: 'parking', name: 'Parking', hasFloors: false },
  { id: 'reception', name: 'Reception', hasFloors: false },
  { id: 'admin-office', name: 'Admin Office', hasFloors: true },
  { id: 'examination-cell', name: 'Examination Cell', hasFloors: true },
  { id: 'medical-room', name: 'Medical / First Aid Room', hasFloors: false },
  { id: 'labs', name: 'Labs', hasFloors: true },
  { id: 'computer-labs', name: 'Computer Labs', hasFloors: true },
  { id: 'faculty-rooms', name: 'Faculty Rooms', hasFloors: true },
  { id: 'washrooms', name: 'Washrooms', hasFloors: true },
  { id: 'drinking-water', name: 'Drinking Water Areas', hasFloors: true },
  { id: 'elevators', name: 'Elevators / Lifts', hasFloors: true },
  { id: 'staircases', name: 'Staircases', hasFloors: true },
  { id: 'common-canteen', name: 'Common Canteen', hasFloors: false },
  { id: 'auditorium', name: 'Auditorium', hasFloors: false },
  { id: 'hostel', name: 'Hostel', hasFloors: true },
  { id: 'volleyball-court', name: 'Volleyball Court', hasFloors: false },
  { id: 'badminton-court', name: 'Badminton Court', hasFloors: false },
  { id: 'football-ground', name: 'Football Ground', hasFloors: false },
  { id: 'sports-room', name: 'Sports Room', hasFloors: false },
];

export const ALL_LOCATIONS = [
  ...ACADEMIC_BUILDINGS.map(b => ({ ...b, type: 'Academic Building' })),
  ...OTHER_LOCATIONS.map(l => ({ ...l, type: 'Campus Facility / Amenity' })),
];

export const ISSUE_CATEGORIES = [
  { id: 'Infrastructure', name: 'Infrastructure', icon: 'Building2' },
  { id: 'Electrical', name: 'Electrical', icon: 'Zap' },
  { id: 'Plumbing', name: 'Plumbing', icon: 'Droplets' },
  { id: 'Cleanliness', name: 'Cleanliness', icon: 'Sparkles' },
  { id: 'IT / Wi-Fi', name: 'IT / Wi-Fi', icon: 'Wifi' },
  { id: 'Classroom / Lab', name: 'Classroom / Lab', icon: 'Presentation' },
  { id: 'Hostel', name: 'Hostel', icon: 'Home' },
  { id: 'Canteen', name: 'Canteen', icon: 'UtensilsCrossed' },
  { id: 'Sports', name: 'Sports', icon: 'Trophy' },
  { id: 'Safety', name: 'Safety', icon: 'ShieldAlert' },
  { id: 'Other', name: 'Other', icon: 'HelpCircle' },
];

export const COMMON_ISSUE_PRESETS = [
  { title: 'Projector not working', category: 'Classroom / Lab' },
  { title: 'Broken fan', category: 'Electrical' },
  { title: 'Water leakage', category: 'Plumbing' },
  { title: 'Dirty washroom', category: 'Cleanliness' },
  { title: 'Wi-Fi problem', category: 'IT / Wi-Fi' },
  { title: 'Broken chair', category: 'Infrastructure' },
  { title: 'Light not working', category: 'Electrical' },
  { title: 'AC not working', category: 'Infrastructure' },
  { title: 'Garbage overflowing', category: 'Cleanliness' },
  { title: 'Damaged sports equipment', category: 'Sports' },
  { title: 'Damaged road/pavement', category: 'Infrastructure' },
  { title: 'Parking issue', category: 'Infrastructure' },
  { title: 'Hostel maintenance issue', category: 'Hostel' },
  { title: 'Canteen issue', category: 'Canteen' },
  { title: 'Electrical sparks or live wire', category: 'Safety' },
  { title: 'Water cooler filtration problem', category: 'Plumbing' },
];

export const DEPARTMENTS = [
  'Estate & Maintenance Office',
  'Electrical Maintenance Unit',
  'Plumbing & Water Management',
  'Campus Housekeeping & Sanitation',
  'IT & Network Services',
  'Sports & Physical Education Dept',
  'Hostel Administration & Wardens',
  'Campus Security & Safety Division',
];
