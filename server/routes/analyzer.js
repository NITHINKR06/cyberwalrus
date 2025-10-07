import express from 'express';
import jwt from 'jsonwebtoken';
import AnalyzerHistory from '../models/AnalyzerHistory.js';
import User from '../models/User.js';
import { authenticateToken } from './auth.js';
import aiAnalyzer from '../services/aiAnalyzer.js';

const router = express.Router();

// Analyze content (public endpoint - no auth required)
router.post('/analyze', async (req, res) => {
  try {
    const { inputType, inputContent } = req.body;

    // Validate input
    if (!inputType || !inputContent) {
      return res.status(400).json({ 
        error: 'Input type and content are required' 
      });
    }

    // Validate input type
    const validTypes = ['text', 'url', 'email', 'phone'];
    if (!validTypes.includes(inputType)) {
      return res.status(400).json({ 
        error: 'Invalid input type. Must be one of: text, url, email, phone' 
      });
    }

    // Get user ID from token if authenticated
    let userId = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // Token invalid or expired, continue as anonymous
        console.log('Invalid token, proceeding as anonymous');
      }
    }

    // Perform AI-powered analysis
    console.log(`Analyzing ${inputType}: ${inputContent.substring(0, 50)}...`);
    const analysisResult = await aiAnalyzer.analyze(inputType, inputContent);

    console.log('Analysis result:', analysisResult);

    // Save to history
    const history = new AnalyzerHistory({
      userId,
      sessionId: req.session.sessionId,
      inputType,
      inputContent,
      analysisResult: {
        threatLevel: analysisResult.threatLevel,
        confidence: analysisResult.confidence,
        indicators: analysisResult.indicators,
        recommendations: analysisResult.recommendations,
        details: {
          summary: analysisResult.summary,
          source: analysisResult.source,
          threats: analysisResult.threats,
          analyzedAt: new Date().toISOString()
        }
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    await history.save();

    // Award points if user is authenticated and content is dangerous
    if (userId && analysisResult.threatLevel === 'dangerous') {
      await User.findByIdAndUpdate(userId, {
        $inc: { totalPoints: 10 }
      });
    }

    res.json({
      analysisResult,
      historyId: history._id,
      pointsAwarded: (userId && analysisResult.threatLevel === 'dangerous') ? 10 : 0,
      sessionId: req.session.sessionId
    });
  } catch (error) {
    console.log('Error analyzing content:', error);
    res.status(500).json({ error: 'Server error while analyzing content' });
  }
});

// ADD THIS NEW ROUTE to analyzer.js, before the existing '/history' route

// Vulnerable endpoint for the Security Sandbox demonstration
router.post('/analyze-vulnerable', async (req, res) => {
  try {
      const { inputType, inputContent } = req.body;
      if (!inputType || !inputContent) {
          return res.status(400).json({ error: 'Input type and content are required' });
      }

      // Call the new weak prompt function
      const result = await aiAnalyzer.analyzeWithWeakPrompt(inputType, inputContent);

      res.json(result);
  } catch (error) {
      console.log('Error in vulnerable analysis:', error);
      res.status(500).json({ error: 'Server error during vulnerable analysis' });
  }
});

// Get user's analysis history (authenticated)
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const history = await AnalyzerHistory.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Server error while fetching history' });
  }
});

// Get session analysis history (for anonymous users)
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (sessionId !== req.session.sessionId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const history = await AnalyzerHistory.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) {
    console.error('Error fetching session history:', error);
    res.status(500).json({ error: 'Server error while fetching history' });
  }
});

// Removed the hardcoded analysis function - now using AI services

export default router;
