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
import { useAuth } from '@/context/AuthContext';
import { profileUpdateSchema, ProfileUpdateInput } from '@/lib/validations/auth.schema';
import apiClient from '@/lib/api-client';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    try {
      setError('');
      setSuccess(false);
      await apiClient.patch('/profile', {
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && <Alert variant="error" message={error} onClose={() => setError('')} />}
                {success && (
                  <Alert variant="success" message="Profile updated successfully!" />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    type="text"
                    required
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />

                  <Input
                    label="Last name"
                    type="text"
                    required
                    error={errors.lastName?.message}
                    {...register('lastName')}
                  />
                </div>

                <Input
                  label="Email address"
                  type="email"
                  disabled
                  helperText="Email cannot be changed. Contact support if needed."
                  {...register('email')}
                />

                <div className="flex justify-end">
                  <Button type="submit" isLoading={isSubmitting}>
                    Save changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={user?.theme || 'light'}
                    onChange={async (e) => {
                      try {
                        await apiClient.patch('/profile/preferences', {
                          theme: e.target.value,
                        });
                        await refreshUser();
                      } catch (err) {
                        console.error('Failed to update theme');
                      }
                    }}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
