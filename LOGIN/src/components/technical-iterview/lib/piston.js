// Piston API is a service for code execution
// Optional overrides via Vite env variables:
// - VITE_PISTON_URL  (e.g. http://localhost:2000/api/v2/piston)
// - VITE_PISTON_KEY  (token if the instance requires authorization)
// Pointing to our Vite proxy, which forwards to http://localhost:2000/api/v2
const PISTON_API = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PISTON_URL)
  ? import.meta.env.VITE_PISTON_URL
  : "/piston/api/v2";

const PISTON_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PISTON_KEY)
  ? import.meta.env.VITE_PISTON_KEY
  : null;

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" }, // Changed 'node' back to 'javascript'
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};
/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    // --- NEW: Safety check to prevent 400 Bad Request errors ---
    if (!code || !code.trim()) {
      return {
        success: false,
        error: "Please enter some code to execute.",
      };
    }
    // -----------------------------------------------------------

    const headers = { "Content-Type": "application/json" };
    if (PISTON_KEY) headers.Authorization = `Token ${PISTON_KEY}`;

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      // If unauthorized and the requested language is JS, try a safe local fallback
      if (response.status === 401 && language === 'javascript') {
        try {
          const fallback = runJavaScriptInBrowser(code);
          return { success: true, output: fallback };
        } catch (e) {
          return { success: false, error: 'Remote executor unauthorized and local JS fallback failed: ' + e.message };
        }
      }

      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();

    const output = data.run.output || "";
    const stderr = data.run.stderr || "";

    if (stderr) {
      return {
        success: false,
        output: output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

  // Very small helper to run JS code in the browser as a fallback.
  // It captures console.log output and returns combined stdout.
  function runJavaScriptInBrowser(code) {
    const logs = [];
    const originalConsoleLog = console.log;
    try {
      console.log = (...args) => {
        try { logs.push(args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ')); } catch (e) { logs.push(String(args)); }
        try { originalConsoleLog.apply(console, args); } catch (e) {}
      };

      // Wrap code in an async IIFE to support top-level await and return value printing
      const wrapped = `(async () => {\ntry {\n${code}\n} catch (e) { console.log('Error:', e && e.message ? e.message : String(e)); }\n})();`;
      // eslint-disable-next-line no-new-func
      const fn = new Function(wrapped);
      fn();

      // give microtasks a tick to run (best-effort)
      // Note: this is synchronous — we assume code logs synchronously for simple exercises
      return logs.join('\n') || 'No output';
    } finally {
      console.log = originalConsoleLog;
    }
  }

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}