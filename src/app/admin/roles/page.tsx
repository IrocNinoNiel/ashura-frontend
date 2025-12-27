'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import apiClient from '@/lib/api-client';

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  _count?: {
    users: number;
    permissions: number;
  };
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiClient.get('/roles');
        setRoles(response.data.data.roles || []);
      } catch (err) {
        console.error('Failed to fetch roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin', 'super_admin']}>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Roles</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Permissions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">
                                {role.displayName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {role.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            {role.isSystem ? (
                              <Badge variant="info">System</Badge>
                            ) : (
                              <Badge variant="default">Custom</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {role.isActive ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="default">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>{role._count?.users || 0}</TableCell>
                          <TableCell>{role._count?.permissions || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
