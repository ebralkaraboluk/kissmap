import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) throw error;

      router.replace('/password-changed');
    } catch (err: any) {
      setError(err.message || "Şifre güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View className="w-full mb-8">
        <Text className="font-urbanist font-bold text-[30px] text-primary-dark mb-2">
          ŞİFRE OLUŞTURUN
        </Text>
        <Text className="font-urbanist font-medium text-base text-white/90">
          Yeni bir şifre oluşturunuz
        </Text>
      </View>

      <View className="w-full gap-4">
        <Input
          placeholder="New Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          className="bg-[#F7F8F9] border-[#E8ECF4]"
        />
        <Input
          placeholder="Confirm Password"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          className="bg-[#F7F8F9] border-[#E8ECF4]"
        />

        {error && (
          <View className="bg-red-100 p-3 rounded-lg">
            <Text className="text-red-600 text-sm font-urbanist text-center">{error}</Text>
          </View>
        )}

        <Button onPress={handleSubmit} isLoading={loading} title="Reset Password" className="mt-4" />
      </View>
    </AuthLayout>
  );
}
