import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Trophy, Target, Flame, Award, TrendingUp, Shield, Activity } from 'lucide-react';
import { badges, achievements } from '../data/mockData';
import { 
  ThreatTrendsChart, 
  ThreatDistributionChart, 
  UserProgressChart, 
  SkillRadarChart,
  CommunityActivityChart,
  LiveThreatFeed 
} from './DashboardCharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  const totalModules = 5;
  const completedModules = Math.floor((user.totalPoints / 150) * 0.6);
  const progressPercentage = (completedModules / totalModules) * 100;

  const earnedBadges = badges.filter(b => user.totalPoints >= b.requirementPoints);
  const nextBadge = badges.find(b => user.totalPoints < b.requirementPoints);

  const completedAchievements = achievements.filter(a => {
    if (a.requirementType === 'points') return user.totalPoints >= a.requirementValue;
    if (a.requirementType === 'modules') return completedModules >= a.requirementValue;
    if (a.requirementType === 'streak') return user.currentStreak >= a.requirementValue;
    return false;
  });

  const getBadgeColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-amber-600 to-amber-800';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-cyan-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t('dashboard.welcome', { username: user.username })}
        </h1>
        <p className="text-gray-600">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{t('dashboard.totalPoints')}</h3>
            <Trophy className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{user.totalPoints}</p>
          <p className="text-xs text-gray-500 mt-1">{t('dashboard.keepLearning')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{t('dashboard.currentLevel')}</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{user.level}</p>
          <p className="text-xs text-gray-500 mt-1">
            {t('dashboard.pointsToNext', { 
              points: 500 - (user.totalPoints % 500), 
              level: user.level + 1 
            })}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{t('dashboard.currentStreak')}</h3>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {t('dashboard.daysStreak', { days: user.currentStreak })}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t('dashboard.maintainStreak')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{t('dashboard.badgesEarned')}</h3>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{earnedBadges.length}</p>
          <p className="text-xs text-gray-500 mt-1">
            {t('dashboard.outOf', { total: badges.length })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t('dashboard.learningProgress')}</h2>
            <Target className="w-6 h-6 text-blue-600" />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{t('dashboard.modulesCompleted')}</span>
              <span className="font-semibold text-gray-800">
                {completedModules} / {totalModules}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 10 && (
                  <span className="text-xs font-bold text-white">
                    {Math.round(progressPercentage)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('dashboard.recentAchievements')}</h3>
            <div className="space-y-2">
              {completedAchievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="bg-green-500 p-2 rounded-full">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{achievement.name}</p>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                  <span className="text-xs font-bold text-green-600">
                    +{achievement.pointsReward} pts
                  </span>
                </div>
              ))}
              {completedAchievements.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  {t('dashboard.completeModules')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t('dashboard.yourBadges')}</h2>

          <div className="space-y-4">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className={`bg-gradient-to-br ${getBadgeColor(badge.tier)} p-4 rounded-lg shadow-md`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-white" />
                  <div>
                    <p className="font-bold text-white">{badge.name}</p>
                    <p className="text-xs text-white/80">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {nextBadge && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-bold text-gray-600">{nextBadge.name}</p>
                    <p className="text-xs text-gray-500">
                      {t('dashboard.morePointsNeeded', { 
                        points: nextBadge.requirementPoints - user.totalPoints 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Visualization Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">{t('dashboard.threatIntelligence')}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ThreatTrendsChart />
          <ThreatDistributionChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <LiveThreatFeed />
          </div>
          <CommunityActivityChart />
        </div>
      </div>

      {/* User Analytics Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">{t('dashboard.yourAnalytics')}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserProgressChart />
          <SkillRadarChart />
        </div>
      </div>
    </div>
  );
}
