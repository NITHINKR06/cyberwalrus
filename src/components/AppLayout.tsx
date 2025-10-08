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
  Target
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
    { id: 'dashboard', name: 'Overview', icon: LayoutDashboard, onClick: () => navigate('/dashboard') },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, onClick: () => navigate('/dashboard') },
  ];

  const achievementsItems = [
    { id: 'achievements', name: 'My Achievements', icon: Award, onClick: () => navigate('/achievements') },
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy, onClick: () => navigate('/achievements') },
    { id: 'goals', name: 'Goals & Progress', icon: Target, onClick: () => navigate('/achievements') },
  ];

  const userMenuItems = [
    { id: 'profile', name: 'Profile', icon: User, onClick: () => navigate('/profile') },
    { id: 'settings', name: 'Settings', icon: Settings, onClick: () => navigate('/settings') },
    { id: 'logout', name: 'Logout', icon: LogOut, onClick: logout },
  ];

  const toolsNavigation = [
    { id: 'analyzer', name: t('nav.scamAnalyzer'), icon: Search, path: '/analyzer' },
    { id: 'sandbox', name: 'Security Sandbox', icon: FlaskConical, path: '/sandbox' },
    { id: 'report', name: t('nav.reportScam'), icon: AlertTriangle, path: '/report' },
  ] as const;

  const isActiveRoute = (path: string) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div className="min-h-screen bg-midnight-900 relative overflow-x-hidden">
      <div className="bg-pattern" />
      <div className="bg-scanline-overlay" />
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-glass bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(15,23,42,0.7)]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-300">WALRUS</span>
              </div>
            </div>

            {/* Main Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Dashboard Dropdown */}
              <NavDropdown
                label="Dashboard"
                icon={LayoutDashboard}
                items={dashboardItems}
                isActive={isActiveRoute('/dashboard')}
              />
              
              {/* Learning Modules */}
              <button
                onClick={() => navigate('/modules')}
                className={`${isActiveRoute('/modules') ? 'btn-nav-active' : 'btn-nav'} min-w-0`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden xl:inline">{t('nav.learn')}</span>
              </button>

              {/* Achievements Dropdown */}
              <NavDropdown
                label="Achievements"
                icon={Award}
                items={achievementsItems}
                isActive={isActiveRoute('/achievements')}
              />
              
              {/* Separator */}
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>
              
              {/* Tools Navigation Group */}
              <div className="flex items-center gap-1">
                {toolsNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`${isActiveRoute(item.path) ? 'btn-nav-active' : 'btn-nav'} min-w-0`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Section - User Info & Controls */}
            <div className="flex items-center gap-3">
              {/* Utility Controls */}
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="p-2 rounded-xl border border-glass bg-white/5 text-gray-900 dark:text-white hover:bg-white/10 transition-colors"
                >
                  {isDark ? '🌙' : '🌞'}
                </button>

                {/* User Dropdown */}
                <div className="hidden md:block">
                  <NavDropdown
                    label={user.username}
                    icon={User}
                    items={userMenuItems}
                    className="min-w-0"
                  />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl text-gray-900 dark:text-white bg-white/5 border border-glass hover:bg-white/10 transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-glass bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(15,23,42,0.85)] backdrop-blur-md">
            <div className="px-4 py-3 space-y-3">
              {/* Dashboard Section */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Dashboard
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
                  Achievements
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
                  Tools
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
                        className={`w-full flex items-center gap-3 rounded-xl font-medium transition-all px-3 py-2 ${
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

              {/* User Menu */}
              <div className="pt-2 border-t border-glass">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Account
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
