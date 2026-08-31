/**
 * Header component.
 * @module shared/components/layout/Header
 */
import { useAuth } from '@shared/context/AuthContext';

/**
 * Header bar.
 * @returns {React.ReactElement} Element.
 */
export function Header(): React.ReactElement {
  const { user } = useAuth();
  return (
    <div className="flex h-14 items-center justify-end border-b bg-background px-4">
      {user && <span className="text-sm text-muted-foreground"><i className="fa-solid fa-user-tie"></i> {user.name}</span>}
    </div>
  );
}