import { useState } from 'react';
import { LoginScreen } from '@/app/components/auth/LoginScreen';
import { RegisterScreen } from '@/app/components/auth/RegisterScreen';
import { DashboardMain } from '@/app/components/dashboard/DashboardMain';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { Toaster } from '@/app/components/ui/sonner';

type Screen = 'login' | 'register' | 'dashboard';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string, password: string, role: string) => {
    setUser({ name: email.split('@')[0], email, role });
    setCurrentScreen('dashboard');
  };

  const handleRegister = (name: string, email: string, password: string, role: string) => {
    setUser({ name, email, role });
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  return (
    <ThemeProvider>
      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentScreen('register')}
        />
      )}

      {currentScreen === 'register' && (
        <RegisterScreen
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'dashboard' && user && (
        <DashboardMain user={user} onLogout={handleLogout} />
      )}
      
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}