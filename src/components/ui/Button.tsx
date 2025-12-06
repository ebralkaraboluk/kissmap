import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "w-full bg-primary-dark text-white rounded-lg py-4 font-urbanist font-semibold text-[15px] hover:bg-primary-dark/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center",
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
