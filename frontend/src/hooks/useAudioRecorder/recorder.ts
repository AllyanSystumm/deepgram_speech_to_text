import { MutableRefObject } from "react";
import { RecordingStatus } from "./types";

type CreateRecorderParams = {
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>;
  mediaStreamRef: MutableRefObject<MediaStream | null>;
  audioChunksRef: MutableRefObject<Blob[]>;
  setRecordingStatus: (s: RecordingStatus) => void;
  setRecordedAudio: (b: Blob | null) => void;
  setErrorMessage: (m: string) => void;
  resetTimer: () => void;
};

/**
 * Returns handlers (start/stop/reset) wired to the provided refs and setters.
 * This keeps imperative MediaRecorder code out of the main hook body.
 */
export function createRecorderHandlers({
  mediaRecorderRef,
  mediaStreamRef,
  audioChunksRef,
  setRecordingStatus,
  setRecordedAudio,
  setErrorMessage,
  resetTimer,
}: CreateRecorderParams) {
  async function startRecording() {
    try {
      setErrorMessage("");
      setRecordedAudio(null);
      resetTimer();
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedAudio(audioBlob);
        setRecordingStatus("stopped");

        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      };

      mediaRecorder.start();
      setRecordingStatus("recording");
    } catch (error) {
      setRecordingStatus("idle");
      setErrorMessage("Unable to access microphone. Please allow microphone permission.");
      // keep console for developers
      // eslint-disable-next-line no-console
      console.error("Microphone recording error:", error);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  function resetRecording() {
    setRecordingStatus("idle");
    setRecordedAudio(null);
    setErrorMessage("");

    audioChunksRef.current = [];
    mediaRecorderRef.current = null;

    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    resetTimer();
  }

  return { startRecording, stopRecording, resetRecording };
}
