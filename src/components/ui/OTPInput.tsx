import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { clsx } from 'clsx';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 4, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (isNaN(Number(text))) return;

    const newOtp = [...otp];
    // Take only the last character if multiple exist
    newOtp[index] = text.length > 1 ? text[text.length - 1] : text;
    setOtp(newOtp);

    // Trigger callback if complete
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    // Move to next input if value is entered
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row gap-4 justify-center w-full my-4">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          className={clsx(
            "w-16 h-16 text-center text-2xl font-urbanist font-bold rounded-lg border-2",
            digit 
              ? "bg-white border-primary-dark text-primary-dark" 
              : "bg-[#F7F8F9] border-[#E8ECF4] text-primary-dark"
          )}
        />
      ))}
    </View>
  );
};
