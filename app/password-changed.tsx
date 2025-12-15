import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react-native';

export default function PasswordChanged() {
  return (
    <AuthLayout>
      <View className="items-center justify-center w-full">
        {/* Success Icon */}
        <View className="w-24 h-24 bg-[#A72761] rounded-full items-center justify-center mb-8 relative">
            <Check size={48} color="white" strokeWidth={4} />
        </View>

        <Text className="font-gurajada text-[26px] text-primary-dark mb-8 text-center">
          ŞİFRE DEĞİŞTİRİLDİ
        </Text>

        <Button onPress={() => router.replace('/login')} title="Back to Login" className="w-full" />
      </View>
    </AuthLayout>
  );
}
