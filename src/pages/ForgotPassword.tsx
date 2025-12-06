import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      // Navigate to verify code page, passing the email
      navigate('/verify-code', { state: { email } });
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full text-left mb-8">
        <h1 className="font-urbanist font-bold text-[30px] text-primary-dark mb-2">
          ŞİFREMİ UNUTTUM
        </h1>
        <p className="font-urbanist font-medium text-base text-white/90">
          Lütfen şifre yenileme için kod gönderebileceğimiz bir mail adresi giriniz.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#F7F8F9] border-[#E8ECF4]"
        />

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm font-urbanist text-center">
            {error}
          </div>
        )}

        <Button type="submit" isLoading={loading}>
          Send Code
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="font-poppins text-[15px] text-[#1E232C]">
          Remember Password?{' '}
          <Link to="/login" className="font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
