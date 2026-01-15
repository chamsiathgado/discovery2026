import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { AlertCircle, CheckCircle2, Loader2, BatteryCharging } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginScreen({ onLogin, onSwitchToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('administrateur');
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

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        onLogin(email, password, role);
      }, 500);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-[#f0f9f6] to-white dark:from-black dark:via-[#0d1915] dark:to-black flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#306754]/10 dark:bg-[#306754]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#306754]/10 dark:bg-[#306754]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo & Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Logo KEMET avec fond gradient */}
          <motion.div
            className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-[#306754] to-[#254f42] rounded-3xl mb-6 shadow-2xl shadow-[#306754]/30 p-4"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src="/logo_kemet.png" 
              alt="KEMET Automotive" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-[#306754] to-[#254f42] bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            KEMET Automotive
          </motion.h1>
          
          <motion.p
            className="text-gray-600 dark:text-gray-400 text-sm max-w-sm mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Plateforme intelligente d'administration pour réseaux de recharge en Afrique
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription className="text-base">
                Accédez à votre tableau de bord administratif
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="destructive" className="border-red-200 dark:border-red-900">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Alert className="border-[#306754]/30 bg-[#e8f5f1] dark:bg-[#1a3a30] text-[#306754] dark:text-[#4a9d7c]">
                      <CheckCircle2 className="h-4 w-4 text-[#306754] dark:text-[#4a9d7c]" />
                      <AlertDescription className="font-medium">
                        Connexion réussie ! Redirection...
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@kemet-automotive.bj"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || success}
                    className="h-11 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:border-[#306754] dark:focus:border-[#4a9d7c] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || success}
                    className="h-11 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:border-[#306754] dark:focus:border-[#4a9d7c] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold">
                    Rôle utilisateur
                  </Label>
                  <Select value={role} onValueChange={setRole} disabled={isLoading || success}>
                    <SelectTrigger id="role" className="h-11 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrateur">Administrateur</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#306754] to-[#254f42] hover:from-[#3d8268] hover:to-[#306754] text-white font-semibold shadow-lg shadow-[#306754]/30 transition-all duration-300"
                  disabled={isLoading || success}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <BatteryCharging className="mr-2 h-5 w-5" />
                      Se connecter
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-[#306754] dark:text-[#4a9d7c] hover:text-[#254f42] dark:hover:text-[#3d8268] font-semibold transition-colors"
                    disabled={isLoading || success}
                  >
                    S'inscrire
                  </button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>© 2026 KEMET Automotive - Tous droits réservés</p>
          <p>Plateforme certifiée pour infrastructures de recharge électrique</p>
        </motion.div>
      </motion.div>
    </div>
  );
}