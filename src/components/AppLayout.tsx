import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Auth from './Auth';
import LanguageSwitcher from './LanguageSwitcher';
import NavDropdown from './NavDropdown';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Shield,
  Search,
  FlaskConical,
  User,
  Settings,
  BarChart3,
  Trophy,
  Target,
  Clock,
  Bell,
  Zap
} from 'lucide-react';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <Auth />;
  }

  // Navigation structure with dropdowns
  const dashboardItems = [
    { id: 'dashboard', name: t('nav.dashboard'), icon: LayoutDashboard, onClick: () => navigate('/dashboard') },
    { id: 'analytics', name: t('nav.analytics', 'Analytics'), icon: BarChart3, onClick: () => navigate('/dashboard') },
  ];

  const achievementsItems = [
    { id: 'achievements', name: t('nav.achievements'), icon: Award, onClick: () => navigate('/achievements') },
    { id: 'leaderboard', name: t('nav.leaderboard'), icon: Trophy, onClick: () => navigate('/achievements') },
    { id: 'goals', name: t('nav.goals', 'Goals & Progress'), icon: Target, onClick: () => navigate('/achievements') },
  ];

  const userMenuItems = [
    { id: 'profile', name: t('nav.profile', 'Profile'), icon: User, onClick: () => navigate('/profile') },
    { id: 'settings', name: t('nav.settings', 'Settings'), icon: Settings, onClick: () => navigate('/settings') },
    { id: 'logout', name: t('nav.logout'), icon: LogOut, onClick: logout },
  ];

  const toolsNavigation = [
    { id: 'analyzer', name: t('nav.scamAnalyzer'), icon: Search, path: '/analyzer' },
    { id: 'sandbox', name: t('nav.securitySandbox', 'Security Sandbox'), icon: FlaskConical, path: '/sandbox' },
    { id: 'timemachine', name: t('nav.timeMachine', 'Time Machine'), icon: Clock, path: '/timemachine' },
    { id: 'report', name: t('nav.reportScam'), icon: AlertTriangle, path: '/report' },
  ] as const;

  const isActiveRoute = (path: string) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div className="min-h-screen bg-midnight-900 relative overflow-x-hidden">
      <div className="bg-pattern" />
      <div className="bg-scanline-overlay" />
      <nav className="navbar-clean sticky top-0 z-50">
        {/* Gradient accent line */}
        <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-400"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-6">
            {/* Logo Section */}
            <div className="flex items-center min-w-fit">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-3 group"
              >
                <div className="logo-gradient p-2 rounded-xl transition-all duration-300">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent hidden sm:block">
                  WALRUS
                </span>
              </button>
            </div>

            {/* Main Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
              {/* Main Menu Dropdown */}
              <NavDropdown
                label={t('nav.menu', 'Menu')}
                icon={Menu}
                items={[
                  { id: 'dashboard', name: t('nav.dashboard'), icon: LayoutDashboard, onClick: () => navigate('/dashboard') },
                  { id: 'analytics', name: t('nav.analytics', 'Analytics'), icon: BarChart3, onClick: () => navigate('/dashboard') },
                  { id: 'learn', name: t('nav.learn'), icon: BookOpen, onClick: () => navigate('/modules') },
                  { id: 'achievements', name: t('nav.achievements'), icon: Award, onClick: () => navigate('/achievements') },
                  { id: 'leaderboard', name: t('nav.leaderboard'), icon: Trophy, onClick: () => navigate('/achievements') },
                  { id: 'goals', name: t('nav.goals', 'Goals & Progress'), icon: Target, onClick: () => navigate('/achievements') },
                ]}
                isActive={isActiveRoute('/dashboard') || isActiveRoute('/modules') || isActiveRoute('/achievements')}
              />
              
              {/* Elegant Separator */}
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600 mx-3"></div>
              
              {/* Tools Navigation */}
              <div className="flex items-center gap-1">
                {toolsNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`${isActiveRoute(item.path) ? 'btn-nav-active' : 'btn-nav'}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Section - User Info & Controls */}
            <div className="flex items-center gap-2 min-w-fit">
              {/* Utility Controls */}
              <div className="flex items-center gap-1">
                <LanguageSwitcher />
                
                {/* Notifications */}
                <button
                  className="btn-utility relative"
                  title={t('nav.notifications', 'Notifications')}
                >
                  <Bell className="w-5 h-5" />
                  <span className="notification-badge"></span>
                </button>
                
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="btn-utility"
                >
                  <span className="text-xl">
                    {isDark ? '🌙' : '☀️'}
                  </span>
                </button>

                {/* User Dropdown */}
                <div className="hidden md:block ml-2">
                  <NavDropdown
                    label={user.username}
                    icon={User}
                    items={userMenuItems}
                    className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 border border-indigo-200 dark:border-indigo-800"
                  />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden btn-utility ml-2"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="px-4 py-3 space-y-2">
              {/* Dashboard Section */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  {t('nav.dashboard')}
                </p>
                <div className="space-y-1">
                  {dashboardItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.onClick();
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 rounded-xl font-medium transition-all px-3 py-2 ${
                          isActiveRoute('/dashboard') ? 'btn-nav-active' : 'btn-nav'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Learning Modules */}
              <div>
                <button
                  onClick={() => {
                    navigate('/modules');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl font-medium transition-all px-3 py-2 ${
                    isActiveRoute('/modules') ? 'btn-nav-active' : 'btn-nav'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>{t('nav.learn')}</span>
                </button>
              </div>

              {/* Achievements Section */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  {t('nav.achievements')}
                </p>
                <div className="space-y-1">
                  {achievementsItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.onClick();
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 rounded-xl font-medium transition-all px-3 py-2 ${
                          isActiveRoute('/achievements') ? 'btn-nav-active' : 'btn-nav'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tools Navigation */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  {t('nav.tools', 'Tools')}
                </p>
                <div className="space-y-1">
                  {toolsNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 rounded-xl font-medium transition-all px-3 py-2 hover:scale-105 ${
                          isActiveRoute(item.path) ? 'btn-nav-active' : 'btn-nav'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  {t('nav.quickActions', 'Quick Actions')}
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      navigate('/analyzer');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 rounded-xl font-medium btn-nav px-3 py-2 hover:scale-105 transition-all"
                  >
                    <Search className="w-5 h-5" />
                    <span>{t('nav.quickAnalysis', 'Quick Analysis')}</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/report');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 rounded-xl font-medium btn-nav px-3 py-2 hover:scale-105 transition-all"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>{t('nav.reportScam')}</span>
                  </button>
                </div>
              </div>

              {/* User Menu */}
              <div className="pt-2 border-t border-glass">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  {t('nav.account', 'Account')}
                </p>
                <div className="space-y-1">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.onClick();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 rounded-xl font-medium btn-nav px-3 py-2"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
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
