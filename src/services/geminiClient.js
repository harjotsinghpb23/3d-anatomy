/**
 * geminiClient.js
 * ---------------------------------------------------------------------------
 * Thin, dependency-free client for the Google Gemini REST API (the same model
 * family exposed through Google AI Studio).
 *
 * The API key is read from the build-time environment variable
 * VITE_GEMINI_API_KEY. Never commit a real key; see AI_CHATBOT_SETUP.md.
 * ---------------------------------------------------------------------------

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

/** Resolve the configured API key (empty string if not set). */
export function getApiKey() {
  return (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
}

/** Resolve the preferred model id, with a sensible default. */
export function getModel() {
  return (import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash").trim();
}

/**
 * Candidate models tried in order when the preferred model is unavailable
 * (404 Not Found / model not enabled for the key's project).
 */
const MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-pro",
];

/** Build the endpoint URL for a given model. */
function endpointFor(model) {
  return `${API_BASE}/models/${model}:generateContent?key=${encodeURIComponent(
    getApiKey()
  )}`;
}

/**
 * Call Gemini with a single user message and a pre-built system instruction.
 *
 * @param {string} userMessage
 * @param {string} systemInstruction
 * @param {Array<{role:"user"|"model", parts:{text:string}[]}>} history
 * @returns {Promise<string>} the assistant text reply.
 */
export async function askGemini(userMessage, systemInstruction, history = []) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "MISSING_KEY: No API key configured. Set VITE_GEMINI_API_KEY in your environment and rebuild."
    );
  }

  const contents = [
    ...history.map((turn) => ({
      role: turn.role,
      parts: turn.parts,
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const candidates = [
    getModel(),
    ...MODEL_FALLBACKS.filter((m) => m !== getModel()),
  ];

  let lastError = null;
  for (const model of candidates) {
    try {
      const response = await fetch(endpointFor(model), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generation_config: {
            temperature: 0.2,
            top_p: 0.8,
            max_output_tokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        if (response.status === 403) {
          throw new Error(
            "AUTH_FAILED: The API key was rejected (403). Check VITE_GEMINI_API_KEY and confirm the Gemini API is enabled for that key's project."
          );
        }
        if (response.status === 404) {
          // Model not available for this key/project — try the next candidate.
          lastError = new Error(`MODEL_UNAVAILABLE: ${model} (404)`);
          continue;
        }
        throw new Error(`API_ERROR: Gemini returned HTTP ${response.status}. ${body}`);
      }

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p) => p?.text || "")
          .join("")
          ?.trim() || "";

      if (!text) {
        // Surface the reason Gemini gave (finishReason / safety) instead of an empty reply.
        const reason = data?.candidates?.[0]?.finishReason || "unknown";
        throw new Error(
          `EMPTY_RESPONSE: Gemini returned no text (finishReason: ${reason}). Try rephrasing the question.`
        );
      }
      return text;
    } catch (err) {
      // Network failures and auth failures should not trigger fallbacks.
      if (err.message.startsWith("AUTH_FAILED") || err.message.startsWith("MISSING_KEY")) {
        throw err;
      }
      lastError = err;
      // Continue to the next candidate model only for transient/unavailable cases.
      if (err.message.startsWith("MODEL_UNAVAILABLE") || err.message.startsWith("API_ERROR")) {
        continue;
      }
      // Genuine network error — stop retrying.
      break;
    }
  }

  throw lastError || new Error("UNKNOWN: Gemini returned no usable response.");
}