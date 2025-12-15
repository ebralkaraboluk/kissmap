import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
  title?: string;
  className?: string;
}

export const Button = ({ className, children, isLoading, disabled, title, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
      className={cn(
        "w-full bg-primary-dark rounded-lg py-4 flex items-center justify-center active:opacity-90",
        (disabled || isLoading) && "opacity-70",
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        title ? (
            <Text className="text-white font-urbanist font-semibold text-[15px]">{title}</Text>
        ) : (
            children
        )
      )}
    </TouchableOpacity>
  );
};
