import React, { useRef, useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 4, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Allow only one digit
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Trigger callback if complete
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    // Move to next input if value is entered
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-4 justify-center w-full my-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={clsx(
            "w-16 h-16 text-center text-2xl font-urbanist font-bold rounded-lg border-2 focus:outline-none transition-all",
            digit 
              ? "bg-white border-primary-dark text-primary-dark" 
              : "bg-[#F7F8F9] border-[#E8ECF4] text-primary-dark",
            "focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark"
          )}
        />
      ))}
    </div>
  );
};
