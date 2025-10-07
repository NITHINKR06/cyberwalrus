import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  linkedSessions: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastLogin = new Date(this.lastLoginDate);
  const daysDiff = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    this.currentStreak += 1;
  } else if (daysDiff > 1) {
    this.currentStreak = 1;
  }
  
  this.lastLoginDate = now;
};

export default mongoose.model('User', userSchema);
