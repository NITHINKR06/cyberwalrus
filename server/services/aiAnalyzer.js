import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class AIAnalyzerService {
  constructor() {
    this.huggingFaceToken = process.env.HUGGINGFACE_API_KEY;
    this.googleSafeBrowsingKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY || 'key';
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

      const results = response.data[0];
      const toxicityScore = results.find(r => r.label === 'TOXIC')?.score || 0;
      const severityScore = results.find(r => r.label === 'SEVERE_TOXIC')?.score || 0;
      
      // --- NEW CONFIDENCE LOGIC ---
      const DANGEROUS_THRESHOLD = 0.8;
      const SUSPICIOUS_THRESHOLD = 0.4;
      
      // Give more weight to severe toxicity
      const weightedScore = (toxicityScore * 0.6) + (severityScore * 1.0);

      let threatLevel = 'safe';
      let confidence = 0;

      if (weightedScore >= DANGEROUS_THRESHOLD) {
        threatLevel = 'dangerous';
        // Confidence scales from 85% to 99% within the dangerous range
        confidence = 85 + (weightedScore - DANGEROUS_THRESHOLD) * 25;
      } else if (weightedScore >= SUSPICIOUS_THRESHOLD) {
        threatLevel = 'suspicious';
        // Confidence scales from 70% to 84% within the suspicious range
        const range = DANGEROUS_THRESHOLD - SUSPICIOUS_THRESHOLD;
        confidence = 70 + ((weightedScore - SUSPICIOUS_THRESHOLD) / range) * 14;
      } else {
        threatLevel = 'safe';
        // Confidence is higher for lower scores (e.g., 0 score = 100% confidence it's safe)
        confidence = 100 - (weightedScore / SUSPICIOUS_THRESHOLD) * 20;
      }
      
      return {
        threatLevel,
        confidence: Math.round(Math.min(confidence, 99)), // Cap confidence at 99%
        scores: {
          toxicity: toxicityScore,
          severity: severityScore,
          weightedScore: weightedScore
        },
        source: 'huggingface'
      };
      // --- END OF NEW LOGIC ---

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
      if (!this.geminiApiKey || this.geminiApiKey === 'key') {
        console.log('Gemini API key not properly configured');
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

      console.log('Calling Gemini API with key:', this.geminiApiKey.substring(0, 10) + '...');

      // Using the standard and basic 'gemini-1.0-pro' model
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Gemini API response:', response.data);

      if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
        const summary = response.data.candidates[0].content.parts[0]?.text;
        return summary || this.generateFallbackSummary(analysisData);
      } else {
        console.log('Unexpected Gemini API response structure:', response.data);
        return this.generateFallbackSummary(analysisData);
      }
    } catch (error) {
      console.log('Gemini API error:', error.response?.data || error.message);
      return this.generateFallbackSummary(analysisData);
    }
  }

  // ADD THIS NEW FUNCTION to aiAnalyzer.js

  // Intentionally vulnerable analyzer for demonstration purposes
  async analyzeWithWeakPrompt(inputType, inputContent) {
    let analysisResult;
    // Perform the initial analysis (this part is the same)
    if (inputType === 'url') {
        analysisResult = await this.analyzeUrlWithGoogleSafeBrowsing(inputContent);
    } else {
        analysisResult = await this.analyzeTextWithHuggingFace(inputContent);
    }

    // WEAK PROMPT: Directly includes user input without protection
    const weakPrompt = `
      Summarize the following analysis. The user's original text was: "${inputContent}"
      
      Analysis data:
      - Threat Level: ${analysisResult.threatLevel}
      - Confidence: ${analysisResult.confidence}%
    `;

    try {
        if (!this.geminiApiKey || this.geminiApiKey === 'key') {
            analysisResult.summary = "⚠️ VULNERABLE AI: This is a demonstration of how an unsecured AI system responds to prompt injection attacks. The system directly includes user input in the prompt without protection, making it susceptible to manipulation.";
            return { analysisResult };
        }

        console.log('Calling Gemini API (vulnerable) with key:', this.geminiApiKey.substring(0, 10) + '...');

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${this.geminiApiKey}`, {
                contents: [{ parts: [{ text: weakPrompt }] }]
            },
            {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Gemini API response (vulnerable):', response.data);

        if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
            analysisResult.summary = response.data.candidates[0].content.parts[0]?.text || "Failed to get vulnerable summary.";
        } else {
            analysisResult.summary = "⚠️ VULNERABLE AI: This demonstrates how an unsecured AI system can be manipulated. The system failed to properly analyze the malicious input.";
        }
    } catch (error) {
        console.log('Gemini API error (vulnerable):', error.response?.data || error.message);
        analysisResult.summary = "⚠️ VULNERABLE AI: This is a demonstration of how an unsecured AI system responds to prompt injection attacks. The system directly includes user input in the prompt without protection, making it susceptible to manipulation.";
    }

    return { analysisResult };
  }

// You also need to export the new function.
// Find the `export default new AIAnalyzerService();` line at the bottom
// and add this line right before it:
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
        const urlAnalysis = await this.analyzeUrlWithGoogleSafeBrowsing(inputContent);
        analysisResult = { ...analysisResult, ...urlAnalysis };
        
        analysisResult.recommendations = [
          'Always verify URLs before clicking',
          'Look for HTTPS and valid SSL certificates',
          'Check the domain carefully for typos'
        ];
      } else {
        const textAnalysis = await this.analyzeTextWithHuggingFace(inputContent);
        analysisResult = { ...analysisResult, ...textAnalysis };
        
        analysisResult.recommendations = [
          'Never share passwords or sensitive information',
          'Verify sender identity through official channels',
          'Be suspicious of unsolicited messages'
        ];
      }

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

      analysisResult.summary = await this.generateSummaryWithGemini(analysisResult);

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