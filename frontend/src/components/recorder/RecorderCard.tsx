import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import styles from "./RecorderCard.module.css";

/**
 * Props required by the RecorderCard component.
 *
 * This component does not own recording logic itself.
 * It receives recording state and event functions from the parent page.
 */
type RecorderCardProps = {
  recordingStatus: "idle" | "recording" | "stopped";
  recordingTime: number;
  isTranscribing: boolean;
  hasRecordedAudio: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetRecording: () => void;
  onTranscribeAudio: () => void;
};

/**
 * Shows the microphone recording UI.
 *
 * Responsibility of this component:
 * - Display recording status
 * - Display timer
 * - Show microphone button
 * - Show Stop, Reset, and Transcribe buttons
 *
 * It does not directly access the microphone.
 * Microphone logic stays inside useAudioRecorder.
 */
export function RecorderCard({
  recordingStatus,
  recordingTime,
  isTranscribing,
  hasRecordedAudio,
  onStartRecording,
  onStopRecording,
  onResetRecording,
  onTranscribeAudio,
}: RecorderCardProps) {
  /**
   * Boolean values make the JSX easier to read.
   * Instead of repeating recordingStatus === "recording" many times,
   * we store the result in a clear variable.
   */
  const isRecording = recordingStatus === "recording";
  const isStopped = recordingStatus === "stopped";

  /**
   * Status label shown at the top of the recorder card.
   * This changes based on the current recording state.
   */
  const statusLabel = isRecording
    ? "Recording"
    : isStopped
      ? "Recording Stopped"
      : "Ready to Record";

  /**
   * Simple timer formatting.
   *
   * Example:
   * recordingTime = 5  → 00:05
   * recordingTime = 12 → 00:12
   */
  const formattedTime = `00:${String(recordingTime).padStart(2, "0")}`;

  return (
    <Card className={styles.recorderCard}>
      {/* Top status row: shows recording state and timer. */}
      <div className={styles.recordingStatus}>
        <span className={isRecording ? styles.statusDotActive : styles.statusDot} />
        <span>{statusLabel}</span>
        <span className={styles.timer}>{formattedTime}</span>
      </div>

      {/* Main microphone button. */}
      <div className={styles.micWrapper}>
        <button
          className={styles.micButton}
          type="button"
          aria-label="Start recording"
          disabled={isRecording || isTranscribing}
          onClick={onStartRecording}
        >
          🎙️
        </button>
      </div>

      {/* User guidance text below the microphone. */}
      <p className={styles.recordingText}>
        {isTranscribing
          ? "Transcribing your audio..."
          : isRecording
            ? "Recording in progress..."
            : isStopped
              ? "Recording stopped. You can transcribe or reset it."
              : "Click the microphone to start speaking."}
      </p>

      {/* Recording control buttons. */}
      <div className={styles.controls}>
        <Button
          variant="secondary"
          disabled={!isStopped || isTranscribing}
          onClick={onResetRecording}
        >
          Reset
        </Button>

        <Button
          variant="danger"
          disabled={!isRecording || isTranscribing}
          onClick={onStopRecording}
        >
          Stop
        </Button>
      </div>

      {/* Transcription action button. */}
      <div className={styles.transcribeAction}>
        <Button
          variant="primary"
          disabled={!hasRecordedAudio || isRecording || isTranscribing}
          onClick={onTranscribeAudio}
        >
          {isTranscribing ? "Transcribing..." : "Transcribe Audio"}
        </Button>
      </div>

      {/* Microphone selector placeholder. Disabled for now. */}
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="mic-input">
          Mic Input:
        </label>

        <select className={styles.select} id="mic-input" disabled>
          <option>Built-in Microphone</option>
        </select>
      </div>

      {/* Language selector placeholder. Disabled because backend is currently fixed to English. */}
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="language">
          Language:
        </label>

        <select className={styles.select} id="language" disabled>
          <option>English (US)</option>
        </select>
      </div>
    </Card>
  );
}