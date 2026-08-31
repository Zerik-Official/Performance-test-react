/**
 * Role guard.
 * @module app/router/guards/RoleGuard
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';

interface Props {
  children: React.ReactNode;
  role: 'admin' | 'user';
}

/**
 * Redirects if role mismatch.
 * @param {Props} props - Props.
 * @returns {React.ReactElement} Element.
 */
export function RoleGuard({ children, role }: Props): React.ReactElement {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user || user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}