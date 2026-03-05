import API from "./api";

/**
 * GET /api/officer/departments
 * @returns {{ departments: { [key]: "Department Name" } }}
 *
 * Department keys: general, revenue, police, municipal, health,
 * education, pwd, electricity, water, social, agriculture, transport
 */
export const getDepartments = () =>
  API.get("/api/officer/departments");

/**
 * POST /api/officer/scan-petition
 * Multipart form: image (file) + department + language
 * @param {File}   imageFile  - JPEG / PNG / WebP, max 5MB
 * @param {string} department - Department key from getDepartments() (default: "general")
 * @param {string} language   - Language code for formal document output (default: "en")
 * @returns {{ status, filename, department, language, language_code,
 *             transcription, formal_document, model, response_time }}
 *
 * Supported language codes:
 * en, hi, bn, te, mr, ta, gu, kn, ml, pa, or, as, ur
 */
export const scanPetition = (imageFile, department = "general", language = "en") => {
  const formData = new FormData();
  formData.append("image", imageFile);        // ← field name is "image"
  formData.append("department", department);  // ← field name is "department"
  formData.append("language", language);

  return API.post("/api/officer/scan-petition", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};