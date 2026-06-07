/** Types used by the audio recorder hook. */
export type RecordingStatus = "idle" | "recording" | "stopped";

export type UseAudioRecorderReturn = {
  recordingStatus: RecordingStatus;
  recordedAudio: Blob | null;
  recordingTime: number;
  errorMessage: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
};
