const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required']
  },
  position: {
    type: String,
    enum: ['Designer', 'Developer', 'Human Resource'],
    required: [true, 'Position is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Shortlisted', 'Selected', 'Rejected'],
    default: 'Pending'
  },
  resume: {
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }
}, { timestamps: true });

// Indexes for better query performance
candidateSchema.index({ email: 1 });
candidateSchema.index({ position: 1 });




module.exports = mongoose.model('Candidate', candidateSchema); 