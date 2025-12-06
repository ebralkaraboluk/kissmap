import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) throw error;

      navigate('/password-changed');
    } catch (err: any) {
      setError(err.message || "Şifre güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full text-left mb-8">
        <h1 className="font-urbanist font-bold text-[30px] text-primary-dark mb-2">
          ŞİFRE OLUŞTURUN
        </h1>
        <p className="font-urbanist font-medium text-base text-white/90">
          Yeni bir şifre oluşturunuz
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input
          name="password"
          type="password"
          placeholder="New Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-[#F7F8F9] border-[#E8ECF4]"
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="bg-[#F7F8F9] border-[#E8ECF4]"
        />

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm font-urbanist text-center">
            {error}
          </div>
        )}

        <Button type="submit" isLoading={loading} className="mt-4">
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}
