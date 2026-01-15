import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { Station, BorneStatus, mockStations } from '@/app/data/mockData';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { MapPin, Zap, AlertTriangle, Wrench, Activity } from 'lucide-react';

// Fix for default marker icons in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  onStationClick: (station: Station) => void;
  selectedCity?: string;
}

// Component to update map view when city changes
function MapViewController({ city }: { city?: string }) {
  const map = useMap();

  useEffect(() => {
    if (city) {
      const cityCoords: Record<string, LatLngTuple> = {
        Cotonou: [6.3654, 2.4183],
        'Porto-Novo': [6.4969, 2.6289],
        Parakou: [9.3372, 2.6303],
      };

      if (cityCoords[city]) {
        map.setView(cityCoords[city], 13);
      }
    } else {
      // Default view showing all of Benin
      map.setView([7.5, 2.5], 7);
    }
  }, [city, map]);

  return null;
}

function getStatusIcon(status: BorneStatus): React.ReactNode {
  switch (status) {
    case 'active':
      return <Activity className="w-3 h-3 text-emerald-600" />;
    case 'forte-affluence':
      return <AlertTriangle className="w-3 h-3 text-orange-600" />;
    case 'hors-service':
      return <AlertTriangle className="w-3 h-3 text-red-600" />;
    case 'maintenance':
      return <Wrench className="w-3 h-3 text-blue-600" />;
  }
}

function getStatusColor(status: BorneStatus): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'forte-affluence':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'hors-service':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'maintenance':
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}

function getStatusLabel(status: BorneStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'forte-affluence':
      return 'Forte affluence';
    case 'hors-service':
      return 'Hors service';
    case 'maintenance':
      return 'Maintenance';
  }
}

// Custom marker icon based on station status
function getMarkerIcon(station: Station): Icon {
  let color = '#10b981'; // emerald-500

  if (station.status === 'critical') {
    color = '#ef4444'; // red-500
  } else if (station.status === 'degraded') {
    color = '#f59e0b'; // amber-500
  }

  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="white" cx="12.5" cy="12.5" r="6"/>
    </svg>
  `;

  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
}

export function InteractiveMap({ onStationClick, selectedCity }: InteractiveMapProps) {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const beninCenter: LatLngTuple = [7.5, 2.5];

  const filteredStations = selectedCity
    ? mockStations.filter((s) => s.city === selectedCity)
    : mockStations;

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <MapContainer
        center={beninCenter}
        zoom={7}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewController city={selectedCity} />

        {filteredStations.map((station) => (
          <Marker
            key={station.id}
            position={station.position}
            icon={getMarkerIcon(station)}
            eventHandlers={{
              mouseover: () => setHoveredStation(station.id),
              mouseout: () => setHoveredStation(null),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{station.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {station.city}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      station.status === 'operational'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : station.status === 'degraded'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }
                  >
                    {station.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bornes:</span>
                    <span className="font-semibold text-gray-900">{station.bornes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Occupation:</span>
                    <span className="font-semibold text-gray-900">{station.occupancy}%</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Bornes</p>
                  {station.bornes.slice(0, 3).map((borne) => (
                    <div
                      key={borne.id}
                      className="flex items-center justify-between text-xs py-1 px-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(borne.status)}
                        <span className="font-medium">{borne.name}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(borne.status)}`}>
                        {getStatusLabel(borne.status)}
                      </Badge>
                    </div>
                  ))}
                  {station.bornes.length > 3 && (
                    <p className="text-xs text-gray-500 text-center pt-1">
                      +{station.bornes.length - 3} autre(s)
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onStationClick(station)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Voir les détails
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}