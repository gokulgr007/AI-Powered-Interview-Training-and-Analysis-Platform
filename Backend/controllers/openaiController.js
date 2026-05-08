import dotenv from 'dotenv';
dotenv.config();

const MAX_MESSAGE_CHARS = 8000; // rough char budget to keep token usage reasonable
const MAX_MESSAGES = 12;

function normalizeAndTrimMessages(rawMessages) {
  if (!Array.isArray(rawMessages)) return [];

  // convert older message shapes (sender/text) -> { role, content }
  const mapped = rawMessages.map(m => {
    const role = m.role || (m.sender === 'ai' ? 'assistant' : 'user');
    const content = String(m.content ?? m.text ?? '');
    return { role, content };
  });

  // Keep only the last N messages
  let last = mapped.slice(-MAX_MESSAGES);

  // Trim combined length to a budget by dropping earliest messages
  while (last.map(m => m.content.length).reduce((a, b) => a + b, 0) > MAX_MESSAGE_CHARS && last.length > 1) {
    last.shift();
  }

  // Ensure individual messages are not absurdly long
  last = last.map(m => ({ ...m, content: m.content.length > 3000 ? m.content.slice(-3000) : m.content }));
  return last;
}

export const chat = async (req, res) => {
  try {
    const { messages: raw } = req.body;
    if (!raw) return res.status(400).json({ error: 'Missing messages in request body' });

    const messages = normalizeAndTrimMessages(raw);

    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const max_tokens = Number(process.env.OPENAI_MAX_TOKENS) || 400;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens
      })
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      // Map common quota/rate errors to a friendly 429
      const lowered = String(errText || '').toLowerCase();
      if (resp.status === 429 || /quota|insufficient_quota|insufficient funds|billing/i.test(lowered)) {
        return res.status(429).json({ error: 'OpenAI quota exceeded or rate limited' });
      }
      return res.status(resp.status).send(errText);
    }

    const data = await resp.json();
    const assistant = data.choices?.[0]?.message?.content ?? data.choices?.[0]?.text ?? '';
    res.json({ reply: assistant, raw: data });
  } catch (err) {
    console.error('OpenAI request failed', err);
    // If the error message includes quota-like hints, forward a 429
    const msg = String(err?.message || '').toLowerCase();
    if (msg.includes('quota') || msg.includes('insufficient_quota') || msg.includes('rate limit')) {
      return res.status(429).json({ error: 'OpenAI quota exceeded or rate limited' });
    }
    res.status(500).json({ error: 'OpenAI request failed' });
  }
};
