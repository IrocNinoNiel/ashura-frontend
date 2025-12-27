'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { changePasswordSchema, ChangePasswordInput } from '@/lib/validations/auth.schema';
import apiClient from '@/lib/api-client';

export default function SecurityPage() {
  const { user, refreshUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      setError('');
      setSuccess(false);
      await apiClient.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleToggle2FA = async () => {
    try {
      setTwoFALoading(true);
      if (user?.is2FAEnabled) {
        await apiClient.post('/auth/2fa/disable');
      } else {
        await apiClient.post('/auth/2fa/enable');
      }
      await refreshUser();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle 2FA');
    } finally {
      setTwoFALoading(false);
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && <Alert variant="error" message={error} onClose={() => setError('')} />}
                {success && (
                  <Alert variant="success" message="Password changed successfully!" />
                )}

                <Input
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                  required
                  error={errors.currentPassword?.message}
                  {...register('currentPassword')}
                />

                <Input
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  required
                  error={errors.newPassword?.message}
                  helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
                  {...register('newPassword')}
                />

                <Input
                  label="Confirm new password"
                  type="password"
                  autoComplete="new-password"
                  required
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />

                <div className="flex justify-end">
                  <Button type="submit" isLoading={isSubmitting}>
                    Change password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      2FA Status
                    </p>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge variant={user?.is2FAEnabled ? 'success' : 'warning'}>
                    {user?.is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleToggle2FA}
                    variant={user?.is2FAEnabled ? 'danger' : 'primary'}
                    isLoading={twoFALoading}
                  >
                    {user?.is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
