import { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

/**
 * Пропсы кнопки (shared/ui).
 * Расширяет нативный button; вариант, размер и fullWidth — опциональны.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

/** Переиспользуемая кнопка: варианты, размеры, доступность. Один источник правды для стилей кнопок. */
export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  const baseStyles = 'rounded-full border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#5078DF] text-white border-transparent hover:brightness-95',
    secondary: 'bg-[#e9e9e9] text-black border-transparent hover:border-[#b3b3b3]',
    outline: 'bg-transparent text-[#5078DF] border-[#5078DF] hover:bg-[#5078DF] hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      className={classNames(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
