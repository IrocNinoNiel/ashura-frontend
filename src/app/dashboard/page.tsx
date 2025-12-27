'use client';

import { AuthGuard } from '@/components/guards/AuthGuard';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {user?.firstName} {user?.lastName}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-green-600">
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email Verified:</span>
                    <span className="text-sm font-medium">
                      {user?.isEmailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">2FA:</span>
                    <span className="text-sm font-medium">
                      {user?.is2FAEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Member since:</span>
                    <p className="text-sm font-medium">
                      {user?.createdAt && formatDate(user.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Last login:</span>
                    <p className="text-sm font-medium">
                      {user?.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user?.roles && user.roles.length > 0 ? (
                    user.roles.map((ur) => (
                      <div
                        key={ur.role.id}
                        className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded"
                      >
                        {ur.role.displayName}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No roles assigned</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="/dashboard/profile"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">Edit Profile</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Update your personal information
                  </p>
                </a>
                <a
                  href="/dashboard/security"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">Security Settings</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Manage password and 2FA
                  </p>
                </a>
                <a
                  href="/dashboard/sessions"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">Active Sessions</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    View and manage your sessions
                  </p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
