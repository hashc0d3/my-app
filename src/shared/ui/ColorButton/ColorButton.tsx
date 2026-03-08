import classNames from 'classnames';

/** Кнопка-светофор: отображает цвет (например выбор цвета корпуса/ремешка). */
export interface ColorButtonProps {
  color: string;
  isActive?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ColorButton = ({ color, isActive = false, onClick, size = 'md' }: ColorButtonProps) => {
  const sizeStyles = {
    sm: 'min-w-[38px] min-h-[38px] p-2.5',
    md: 'min-w-[46px] min-h-[46px] p-3',
    lg: 'min-w-[52px] min-h-[52px] p-3.5',
  };

  return (
    <button
      className={classNames(
        'flex items-center justify-center rounded-full bg-[#f5f5f5] border transition-all',
        sizeStyles[size],
        isActive ? 'border-[#5078DF]' : 'border-transparent'
      )}
      onClick={onClick}
    >
      <span className="w-full h-full rounded-full" style={{ background: color }} />
    </button>
  );
};
