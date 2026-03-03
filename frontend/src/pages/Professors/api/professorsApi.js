// Professors API — centralizes GET/POST/DELETE
// Uses VITE_API_URL from env; no hardcoded localhost

import { apiRequest } from "../../../api";

const BASE = "/api/professors";

/**
 * @returns {Promise<Array<{ _id: string, name: string, email: string, department?: string, university?: string, createdAt?: string }>>}
 */
export async function getProfessors() {
  try {
    const data = await apiRequest(BASE);
    if (!Array.isArray(data)) return [];
    return data;
  } catch (e) {
    throw new Error(e.message || "Couldn't load professors.");
  }
}

/**
 * @param {{ name: string, email: string, department?: string, university?: string }} payload
 */
export async function createProfessor(payload) {
  try {
    const res = await apiRequest(`${BASE}/add`, "POST", payload);
    return res;
  } catch (e) {
    throw new Error(e.message || "Couldn't add professor.");
  }
}

/**
 * @param {string} id - professor _id
 */
export async function deleteProfessor(id) {
  try {
    const res = await apiRequest(`${BASE}/${id}`, "DELETE");
    return res;
  } catch (e) {
    throw new Error(e.message || "Couldn't delete professor.");
  }
}
