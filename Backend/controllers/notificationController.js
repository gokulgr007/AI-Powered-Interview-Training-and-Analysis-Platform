const notifications = [];

export const getNotifications = (req, res) => {
  try {
    return res.json(notifications);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const createNotification = (req, res) => {
  try {
    const { title, body, time, metadata } = req.body || {};
    const id = String(Date.now()) + Math.random().toString(36).slice(2,8);
    const n = { id, title: title || 'Notification', body: body || '', time: time || new Date().toISOString(), metadata: metadata || {}, read: false };
    notifications.unshift(n);
    // Realtime emit removed (Socket.IO disabled)
    return res.status(201).json(n);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to create notification' });
  }
};

export const markAllRead = (req, res) => {
  try {
    for (const n of notifications) n.read = true;
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to mark read' });
  }
};
