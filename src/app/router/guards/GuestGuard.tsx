/**
 * Guest guard.
 * @module app/router/guards/GuestGuard
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';

interface Props {
  children: React.ReactNode;
}

/**
 * Redirects authenticated users from guest pages.
 * @param {Props} props - Props.
 * @returns {React.ReactElement} Element.
 */
export function GuestGuard({ children }: Props): React.ReactElement {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}