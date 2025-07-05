const Employee = require('../models/Employee');
const Candidate = require('../models/Candidate');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private
exports.createEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      employee
    }
  });
});

// @desc    Convert candidate to employee
// @route   POST /api/employees/convert-candidate/:candidateId
// @access  Private
exports.convertCandidateToEmployee = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.candidateId);
  
  if (!candidate) {
    return next(new AppError('Candidate not found', 404));
  }

  // Check if candidate is already converted
  const existingEmployee = await Employee.findOne({ convertedFromCandidate: candidate._id });
  if (existingEmployee) {
    return next(new AppError('Candidate has already been converted to employee', 400));
  }

  // Create employee from candidate data
  const employeeData = {
    fullName: candidate.fullName,
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.position,
    convertedFromCandidate: candidate._id,
    ...req.body // Additional employee data from request
  };

  const employee = await Employee.create(employeeData);
  
  res.status(201).json({
    status: 'success',
    message: 'Candidate successfully converted to employee',
    data: {
      employee
    }
  });
});

// @desc    Get all employees with filtering, sorting, and pagination
// @route   GET /api/employees
// @access  Private
exports.getAllEmployees = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};
  
  if (req.query.department) {
    filter.department = req.query.department;
  }
  
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  if (req.query.role) {
    filter.role = req.query.role;
  }
  
  if (req.query.search) {
    filter.$or = [
      { fullName: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { employeeId: { $regex: req.query.search, $options: 'i' } }
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

  const employees = await Employee.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Employee.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: 'success',
    results: employees.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    data: {
      employees
    }
  });
});

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  
  if (!employee) {
    return next(new AppError('No employee found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      employee
    }
  });
});

// @desc    Update employee
// @route   PATCH /api/employees/:id
// @access  Private
exports.updateEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!employee) {
    return next(new AppError('No employee found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      employee
    }
  });
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return next(new AppError('No employee found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Update employee role
// @route   PATCH /api/employees/:id/role
// @access  Private
exports.updateEmployeeRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  
  if (!role || !['employee', 'hr', 'admin'].includes(role)) {
    return next(new AppError('Invalid role. Must be employee, hr, or admin', 400));
  }

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { role },
    {
      new: true,
      runValidators: true
    }
  );

  if (!employee) {
    return next(new AppError('No employee found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Employee role updated successfully',
    data: {
      employee
    }
  });
});

// @desc    Get employees by department
// @route   GET /api/employees/department/:department
// @access  Private
exports.getEmployeesByDepartment = catchAsync(async (req, res, next) => {
  const employees = await Employee.find({ 
    department: req.params.department,
    status: 'Active'
  }).sort({ fullName: 1 });

  res.status(200).json({
    status: 'success',
    results: employees.length,
    data: {
      employees
    }
  });
});

// @desc    Get employee statistics
// @route   GET /api/employees/stats/overview
// @access  Private
exports.getEmployeeStats = catchAsync(async (req, res, next) => {
  const totalEmployees = await Employee.countDocuments();
  const activeEmployees = await Employee.countDocuments({ status: 'Active' });
  
  const departmentStats = await Employee.aggregate([
    {
      $group: {
        _id: '$department',
        count: { $sum: 1 }
      }
    }
  ]);

  const roleStats = await Employee.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  const recentEmployees = await Employee.find()
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    status: 'success',
    data: {
      totalEmployees,
      activeEmployees,
      departmentStats,
      roleStats,
      recentEmployees
    }
  });
});

// @desc    Bulk update employee status
// @route   PATCH /api/employees/bulk-status
// @access  Private
exports.bulkUpdateEmployeeStatus = catchAsync(async (req, res, next) => {
  const { employeeIds, status } = req.body;
  
  if (!employeeIds || !Array.isArray(employeeIds) || !status) {
    return next(new AppError('Please provide employee IDs array and status', 400));
  }

  if (!['Active', 'Inactive', 'Terminated'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const result = await Employee.updateMany(
    { _id: { $in: employeeIds } },
    { status }
  );

  res.status(200).json({
    status: 'success',
    message: `${result.modifiedCount} employees updated successfully`,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
}); 