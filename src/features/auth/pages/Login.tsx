/**
 * Login page - independent without sidebar.
 * @module features/auth/pages/Login
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { toApiError } from '@shared/utils/errors';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Card, CardHeader, CardContent } from '@shared/components/ui/card';

/**
 * Login form with controlled inputs.
 * @returns {React.ReactElement} Element.
 */
export function Login(): React.ReactElement {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.type === 'validation') setError(apiError.message);
      else if (apiError.type === 'auth') setError('Invalid credentials');
      else if (apiError.type === 'network') setError('Backend unavailable');
      else setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-white text-black">
        <CardHeader className="flex flex-col items-center">
          <h1 className="flex items-center gap-2 text-2xl font-semibold"><i className="fa-solid fa-right-to-bracket" /> Login</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required spellCheck="false" />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required spellCheck="false" />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className={`w-full bg-black text-white hover:bg-black/9 hover:text-black ${loading ? '' : 'cursor-pointer'}`}>
              <i className="fa-solid fa-arrow-right-to-bracket mr-2" />
              {loading ? 'Loading...' : 'Login'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              No account? <Link to="/register" className="text-black underline">Register</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
