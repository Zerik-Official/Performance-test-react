/**
 * Profile page.
 * @module features/profile/pages/Profile
 */
import { useAuth } from '@shared/context/AuthContext';
import { Card, CardHeader, CardContent } from '@shared/components/ui/card';

/**
 * Profile template.
 * @returns {React.ReactElement} Element.
 */
export function Profile(): React.ReactElement {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <Card className="max-w-lg">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </CardHeader>
        <CardContent>
          <p className="text-sm"><span className="font-medium">Email:</span> {user?.email}</p>
          <p className="text-sm"><span className="font-medium">Role:</span> {user?.role}</p>
          <p className="text-sm"><span className="font-medium">Name:</span> {user?.name}</p>
        </CardContent>
      </Card>
    </div>
  );
}