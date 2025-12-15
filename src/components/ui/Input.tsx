import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends TextInputProps {
  error?: string;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, error, endIcon, containerClassName, ...props }, ref) => {
    return (
      <View className={cn("w-full relative", containerClassName)}>
        <View className="relative w-full">
          <TextInput
            ref={ref}
            className={cn(
              "w-full bg-input-bg border border-input-border rounded-lg px-4 py-4 text-input-text font-urbanist font-medium",
              endIcon && "pr-12",
              error && "border-red-500",
              className
            )}
            placeholderTextColor="#8391A1"
            {...props}
          />
          {endIcon && (
            <View className="absolute right-4 top-0 bottom-0 justify-center items-center">
              {endIcon}
            </View>
          )}
        </View>
        {error && <Text className="mt-1 text-sm text-red-500 font-urbanist">{error}</Text>}
      </View>
    );
  }
);
