import styles from "./Card.module.css";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return <section className={`${styles.card} ${className}`}>{children}</section>;
}