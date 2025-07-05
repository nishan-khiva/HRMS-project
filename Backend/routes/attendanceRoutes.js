const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes - no authentication required
router.get('/', attendanceController.getAllAttendance);
router.get('/today', attendanceController.getTodayAttendance);

// Protected routes - require authentication
router.use(protect);

// Check-in/Check-out routes
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);

// CRUD routes
router.get('/:id', attendanceController.getAttendance);
router.patch('/:id', attendanceController.updateAttendance);

// Special routes
router.get('/employee/:employeeId', attendanceController.getEmployeeAttendance);
router.get('/stats/overview', attendanceController.getAttendanceStats);

module.exports = router; 