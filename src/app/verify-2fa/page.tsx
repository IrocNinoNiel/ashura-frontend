'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { verifyOTPSchema, VerifyOTPInput } from '@/lib/validations/auth.schema';
import apiClient from '@/lib/api-client';

export default function Verify2FAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOTPInput>({
    resolver: zodResolver(verifyOTPSchema),
  });

  useEffect(() => {
    if (!sessionId) {
      router.push('/login');
    }
  }, [sessionId, router]);

  const onSubmit = async (data: VerifyOTPInput) => {
    try {
      setError('');
      const response = await apiClient.post('/auth/2fa/verify', {
        otp: data.otp,
        sessionId,
      });

      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code');
    }
  };

  const handleResendOTP = async () => {
    try {
      setError('');
      await apiClient.post('/auth/2fa/resend', { sessionId });
      setCanResend(false);
      setTimeout(() => setCanResend(true), 60000); // Allow resend after 1 minute
      alert('A new OTP code has been sent to your email');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setCanResend(true), 60000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthLayout
      title="Two-Factor Authentication"
      subtitle="Enter the 6-digit code sent to your email"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <Alert variant="error" message={error} onClose={() => setError('')} />}

        <Input
          label="OTP Code"
          type="text"
          maxLength={6}
          placeholder="000000"
          required
          error={errors.otp?.message}
          {...register('otp')}
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Verify
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-600">Didn't receive the code? </span>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={!canResend}
            className="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Resend OTP
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
