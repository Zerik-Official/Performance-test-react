/**
 * App providers wrapper.
 * @module app/providers/AppProviders
 */
import { AuthProvider } from '@shared/context/AuthContext';
import { ToastProvider } from '@/shared/context/ToastContext';

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps app with providers.
 * @param {Props} props - Props.
 * @returns {React.ReactElement} Element.
 */
export function AppProviders({ children }: Props): React.ReactElement {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}