import styles from "./Notification.module.css";

/**
 * Controls the visual style of the notification.
 *
 * success = positive action completed
 * error   = something failed
 */
type NotificationVariant = "success" | "error";

/**
 * Props for the reusable Notification component.
 *
 * This component is intentionally simple:
 * it only displays a message and optional close button.
 */
type NotificationProps = {
  title: string;
  message: string;
  variant?: NotificationVariant;
  onClose?: () => void;
};

/**
 * Reusable notification box.
 *
 * This keeps notification UI separate from page logic.
 * The page decides when to show it; this component only displays it.
 */
export function Notification({
  title,
  message,
  variant = "success",
  onClose,
}: NotificationProps) {
  return (
    <div className={`${styles.notification} ${styles[variant]}`}>
      <div className={styles.icon}>{variant === "success" ? "✓" : "!"}</div>

      <div className={styles.content}>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>

      {onClose ? (
        <button className={styles.closeButton} type="button" onClick={onClose}>
          Close
        </button>
      ) : null}
    </div>
  );
}