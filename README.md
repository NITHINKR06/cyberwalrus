# WALRUS - Cybersecurity & Digital Safety Platform

**WALRUS** is a gamified, multilingual, AI-powered platform designed to educate citizens on cyber scams, enable easy fraud reporting, and provide tools to detect phishing and fraud in real-time.

## 🌟 Features

### Core Pillars

1. **Educate** - Interactive and gamified learning modules
   - Password security fundamentals
   - Phishing recognition techniques
   - Two-factor authentication
   - Social engineering awareness
   - Safe online shopping practices

2. **Empower** - AI-Powered Scam Analyzer
   - Real-time text analysis for suspicious messages
   - URL safety checking
   - Threat level assessment with confidence scores
   - Actionable recommendations

3. **Protect** - Community-Driven Fraud Reporting
   - Easy scam reporting system
   - Multiple scam type categories
   - Severity classification
   - Points-based reward system

### Key Features

- 🎮 **Gamification System**
  - Points and levels
  - Achievements and badges
  - Daily streaks
  - Leaderboard competition

- 🌍 **Multilingual Support**
  - English
  - Hindi (हिंदी)
  - Kannada (ಕನ್ನಡ)
  - Easy language switching

- 🤖 **AI-Powered Analysis**
  - Text analysis for phishing detection
  - URL safety verification
  - Threat indicators identification
  - Confidence scoring

- 📊 **Progress Tracking**
  - Personal dashboard
  - Learning progress visualization
  - Achievement tracking
  - Community ranking

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Internationalization**: react-i18next
- **State Management**: React Context API
- **Data Persistence**: LocalStorage (prototype)

### Planned Integrations

- **AI Analysis**: Hugging Face Inference API
- **URL Safety**: Google Safe Browsing API
- **Data Visualization**: Recharts
- **Notifications**: React Toastify

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Achievements.tsx      # Achievement tracking
│   │   ├── Auth.tsx              # Authentication
│   │   ├── Dashboard.tsx         # User dashboard
│   │   ├── LanguageSwitcher.tsx  # Language selection
│   │   ├── Leaderboard.tsx       # Community rankings
│   │   ├── LearningModules.tsx   # Educational content
│   │   ├── ReportScam.tsx        # Scam reporting
│   │   └── ScamAnalyzer.tsx      # AI-powered analysis
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication context
│   ├── data/
│   │   └── mockData.ts           # Mock data for prototype
│   ├── i18n/
│   │   ├── index.ts              # i18n configuration
│   │   └── locales/
│   │       ├── en.json           # English translations
│   │       ├── hi.json           # Hindi translations
│   │       └── kn.json           # Kannada translations
│   ├── App.tsx                   # Main application
│   ├── main.tsx                  # Entry point
│   └── types.ts                  # TypeScript types
├── .env                          # Environment variables
└── package.json                  # Dependencies
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   VITE_GOOGLE_SAFE_BROWSING_API_KEY=your_google_safe_browsing_api_key_here
   ```

4. **Start development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🎯 Usage

### Getting Started

1. **Sign Up/Login**: Create an account or use demo credentials
2. **Explore Dashboard**: View your progress, points, and achievements
3. **Learn**: Complete educational modules and quizzes
4. **Analyze**: Use the Scam Analyzer to check suspicious content
5. **Report**: Help the community by reporting scams
6. **Compete**: Check the leaderboard and climb the ranks

### Language Switching

Click the globe icon (🌐) in the navigation bar to switch between:
- English
- Hindi (हिंदी)
- Kannada (ಕನ್ನಡ)

### Scam Analyzer

1. Navigate to "Scam Analyzer" in the menu
2. Choose between:
   - **Text Analysis**: Paste suspicious messages or emails
   - **URL Check**: Enter suspicious website URLs
3. Click "Analyze" or "Check URL"
4. Review the threat assessment and recommendations

## 🏆 Gamification System

### Points System

- Complete learning modules: 100-200 points
- Pass quizzes: 20-40 points per question
- Report scams: 25 points (submission) + 50 points (verified)
- Unlock achievements: 50-200 points

### Levels

- Level up every 500 points
- Higher levels unlock exclusive badges
- Compete on the global leaderboard

### Achievements

- **First Steps**: Complete your first module
- **Knowledge Seeker**: Complete 3 modules
- **Cyber Guardian**: Complete all modules
- **Point Collector**: Earn 500 points
- **Streak Master**: Maintain 7-day streak
- **Community Protector**: Report 5 scams

## 🔐 Security Features

### Scam Detection

The AI-powered analyzer checks for:
- Urgency tactics
- Requests for sensitive information
- Suspicious language patterns
- Unsecure protocols (HTTP vs HTTPS)
- Known malicious patterns
- URL shorteners

### Threat Levels

- 🟢 **Safe**: No threats detected
- 🟡 **Suspicious**: Potential risks identified
- 🔴 **Dangerous**: High-risk content detected

## 🌐 API Integration (Production)

### Hugging Face API

For text analysis, integrate with Hugging Face's text classification models:

```typescript
const response = await fetch(
  'https://api-inference.huggingface.co/models/MODEL_NAME',
  {
    headers: {
      Authorization: `Bearer ${VITE_HUGGINGFACE_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({ inputs: text }),
  }
);
```

### Google Safe Browsing API

For URL checking:

```typescript
const response = await fetch(
  `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${VITE_GOOGLE_SAFE_BROWSING_API_KEY}`,
  {
    method: 'POST',
    body: JSON.stringify({
      client: { clientId: 'walrus', clientVersion: '1.0.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url: urlToCheck }],
      },
    }),
  }
);
```

## 📱 Responsive Design

WALRUS is fully responsive and works seamlessly on:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for the Reality Rewritten Hackathon.

## 🙏 Acknowledgments

- **Reality Rewritten Hackathon** for the opportunity
- **Hugging Face** for AI models
- **Google Safe Browsing** for URL safety API
- **React Community** for excellent tools and libraries

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for a safer digital world**
