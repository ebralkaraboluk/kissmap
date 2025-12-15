import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        router.replace('/(tabs)/map');
      }
    } catch (err: any) {
      setError(err.message === "Invalid login credentials" 
        ? "E-posta veya şifre hatalı." 
        : err.message || "Giriş yaparken bir hata oluştu.");
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
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-white border-transparent"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <Input
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          className="bg-white border-transparent"
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          endIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#A72761" /> : <Eye size={20} color="#A72761" />}
            </TouchableOpacity>
          }
        />

        <View className="flex-row justify-end w-full">
          <Link href="/forgot-password" asChild>
            <TouchableOpacity>
              <Text className="font-urbanist font-semibold text-sm text-white">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {error && (
          <View className="bg-red-100 p-3 rounded-lg">
            <Text className="text-red-600 text-sm font-urbanist text-center">{error}</Text>
          </View>
        )}

        <Button onPress={handleLogin} isLoading={loading} title="Login" className="mt-4" />
      </View>

      <View className="mt-8 items-center">
        <Text className="font-poppins text-[15px] text-[#1E232C]">
          Don't have an account?{' '}
          <Link href="/" asChild>
            <Text className="font-bold text-primary-dark">Register Now</Text>
          </Link>
        </Text>
      </View>
    </AuthLayout>
  );
}
