/**
 * User Profile page component displaying account details and metadata.
 * @module features/profile/pages/Profile
 */
import { useAuth } from '@shared/context/AuthContext';
import { Card, CardHeader, CardContent } from '@shared/components/ui/card';
import { User, Mail, ShieldCheck, Calendar } from 'lucide-react';

/**
 * Renders an enhanced profile page with clean layout and structured user metadata.
 * @returns {React.ReactElement} The rendered profile component.
 */
export function Profile(): React.ReactElement {
  const { user } = useAuth();

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email ? email[0].toUpperCase() : "U";
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar / Identity Card */}
        <Card className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="size-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold shadow-md">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{user?.name || "User Account"}</h2>
            <p className="text-xs text-muted-foreground capitalize bg-secondary px-2.5 py-1 rounded-full inline-block font-medium">
              {user?.role || "Member"}
            </p>
          </div>
        </Card>

        {/* Right Column: Detailed Information */}
        <Card className="md:col-span-2 flex flex-col justify-between">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="size-5 text-muted-foreground" /> Account Details
            </h3>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-4" /> Email Address
                </span>
                <p className="font-medium text-foreground">{user?.email || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4" /> System Role
                </span>
                <p className="font-medium text-foreground uppercase text-xs tracking-wider pt-0.5">
                  {user?.role || "user"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <User className="size-4" /> Full Name
                </span>
                <p className="font-medium text-foreground">{user?.name || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-4" /> Account Status
                </span>
                <p className="font-medium text-emerald-600 flex items-center gap-1.5 pt-0.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Active Session
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}