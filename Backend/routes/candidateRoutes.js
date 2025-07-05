const express = require('express');
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes - no authentication required
router.post('/', candidateController.createCandidate);
router.get('/', candidateController.getAllCandidates);

// Protected routes - require authentication only (no role restriction)
router.use(protect);

router
  .route('/:id')
  .get(candidateController.getCandidate)
  .patch(candidateController.updateCandidate)
  .delete(candidateController.deleteCandidate);

// Special routes
router.patch('/:id/resume', candidateController.uploadResume);
router.patch('/:id/status', candidateController.updateCandidateStatus);
router.get('/position/:position', candidateController.getCandidatesByPosition);
router.get('/stats/overview', candidateController.getCandidateStats);
router.delete('/bulk', candidateController.bulkDeleteCandidates);

module.exports = router; 