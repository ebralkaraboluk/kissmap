import React from 'react';
import { View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MotiView, MotiImage } from 'moti';
import { StatusBar } from 'expo-status-bar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  // Background lip images positions
  const bgImages = [
    { top: '5%', left: '-5%', rotate: '-15deg', scale: 1.2 },
    { top: '15%', right: '-10%', rotate: '25deg', scale: 1.1 },
    { top: '40%', left: '10%', rotate: '-10deg', scale: 0.9 },
    { top: '35%', right: '15%', rotate: '15deg', scale: 1.0 },
    { bottom: '10%', left: '-5%', rotate: '-20deg', scale: 1.3 },
    { bottom: '5%', right: '-5%', rotate: '10deg', scale: 1.2 },
  ];

  const lipUrl = "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/7363/c1e7/3a1c0047915353b1903a980254b78dee?Expires=1765756800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ok~4l~PHfdG9pcr1mnfn0M-UOPSs6U4DGycYwToVFfElQMX-RwIlMhwrpgOyhpAvWXnKPzJdApUwXpyiX8cqg7g8qlk3i1Z6bjcdBKr4vhqThc12~pzZQwHHOXPBtKoDJ5c8iwiKIzzN-IQWPN9tiqXyUvyvPUPJN6Q-HDTG1vgcwJHPPdrIdAqMXGxvyUJmpDDjNz9FXrTwnEZ44~gdYUxplZFqW9bxaziKPL-ZnN6YF-ymV0WOQycNUsvqNcTWrb0kK0C5QX2n0j3L2xTga1zV7yQIWpuEKdLqZP7JyeL1zAoBCxqtxPuR1vH2f5vtAsfNhOIfSajfNK2LYpSVEw__";

  return (
    <View className="flex-1 bg-primary-pink">
      <StatusBar style="dark" />
      {/* Background Pattern */}
      <View className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {bgImages.map((style, i) => (
          <MotiImage
            key={i}
            source={{ uri: lipUrl }}
            className="absolute w-48 h-48"
            resizeMode="contain"
            style={{
              top: style.top as any,
              left: style.left as any,
              right: style.right as any,
              bottom: style.bottom as any,
              transform: [{ rotate: style.rotate }, { scale: style.scale }]
            }}
            from={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ type: 'timing', duration: 1000, delay: i * 100 }}
          />
        ))}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}
            showsVerticalScrollIndicator={false}
        >
          <MotiView 
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="w-full max-w-md items-center"
          >
            {children}
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
