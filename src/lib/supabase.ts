import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Hata fırlatmak yerine uyarı veriyoruz ve güvenli bir kontrol yapıyoruz.
// Bu sayede uygulama çökmez, sadece login olmaya çalışınca hata verir.
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('://.supabase.co')) {
  console.warn('⚠️ Supabase Configuration Warning: Invalid URL or Key. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
