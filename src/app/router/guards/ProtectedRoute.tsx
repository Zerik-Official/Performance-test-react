/**
 * Protected route guard.
 * @module app/router/guards/ProtectedRoute
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';

interface Props {
  children: React.ReactNode;
}

/**
 * Redirects to login if not authenticated.
 * @param {Props} props - Props.
 * @returns {React.ReactElement} Element.
 */
export function ProtectedRoute({ children }: Props): React.ReactElement {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}