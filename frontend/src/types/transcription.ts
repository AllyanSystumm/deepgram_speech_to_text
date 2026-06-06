/**
 * Represents one transcription record returned by the Django backend.
 *
 * This shape should match the JSON response from our Django serializer.
 */
export type Transcription = {
  id: number;
  audio_file: string;
  transcript_text: string;
  status: "pending" | "completed" | "failed";
  error_message: string;
  created_at: string;
  updated_at: string;
};

/**
 * Represents the full API response after uploading audio.
 *
 * The backend returns:
 * {
 *   message: "...",
 *   data: { transcription record }
 * }
 */
export type TranscriptionApiResponse = {
  message: string;
  data: Transcription;
};