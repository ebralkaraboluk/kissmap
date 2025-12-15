import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        router.replace('/login');
      }
    } catch (err: any) {
      setError(err.message || "Kayıt olurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View className="items-center mb-12">
        <Text className="font-gurajada text-[64px] text-primary-dark leading-[64px] mb-2">
          KISSMAP
        </Text>
        <Text className="font-gurajada text-[24px] text-primary-dark leading-[26px] text-center max-w-[300px]">
          DUDAK İZLERİNİ BIRAK, ANILARINI HARİTADA YAŞAT
        </Text>
      </View>

      <View className="w-full gap-4">
        <Input
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => handleChange('username', text)}
        />
        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
        />
        <Input
          placeholder="Confirm password"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
        />

        {error && (
          <View className="bg-red-100 p-3 rounded-lg">
            <Text className="text-red-600 text-sm font-urbanist text-center">{error}</Text>
          </View>
        )}

        <Button onPress={handleSubmit} isLoading={loading} title="Register" className="mt-2" />
      </View>

      <View className="mt-8 items-center">
        <Text className="font-poppins text-[15px] text-[#1E232C]">
          Do have an account?{' '}
          <Link href="/login" asChild>
            <Text className="font-bold text-primary-dark">Login Now</Text>
          </Link>
        </Text>
      </View>
    </AuthLayout>
  );
}
