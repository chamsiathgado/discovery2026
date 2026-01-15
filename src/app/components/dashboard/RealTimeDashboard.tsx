import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Activity,
  TrendingUp,
  Wrench,
  AlertTriangle,
  Zap,
  Battery,
  MapPin,
} from 'lucide-react';
import { Station, hourlyUsageData, cityUsageData } from '@/app/data/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RealTimeDashboardProps {
  stations: Station[];
  selectedCity?: string;
  onCityChange: (city: string) => void;
}

export function RealTimeDashboard({ stations, selectedCity }: RealTimeDashboardProps) {
  const filteredStations = selectedCity
    ? stations.filter((s) => s.city === selectedCity)
    : stations;

  const totalBornes = filteredStations.reduce((sum, s) => sum + s.bornes.length, 0);
  const activeBornes = filteredStations.reduce(
    (sum, s) => sum + s.bornes.filter((b) => b.status === 'active').length,
    0
  );
  const maintenanceBornes = filteredStations.reduce(
    (sum, s) => sum + s.bornes.filter((b) => b.status === 'maintenance').length,
    0
  );
  const hsBornes = filteredStations.reduce(
    (sum, s) => sum + s.bornes.filter((b) => b.status === 'hors-service').length,
    0
  );
  const avgOccupancy =
    filteredStations.length > 0
      ? filteredStations.reduce((sum, s) => sum + s.occupancy, 0) / filteredStations.length
      : 0;
  const criticalStations = filteredStations.filter((s) => s.status === 'critical');
  const solarBornes = filteredStations.reduce(
    (sum, s) => sum + s.bornes.filter((b) => b.type === 'solaire').length,
    0
  );

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Taux d'occupation
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {avgOccupancy.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Moyenne globale du réseau
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Disponibilité
            </CardTitle>
            <Activity className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalBornes > 0 ? ((activeBornes / totalBornes) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {activeBornes} / {totalBornes} bornes actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              En maintenance
            </CardTitle>
            <Wrench className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {maintenanceBornes + hsBornes}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {maintenanceBornes} maintenance, {hsBornes} hors service
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Zones critiques
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {criticalStations.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Stations en état critique
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Courbe d'affluence (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Utilisation (%)"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Périodes critiques détectées:</strong> 09h-12h et 16h-18h
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Utilisation par ville
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" fill="#10b981" name="Active" />
                <Bar dataKey="maintenance" fill="#3b82f6" name="Maintenance" />
                <Bar dataKey="hors-service" fill="#ef4444" name="Hors service" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Battery className="w-4 h-4 text-yellow-600" />
              Énergie solaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {solarBornes} bornes
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {totalBornes > 0 ? ((solarBornes / totalBornes) * 100).toFixed(0) : 0}% du réseau
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              Puissance totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredStations
                .reduce((sum, s) => sum + s.bornes.reduce((bsum, b) => bsum + b.power, 0), 0)
                .toFixed(0)}{' '}
              kW
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Capacité installée
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Couverture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredStations.length} stations
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sur {new Set(filteredStations.map((s) => s.city)).size} villes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Stations List */}
      {criticalStations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Stations nécessitant une attention urgente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalStations.map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{station.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{station.city}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">Occupation: {station.occupancy}%</Badge>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {station.bornes.filter((b) => b.status === 'hors-service').length} borne(s)
                      HS
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
