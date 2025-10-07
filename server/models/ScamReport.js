import mongoose from 'mongoose';

const scamReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    required: true
  },
  scamType: {
    type: String,
    required: true,
    enum: [
      'phishingEmail',
      'fakeWebsite',
      'phoneScam',
      'smsScam',
      'socialMediaScam',
      'investmentFraud',
      'romanceScam',
      'techSupportScam',
      'other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  websiteUrl: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  emailAddress: {
    type: String,
    default: ''
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
scamReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('ScamReport', scamReportSchema);
