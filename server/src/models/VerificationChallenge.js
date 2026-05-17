import mongoose from 'mongoose';

const verificationChallengeSchema = new mongoose.Schema({
  handle: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 900 } // Expires in 15 minutes (900 seconds)
}, { timestamps: true });

// Add index explicitly for TTL just in case
verificationChallengeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

export default mongoose.models.VerificationChallenge || mongoose.model('VerificationChallenge', verificationChallengeSchema);
