'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import apiClient from '@/lib/api-client';

interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  lastActiveAt: string;
  createdAt: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/profile/sessions');
      setSessions(response.data.data.sessions || []);
    } catch (err) {
      console.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to revoke this session?')) return;

    try {
      setRevoking(sessionId);
      await apiClient.delete(`/profile/sessions/${sessionId}`);
      await fetchSessions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to revoke session');
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm('Are you sure you want to logout from all devices? You will be logged out from this device as well.')) return;

    try {
      await apiClient.post('/auth/logout-all');
      window.location.href = '/login';
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to logout from all devices');
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
            <Button variant="danger" onClick={handleRevokeAll}>
              Logout All Devices
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSpinner />
              ) : sessions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No active sessions</p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">
                              {session.userAgent.includes('Windows') ? 'Windows' :
                               session.userAgent.includes('Mac') ? 'Mac' :
                               session.userAgent.includes('Linux') ? 'Linux' : 'Unknown Device'}
                            </h3>
                            <Badge variant="info">
                              {session.userAgent.includes('Chrome') ? 'Chrome' :
                               session.userAgent.includes('Firefox') ? 'Firefox' :
                               session.userAgent.includes('Safari') ? 'Safari' : 'Browser'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            IP Address: {session.ipAddress}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Last active: {formatDate(session.lastActiveAt)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Signed in: {formatDate(session.createdAt)}
                          </p>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                          isLoading={revoking === session.id}
                        >
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
