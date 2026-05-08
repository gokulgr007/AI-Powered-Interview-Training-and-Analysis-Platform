import express from 'express';

const router = express.Router();

const PISTON_URL = process.env.PISTON_URL || 'https://emkc.org/api/v2/piston';
const PISTON_KEY = process.env.PISTON_KEY || null;

router.post('/execute', async (req, res) => {
  try {
    const r = await fetch(`${PISTON_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(PISTON_KEY ? { Authorization: `Token ${PISTON_KEY}` } : {}),
      },
      body: JSON.stringify(req.body),
    });

    const text = await r.text();
    try {
      const json = JSON.parse(text);
      return res.status(r.status).json(json);
    } catch (e) {
      return res.status(r.status).json({ text });
    }
  } catch (err) {
    console.error('[piston proxy] request failed', err);
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
