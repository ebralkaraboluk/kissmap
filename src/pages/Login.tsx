import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        navigate('/map');
      }
    } catch (err: any) {
      setError(err.message === "Invalid login credentials" 
        ? "E-posta veya şifre hatalı." 
        : err.message || "Giriş yaparken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Background lip images positions (Reused for consistency)
  const bgImages = [
    { top: '5%', left: '-5%', rotate: -15, scale: 1.2 },
    { top: '15%', right: '-10%', rotate: 25, scale: 1.1 },
    { top: '40%', left: '10%', rotate: -10, scale: 0.9 },
    { top: '35%', right: '15%', rotate: 15, scale: 1.0 },
    { bottom: '10%', left: '-5%', rotate: -20, scale: 1.3 },
    { bottom: '5%', right: '-5%', rotate: 10, scale: 1.2 },
  ];

  const lipUrl = "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/7363/c1e7/3a1c0047915353b1903a980254b78dee?Expires=1765756800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ok~4l~PHfdG9pcr1mnfn0M-UOPSs6U4DGycYwToVFfElQMX-RwIlMhwrpgOyhpAvWXnKPzJdApUwXpyiX8cqg7g8qlk3i1Z6bjcdBKr4vhqThc12~pzZQwHHOXPBtKoDJ5c8iwiKIzzN-IQWPN9tiqXyUvyvPUPJN6Q-HDTG1vgcwJHPPdrIdAqMXGxvyUJmpDDjNz9FXrTwnEZ44~gdYUxplZFqW9bxaziKPL-ZnN6YF-ymV0WOQycNUsvqNcTWrb0kK0C5QX2n0j3L2xTga1zV7yQIWpuEKdLqZP7JyeL1zAoBCxqtxPuR1vH2f5vtAsfNhOIfSajfNK2LYpSVEw__";

  return (
    <div className="min-h-screen w-full bg-primary-pink relative overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
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

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 flex flex-col items-center"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-gurajada text-[64px] text-primary-dark leading-none mb-2">
            KISSMAP
          </h1>
          <p className="font-gurajada text-[24px] text-primary-dark leading-tight max-w-[300px] mx-auto">
            DUDAK İZLERİNİ BIRAK, ANILARINI HARİTADA YAŞAT
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="bg-white border-transparent focus:border-primary-dark/20"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="bg-white border-transparent focus:border-primary-dark/20"
            value={formData.password}
            onChange={handleChange}
            required
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none hover:text-primary-dark transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          <div className="flex justify-end w-full">
            <Link 
              to="/forgot-password" 
              className="font-urbanist font-semibold text-sm text-white hover:opacity-80 transition-opacity"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm font-urbanist text-center">
              {error}
            </div>
          )}

          <Button type="submit" isLoading={loading} className="mt-6">
            Login
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-poppins text-[15px] text-[#1E232C]">
            Don't have an account?{' '}
            <Link to="/" className="font-bold text-primary-dark hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
