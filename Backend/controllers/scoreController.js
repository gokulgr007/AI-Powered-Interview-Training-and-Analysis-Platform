import QuickScore from '../models/QuickScore.js';

export const createQuickScore = async (req, res) => {
  try {
    const { userId = null, module = 'hr', score } = req.body;
    if (typeof score !== 'number') return res.status(400).json({ error: 'score must be a number' });
    const doc = new QuickScore({ userId, module, score });
    await doc.save();
    res.json({ success: true, id: doc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
};

export const getLatestScore = async (req, res) => {
  try {
    const { userId = null, module = 'hr' } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (module) query.module = module;
    const doc = await QuickScore.findOne(query).sort({ createdAt: -1 }).lean();
    if (!doc) return res.json({ found: false });
    res.json({ found: true, score: doc.score, createdAt: doc.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
};
