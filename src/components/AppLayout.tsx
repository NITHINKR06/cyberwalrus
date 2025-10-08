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
      <nav className="sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 shadow-sm">
        {/* Status Bar */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-400"></div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-shrink-0 flex items-center gap-3 hover:scale-105 transition-transform duration-200 group"
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-300 group-hover:from-indigo-500 group-hover:via-cyan-400 group-hover:to-teal-400 transition-all duration-200">
                  WALRUS
                </span>
              </button>
            </div>

            {/* Main Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Dashboard Dropdown */}
              <NavDropdown
                label={t('nav.dashboard')}
                icon={LayoutDashboard}
                items={dashboardItems}
                isActive={isActiveRoute('/dashboard')}
              />
              
              {/* Learning Modules */}
              <button
                onClick={() => navigate('/modules')}
                className={`${isActiveRoute('/modules') ? 'btn-nav-active' : 'btn-nav'} hover:scale-105 transition-all duration-200`}
              >
                <BookOpen className="w-5 h-5" />
                <span>{t('nav.learn')}</span>
              </button>

              {/* Achievements Dropdown */}
              <NavDropdown
                label={t('nav.achievements')}
                icon={Award}
                items={achievementsItems}
                isActive={isActiveRoute('/achievements')}
              />
              
              {/* Separator */}
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-3"></div>
              
              {/* Tools Navigation Group */}
              <div className="flex items-center gap-2">
                {toolsNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`${isActiveRoute(item.path) ? 'btn-nav-active' : 'btn-nav'} hover:scale-105 transition-all duration-200 group`}
                    >
                      <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Section - User Info & Controls */}
            <div className="flex items-center gap-4">
              {/* Quick Search */}
              <div className="hidden lg:block">
                <button
                  onClick={() => navigate('/analyzer')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 group"
                  title={t('nav.quickAnalysis', 'Quick Analysis')}
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden xl:inline text-sm font-medium">Quick Search</span>
                </button>
              </div>

              {/* Utility Controls */}
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                
                {/* Notifications */}
                <button
                  className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 group relative"
                  title={t('nav.notifications', 'Notifications')}
                >
                  <Bell className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 group"
                >
                  <span className="group-hover:rotate-180 transition-transform duration-300 text-lg">
                    {isDark ? '🌙' : '🌞'}
                  </span>
                </button>

                {/* User Dropdown */}
                <div className="hidden md:block">
                  <NavDropdown
                    label={user.username}
                    icon={User}
                    items={userMenuItems}
                    className="hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 group"
                >
                  <span className="group-hover:rotate-90 transition-transform duration-200">
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 space-y-3">
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
