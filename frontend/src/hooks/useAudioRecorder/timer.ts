import { useEffect, useState } from "react";
import { RecordingStatus } from "./types";

/**
 * Small hook that manages the recording time counter.
 * Keeps timing logic separate so the main hook stays focused.
 */
export function useRecorderTimer(recordingStatus: RecordingStatus) {
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    if (recordingStatus !== "recording") {
      return;
    }

    const timerId = window.setInterval(() => {
      setRecordingTime((previous) => previous + 1);
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [recordingStatus]);

  function resetTimer() {
    setRecordingTime(0);
  }

  return { recordingTime, resetTimer };
}
