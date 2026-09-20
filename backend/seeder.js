const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Mission = require('./src/models/Mission');
const MissionResult = require('./src/models/MissionResult');
const connectDB = require('./src/config/database');

dotenv.config();

const users = [
  {
    username: 'admin',
    email: 'admin@cybershield.com',
    password: 'password123',
    role: 'admin',
    totalScore: 500,
    completedChallenges: 5,
  },
  {
    username: 'player1',
    email: 'player1@example.com',
    password: 'password123',
    role: 'user',
    totalScore: 150,
    completedChallenges: 2,
  },
  {
    username: 'player2',
    email: 'player2@example.com',
    password: 'password123',
    role: 'user',
    totalScore: 50,
    completedChallenges: 1,
  },
];

const missions = [
  {
    title: 'Spot the Phishing Attack',
    slug: 'spot-the-phishing-attack',
    description: 'Identify common indicators of a phishing email in a corporate environment.',
    category: 'Phishing Defense',
    difficulty: 'Beginner',
    estimatedTime: '5 min',
    xpReward: 100,
    scenario: 'An employee from the finance department reported a suspicious email asking them to reset their payroll password immediately. Your task is to investigate the email and identify if it is a legitimate request or a phishing attempt.',
    objectives: [
      'Examine the sender address.',
      'Check for urgency or threats in the email body.',
      'Identify malicious links.'
    ],
    questions: [
      {
        questionText: 'What is the most critical element to investigate first when receiving a suspicious email?',
        type: 'multiple-choice',
        options: ['Email formatting', 'Sender domain', 'Employee\'s password', 'Computer hardware'],
        correctAnswer: 'Sender domain',
        explanation: 'The sender domain should be investigated first because lookalike domains are a common phishing technique. Formatting can be easily copied, but domains are unique.',
        points: 50,
      },
      {
        questionText: 'If the email contains a link that says "Reset Password", what should you do before clicking?',
        type: 'multiple-choice',
        options: ['Click it to see where it goes', 'Hover over the link to inspect the actual URL', 'Forward the email to a colleague', 'Reply to the sender for confirmation'],
        correctAnswer: 'Hover over the link to inspect the actual URL',
        explanation: 'Hovering over a link allows you to see the true destination URL without actually navigating to it, helping you spot fraudulent domains.',
        points: 50,
      }
    ],
  },
  {
    title: 'Fortify the Password',
    slug: 'fortify-the-password',
    description: 'Learn the principles of creating and managing strong passwords.',
    category: 'Password Security',
    difficulty: 'Beginner',
    estimatedTime: '10 min',
    xpReward: 150,
    scenario: 'A recent security audit revealed that several employees are using weak passwords like "password123" and "summer2023". You are tasked with training the team on password best practices.',
    objectives: [
      'Understand password complexity.',
      'Learn about password managers.',
      'Identify bad password habits.'
    ],
    questions: [
      {
        questionText: 'Which of the following is considered the strongest password?',
        type: 'multiple-choice',
        options: ['MyDogBuster2023!', 'Tr0ub4dor&3', 'correct horse battery staple', 'P@ssw0rd1'],
        correctAnswer: 'correct horse battery staple',
        explanation: 'A long passphrase made of random words ("correct horse battery staple") is often much harder for computers to crack than a shorter, complex password, while being easier for humans to remember.',
        points: 150,
      }
    ],
  },
  {
    title: 'Detect the Intrusion',
    slug: 'detect-the-intrusion',
    description: 'Analyze network logs to find an ongoing intrusion.',
    category: 'Network Defense',
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    xpReward: 250,
    scenario: 'The IDS (Intrusion Detection System) has flagged unusual outbound traffic from a database server at 3:00 AM. You need to determine if this is a legitimate backup process or a data exfiltration attempt.',
    objectives: [
      'Review firewall logs.',
      'Identify anomalous traffic patterns.',
      'Determine the source of the traffic.'
    ],
    questions: [
      {
        questionText: 'You notice a large volume of DNS requests originating from the database server to an unknown external IP. What attack technique might this indicate?',
        type: 'multiple-choice',
        options: ['SQL Injection', 'DNS Tunneling for Data Exfiltration', 'Cross-Site Scripting (XSS)', 'Man-in-the-Middle (MitM)'],
        correctAnswer: 'DNS Tunneling for Data Exfiltration',
        explanation: 'Attackers often use DNS tunneling to bypass firewall rules and sneak data out of a network, as DNS traffic is rarely blocked entirely.',
        points: 250,
      }
    ],
  },
  {
    title: 'Investigate the Malware',
    slug: 'investigate-the-malware',
    description: 'Analyze a suspicious file to understand its capabilities.',
    category: 'Malware Investigation',
    difficulty: 'Intermediate',
    estimatedTime: '20 min',
    xpReward: 300,
    scenario: 'A user downloaded what they thought was a software update, but their computer has become extremely slow, and new unexpected processes are running. You need to analyze the file.',
    objectives: [
      'Identify the malware type.',
      'Determine persistence mechanisms.',
      'Find Indicators of Compromise (IoCs).'
    ],
    questions: [
      {
        questionText: 'When analyzing the malware, you see it modifies the Windows Registry key: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run. Why does it do this?',
        type: 'multiple-choice',
        options: ['To steal user credentials', 'To communicate with a Command and Control server', 'To ensure the malware starts automatically when the user logs in', 'To encrypt user files'],
        correctAnswer: 'To ensure the malware starts automatically when the user logs in',
        explanation: 'The "Run" registry key is a common persistence mechanism used by malware to ensure it survives reboots and executes every time the user logs in.',
        points: 300,
      }
    ],
  },
  {
    title: 'Respond to the Breach',
    slug: 'respond-to-the-breach',
    description: 'Lead the response to an active data breach.',
    category: 'Incident Response',
    difficulty: 'Advanced',
    estimatedTime: '30 min',
    xpReward: 500,
    scenario: 'Customer data has been leaked online, and the source appears to be your primary application server. Executive leadership needs an immediate action plan.',
    objectives: [
      'Contain the incident.',
      'Eradicate the threat.',
      'Communicate with stakeholders.'
    ],
    questions: [
      {
        questionText: 'What is the most appropriate FIRST step in the containment phase for the compromised application server?',
        type: 'multiple-choice',
        options: ['Turn off the server immediately to stop the attack', 'Disconnect the server from the network but leave it powered on', 'Wipe the hard drive and restore from backup', 'Patch the vulnerability that caused the breach'],
        correctAnswer: 'Disconnect the server from the network but leave it powered on',
        explanation: 'Disconnecting the server from the network contains the threat (prevents further data exfiltration), while leaving it powered on preserves volatile memory (RAM) for forensic analysis. Turning it off destroys evidence.',
        points: 500,
      }
    ],
  }
];

const importData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Mission.deleteMany();
    await MissionResult.deleteMany();
    console.log('Data Destroyed...');

    await User.insertMany(users);
    await Mission.insertMany(missions);
    console.log('Data Imported...');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Mission.deleteMany();
    await MissionResult.deleteMany();
    
    console.log('Data Destroyed...');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
