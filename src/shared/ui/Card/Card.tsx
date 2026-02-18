import { ReactNode } from 'react';
import classNames from 'classnames';

interface CardProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Card = ({ children, isActive = false, onClick, className }: CardProps) => {
  return (
    <div
      className={classNames(
        'rounded-[20px] border cursor-pointer transition-all',
        isActive
          ? 'bg-white border-[#5078DF]'
          : 'bg-[#f5f5f5] border-transparent hover:border-[#b3b3b3]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
