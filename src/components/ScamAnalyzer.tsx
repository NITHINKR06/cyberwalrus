import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Loader2,
    Globe,
    MessageSquare,
    TrendingUp,
    AlertCircle,
    Info
} from 'lucide-react';
import { analyzeContent } from '../services/backendApi'; // UPDATED IMPORT
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AnalysisResult {
    threatLevel: 'safe' | 'suspicious' | 'dangerous';
    confidence: number;
    indicators: string[];
    recommendations: string[];
}

export default function ScamAnalyzer() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
    const [textInput, setTextInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // REFACTORED: Unified analysis handler
    const handleAnalysis = async (type: 'text' | 'url', content: string) => {
        if (!content.trim()) return;

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            const response = await analyzeContent(type, content);
            const analysisResult = response.analysisResult;
            setResult(analysisResult);

            console.log(analysisResult, 'Analysis Result');

            // Show toast notification based on threat level
            if (analysisResult.threatLevel === 'dangerous') {
                toast.error('⚠️ High threat detected! Please be extremely cautious.', {
                    position: "top-center",
                    autoClose: 5000,
                });
            } else if (analysisResult.threatLevel === 'suspicious') {
                toast.warning('⚠️ Suspicious content detected. Proceed with caution.', {
                    position: "top-center",
                    autoClose: 4000,
                });
            } else {
                toast.success('✅ Content appears safe, but always stay vigilant!', {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.error(`Error analyzing ${type}:`, err);
            setError(`Failed to analyze ${type}. Please try again.`);
            toast.error(`Analysis failed. There was a server error.`, {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getThreatLevelColor = (level: string) => {
        switch (level) {
            case 'safe': return 'text-green-600 bg-green-50 border-green-200';
            case 'suspicious': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'dangerous': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getThreatLevelIcon = (level: string) => {
        switch (level) {
            case 'safe': return <CheckCircle className="w-8 h-8 text-green-600" />;
            case 'suspicious': return <AlertCircle className="w-8 h-8 text-yellow-600" />;
            case 'dangerous': return <XCircle className="w-8 h-8 text-red-600" />;
            default: return <Shield className="w-8 h-8 text-gray-600" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* ... JSX for title and subtitle remains the same ... */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {t('scamAnalyzer.title')}
              </h1>
              <p className="text-gray-600">
                {t('scamAnalyzer.subtitle')}
              </p>
            </div>


            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                            activeTab === 'text'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        {t('scamAnalyzer.analyzeText')}
                    </button>
                    <button
                        onClick={() => setActiveTab('url')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                            activeTab === 'url'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Globe className="w-5 h-5" />
                        {t('scamAnalyzer.analyzeUrl')}
                    </button>
                </div>

                {activeTab === 'text' ? (
                    <div>
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder={t('scamAnalyzer.textPlaceholder')}
                            className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <button
                            onClick={() => handleAnalysis('text', textInput)}
                            disabled={!textInput.trim() || isAnalyzing}
                            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t('scamAnalyzer.analyzing')}
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    {t('scamAnalyzer.analyze')}
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div>
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder={t('scamAnalyzer.urlPlaceholder')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => handleAnalysis('url', urlInput)}
                            disabled={!urlInput.trim() || isAnalyzing}
                            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t('scamAnalyzer.analyzing')}
                                </>
                            ) : (
                                <>
                                    <Globe className="w-5 h-5" />
                                    {t('scamAnalyzer.checkUrl')}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            {result && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {t('scamAnalyzer.results')}
                    </h2>

                    <div className={`border-2 rounded-lg p-6 mb-6 ${getThreatLevelColor(result.threatLevel)}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {getThreatLevelIcon(result.threatLevel)}
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {t('scamAnalyzer.threatLevel')}
                                    </p>
                                    <p className="text-2xl font-bold capitalize">
                                        {t(`scamAnalyzer.${result.threatLevel}`)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-600">
                                    {t('scamAnalyzer.confidence')}
                                </p>
                                <p className="text-2xl font-bold">{result.confidence}%</p>
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    result.threatLevel === 'safe' ? 'bg-green-500' :
                                    result.threatLevel === 'suspicious' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${result.confidence}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                {t('scamAnalyzer.indicators')}
                            </h3>
                            <ul className="space-y-2">
                                {result.indicators.map((indicator, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-orange-500 mt-1">•</span>
                                        {indicator}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                {t('scamAnalyzer.recommendations')}
                            </h3>
                            <ul className="space-y-2">
                                {result.recommendations.map((recommendation, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-blue-500 mt-1">✓</span>
                                        {recommendation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {t('scamAnalyzer.aiPowered')}
                        </p>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}