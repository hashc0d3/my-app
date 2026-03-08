import { ReactNode } from 'react';
import classNames from 'classnames';

/** Пропсы карточки: контент, активное состояние, опциональный клик (карточка становится кнопкой по a11y). */
export interface CardProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

function handleCardKeyDown(onClick?: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };
}

/** Карточка для выбора (модели, ремешки). Поддерживает клик и клавиатуру; стили через className. */
export const Card = ({ children, isActive = false, onClick, className }: CardProps) => {
  const isInteractive = Boolean(onClick);
  const handleKeyDown = isInteractive ? handleCardKeyDown(onClick) : undefined;
  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={isInteractive ? isActive : undefined}
      className={classNames(
        "rounded-[20px] border transition-all",
        isInteractive && "cursor-pointer",
        isActive
          ? "bg-white !border-[#5078DF]"
          : "bg-[#f5f5f5] !border-transparent",
        className
      )}
      {...(isInteractive && {
        onClick,
        onKeyDown: handleKeyDown
      })}
    >
      {children}
    </div>
  );
};
