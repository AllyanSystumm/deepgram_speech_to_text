import styles from "./AppShell.module.css";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandPrimary}>Vox</span>
          <span className={styles.brandSecondary}>Scribe</span>
        </div>

        <nav className={styles.nav}>
          <a className={styles.navLink} href="#">
            Home
          </a>
          <a className={styles.navLink} href="#">
            Transcripts
          </a>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>© 2026 VoxScribe</footer>
    </div>
  );
}