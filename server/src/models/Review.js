import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewId: { type: String, required: true, unique: true },
  reportId: { type: String, required: true, ref: 'Report' },
  reviewerHandle: { type: String, required: true },
  decision: { type: String, enum: ['approve', 'reject'], required: true },
  comment: { type: String }
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
