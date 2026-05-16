import express from 'express';
import { createReport, getReports, getReportById, updateReportStatus, deleteReport } from '../controllers/reportController.js';
import { protect, adminOnly, moderatorOnly } from '../middleware/auth.js';
import { validateReport } from '../middleware/validate.js';
import { uploadEvidence } from '../middleware/upload.js';
import { validateRequest } from '../middleware/validate.js';
import { validateReportStatusUpdate } from '../middleware/validate.js';

const router = express.Router();

router.post('/', protect, uploadEvidence, validateReport, validateRequest, createReport);
router.get('/', getReports);
router.get('/:reportId', getReportById);
router.patch('/:reportId/status', protect, moderatorOnly, validateReportStatusUpdate, validateRequest, updateReportStatus);
router.delete('/:reportId', protect, adminOnly, deleteReport);

export default router;
