import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}