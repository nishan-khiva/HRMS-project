const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required']
  },
  leaveDate: {
    type: Date,
    required: [true, 'Leave date is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  documents: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
}, { timestamps: true });

// Indexes for better query performance
leaveSchema.index({ employeeId: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ startDate: 1 });
leaveSchema.index({ endDate: 1 });
leaveSchema.index({ leaveType: 1 });

// Calculate total days before saving
leaveSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (this.halfDay) {
      this.totalDays = 0.5;
    } else {
      this.totalDays = diffDays;
    }
  }
  next();
});

// Virtual for checking if leave is approved
leaveSchema.virtual('isApproved').get(function() {
  return this.status === 'Approved';
});

// Virtual for checking if leave is in the future
leaveSchema.virtual('isFutureLeave').get(function() {
  return new Date(this.leaveDate) > new Date();
});

// Virtual for checking if leave is currently active
leaveSchema.virtual('isActiveLeave').get(function() {
  const today = new Date();
  const start = new Date(this.leaveDate);
  const end = new Date(this.leaveDate);
  return today >= start && today <= end && this.status === 'Approved';
});

// Ensure virtual fields are serialized
leaveSchema.set('toJSON', { virtuals: true });
leaveSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Leave', leaveSchema); 