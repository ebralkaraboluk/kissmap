import React from 'react';
import { motion } from 'framer-motion';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Arka plan desenleri (Tüm sayfalarda ortak)
const bgImages = [
  { top: '5%', left: '-5%', rotate: -15, scale: 1.2 },
  { top: '15%', right: '-10%', rotate: 25, scale: 1.1 },
  { top: '40%', left: '10%', rotate: -10, scale: 0.9 },
  { top: '35%', right: '15%', rotate: 15, scale: 1.0 },
  { bottom: '20%', left: '-5%', rotate: -20, scale: 1.3 },
  { bottom: '15%', right: '-5%', rotate: 10, scale: 1.2 },
];
const lipUrl = "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/7363/c1e7/3a1c0047915353b1903a980254b78dee?Expires=1765756800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ok~4l~PHfdG9pcr1mnfn0M-UOPSs6U4DGycYwToVFfElQMX-RwIlMhwrpgOyhpAvWXnKPzJdApUwXpyiX8cqg7g8qlk3i1Z6bjcdBKr4vhqThc12~pzZQwHHOXPBtKoDJ5c8iwiKIzzN-IQWPN9tiqXyUvyvPUPJN6Q-HDTG1vgcwJHPPdrIdAqMXGxvyUJmpDDjNz9FXrTwnEZ44~gdYUxplZFqW9bxaziKPL-ZnN6YF-ymV0WOQycNUsvqNcTWrb0kK0C5QX2n0j3L2xTga1zV7yQIWpuEKdLqZP7JyeL1zAoBCxqtxPuR1vH2f5vtAsfNhOIfSajfNK2LYpSVEw__";

export const MobileContainer: React.FC<MobileContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`h-dvh w-full bg-primary-pink relative overflow-hidden flex flex-col pt-safe ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        {bgImages.map((style, i) => (
          <motion.img
            key={i}
            src={lipUrl}
            alt="background decoration"
            className="absolute w-48 h-auto object-contain mix-blend-multiply"
            style={{
              ...style,
              transform: `rotate(${style.rotate}deg) scale(${style.scale})`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        ))}
      </div>
      
      {/* Main Content Wrapper - Pushes content above nav bar */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden pb-24">
        {children}
      </div>
    </div>
  );
};
