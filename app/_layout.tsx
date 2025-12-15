import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { 
  Gurajada_400Regular 
} from '@expo-google-fonts/gurajada';
import { 
  Urbanist_400Regular, 
  Urbanist_500Medium, 
  Urbanist_600SemiBold, 
  Urbanist_700Bold 
} from '@expo-google-fonts/urbanist';
import {
  Poppins_400Regular,
  Poppins_600SemiBold
} from '@expo-google-fonts/poppins';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, Platform } from 'react-native';

// NativeWind stillerinin çalışması için CSS dosyasını import ediyoruz
import "../src/index.css"; 

// Web ortamında splash screen hatasını önle
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Gurajada_400Regular,
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      if (Platform.OS !== 'web') {
        SplashScreen.hideAsync();
      }
      setIsReady(true);
    }
  }, [fontsLoaded]);

  // Web için font yüklenmese bile belirli bir süre sonra açılmasını sağla (Fallback)
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Leaflet CSS'i Web ortamında inject et
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const timer = setTimeout(() => setIsReady(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFD3E7' }}>
        <ActivityIndicator size="large" color="#A72761" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFD3E7' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-code" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="password-changed" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
