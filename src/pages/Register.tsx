import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          // Redirect to origin ensures we stay on the same domain after email confirmation if enabled
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Successful signup
        // In a real app, you might want to show a success message or redirect to login
        // Assuming email confirmation might be off or handled gracefully
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || "Kayıt olurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Background lip images positions
  const bgImages = [
    { top: '5%', left: '-5%', rotate: -15, scale: 1.2 },
    { top: '15%', right: '-10%', rotate: 25, scale: 1.1 },
    { top: '40%', left: '10%', rotate: -10, scale: 0.9 },
    { top: '35%', right: '15%', rotate: 15, scale: 1.0 },
    { bottom: '10%', left: '-5%', rotate: -20, scale: 1.3 },
    { bottom: '5%', right: '-5%', rotate: 10, scale: 1.2 },
  ];

  const lipUrl = "https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/7363/c1e7/3a1c0047915353b1903a980254b78dee?Expires=1765756800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ok~4l~PHfdG9pcr1mnfn0M-UOPSs6U4DGycYwToVFfElQMX-RwIlMhwrpgOyhpAvWXnKPzJdApUwXpyiX8cqg7g8qlk3i1Z6bjcdBKr4vhqThc12~pzZQwHHOXPBtKoDJ5c8iwiKIzzN-IQWPN9tiqXyUvyvPUPJN6Q-HDTG1vgcwJHPPdrIdAqMXGxvyUJmpDDjNz9FXrTwnEZ44~gdYUxplZFqW9bxaziKPL-ZnN6YF-ymV0WOQycNUsvqNcTWrb0kK0C5QX2n0j3L2xTga1zV7yQIWpuEKdLqZP7JyeL1zAoBCxqtxPuR1vH2f5vtAsfNhOIfSajfNK2LYpSVEw__";

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
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm font-urbanist text-center">
              {error}
            </div>
          )}

          <Button type="submit" isLoading={loading} className="mt-6">
            Register
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-poppins text-[15px] text-[#1E232C]">
            Do have an account?{' '}
            <Link to="/login" className="font-bold hover:underline">
              Login Now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
