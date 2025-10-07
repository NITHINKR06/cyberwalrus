import type { LearningModule, Quiz, Achievement, Badge, LeaderboardEntry } from '../types';

export const learningModules: LearningModule[] = [
  {
    id: '1',
    title: 'Password Security Basics',
    description: 'Learn how to create and manage strong passwords',
    content: `# Password Security Basics

Strong passwords are your first line of defense against cyber attacks.

## Key Principles:
- Use at least 12 characters
- Mix uppercase, lowercase, numbers, and symbols
- Avoid common words and personal information
- Use unique passwords for each account
- Consider using a password manager

## Common Mistakes:
- Reusing passwords across multiple sites
- Using predictable patterns (e.g., Password123!)
- Sharing passwords with others
- Writing passwords on sticky notes`,
    difficulty: 'beginner',
    pointsReward: 100,
    orderIndex: 1,
  },
  {
    id: '2',
    title: 'Recognizing Phishing Attempts',
    description: 'Identify and avoid phishing scams',
    content: `# Recognizing Phishing Attempts

Phishing is a technique where attackers try to trick you into revealing sensitive information.

## Warning Signs:
- Urgent or threatening language
- Suspicious sender addresses
- Generic greetings ("Dear Customer")
- Requests for personal information
- Unexpected attachments or links
- Poor grammar and spelling

## How to Protect Yourself:
- Verify sender identity independently
- Hover over links before clicking
- Check for HTTPS on websites
- Report suspicious emails
- Never share sensitive info via email`,
    difficulty: 'beginner',
    pointsReward: 150,
    orderIndex: 2,
  },
  {
    id: '3',
    title: 'Two-Factor Authentication',
    description: 'Add an extra layer of security to your accounts',
    content: `# Two-Factor Authentication (2FA)

2FA adds an extra security layer beyond just passwords.

## Types of 2FA:
- SMS codes
- Authenticator apps (recommended)
- Hardware security keys
- Biometric verification

## Why It Matters:
Even if someone steals your password, they can't access your account without the second factor.

## Best Practices:
- Enable 2FA on all important accounts
- Use authenticator apps over SMS when possible
- Keep backup codes in a secure location
- Register multiple 2FA methods when available`,
    difficulty: 'intermediate',
    pointsReward: 200,
    orderIndex: 3,
  },
  {
    id: '4',
    title: 'Social Engineering Awareness',
    description: 'Understand psychological manipulation tactics',
    content: `# Social Engineering Awareness

Social engineering exploits human psychology rather than technical vulnerabilities.

## Common Tactics:
- Pretexting (creating fake scenarios)
- Baiting (offering something desirable)
- Quid pro quo (promising a benefit)
- Tailgating (physical unauthorized access)

## Red Flags:
- Unusual requests from known contacts
- Pressure to act immediately
- Requests to bypass normal procedures
- Too-good-to-be-true offers

## Defense Strategies:
- Verify identities through separate channels
- Question unusual requests
- Follow security protocols strictly
- Report suspicious interactions`,
    difficulty: 'intermediate',
    pointsReward: 200,
    orderIndex: 4,
  },
  {
    id: '5',
    title: 'Safe Online Shopping',
    description: 'Protect yourself while making online purchases',
    content: `# Safe Online Shopping

Online shopping safety prevents financial fraud and identity theft.

## Before You Buy:
- Verify website legitimacy
- Look for HTTPS and padlock icon
- Research seller reviews
- Check return policies
- Use secure payment methods

## Payment Security:
- Use credit cards over debit cards
- Consider virtual credit cards
- Enable purchase notifications
- Monitor statements regularly
- Avoid public WiFi for transactions

## Warning Signs of Fake Stores:
- Prices too good to be true
- Poor website design
- No contact information
- Limited payment options
- Pressure to buy immediately`,
    difficulty: 'beginner',
    pointsReward: 150,
    orderIndex: 5,
  },
];

