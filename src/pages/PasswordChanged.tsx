import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { Check } from 'lucide-react';

export default function PasswordChanged() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center w-full">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-[#A72761] rounded-full flex items-center justify-center mb-8 relative">
            {/* Jagged edge simulation using pseudo elements or simpler CSS shape for now */}
            <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
        </div>

        <h1 className="font-gurajada text-[26px] text-primary-dark mb-8 text-center">
          ŞİFRE DEĞİŞTİRİLDİ
        </h1>

        <Button onClick={() => navigate('/login')} className="w-full">
          Back to Login
        </Button>
      </div>
    </AuthLayout>
  );
}
