import mongoose from 'mongoose';

const QuickScoreSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  module: { type: String, default: 'hr' },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuickScore', QuickScoreSchema);
