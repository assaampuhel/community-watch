import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  handle: { type: String, required: true, unique: true, trim: true },
  rating: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
  avatar: { type: String, default: null }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
