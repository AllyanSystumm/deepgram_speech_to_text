import { TRANSCRIPTION_API_URL } from "@/constants/api";
import type { TranscriptionApiResponse } from "@/types/transcription";

/**
 * Sends a recorded audio Blob to the Django backend for transcription.
 *
 * This file belongs to the service layer.
 * Its job is only to communicate with the backend API.
 *
 * UI components should not directly know the API URL or fetch details.
 */
export async function uploadAudioForTranscription(
  audioBlob: Blob,
): Promise<TranscriptionApiResponse> {
  /**
   * FormData is used because the backend expects multipart/form-data.
   * This is the same format used when uploading files from an HTML form.
   */
  const formData = new FormData();

  /**
   * The key must be "audio_file" because the Django backend reads:
   * request.FILES.get("audio_file")
   *
   * The filename is included so Django receives the file with a proper name.
   */
  formData.append("audio_file", audioBlob, "recording.webm");

  /**
   * Send the audio file to the Django backend.
   *
   * We do not manually set the Content-Type header here.
   * The browser automatically sets the correct multipart boundary for FormData.
   */
  const response = await fetch(TRANSCRIPTION_API_URL, {
    method: "POST",
    body: formData,
  });

  /**
   * Read the JSON body returned by Django.
   * It may contain either success data or error details.
   */
  const responseData = await response.json();

  /**
   * If Django returns a non-2xx status, throw an error so the page
   * can show a user-friendly failure message.
   */
  if (!response.ok) {
    throw new Error(responseData.message || "Failed to transcribe audio.");
  }

  return responseData as TranscriptionApiResponse;
}