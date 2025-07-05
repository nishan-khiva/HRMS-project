const express = require('express');
const leaveController = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes - no authentication required
router.get('/', leaveController.getAllLeaves);
router.get('/calendar', leaveController.getLeaveCalendar);

// Protected routes - require authentication
router.use(protect);

// CRUD routes
router.post('/', leaveController.createLeave);
router.get('/:id', leaveController.getLeave);
router.patch('/:id', leaveController.updateLeave);
router.delete('/:id', leaveController.deleteLeave);

// Special routes
router.patch('/:id/status', leaveController.updateLeaveStatus);
router.get('/employee/:employeeId', leaveController.getEmployeeLeaves);
router.patch('/:id/documents', leaveController.uploadLeaveDocuments);
router.get('/stats/overview', leaveController.getLeaveStats);

module.exports = router; 