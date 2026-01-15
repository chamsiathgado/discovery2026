import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, CheckCircle, AlertCircle, XCircle, Zap } from 'lucide-react';

const stations = [
  { id: 1, name: 'Station Lagos Centre', city: 'Lagos', status: 'available', lat: 25, lng: 20, bornes: 12, usage: 78 },
  { id: 2, name: 'Station Nairobi Est', city: 'Nairobi', status: 'occupied', lat: 45, lng: 55, bornes: 8, usage: 95 },
  { id: 3, name: 'Station Le Caire Nord', city: 'Le Caire', status: 'available', lat: 15, lng: 65, bornes: 15, usage: 62 },
  { id: 4, name: 'Station Johannesburg Sud', city: 'Johannesburg', status: 'maintenance', lat: 75, lng: 45, bornes: 10, usage: 0 },
  { id: 5, name: 'Station Accra Ouest', city: 'Accra', status: 'available', lat: 35, lng: 15, bornes: 6, usage: 45 },
  { id: 6, name: 'Station Abidjan', city: 'Abidjan', status: 'occupied', lat: 40, lng: 10, bornes: 9, usage: 88 },
  { id: 7, name: 'Station Casablanca', city: 'Casablanca', status: 'available', lat: 10, lng: 30, bornes: 14, usage: 71 },
  { id: 8, name: 'Station Addis-Abeba', city: 'Addis-Abeba', status: 'maintenance', lat: 30, lng: 75, bornes: 7, usage: 0 },
  { id: 9, name: 'Station Dakar', city: 'Dakar', status: 'available', lat: 28, lng: 5, bornes: 11, usage: 54 },
  { id: 10, name: 'Station Tunis', city: 'Tunis', status: 'occupied', lat: 8, lng: 45, bornes: 10, usage: 92 },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'available':
      return { color: 'bg-emerald-500', label: 'Disponible', icon: CheckCircle };
    case 'occupied':
      return { color: 'bg-blue-500', label: 'Occupée', icon: Zap };
    case 'maintenance':
      return { color: 'bg-red-500', label: 'Hors service', icon: XCircle };
    default:
      return { color: 'bg-gray-500', label: 'Inconnu', icon: AlertCircle };
  }
};

export function NetworkMap() {
  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">Carte du Réseau en Temps Réel</h2>
          <p className="text-gray-600">Visualisation géographique - Mise à jour toutes les 2 minutes via API OCPP</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <Card className="lg:col-span-2 p-6 bg-gray-50">
            <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg overflow-hidden">
              {/* Simplified Africa map background */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                <path
                  d="M30,10 Q45,8 50,15 T60,18 L65,25 Q68,35 70,40 L72,50 Q70,60 65,65 L60,70 Q55,75 50,78 L40,82 Q30,80 25,75 L20,65 Q15,55 18,45 L22,35 Q25,25 28,18 Z"
                  fill="#047857"
                  stroke="#065f46"
                  strokeWidth="0.5"
                />
              </svg>

              {/* Station markers */}
              {stations.map((station) => {
                const config = getStatusConfig(station.status);
                const Icon = config.icon;
                return (
                  <div
                    key={station.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ left: `${station.lng}%`, top: `${station.lat}%` }}
                  >
                    <div className={`w-4 h-4 ${config.color} rounded-full animate-pulse`}></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 hidden group-hover:block z-10">
                      <Card className="p-3 bg-white shadow-lg whitespace-nowrap">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-4 h-4 ${config.color.replace('bg-', 'text-')}`} />
                          <span className="font-semibold text-sm">{station.name}</span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>Bornes: {station.bornes}</p>
                          <p>Utilisation: {station.usage}%</p>
                          <Badge variant="outline" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Occupée</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Hors service</span>
              </div>
            </div>
          </Card>

          {/* Station list */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg mb-4 text-gray-900">Stations par statut</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {stations.map((station) => {
                const config = getStatusConfig(station.status);
                const Icon = config.icon;
                return (
                  <div key={station.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${config.color.replace('bg-', 'text-')}`} />
                        <span className="text-sm text-gray-900">{station.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{station.city}</span>
                      <span>{station.bornes} bornes</span>
                    </div>
                    {station.status !== 'maintenance' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Utilisation</span>
                          <span className="text-gray-900">{station.usage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              station.usage > 80 ? 'bg-red-500' : station.usage > 60 ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${station.usage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}