export const quizzes: Quiz[] = [
  {
    id: 'q1',
    moduleId: '1',
    question: 'What is the minimum recommended password length?',
    options: ['6 characters', '8 characters', '12 characters', '20 characters'],
    correctAnswer: 2,
    explanation: '12 characters is the modern minimum recommendation for strong password security.',
    points: 20,
  },
  {
    id: 'q2',
    moduleId: '1',
    question: 'Which is the best password practice?',
    options: [
      'Use the same password for all accounts',
      'Write passwords on paper',
      'Use a unique password for each account',
      'Share passwords with family',
    ],
    correctAnswer: 2,
    explanation: 'Using unique passwords for each account prevents a single breach from compromising all your accounts.',
    points: 20,
  },
  {
    id: 'q3',
    moduleId: '2',
    question: 'What is a common sign of a phishing email?',
    options: [
      'Professional formatting',
      'Urgent threatening language',
      'Personalized greeting',
      'Clear sender information',
    ],
    correctAnswer: 1,
    explanation: 'Phishing emails often use urgent or threatening language to pressure you into acting quickly without thinking.',
    points: 30,
  },
  {
    id: 'q4',
    moduleId: '2',
    question: 'Before clicking a link in an email, what should you do?',
    options: [
      'Click immediately',
      'Forward to friends',
      'Hover to see the actual URL',
      'Delete the email',
    ],
    correctAnswer: 2,
    explanation: 'Hovering over links reveals the actual destination URL, helping you identify malicious links.',
    points: 30,
  },
  {
    id: 'q5',
    moduleId: '3',
    question: 'What is the recommended type of 2FA?',
    options: ['SMS codes', 'Email codes', 'Authenticator apps', 'Security questions'],
    correctAnswer: 2,
    explanation: 'Authenticator apps are more secure than SMS as they cannot be intercepted through SIM swapping attacks.',
    points: 40,
  },
  {
    id: 'q6',
    moduleId: '4',
    question: 'What is social engineering?',
    options: [
      'Building social networks',
      'Manipulating people to reveal information',
      'Engineering software',
      'Creating social media posts',
    ],
    correctAnswer: 1,
    explanation: 'Social engineering exploits human psychology to trick people into revealing confidential information.',
    points: 40,
  },
  {
    id: 'q7',
    moduleId: '5',
    question: 'What should you look for to verify a secure shopping website?',
    options: [
      'Colorful design',
      'HTTPS and padlock icon',
      'Pop-up ads',
      'Social media links',
    ],
    correctAnswer: 1,
    explanation: 'HTTPS and a padlock icon indicate the website uses encryption to protect your data.',
    points: 30,
  },
];

export const achievements: Achievement[] = [
  {
    id: 'a1',
    name: 'First Steps',
    description: 'Complete your first learning module',
    icon: 'BookOpen',
    requirementType: 'modules',
    requirementValue: 1,
    pointsReward: 50,
  },
  {
    id: 'a2',
    name: 'Knowledge Seeker',
    description: 'Complete 3 learning modules',
    icon: 'GraduationCap',
    requirementType: 'modules',
    requirementValue: 3,
    pointsReward: 100,
  },
  {
    id: 'a3',
    name: 'Cyber Guardian',
    description: 'Complete all learning modules',
    icon: 'Shield',
    requirementType: 'modules',
    requirementValue: 5,
    pointsReward: 200,
  },
  {
    id: 'a4',
    name: 'Point Collector',
    description: 'Earn 500 points',
    icon: 'Star',
    requirementType: 'points',
    requirementValue: 500,
    pointsReward: 100,
  },
  {
    id: 'a5',
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: 'Flame',
    requirementType: 'streak',
    requirementValue: 7,
    pointsReward: 150,
  },
  {
    id: 'a6',
    name: 'Community Protector',
    description: 'Report 5 scams',
    icon: 'AlertTriangle',
    requirementType: 'reports',
    requirementValue: 5,
    pointsReward: 100,
  },
];

export const badges: Badge[] = [
  {
    id: 'b1',
    name: 'Bronze Defender',
    description: 'Reach 100 points',
    icon: 'Award',
    tier: 'bronze',
    requirementPoints: 100,
  },
  {
    id: 'b2',
    name: 'Silver Guardian',
    description: 'Reach 500 points',
    icon: 'Award',
    tier: 'silver',
    requirementPoints: 500,
  },
  {
    id: 'b3',
    name: 'Gold Protector',
    description: 'Reach 1000 points',
    icon: 'Award',
    tier: 'gold',
    requirementPoints: 1000,
  },
  {
    id: 'b4',
    name: 'Platinum Champion',
    description: 'Reach 2000 points',
    icon: 'Trophy',
    tier: 'platinum',
    requirementPoints: 2000,
  },
];

export const leaderboardData: LeaderboardEntry[] = [
  { userId: '1', username: 'CyberNinja', totalPoints: 2450, level: 12, rank: 1 },
  { userId: '2', username: 'SecureUser', totalPoints: 2100, level: 11, rank: 2 },
  { userId: '3', username: 'SafetyFirst', totalPoints: 1850, level: 10, rank: 3 },
  { userId: '4', username: 'GuardianPro', totalPoints: 1600, level: 9, rank: 4 },
  { userId: '5', username: 'PhishHunter', totalPoints: 1400, level: 9, rank: 5 },
  { userId: '6', username: 'ShieldMaster', totalPoints: 1200, level: 8, rank: 6 },
  { userId: '7', username: 'CyberWatch', totalPoints: 1050, level: 7, rank: 7 },
  { userId: '8', username: 'DataDefender', totalPoints: 900, level: 7, rank: 8 },
  { userId: '9', username: 'SecureNet', totalPoints: 750, level: 6, rank: 9 },
  { userId: '10', username: 'SafeBrowse', totalPoints: 600, level: 5, rank: 10 },
];
