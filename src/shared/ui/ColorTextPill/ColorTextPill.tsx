import classNames from "classnames";
import styles from "./ColorTextPill.module.css";

/** Пилл с точкой цвета и подписью (например опции кожи/строчки в конфигураторе). */
export interface ColorTextPillProps {
  label: string;
  color?: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const ColorTextPill = ({
  label,
  color = "transparent",
  isActive = false,
  onClick,
  disabled = false,
  className = ""
}: ColorTextPillProps) => {
  return (
    <button
      className={classNames(
        styles.root,
        isActive && styles.active,
        disabled && styles.disabled,
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={styles.dot}
        style={{ backgroundColor: color }}
      />
      <span className={styles.label}>{label}</span>
    </button>
  );
};
