import API from "./api";

/**
 * POST /api/rights/query
 * @param {string} question - The legal question to ask
 * @param {string} language - Language code (default: "hi")
 * @returns {{ question, answer, citations, language, response_time }}
 */
export const queryRights = (question, language = "hi") =>
  API.post("/api/rights/query", {
    question,   // ← exact field name from LegalQueryRequest
    language,
  });