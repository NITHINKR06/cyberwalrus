import { useState, useRef } from 'react';
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
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { analyzeContent, ocrService } from '../services/backendApi';
import { toast } from 'react-toastify';

interface AnalysisResult {
  threatLevel: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  indicators: string[];
  recommendations: string[];
  summary?: string;
  ocrConfidence?: number;
  extractedText?: string;
}

export default function ScamAnalyzer() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'image'>('text');
  const [textInput, setTextInput] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // For image upload
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalysis = async (type: 'text' | 'url', content: string) => {
    if (!content || !content.trim()) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeContent(type, content);
      const analysisResult = response.analysisResult;
      setResult(analysisResult);

      if (analysisResult.threatLevel === 'dangerous') {
        toast.error('⚠️ High threat detected! Please be extremely cautious.');
      } else if (analysisResult.threatLevel === 'suspicious') {
        toast.warning('⚠️ Suspicious content detected. Proceed with caution.');
      } else {
        toast.success('✅ Content appears safe, but always stay vigilant!');
      }
    } catch (err) {
      console.error(`Error analyzing ${type}:`, err);
      setError(`Failed to analyze ${type}. Please try again.`);
      toast.error(`Analysis failed. There was a server error.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Extract text from image using OCR
      const response = await ocrService.uploadImage(selectedImage);
      const extractedText = response.text;
      
      if (!extractedText || !extractedText.trim()) {
        toast.warning('No text found in the image. Please try with a different image.');
        return;
      }

      // Step 2: Populate the text area and switch to text tab
      setTextInput(extractedText);
      setActiveTab('text');
      toast.success('Text extracted! Analyzing for scam indicators...');

      // Step 3: Automatically analyze the extracted text
      const analysisResponse = await analyzeContent('text', extractedText);
      const analysisResult = analysisResponse.analysisResult;
      
      // Add OCR confidence info to the result
      analysisResult.ocrConfidence = response.confidence;
      analysisResult.extractedText = extractedText;
      
      setResult(analysisResult);
      
      // Show appropriate toast based on threat level
      if (analysisResult.threatLevel === 'dangerous') {
        toast.error('⚠️ High threat detected! Please be extremely cautious.');
      } else if (analysisResult.threatLevel === 'suspicious') {
        toast.warning('⚠️ Suspicious content detected. Please review the analysis.');
      } else {
        toast.success('✅ Content appears safe based on analysis.');
      }

    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Please try again.');
      toast.error('Image processing failed.');
    } finally {
      setIsProcessing(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('scamAnalyzer.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('scamAnalyzer.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('text')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            <MessageSquare className="w-5 h-5" /> {t('scamAnalyzer.analyzeText')}
          </button>
          <button onClick={() => setActiveTab('url')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            <Globe className="w-5 h-5" /> {t('scamAnalyzer.analyzeUrl')}
          </button>
          <button onClick={() => setActiveTab('image')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            <ImageIcon className="w-5 h-5" /> Analyze Image
          </button>
        </div>

        {activeTab === 'text' && (
          <div>
            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder={t('scamAnalyzer.textPlaceholder')} className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
            <button onClick={() => handleAnalysis('text', textInput || '')} disabled={!(textInput || '').trim() || isProcessing} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isProcessing ? (<><Loader2 className="w-5 h-5 animate-spin" />{t('scamAnalyzer.analyzing')}</>) : (<><Shield className="w-5 h-5" />{t('scamAnalyzer.analyze')}</>)}
            </button>
          </div>
        )}
        
        {activeTab === 'url' && (
          <div>
            <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder={t('scamAnalyzer.urlPlaceholder')} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <button onClick={() => handleAnalysis('url', urlInput || '')} disabled={!(urlInput || '').trim() || isProcessing} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isProcessing ? (<><Loader2 className="w-5 h-5 animate-spin" />{t('scamAnalyzer.analyzing')}</>) : (<><Globe className="w-5 h-5" />{t('scamAnalyzer.checkUrl')}</>)}
            </button>
          </div>
        )}

        {activeTab === 'image' && (
          <div>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Selected preview" className="h-full w-full object-contain rounded-lg" />
              ) : (
                <div className="text-center text-gray-500">
                  <Upload className="w-10 h-10 mx-auto mb-2" />
                  <p>Click to upload an image</p>
                  <p className="text-xs">(PNG, JPG, etc.)</p>
                </div>
              )}
            </div>
            <button onClick={handleImageUpload} disabled={!selectedImage || isProcessing} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isProcessing ? (<><Loader2 className="w-5 h-5 animate-spin" />Processing Image...</>) : (<>Extract & Analyze Image</>)}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{t('scamAnalyzer.results')}</h2>
          <div className={`border-2 rounded-lg p-6 mb-6 ${getThreatLevelColor(result.threatLevel)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getThreatLevelIcon(result.threatLevel)}
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('scamAnalyzer.threatLevel')}</p>
                  <p className="text-2xl font-bold capitalize">{t(`scamAnalyzer.${result.threatLevel}`)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">{t('scamAnalyzer.confidence')}</p>
                <p className="text-2xl font-bold">{result.confidence}%</p>
                {result.ocrConfidence && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">OCR Confidence</p>
                    <p className="text-sm font-medium">{(result.ocrConfidence * 100).toFixed(1)}%</p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-full rounded-full transition-all duration-500 ${result.threatLevel === 'safe' ? 'bg-green-500' : result.threatLevel === 'suspicious' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${result.confidence}%` }} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" /> {t('scamAnalyzer.indicators')}</h3>
              <ul className="space-y-2">
                {result.indicators.map((indicator, index) => (<li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><span className="text-orange-500 mt-1">•</span> {indicator}</li>))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-500" /> {t('scamAnalyzer.recommendations')}</h3>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (<li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><span className="text-blue-500 mt-1">✓</span> {recommendation}</li>))}
              </ul>
            </div>
          </div>
          
          {result.extractedText && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <p className="text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Extracted Text from Image</p>
              <div className="mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {result.extractedText}
              </div>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center gap-2"><Shield className="w-4 h-4" /> {result.summary ? 'AI Summary' : t('scamAnalyzer.aiPowered')}</p>
            {result.summary && <p className="text-sm text-blue-900 mt-2 whitespace-pre-wrap">{result.summary}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

