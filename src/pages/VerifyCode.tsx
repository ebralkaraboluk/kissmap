import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { OTPInput } from '../components/ui/OTPInput';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

export default function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (otp.length !== 4) {
      setError("Lütfen 4 haneli kodu giriniz.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });

      if (error) throw error;

      navigate('/reset-password');
    } catch (err: any) {
      setError("Kod hatalı veya süresi dolmuş.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    await supabase.auth.resetPasswordForEmail(email);
    alert("Kod tekrar gönderildi.");
  };

  return (
    <AuthLayout>
      <div className="w-full text-left mb-8">
        <h1 className="font-urbanist font-bold text-[30px] text-primary-dark mb-2">
          KODU GİRİNİZ
        </h1>
        <p className="font-urbanist font-medium text-base text-white/90">
          Mail adresinize gelen kodu giriniz.
        </p>
      </div>

      <div className="w-full space-y-6">
        <OTPInput length={4} onComplete={(code) => setOtp(code)} />

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm font-urbanist text-center">
            {error}
          </div>
        )}

        <Button onClick={handleVerify} isLoading={loading}>
          Verify
        </Button>
      </div>

      <div className="mt-8 text-center">
        <p className="font-poppins text-[15px] text-[#1E232C]">
          Didn't received code?{' '}
          <button onClick={handleResend} className="font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">
            Resend
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
