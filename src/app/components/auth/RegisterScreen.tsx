import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { AlertCircle, CheckCircle2, Loader2, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

interface RegisterScreenProps {
  onRegister: (name: string, email: string, password: string, role: string) => void;
  onSwitchToLogin: () => void;
}

export function RegisterScreen({ onRegister, onSwitchToLogin }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        onRegister(name, email, password, role);
      }, 500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">KEMET Platform</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestion intelligente des réseaux de recharge électrique en Afrique
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Créer un compte</CardTitle>
            <CardDescription>Rejoignez la plateforme KEMET</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertDescription>Inscription réussie ! Redirection...</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@kemet-energy.bj"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || success}
                />
                <p className="text-xs text-gray-500">Minimum 6 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle utilisateur</Label>
                <Select value={role} onValueChange={setRole} disabled={isLoading || success}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrateur">Administrateur</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                  disabled={isLoading || success}
                >
                  Se connecter
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2026 KEMET Energy Solutions - Tous droits réservés</p>
          <p className="mt-1">Plateforme certifiée pour la gestion d'infrastructures critiques</p>
        </div>
      </div>
    </div>
  );
}
