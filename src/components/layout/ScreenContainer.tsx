import React from 'react';
import { View, Image } from 'react-native';
import { MotiImage } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
}

const bgImages = [
  { top: '5%', left: '-5%', rotate: '-15deg', scale: 1.2 },
  { top: '15%', right: '-10%', rotate: '25deg', scale: 1.1 },
  { top: '40%', left: '10%', rotate: '-10deg', scale: 0.9 },
  { top: '35%', right: '15%', rotate: '15deg', scale: 1.0 },
  { bottom: '20%', left: '-5%', rotate: '-20deg', scale: 1.3 },
  { bottom: '15%', right: '-5%', rotate: '10deg', scale: 1.2 },
];
const lipUrl = "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/7363/c1e7/3a1c0047915353b1903a980254b78dee?Expires=1765756800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ok~4l~PHfdG9pcr1mnfn0M-UOPSs6U4DGycYwToVFfElQMX-RwIlMhwrpgOyhpAvWXnKPzJdApUwXpyiX8cqg7g8qlk3i1Z6bjcdBKr4vhqThc12~pzZQwHHOXPBtKoDJ5c8iwiKIzzN-IQWPN9tiqXyUvyvPUPJN6Q-HDTG1vgcwJHPPdrIdAqMXGxvyUJmpDDjNz9FXrTwnEZ44~gdYUxplZFqW9bxaziKPL-ZnN6YF-ymV0WOQycNUsvqNcTWrb0kK0C5QX2n0j3L2xTga1zV7yQIWpuEKdLqZP7JyeL1zAoBCxqtxPuR1vH2f5vtAsfNhOIfSajfNK2LYpSVEw__";

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, className = "" }) => {
  return (
    <View className={`flex-1 bg-primary-pink relative ${className}`}>
      <StatusBar style="dark" />
      {/* Background Pattern */}
      <View className="absolute inset-0 opacity-40 z-0 overflow-hidden pointer-events-none">
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
      
      <SafeAreaView className="flex-1 z-10" edges={['top', 'left', 'right']}>
        {children}
      </SafeAreaView>
    </View>
  );
};
