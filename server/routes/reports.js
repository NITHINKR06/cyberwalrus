import express from 'express';
import jwt from 'jsonwebtoken';
import ScamReport from '../models/ScamReport.js';
import User from '../models/User.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Submit a scam report (public endpoint - no auth required)
router.post('/', async (req, res) => {
  try {
    const {
      scamType,
      description,
      websiteUrl,
      phoneNumber,
      emailAddress,
      severity
    } = req.body;

    // Validate required fields
    if (!scamType || !description || !severity) {
      return res.status(400).json({ 
        error: 'Scam type, description, and severity are required' 
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

    // Create report
    const report = new ScamReport({
      userId,
      sessionId: req.session.sessionId,
      scamType,
      description,
      websiteUrl: websiteUrl || '',
      phoneNumber: phoneNumber || '',
      emailAddress: emailAddress || '',
      severity,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    await report.save();

    // Award points if user is authenticated
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $inc: { totalPoints: 25 }
      });
    }

    res.status(201).json({
      message: 'Scam report submitted successfully',
      reportId: report._id,
      pointsAwarded: userId ? 25 : 0
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Server error while submitting report' });
  }
});

// Get all reports (admin endpoint - would need admin auth in production)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const reports = await ScamReport.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Server error while fetching reports' });
  }
});

// Get user's reports (authenticated)
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const reports = await ScamReport.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ error: 'Server error while fetching reports' });
  }
});

// Get reports by session (for anonymous users to see their history)
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (sessionId !== req.session.sessionId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const reports = await ScamReport.find({ sessionId })
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching session reports:', error);
    res.status(500).json({ error: 'Server error while fetching reports' });
  }
});

// Get recent reports (public - for dashboard)
router.get('/recent', async (req, res) => {
  try {
    const reports = await ScamReport.find({ status: 'verified' })
      .select('scamType severity createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(reports);
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    res.status(500).json({ error: 'Server error while fetching reports' });
  }
});

// Get report statistics (public)
router.get('/stats', async (req, res) => {
  try {
    const totalReports = await ScamReport.countDocuments();
    const last24Hours = await ScamReport.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    const last7Days = await ScamReport.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const typeDistribution = await ScamReport.aggregate([
      {
        $group: {
          _id: '$scamType',
          count: { $sum: 1 }
        }
      }
    ]);

    const severityDistribution = await ScamReport.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalReports,
      last24Hours,
      last7Days,
      typeDistribution,
      severityDistribution
    });
  } catch (error) {
    console.error('Error fetching report stats:', error);
    res.status(500).json({ error: 'Server error while fetching statistics' });
  }
});

export default router;
