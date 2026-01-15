import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import {
  LayoutDashboard,
  Map,
  Settings,
  Brain,
  LogOut,
  Moon,
  Sun,
  Activity,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { InteractiveMap } from '@/app/components/map/InteractiveMap';
import { StationDetailPanel } from '@/app/components/dashboard/StationDetailPanel';
import { RealTimeDashboard } from '@/app/components/dashboard/RealTimeDashboard';
import { AIRecommendations } from '@/app/components/dashboard/AIRecommendations';
import { ManagementPanel } from '@/app/components/dashboard/ManagementPanel';
import { Station, mockStations } from '@/app/data/mockData';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black">
      {/* Modern Header with Glassmorphism */}
      <motion.header
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="flex items-center gap-3">
                {/* Logo KEMET avec fond gradient */}
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-[#306754] to-[#254f42] rounded-2xl flex items-center justify-center shadow-lg shadow-[#306754]/30 p-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img 
                    src="/logo_kemet.png" 
                    alt="KEMET Automotive" 
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#306754] to-[#254f42] bg-clip-text text-transparent">
                    KEMET Automotive
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Administration · Réseau Bénin
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Global Stats Cards */}
              <motion.div
                className="hidden lg:flex items-center gap-4 mr-4 px-5 py-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e8f5f1] dark:bg-[#1a3a30] rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#306754] dark:text-[#4a9d7c]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bornes actives</div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      {activeBornes}<span className="text-gray-400">/{totalBornes}</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-px h-10 bg-gray-300 dark:bg-gray-700" />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Occupation</div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      {avgOccupancy.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Theme Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-11 h-11 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-700" />
                  )}
                </Button>
              </motion.div>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-300 dark:border-gray-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium">
                    {user.role}
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onLogout}
                    className="w-11 h-11 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-gray-200 dark:border-gray-700"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Enhanced Tab Navigation */}
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-4 w-auto bg-white/80 dark:bg-black/80 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#306754] data-[state=active]:to-[#254f42] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#306754]/30 transition-all duration-300"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="font-semibold">Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#306754] data-[state=active]:to-[#254f42] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#306754]/30 transition-all duration-300"
              >
                <Map className="w-4 h-4" />
                <span className="font-semibold">Carte</span>
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#306754] data-[state=active]:to-[#254f42] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#306754]/30 transition-all duration-300"
              >
                <Brain className="w-4 h-4" />
                <span className="font-semibold">IA</span>
              </TabsTrigger>
              {user.role === 'administrateur' && (
                <TabsTrigger
                  value="management"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#306754] data-[state=active]:to-[#254f42] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#306754]/30 transition-all duration-300"
                >
                  <Settings className="w-4 h-4" />
                  <span className="font-semibold">Gestion</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Critical Stations Alert */}
            <AnimatePresence>
              {criticalStations > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                >
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold shadow-lg"
                  >
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                    {criticalStations} station{criticalStations > 1 ? 's' : ''} critique{criticalStations > 1 ? 's' : ''}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Content with Animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-0">
                <RealTimeDashboard
                  stations={stations}
                  selectedCity={selectedCity}
                  onCityChange={setSelectedCity}
                />
              </TabsContent>

              {/* Map Tab */}
              <TabsContent value="map" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="h-[650px] overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-black/80 backdrop-blur-xl">
                      <InteractiveMap
                        onStationClick={setSelectedStation}
                        selectedCity={selectedCity}
                      />
                    </Card>
                  </div>
                  <div className="lg:col-span-1">
                    <AnimatePresence mode="wait">
                      {selectedStation ? (
                        <motion.div
                          key="detail"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="h-[650px]"
                        >
                          <StationDetailPanel
                            station={selectedStation}
                            onClose={() => setSelectedStation(null)}
                            onUpdate={handleStationUpdate}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Card className="h-[650px] flex items-center justify-center border-0 shadow-xl bg-white/80 dark:bg-black/80 backdrop-blur-xl">
                            <div className="text-center p-8">
                              <motion.div
                                animate={{
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                <Map className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
                              </motion.div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                Sélectionnez une station
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                Cliquez sur un marqueur de la carte pour voir les détails et l'état en temps réel
                              </p>
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* City Filter */}
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Select
                    value={selectedCity || 'all'}
                    onValueChange={(value) => setSelectedCity(value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className="w-[220px] h-11 rounded-xl border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
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
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCity('')}
                        className="h-11 rounded-xl border-gray-200 dark:border-gray-800"
                      >
                        Réinitialiser
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>

              {/* AI Tab */}
              <TabsContent value="ai" className="mt-0">
                <AIRecommendations />
              </TabsContent>

              {/* Management Tab */}
              {user.role === 'administrateur' && (
                <TabsContent value="management" className="mt-0">
                  <ManagementPanel
                    stations={stations}
                    onStationUpdate={handleStationUpdate}
                    onStationDelete={handleStationDelete}
                    onStationAdd={handleStationAdd}
                  />
                </TabsContent>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
}