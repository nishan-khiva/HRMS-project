const Candidate = require('../models/Candidate');
const Employee = require('../models/Employee');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Helper function to map position to department
const getDepartmentFromPosition = (position) => {
  const departmentMap = {
    'Developer': 'IT',
    'Designer': 'IT',
    'Human Resource': 'HR'
  };
  return departmentMap[position] || 'Operations';
};

// @desc    Create a new candidate
// @route   POST /api/candidates
// @access  Private
exports.createCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      candidate
    }
  });
});

// @desc    Get all candidates with filtering, sorting, and pagination
// @route   GET /api/candidates
// @access  Private
exports.getAllCandidates = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};
  
  if (req.query.position) {
    filter.position = req.query.position;
  }
  
  if (req.query.experience) {
    filter.experience = { $gte: parseInt(req.query.experience) };
  }
  
  if (req.query.search) {
    filter.$or = [
      { fullName: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
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

  const candidates = await Candidate.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Candidate.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: 'success',
    results: candidates.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    data: {
      candidates
    }
  });
});

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private
exports.getCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);
  
  if (!candidate) {
    return next(new AppError('No candidate found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      candidate
    }
  });
});

// @desc    Update candidate
// @route   PATCH /api/candidates/:id
// @access  Private
exports.updateCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!candidate) {
    return next(new AppError('No candidate found with that ID', 404));
  }

  // If status is changed to 'Selected', automatically convert to employee
  if (req.body.status === 'Selected') {
    try {
      // Check if candidate is already converted
      const existingEmployee = await Employee.findOne({ convertedFromCandidate: candidate._id });
      if (existingEmployee) {
        return res.status(200).json({
          status: 'success',
          message: 'Candidate updated and already converted to employee',
          data: {
            candidate,
            employee: existingEmployee
          }
        });
      }

      // Create employee from candidate data
      const employeeData = {
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        position: candidate.position,
        convertedFromCandidate: candidate._id,
        department: getDepartmentFromPosition(candidate.position),
        joiningDate: new Date(),
        salary: 0, // Default salary, can be updated later
        status: 'Active'
      };

      const employee = await Employee.create(employeeData);

      res.status(200).json({
        status: 'success',
        message: 'Candidate updated and automatically converted to employee',
        data: {
          candidate,
          employee
        }
      });
    } catch (error) {
      // If employee creation fails, still return the updated candidate
      res.status(200).json({
        status: 'success',
        message: 'Candidate updated but employee conversion failed',
        data: {
          candidate
        }
      });
    }
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        candidate
      }
    });
  }
});

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private
exports.deleteCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id);

  if (!candidate) {
    return next(new AppError('No candidate found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Upload candidate resume
// @route   PATCH /api/candidates/:id/resume
// @access  Private
exports.uploadResume = catchAsync(async (req, res, next) => {
  const { fileName, fileUrl } = req.body;
  
  if (!fileName || !fileUrl) {
    return next(new AppError('File name and URL are required', 400));
  }

  const candidate = await Candidate.findByIdAndUpdate(
    req.params.id,
    {
      resume: {
        fileName,
        fileUrl,
        uploadedAt: new Date()
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!candidate) {
    return next(new AppError('No candidate found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      candidate
    }
  });
});

// @desc    Get candidates by position
// @route   GET /api/candidates/position/:position
// @access  Private
exports.getCandidatesByPosition = catchAsync(async (req, res, next) => {
  const candidates = await Candidate.find({ 
    position: req.params.position 
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: candidates.length,
    data: {
      candidates
    }
  });
});

// @desc    Get candidates statistics
// @route   GET /api/candidates/stats/overview
// @access  Private
exports.getCandidateStats = catchAsync(async (req, res, next) => {
  const totalCandidates = await Candidate.countDocuments();
  
  const positionStats = await Candidate.aggregate([
    {
      $group: {
        _id: '$position',
        count: { $sum: 1 }
      }
    }
  ]);

  const experienceStats = await Candidate.aggregate([
    {
      $group: {
        _id: null,
        avgExperience: { $avg: '$experience' },
        minExperience: { $min: '$experience' },
        maxExperience: { $max: '$experience' }
      }
    }
  ]);

  const recentCandidates = await Candidate.find()
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    status: 'success',
    data: {
      totalCandidates,
      positionStats,
      experienceStats: experienceStats[0] || {},
      recentCandidates
    }
  });
});

// @desc    Update candidate status
// @route   PATCH /api/candidates/:id/status
// @access  Private
exports.updateCandidateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  
  if (!status || !['Pending', 'Shortlisted', 'Selected', 'Rejected'].includes(status)) {
    return next(new AppError('Invalid status. Must be Pending, Shortlisted, Selected, or Rejected', 400));
  }

  const candidate = await Candidate.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true
    }
  );

  if (!candidate) {
    return next(new AppError('No candidate found with that ID', 404));
  }

  // If status is changed to 'Selected', automatically convert to employee
  if (status === 'Selected') {
    try {
      // Check if candidate is already converted
      const existingEmployee = await Employee.findOne({ convertedFromCandidate: candidate._id });
      if (existingEmployee) {
        return res.status(200).json({
          status: 'success',
          message: 'Candidate status updated and already converted to employee',
          data: {
            candidate,
            employee: existingEmployee
          }
        });
      }

      // Create employee from candidate data
      const employeeData = {
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        position: candidate.position,
        convertedFromCandidate: candidate._id,
        department: getDepartmentFromPosition(candidate.position),
        joiningDate: new Date(),
        salary: 0, // Default salary, can be updated later
        status: 'Active'
      };

      const employee = await Employee.create(employeeData);

      res.status(200).json({
        status: 'success',
        message: 'Candidate status updated and automatically converted to employee',
        data: {
          candidate,
          employee
        }
      });
    } catch (error) {
      // If employee creation fails, still return the updated candidate
      res.status(200).json({
        status: 'success',
        message: 'Candidate status updated but employee conversion failed',
        data: {
          candidate
        }
      });
    }
  } else {
    res.status(200).json({
      status: 'success',
      message: 'Candidate status updated successfully',
      data: {
        candidate
      }
    });
  }
});

// @desc    Bulk delete candidates
// @route   DELETE /api/candidates/bulk
// @access  Private
exports.bulkDeleteCandidates = catchAsync(async (req, res, next) => {
  const { candidateIds } = req.body;
  
  if (!candidateIds || !Array.isArray(candidateIds)) {
    return next(new AppError('Please provide an array of candidate IDs', 400));
  }

  const result = await Candidate.deleteMany({
    _id: { $in: candidateIds }
  });

  res.status(200).json({
    status: 'success',
    message: `${result.deletedCount} candidates deleted successfully`,
    data: {
      deletedCount: result.deletedCount
    }
  });
}); 