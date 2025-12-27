'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const userRoles = user?.roles?.map((ur) => ur.role.name) || [];
  const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

  useEffect(() => {
    if (!loading && !hasPermission) {
      router.push('/dashboard');
    }
  }, [hasPermission, loading, router]);

  if (loading || !hasPermission) {
    return null;
  }

  return <>{children}</>;
}
