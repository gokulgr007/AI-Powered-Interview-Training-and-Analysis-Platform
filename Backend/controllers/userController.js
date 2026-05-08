import User from '../models/user.js';

// GET /api/user/scores
export const getScores = async (req, res) => {
  try {
    const user = req.user; // set by auth middleware
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      atsScore: user.atsScore ?? null,
      aptitudeScore: user.aptitudeScore ?? null,
      gdScore: user.gdScore ?? null,
      averageScore: user.averageScore ?? null,
      user
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch scores' });
  }
};

// PUT /api/user/scores
export const updateScores = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { atsScore, aptitudeScore, averageScore, gdScore } = req.body;
    if (typeof atsScore !== 'undefined') user.atsScore = Number(atsScore);
    if (typeof aptitudeScore !== 'undefined') user.aptitudeScore = Number(aptitudeScore);
    if (typeof gdScore !== 'undefined') user.gdScore = Number(gdScore);
    if (typeof averageScore !== 'undefined') user.averageScore = Number(averageScore);

    await user.save();

    return res.json({ message: 'Scores updated', atsScore: user.atsScore, aptitudeScore: user.aptitudeScore, gdScore: user.gdScore, averageScore: user.averageScore });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update scores' });
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Accept common profile fields and persist them.
    const {
      name, fullName, phone, role, bio, avatar, email
    } = req.body || {};

    // name normalization
    const newName = typeof name !== 'undefined' ? name : fullName;
    if (typeof newName !== 'undefined') user.name = newName;
    if (typeof phone !== 'undefined') user.phone = phone;
    if (typeof role !== 'undefined') user.role = role;
    if (typeof bio !== 'undefined') user.bio = bio;
    if (typeof email !== 'undefined') user.email = email;

    // avatar may be a URL or a data URL; persist as-is (best-effort)
    if (typeof avatar !== 'undefined') {
      // if client sends null to clear avatar, remove the field
      if (avatar === null) user.avatar = undefined;
      else user.avatar = avatar;
    }

    await user.save();

    return res.json({ message: 'Profile updated', user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

// PUT /api/user/password
export const updatePassword = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });

    // fetch full user from DB to ensure password field is available
    const fullUser = await User.findById(user._id);
    if (!fullUser) return res.status(404).json({ message: 'User not found' });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });

    // user may not have a password if created via OAuth
    if (!fullUser.password) return res.status(400).json({ message: 'No password set for this account' });

    const isMatch = await import('bcryptjs').then(mod => mod.compare(currentPassword, fullUser.password));
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const hashed = await import('bcryptjs').then(mod => mod.hash(newPassword, 10));
    fullUser.password = hashed;
    await fullUser.save();

    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update password' });
  }
};

// DELETE /api/user/delete
export const deleteAccount = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete quick scores tied to this user (userId stored as string)
    try {
      const QuickScore = (await import('../models/QuickScore.js')).default;
      await QuickScore.deleteMany({ userId: user._id.toString() });
    } catch (e) {
      // non-fatal: log and continue to ensure account deletion proceeds
      console.warn('Failed to remove QuickScore docs for user', e);
    }

    // Remove the user document
    await User.findByIdAndDelete(user._id);

    return res.json({ message: 'Account and related scores deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete account' });
  }
};