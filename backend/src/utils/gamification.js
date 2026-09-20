/**
 * Deterministic level thresholds
 */
const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 500 },
  { level: 3, xp: 1000 },
  { level: 4, xp: 1750 },
  { level: 5, xp: 2500 },
  { level: 6, xp: 3500 },
  { level: 7, xp: 5000 },
  { level: 8, xp: 7000 },
  { level: 9, xp: 9500 },
  { level: 10, xp: 12500 }
];

const calculateLevel = (totalXP) => {
  let currentLevel = 1;
  let nextLevelXP = 500;
  
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i].xp) {
      currentLevel = LEVEL_THRESHOLDS[i].level;
      nextLevelXP = LEVEL_THRESHOLDS[i + 1] ? LEVEL_THRESHOLDS[i + 1].xp : null;
    } else {
      break;
    }
  }
  
  return { level: currentLevel, nextLevelXP };
};

/**
 * Achievements List
 */
const ACHIEVEMENTS = [
  { id: 'first_mission', name: 'First Mission', description: 'Complete your first mission.' },
  { id: 'phishing_hunter', name: 'Phishing Hunter', description: 'Complete the phishing simulation.' },
  { id: 'password_guardian', name: 'Password Guardian', description: 'Complete the password security simulation.' },
  { id: 'network_defender', name: 'Network Defender', description: 'Complete the network intrusion simulation.' },
  { id: 'malware_analyst', name: 'Malware Analyst', description: 'Complete the malware investigation.' },
  { id: 'incident_responder', name: 'Incident Responder', description: 'Complete the incident response simulation.' },
  { id: 'cyber_apprentice', name: 'Cyber Apprentice', description: 'Reach Level 3.' },
  { id: 'cyber_specialist', name: 'Cyber Specialist', description: 'Reach Level 5.' },
  { id: 'perfect_investigation', name: 'Perfect Investigation', description: 'Complete a mission with 100% score.' },
  { id: 'cyber_veteran', name: 'Cyber Veteran', description: 'Complete 10 missions.' }
];

const checkAchievements = (user, mission, scorePercentage) => {
  const newAchievements = [];
  const existingIds = (user.achievements || []).map(a => a.achievementId);
  
  const unlock = (id) => {
    if (!existingIds.includes(id)) {
      newAchievements.push({ achievementId: id, unlockedAt: new Date() });
      existingIds.push(id);
    }
  };

  // Check generic mission stats
  if (user.completedChallenges >= 1) unlock('first_mission');
  if (user.completedChallenges >= 10) unlock('cyber_veteran');
  if (scorePercentage === 100) unlock('perfect_investigation');

  // Check specific missions
  if (mission && mission.simulationType === 'phishing') unlock('phishing_hunter');
  if (mission && mission.simulationType === 'password') unlock('password_guardian');
  if (mission && mission.simulationType === 'network') unlock('network_defender');
  if (mission && mission.simulationType === 'malware') unlock('malware_analyst');
  if (mission && mission.simulationType === 'incident-response') unlock('incident_responder');

  // Check levels
  if (user.level >= 3) unlock('cyber_apprentice');
  if (user.level >= 5) unlock('cyber_specialist');

  return newAchievements; // Only returns newly unlocked this session
};

/**
 * Streak Calculation
 */
const updateStreak = (user) => {
  const now = new Date();
  
  let currentStreak = user.currentStreak || 0;
  let longestStreak = user.longestStreak || 0;
  let lastActivityDate = user.lastActivityDate;
  
  if (!lastActivityDate) {
    currentStreak = 1;
    longestStreak = 1;
  } else {
    // Check if last activity was today, yesterday, or older
    const lastDate = new Date(lastActivityDate);
    
    // Set both to midnight to compare just the date
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    
    const diffTime = Math.abs(today - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 1) {
      // It was yesterday
      currentStreak += 1;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else if (diffDays === 0) {
      // It was today, streak remains same
    } else {
      // Older than yesterday, streak breaks
      currentStreak = 1;
    }
  }
  
  return {
    currentStreak,
    longestStreak,
    lastActivityDate: now
  };
};

/**
 * Daily Challenge
 * Deterministically pick an index based on the current date string
 */
const getDailyChallengeId = (allMissionIds) => {
  if (!allMissionIds || allMissionIds.length === 0) return null;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash |= 0; 
  }
  
  const index = Math.abs(hash) % allMissionIds.length;
  return allMissionIds[index];
};

module.exports = {
  LEVEL_THRESHOLDS,
  ACHIEVEMENTS,
  calculateLevel,
  checkAchievements,
  updateStreak,
  getDailyChallengeId
};
