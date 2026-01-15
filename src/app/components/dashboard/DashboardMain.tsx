import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import {
  LayoutDashboard,
  Map,
  Settings,
  Bell,
  Brain,
  LogOut,
  Zap,
  Moon,
  Sun,
  Activity,
  AlertTriangle,
  TrendingUp,
  Users,
  Navigation,
  CreditCard,
  ChevronDown,
} from 'lucide-react';
import { InteractiveMap } from '@/app/components/map/InteractiveMap';
import { StationDetailPanel } from '@/app/components/dashboard/StationDetailPanel';
import { RealTimeDashboard } from '@/app/components/dashboard/RealTimeDashboard';
import { AIRecommendations } from '@/app/components/dashboard/AIRecommendations';
import { ManagementPanel } from '@/app/components/dashboard/ManagementPanel';
import { RoutePlanner } from '@/app/components/map/RoutePlanner';
import { MobileMoneyPayment } from '@/app/components/payment/MobileMoneyPayment';
import { AdminDashboard } from '@/app/components/admin/AdminDashboard';
import { Station, mockStations } from '@/app/data/mockData';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface DashboardMainProps {
  user: {
    name: string;
    email: string;
    role: string;
    kwBalance: number;
  };
  onLogout: () => void;
}

export function DashboardMain({ user: initialUser, onLogout }: DashboardMainProps) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [stations, setStations] = useState<Station[]>(mockStations);
  const [user, setUser] = useState(initialUser);
  const { theme, setTheme } = useTheme();

  const getAvailableTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
      { id: 'map', label: 'Carte', icon: Map },
      { id: 'route', label: 'Itinéraire', icon: Navigation },
      { id: 'payment', label: 'Paiement', icon: CreditCard }
    ];

    if (user.role === 'administrateur') {
      baseTabs.push({ id: 'ai', label: 'IA', icon: Brain });
      baseTabs.push({ id: 'management', label: 'Gestion', icon: Settings });
    }

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  const totalBornes = stations.reduce((sum, s) => sum + s.bornes.length, 0);
  const activeBornes = stations.reduce(
    (sum, s) => sum + s.bornes.filter((b) => b.status === 'active').length,
    0
  );
  const maintenanceBornes = stations.reduce(
    (sum, s) => sum + s.bornes.filter((b) => b.status === 'maintenance').length,
    0
  );
  const criticalStations = stations.filter((s) => s.status === 'critical').length;
  const avgOccupancy =
    stations.reduce((sum, s) => sum + s.occupancy, 0) / stations.length;

  const handleBalanceUpdate = (newBalance: number) => {
    setUser(prev => ({ ...prev, kwBalance: newBalance }));
  };

  const handleStationUpdate = (updatedStation: Station) => {
    setStations((prev) =>
      prev.map((s) => (s.id === updatedStation.id ? updatedStation : s))
    );
    setSelectedStation(updatedStation);
  };

  const handleStationDelete = (stationId: string) => {
    setStations((prev) => prev.filter((s) => s.id !== stationId));
    setSelectedStation(null);
  };

  const handleStationAdd = (newStation: Station) => {
    setStations((prev) => [...prev, newStation]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec effet glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-border">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Branding */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <img 
                    src="/logo_kemet.png" 
                    alt="KEMET Automotive" 
                    className="w-11 h-11 object-contain transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-11 h-11 bg-gradient-to-br from-[#306754] to-[#4a8c74] rounded-2xl flex items-center justify-center hidden shadow-lg shadow-[#306754]/20">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#306754]/20 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground tracking-tight">
                    KEMET Automotive
                  </h1>
                  <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                    Réseau Intelligent Bénin
                  </p>
                </div>
              </div>
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center gap-3">
              {/* Stats compactes */}
              <div className="hidden lg:flex items-center gap-3 mr-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-accent/50 to-accent/30 rounded-xl border border-border/50 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Bornes</div>
                    <div className="text-sm font-bold text-foreground">
                      {activeBornes}<span className="text-muted-foreground">/{totalBornes}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-accent/50 to-accent/30 rounded-xl border border-border/50 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Taux</div>
                    <div className="text-sm font-bold text-foreground">
                      {avgOccupancy.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-xl border-border/50 hover:bg-accent/50 backdrop-blur-sm"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-border/50">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                    {user.role}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onLogout}
                  className="rounded-xl border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1 rounded-xl shadow-sm">
              {availableTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id} 
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {criticalStations > 0 && (
              <Badge variant="destructive" className="flex items-center gap-2 px-3 py-1 rounded-lg shadow-lg shadow-red-500/20">
                <AlertTriangle className="w-3 h-3" />
                {criticalStations} station(s) critique(s)
              </Badge>
            )}
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <RealTimeDashboard
              stations={stations}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 h-[600px] overflow-hidden border-border/50 shadow-xl">
                <InteractiveMap
                  onStationClick={setSelectedStation}
                  selectedCity={selectedCity}
                />
              </Card>
              <div className="lg:col-span-1">
                {selectedStation ? (
                  <StationDetailPanel
                    station={selectedStation}
                    onClose={() => setSelectedStation(null)}
                    onUpdate={handleStationUpdate}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center border-border/50 shadow-xl bg-gradient-to-br from-card to-accent/20">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Map className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Sélectionnez une station
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Cliquez sur un marqueur pour voir les détails
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedCity || 'all'} onValueChange={(value) => setSelectedCity(value === 'all' ? '' : value)}>
                <SelectTrigger className="w-[200px] rounded-xl border-border/50 bg-card/50 backdrop-blur-sm">
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  <SelectItem value="Cotonou">Cotonou</SelectItem>
                  <SelectItem value="Porto-Novo">Porto-Novo</SelectItem>
                  <SelectItem value="Parakou">Parakou</SelectItem>
                </SelectContent>
              </Select>
              {selectedCity && (
                <Button variant="outline" size="sm" onClick={() => setSelectedCity('')} className="rounded-xl">
                  Réinitialiser
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Route Planner Tab */}
          <TabsContent value="route" className="space-y-6">
            <RoutePlanner stations={stations} />
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <MobileMoneyPayment user={user} onBalanceUpdate={handleBalanceUpdate} />
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai">
            <AIRecommendations />
          </TabsContent>

          {/* Management Tab */}
          {user.role === 'administrateur' && (
          <TabsContent value="management">
            <AdminDashboard user={user} />
          </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}