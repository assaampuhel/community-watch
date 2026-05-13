import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  reporterHandle: { type: String, required: true },
  suspectHandle: { type: String, required: true },
  contestId: { type: String, required: true },
  problemId: { type: String, required: true },
  reason: { type: String, required: true },
  description: { type: String },
  evidenceImage: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' }
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', reportSchema);
