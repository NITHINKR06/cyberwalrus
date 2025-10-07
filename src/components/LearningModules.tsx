import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { learningModules, quizzes } from '../data/mockData';
import { BookOpen, CheckCircle, Star, ArrowLeft, ArrowRight } from 'lucide-react';

export default function LearningModules() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const completedModuleIds = new Set<string>();
  if (user) {
    const completed = Math.floor((user.totalPoints / 150) * 0.6);
    for (let i = 0; i < completed && i < learningModules.length; i++) {
      completedModuleIds.add(learningModules[i].id);
    }
  }

  const module = selectedModule ? learningModules.find(m => m.id === selectedModule) : null;
  const moduleQuizzes = module ? quizzes.filter(q => q.moduleId === module.id || q.moduleId === (module as any).difficulty) : [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return t('modules.difficulty.beginner');
      case 'intermediate': return t('modules.difficulty.intermediate');
      case 'advanced': return t('modules.difficulty.advanced');
      default: return difficulty;
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    // @ts-ignore - dynamic import without types
    import('gsap').then(({ gsap }) => {
      gsap.fromTo('.quiz-card', { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
    }).catch(() => {});
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < moduleQuizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalPoints = moduleQuizzes.reduce((sum, q) => sum + q.points, 0);
      setScore(totalPoints);
      setQuizCompleted(true);
    }
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setShowQuiz(false);
    setQuizCompleted(false);
  };

  if (quizCompleted && module) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('modules.quizComplete')}
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            {t('modules.scored', { 
              correct: selectedAnswers.filter((a, i) => a === moduleQuizzes[i].correctAnswer).length, 
              total: moduleQuizzes.length 
            })}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">{t('modules.pointsEarned', { points: score })}</span>
          </div>
          <button
            onClick={handleBackToModules}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('modules.backToModules')}
          </button>
        </div>
      </div>
    );
  }

  if (showQuiz && module) {
    const quiz = moduleQuizzes[currentQuestion];
    const hasAnswered = selectedAnswers[currentQuestion] !== undefined;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowQuiz(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('modules.backToModules')}
            </button>
            <span className="text-sm font-medium text-gray-600">
              {t('modules.question', { current: currentQuestion + 1, total: moduleQuizzes.length })}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{quiz.question}</h2>
            <div className="space-y-3">
              {quiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>

          {hasAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {currentQuestion < moduleQuizzes.length - 1 ? (
                  <>
                    {t('modules.nextQuestion')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  t('modules.completeQuiz')
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (module) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackToModules}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('modules.backToModules')}
        </button>

        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-8 mb-6 quiz-card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{module.title}</h1>
              <p className="text-gray-600">{module.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(module.difficulty)}`}>
              {getDifficultyLabel(module.difficulty)}
            </span>
          </div>

          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: module.content.replace(/\n/g, '<br />') }} />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-700">
                {t('modules.points', { points: module.pointsReward })} available
              </span>
            </div>
            <button
              onClick={handleStartQuiz}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('modules.startQuiz')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('modules.title')}</h1>
        <p className="text-gray-600">
          {t('modules.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((module) => {
          const isCompleted = completedModuleIds.has(module.id);

          return (
            <div
              key={module.id}
              className="bg-white/80 backdrop-blur rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200 overflow-hidden"
              onClick={() => setSelectedModule(module.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                    {getDifficultyLabel(module.difficulty)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {t('modules.points', { points: module.pointsReward })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  {t('modules.quizQuestions', { count: quizzes.filter(q => q.moduleId === module.id || q.moduleId === (module as any).difficulty).length })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
