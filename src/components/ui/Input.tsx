import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, endIcon, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <div className="relative">
          <input
            className={cn(
              "w-full bg-input-bg border border-input-border rounded-lg px-4 py-4 text-input-text placeholder-primary-dark/50 font-urbanist font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/20 transition-all",
              endIcon && "pr-12",
              error && "border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-dark/50 flex items-center justify-center">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500 font-urbanist">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
