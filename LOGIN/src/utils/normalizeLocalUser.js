// normalizeLocalUser.js
// Ensure localStorage 'user' object has atsScore defaulted to 0 and keep atsScore key in sync
export default function normalizeLocalUser() {
  try {
    const raw = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // If there's no stored user and no token, clear any leftover hrConfidence
    // to avoid stale values affecting new sessions.
    if (!raw && !token) {
      try { localStorage.removeItem('hrConfidence'); } catch (e) {}
      return;
    }

    if (!raw) return;
    const user = JSON.parse(raw);

    // Ensure a top-level `atsScore` exists when the user object contains it.
    try {
      const top = localStorage.getItem('atsScore');
      if ((top === null || top === 'null') && user && typeof user.atsScore !== 'undefined' && user.atsScore !== null) {
        localStorage.setItem('atsScore', String(user.atsScore));
      }
    } catch (e) {}

    // Ensure hrConfidence is present on the stored user object and mirrored
    // to the top-level `hrConfidence` key. New users should default to 0.
    try {
      if (user) {
        if (typeof user.hrConfidence === 'undefined' || user.hrConfidence === null) {
          user.hrConfidence = 0;
          localStorage.setItem('user', JSON.stringify(user));
        }
        // ensure hrAttempts defaults to 0 for users lacking it
        if (typeof user.hrAttempts === 'undefined' || user.hrAttempts === null) {
          user.hrAttempts = 0;
          localStorage.setItem('user', JSON.stringify(user));
        }
        const topHr = localStorage.getItem('hrConfidence');
        if (topHr === null || topHr === 'null') {
          localStorage.setItem('hrConfidence', String(Number(user.hrConfidence || 0)));
        }
        const topAttempts = localStorage.getItem('hrAttempts');
        if (topAttempts === null || topAttempts === 'null') {
          try { localStorage.setItem('hrAttempts', String(Number(user.hrAttempts || 0))); } catch (e) {}
        }
        // ensure completedModules exists (default 0)
        try {
          const topCompleted = localStorage.getItem('completedModules');
          if ((topCompleted === null || topCompleted === 'null') && typeof user.completedModules !== 'undefined' && user.completedModules !== null) {
            localStorage.setItem('completedModules', String(Number(user.completedModules || 0)));
          } else if (topCompleted === null || topCompleted === 'null') {
            localStorage.setItem('completedModules', '0');
          }
        } catch (e) {}
      }
    } catch (e) {}
  } catch (e) {}
}
