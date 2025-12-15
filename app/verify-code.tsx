import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { OTPInput } from '@/components/ui/OTPInput';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function VerifyCode() {
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (otp.length !== 4) {
      setError("Lütfen 4 haneli kodu giriniz.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });

      if (error) throw error;

      router.replace('/reset-password');
    } catch (err: any) {
      setError("Kod hatalı veya süresi dolmuş.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    await supabase.auth.resetPasswordForEmail(email);
    alert("Kod tekrar gönderildi.");
  };

  return (
    <AuthLayout>
      <View className="w-full mb-8">
        <Text className="font-urbanist font-bold text-[30px] text-primary-dark mb-2">
          KODU GİRİNİZ
        </Text>
        <Text className="font-urbanist font-medium text-base text-white/90">
          Mail adresinize gelen kodu giriniz.
        </Text>
      </View>

      <View className="w-full gap-6">
        <OTPInput length={4} onComplete={(code) => setOtp(code)} />

        {error && (
          <View className="bg-red-100 p-3 rounded-lg">
            <Text className="text-red-600 text-sm font-urbanist text-center">{error}</Text>
          </View>
        )}

        <Button onPress={handleVerify} isLoading={loading} title="Verify" />
      </View>

      <View className="mt-8 items-center">
        <Text className="font-poppins text-[15px] text-[#1E232C]">
          Didn't received code?{' '}
          <TouchableOpacity onPress={handleResend}>
            <Text className="font-bold text-primary-dark">Resend</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </AuthLayout>
  );
}
