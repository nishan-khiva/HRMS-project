const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation rules
const updateUserValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  body('phoneNumber')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please enter a valid 10-digit phone number'),
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters'),
  body('position')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Position must be between 2 and 50 characters')
];

const updateRoleValidation = [
  body('role')
    .isIn(['admin', 'hr', 'employee'])
    .withMessage('Role must be admin, hr, or employee')
];

// Apply auth middleware to all routes
router.use(auth);

// Routes
router.get('/', roleAuth('admin', 'hr'), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', updateUserValidation, validate, userController.updateUser);
router.delete('/:id', roleAuth('admin'), userController.deleteUser);
router.patch('/:id/toggle-status', roleAuth('admin', 'hr'), userController.toggleUserStatus);
router.patch('/:id/role', roleAuth('admin'), updateRoleValidation, validate, userController.updateUserRole);

module.exports = router; 