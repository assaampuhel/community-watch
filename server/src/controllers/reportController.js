import Report from '../models/Report.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createReport = async (req, res) => {
  try {
    const { reportId, reporterHandle, suspectHandle, contestId, problemId, reason, description } = req.body;
    let evidenceImage = undefined;

    if (req.file) {
      // Upload to Cloudinary using stream for memory buffer
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'community_watch_reports' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });

      evidenceImage = await uploadPromise;
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
    const { status, contestId, problemId, reporterHandle, suspectHandle, search } = req.query;
    const filter = {};

    if (status) {
      if (status.includes(',')) {
        filter.status = { $in: status.split(',') };
      } else {
        filter.status = status;
      }
    }
    if (contestId) filter.contestId = contestId;
    if (problemId) filter.problemId = problemId;
    if (reporterHandle) filter.reporterHandle = reporterHandle;
    if (suspectHandle) filter.suspectHandle = suspectHandle;
    
    if (search) {
      filter.$or = [
        { suspectHandle: { $regex: search, $options: 'i' } },
        { reason: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    const total = await Report.countDocuments(filter);

    res.json({
      reports,
      total,
      page: 1, // Simplified for now
      pages: Math.ceil(total / 10)
    });
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
    const { status, moderatorComment } = req.body;
    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const report = await Report.findOneAndUpdate(
      { reportId: req.params.reportId },
      { status, moderatorComment },
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
