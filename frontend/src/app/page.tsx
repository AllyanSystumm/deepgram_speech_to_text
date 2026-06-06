import { AppShell } from "@/components/layout/AppShell";
import { TranscriptionDashboard } from "@/components/transcript/TranscriptionDashboard";

import styles from "./page.module.css";

/**
 * HomePage is the route-level page for "/".
 *
 * This file should stay clean and simple:
 * - It renders the main application shell.
 * - It renders the page heading.
 * - It loads the interactive transcription dashboard.
 *
 * The recording state, microphone logic, API upload, and notification behavior
 * are handled inside TranscriptionDashboard and useAudioRecorder.
 */
export default function HomePage() {
  return (
    <AppShell>
      {/* Page heading section. */}
      <section className={styles.pageHeader}>
        <h1>Start Transcribing</h1>
        <p>Record your voice and generate an English transcript using VoxScribe.</p>
      </section>

      {/* Interactive dashboard for recording and transcription. */}
      <TranscriptionDashboard />
    </AppShell>
  );
}