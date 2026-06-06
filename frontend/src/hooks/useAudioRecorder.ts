import { useEffect, useRef, useState } from "react";

/**
 * Represents the current recording state of the microphone recorder.
 *
 * idle      = user has not started recording
 * recording = microphone recording is currently active
 * stopped   = recording has finished
 */
type RecordingStatus = "idle" | "recording" | "stopped";

/**
 * Defines what this custom hook gives back to the component that uses it.
 *
 * This makes the hook easier to understand and safer because TypeScript
 * knows exactly which values and functions are returned.
 */
type UseAudioRecorderReturn = {
  recordingStatus: RecordingStatus;
  recordedAudio: Blob | null;
  recordingTime: number;
  errorMessage: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
};

/**
 * Custom hook for managing browser microphone recording.
 *
 * This hook keeps recording logic separate from UI components.
 * UI components should only call these functions and display these values.
 */
export function useAudioRecorder(): UseAudioRecorderReturn {
  /**
   * Stores the current recording status.
   *
   * useState is used because the UI must re-render when the status changes.
   */
  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>("idle");

  /**
   * Stores the final recorded audio as a Blob.
   *
   * Blob is browser file-like binary data.
   * Later, this Blob will be sent to the Django backend as an audio file.
   */
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  /**
   * Stores recording duration in seconds.
   *
   * Later we will connect this to a timer interval.
   */
  const [recordingTime, setRecordingTime] = useState(0);

  /**
   * Stores user-friendly error messages.
   *
   * Example: microphone permission denied or browser recording not supported.
   */
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Stores the browser's MediaRecorder object.
   *
   * useRef is used because this internal object should persist between renders
   * but should not trigger a UI re-render when it changes.
   */
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  /**
   * Stores the active microphone stream.
   *
   * We keep this so we can stop all microphone tracks after recording ends.
   * This prevents the microphone from staying active in the browser.
   */
  const mediaStreamRef = useRef<MediaStream | null>(null);

  /**
   * Stores audio chunks while recording.
   *
   * MediaRecorder gives data in small chunks.
   * When recording stops, we combine those chunks into one Blob.
   */
  const audioChunksRef = useRef<Blob[]>([]);


    /**
   * Starts and cleans up the recording timer.
   *
   * When recordingStatus becomes "recording", this effect creates a timer
   * that increases recordingTime every second.
   *
   * When recordingStatus changes or the component is removed from the page,
   * clearInterval stops the old timer so multiple timers do not run together.
   */
  useEffect(() => {
    if (recordingStatus !== "recording") {
      return;
    }

    const timerId = window.setInterval(() => {
      setRecordingTime((previousTime) => previousTime + 1);
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [recordingStatus]);

  /**
   * Starts a new microphone recording session.
   *
   * Steps:
   * 1. Ask browser for microphone permission.
   * 2. Create a MediaRecorder from the microphone stream.
   * 3. Store audio chunks when data is available.
   * 4. Start recording.
   */
  async function startRecording() {
    try {
      setErrorMessage("");
      setRecordedAudio(null);
      setRecordingTime(0);
      audioChunksRef.current = [];

      /**
       * Ask the browser for microphone access.
       * If the user blocks permission, this line will throw an error.
       */
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      mediaStreamRef.current = stream;

      /**
       * Create the browser recorder using the microphone stream.
       * audio/webm is commonly supported by modern browsers for MediaRecorder.
       */
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      /**
       * This event runs whenever the browser has recorded audio data available.
       * We store each audio chunk in audioChunksRef.
       */
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      /**
       * This event runs after recording stops.
       * We combine all chunks into one final audio Blob.
       */
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        setRecordedAudio(audioBlob);
        setRecordingStatus("stopped");

        /**
         * Stop microphone tracks so the browser no longer keeps the mic active.
         */
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      };

      mediaRecorder.start();
      setRecordingStatus("recording");
    } catch (error) {
      setRecordingStatus("idle");

      /**
       * A simple user-friendly error message.
       * We keep the technical error in console for developer debugging.
       */
      setErrorMessage("Unable to access microphone. Please allow microphone permission.");
      console.error("Microphone recording error:", error);
    }
  }

  /**
   * Stops the current recording session.
   *
   * MediaRecorder will then trigger the onstop event,
   * where we create the final recorded audio Blob.
   */
  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  /**
   * Resets the recorder back to its starting state.
   *
   * This clears UI state and internal recording references.
   */
  function resetRecording() {
    setRecordingStatus("idle");
    setRecordedAudio(null);
    setRecordingTime(0);
    setErrorMessage("");

    audioChunksRef.current = [];
    mediaRecorderRef.current = null;

    /**
     * Safety cleanup:
     * If a microphone stream is still active, stop it.
     */
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }

  /**
   * Return only the values and actions that UI components need.
   *
   * Internal refs stay hidden inside the hook.
   */
  return {
    recordingStatus,
    recordedAudio,
    recordingTime,
    errorMessage,
    startRecording,
    stopRecording,
    resetRecording,
  };
}