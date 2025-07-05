const express = require('express');
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes - no authentication required
router.get('/', employeeController.getAllEmployees);

// Protected routes - require authentication
router.use(protect);

// CRUD routes
router.post('/', employeeController.createEmployee);
router.get('/:id', employeeController.getEmployee);
router.patch('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// Special routes
router.post('/convert-candidate/:candidateId', employeeController.convertCandidateToEmployee);
router.patch('/:id/role', employeeController.updateEmployeeRole);
router.get('/department/:department', employeeController.getEmployeesByDepartment);
router.get('/stats/overview', employeeController.getEmployeeStats);
router.patch('/bulk-status', employeeController.bulkUpdateEmployeeStatus);

module.exports = router; 