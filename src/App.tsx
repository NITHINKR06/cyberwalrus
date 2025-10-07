import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import LearningModules from './components/LearningModules';
import Achievements from './components/Achievements';
import Leaderboard from './components/Leaderboard';
import ReportScam from './components/ReportScam';
import ScamAnalyzer from './components/ScamAnalyzer';
import LanguageSwitcher from './components/LanguageSwitcher';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Trophy,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Shield,
  Search
} from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<'dashboard' | 'modules' | 'achievements' | 'leaderboard' | 'report' | 'analyzer'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <Auth />;
  }

  const navigation = [
    { id: 'dashboard', name: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'modules', name: t('nav.learn'), icon: BookOpen },
    { id: 'achievements', name: t('nav.achievements'), icon: Award },
    { id: 'leaderboard', name: t('nav.leaderboard'), icon: Trophy },
    { id: 'report', name: t('nav.reportScam'), icon: AlertTriangle },
    { id: 'analyzer', name: t('nav.scamAnalyzer'), icon: Search },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">WALRUS</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-600">{t('common.level', { level: user.level })}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'modules' && <LearningModules />}
        {currentView === 'achievements' && <Achievements />}
        {currentView === 'leaderboard' && <Leaderboard />}
        {currentView === 'report' && <ReportScam />}
        {currentView === 'analyzer' && <ScamAnalyzer />}
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
        theme="light"
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
