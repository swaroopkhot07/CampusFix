/**
 * Priority Engine for CampusFix Backend
 * Deterministically determines issue priority based on category, title, and description.
 * Ensures objective, automated prioritization without manual student bias.
 */

const CRITICAL_KEYWORDS = [
  'fire', 'spark', 'sparks', 'shock', 'electric shock', 'short circuit',
  'exposed wire', 'exposed live wire', 'live wire', 'smoke', 'gas leak',
  'structural collapse', 'ceiling collapse', 'emergency', 'major emergency',
  'danger', 'hazardous', 'severe safety hazard', 'dangerous electrical issue',
  'broken glass', 'bleeding', 'injury', 'stampede', 'medical emergency', 'burn'
];

const HIGH_KEYWORDS = [
  'major water leakage', 'flooding', 'flooded', 'overflowing sewage',
  'no water', 'no water supply', 'blackout', 'power outage', 'elevator stuck',
  'lift stuck', 'lift not working', 'staircase broken', 'door lock jammed',
  'burst pipe', 'water tank empty', 'hostel security', 'serious hostel problem',
  'major infrastructure damage', 'serious safety-related issue', 'theft',
  'deep crack', 'sanitation hazard', 'sewage leak', 'chemical spill'
];

const MEDIUM_KEYWORDS = [
  'wifi', 'wi-fi', 'internet', 'network', 'projector', 'hdmi', 'ac',
  'air conditioner', 'fan speed', 'audio', 'mic', 'microphone', 'computer',
  'monitor', 'lab system', 'power socket', 'light not working', 'tube light',
  'canteen food', 'canteen issue', 'water cooler', 'filter', 'tap leaking',
  'printer', 'classroom equipment', 'moderate plumbing issue'
];

const LOW_KEYWORDS = [
  'broken chair', 'chair', 'bench', 'desk', 'scratch', 'dust', 'dusty',
  'minor cleanliness', 'minor cleanliness issue', 'bin full', 'garbage',
  'trash', 'curtain', 'paint', 'notice board', 'whiteboard marker', 'board',
  'door hinge', 'badminton net', 'ball', 'cosmetic', 'cosmetic damage',
  'minor maintenance'
];

/**
 * Calculates priority from category, title, and description
 * @param {string} category
 * @param {string} title
 * @param {string} description
 * @returns {{ priority: 'Critical' | 'High' | 'Medium' | 'Low', reason: string }}
 */
export function calculatePriority(category = '', title = '', description = '') {
  const combinedText = `${title || ''} ${description || ''}`.toLowerCase();

  // 1. Check for Critical keywords
  const matchedCritical = CRITICAL_KEYWORDS.filter(kw => combinedText.includes(kw));
  if (matchedCritical.length > 0) {
    return {
      priority: 'Critical',
      reason: `Immediate safety risk detected (keyword: "${matchedCritical[0]}"). Escalated for instant administration intervention.`,
    };
  }

  // 2. Safety category default escalation
  if (category === 'Safety') {
    return {
      priority: 'Critical',
      reason: 'Safety category issues are escalated to Critical to prevent potential harm to students and campus staff.',
    };
  }

  // 3. Check for High keywords
  const matchedHigh = HIGH_KEYWORDS.filter(kw => combinedText.includes(kw));
  if (matchedHigh.length > 0) {
    return {
      priority: 'High',
      reason: `Major facility breakdown detected (keyword: "${matchedHigh[0]}"). Requires priority turnaround within 4-12 hours.`,
    };
  }

  // 4. Category-level High triggers
  if (category === 'Plumbing' && (combinedText.includes('leak') || combinedText.includes('water'))) {
    return {
      priority: 'High',
      reason: 'Plumbing leak detected. High priority to prevent campus flooding and water wastage.',
    };
  }

  if (category === 'Electrical' && (combinedText.includes('power') || combinedText.includes('switch') || combinedText.includes('breaker'))) {
    return {
      priority: 'High',
      reason: 'Electrical switchgear or power fault. High priority for campus facility safety.',
    };
  }

  // 5. Check for Medium keywords
  const matchedMedium = MEDIUM_KEYWORDS.filter(kw => combinedText.includes(kw));
  if (matchedMedium.length > 0) {
    return {
      priority: 'Medium',
      reason: `Academic or utility disruption detected (keyword: "${matchedMedium[0]}"). Scheduled for routine resolution.`,
    };
  }

  // Category-level Medium triggers
  if (['IT / Wi-Fi', 'Classroom / Lab', 'Hostel', 'Canteen', 'Electrical'].includes(category)) {
    return {
      priority: 'Medium',
      reason: `Operational issue in ${category}. Scheduled for regular academic maintenance.`,
    };
  }

  // 6. Check for Low keywords
  const matchedLow = LOW_KEYWORDS.filter(kw => combinedText.includes(kw));
  if (matchedLow.length > 0) {
    return {
      priority: 'Low',
      reason: `Non-urgent maintenance request (item: "${matchedLow[0]}"). Batched for standard housekeeping or carpentry.`,
    };
  }

  // 7. Category-level Low defaults
  if (['Cleanliness', 'Sports', 'Other', 'Infrastructure'].includes(category)) {
    return {
      priority: 'Low',
      reason: `Standard maintenance task in ${category}. Handled in scheduled campus maintenance rounds.`,
    };
  }

  // Fallback default
  return {
    priority: 'Medium',
    reason: 'Standard campus maintenance priority.',
  };
}
