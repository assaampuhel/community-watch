import Report from '../models/Report.js';
import { protect, adminOnly, moderatorOnly } from '../middleware/auth.js';

export const createReport = async (req, res) => {
  try {
    const { reportId, reporterHandle, suspectHandle, contestId, problemId, reason, description } = req.body;
    let { evidenceImage } = req.body;

    if (req.file) {
      // If a file was uploaded via multer, use its path
      // In a real app you might want to use a URL or relative path
      evidenceImage = `/uploads/${req.file.filename}`;
    }

    const report = new Report({
      reportId,
      reporterHandle,
      suspectHandle,
      contestId,
      problemId,
      reason,
      description,
      evidenceImage: evidenceImage || undefined
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const { status, contestId, problemId, reporterHandle, suspectHandle } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (contestId) filter.contestId = contestId;
    if (problemId) filter.problemId = problemId;
    if (reporterHandle) filter.reporterHandle = reporterHandle;
    if (suspectHandle) filter.suspectHandle = suspectHandle;

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ reportId: req.params.reportId });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const report = await Report.findOneAndUpdate(
      { reportId: req.params.reportId },
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ reportId: req.params.reportId });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
