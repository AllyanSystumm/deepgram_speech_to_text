import { useRef, useState } from "react";

import { RecordingStatus, UseAudioRecorderReturn } from "./types";
import { useRecorderTimer } from "./timer";
import { createRecorderHandlers } from "./recorder";

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>("idle");

  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Internal refs (do not trigger renders)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Timer hook provides recordingTime and a reset function
  const { recordingTime, resetTimer } = useRecorderTimer(recordingStatus);

  const { startRecording, stopRecording, resetRecording } = createRecorderHandlers({
    mediaRecorderRef,
    mediaStreamRef,
    audioChunksRef,
    setRecordingStatus,
    setRecordedAudio,
    setErrorMessage,
    resetTimer,
  });

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

export default useAudioRecorder;
