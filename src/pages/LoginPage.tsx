import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Library, Mail, Lock, Loader2 } from 'lucide-react';

// Mock login for demo purposes (remove when connecting to real API)
const mockLogin = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const mockUsers = {
    'admin@library.com': { id: '1', email: 'admin@library.com', role: 'ADMIN' as const, name: 'Admin User' },
    'responsable@library.com': { id: '2', email: 'responsable@library.com', role: 'RESPONSABLE' as const, name: 'Library Manager' },
    'client@library.com': { id: '3', email: 'client@library.com', role: 'CLIENT' as const, name: 'John Doe' },
  };

  const user = mockUsers[email as keyof typeof mockUsers];
  if (user && password === 'password') {
    return { token: 'mock-jwt-token', user };
  }
  throw new Error('Invalid credentials');
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use mock login for demo, replace with real API call
      const response = await mockLogin(email, password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${response.user.role.toLowerCase()}`,
      });
      
      navigate('/dashboard');
      window.location.reload(); // Refresh to update auth state
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Try admin@library.com / password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-4 bottom-1/4 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md animate-scale-in p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg">
            <Library className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">LibraryMS</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your library
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@library.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Demo Credentials:
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><strong>Admin:</strong> admin@library.com</p>
            <p><strong>Responsable:</strong> responsable@library.com</p>
            <p><strong>Client:</strong> client@library.com</p>
            <p><strong>Password:</strong> password</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
