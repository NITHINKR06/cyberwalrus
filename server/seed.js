import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; // Your user model
import Scam from './models/Scam.js'; // Your new scam model

dotenv.config();

// --- Data for Users ---
// const seedUsers = [
//   {
//     username: 'testuser',
//     email: 'test@example.com',
//     password: 'Test123!',
//     level: 1,
//     totalPoints: 100,
//     currentStreak: 5
//   },
//   {
//     username: 'admin',
//     email: 'admin@example.com',
//     password: 'Admin123!',
//     level: 5,
//     totalPoints: 500,
//     currentStreak: 10
//   },
//   {
//     username: 'john_doe',
//     email: 'john@example.com',
//     password: 'John123!',
//     level: 2,
//     totalPoints: 250,
//     currentStreak: 3
//   }
// ];

// --- Data for Scams ---
const seedScams = [
    {
        "era": "Classics", "year": 1988, "name": "Morris Worm",
        "description": "First major worm spread via ARPANET; exploited buffer overflow in Unix.",
        "red_flags": ["Unsolicited network probes", "system slowdowns"],
        "impact": { "summary": "Infected 6,000+ systems (10% of internet); $10M–$100M cleanup costs." }
    },
    {
        "era": "Classics", "year": 1994, "name": "AOHell Phishing",
        "description": "Teen hacker's AOL tool stole passwords via fake verification; impersonated support.",
        "red_flags": ["Urgent account checks", "credit card gens"],
        "impact": { "summary": "Thousands of AOL accounts cracked; early mass phishing precursor." }
    },
    {
        "era": "Classics", "year": 1999, "name": "Melissa Virus",
        "description": "Email macro virus promising adult content; self-propagated via Outlook.",
        "red_flags": ["Sensational subjects", "attachments"],
        "impact": { "summary": "$80M damages; overwhelmed corporate email servers." }
    },
    {
        "era": "Classics", "year": 2000, "name": "ILOVEYOU Worm",
        "description": "Philippine hacker's VBS script overwrote files, stole PWs; spread as love letters.",
        "red_flags": ["Emotional lures", ".vbs attachments"],
        "impact": { "summary": "$10B+ global damages; hit 50M PCs, including Pentagon." }
    },
    {
        "era": "Classics", "year": 2000, "name": "Mafiaboy DDoS",
        "description": "Teen DDoS'd e-commerce giants via zombie bots.",
        "red_flags": ["Site outages during peaks"],
        "impact": { "summary": "Millions in lost revenue for Amazon/Yahoo/eBay; hours-long blackouts." }
    },
    {
        "era": "Classics", "year": 2007, "name": "Nordea Bank Trojan",
        "description": "\"Haxdoor\" disguised as anti-spam; keylogged to fake site.",
        "red_flags": ["Fake software updates", "no AV"],
        "impact": { "summary": "7M SEK (~$1M) stolen; dubbed biggest online bank heist." }
    },
    {
        "era": "Classics", "year": 2013, "name": "Target Card Theft",
        "description": "Phishing HVAC vendor stole 110M cards via POS malware.",
        "red_flags": ["Vendor creds harvest"],
        "impact": { "summary": "$300M settlement; 110M customers exposed." }
    },
    {
        "era": "Classics", "year": 2014, "name": "Sony Pictures Leak",
        "description": "Spear-phish fake Apple ID stole 100TB data.",
        "red_flags": ["Login alerts from \"colleagues.\""],
        "impact": { "summary": "$100M+ costs; 47K SSNs, films leaked." }
    },
    {
        "era": "Classics", "year": 2017, "name": "WannaCry Ransomware",
        "description": "NCSC exploit kit hit via phishing; demanded BTC.",
        "red_flags": ["Fake updates"],
        "impact": { "summary": "$4B+ global; 200K systems in 150 countries." }
    },
    {
        "era": "Threats", "year": 2020, "name": "Twitter Bitcoin Scam",
        "description": "Internal tool phish hijacked celeb accounts for giveaways.",
        "red_flags": ["Too-good offers"],
        "impact": { "summary": "$120K BTC stolen; 130+ accounts." }
    },
    {
        "era": "Threats", "year": 2021, "name": "Colonial Pipeline",
        "description": "DarkSide ransomware via phishing; shut fuel lines.",
        "red_flags": ["VPN creds"],
        "impact": { "summary": "$4.4M ransom; East Coast shortages." }
    },
    {
        "era": "Threats", "year": 2023, "name": "MOVEit Breach",
        "description": "Clop ransomware via zero-day phish.",
        "red_flags": ["File upload lures"],
        "impact": { "summary": "60M+ affected; $10M+ fines." }
    },
    {
        "era": "Threats", "year": 2024, "name": "Change Healthcare Ransomware",
        "description": "ALPHV/BlackCat phish hit payments.",
        "red_flags": ["Vendor emails"],
        "impact": { "summary": "$22M ransom; US healthcare disruptions." }
    },
    {
        "era": "Threats", "year": 2025, "name": "ByBit Crypto Heist",
        "description": "North Korean exploit via wallet vuln (phish entry).",
        "red_flags": ["Third-party approvals"],
        "impact": { "summary": "$1.5B Ethereum stolen; $160M laundered in 48h." }
    },
    {
        "era": "Threats", "year": 2025, "name": "UNFI Cyberattack",
        "description": "Unauthorised access crippled ordering systems.",
        "red_flags": ["Third-party access issues"],
        "impact": { "summary": "Grocery shortages across North America; supply chain fragility exposed." }
    },
    {
        "era": "Threats", "year": 2025, "name": "Sepah Bank Breach",
        "description": "Hacker collective stole records, demanded ransom.",
        "red_flags": ["Network access lapses"],
        "impact": { "summary": "42M customer records (12TB) compromised; one of largest bank attacks." }
    },
    {
        "era": "Threats", "year": 2025, "name": "Telemessage Breach",
        "description": "Infiltration exposed metadata of officials.",
        "red_flags": ["Third-party app vulnerabilities"],
        "impact": { "summary": "60+ accounts exposed; counterintelligence risks for US gov." }
    },
    {
        "era": "Threats", "year": 2025, "name": "SAP Netweaver Vulnerability",
        "description": "Zero-day allowed remote code execution.",
        "red_flags": ["Unpatched systems"],
        "impact": { "summary": "581+ instances exploited; enterprise systems at risk." }
    },
    {
        "era": "Threats", "year": 2025, "name": "M&S Cyberattack",
        "description": "Social engineering bypassed contractors.",
        "red_flags": ["Phishing via social eng."],
        "impact": { "summary": "£300M losses; online shopping down 6 weeks." }
    },
    {
        "era": "Threats", "year": 2025, "name": "RansomHub on Durant/Lorain/Puerto Rico",
        "description": "Ransomware disrupted services.",
        "red_flags": ["Phishing entry points"],
        "impact": { "summary": "Courts, comms crippled for thousands." }
    },
    {
        "era": "Threats", "year": 2025, "name": "Qilin on Lee Enterprises",
        "description": "Ransomware exposed SSNs.",
        "red_flags": ["Network infiltration"],
        "impact": { "summary": "40K SSNs leaked; $2M recovery, revenue losses." }
    },
    {
        "era": "Threats", "year": 2025, "name": "North Korean on European Orgs",
        "description": "Posed as remote workers for infiltration.",
        "red_flags": ["Fake job offers"],
        "impact": { "summary": "Data theft, extortion in defense/gov sectors." }
    }
];


async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/walrus_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');

    // --- Seed Users ---
    console.log('--- Clearing existing users ---');
    await User.deleteMany({});
    
    // for (const userData of seedUsers) {
    //     // The pre-save hook in your User model will automatically hash the password
    //     const user = new User(userData);
    //     await user.save();
    //     console.log(`✅ Created user: ${userData.username}`);
    // }

    // --- Seed Scams ---
    console.log('\n--- Clearing existing scam data ---');
    await Scam.deleteMany({});
  
    console.log('--- Inserting new scam data ---');
    await Scam.insertMany(seedScams);
    console.log(`✅ Inserted ${seedScams.length} scam scenarios.`);

    console.log('\n✅ Database seeding completed!');
    
    console.log('\n📝 Test Credentials:');
    console.log('------------------------');
    // seedUsers.forEach(user => {
    //   console.log(`Email: ${user.email}`);
    //   console.log(`Password: ${user.password}`);
    //   console.log('------------------------');
    // });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
