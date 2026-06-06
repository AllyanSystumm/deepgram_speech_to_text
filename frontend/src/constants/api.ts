/**
 * Base URL of the Django backend.
 *
 * Keeping this in one constants file makes the app easier to maintain.
 * If the backend URL changes later, we only update it here.
 */
export const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * API endpoint for creating a transcription.
 *
 * Final URL:
 * http://127.0.0.1:8000/api/transcriptions/
 */
export const TRANSCRIPTION_API_URL = `${API_BASE_URL}/api/transcriptions/`;