import Review from '../models/Review.js';
import { protect, moderatorOnly } from '../middleware/auth.js';

export const createReview = async (req, res) => {
  try {
    const { reviewId, reportId, reviewerHandle, decision, comment } = req.body;

    const review = new Review({
      reviewId,
      reportId,
      reviewerHandle,
      decision,
      comment: comment || undefined
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getReviewsByReport = async (req, res) => {
  try {
    const reviews = await Review.find({ reportId: req.params.reportId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findOne({ reviewId: req.params.reviewId });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { comment } = req.body;

    const review = await Review.findOneAndUpdate(
      { reviewId: req.params.reviewId },
      { comment },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
