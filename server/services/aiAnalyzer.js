import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class AIAnalyzerService {
  constructor() {
    this.huggingFaceToken = process.env.HUGGINGFACE_API_KEY;
    this.googleSafeBrowsingKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
  }

  // Analyze text using Hugging Face
  async analyzeTextWithHuggingFace(text) {
    try {
      if (!this.huggingFaceToken) {
        console.log('Hugging Face API key not configured');
        return this.fallbackTextAnalysis(text);
      }

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/unitary/toxic-bert',
        { inputs: text },
        {
          headers: {
            'Authorization': `Bearer ${this.huggingFaceToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Process Hugging Face response
      const results = response.data[0];
      const toxicityScore = results.find(r => r.label === 'TOXIC')?.score || 0;
      const severityScore = results.find(r => r.label === 'SEVERE_TOXIC')?.score || 0;
      
      // Determine threat level based on scores
      let threatLevel = 'safe';
      if (severityScore > 0.7 || toxicityScore > 0.8) {
        threatLevel = 'dangerous';
      } else if (toxicityScore > 0.5) {
        threatLevel = 'suspicious';
      }

      return {
        threatLevel,
        confidence: Math.round((Math.max(toxicityScore, severityScore) * 100)),
        scores: {
          toxicity: toxicityScore,
          severity: severityScore
        },
        source: 'huggingface'
      };
    } catch (error) {
      console.log('Hugging Face API error:', error.message);
      return this.fallbackTextAnalysis(text);
    }
  }

  // Analyze URL using Google Safe Browsing API
  async analyzeUrlWithGoogleSafeBrowsing(url) {
    try {
      if (!this.googleSafeBrowsingKey) {
        console.log('Google Safe Browsing API key not configured');
        return this.fallbackUrlAnalysis(url);
      }

      const response = await axios.post(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.googleSafeBrowsingKey}`,
        {
          client: {
            clientId: 'walrus-app',
            clientVersion: '1.0.0'
          },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }]
          }
        }
      );

      // Process Google Safe Browsing response
      if (response.data.matches && response.data.matches.length > 0) {
        const threats = response.data.matches;
        const threatTypes = threats.map(t => t.threatType);
        
        return {
          threatLevel: 'dangerous',
          confidence: 95,
          threats: threatTypes,
          details: threats,
          source: 'google_safe_browsing'
        };
      }

      return {
        threatLevel: 'safe',
        confidence: 90,
        threats: [],
        source: 'google_safe_browsing'
      };
    } catch (error) {
      console.log('Google Safe Browsing API error:', error.message);
      return this.fallbackUrlAnalysis(url);
    }
  }

  // Generate summary using Gemini AI
  async generateSummaryWithGemini(analysisData) {
    try {
      if (!this.geminiApiKey) {
        console.log('Gemini API key not configured');
        return this.generateFallbackSummary(analysisData);
      }

      const prompt = `
        Based on the following security analysis results, provide a concise summary and recommendations:
        
        Input Type: ${analysisData.inputType}
        Threat Level: ${analysisData.threatLevel}
        Confidence: ${analysisData.confidence}%
        ${analysisData.threats ? `Threats Found: ${analysisData.threats.join(', ')}` : ''}
        ${analysisData.indicators ? `Indicators: ${analysisData.indicators.join(', ')}` : ''}
        
        Please provide:
        1. A brief summary of the findings
        2. Key risks identified
        3. Recommended actions for the user
        
        Keep the response concise and user-friendly.
      `;

      // UPDATED: Changed model from gemini-pro to gemini-2.5-flash for better reliability
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }
      );

      const summary = response.data.candidates[0]?.content?.parts[0]?.text;
      return summary || this.generateFallbackSummary(analysisData);
    } catch (error) {
      console.log('Gemini API error:', error.message);
      return this.generateFallbackSummary(analysisData);
    }
  }

  // Fallback analysis for text (when APIs are not available)
  fallbackTextAnalysis(text) {
    const lowerText = text.toLowerCase();
    const scamKeywords = [
      'urgent', 'act now', 'verify account', 'suspended',
      'congratulations', 'winner', 'prize', 'lottery',
      'transfer funds', 'processing fee'
    ];

    const foundKeywords = scamKeywords.filter(keyword => lowerText.includes(keyword));
    const threatLevel = foundKeywords.length > 2 ? 'dangerous' : 
                       foundKeywords.length > 0 ? 'suspicious' : 'safe';

    return {
      threatLevel,
      confidence: 70,
      keywords: foundKeywords,
      source: 'fallback'
    };
  }

  // Fallback analysis for URLs
  fallbackUrlAnalysis(url) {
    const suspiciousDomains = ['bit.ly', 'tinyurl', 'goo.gl'];
    const isSuspicious = suspiciousDomains.some(domain => url.includes(domain));

    return {
      threatLevel: isSuspicious ? 'suspicious' : 'safe',
      confidence: 60,
      threats: isSuspicious ? ['URL_SHORTENER'] : [],
      source: 'fallback'
    };
  }

  // Generate fallback summary
  generateFallbackSummary(analysisData) {
    const { threatLevel, confidence, indicators = [] } = analysisData;
    
    let summary = '';
    if (threatLevel === 'dangerous') {
      summary = `⚠️ HIGH RISK DETECTED: This content shows strong indicators of being a scam or malicious. `;
      summary += `We detected ${indicators.length} warning signs with ${confidence}% confidence. `;
      summary += `DO NOT interact with this content and report it to authorities.`;
    } else if (threatLevel === 'suspicious') {
      summary = `⚠️ CAUTION ADVISED: This content has some suspicious characteristics. `;
      summary += `We found ${indicators.length} potential warning signs. `;
      summary += `Verify the source through official channels before proceeding.`;
    } else {
      summary = `✅ APPEARS SAFE: No immediate threats detected in this content. `;
      summary += `However, always remain vigilant and verify information through official sources.`;
    }

    return summary;
  }

  // Main analysis function
  async analyze(inputType, inputContent) {
    let analysisResult = {
      inputType,
      threatLevel: 'safe',
      confidence: 0,
      indicators: [],
      recommendations: [],
      summary: ''
    };

    try {
      if (inputType === 'url') {
        // Analyze URL with Google Safe Browsing
        const urlAnalysis = await this.analyzeUrlWithGoogleSafeBrowsing(inputContent);
        analysisResult = { ...analysisResult, ...urlAnalysis };
        
        // Add URL-specific recommendations
        analysisResult.recommendations = [
          'Always verify URLs before clicking',
          'Look for HTTPS and valid SSL certificates',
          'Check the domain carefully for typos'
        ];
      } else {
        // Analyze text with Hugging Face
        const textAnalysis = await this.analyzeTextWithHuggingFace(inputContent);
        analysisResult = { ...analysisResult, ...textAnalysis };
        
        // Add text-specific recommendations
        analysisResult.recommendations = [
          'Never share passwords or sensitive information',
          'Verify sender identity through official channels',
          'Be suspicious of unsolicited messages'
        ];
      }

      // Generate indicators based on analysis
      if (analysisResult.threatLevel === 'dangerous') {
        analysisResult.indicators.push('High risk content detected');
        if (analysisResult.threats) {
          analysisResult.indicators.push(...analysisResult.threats);
        }
      } else if (analysisResult.threatLevel === 'suspicious') {
        analysisResult.indicators.push('Potentially suspicious content');
      } else {
        analysisResult.indicators.push('No immediate threats detected');
      }

      // Generate AI summary
      analysisResult.summary = await this.generateSummaryWithGemini(analysisResult);

      // Add threat-level specific recommendations
      if (analysisResult.threatLevel === 'dangerous') {
        analysisResult.recommendations.unshift('⚠️ HIGH RISK: Do not interact with this content');
        analysisResult.recommendations.push('Report this to relevant authorities');
      } else if (analysisResult.threatLevel === 'suspicious') {
        analysisResult.recommendations.unshift('⚠️ CAUTION: Verify before proceeding');
      } else {
        analysisResult.recommendations.unshift('✓ Appears safe, but always remain vigilant');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      // Use fallback analysis
      if (inputType === 'url') {
        const fallback = this.fallbackUrlAnalysis(inputContent);
        analysisResult = { ...analysisResult, ...fallback };
      } else {
        const fallback = this.fallbackTextAnalysis(inputContent);
        analysisResult = { ...analysisResult, ...fallback };
      }
      analysisResult.summary = this.generateFallbackSummary(analysisResult);
    }

    return analysisResult;
  }
}

export default new AIAnalyzerService();
