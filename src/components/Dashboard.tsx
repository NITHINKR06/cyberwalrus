import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
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
  // Subtle entrance animations
  useEffect(() => {
    let isMounted = true;
    // @ts-ignore - dynamic import without types
    import('gsap').then(({ gsap }) => {
      if (!isMounted) return;
      gsap.to('.dash-fade-up', { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' });
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

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
        <h1 className="section-title mb-2">
          {t('dashboard.welcome', { username: user.username })}
        </h1>
        <p className="text-slate-400">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="dash-fade-up opacity-0 translate-y-3 glass-card p-6 border-l-4 border-indigo-500/80">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300">{t('dashboard.totalPoints')}</h3>
            <Trophy className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{user.totalPoints}</p>
          <p className="text-xs text-slate-400 mt-1">{t('dashboard.keepLearning')}</p>
        </div>

        <div className="dash-fade-up opacity-0 translate-y-3 glass-card p-6 border-l-4 border-emerald-500/80">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300">{t('dashboard.currentLevel')}</h3>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{user.level}</p>
          <p className="text-xs text-slate-400 mt-1">
            {t('dashboard.pointsToNext', { 
              points: 500 - (user.totalPoints % 500), 
              level: user.level + 1 
            })}
          </p>
        </div>

        <div className="dash-fade-up opacity-0 translate-y-3 glass-card p-6 border-l-4 border-orange-500/80">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300">{t('dashboard.currentStreak')}</h3>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {t('dashboard.daysStreak', { days: user.currentStreak })}
          </p>
          <p className="text-xs text-slate-400 mt-1">{t('dashboard.maintainStreak')}</p>
        </div>

        <div className="dash-fade-up opacity-0 translate-y-3 glass-card p-6 border-l-4 border-purple-500/80">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300">{t('dashboard.badgesEarned')}</h3>
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{earnedBadges.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            {t('dashboard.outOf', { total: badges.length })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{t('dashboard.learningProgress')}</h2>
            <Target className="w-6 h-6 text-indigo-400" />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">{t('dashboard.modulesCompleted')}</span>
              <span className="font-semibold text-white">
                {completedModules} / {totalModules}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden border border-glass">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 shadow-neon"
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

          <div className="mt-6 pt-6 border-t border-glass">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">{t('dashboard.recentAchievements')}</h3>
            <div className="space-y-2">
              {completedAchievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-400/30"
                >
                  <div className="bg-emerald-500 p-2 rounded-full">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{achievement.name}</p>
                    <p className="text-xs text-slate-300">{achievement.description}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-300">
                    +{achievement.pointsReward} pts
                  </span>
                </div>
              ))}
              {completedAchievements.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">
                  {t('dashboard.completeModules')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">{t('dashboard.yourBadges')}</h2>

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
              <div className="border-2 border-dashed border-white/20 rounded-lg p-4 bg-white/5">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-slate-300" />
                  <div>
                    <p className="font-bold text-slate-200">{nextBadge.name}</p>
                    <p className="text-xs text-slate-400">
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
          <Shield className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">{t('dashboard.threatIntelligence')}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card"><ThreatTrendsChart /></div>
          <div className="card"><ThreatDistributionChart /></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 card">
            <LiveThreatFeed />
          </div>
          <div className="card"><CommunityActivityChart /></div>
        </div>
      </div>

      {/* User Analytics Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">{t('dashboard.yourAnalytics')}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card"><UserProgressChart /></div>
          <div className="card"><SkillRadarChart /></div>
        </div>
      </div>
    </div>
  );
}
