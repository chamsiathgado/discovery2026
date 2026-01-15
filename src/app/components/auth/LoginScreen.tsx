import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { AlertCircle, CheckCircle2, Loader2, Zap, Sparkles, Shield, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginScreen({ onLogin, onSwitchToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'administrateur'>('client');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        onLogin(email, password, role);
      }, 500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f0f9f6] dark:from-black dark:via-[#0a0a0a] dark:to-[#0f1412] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#306754]/5 dark:bg-[#4a8c74]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4a8c74]/5 dark:bg-[#306754]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6 group">
            <div className="relative">
              <img 
                src="/logo_kemet.png" 
                alt="KEMET Automotive" 
                className="w-20 h-20 object-contain transition-transform group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-20 h-20 bg-gradient-to-br from-[#306754] via-[#4a8c74] to-[#306754] rounded-3xl flex items-center justify-center hidden shadow-2xl shadow-[#306754]/30">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#306754]/30 to-[#4a8c74]/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#306754] animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            KEMET Automotive
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Plateforme intelligente de gestion des réseaux de recharge électrique en Afrique
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-border/50 backdrop-blur-xl bg-card/95">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold">Connexion</CardTitle>
            <CardDescription>Accédez à votre espace de gestion</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {error && (
                <Alert variant="destructive" className="rounded-xl border-red-200 dark:border-red-900/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-[#306754]/30 bg-gradient-to-br from-[#e8f5f1] to-[#f0f9f6] dark:from-[#1a3a30] dark:to-[#1a2420] text-[#306754] dark:text-[#90d4b4] rounded-xl">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="font-medium">Connexion réussie ! Redirection...</AlertDescription>
                </Alert>
              )}

              {/* Role Selection - Cards */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Type de compte</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`group relative p-5 border-2 rounded-2xl text-center transition-all ${
                      role === 'client'
                        ? 'border-[#306754] bg-gradient-to-br from-[#e8f5f1] to-[#f0f9f6] dark:from-[#1a3a30] dark:to-[#1a2420] shadow-lg shadow-[#306754]/20'
                        : 'border-border/50 hover:border-border bg-card'
                    }`}
                    disabled={isLoading || success}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        role === 'client' 
                          ? 'bg-gradient-to-br from-[#306754] to-[#4a8c74] text-white shadow-lg shadow-[#306754]/30' 
                          : 'bg-muted text-muted-foreground group-hover:bg-accent'
                      }`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Client</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Accès utilisateur</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('administrateur')}
                    className={`group relative p-5 border-2 rounded-2xl text-center transition-all ${
                      role === 'administrateur'
                        ? 'border-[#306754] bg-gradient-to-br from-[#e8f5f1] to-[#f0f9f6] dark:from-[#1a3a30] dark:to-[#1a2420] shadow-lg shadow-[#306754]/20'
                        : 'border-border/50 hover:border-border bg-card'
                    }`}
                    disabled={isLoading || success}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        role === 'administrateur' 
                          ? 'bg-gradient-to-br from-[#306754] to-[#4a8c74] text-white shadow-lg shadow-[#306754]/30' 
                          : 'bg-muted text-muted-foreground group-hover:bg-accent'
                      }`}>
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Administrateur</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Gestion complète</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={role === 'administrateur' ? 'admin@kemet-automotive.bj' : 'client@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                  className="h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || success}
                    className="h-11 pl-10 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Role Select */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Rôle utilisateur</Label>
                <Select value={role} onValueChange={setRole} disabled={isLoading || success}>
                  <SelectTrigger id="role" className="h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="administrateur">Administrateur</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#306754] to-[#4a8c74] hover:from-[#274d42] hover:to-[#3d7360] text-white font-medium rounded-xl shadow-lg shadow-[#306754]/30 transition-all"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Se connecter
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-[#306754] hover:text-[#4a8c74] font-semibold transition-colors"
                  disabled={isLoading || success}
                >
                  S'inscrire
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
            <Shield className="w-3 h-3" />
            <span>Connexion sécurisée SSL</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 KEMET Automotive - Tous droits réservés
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Plateforme certifiée pour la gestion d'infrastructures critiques
          </p>
        </div>
      </div>
    </div>
  );
}