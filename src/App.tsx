import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import LearningModules from './components/LearningModules';
import Achievements from './components/Achievements';
// import Leaderboard from './components/Leaderboard';
import ReportScam from './components/ReportScam';
import ScamAnalyzer from './components/ScamAnalyzer';
import SecuritySandbox from './components/SecuritySandbox'; // 1. IMPORT THE NEW COMPONENT
import LanguageSwitcher from './components/LanguageSwitcher';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  // Trophy,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Shield,
  Search,
  FlaskConical // Icon for the sandbox
} from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  // Add the new view to the type definition
  const [currentView, setCurrentView] = useState<'dashboard' | 'modules' | 'achievements' | 'leaderboard' | 'report' | 'analyzer' | 'sandbox'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  if (!user) {
    return <Auth />;
  }

  const navigation = [
    { id: 'dashboard', name: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'modules', name: t('nav.learn'), icon: BookOpen },
    { id: 'achievements', name: t('nav.achievements'), icon: Award },
    { id: 'report', name: t('nav.reportScam'), icon: AlertTriangle },
    { id: 'analyzer', name: t('nav.scamAnalyzer'), icon: Search },
    // 2. ADD NAVIGATION ITEM FOR THE SANDBOX
    { id: 'sandbox', name: 'Security Sandbox', icon: FlaskConical },
  ] as const;

  return (
    <div className="min-h-screen bg-midnight-900 relative overflow-x-hidden">
      <div className="bg-pattern" />
      <div className="bg-scanline-overlay" />
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-glass bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(15,23,42,0.7)]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-300">WALRUS</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`${currentView === item.id ? 'btn-nav-active' : 'btn-nav'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-glass rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{t('common.level', { level: user.level })}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="hidden md:flex items-center gap-2 btn-nav"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-gray-900 dark:text-white bg-white/5 border border-glass"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setIsDark(v => !v)}
                aria-label="Toggle theme"
                className="p-2 rounded-xl border border-glass bg-white/5 text-gray-900 dark:text-white hover:bg-white/10"
              >
                {isDark ? '🌙' : '🌞'}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-glass bg-[rgba(15,23,42,0.85)] backdrop-blur-md">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-xl font-medium transition-all ${
                      currentView === item.id ? 'btn-nav-active' : 'btn-nav'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 rounded-xl font-medium btn-nav"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'modules' && <LearningModules />}
        {currentView === 'achievements' && <Achievements />}
        {currentView === 'report' && <ReportScam />}
        {currentView === 'analyzer' && <ScamAnalyzer />}
        {/* 3. ADD THE SANDBOX COMPONENT TO THE VIEW */}
        {currentView === 'sandbox' && <SecuritySandbox />}
      </main>
      
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;