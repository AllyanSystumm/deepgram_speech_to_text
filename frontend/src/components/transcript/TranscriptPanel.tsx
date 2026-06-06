import { Card } from "@/components/ui/Card";

import styles from "./TranscriptPanel.module.css";

type TranscriptPanelProps = {
  transcriptText?: string;
};

export function TranscriptPanel({ transcriptText }: TranscriptPanelProps) {
  const hasTranscript = Boolean(transcriptText?.trim());

  return (
    <Card className={styles.transcriptPanel}>
      <div className={styles.panelHeader}>
        <h2>Live Transcript</h2>
        <span className={styles.statusBadge}>
          {hasTranscript ? "Completed" : "Waiting"}
        </span>
      </div>

      <div className={styles.transcriptBody}>
        {hasTranscript ? (
          <p className={styles.transcriptText}>{transcriptText}</p>
        ) : (
          <p className={styles.emptyState}>
            Your transcript will appear here after recording.
          </p>
        )}
      </div>
    </Card>
  );
}