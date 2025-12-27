'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import apiClient from '@/lib/api-client';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/admin/audit-logs?page=${page}&limit=20`);
        setLogs(response.data.data.logs || []);
        setTotalPages(response.data.meta?.pagination?.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch audit logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case 'LOGIN':
      case 'LOGOUT':
        return <Badge variant="info">{action}</Badge>;
      case 'CREATE':
        return <Badge variant="success">{action}</Badge>;
      case 'UPDATE':
        return <Badge variant="warning">{action}</Badge>;
      case 'DELETE':
        return <Badge variant="danger">{action}</Badge>;
      default:
        return <Badge variant="default">{action}</Badge>;
    }
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin', 'super_admin']}>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Resource</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Timestamp</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {logs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {log.user.firstName} {log.user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {log.user.email}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getActionBadge(log.action)}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {log.resource}
                                  </div>
                                  {log.resourceId && (
                                    <div className="text-sm text-gray-500">
                                      ID: {log.resourceId.substring(0, 8)}...
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{log.ipAddress}</TableCell>
                              <TableCell>{formatDate(log.createdAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-4 flex justify-between items-center">
                        <Button
                          disabled={page === 1}
                          onClick={() => setPage(page - 1)}
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                          Page {page} of {totalPages}
                        </span>
                        <Button
                          disabled={page === totalPages}
                          onClick={() => setPage(page + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
