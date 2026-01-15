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
} from 'lucide-react';
import { InteractiveMap } from '@/app/components/map/InteractiveMap';
import { StationDetailPanel } from '@/app/components/dashboard/StationDetailPanel';
import { RealTimeDashboard } from '@/app/components/dashboard/RealTimeDashboard';
import { AIRecommendations } from '@/app/components/dashboard/AIRecommendations';
import { ManagementPanel } from '@/app/components/dashboard/ManagementPanel';
import { Station, mockStations } from '@/app/data/mockData';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface DashboardMainProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

export function DashboardMain({ user, onLogout }: DashboardMainProps) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [stations, setStations] = useState<Station[]>(mockStations);
  const { theme, setTheme } = useTheme();

  // Calculate global stats
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    KEMET Platform
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Gestion Intelligente - Réseau Bénin
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Global Stats */}
              <div className="hidden lg:flex items-center gap-4 mr-4 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Bornes actives</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {activeBornes}/{totalBornes}
                    </div>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Occupation moy.</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {avgOccupancy.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <div className="flex items-center gap-3 pl-3 border-l border-gray-300 dark:border-gray-600">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <TabsList className="grid grid-cols-4 w-[500px]">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Carte
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                IA
              </TabsTrigger>
              {user.role === 'administrateur' && (
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Gestion
              </TabsTrigger>
              )}
            </TabsList>

            {criticalStations > 0 && (
              <Badge variant="destructive" className="flex items-center gap-2">
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
              <div className="lg:col-span-2 h-[600px]">
                <InteractiveMap
                  onStationClick={setSelectedStation}
                  selectedCity={selectedCity}
                />
              </div>
              <div className="lg:col-span-1">
                {selectedStation ? (
                  <StationDetailPanel
                    station={selectedStation}
                    onClose={() => setSelectedStation(null)}
                    onUpdate={handleStationUpdate}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Sélectionnez une station
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cliquez sur un marqueur pour voir les détails
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedCity || 'all'} onValueChange={(value) => setSelectedCity(value === 'all' ? '' : value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  <SelectItem value="Cotonou">Cotonou</SelectItem>
                  <SelectItem value="Porto-Novo">Porto-Novo</SelectItem>
                  <SelectItem value="Parakou">Parakou</SelectItem>
                </SelectContent>
              </Select>
              {selectedCity && (
                <Button variant="outline" size="sm" onClick={() => setSelectedCity('')}>
                  Réinitialiser
                </Button>
              )}
            </div>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai">
            <AIRecommendations />
          </TabsContent>

          {/* Management Tab */}
          {user.role === 'administrateur' && (
          <TabsContent value="management">
            <ManagementPanel
              stations={stations}
              onStationUpdate={handleStationUpdate}
              onStationDelete={handleStationDelete}
              onStationAdd={handleStationAdd}
            />
          </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}