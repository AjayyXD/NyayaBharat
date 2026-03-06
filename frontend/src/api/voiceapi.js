import API from "./api";

/**
 * POST /api/voice/complaint
 * Multipart form: audio (file) + language + location
 * @param {File}   audioFile - mp3/wav/ogg file object
 * @param {string} language  - Language code (default: "hi")
 * @param {string} location  - City or district (default: "")
 * @returns {{ status, complaint_drafted, authorities_notified, transcript, response_time }}
 */
export const fileVoiceComplaint = (audioFile, language = "hi", location = "") => {
  const formData = new FormData();
  formData.append("audio", audioFile);   // ← field name is "audio"
  formData.append("language", language);
  formData.append("location", location);

  return API.post("/api/voice/complaint", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};