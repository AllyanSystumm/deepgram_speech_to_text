"use client";

import { useState } from "react";

import { RecorderCard } from "@/components/recorder/RecorderCard";
import { TranscriptPanel } from "@/components/transcript/TranscriptPanel";
import { Notification } from "@/components/ui/Notification";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { uploadAudioForTranscription } from "@/services/transcriptionApi";

import styles from "./TranscriptionDashboard.module.css";

/**
 * TranscriptionDashboard manages the interactive transcription workflow.
 *
 * This component is intentionally a Client Component because it uses:
 * - React state
 * - browser recording logic through useAudioRecorder
 * - button click handlers
 * - frontend-to-backend API calls
 *
 * Keeping this logic here allows page.tsx to stay clean and focused on routing/layout.
 */
export function TranscriptionDashboard() {
  /**
   * Stores the transcript text returned by the Django backend.
   *
   * This value is passed to TranscriptPanel so the transcript can appear
   * on the right side of the dashboard.
   */
  const [transcriptText, setTranscriptText] = useState("");

  /**
   * Tracks whether the frontend is waiting for the backend/Deepgram response.
   *
   * This helps disable buttons while transcription is in progress.
   */
  const [isTranscribing, setIsTranscribing] = useState(false);

  /**
   * Stores upload/transcription errors from the backend API.
   *
   * This is separate from microphone errors returned by useAudioRecorder.
   */
  const [transcriptionError, setTranscriptionError] = useState("");

  /**
   * Stores the success message shown after transcription is completed.
   *
   * Keeping this as state allows us to show and close the notification.
   */
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Get browser recording state and actions from the custom hook.
   *
   * The hook owns microphone logic.
   * This component only uses the values and functions returned by the hook.
   */
  const {
    recordingStatus,
    recordedAudio,
    recordingTime,
    errorMessage,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  /**
   * Sends the recorded audio Blob to the Django backend.
   *
   * The API details are handled inside uploadAudioForTranscription().
   * This keeps this component focused on feature coordination, not HTTP details.
   */
  async function handleTranscribeAudio() {
    if (!recordedAudio) {
      setTranscriptionError("Please record audio before requesting transcription.");
      return;
    }

    try {
      setIsTranscribing(true);
      setTranscriptionError("");
      setSuccessMessage("");
      setTranscriptText("");

      const response = await uploadAudioForTranscription(recordedAudio);

      setTranscriptText(response.data.transcript_text);
      setSuccessMessage(response.message);
    } catch (error) {
      setTranscriptionError(
        error instanceof Error
          ? error.message
          : "Something went wrong while transcribing audio.",
      );
    } finally {
      setIsTranscribing(false);
    }
  }

  /**
   * Clears the success notification when the user closes it.
   */
  function handleCloseSuccessNotification() {
    setSuccessMessage("");
  }

  return (
    <>
      {/* Success notification shown after backend transcription completes. */}
      {successMessage ? (
        <Notification
          title="Transcription Complete"
          message={successMessage}
          variant="success"
          onClose={handleCloseSuccessNotification}
        />
      ) : null}

      {/* Show microphone permission/browser recording errors. */}
      {errorMessage ? (
        <div className={styles.errorBanner}>{errorMessage}</div>
      ) : null}

      {/* Show backend upload/transcription errors. */}
      {transcriptionError ? (
        <div className={styles.errorBanner}>{transcriptionError}</div>
      ) : null}

      {/* Main dashboard: recorder on the left, transcript on the right. */}
      <section className={styles.dashboardGrid}>
        <RecorderCard
          recordingStatus={recordingStatus}
          recordingTime={recordingTime}
          isTranscribing={isTranscribing}
          hasRecordedAudio={Boolean(recordedAudio)}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onResetRecording={resetRecording}
          onTranscribeAudio={handleTranscribeAudio}
        />

        <TranscriptPanel transcriptText={transcriptText} />
      </section>
    </>
  );
}