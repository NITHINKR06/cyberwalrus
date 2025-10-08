import { useState } from 'react';
import { 
  Shield, 
  Users, 
  Target, 
  Award,
  Globe,
  Lock,
  Brain,
  Heart,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  expertise: string[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Ayush Hegde",
    role: "Lead Developer & Security Expert",
    image: "/public/ayush.jpg",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    bio: "Cybersecurity specialist with 10+ years of experience in fraud detection and AI systems. Passionate about making the internet safer for everyone.",
    expertise: ["AI/ML", "Cybersecurity", "Backend Architecture"],
    social: {
      github: "https://github.com/AyushHegde-1429",
      linkedin: "https://www.linkedin.com/in/ayush-hegde-b54b7b1b0/",
      twitter: "https://www.instagram.com/ayush_hegde_/"
    }
  },
  {
    name: "Priya Sharma",
    role: "Frontend Developer & UX Designer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    bio: "Creative developer focused on building intuitive and accessible user experiences. Believes in the power of design to solve complex problems.",
    expertise: ["React", "UI/UX Design", "Accessibility"],
    social: {
      github: "https://github.com/Sonalhegde/",
      linkedin: "https://www.linkedin.com/in/sonalhegde/",
      email: "priya@example.com"
    }
  },
  {
    name: "Marcus Johnson",
    role: "AI/ML Engineer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    bio: "Machine learning engineer specializing in NLP and pattern recognition. Dedicated to developing intelligent systems that protect users from online threats.",
    expertise: ["Machine Learning", "NLP", "Data Science"],
    social: {
      github: "https://github.com/Sakshats993",
      twitter: "https://www.linkedin.com/in/sakshat-salian-0796a230b"
    }
  },
  {
    name: "NITHIN K R",
    role: "Security Researcher",
    image: "/public/NITHINKR06.jpg",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "Ethical hacker and security researcher with expertise in identifying and preventing digital fraud. Regular speaker at cybersecurity conferences.",
    expertise: ["Threat Analysis", "Penetration Testing", "Security Audits"],
    social: {
      linkedin: "https://linkedin.com/in/nithinkr06",
      email: "nithinpoojari717@gmail.com",
      github: "https://github.com/NITHINKR06",
    }
  }
];

const stats = [
  { label: "Scams Detected", value: "50K+", icon: AlertTriangle },
  { label: "Users Protected", value: "100K+", icon: Users },
  { label: "Reports Analyzed", value: "1M+", icon: TrendingUp },
  { label: "Accuracy Rate", value: "99.5%", icon: CheckCircle }
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Detection",
    description: "Advanced machine learning algorithms analyze patterns and identify potential threats in real-time."
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Protecting users worldwide with support for multiple languages and regional scam patterns."
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is encrypted and never shared. We believe in protecting both your security and privacy."
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Built by the community, for the community. Every report helps protect others from scams."
  }
];

export default function About() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-2xl">
                <Shield className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Protecting You from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Digital Threats</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              We're on a mission to make the internet safer for everyone. Our advanced AI-powered platform helps identify and prevent online scams before they can cause harm.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                Get Started <ChevronRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                In an increasingly digital world, online scams and fraud have become sophisticated threats that can affect anyone. We believe that everyone deserves to feel safe online, regardless of their technical expertise.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our platform combines cutting-edge artificial intelligence with community-driven insights to create a comprehensive defense against digital fraud. We analyze millions of data points to identify patterns and protect users in real-time.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                      alt={`User ${i}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Trusted by 100,000+ users worldwide
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">Real-time Protection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-purple-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">99.5% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">AI-Powered Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Our Platform?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We combine advanced technology with user-friendly design to create the most effective scam detection platform available.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A dedicated group of security experts, developers, and researchers working together to keep you safe online.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="p-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 size-fit rounded-full mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 text-center mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 line-clamp-2">
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-center gap-3">
                  {member.social.github && (
                    <a href={member.social.github} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.email && (
                    <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Powered by Cutting-Edge Technology</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI & Machine Learning</h3>
              <p className="text-blue-100">
                Advanced neural networks trained on millions of scam patterns to detect threats with unprecedented accuracy.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-blue-100">
                Bank-level encryption and security protocols ensure your data remains private and protected at all times.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analysis</h3>
              <p className="text-blue-100">
                Lightning-fast processing delivers instant results, protecting you from threats as they emerge.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Join Us in Making the Internet Safer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Whether you're an individual looking for protection or an organization wanting to safeguard your users, we're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              Start Free Trial <Sparkles className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">© 2024 ScamShield. All rights reserved.</p>
            <p className="text-sm">
              Made with ❤️ by developers who care about your online safety
            </p>
          </div>
        </div>
      </div>

      {/* Team Member Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedMember.image}
              alt={selectedMember.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"
            />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              {selectedMember.name}
            </h3>
            <p className="text-blue-600 dark:text-blue-400 text-center mb-4">
              {selectedMember.role}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {selectedMember.bio}
            </p>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMember.expertise.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-4">
              {selectedMember.social.github && (
                <a
                  href={selectedMember.social.github}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {selectedMember.social.linkedin && (
                <a
                  href={selectedMember.social.linkedin}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {selectedMember.social.twitter && (
                <a
                  href={selectedMember.social.twitter}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {selectedMember.social.email && (
                <a
                  href={`mailto:${selectedMember.social.email}`}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
