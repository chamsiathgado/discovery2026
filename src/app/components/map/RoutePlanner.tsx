import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { Station, mockStations } from '@/app/data/mockData';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { MapPin, Navigation, Battery, Zap, AlertTriangle } from 'lucide-react';

interface RoutePlannerProps {
  stations: Station[];
}

interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
}

export function RoutePlanner({ stations }: RoutePlannerProps) {
  const [currentLocation, setCurrentLocation] = useState<RoutePoint | null>(null);
  const [destination, setDestination] = useState<RoutePoint | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number>(80);
  const [vehicleRange, setVehicleRange] = useState<number>(300); // km
  const [chargingPreference, setChargingPreference] = useState<'fast' | 'standard'>('fast');
  const [safetyPreference, setSafetyPreference] = useState<'high' | 'medium' | 'low'>('high');
  const [route, setRoute] = useState<any>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Votre position'
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          // Fallback to default location (Cotonou center)
          setCurrentLocation({
            lat: 6.3654,
            lng: 2.4183,
            name: 'Position par défaut (Cotonou)'
          });
        }
      );
    }
  }, []);

  // Calculate safe route
  const calculateRoute = () => {
    if (!currentLocation || !destination || !mapRef.current) return;

    // Remove existing route
    if (route) {
      mapRef.current.removeControl(route);
    }

    // Calculate route with charging stops
    const waypoints = calculateOptimalRoute(currentLocation, destination, batteryLevel, vehicleRange, stations, chargingPreference, safetyPreference);

    if (waypoints.length < 2) {
      setWarnings(['Itinéraire impossible avec la batterie actuelle']);
      return;
    }

    // Create routing control
    const routingControl = L.Routing.control({
      waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: (i: number, wp: any, n: number) => {
        const icon = i === 0 ? 'start' : i === n - 1 ? 'end' : 'charging';
        return L.marker(wp.latLng, {
          icon: createCustomIcon(icon)
        });
      }
    }).addTo(mapRef.current);

    setRoute(routingControl);
    setWarnings([]);
  };

  // Helper function to create custom icons
  const createCustomIcon = (type: string) => {
    let iconUrl = '';
    switch (type) {
      case 'start':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
        break;
      case 'end':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
        break;
      case 'charging':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
        break;
    }
    return L.icon({
      iconUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Planificateur d'itinéraire intelligent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Location */}
          <div>
            <Label>Position actuelle</Label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <MapPin className="w-4 h-4" />
              <span>{currentLocation ? currentLocation.name : 'Détection en cours...'}</span>
            </div>
          </div>

          {/* Destination Input */}
          <div>
            <Label>Destination</Label>
            <Select onValueChange={(value) => {
              const coords = value.split(',');
              setDestination({
                lat: parseFloat(coords[0]),
                lng: parseFloat(coords[1]),
                name: value.split(' - ')[1] || 'Destination'
              });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une destination" />
              </SelectTrigger>
              <SelectContent>
                {stations.map(station => (
                  <SelectItem key={station.id} value={`${station.position[0]},${station.position[1]} - ${station.name}`}>
                    {station.name} ({station.city})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Niveau de batterie (%)</Label>
              <Input
                type="number"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label>Autonomie (km)</Label>
              <Input
                type="number"
                value={vehicleRange}
                onChange={(e) => setVehicleRange(parseInt(e.target.value))}
                min="50"
                max="500"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type de recharge préféré</Label>
              <Select value={chargingPreference} onValueChange={(value: 'fast' | 'standard') => setChargingPreference(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Rapide (DC)</SelectItem>
                  <SelectItem value="standard">Standard (AC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Niveau de sécurité</Label>
              <Select value={safetyPreference} onValueChange={(value: 'high' | 'medium' | 'low') => setSafetyPreference(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Élevé (évite les zones isolées)</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="low">Faible (priorité rapidité)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculateRoute} className="w-full">
            Calculer l'itinéraire
          </Button>
        </CardContent>
      </Card>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div className="h-96">
            <MapContainer
              center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [6.3654, 2.4183]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Station markers */}
              {stations.map(station => (
                <Marker key={station.id} position={station.position}>
                  <Popup>
                    <div>
                      <h3 className="font-bold">{station.name}</h3>
                      <p>{station.city}</p>
                      <p>Bornes: {station.bornes.length}</p>
                      <p>Occupation: {station.occupancy}%</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Algorithm to calculate optimal route with charging stops
function calculateOptimalRoute(
  start: RoutePoint,
  end: RoutePoint,
  batteryLevel: number,
  vehicleRange: number,
  stations: Station[],
  chargingPreference: 'fast' | 'standard',
  safetyPreference: 'high' | 'medium' | 'low'
): RoutePoint[] {
  const waypoints: RoutePoint[] = [start];

  // Calculate available range in km
  const availableRange = (batteryLevel / 100) * vehicleRange;

  // Simple distance calculation (in real implementation, use proper routing API)
  const totalDistance = calculateDistance(start, end);

  if (totalDistance > availableRange) {
    // Need charging stops
    const chargingStops = findOptimalChargingStops(start, end, availableRange, stations, chargingPreference, safetyPreference);

    waypoints.push(...chargingStops);
  }

  waypoints.push(end);

  return waypoints;
}

// Simple distance calculation (Haversine formula)
function calculateDistance(point1: RoutePoint, point2: RoutePoint): number {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find optimal charging stops
function findOptimalChargingStops(
  start: RoutePoint,
  end: RoutePoint,
  availableRange: number,
  stations: Station[],
  chargingPreference: 'fast' | 'standard',
  safetyPreference: 'high' | 'medium' | 'low'
): RoutePoint[] {
  const stops: RoutePoint[] = [];

  // Filter stations based on preference
  let filteredStations = stations.filter(station => {
    const hasPreferredType = station.bornes.some(borne =>
      chargingPreference === 'fast' ? borne.type === 'rapide' : borne.type !== 'solaire'
    );
    return hasPreferredType && station.status === 'operational';
  });

  // Sort by distance from start
  filteredStations.sort((a, b) => calculateDistance(start, { lat: a.position[0], lng: a.position[1], name: a.name }) -
    calculateDistance(start, { lat: b.position[0], lng: b.position[1], name: b.name }));

  let currentPosition = start;
  let remainingRange = availableRange;

  while (calculateDistance(currentPosition, end) > remainingRange) {
    // Find next suitable station within remaining range
    const nextStation = filteredStations.find(station => {
      const distance = calculateDistance(currentPosition, { lat: station.position[0], lng: station.position[1], name: station.name });
      return distance <= remainingRange * 0.8; // Keep 20% buffer for safety
    });

    if (!nextStation) {
      // No suitable station found - route might be risky
      break;
    }

    stops.push({
      lat: nextStation.position[0],
      lng: nextStation.position[1],
      name: nextStation.name
    });

    currentPosition = stops[stops.length - 1];
    remainingRange = availableRange; // Assume full charge at station
  }

  return stops;
}