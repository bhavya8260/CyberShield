const learnData = [
  {
    id: 'phishing',
    title: 'Phishing Defense',
    category: 'Phishing',
    difficulty: 'beginner',
    summary: 'Learn how to identify and defend against phishing attacks.',
    keyPoints: [
      'What is phishing?',
      'Common phishing indicators',
      'Suspicious sender domains',
      'Malicious links',
      'Social engineering tactics'
    ],
    example: 'An email from "support@paypa1.com" asking you to urgently verify your account details.',
    relatedMission: 'Phishing Simulation'
  },
  {
    id: 'password',
    title: 'Password Security',
    category: 'Password',
    difficulty: 'beginner',
    summary: 'Understand the principles of creating and managing secure passwords.',
    keyPoints: [
      'Strong passwords (length and complexity)',
      'Password reuse dangers',
      'Multi-Factor Authentication (MFA)',
      'Credential breaches and monitoring'
    ],
    example: 'Using a password manager to generate and store a 16-character random password for each site.',
    relatedMission: 'Password Cracking Simulation'
  },
  {
    id: 'network',
    title: 'Network Defense',
    category: 'Network',
    difficulty: 'intermediate',
    summary: 'Learn how to monitor and secure network traffic against intrusions.',
    keyPoints: [
      'Understanding common ports',
      'Analyzing network alerts',
      'Identifying suspicious traffic patterns',
      'Monitoring authentication events'
    ],
    example: 'Detecting 50 failed SSH login attempts from an unknown IP address within 2 minutes.',
    relatedMission: 'Network Intrusion Simulation'
  },
  {
    id: 'malware',
    title: 'Malware Investigation',
    category: 'Malware',
    difficulty: 'advanced',
    summary: 'Techniques for identifying and analyzing malicious software.',
    keyPoints: [
      'Malware indicators of compromise (IoCs)',
      'Suspicious file extensions',
      'Verifying digital signatures',
      'Quarantine and Sandboxing principles'
    ],
    example: 'Isolating a .exe file disguised as an invoice PDF before it can execute ransomware.',
    relatedMission: 'Malware Outbreak Simulation'
  },
  {
    id: 'incidentResponse',
    title: 'Incident Response',
    category: 'Incident Response',
    difficulty: 'advanced',
    summary: 'The step-by-step process of handling a cybersecurity breach.',
    keyPoints: [
      'Detection and Analysis',
      'Containment strategies',
      'Eradication of the threat',
      'Recovery of systems',
      'Post-incident Lessons Learned'
    ],
    example: 'Disconnecting a compromised server from the network to prevent lateral movement.',
    relatedMission: 'Data Breach Simulation'
  }
];

// @desc    Get all learning topics
// @route   GET /api/learn
// @access  Public
const getLearnTopics = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: learnData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get learning topic by ID
// @route   GET /api/learn/:id
// @access  Public
const getLearnTopicById = (req, res, next) => {
  try {
    const topic = learnData.find(t => t.id === req.params.id);
    if (!topic) {
      res.status(404);
      return next(new Error('Topic not found'));
    }
    res.status(200).json({
      success: true,
      data: topic
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLearnTopics,
  getLearnTopicById
};
