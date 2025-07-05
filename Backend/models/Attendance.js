const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  checkIn: {
    time: {
      type: Date,
      required: [true, 'Check-in time is required']
    },
    location: {
      type: String,
      default: 'Office'
    },
    ipAddress: String,
    deviceInfo: String
  },
  checkOut: {
    time: {
      type: Date
    },
    location: {
      type: String,
      default: 'Office'
    },
    ipAddress: String,
    deviceInfo: String
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Half Day', 'Work From Home'],
    default: 'Present'
  },
  totalHours: {
    type: Number,
    default: 0
  },
  overtime: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  approvedAt: {
    type: Date
  }
}, { timestamps: true });

// Indexes for better query performance
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });
attendanceSchema.index({ employeeId: 1 });

// Calculate total hours when check-out is set
attendanceSchema.pre('save', function(next) {
  if (this.checkOut && this.checkOut.time && this.checkIn && this.checkIn.time) {
    const checkInTime = new Date(this.checkIn.time);
    const checkOutTime = new Date(this.checkOut.time);
    const diffInHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    
    this.totalHours = Math.round(diffInHours * 100) / 100;
    
    // Calculate overtime (assuming 8 hours is normal work day)
    if (this.totalHours > 8) {
      this.overtime = Math.round((this.totalHours - 8) * 100) / 100;
    }
  }
  next();
});

// Virtual for formatted date
attendanceSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Ensure virtual fields are serialized
attendanceSchema.set('toJSON', { virtuals: true });
attendanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Attendance', attendanceSchema); 