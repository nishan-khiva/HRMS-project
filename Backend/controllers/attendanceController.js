const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Check in employee
// @route   POST /api/attendance/check-in
// @access  Private
exports.checkIn = catchAsync(async (req, res, next) => {
  const { employeeId } = req.body;
  
  // Verify employee exists and is active
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }
  
  if (employee.status !== 'Active') {
    return next(new AppError('Only active employees can check in', 400));
  }

  // Check if already checked in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingAttendance = await Attendance.findOne({
    employeeId,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  if (existingAttendance && existingAttendance.checkIn) {
    return next(new AppError('Employee already checked in today', 400));
  }

  // Create or update attendance record
  let attendance;
  if (existingAttendance) {
    attendance = existingAttendance;
  } else {
    attendance = new Attendance({
      employeeId,
      date: today
    });
  }

  attendance.checkIn = {
    time: new Date(),
    location: req.body.location || 'Office',
    ipAddress: req.ip,
    deviceInfo: req.headers['user-agent']
  };

  await attendance.save();

  res.status(200).json({
    status: 'success',
    message: 'Check-in successful',
    data: {
      attendance
    }
  });
});

// @desc    Check out employee
// @route   POST /api/attendance/check-out
// @access  Private
exports.checkOut = catchAsync(async (req, res, next) => {
  const { employeeId } = req.body;
  
  // Verify employee exists and is active
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }
  
  if (employee.status !== 'Active') {
    return next(new AppError('Only active employees can check out', 400));
  }

  // Find today's attendance record
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
    return next(new AppError('No check-in record found for today', 400));
  }

  if (attendance.checkOut && attendance.checkOut.time) {
    return next(new AppError('Employee already checked out today', 400));
  }

  attendance.checkOut = {
    time: new Date(),
    location: req.body.location || 'Office',
    ipAddress: req.ip,
    deviceInfo: req.headers['user-agent']
  };

  await attendance.save();

  res.status(200).json({
    status: 'success',
    message: 'Check-out successful',
    data: {
      attendance
    }
  });
});

// @desc    Get all attendance records with filtering
// @route   GET /api/attendance
// @access  Private
exports.getAllAttendance = catchAsync(async (req, res, next) => {
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
  
  if (req.query.date) {
    const date = new Date(req.query.date);
    date.setHours(0, 0, 0, 0);
    filter.date = {
      $gte: date,
      $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
    };
  }
  
  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    endDate.setHours(23, 59, 59, 999);
    filter.date = {
      $gte: startDate,
      $lte: endDate
    };
  }

  // Build sort object
  const sort = {};
  if (req.query.sortBy) {
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    sort[req.query.sortBy] = sortOrder;
  } else {
    sort.date = -1; // Default sort by date descending
  }

  const attendance = await Attendance.find(filter)
    .populate('employeeId', 'fullName employeeId email department')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Attendance.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: 'success',
    results: attendance.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    data: {
      attendance
    }
  });
});

// @desc    Get attendance by ID
// @route   GET /api/attendance/:id
// @access  Private
exports.getAttendance = catchAsync(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id)
    .populate('employeeId', 'fullName employeeId email department');
  
  if (!attendance) {
    return next(new AppError('No attendance record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      attendance
    }
  });
});

// @desc    Update attendance
// @route   PATCH /api/attendance/:id
// @access  Private
exports.updateAttendance = catchAsync(async (req, res, next) => {
  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('employeeId', 'fullName employeeId email department');

  if (!attendance) {
    return next(new AppError('No attendance record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      attendance
    }
  });
});

// @desc    Get employee attendance
// @route   GET /api/attendance/employee/:employeeId
// @access  Private
exports.getEmployeeAttendance = catchAsync(async (req, res, next) => {
  const { employeeId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  // Verify employee exists and is active
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }

  const attendance = await Attendance.find({ employeeId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Attendance.countDocuments({ employeeId });
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: 'success',
    results: attendance.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    data: {
      employee,
      attendance
    }
  });
});

// @desc    Get today's attendance
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayAttendance = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const attendance = await Attendance.find({
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  }).populate('employeeId', 'fullName employeeId email department status');

  // Filter only active employees
  const activeAttendance = attendance.filter(record => 
    record.employeeId && record.employeeId.status === 'Active'
  );

  res.status(200).json({
    status: 'success',
    results: activeAttendance.length,
    data: {
      attendance: activeAttendance
    }
  });
});

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats/overview
// @access  Private
exports.getAttendanceStats = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAttendance = await Attendance.countDocuments({
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  const activeEmployees = await Employee.countDocuments({ status: 'Active' });
  
  const statusStats = await Attendance.aggregate([
    {
      $match: {
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const monthlyStats = await Attendance.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(today.getFullYear(), today.getMonth(), 1),
          $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1)
        }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        present: {
          $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] }
        },
        absent: {
          $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] }
        },
        late: {
          $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      todayAttendance,
      activeEmployees,
      statusStats,
      monthlyStats
    }
  });
}); 