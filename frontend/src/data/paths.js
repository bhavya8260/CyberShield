export const learningPaths = [
  {
    id: 'cybersecurity-fundamentals',
    slug: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn the core concepts of cybersecurity, from phishing to malware investigation.',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    items: [
      { id: '1', type: 'learn', resourceId: 'phishing-defense', title: 'Phishing Defense Basics' },
      { id: '2', type: 'mission', resourceId: 'suspicious-email-investigation', title: 'Suspicious Email Investigation' },
      { id: '3', type: 'learn', resourceId: 'password-security', title: 'Password Security Essentials' },
      { id: '4', type: 'mission', resourceId: 'password-breach-analysis', title: 'Password Breach Analysis' },
      { id: '5', type: 'learn', resourceId: 'network-defense', title: 'Network Defense 101' },
      { id: '6', type: 'mission', resourceId: 'network-intrusion-detection', title: 'Network Intrusion Detection' },
      { id: '7', type: 'learn', resourceId: 'malware-analysis', title: 'Malware Analysis Basics' },
      { id: '8', type: 'mission', resourceId: 'malware-outbreak-containment', title: 'Malware Outbreak Containment' }
    ]
  },
  {
    id: 'soc-analyst-fundamentals',
    slug: 'soc-analyst-fundamentals',
    title: 'SOC Analyst Fundamentals',
    description: 'Build the foundational skills required to work in a Security Operations Center (SOC).',
    category: 'SOC',
    difficulty: 'Intermediate',
    items: [
      { id: '9', type: 'learn', resourceId: 'incident-response', title: 'Incident Response Lifecycle' },
      { id: '10', type: 'mission', resourceId: 'incident-response-simulation', title: 'Incident Response Simulation' },
      { id: '11', type: 'learn', resourceId: 'network-defense', title: 'Advanced Network Analysis' },
      { id: '12', type: 'mission', resourceId: 'network-intrusion-detection', title: 'Network Intrusion Analysis' },
      { id: '13', type: 'learn', resourceId: 'malware-analysis', title: 'Threat Intelligence' },
      { id: '14', type: 'mission', resourceId: 'malware-outbreak-containment', title: 'Advanced Malware Triage' }
    ]
  }
];
