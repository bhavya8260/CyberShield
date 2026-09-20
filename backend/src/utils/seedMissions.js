require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const Mission = require('../models/Mission');

const seedMissions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    const missions = [
      {
        title: 'Phishing Attack: Suspicious Inbox',
        slug: 'phishing-suspicious-inbox',
        description: 'Identify and neutralize a targeted email campaign.',
        category: 'phishing',
        difficulty: 'easy',
        estimatedTime: 10,
        xpReward: 100,
        scenario: 'You have been granted access to an employee inbox. Several suspicious emails have been reported. Your task is to analyze these emails and identify the phishing attempts.',
        objectives: [
          'Inspect suspicious emails',
          'Identify phishing indicators',
          'Check sender information',
          'Analyze suspicious links',
          'Make the correct security decision'
        ],
        questions: [],
        simulationType: 'phishing',
        simulationData: {
          items: [
            {
              id: 'email-001',
              sender: 'hr@company.example',
              recipient: 'employee@company.example',
              subject: 'Annual Holiday Schedule',
              date: '2024-11-15T09:00:00Z',
              body: 'The annual holiday schedule is now available. Please review the attached calendar for the upcoming year.\n\nBest,\nHR Team',
              links: [],
              attachments: ['Holiday_Schedule_2025.pdf'],
              correctDecision: 'safe',
              explanation: 'This is a routine, non-urgent internal communication from a standard internal domain without suspicious links or demanding language.',
              points: 25
            },
            {
              id: 'email-002',
              sender: 'security-alert@company-support.example',
              recipient: 'employee@company.example',
              subject: 'URGENT: Your account will be disabled',
              date: '2024-11-15T10:15:00Z',
              body: 'Your account requires immediate verification due to unauthorized login attempts.\n\nClick the link below to prevent suspension:\nhttps://example.invalid/verify\n\nIf you do not verify within 24 hours, your account will be locked.',
              links: ['https://example.invalid/verify'],
              attachments: [],
              correctDecision: 'report_phishing',
              explanation: 'The sender domain (company-support.example) is typosquatting/unofficial. It uses intense urgency and directs you to an invalid external link to harvest credentials.',
              points: 25
            },
            {
              id: 'email-003',
              sender: 'billing@unknown-supplier.example',
              recipient: 'employee@company.example',
              subject: 'Invoice Payment Required',
              date: '2024-11-15T11:45:00Z',
              body: 'Please open the attached invoice and complete payment immediately to avoid service disruption.\n\nThank you,\nBilling Dept',
              links: [],
              attachments: ['Invoice_5921.pdf.exe'],
              correctDecision: 'report_phishing',
              explanation: 'This email contains a malicious double-extension attachment (.pdf.exe) and attempts to use financial urgency from an unknown sender.',
              points: 25
            },
            {
              id: 'email-004',
              sender: 'it@company.example',
              recipient: 'employee@company.example',
              subject: 'Scheduled Maintenance',
              date: '2024-11-15T14:30:00Z',
              body: 'System maintenance will occur tonight from 2 AM to 4 AM. Expect brief downtime for internal portals.\n\nNo action is required on your part.',
              links: [],
              attachments: [],
              correctDecision: 'safe',
              explanation: 'This is standard informational IT communication. It does not ask for credentials, has no suspicious links, and requires no urgent action.',
              points: 25
            }
          ]
        },
        isPublished: true,
      },
      {
        title: 'Password Breach Investigation',
        slug: 'password-breach-investigation',
        description: 'Investigate compromised accounts and identify weak password practices.',
        category: 'password',
        difficulty: 'easy',
        estimatedTime: 15,
        xpReward: 100,
        scenario: 'A recent dark web dump revealed several company credentials. You must investigate the accounts, identify why they were compromised, and recommend better practices.',
        objectives: [
          'Identify weak passwords',
          'Understand password reuse',
          'Recognize credential-stuffing risks',
          'Select safer password practices',
          'Respond to a compromised account'
        ],
        questions: [],
        simulationType: 'password',
        simulationData: {
          items: [
            {
              id: 'account-001',
              employee: 'Alex',
              department: 'HR',
              passwordStrength: 'Weak',
              passwordReuse: true,
              previousBreach: 'Simulated breach exposure',
              mfaEnabled: false,
              lastPasswordChange: '320 days ago',
              correctDecision: 'force_password_reset',
              explanation: 'This account is highly vulnerable. It has a weak, reused password from a previous breach, no MFA, and a very old password.',
              points: 20
            },
            {
              id: 'account-002',
              employee: 'Priya',
              department: 'Finance',
              passwordStrength: 'Strong',
              passwordReuse: false,
              previousBreach: 'None',
              mfaEnabled: true,
              lastPasswordChange: '15 days ago',
              correctDecision: 'mark_as_secure',
              explanation: 'This account follows strong security practices with a unique strong password, MFA enabled, and recent changes.',
              points: 20
            },
            {
              id: 'account-003',
              employee: 'Daniel',
              department: 'IT',
              passwordStrength: 'Strong',
              passwordReuse: false,
              previousBreach: 'None',
              mfaEnabled: false,
              lastPasswordChange: '180 days ago',
              correctDecision: 'enable_mfa',
              explanation: 'While the password is strong, IT accounts are high-value targets and must have MFA enabled.',
              points: 20
            },
            {
              id: 'account-004',
              employee: 'Sarah',
              department: 'Marketing',
              passwordStrength: 'Moderate',
              passwordReuse: true,
              previousBreach: 'Simulated breach exposure',
              mfaEnabled: true,
              lastPasswordChange: '45 days ago',
              correctDecision: 'force_password_reset',
              explanation: 'Even with MFA, a reused password found in a breach must be reset immediately.',
              points: 20
            },
            {
              id: 'account-005',
              employee: 'Unknown Device',
              department: 'N/A',
              passwordStrength: 'N/A',
              passwordReuse: false,
              previousBreach: 'Unknown',
              mfaEnabled: false,
              lastPasswordChange: 'Never',
              correctDecision: 'flag_account',
              explanation: 'An unknown or orphaned account with no security controls should be flagged for investigation and potential removal.',
              points: 20
            }
          ]
        },
        isPublished: true,
      },
      {
        title: 'Network Intrusion Alert',
        slug: 'network-intrusion-alert',
        description: 'Analyze network alerts and identify suspicious activity.',
        category: 'network',
        difficulty: 'medium',
        estimatedTime: 20,
        xpReward: 200,
        scenario: 'The IDS (Intrusion Detection System) has flagged anomalous traffic originating from a server in the DMZ. Analyze the simplified logs and determine if this is a false positive or an active breach.',
        objectives: [
          'Analyze network alerts',
          'Identify suspicious activity',
          'Recognize unusual connections',
          'Prioritize security events',
          'Select an appropriate response'
        ],
        questions: [],
        simulationType: 'network',
        simulationData: {
          items: [
            {
              id: 'alert-001',
              sourceIp: '10.0.1.44',
              destIp: '10.0.1.12',
              port: 22,
              protocol: 'TCP',
              timestamp: '2024-11-15T02:15:00Z',
              failedAttempts: 47,
              frequency: 'High',
              severity: 'High',
              summary: 'Rapid sequential SSH login failures indicative of a brute-force attack.',
              correctDecision: 'block_source',
              explanation: 'A high volume of failed SSH (port 22) attempts from an internal IP suggests a compromised machine attempting lateral movement. The source must be blocked immediately.',
              points: 25
            },
            {
              id: 'alert-002',
              sourceIp: '10.0.1.25',
              destIp: '10.0.1.10',
              port: 443,
              protocol: 'TCP',
              timestamp: '2024-11-15T09:30:00Z',
              failedAttempts: 0,
              frequency: 'Low',
              severity: 'Low',
              summary: 'Standard HTTPS traffic to the internal portal.',
              correctDecision: 'allow',
              explanation: 'This is standard, successful web traffic over HTTPS to an internal server.',
              points: 25
            },
            {
              id: 'alert-003',
              sourceIp: '10.0.1.55',
              destIp: '10.0.1.15',
              port: 445,
              protocol: 'TCP',
              timestamp: '2024-11-15T14:10:00Z',
              failedAttempts: 0,
              frequency: 'Very High',
              severity: 'Critical',
              summary: 'Workstation scanning hundreds of internal IPs on SMB port 445.',
              correctDecision: 'escalate_incident',
              explanation: 'Scanning on SMB (port 445) across the network is a strong indicator of a self-propagating worm (like ransomware). This requires immediate escalation to the incident response team.',
              points: 25
            },
            {
              id: 'alert-004',
              sourceIp: '10.0.1.18',
              destIp: '10.0.1.20',
              port: 80,
              protocol: 'TCP',
              timestamp: '2024-11-15T16:05:00Z',
              failedAttempts: 3,
              frequency: 'Low',
              severity: 'Medium',
              summary: 'A few failed HTTP requests to an internal web server. Possible misconfigured script.',
              correctDecision: 'monitor',
              explanation: 'A small number of failed HTTP requests might be a misconfiguration or a minor issue. It should be monitored but does not require an immediate block.',
              points: 25
            }
          ]
        },
        isPublished: true,
      },
      {
        title: 'Malware Investigation: Unknown File',
        slug: 'malware-unknown-file',
        description: 'Examine simulated evidence to determine if a file is malicious.',
        category: 'malware',
        difficulty: 'medium',
        estimatedTime: 25,
        xpReward: 200,
        scenario: 'An employee reported an unexpected attachment named "Invoice_Q3_Final.exe". You need to analyze the file\'s behavior indicators and determine a course of action.',
        objectives: [
          'Identify suspicious file behavior',
          'Examine simulated evidence',
          'Recognize malware indicators',
          'Decide when to isolate a device',
          'Report suspicious activity'
        ],
        questions: [],
        simulationType: 'malware',
        simulationData: {
          items: [
            {
              id: 'file-001',
              fileName: 'update.exe',
              fileType: 'Executable',
              fileSize: '4.8 MB',
              source: 'Unknown Email',
              signature: 'Missing',
              riskIndicators: 3,
              sandboxResult: 'Suspicious',
              behavior: 'Attempts simulated persistence (registry modification)',
              correctDecision: 'quarantine',
              explanation: 'An unsigned executable from an unknown source that attempts persistence is highly suspicious and must be quarantined.',
              points: 20
            },
            {
              id: 'file-002',
              fileName: 'company_report.docx',
              fileType: 'Document',
              fileSize: '1.2 MB',
              source: 'Internal Intranet',
              signature: 'Valid',
              riskIndicators: 0,
              sandboxResult: 'Clean',
              behavior: 'Standard document open',
              correctDecision: 'allow',
              explanation: 'This is a clean, standard internal document with no suspicious indicators.',
              points: 20
            },
            {
              id: 'file-003',
              fileName: 'Invoice_Q3_Final.pdf.exe',
              fileType: 'Executable',
              fileSize: '850 KB',
              source: 'External Email',
              signature: 'Missing',
              riskIndicators: 5,
              sandboxResult: 'Malicious',
              behavior: 'Injects code into explorer.exe, connects to unknown IP',
              correctDecision: 'escalate',
              explanation: 'The double extension, missing signature, and malicious behavior (process injection) indicate severe malware. This needs immediate quarantine and escalation.',
              points: 20
            },
            {
              id: 'file-004',
              fileName: 'financial_statement.pdf',
              fileType: 'Document',
              fileSize: '3.1 MB',
              source: 'Partner Portal',
              signature: 'Valid',
              riskIndicators: 1,
              sandboxResult: 'Clean',
              behavior: 'Contains standard macros, prompts user',
              correctDecision: 'monitor',
              explanation: 'While it contains macros (which can be risky), it comes from a known source and passes sandbox checks. It should be allowed but monitored.',
              points: 20
            },
            {
              id: 'file-005',
              fileName: 'unknown_attachment.zip',
              fileType: 'Archive',
              fileSize: '15 MB',
              source: 'Spam Folder',
              signature: 'N/A',
              riskIndicators: 2,
              sandboxResult: 'Timeout',
              behavior: 'Password protected archive, cannot be scanned',
              correctDecision: 'quarantine',
              explanation: 'Encrypted archives from untrusted sources are a common way to bypass email scanners. It should be quarantined as it cannot be verified safe.',
              points: 20
            }
          ]
        },
        isPublished: true,
      },
      {
        title: 'Security Incident: Contain the Breach',
        slug: 'security-incident-contain-breach',
        description: 'Respond to an active security breach and take actions to contain it.',
        category: 'incident-response',
        difficulty: 'hard',
        estimatedTime: 30,
        xpReward: 300,
        scenario: 'A high-severity alert indicates that a domain controller has been compromised. The attacker is actively attempting to move laterally. You must decide the correct incident response procedures.',
        objectives: [
          'Identify the incident',
          'Assess the situation',
          'Contain affected systems',
          'Preserve evidence',
          'Escalate appropriately',
          'Recover safely'
        ],
        questions: [],
        simulationType: 'incident-response',
        simulationData: {
          items: [
            {
              id: 'stage-1-detect',
              title: 'Stage 1: Detect',
              description: 'Multiple failed logins followed by a successful login outside of normal business hours for a domain administrator account.',
              evidence: ['Login failures: 50 in 2 mins', 'Successful login: 02:14 AM', 'Source IP: Unknown VPN node'],
              correctDecision: 'investigate',
              explanation: 'A pattern of rapid failures followed by success at an odd hour strongly suggests a successful brute-force or credential stuffing attack. Immediate investigation is required.',
              points: 50
            },
            {
              id: 'stage-2-analyze',
              title: 'Stage 2: Analyze',
              description: 'The administrator account is actively querying Active Directory for all user accounts and groups.',
              evidence: ['Process: powershell.exe', 'Command: Get-ADUser -Filter *', 'Status: Active'],
              correctDecision: 'escalate',
              explanation: 'The attacker is performing Active Directory reconnaissance (dumping user lists), a critical precursor to lateral movement and privilege escalation. This must be escalated immediately.',
              points: 50
            },
            {
              id: 'stage-3-contain',
              title: 'Stage 3: Contain',
              description: 'The attacker has established an interactive session on the primary Domain Controller.',
              evidence: ['System: DC-01', 'Session: RDP active', 'Network Activity: High outbound traffic'],
              correctDecision: 'isolate_system',
              explanation: 'The domain controller is compromised. To prevent further lateral movement or data exfiltration, the system must be isolated from the network immediately, rather than just shutting it down (which destroys memory forensics).',
              points: 50
            },
            {
              id: 'stage-4-eradicate',
              title: 'Stage 4: Eradicate',
              description: 'The affected Domain Controller is isolated. Forensic teams are analyzing the memory.',
              evidence: ['Malware found: Credential dumper in RAM', 'Affected Accounts: Domain Admins'],
              correctDecision: 'reset_credentials',
              explanation: 'Since a credential dumper was found on a Domain Controller, you must assume all domain credentials are compromised and force a global password reset for privileged accounts.',
              points: 50
            },
            {
              id: 'stage-5-recover',
              title: 'Stage 5: Recover',
              description: 'The malware has been removed, the system rebuilt from a known clean backup, and all administrative passwords reset.',
              evidence: ['System Status: Clean', 'Vulnerabilities: Patched', 'Credentials: Secured'],
              correctDecision: 'restore_service',
              explanation: 'With the environment secured, patched, and rebuilt from clean backups, it is safe to cautiously restore services while maintaining heightened monitoring.',
              points: 50
            },
            {
              id: 'stage-6-review',
              title: 'Stage 6: Review',
              description: 'The incident has been fully resolved and services are operational.',
              evidence: ['Downtime: 4 hours', 'Data loss: None confirmed', 'Root cause: Lack of MFA on VPN'],
              correctDecision: 'close_incident',
              explanation: 'The incident can be closed. The findings (e.g., lack of MFA) should be documented in a post-incident report to prevent recurrence.',
              points: 50
            }
          ]
        },
        isPublished: true,
      }
    ];

    for (let mission of missions) {
      await Mission.findOneAndUpdate(
        { slug: mission.slug },
        mission,
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`Mission upserted: ${mission.title}`);
    }

    // Clean up any old dummy missions to ensure exactly 5 exist
    const slugsToKeep = missions.map(m => m.slug);
    const deleteResult = await Mission.deleteMany({ slug: { $nin: slugsToKeep } });
    console.log(`Cleaned up ${deleteResult.deletedCount} old dummy missions.`);

    console.log('Database seeded with missions successfully!');
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
  } finally {
    mongoose.connection.close();
  }
};

seedMissions();
