const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private
exports.createLeave = catchAsync(async (req, res, next) => {
  const { employeeId } = req.body;
  
  // Verify employee exists and is active
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }
  
  if (employee.status !== 'Active') {
    return next(new AppError('Only active employees can request leaves', 400));
  }

  // Check if employee is present (has attendance record)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const attendance = await Attendance.findOne({
    employeeId,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  if (!attendance || !attendance.checkIn) {
    return next(new AppError('Only present employees can request leaves', 400));
  }

  // Check for overlapping leaves
  const overlappingLeave = await Leave.findOne({
    employeeId,
    status: { $in: ['Pending', 'Approved'] },
    $or: [
      {
        startDate: { $lte: new Date(req.body.endDate) },
        endDate: { $gte: new Date(req.body.startDate) }
      }
    ]
  });

  if (overlappingLeave) {
    return next(new AppError('Leave request overlaps with existing approved or pending leave', 400));
  }

  const leave = await Leave.create(req.body);
  
  res.status(201).json({
    status: 'success',
    message: 'Leave request created successfully',
    data: {
      leave
    }
  });
});

// @desc    Get all leaves with filtering
// @route   GET /api/leaves
// @access  Private
exports.getAllLeaves = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};
  
  if (req.query.employeeId) {
    filter.employeeId = req.query.employeeId;
  }
  
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  if (req.query.leaveType) {
    filter.leaveType = req.query.leaveType;
  }
  
  if (req.query.startDate && req.query.endDate) {
    filter.startDate = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }
  
  if (req.query.search) {
    filter.$or = [
      { reason: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sort = {};
  if (req.query.sortBy) {
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    sort[req.query.sortBy] = sortOrder;
  } else {
    sort.createdAt = -1; // Default sort by newest first
  }

  const leaves = await Leave.find(filter)
    .populate('employeeId', 'fullName employeeId email department')
    .populate('approvedBy', 'fullName employeeId')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Leave.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: 'success',
    results: leaves.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    data: {
      leaves
    }
  });
});

// @desc    Get leave by ID
// @route   GET /api/leaves/:id
// @access  Private
exports.getLeave = catchAsync(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id)
    .populate('employeeId', 'fullName employeeId email department')
    .populate('approvedBy', 'fullName employeeId');
  
  if (!leave) {
    return next(new AppError('No leave found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      leave
    }
  });
});

// @desc    Update leave status (approve/reject)
// @route   PATCH /api/leaves/:id/status
// @access  Private
exports.updateLeaveStatus = catchAsync(async (req, res, next) => {
  const { status, rejectionReason } = req.body;
  
  if (!['Approved', 'Rejected', 'Cancelled'].includes(status)) {
    return next(new AppError('Invalid status. Must be Approved, Rejected, or Cancelled', 400));
  }

  if (status === 'Rejected' && !rejectionReason) {
    return next(new AppError('Rejection reason is required when rejecting a leave', 400));
  }

  const updateData = {
    status,
    approvedBy: req.user.id,
    approvedAt: new Date()
  };

  if (status === 'Rejected') {
    updateData.rejectionReason = rejectionReason;
  }

  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).populate('employeeId', 'fullName employeeId email department')
   .populate('approvedBy', 'fullName employeeId');

  if (!leave) {
    return next(new AppError('No leave found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `Leave ${status.toLowerCase()} successfully`,
    data: {
      leave
    }
  });
});

// @desc    Update leave
// @route   PATCH /api/leaves/:id
// @access  Private
exports.updateLeave = catchAsync(async (req, res, next) => {
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('employeeId', 'fullName employeeId email department')
   .populate('approvedBy', 'fullName employeeId');

  if (!leave) {
    return next(new AppError('No leave found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      leave
    }
  });
});

// @desc    Delete leave
// @route   DELETE /api/leaves/:id
// @access  Private
exports.deleteLeave = catchAsync(async (req, res, next) => {
  const leave = await Leave.findByIdAndDelete(req.params.id);

  if (!leave) {
    return next(new AppError('No leave found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Get employee leaves
// @route   GET /api/leaves/employee/:employeeId
// @access  Private
exports.getEmployeeLeaves = catchAsync(async (req, res, next) => {
  const { employeeId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Verify employee exists
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }

  const leaves = await Leave.find({ employeeId })
    .populate('approvedBy', 'fullName employeeId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Leave.countDocuments({ employeeId });
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: 'success',
    results: leaves.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    data: {
      employee,
      leaves
    }
  });
});

// @desc    Get approved leaves for calendar
// @route   GET /api/leaves/calendar
// @access  Private
exports.getLeaveCalendar = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  const filter = {
    status: 'Approved'
  };

  if (startDate && endDate) {
    filter.startDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const leaves = await Leave.find(filter)
    .populate('employeeId', 'fullName employeeId department')
    .sort({ startDate: 1 });

  // Group leaves by date for calendar view
  const calendarData = {};
  leaves.forEach(leave => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateKey = date.toISOString().split('T')[0];
      
      if (!calendarData[dateKey]) {
        calendarData[dateKey] = [];
      }
      
      calendarData[dateKey].push({
        id: leave._id,
        employeeName: leave.employeeId.fullName,
        employeeId: leave.employeeId.employeeId,
        department: leave.employeeId.department,
        leaveType: leave.leaveType,
        reason: leave.reason,
        halfDay: leave.halfDay,
        halfDayType: leave.halfDayType
      });
    }
  });

  res.status(200).json({
    status: 'success',
    results: leaves.length,
    data: {
      calendarData
    }
  });
});

// @desc    Upload leave documents
// @route   PATCH /api/leaves/:id/documents
// @access  Private
exports.uploadLeaveDocuments = catchAsync(async (req, res, next) => {
  const { documents } = req.body;
  
  if (!documents || !Array.isArray(documents)) {
    return next(new AppError('Documents array is required', 400));
  }

  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        documents: {
          $each: documents
        }
      }
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('employeeId', 'fullName employeeId email department');

  if (!leave) {
    return next(new AppError('No leave found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Documents uploaded successfully',
    data: {
      leave
    }
  });
});

// @desc    Get leave statistics
// @route   GET /api/leaves/stats/overview
// @access  Private
exports.getLeaveStats = catchAsync(async (req, res, next) => {
  const totalLeaves = await Leave.countDocuments();
  const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
  const approvedLeaves = await Leave.countDocuments({ status: 'Approved' });
  const rejectedLeaves = await Leave.countDocuments({ status: 'Rejected' });
  
  const leaveTypeStats = await Leave.aggregate([
    {
      $group: {
        _id: '$leaveType',
        count: { $sum: 1 },
        approved: {
          $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
        }
      }
    }
  ]);

  const monthlyStats = await Leave.aggregate([
    {
      $match: {
        startDate: {
          $gte: new Date(new Date().getFullYear(), 0, 1),
          $lt: new Date(new Date().getFullYear() + 1, 0, 1)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDate' },
        totalLeaves: { $sum: 1 },
        approvedLeaves: {
          $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
        },
        totalDays: { $sum: '$totalDays' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalLeaves,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      leaveTypeStats,
      monthlyStats
    }
  });
}); 