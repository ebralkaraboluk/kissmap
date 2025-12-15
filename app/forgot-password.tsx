import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      // In mobile, we usually navigate to verify code manually since deep links are trickier
      router.push({ pathname: '/verify-code', params: { email } });
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View className="w-full mb-8">
        <Text className="font-urbanist font-bold text-[30px] text-primary-dark mb-2">
          ŞİFREMİ UNUTTUM
        </Text>
        <Text className="font-urbanist font-medium text-base text-white/90">
          Lütfen şifre yenileme için kod gönderebileceğimiz bir mail adresi giriniz.
        </Text>
      </View>

      <View className="w-full gap-6">
        <Input
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          className="bg-[#F7F8F9] border-[#E8ECF4]"
        />

        {error && (
          <View className="bg-red-100 p-3 rounded-lg">
            <Text className="text-red-600 text-sm font-urbanist text-center">{error}</Text>
          </View>
        )}

        <Button onPress={handleSubmit} isLoading={loading} title="Send Code" />
      </View>

      <View className="mt-8 items-center">
        <Text className="font-poppins text-[15px] text-[#1E232C]">
          Remember Password?{' '}
          <Link href="/login" asChild>
            <Text className="font-bold text-primary-dark">Login</Text>
          </Link>
        </Text>
      </View>
    </AuthLayout>
  );
}
