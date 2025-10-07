import { createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Auth from '../components/Auth';
import Dashboard from '../components/Dashboard';
import LearningModules from '../components/LearningModules';
import Achievements from '../components/Achievements';
import ReportScam from '../components/ReportScam';
import ScamAnalyzer from '../components/ScamAnalyzer';
import SecuritySandbox from '../components/SecuritySandbox';
import UserProfile from '../components/UserProfile';
import Settings from '../components/Settings';
import AppLayout from '../components/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider><AppLayout /></AuthProvider>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'modules',
        element: <LearningModules />,
      },
      {
        path: 'achievements',
        element: <Achievements />,
      },
      {
        path: 'report',
        element: <ReportScam />,
      },
      {
        path: 'analyzer',
        element: <ScamAnalyzer />,
      },
      {
        path: 'sandbox',
        element: <SecuritySandbox />,
      },
      {
        path: 'profile',
        element: <UserProfile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);
