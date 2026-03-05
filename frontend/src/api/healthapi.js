import API from "./api";

/**
 * GET /
 * @returns {{ app, version, status, services }}
 */
export const getHealth = () =>
  API.get("/");