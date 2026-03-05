import API from "./api";

/**
 * POST /api/legal-lens/analyze
 * Multipart form: image (file) + language
 * @param {File}   imageFile    - JPEG / PNG / WebP, max 5MB
 * @param {string} language     - Language code (default: "hi")
 * @returns {{ status, filename, language, language_code, analysis, model, response_time }}
 *
 * Supported language codes:
 * hi, bn, te, mr, ta, gu, kn, ml, pa, or, as, ur, en
 */
export const analyzeLegalDocument = (imageFile, language = "hi") => {
  const formData = new FormData();
  formData.append("image", imageFile);   // ← field name is "image"
  formData.append("language", language);

  return API.post("/api/legal-lens/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};